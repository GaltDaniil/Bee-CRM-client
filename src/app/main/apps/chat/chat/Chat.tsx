import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useRef, useState } from 'react';
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
} from '../store/chatMessagesSlice';
import { selectUser } from '../store/userSlice';
import UserAvatar from '../UserAvatar';
import ChatMoreMenu from './ChatMoreMenu';
import { ChatAppContext } from '../ChatApp';
import { ChatMessageType } from '../types/ChatMessageType';
import Error404Page from '../../../404/Error404Page';
import { getChatList, readChatMessages, selectChatById } from '../store/chatListSlice';
import ru from 'date-fns/locale/ru';
import { format } from 'date-fns';
import socket from 'src/app/socket';
import CardAttachment from '../attachment/ChatAttachment';
import FuseLoading from '@fuse/core/FuseLoading';
import { border, borderRadius } from '@mui/system';

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
function Chat(props: ChatPropsType) {
    const { className } = props;
    const { setMainSidebarOpen, setContactSidebarOpen, setOrderSidebarOpen } =
        useContext(ChatAppContext);
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessages);
    const { data: user } = useAppSelector(selectUser);
    const routeParams = useParams();
    const chat_id = routeParams.id;
    const selectedChat = useAppSelector(selectChatById(chat_id));
    const chatRef = useRef<HTMLDivElement>(null);
    const [message_value, setMessageValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const updateHandler = (data) => {
            if (data.message.chat_id === chat_id) {
                dispatch(addNewMessage(data.message));
            }

            //dispatch(getMessages(data.message.chat_id));
        };
        socket.off('update', updateHandler); // Удаляем предыдущий обработчик, если он существует
        socket.on('update', updateHandler); // Добавляем новый обработчик

        return () => {
            socket.off('update', updateHandler); // Очищаем обработчик при размонтировании компонента
        };
    }, [chat_id, dispatch]);

    useEffect(() => {
        console.log('отсновной эффект');
        setIsLoading(true);
        dispatch(getMessages(chat_id));
        dispatch(getChatList());
        if (selectedChat) dispatch(readChatMessages(chat_id));
        setIsLoading(false);
    }, [chat_id, dispatch]);

    useEffect(() => {
        if (messages) {
            setTimeout(scrollToBottom);
        }
    }, [messages]);

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

    function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setMessageValue(ev.target.value);
    }

    function onMessageSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (message_value === '') {
            return;
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
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            // Код клавиши Enter
            onMessageSubmit(e);
        }
    };

    if (!user || !messages /* || !selectedContact */) {
        return <Error404Page />;
    }

    const inputStyle = {
        whiteSpace: 'normal',
        height: 'auto',
        maxHeight: '160px', // Ограничение максимальной высоты до 300px
        overflowY: 'auto',
        borderRadius: '10px',
    };

    return (
        <>
            <Box
                className="w-full border-b-1"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <Toolbar className="flex items-center justify-between px-16 w-full">
                    <div className="flex items-center">
                        <IconButton
                            aria-label="Open drawer"
                            onClick={() => setMainSidebarOpen(true)}
                            className="flex lg:hidden"
                            size="large"
                        >
                            <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
                        </IconButton>
                        {selectedChat ? (
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
                        ) : null}
                    </div>
                    <ChatMoreMenu className="-mx-8" />
                </Toolbar>
            </Box>

            {!isLoading ? (
                <div className="flex flex-auto h-full min-h-0 w-full">
                    <div className={clsx('flex flex-1 z-10 flex-col relative', className)}>
                        <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
                            {messages && messages.length > 0 ? (
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
                                                        'last-of-group': isLastMessageOfGroup(
                                                            item,
                                                            i,
                                                        ),
                                                    },
                                                    i + 1 === messages.length && 'pb-96',
                                                )}
                                            >
                                                <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                                                    <div className="leading-tight whitespace-pre-wrap">
                                                        {item.message_value}
                                                        {item.attachments
                                                            ? item.attachments.map((attachment) => (
                                                                  <div className="mt-10 max-w-300">
                                                                      <CardAttachment
                                                                          attachment={attachment}
                                                                      />
                                                                  </div>
                                                              ))
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
                                                            )}
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
                </div>
            ) : null}
        </>
    );
}

export default Chat;
