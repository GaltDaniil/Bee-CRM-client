import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { lighten } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { useAppDispatch, useAppSelector } from 'app/store';
import { getContactByChatId, selectChatContact } from '../../store/contactsSlice';
import UserAvatar from '../../UserAvatar';
import { ChatAppContext } from '../../ChatApp';
import { selectChatById, updateOneChat } from '../../store/chatListSlice';
import { useEffect, useState } from 'react';
import {
    getContactByEmail,
    removeContact,
    updateContact,
} from '../../../contacts/store/contactSlice';

function ContactSidebar() {
    const dispatch = useAppDispatch();
    const { setContactSidebarOpen, setOrderSidebarOpen } = useContext(ChatAppContext);
    const routeParams = useParams();
    const chat_id = routeParams.id;
    const selectedChat = useAppSelector(selectChatById(chat_id));
    const { data: contact } = useAppSelector(selectChatContact);

    // Состояние для email, найденного контакта и загрузки
    const [email, setEmail] = useState('');
    const [foundContact, setFoundContact] = useState(null);
    const [isLinkButtonActive, setIsLinkButtonActive] = useState(false);

    const handleSearch = async () => {
        // запрос на сервер для поиска контакта по email
        const response = await dispatch(getContactByEmail(email));

        if (response.payload) {
            setFoundContact(response.payload);
            setIsLinkButtonActive(true);
        } else {
            setFoundContact(null);
            setIsLinkButtonActive(false);
        }
    };

    const handleLink = async () => {
        if (foundContact) {
            // запрос на сервер для связывания найденного контакта с chat_id
            const result = await dispatch(
                updateOneChat({ ...selectedChat, contact_id: foundContact.contact_id }),
            );
            console.log('смена контакта в чате result.payload', result.payload);
            if (result.payload) {
                await dispatch(
                    updateContact({
                        contact_id: foundContact.contact_id,
                        contact_photo_url: selectedChat.chat_contact.contact_photo_url,
                    }),
                );
                await dispatch(removeContact(selectedChat.contact_id));
                console.log('контакт удален');
            }
            setIsLinkButtonActive(false);
        }
    };

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
                        onClick={() => setContactSidebarOpen(false)}
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
                        Информация о контакте
                    </Typography>
                </Toolbar>
            </Box>

            <div className="flex flex-col justify-center items-center mt-32">
                <UserAvatar className="w-160 h-160 text-64" user={contact} />
                <Typography className="mt-16 text-16 font-medium">
                    {contact.contact_name}
                </Typography>

                <Typography color="text.secondary" className="mt-2 text-13">
                    {contact.contact_about}
                </Typography>
            </div>
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

                <Typography className="mt-40 text-16 font-medium">Детали</Typography>

                <div className="mt-16">
                    <Typography className="text-14 font-medium" color="text.secondary">
                        Email
                    </Typography>
                    <Typography>{contact.contact_email}</Typography>
                    {/* {contact.details.emails?.map((item, index) => (
                        <div className="flex items-center" key={index}>
                            <Typography>{item.email}</Typography>
                            {item.label && (
                                <Typography className="text-md truncate" color="text.secondary">
                                    <span className="mx-8">&bull;</span>
                                    <span className="font-medium">{item.label}</span>
                                </Typography>
                            )}
                        </div>
                    ))} */}
                </div>

                <div className="mt-16">
                    <Typography className="text-14 font-medium" color="text.secondary">
                        Номер телефона
                    </Typography>
                    <Typography>{contact.contact_phone}</Typography>

                    {/* {contact.details.phoneNumbers?.map((item, index) => (
                        <div className="flex items-center" key={index}>
                            <Typography>{item.phoneNumber}</Typography>
                            {item.label && (
                                <Typography className="text-md truncate" color="text.secondary">
                                    <span className="mx-8">&bull;</span>
                                    <span className="font-medium">{item.label}</span>
                                </Typography>
                            )}
                        </div>
                    ))} */}
                </div>

                <div className="mt-16">
                    <Typography className="text-14 font-medium" color="text.secondary">
                        Контакт с сайта
                    </Typography>
                    {selectedChat ? (
                        <Typography>
                            {selectedChat.from_url ? selectedChat.from_url : 'нет'}
                        </Typography>
                    ) : null}
                </div>
                <div className="mt-16">
                    <Typography className="text-14 font-medium" color="text.secondary">
                        Username
                    </Typography>
                    {selectedChat ? (
                        <Typography>
                            {selectedChat.messenger_username
                                ? selectedChat.messenger_username
                                : 'нет'}
                        </Typography>
                    ) : null}
                </div>
                <div>
                    {!selectedChat.chat_contact.contact_getcourse ? (
                        <div className="flex flex-col p-24">
                            <Typography className="text-14 font-medium" color="text.secondary">
                                Связать чат с контактом
                            </Typography>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            {foundContact ? (
                                <>
                                    <Typography
                                        className="text-14 font-medium"
                                        color="text.secondary"
                                    >
                                        Найденный контакт:
                                    </Typography>
                                    <div className="mb-10">{foundContact.contact_name}</div>
                                </>
                            ) : null}
                            <Button variant="contained" onClick={handleSearch} fullWidth>
                                Поиск
                            </Button>
                            {foundContact && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleLink}
                                    fullWidth
                                    disabled={!isLinkButtonActive}
                                    className="mt-16"
                                >
                                    Связать
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ContactSidebar;
