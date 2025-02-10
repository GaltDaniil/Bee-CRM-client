import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getContactByEmail, newContact } from '../../apps/contacts/store/contactSlice';
import { ContactType } from '../../apps/contacts/types/ContactType';
import { sendMessage, sendMessageFromGetcourse } from '../../apps/chat/store/chatMessagesSlice';

import SignInPage from '../../sign-in/SignInPage';
import { selectUser } from 'app/store/user/userSlice';

const MessagePage = () => {
    const dispatch = useAppDispatch();

    const [messageValue, setMessageValue] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [messenger_id, setMessengerId] = useState('');
    const [timer, setTimer] = useState(0);
    const [isFinalButtonActive, setIsFinalButtonActive] = useState(false);
    const [login, setIsLogin] = useState(false);

    const user = useAppSelector(selectUser);

    const isButtonActive = messageValue.trim() !== '';

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const phone = params.get('phone');
        const email = params.get('email');
        const name = params.get('name');
        const link = params.get('link');
        const messenger_id = params.get('messenger_id');
        console.log('phone', phone);
        console.log('email', email);
        console.log('name', name);
        console.log('link', link);
        console.log('messenger_id', messenger_id);

        if (phone) setPhone(phone);
        if (email) setEmail(email);
        if (name) setName(name);
        if (link) setLink(link);
        if (messenger_id) setMessengerId(messenger_id);
    }, []);

    useEffect(() => {
        let countdown;

        if (isButtonActive && !isFinalButtonActive) {
            setTimer(3); // Сброс таймера на 3 секунды
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setIsFinalButtonActive(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setTimer(0);
            setIsFinalButtonActive(false);
        }

        return () => clearInterval(countdown);
    }, [isButtonActive]);

    useEffect(() => {
        console.log('user', user);
        if (user.user_id) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [user]);

    const handleInputChange = (event) => {
        setMessageValue(event.target.value);
    };

    /* const handleKeyDown = (event) => {
        //event.preventDefault();
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            //onMessageSubmit(event);
        }
    }; */

    async function onMessageSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        window.parent.postMessage({ action: 'closeIframe' }, '*');
        if (messageValue === '') {
            return;
        }
        const params = {
            contact_email: email,
            contact_name: name,
            contact_phone: phone,
            contact_getcourse_link: link,
            message_value: messageValue,
            manager_id: user.user_id,
            message_type: 'text',
            messenger_type: 'wa',
            messenger_id: messenger_id,
        };
        console.log('params.manager_id', params.manager_id);
        dispatch(sendMessageFromGetcourse(params));

        setIsFinalButtonActive(false);
        setTimer(0);
    }
    console.log('login', login);

    return (
        <>
            {login ? (
                <div className="message-page h-full w-full flex items-center overflow-y-auto justify-center">
                    <Paper
                        square
                        component="form"
                        onSubmit={onMessageSubmit}
                        className="border-t-1 py-4 px-4 w-full h-full"
                        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <div className="flex items-center w-full h-full relative">
                            <InputBase
                                autoFocus={false}
                                id="message-input"
                                className="flex-grow px-2 border-2 rounded h-full whitespace-normal leading-relaxed"
                                placeholder="Type your message"
                                onChange={handleInputChange}
                                value={messageValue}
                                /* onKeyDown={handleKeyDown} */
                                multiline
                                sx={{
                                    backgroundColor: 'background.paper',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    wordBreak: 'break-word',
                                }}
                            />
                        </div>
                        <IconButton
                            type="submit"
                            size="large"
                            disabled={!isFinalButtonActive}
                            className={`mt-2  ${
                                isButtonActive ? 'bg-green-500 ' : 'bg-gray-300'
                            } transition-colors `}
                            style={{
                                borderRadius: '8px',
                            }}
                        >
                            <Typography
                                className={`mr-8 ${
                                    isFinalButtonActive ? 'text-white' : 'text-gray-500'
                                } font-bold`}
                            >
                                {isFinalButtonActive || timer == 0
                                    ? 'Отправить'
                                    : `Отправить (${timer})`}
                            </Typography>
                            <FuseSvgIcon
                                className={`rotate-90 ${
                                    isFinalButtonActive ? 'text-white' : 'text-gray-500'
                                }`}
                                color="action"
                            >
                                heroicons-outline:paper-airplane
                            </FuseSvgIcon>
                        </IconButton>
                    </Paper>
                </div>
            ) : (
                <SignInPage onLogin={() => setIsLogin(true)} />
            )}
        </>
    );
};

export default MessagePage;
