import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
    addNewMessage,
    getMessages,
    selectMessages,
    sendMessage,
} from '../../apps/chat/store/chatMessagesSlice';

import { selectUser } from 'app/store/user/userSlice';
import UserAvatar from '../../apps/chat/UserAvatar';
import { ChatAppContext } from '../../apps/chat/ChatApp';
import { ChatMessagesType, ChatMessageType } from '../../apps/chat/types/ChatMessageType';
import Error404Page from '../../404/Error404Page';

import {
    selectChatById,
    getChatList,
    getChatListPart,
    readChatMessages,
    updateOneChat,
    getChat,
} from '../../apps/chat/store/chatListSlice';
import ru from 'date-fns/locale/ru';
import { format } from 'date-fns';
import socket from 'src/app/socket';
import CardAttachment from '../../apps/chat/attachment/ChatAttachment';
import FuseLoading from '@fuse/core/FuseLoading';
import { border, borderRadius } from '@mui/system';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
    getContact,
    getContactByEmail,
    newContact,
    removeContact,
} from '../../apps/contacts/store/contactSlice';
import { ContactType } from '../../apps/contacts/types/ContactType';
import { ChatListItemType } from '../../apps/chat/types/ChatListItemType';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import { addChatToContact } from '../store/getcourseSlice';

const StyledMessageRow = styled('div')(({ theme }) => ({
    '&.contact': {
        '& .bubble': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.contrastText,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            '& .time': {
                marginLeft: 12,
            },
        },
        '&.first-of-group': {
            '& .bubble': {
                borderTopLeftRadius: 20,
            },
        },
        '&.last-of-group': {
            '& .bubble': {
                borderBottomLeftRadius: 20,
            },
        },
    },
    '&.me': {
        paddingLeft: 40,

        '& .bubble': {
            marginLeft: 'auto',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            '& .time': {
                justifyContent: 'flex-end',
                right: 0,
                marginRight: 12,
            },
        },
        '&.first-of-group': {
            '& .bubble': {
                borderTopRightRadius: 20,
            },
        },

        '&.last-of-group': {
            '& .bubble': {
                borderBottomRightRadius: 20,
            },
        },
    },
    '&.contact + .me, &.me + .contact': {
        paddingTop: 20,
        marginTop: 20,
    },
    '&.first-of-group': {
        '& .bubble': {
            borderTopLeftRadius: 20,
            paddingTop: 13,
        },
    },
    '&.last-of-group': {
        '& .bubble': {
            borderBottomLeftRadius: 20,
            paddingBottom: 13,
            '& .time': {
                display: 'flex',
            },
        },
    },
}));

type ChatPropsType = {
    className?: string;
};

/**
 * The Chat App.
 */
