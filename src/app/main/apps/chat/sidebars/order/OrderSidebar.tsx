import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getContactByChatId, selectChatContact } from '../../store/contactsSlice';
import UserAvatar from '../../UserAvatar';
import { ChatAppContext } from '../../ChatApp';
import { selectChatById } from '../../store/chatListSlice';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ContactType } from '../../../contacts/types/ContactType';
import { Autocomplete, InputAdornment, TextField, Button } from '@mui/material';
import axios from 'axios';
import { newCardFromChat } from '../../../scrumboard/store/cardsSlice';

function OrderSidebar() {
    const dispatch = useAppDispatch();
    const { setOrderSidebarOpen } = useContext(ChatAppContext);
    const routeParams = useParams();
    const chat_id = routeParams.id;
    const selectedChat = useAppSelector(selectChatById(chat_id));
    const { data: contact } = useAppSelector(selectChatContact);

    const [orders, setOrders] = useState([]);

    type FormType = Omit<ContactType, 'contact_email' | 'contact_phone'> & {
        contact_id: string;
        contact_first_name: string;
        contact_last_name: string;
        contact_email: string;
        contact_phone: string;
        card_deal_offers: string[];
        chat_id: string;
        list_id: string;
        board_id: string;
    };

    const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
        mode: 'all',
        /* resolver: yupResolver(schema), */
    });
    const { isValid, dirtyFields, errors } = formState;

    const onSubmit = (data: FormType) => {
        if (!data.contact_email) {
            data.contact_email = contact.contact_email;
        }
        data.chat_id = chat_id;
        data.contact_id = contact.contact_id;
        data.list_id = 'new';
        data.board_id = 'QSZj8tM1PRsfs-DBZq3Ph';
        console.log('Form Data:', data);
        // Отправка данных на сервер
        dispatch(newCardFromChat(data));
        setOrderSidebarOpen(false);

        //После садмита отправляет данные в contact,
        //
    };

    const orderTypes = [
        { label: 'СТЕП-АЭРОБИКА. Тариф «Сам» - 4900 руб.', id: '100', cost: '4900' },
        {
            label: 'ИНСТРУКТОР ПО СИЛОВОМУ ТРЕНИНГУ. Тариф «Сам» — 2 490 руб.',
            id: '101',
            cost: '2490',
        },
        {
            label: 'ИНСТРУКТОР ПО СИЛОВОМУ ТРЕНИНГУ. Тариф «С куратором» — 4 490 руб.',
            id: '102',
            cost: '4490',
        },
        { label: 'МИОФАСЦИАЛЬНЫЙ РЕЛИЗ. Тариф «Сам» — 1 990 руб.', id: '103', cost: '1990' },
        {
            label: 'МИОФАСЦИАЛЬНЫЙ РЕЛИЗ. Тариф «C куратором» — 3 990 руб.',
            id: '104',
            cost: '3990',
        },

        { label: 'МЕТОДИСТ ТП. Тариф «Сам» — 2 990 руб.', id: '105', cost: '3990' },
        { label: 'МЕТОДИСТ ТП. Тариф «С куратором» — 4 490 руб.', id: '106', cost: '4490' },

        { label: 'МАСТЕР ЖЕНСКОГО ФИТНЕСА. Тариф «Сам» — 2 490 руб.', id: '107', cost: '2490' },
        {
            label: 'МАСТЕР ЖЕНСКОГО ФИТНЕСА. Тариф «С куратором» — 4 490 руб.',
            id: '108',
            cost: '4990',
        },

        { label: 'ИНСТРУКТОР ПО СТРЕТЧИНГУ. Тариф «Сам» — 2 990 руб.', id: '109', cost: '2990' },
        { label: 'ИНСТРУКТОР ПО СТРЕТЧИНГУ. Тариф «Сам» — 4 990 руб.', id: '110', cost: '4990' },

        { label: 'СБОРНИК ГАЙДОВ — 1 990 руб.', id: '111', cost: '1990' },

        { label: 'ВСЕ О ТЕЛЕ И ДВИЖЕНИИ. Тариф «Сам» — 2 990 руб.', id: '112', cost: '2990' },
        {
            label: 'ВСЕ О ТЕЛЕ И ДВИЖЕНИИ. Тариф «С куратором» — 4 990 руб.',
            id: '113',
            cost: '4990',
        },

        {
            label: 'НУТРИЦИОЛОГ. Тариф «Самостоятельный» — 2 990 руб.',
            id: '114',
            cost: '2990',
        },
        {
            label: 'НУТРИЦИОЛОГ. Тариф «С куратором» — 4 990 руб.',
            id: '115',
            cost: '4990',
        },
        {
            label: 'НУТРИЦИОЛОГ. Тариф «VIP» — 11 990 руб.',
            id: '116',
            cost: '11990',
        },
        { label: 'ИНСТРУКТОР ТЗ. Тариф «Сам» — 8 390 руб.', id: '117', cost: '8390' },
        { label: 'ИНСТРУКТОР ТЗ. Тариф «С куратором» — 12 090 руб.', id: '118', cost: '12090' },

        { label: 'ЙОГА СЕРИАЛ от Анны Queen. Лайт — 1 990 руб.', id: '119', cost: '1990' },
        { label: 'ЙОГА СЕРИАЛ от Анны Queen. Полный курс — 4 990 руб.', id: '120', cost: '4990' },

        { label: 'ОНЛАЙН-ТРЕНЕР. Тариф «Сам» — 3 900 руб.', id: '121', cost: '3900' },
        { label: 'ОНЛАЙН-ТРЕНЕР. Тариф «Блогер» — 5 900 руб.', id: '122', cost: '5900' },

        /* { label: 'Сборник курсов — 19 990 руб.',
        id: '123123123',
        cost: '115'},
        {
            label: 'СПОРТИВНОЕ ТЕЛО. Тариф «ЛАЙТ». Без обратной связи — 3 900 руб.',
            id: '123123123',
            cost: '115'
        }, */

        // Добавьте другие типы заказов здесь
    ];

    /* function onSubmit(data: ContactType) {
        if (routeParams.id === 'new') {
            dispatch(addContact(data)).then((action) => {
                const payload = action.payload as ContactType;
                navigate(`/apps/contacts/${payload.contact_id}`);
            });
        } else {
            dispatch(updateContact(data));
        }
    } */

    useEffect(() => {
        if (selectedChat) {
            dispatch(getContactByChatId(selectedChat.contact_id));
        }
    }, [selectedChat]);

    if (!contact) {
        return null;
    }

    return (
        <div className="flex flex-col flex-auto h-full">
            <Box
                className="border-b-1"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <Toolbar className="flex items-center px-4">
                    <IconButton
                        onClick={() => setOrderSidebarOpen(false)}
                        color="inherit"
                        size="large"
                    >
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                    <Typography
                        className="px-4 font-medium text-16"
                        color="inherit"
                        variant="subtitle1"
                    >
                        Создать заказ
                    </Typography>
                </Toolbar>
            </Box>

            {/* <div className="flex flex-col justify-center items-center mt-32">
                <UserAvatar className="w-160 h-160 text-64" user={contact} />
                <Typography className="mt-16 text-16 font-medium">
                    {contact.contact_name}
                </Typography>

                <Typography color="text.secondary" className="mt-2 text-13">
                    {contact.contact_about}
                </Typography>
            </div> */}
            <div className="w-full p-24">
                {/* {contact.attachments?.media && (
                    <>
                        <Typography className="mt-16 text-16 font-medium">Media</Typography>
                        <div className="grid grid-cols-4 gap-4 mt-16">
                            {contact.attachments?.media.map((url, index) => (
                                <img
                                    key={index}
                                    className="h-80 rounded object-cover"
                                    src={url}
                                    alt=""
                                />
                            ))}
                        </div>
                    </>
                )} */}
                <Controller
                    control={control}
                    name="card_deal_offers"
                    render={({ field }) => (
                        //@ts-ignore
                        <Autocomplete
                            {...field}
                            multiple
                            options={orderTypes}
                            getOptionLabel={(option) => option.label}
                            onChange={(_, value) => field.onChange(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Заказ"
                                    variant="outlined"
                                    required
                                    //error={!!errors.contact_order}
                                    /* helperText={errors?.contact_order?.message}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-solid:briefcase
                                                </FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }} */
                                />
                            )}
                        />
                    )}
                />
                {!contact.contact_email ? (
                    <>
                        <Controller
                            control={control}
                            name="contact_first_name"
                            render={({ field }) => (
                                <TextField
                                    className="mt-32"
                                    {...field}
                                    label="Имя"
                                    placeholder="Имя"
                                    id="first_name"
                                    error={!!errors.contact_name}
                                    helperText={errors?.contact_name?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-solid:user-circle
                                                </FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="contact_last_name"
                            render={({ field }) => (
                                <TextField
                                    className="mt-32"
                                    {...field}
                                    label="Фамилия"
                                    placeholder="Фамилия"
                                    id="last_name"
                                    error={!!errors.contact_name}
                                    helperText={errors?.contact_name?.message}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-solid:user-circle
                                                </FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="contact_phone"
                            render={({ field }) => (
                                <TextField
                                    className="mt-32"
                                    {...field}
                                    label="Телефон"
                                    placeholder="Телефон"
                                    id="phone"
                                    error={!!errors.contact_phone}
                                    helperText={errors?.contact_phone?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-solid:phone
                                                </FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="contact_email"
                            render={({ field }) => (
                                <TextField
                                    className="mt-32"
                                    {...field}
                                    label="Почта"
                                    placeholder="Почта"
                                    id="email"
                                    error={!!errors.contact_email}
                                    helperText={errors?.contact_email?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-solid:mail
                                                </FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </>
                ) : null}
                <Button
                    className="mt-32"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                >
                    Создать
                </Button>
            </div>
        </div>
    );
}

export default OrderSidebar;
