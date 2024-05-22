import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Box from '@mui/material/Box';
import { useAppSelector } from 'app/store';
import { selectMemberById } from '../../../../store/membersSlice';
import { CommentType } from '../../../../types/CommentType';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import ru from 'date-fns/locale/ru';

type CardActivityProps = {
    item: CommentType;
};

/**
 * The card activity component.
 */
function CardActivity(props: CardActivityProps) {
    console.log('отрисовка началась коммента');
    const { item } = props;

    const user = useSelector(selectUser);
    const formateTime = (time) => {
        const dateObject = new Date(time);
        return Math.floor(dateObject.getTime());
    };

    switch (item.comment_type) {
        case 'comment': {
            return (
                <ListItem dense className="px-0">
                    <Avatar
                        alt={user?.data.user_name}
                        src={`https://beechat.ru/${user.data.user_photo_url}`}
                        className="w-32 h-32"
                    />
                    <Box
                        className="flex flex-col mx-16 p-12"
                        sx={{
                            borderRadius: '5px 20px 20px 5px',
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <div className="flex items-center">
                            <Typography>{user?.data.user_name}</Typography>
                            <Typography className="mx-8 text-12" color="text.secondary">
                                {formatDistanceToNow(formateTime(item.createdAt), {
                                    addSuffix: true,
                                    locale: ru,
                                })}
                            </Typography>
                        </div>
                        <Typography>{item.comment_message}</Typography>
                    </Box>
                </ListItem>
            );
        }
        case 'attachment': {
            return (
                <ListItem dense className="px-0">
                    <Avatar
                        alt={user?.data.user_name}
                        src={`https://beechat.ru/${user.data.user_photo_url}`}
                        className="w-32 h-32"
                    />
                    <div className="flex items-center mx-16">
                        <Typography>{user?.data.user_name},</Typography>
                        <Typography className="mx-8">{item.comment_message}</Typography>
                        <Typography className="text-12" color="text.secondary">
                            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </Typography>
                    </div>
                </ListItem>
            );
        }
        default: {
            return null;
        }
    }
}

export default CardActivity;
