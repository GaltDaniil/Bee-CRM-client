import { useContext, useEffect, useRef, useState } from 'react';
import { lighten, styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import socket from '../../socket';
import axios from 'axios';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, IconButton, Toolbar, Button } from '@mui/material';
import UserAvatar from '../apps/chat/UserAvatar';
import { useAppDispatch, useAppSelector } from 'app/store';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessageType } from '../apps/chat/types/ChatMessageType';

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

export const BeeChatPage: React.FC = (props) => {
    const dispatch = useAppDispatch();
    const chatRef = useRef<HTMLDivElement>(null);
    const [message_value, setMessageValue] = useState('');

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([
        {
            message_id: 'string',
            chat_id: 'string',
            contact_id: 'string',
            manager_id: 'string',
            message_value: 'string',
            message_type: 'chatBot',
            is_readed: true,
            //@ts-ignore
            createdAt: new Date(),
            attachments: [],
        },
        {
            message_id: 'string',
            chat_id: 'string',
            contact_id: 'string',
            manager_id: '',
            message_value: ' gf wekgj wkefjwek fjwelkf jwekfjwlkefjwlkef jwlkef jwelk fj',
            message_type: 'string',
            is_readed: true,
            //@ts-ignore
            createdAt: new Date(),
            attachments: [],
        },
    ]);
    const [chat_id, setChatId] = useState<string>('');
    const [fromUrl, setFromUrl] = useState('');
    const [predefinedReplies, setPredefinedReplies] = useState<string[]>([
        'Кнопка 1',
        'Кнопка кнопка 2',
        'Омикткикеи',
        // Другие заготовленные ответы
    ]);

    const [showButtons, setShowButtons] = useState<boolean>(true);

    useEffect(() => {
        socket.on('newMessage', (data) => {
            if (!data.from_contact) setMessages((pred) => [...pred, data]);
        });
        window.addEventListener('message', (event: MessageEvent<any>) => {
            if (event.data.action === 'showLiveChat') {
                setIsChatOpen((prev) => true);
                const location = event.data.location as string;
                setFromUrl((prev) => location);
            }
        });
    }, []);

    useEffect(() => {
        if (messages) {
            setTimeout(scrollToBottom);
        }
    }, [messages]);

    useEffect(() => {
        if (isChatOpen) {
            const loadingChat = async () => {
                let localStorageChatId: string | undefined = window.localStorage.getItem('beechat');

                if (localStorageChatId !== undefined) {
                    setChatId((prev) => localStorageChatId);
                    const getMessages = await axios.get(`api/messages/${localStorageChatId}`);
                    setMessages((prev) => getMessages.data);
                    console.log(getMessages);
                    socket.emit('join', { chat_id: Number(localStorageChatId) });
                } else {
                    window.localStorage.removeItem('beechat');
                }
            };
            loadingChat();
        }
    }, [isChatOpen]);

    function scrollToBottom() {
        if (!chatRef.current) {
            return;
        }
        chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: 'smooth',
        });
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

    const closeLiveChat = () => {
        console.log('close');
        window.parent.postMessage({ action: 'hideLiveChat' }, '*');
    };

    function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setMessageValue(ev.target.value);
    }

    const handleButtonClick = (reply: string) => {
        // Отправить выбранный ответ в чат
        sendMessageToChat(reply);

        // Скрыть кнопки
        setShowButtons(false);
    };

    const sendMessageToChat = (message: string) => {
        setMessages((prevMessages) => [...prevMessages]);
    };

    /* const onMessageSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (message_value === '') {
            return;
        }

        if (!chat_id) {
            const newChat = await axios.post('/contacts', {
                messenger_id: 0,
                from_url: fromUrl,
                messenger_type: 'beechat',
            });
            window.localStorage.setItem('beechat', newContact.data.id.toString());
            setChatId((pred) => newContact.data.id);
            socket.emit('join', { contact_id: newContact.data.id });

            const newMessage = await axios.post('/messages', {
                contact_id: newContact.data.id,
                text,
                from_contact: true,
            });
            setMessages((pred) => [...pred, newMessage.data]);
            socket.emit('sendMessage', newMessage.data);
            setMessageValue((prev) => '');
        } else {
            const { data } = await axios.post('/messages', {
                contact_id,
                text,
                from_contact: true,
            });
            setMessages((pred) => [...pred, data]);
            socket.emit('sendMessage', data);
            setText((prev) => '');
        }

        dispatch(
            sendMessage({
                message_value,
                chat_id: messages[0].chat_id,
                contact_id: selectedChat.contact_id,
                manager_id: user.user_id,
                message_type: 'text',
                messenger_type: selectedChat.messenger_type,
                messenger_id: selectedChat.messenger_id,
            }),
        ).then(() => {
            setMessageValue('');
        });
    }; */
    return (
        <div className="flex flex-auto flex-col h-screen">
            <Box
                className="w-full bg-orange "
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <Toolbar className="flex px-16 w-full ">
                    <div className="flex items-center justify-between w-full">
                        <Typography color="white" className="text-16 font-semibold px-4">
                            Онлайн поддержка
                        </Typography>
                        <IconButton
                            aria-label="Open drawer"
                            onClick={() => closeLiveChat()}
                            className="flex lg:hidden"
                            size="large"
                        >
                            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                        </IconButton>
                        {/* {selectedChat ? (
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => {
                                    setContactSidebarOpen(true);
                                }}
                                onKeyDown={() => setContactSidebarOpen(true)}
                                role="button"
                                tabIndex={0}
                            >
                                <UserAvatar
                                    className="relative mx-8"
                                    user={selectedChat?.chat_contact}
                                />
                                <Typography color="inherit" className="text-16 font-semibold px-4">
                                    {selectedChat?.chat_contact.contact_name}
                                </Typography>
                            </div>
                        ) : null} */}
                    </div>
                </Toolbar>
            </Box>

            <div className="flex flex-auto h-full min-h-0 w-full">
                <div className={'flex flex-1 z-10 flex-col relative flex flex-1 z-10'}>
                    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto justify-end">
                        {messages?.length > 0 && (
                            <div className="flex flex-col pt-16 px-16 pb-40">
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
                                                    'last-of-group': isLastMessageOfGroup(item, i),
                                                },
                                                i + 1 === messages.length && 'pb-96',
                                            )}
                                        >
                                            <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                                                <div className="leading-tight whitespace-pre-wrap">
                                                    {item.message_value}
                                                </div>

                                                <Typography
                                                    className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                                                    color="text.secondary"
                                                >
                                                    {formatDistanceToNow(new Date(item.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </Typography>
                                            </div>
                                            {item.message_type === 'chatBot' && (
                                                <div className="flex w-full justify-end ml-auto flex-wrap">
                                                    {predefinedReplies.map((reply, index) => (
                                                        <Button
                                                            className="m-4"
                                                            variant="contained"
                                                            size="small"
                                                            key={index}
                                                            onClick={() => handleButtonClick(reply)}
                                                        >
                                                            {reply}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </StyledMessageRow>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {messages && (
                        <Paper
                            square
                            component="form"
                            //onSubmit={onMessageSubmit}
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
                                    className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
                                    placeholder="Какой вопрос вас интересует?"
                                    onChange={onInputChange}
                                    value={message_value}
                                    sx={{ backgroundColor: 'background.paper' }}
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
            </div>
        </div>
    );
};
