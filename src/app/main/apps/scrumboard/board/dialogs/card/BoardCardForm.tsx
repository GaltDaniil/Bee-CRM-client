import { useDebounce } from '@fuse/hooks';
import { useState } from 'react';
import _ from '@lodash';
import { motion } from 'framer-motion';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import format from 'date-fns/format';
import { Controller, useForm } from 'react-hook-form';
import { SyntheticEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { closeCardDialog, removeCard, selectCardData, updateCard } from '../../../store/cardSlice';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import { selectListById } from '../../../store/listsSlice';
import { selectLabels } from '../../../store/labelsSlice';
import { selectBoard } from '../../../store/boardSlice';
import { selectMembers } from '../../../store/membersSlice';
import DueMenu from './toolbar/DueMenu';
import LabelsMenu from './toolbar/LabelsMenu';
import MembersMenu from './toolbar/MembersMenu';
import CheckListMenu from './toolbar/CheckListMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import { CardType } from '../../../types/CardType';
import { LabelType, LabelsType } from '../../../types/LabelType';
import { MemberType, MembersType } from '../../../types/MemberType';
import { ChecklistsType } from '../../../types/ChecklistType';
import { CommentsType } from '../../../types/CommentType';
import { getContact, selectContact } from 'src/app/main/apps/contacts/store/contactSlice';
import { ContactType } from 'src/app/main/apps/contacts/types/ContactType';
import { selectUsers } from 'app/store/user/userListSlice';
import UserType from 'app/store/user/UserType';
import { UserListType } from 'app/store/user/UserListType';
import { Card } from '@mui/material';

/**
 * The board card form component.
 */
function BoardCardForm() {
    const dispatch = useAppDispatch();
    const { data: board } = useAppSelector(selectBoard);
    const labels = useAppSelector(selectLabels);
    const members = useAppSelector(selectMembers);
    const users = useAppSelector(selectUsers);
    const card = useAppSelector(selectCardData) as CardType;
    const list = useAppSelector(selectListById(card?.list_id));

    const { register, watch, control, setValue } = useForm<CardType>({
        mode: 'onChange',
        defaultValues: card,
    });
    const cardForm = watch();

    const [isFiles, setFiles] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isCopyUser, setIsCopyUser] = useState(false);
    const [isCopyDeal, setIsCopyDeal] = useState(false);
    const [isCopyPay, setIsCopyPay] = useState(false);

    const updateCardData = useDebounce((newCard: CardType) => {
        dispatch(updateCard(newCard));
    }, 600);
    useEffect(() => {
        console.log('запустился useEffect на фронте');
        if (!card) {
            return;
        }
        console.log('card', card);
        console.log('cardForm', cardForm);

        if (!_.isEqual(card, cardForm)) {
            console.log('запустился updateCardData(cardForm)');
            updateCardData(cardForm);
        }
        if (isFiles) {
            handleUpload(isFiles);
        }
    }, [card, cardForm, updateCardData]);

    useEffect(() => {
        register('card_attachmentCoverId');
    }, [register]);

    if (!card && !board) {
        return null;
    }

    const statusColor = (status) => {
        if (status === 'Новый') {
            return 'bg-orange-300';
        } else if (status === 'В работе') {
            return 'bg-blue-400';
        } else if (status === 'Завершен') {
            return 'bg-green-500';
        } else if (status === 'Отменен') {
            return 'bg-grey-500';
        } else {
            return 'bg-black-500';
        }
    };

    const callbackHandler = async () => {
        console.log('Пошел звонок');
        setIsCalling(true);
        await fetch(
            `https://beechat.ru/api/integration/novofon/callback?from=${100}&to=${
                card.contact.contact_phone
            }&sip=${100}`,
            {
                method: 'GET',
            },
        );
        setIsCalling(false);
    };

    const handleFileChange = (e) => {
        console.log('запустился handleFileChange');
        const selectedFile = e.target.files;
        setFiles(selectedFile);
    };

    const handleUpload = async (uploadFile) => {
        console.log('запустился handleUpload');
        // Здесь вы можете написать логику для загрузки файла на сервер
        if (uploadFile && cardForm.attachments.length < 1) {
            console.log(uploadFile);
            const formData = new FormData();
            formData.append('file', uploadFile[0]);
            console.log('Сформированная formData', formData);
            try {
                const response = await fetch(
                    `https://beechat.ru/api/scrumboard/boards/${card.board_id}/cards/${card.card_id}/attachments/add`,
                    {
                        method: 'POST',
                        body: formData,
                        /* headers: {
                            'Content-Type': 'multipart/form-data; charset=windows-1251', // Устанавливаем заголовок с кодировкой
                        }, */
                    },
                );
                const data = await response.json();
                console.log('File uploaded:', data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleDeleteAttachment = async (attachment_id) => {
        const response = await fetch(
            `https://beechat.ru/api/scrumboard/boards/${card.board_id}/cards/${card.card_id}/attachments/delete/${attachment_id}`,
            {
                method: 'DELETE',
            },
        );
        setValue(
            'attachments',
            _.reject(cardForm.attachments, {
                attachment_id: attachment_id,
            }),
        );
    };

    const copyButton = (type, text) => {
        navigator.clipboard.writeText(text);
        if (type === 'user') {
            setIsCopyUser(true);
            setIsCopyDeal(false);
            setIsCopyPay(false);
        } else if (type === 'deal') {
            setIsCopyUser(false);
            setIsCopyDeal(true);
            setIsCopyPay(false);
        } else if (type === 'pay') {
            setIsCopyUser(false);
            setIsCopyDeal(false);
            setIsCopyPay(true);
        }
    };

    return (
        <DialogContent className="flex flex-col sm:flex-row p-8">
            <div className="flex flex-auto flex-col py-16 px-0 sm:px-16">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center mb-24">
                    <div className="mb-16 sm:mb-0 flex items-center">
                        <Typography>{board.board_title}</Typography>

                        <FuseSvgIcon size={20}>heroicons-outline:chevron-right</FuseSvgIcon>

                        <Typography>{list && list.list_title}</Typography>
                    </div>

                    {/* {cardForm.dueDate && (
                        <DateTimePicker
                            value={new Date(format(fromUnixTime(cardForm.dueDate), 'Pp'))}
                            format="Pp"
                            onChange={(val) => setValue('dueDate', getUnixTime(val))}
                            className="w-full sm:w-auto"
                            slotProps={{
                                textField: {
                                    label: 'Due date',
                                    placeholder: 'Choose a due date',
                                    InputLabelProps: {
                                        shrink: true,
                                    },
                                    fullWidth: true,
                                    variant: 'outlined',
                                },
                            }}
                        />
                    )} */}
                </div>

                {/* <div className="flex items-center mb-24">
                    <Controller
                        name="card_title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Title"
                                type="text"
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {card?.card_subscribed && (
                                                <FuseSvgIcon size={20} color="action">
                                                    heroicons-outline:eye
                                                </FuseSvgIcon>
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </div> */}

                <div className={`w-150 p-10 rounded-lg flex items-center`}>
                    {card ? (
                        <div
                            className={`${statusColor(
                                card.card_deal_status,
                            )} pt-4 pb-4 pl-10 pr-10 rounded-lg text-white`}
                        >
                            {card.card_deal_status}
                        </div>
                    ) : null}
                </div>
                <div className="flex-1 mb-24 mx-8 ">
                    <div className="opacity-60">Название заказа</div>
                    <div>
                        <Typography className=" text-16 ">
                            {card ? card.card_deal_title : null}
                        </Typography>
                    </div>
                </div>
                <div className="flex-1 mb-0 mx-8 ">
                    <div className="opacity-60">Данные по заказу</div>
                </div>

                <div className="mx-8">
                    <div className="flex items-center mt-12 mb-12">
                        <FuseSvgIcon className="mr-5" size={20}>
                            heroicons-outline:user
                        </FuseSvgIcon>
                        {card && card.contact ? card.contact.contact_name : null}
                    </div>
                    <div className="flex items-center mt-12 mb-12">
                        <FuseSvgIcon className="mr-5" size={20}>
                            heroicons-outline:mail
                        </FuseSvgIcon>
                        {card && card.contact ? card.contact.contact_email : null}
                    </div>
                    <div className="flex items-center mt-12 mb-12">
                        <FuseSvgIcon className="mr-5" size={20}>
                            heroicons-outline:phone
                        </FuseSvgIcon>
                        {card && card.contact ? card.contact.contact_phone : null}
                        {isCalling ? (
                            <FuseSvgIcon
                                className="ml-10 bg-grey p-2 rounded-4 text-white"
                                size={20}
                            >
                                heroicons-outline:phone
                            </FuseSvgIcon>
                        ) : (
                            <FuseSvgIcon
                                onClick={() => callbackHandler()}
                                className="ml-10 bg-green p-2 rounded-4 text-white"
                                size={20}
                            >
                                heroicons-outline:phone
                            </FuseSvgIcon>
                        )}
                    </div>
                    {card && card.card_client_url ? (
                        <div className="flex items-center mt-16 mb-12">
                            <FuseSvgIcon className="mr-5" size={20}>
                                heroicons-outline:link
                            </FuseSvgIcon>
                            <a href={card.card_client_url} target="_blank">
                                Ссылка на пользователя
                            </a>

                            <FuseSvgIcon
                                onClick={() => copyButton('user', card.card_client_url)}
                                className={`ml-10 ${
                                    !isCopyUser ? 'bg-blue' : 'bg-grey'
                                } p-3 rounded-4 text-white`}
                                size={24}
                            >
                                heroicons-outline:document-duplicate
                            </FuseSvgIcon>
                        </div>
                    ) : null}
                    {card && card.card_deal_url ? (
                        <div className="flex items-center mt-16 mb-12">
                            <FuseSvgIcon className="mr-5" size={20}>
                                heroicons-outline:link
                            </FuseSvgIcon>
                            <a href={card.card_deal_url} target="_blank">
                                Ссылка на заказ
                            </a>

                            <FuseSvgIcon
                                onClick={() => copyButton('deal', card.card_deal_url)}
                                className={`ml-10 ${
                                    !isCopyDeal ? 'bg-blue' : 'bg-grey'
                                } p-3 rounded-4 text-white`}
                                size={24}
                            >
                                heroicons-outline:document-duplicate
                            </FuseSvgIcon>
                        </div>
                    ) : null}
                    {card && card.card_deal_pay_url ? (
                        <div className="flex items-center mb-32 mt-16 ">
                            <FuseSvgIcon className="mr-5" size={20}>
                                heroicons-outline:link
                            </FuseSvgIcon>
                            <a href={card.card_deal_pay_url} target="_blank">
                                Ссылка на оплату
                            </a>
                            <FuseSvgIcon
                                onClick={() => copyButton('pay', card.card_deal_pay_url)}
                                className={`ml-10 ${
                                    !isCopyPay ? 'bg-blue' : 'bg-grey'
                                } p-3 rounded-4 text-white`}
                                size={24}
                            >
                                heroicons-outline:document-duplicate
                            </FuseSvgIcon>
                        </div>
                    ) : null}

                    {/* <div className="w-full mb-20 mt-14">
                        <Controller
                            name="card_deal_description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Заметки"
                                    multiline
                                    rows="4"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div> */}

                    {/* <Autocomplete
                            className="mt-8 mb-16"
                            multiple
                            freeSolo
                            options={labels}
                            getOptionLabel={(option: string | LabelType) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                return option?.title;
                            }}
                            value={
                                cardForm.card_labels.map((id) =>
                                    _.find(labels, { id }),
                                ) as LabelsType
                            }
                            onChange={(
                                event: SyntheticEvent<Element, Event>,
                                value: (string | LabelType)[],
                            ) => {
                                const ids = value
                                    .filter((item): item is LabelType => typeof item !== 'string')
                                    .map((item) => item.id);
                                setValue('card_labels', ids);
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                    return (
                                        <Chip
                                            label={
                                                typeof option === 'string' ? option : option.title
                                            }
                                            {...getTagProps({ index })}
                                            className="m-3"
                                        />
                                    );
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select multiple Labels"
                                    label="Labels"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        /> */}
                </div>

                {cardForm.memberIds && cardForm.memberIds.length > 0 && (
                    <div className="flex-1 mb-24 mx-8">
                        <div className="flex items-center mt-16 mb-12">
                            <FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
                            <Typography className="font-semibold text-16 mx-8">Менеджер</Typography>
                        </div>
                        <Autocomplete
                            className="mt-8 mb-16"
                            multiple
                            freeSolo
                            options={users}
                            getOptionLabel={(member: string | UserType) => {
                                return typeof member === 'string' ? member : member?.data.user_name;
                            }}
                            value={
                                cardForm.memberIds.map((user_id) =>
                                    _.find(users, { user_id }),
                                ) as UserListType
                            }
                            onChange={(
                                event: SyntheticEvent<Element, Event>,
                                value: (string | UserType)[],
                            ) => {
                                const ids = value
                                    .filter((item): item is UserType => typeof item !== 'string')
                                    .map((item) => item.user_id);
                                setValue('memberIds', ids);
                            }}
                            renderTags={(value, getTagProps) => {
                                return value.map((option, index) => {
                                    if (typeof option === 'string') {
                                        return <span />;
                                    }
                                    return (
                                        <Chip
                                            label={option.data.user_name}
                                            {...getTagProps({ index })}
                                            className={clsx('m-3' /* option?.class */)}
                                            avatar={
                                                <Tooltip title={option.data.user_name}>
                                                    <Avatar
                                                        src={`https://beechat.ru/${option.data.user_photo_url}`}
                                                    />
                                                </Tooltip>
                                            }
                                        />
                                    );
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Выбрать менеджера"
                                    label="Менеджеры"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        />
                    </div>
                )}

                {cardForm.attachments && cardForm.attachments.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center mt-16 mb-12">
                            <FuseSvgIcon size={20}>heroicons-outline:paper-clip</FuseSvgIcon>
                            <Typography className="font-semibold text-16 mx-8">
                                Attachments
                            </Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap -mx-16">
                            {cardForm.attachments.map((item) => (
                                <CardAttachment
                                    item={item}
                                    card={cardForm}
                                    /* makeCover={() => {
                                        setValue('attachmentCoverId', item.attachment_id);
                                    }}
                                    removeCover={() => {
                                        setValue('attachmentCoverId', '');
                                    }} */
                                    removeAttachment={() => {
                                        handleDeleteAttachment(item.attachment_id);
                                        /* setValue(
                                            'attachments',
                                            _.reject(cardForm.attachments, {
                                                attachment_id: item.attachment_id,
                                            }),
                                        ); */
                                    }}
                                    key={item.attachment_id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* {cardForm.card_checklists &&
                    cardForm.card_checklists.map((checklist, index) => (
                        <CardChecklist
                            key={checklist.id}
                            checklist={checklist}
                            index={index}
                            onCheckListChange={(item, itemIndex) => {
                                setValue(
                                    'card_checklists',
                                    _.setIn(
                                        cardForm.card_checklists,
                                        `[${itemIndex}]`,
                                        item,
                                    ) as ChecklistsType,
                                );
                            }}
                            onRemoveCheckList={() => {
                                setValue(
                                    'card_checklists',
                                    _.reject(cardForm.card_checklists, { id: checklist.id }),
                                );
                            }}
                        />
                    ))} */}

                {card ? (
                    <div className="mb-24">
                        <div className="flex items-center mt-16 mb-12">
                            <FuseSvgIcon size={20}>heroicons-outline:chat-alt</FuseSvgIcon>
                            <Typography className="font-semibold text-16 mx-8">
                                Комментарии
                            </Typography>
                        </div>
                        <div>
                            <CardComment
                                onCommentAdd={(comment) =>
                                    setValue('card_checklists', [
                                        comment,
                                        ...cardForm.card_checklists,
                                    ] as CommentsType)
                                }
                                card_id={card.card_id}
                            />
                        </div>
                    </div>
                ) : null}

                <Controller
                    name="card_checklists"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { value } }) => (
                        <div>
                            {value.length > 0 && (
                                <div className="mb-24">
                                    <div className="flex items-center mt-16">
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:clipboard-list
                                        </FuseSvgIcon>
                                        <Typography className="font-semibold text-16 mx-8">
                                            Activity
                                        </Typography>
                                    </div>
                                    <List>
                                        {value.map((item, index) => (
                                            <CardActivity item={item} key={index} />
                                        ))}
                                    </List>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className="flex order-first sm:order-last items-start sticky top-0">
                <Box
                    className="flex flex-row sm:flex-col items-center sm:py-8 rounded-12 w-full"
                    sx={{ backgroundColor: 'background.default' }}
                >
                    <IconButton
                        className="order-last sm:order-first"
                        color="inherit"
                        onClick={() => dispatch(closeCardDialog())}
                        size="large"
                    >
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                    <div className="flex flex-row items-center sm:items-start sm:flex-col flex-1">
                        {/* <Controller
                            name="dueDate"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <DueMenu
                                    onDueChange={onChange}
                                    onRemoveDue={() => onChange(null)}
                                    dueDate={value}
                                />
                            )}
                        /> */}

                        {/* <Controller
                            name="card_labels"
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value } }) => (
                                <LabelsMenu
                                    onToggleLabel={(labelId) => onChange(_.xor(value, [labelId]))}
                                    labels={value}
                                />
                            )}
                        /> */}

                        <Controller
                            name="memberIds"
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value } }) => (
                                <MembersMenu
                                    onToggleMember={(memberId) =>
                                        onChange(_.xor(value, [memberId]))
                                    }
                                    memberIds={value}
                                />
                            )}
                        />

                        <Controller
                            name="attachments"
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value } }) => (
                                <div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            handleFileChange(e);
                                            //onChange(e.target.files);
                                        }}
                                    />
                                    <IconButton
                                        size="large"
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        <FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>
                                    </IconButton>
                                    <button onClick={handleUpload}></button>
                                </div>
                            )}
                        />

                        <OptionsMenu onRemoveCard={() => dispatch(removeCard())} />
                    </div>
                </Box>
            </div>
        </DialogContent>
    );
}
export default BoardCardForm;