function ContactChatPage(props: ChatPropsType) {
    const { className } = props;
    const { setMainSidebarOpen, setContactSidebarOpen, setOrderSidebarOpen } =
        useContext(ChatAppContext);
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessages);
    const user = useAppSelector(selectUser);
    const routeParams = useParams();
    const chatRef = useRef<HTMLDivElement>(null);
    const [message_value, setMessageValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [login, setIsLogin] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [activeChat, setActiveChat] = useState<ChatListItemType>();
    const [contact, setContact] = useState<ContactType>();
    const [chatId, setChatId] = useState('');
    const [error, setError] = useState('');

    const [alignment, setAlignment] = useState<ChatListItemType>();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const phone = params.get('phone');
        const email = params.get('email');
        const name = params.get('name');
        const link = params.get('link');
        const messenger_id = params.get('messenger_id');

        if (phone) setPhone(phone);
        if (email) setEmail(email);
        if (name) setName(name);
        if (link) setLink(link);
    }, []);

    useEffect(() => {
        if (email) {
            async function fx() {
                const contact = await dispatch(getContactByEmail(email));
                setContact(contact.payload);
            }
            fx();
        }
    }, [email]);

    useEffect(() => {
        const updateHandler = (data) => {
            if (data.chat_id === activeChat.chat_id) {
                dispatch(addNewMessage(data));
            }

            //dispatch(getMessages(data.message.chat_id));
        };
        socket.off('update', updateHandler); // Удаляем предыдущий обработчик, если он существует
        socket.on('update', updateHandler); // Добавляем новый обработчик

        return () => {
            socket.off('update', updateHandler); // Очищаем обработчик при размонтировании компонента
        };
    }, [activeChat, dispatch]);

    useEffect(() => {
        console.log('user', user);
        if (user) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [user]);

    useEffect(() => {
        if (activeChat) {
            setIsLoading(true);
            dispatch(getMessages(activeChat.chat_id));
            //dispatch(getChatListPart({ limit: 20, filter: 'all' }));
            if (activeChat) dispatch(readChatMessages(activeChat.chat_id));
            setIsLoading(false);
        }
    }, [activeChat]);

    useLayoutEffect(() => {
        setTimeout(() => {
            if (chatRef.current) {
                chatRef.current.scrollTo({
                    top: chatRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 500);
    }, [messages]);

    /* useEffect(() => {
        if (contact && contact.chats && contact.chats.length > 0) {
            setAlignment(contact.chats[0]); // Устанавливаем первый элемент активным
        }
    }, [contact]); */

    function managerName(manager_id) {
        if (manager_id === '33c7458d29f5372989deaf5e') {
            return 'Лия';
        } else if (manager_id === '874dfd47858891a12e31c247') {
            return 'Анастасия';
        } else if (manager_id === 'aaf697912ffecceee61fa87b') {
            return 'Даниил';
        } else if (manager_id === '771ccea386b7a316f51d6ecd') {
            return 'Александра';
        }
    }

    function differenceInDays(date1: Date, date2: Date): number {
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const diffInMs = Math.abs(date1.getTime() - date2.getTime());
        const diffInDays = Math.round(diffInMs / ONE_DAY);
        return diffInDays;
    }

    function getMessageTimeText(createdAt: string) {
        const diff = differenceInDays(new Date(), new Date(createdAt));

        if (diff < 2) {
            return formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: ru,
            });
        } else if (diff < 7) {
            return format(new Date(createdAt), 'd MMM', { locale: ru });
        } else {
            return format(new Date(createdAt), 'd MMM', { locale: ru });
        }
    }

    function isFirstMessageOfGroup(item: ChatMessageType, i: number) {
        return i === 0 || (messages[i - 1] && messages[i - 1].manager_id !== item.manager_id);
    }

    function isLastMessageOfGroup(item: ChatMessageType, i: number) {
        return (
            i === messages.length - 1 ||
            (messages[i + 1] && messages[i + 1].manager_id !== item.manager_id)
        );
    }

    function handleInputChange(event) {
        setChatId(event.target.value); // обновляем состояние при вводе
        if (event.target.value.length === 24) {
            setError(''); // сброс ошибки, если длина ID корректна
        }
    }

    async function handleAddChat() {
        if (chatId.trim() === '') {
            setError('ID чата не может быть пустым');
            return;
        }
        if (chatId.length !== 24) {
            setError('ID чата должен содержать 24 символа');
            return;
        }

        let contact_id;

        if (!contact) {
            const checkContact = await dispatch(getContactByEmail(email));
            if (!checkContact.payload) {
                const params = {
                    contact_name: name,
                    contact_email: email,
                    contact_phone: phone,
                    contact_getcourse_link: link,
                };
                const createdContact = await dispatch(newContact(params));
                contact_id = createdContact.contact_id;
            } else {
                contact_id = checkContact.contact_id;
            }
        } else {
            contact_id = contact.contact_id;
        }
        // Проверяем наличие контакта с таким Email

        //Проверка и создание контакта для чата.

        //Удаление старого контакта.
        const chat = await dispatch(getChat(chatId));
        if (chat.payload) {
            await dispatch(removeContact(chat.payload.contact_id));
        }

        //Обновление контакта в чате
        const params = {
            chat_id: chatId,
            contact_id,
        };
        const response = await dispatch(updateOneChat(params)); // отправляем экшен с ID чата

        console.log('response после добавления чата к контакту. Обновления чата', response);
        if (response.payload) {
            const params = { email, chat_id: response.payload.chat_id };
            await dispatch(addChatToContact(params));
        }
        setChatId(''); // очищаем поле после отправки
    }

    function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setMessageValue(ev.target.value);
    }

    function onMessageSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (message_value === '') {
            return;
        }
        if (activeChat && user) {
            dispatch(
                sendMessage({
                    message_value,
                    chat_id: activeChat.chat_id,
                    contact_id: activeChat.contact_id,
                    manager_id: user.user_id,
                    message_type: 'text',
                    messenger_type: activeChat.messenger_type,
                    messenger_id: activeChat.messenger_id,
                    attachments: [],
                }),
            ).then(() => {
                setMessageValue('');
            });
        }
    }

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: ChatListItemType) => {
        if (newAlignment !== null) {
            console.log('newAlignment', newAlignment);
            setAlignment(newAlignment);
            setActiveChat(newAlignment);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            // Код клавиши Enter
            onMessageSubmit(e);
        }
    };

    if (!user || !messages /* || !selectedContact */) {
        return <Error404Page />;
    }
    return (
        <>
            {!isLoading && (
                <div className="flex flex-col flex-auto h-full min-h-0 w-full">
                    {contact ? (
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            size="small"
                            onChange={handleChange}
                            aria-label="Platform"
                            className="sticky top-0 z-50 w-full"
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? lighten(theme.palette.background.default, 0.4)
                                        : lighten(theme.palette.background.default, 0.02),
                            }}
                        >
                            {contact.chats.map((chat, index) => (
                                <ToggleButton key={index} value={chat}>
                                    <img
                                        className="w-20 h-20 mb-4 opacity-50"
                                        src={`assets/icons/${chat.messenger_type}.png`}
                                        alt={chat.messenger_type}
                                    />
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    ) : null}
                    {activeChat ? (
                        <div className={clsx('flex flex-1 z-10 flex-col relative', className)}>
                            <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
                                {messages && messages.length > 0 ? (
                                    <div className="flex flex-col pt-16 px-0 pb-40">
                                        {messages.map((item, i) => {
                                            return (
                                                <StyledMessageRow
                                                    key={i}
                                                    className={clsx(
                                                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                                                        item.manager_id ? 'me' : 'contact',
                                                        {
                                                            'first-of-group': isFirstMessageOfGroup(
                                                                item,
                                                                i,
                                                            ),
                                                        },
                                                        {
                                                            'last-of-group': isLastMessageOfGroup(
                                                                item,
                                                                i,
                                                            ),
                                                        },
                                                        i + 1 === messages.length && 'pb-96',
                                                    )}
                                                >
                                                    <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                                                        <div className="text-11leading-tight whitespace-pre-wrap">
                                                            {item.message_value}
                                                            {item.attachments
                                                                ? item.attachments.map(
                                                                      (attachment, index) => (
                                                                          <div className="mt-10 max-w-300">
                                                                              <CardAttachment
                                                                                  key={index}
                                                                                  attachment={
                                                                                      attachment
                                                                                  }
                                                                              />
                                                                          </div>
                                                                      ),
                                                                  )
                                                                : null}
                                                            <div
                                                                className="text-11 opacity-60 mt-4"
                                                                color="text.secondary "
                                                            >
                                                                {format(
                                                                    new Date(item.createdAt),
                                                                    'hh:mm',
                                                                    {
                                                                        locale: ru,
                                                                    },
                                                                )}{' '}
                                                                {item.manager_id
                                                                    ? `от ${managerName(
                                                                          item.manager_id,
                                                                      )}`
                                                                    : null}
                                                            </div>
                                                        </div>

                                                        <Typography
                                                            className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                                                            color="text.secondary"
                                                        >
                                                            {getMessageTimeText(item.createdAt)}
                                                        </Typography>
                                                    </div>
                                                </StyledMessageRow>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <FuseLoading />
                                )}
                            </div>
                            {messages && (
                                <Paper
                                    square
                                    component="form"
                                    onSubmit={onMessageSubmit}
                                    className="absolute border-t-1 bottom-0 right-0 left-0 py-16 px-16"
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? lighten(theme.palette.background.default, 0.4)
                                                : lighten(theme.palette.background.default, 0.02),
                                    }}
                                >
                                    <div className="flex items-center relative">
                                        {/* <IconButton type="submit" size="large">
                                        <FuseSvgIcon className="text-24" color="action">
                                            heroicons-outline:emoji-happy
                                        </FuseSvgIcon>
                                    </IconButton>

                                    <IconButton type="submit" size="large">
                                        <FuseSvgIcon className="text-24" color="action">
                                            heroicons-outline:paper-clip
                                        </FuseSvgIcon>
                                    </IconButton> */}

                                        <InputBase
                                            autoFocus={false}
                                            id="message-input"
                                            className="flex-1 flex grow shrink-0 mx-8 px-16 border-2 resize-none whitespace-normal overflow-y-auto border-radius-10"
                                            placeholder="Type your message"
                                            onChange={onInputChange}
                                            value={message_value}
                                            onKeyDown={handleKeyDown}
                                            multiline
                                            sx={{
                                                backgroundColor: 'background.paper',
                                                maxHeight: '140px',
                                            }} // Добавление динамического стиля
                                        />
                                        <IconButton type="submit" size="large">
                                            <FuseSvgIcon className="rotate-90" color="action">
                                                heroicons-outline:paper-airplane
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </div>
                                </Paper>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <p className="text-center text-gray-500 text-lg">
                                Выберете чат или добавьте новый
                            </p>
                            <div>
                                <Input
                                    value={chatId}
                                    onChange={handleInputChange}
                                    placeholder="Введите ID чата"
                                    className="mt-8 w-full"
                                    aria-label="Chat ID"
                                    inputProps={{ 'aria-label': 'chat-id' }}
                                    error={!!error} // если есть ошибка, показать стили ошибки
                                />

                                {/* Сообщение об ошибке */}
                                {error && (
                                    <Typography color="error" className="mt-4">
                                        {error}
                                    </Typography>
                                )}

                                {/* Кнопка для добавления переписки */}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className=" mt-16 w-full"
                                    aria-label="Sign in"
                                    size="large"
                                    onClick={handleAddChat}
                                >
                                    Добавить переписку
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ContactChatPage;
