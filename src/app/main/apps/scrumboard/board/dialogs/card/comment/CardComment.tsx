import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectMemberById } from '../../../../store/membersSlice';
import { CommentType } from '../../../../types/CommentType';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { UserType } from 'app/store/user';
import axios from 'axios';
import { createComment, selectComment } from '../../../../store/commentsSlice';

type FormType = {
    comment_message: CommentType['comment_message'];
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    comment_message: yup.string().required('You must enter a comment'),
});

const defaultValues = {
    user_id: 'baa88231-0ee6-4028-96d5-7f187e0f4cd5',
    comment_message: '',
};

type CardCommentProps = {
    onCommentAdd: (comment: CommentType) => void;
    card_id: string;
};

/**
 * The card comment component.
 */
function CardComment(props: CardCommentProps) {
    const { onCommentAdd, card_id } = props;
    const dispatch = useAppDispatch();
    const comment = useAppSelector(selectComment);

    /* const user = useAppSelector(selectMemberById(defaultValues.idMember)); */
    const user = useSelector(selectUser);

    const { control, formState, handleSubmit, reset } = useForm<FormType>({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    async function onSubmit(data: FormType) {
        console.log('нажал на кнопку коммента');
        console.log(data);
        const body = {
            comment_id: new Date().getTime().toString(),
            user_id: user.user_id,
            comment_message: data.comment_message,
            comment_type: 'comment',
            createdAt: new Date().getTime(),
        };

        onCommentAdd(body);
        reset(defaultValues);
    }

    if (!user) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex -mx-8">
            <Avatar
                className="w-32 h-32 mx-8"
                alt={user.data.user_name}
                src={`https://beechat.ru/${user.data.user_photo_url}`}
            />
            <div className="flex flex-col items-start flex-1 mx-8">
                <Controller
                    name="comment_message"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            className="flex flex-1"
                            fullWidth
                            error={!!errors.comment_message}
                            helperText={errors?.comment_message?.message}
                            rows={3}
                            variant="outlined"
                            label="Комментарий"
                            placeholder="Напишите комментарий..."
                        />
                    )}
                />

                <Button
                    className="mt-16"
                    aria-label="save"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="small"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                >
                    Сохранить
                </Button>
            </div>
        </form>
    );
}

export default CardComment;
