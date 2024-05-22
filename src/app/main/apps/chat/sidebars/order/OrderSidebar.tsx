import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getContactByChatId, selectChatContact } from '../../store/contactsSlice';
import UserAvatar from '../../UserAvatar';
import { ChatAppContext } from '../../ChatApp';
import { selectChatById } from '../../store/chatListSlice';
import { useEffect } from 'react';

function OrderSidebar() {
    const dispatch = useAppDispatch();
    const { setOrderSidebarOpen } = useContext(ChatAppContext);
    const routeParams = useParams();
    const chat_id = routeParams.id;
    const selectedChat = useAppSelector(selectChatById(chat_id));
    const { data: contact } = useAppSelector(selectChatContact);

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
            </div>
        </div>
    );
}

export default OrderSidebar;
