import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch, useAppSelector } from 'app/store';
import { ChatMessageType } from 'app/theme-layouts/shared-components/chatPanel/types/ChatMessageType';
import { selectSelectedContactId } from './store/contactsSlice';
import { selectMessages, sendMessage } from './store/chatMessagesSlice';
import { selectUser } from './store/userSlice';

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

type ChatProps = {
    className?: string;
};

/**
 * The chat component.
 */
function Chat(props: ChatProps) {
    const { className } = props;
    const dispatch = useAppDispatch();
    const selectedContactId = useAppSelector(selectSelectedContactId);
    const messages = useAppSelector(selectMessages);
    const user = useAppSelector(selectUser);

    const chatScroll = useRef<HTMLDivElement>(null);
    const [message_value, setMessageText] = useState('');

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        if (!chatScroll.current) {
            return;
        }
        chatScroll.current.scrollTo({
            top: chatScroll.current.scrollHeight,
            behavior: 'instant',
        });
    }

    const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setMessageText(ev.target.value);
    };

    return (
        <Paper
            className={clsx('flex flex-col relative pb-64 shadow', className)}
            sx={{ background: (theme) => theme.palette.background.default }}
        >
            <div
                ref={chatScroll}
                className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
            >
                <div className="flex flex-col pt-16">
                    {useMemo(() => {
                        function isFirstMessageOfGroup(item: ChatMessageType, i: number) {
                            return (
                                i === 0 ||
                                (messages[i - 1] && messages[i - 1].manager_id !== item.manager_id)
                            );
                        }

                        function isLastMessageOfGroup(item: ChatMessageType, i: number) {
                            return (
                                i === messages.length - 1 ||
                                (messages[i + 1] && messages[i + 1].manager_id !== item.manager_id)
                            );
                        }

                        return messages?.length > 0
                            ? messages.map((item, i) => {
                                  return (
                                      <StyledMessageRow
                                          key={i}
                                          className={clsx(
                                              'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                                              item.manager_id === user.user_id ? 'me' : 'contact',
                                              { 'first-of-group': isFirstMessageOfGroup(item, i) },
                                              { 'last-of-group': isLastMessageOfGroup(item, i) },
                                              i + 1 === messages.length && 'pb-72',
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
                                      </StyledMessageRow>
                                  );
                              })
                            : null;
                    }, [messages, user?.user_id])}
                </div>

                {messages?.length === 0 && (
                    <div className="flex flex-col flex-1">
                        <div className="flex flex-col flex-1 items-center justify-center">
                            <FuseSvgIcon size={128} color="disabled">
                                heroicons-outline:chat
                            </FuseSvgIcon>
                        </div>
                        <Typography className="px-16 pb-24 text-center" color="text.secondary">
                            Start a conversation by typing your message below.
                        </Typography>
                    </div>
                )}
            </div>

            {useMemo(() => {
                const onMessageSubmit = (ev: FormEvent) => {
                    ev.preventDefault();
                    if (message_value === '') {
                        return;
                    }
                    dispatch(
                        sendMessage({
                            message_value,
                            contact_id: selectedContactId,
                        }),
                    ).then(() => {
                        setMessageText('');
                    });
                };

                return messages ? (
                    <form
                        onSubmit={onMessageSubmit}
                        className="pb-16 px-8 absolute bottom-0 left-0 right-0"
                    >
                        <Paper className="rounded-24 flex items-center relative shadow">
                            <InputBase
                                autoFocus={false}
                                id="message-input"
                                className="flex flex-1 grow shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8"
                                placeholder="Type your message"
                                onChange={onInputChange}
                                value={message_value}
                            />
                            <IconButton
                                className="absolute ltr:right-0 rtl:left-0 top-0"
                                type="submit"
                                size="large"
                            >
                                <FuseSvgIcon className="rotate-90" color="action">
                                    heroicons-outline:paper-airplane
                                </FuseSvgIcon>
                            </IconButton>
                        </Paper>
                    </form>
                ) : null;
            }, [messages, dispatch, message_value, selectedContactId])}
        </Paper>
    );
}

export default Chat;
