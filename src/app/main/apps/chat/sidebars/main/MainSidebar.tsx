import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';

import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { motion } from 'framer-motion';
import { useContext, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from 'app/store';
//import ContactListItem from './ContactListItem';
import { getChatListPart, selectChats } from '../../store/chatListSlice';
import UserAvatar from '../../UserAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import { ChatAppContext } from '../../ChatApp';
import { selectUser } from '../../store/userSlice';
import ChatListItem from './ChatListItem';
import React from 'react';
import socket from 'src/app/socket';

/**
 * The main sidebar.
 */
function MainSidebar() {
    const { setUserSidebarOpen } = useContext(ChatAppContext);

    const dispatch = useAppDispatch();
    //const contacts = useAppSelector(selectContacts);
    const chats = useAppSelector(selectChats);
    const { data: user } = useAppSelector(selectUser);

    const [searchText, setSearchText] = useState('');

    const [alignment, setAlignment] = useState('all');

    // Функционал бесконечной загрузки
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(20);
    const [filter, setFilter] = useState('all');
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            setFilter(newAlignment);
            dispatch(getChatListPart({ limit, filter: newAlignment }));
        }
    };

    function handleSearchText(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
    }

    function loadingMoreChats() {
        console.log('limit', limit);
        const newLimit = limit + 20;
        dispatch(getChatListPart({ limit: newLimit, filter }));
        setLimit(newLimit);
    }

    React.useEffect(() => {
        socket.on('update', () => {
            dispatch(getChatListPart({ limit, filter }));
            console.log('update');
        });
    }, []);

    React.useEffect(() => {
        dispatch(getChatListPart({ limit, filter }));
    }, [dispatch]);

    return (
        <div className="flex flex-col flex-auto h-full">
            <Box
                className="py-16 px-32 border-b-1"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <div className="flex justify-between items-center mb-16">
                    {user && (
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setUserSidebarOpen(true)}
                            onKeyDown={() => setUserSidebarOpen(true)}
                            role="button"
                            tabIndex={0}
                        >
                            <UserAvatar className="relative" user={user} />
                            <Typography className="mx-16 font-medium">{user?.user_name}</Typography>
                        </div>
                    )}

                    <MainSidebarMoreMenu className="-mx-16" />
                </div>

                {useMemo(
                    () => (
                        <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40 rounded-full shadow-none">
                            <FuseSvgIcon color="action" size={20}>
                                heroicons-solid:search
                            </FuseSvgIcon>

                            <Input
                                placeholder="Поиск по чатам"
                                className="flex flex-1 px-8"
                                disableUnderline
                                fullWidth
                                value={searchText}
                                inputProps={{
                                    'aria-label': 'Search',
                                }}
                                onChange={handleSearchText}
                            />
                        </Paper>
                    ),
                    [searchText],
                )}
            </Box>

            <FuseScrollbars className="flex-1">
                <List className="w-full">
                    {useMemo(() => {
                        function getFilteredArray<T>(arr: T[], _searchText: string): T[] {
                            if (_searchText.length === 0) {
                                return arr;
                            }
                            return FuseUtils.filterArrayByString(arr, _searchText);
                        }

                        const chatListContacts =
                            chats.length > 0
                                ? chats.map((_chat) => ({
                                      ..._chat,
                                      /* ...contacts.find(
                                          (_contact) => _contact.contact_id === _chat.contact_id,
                                      ) */
                                  }))
                                : [];

                        //const filteredContacts = getFilteredArray([...contacts], searchText);

                        const filteredChatList = getFilteredArray(
                            [...chatListContacts],
                            searchText,
                        );

                        const container = {
                            show: {
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        };

                        const item = {
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                        };

                        return (
                            <motion.div
                                className="flex flex-col shrink-0"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {filteredChatList.length > 0 && (
                                    <>
                                        <motion.div variants={item}>
                                            <Typography
                                                className="font-medium text-20 px-32 py-24"
                                                color="secondary.main"
                                            >
                                                Чаты
                                            </Typography>
                                        </motion.div>
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={alignment}
                                            exclusive
                                            size="small"
                                            onChange={handleChange}
                                            aria-label="Platform"
                                        >
                                            <ToggleButton value="all">Все</ToggleButton>
                                            <ToggleButton value="new">Новые</ToggleButton>
                                            <ToggleButton value="order">С заказом</ToggleButton>
                                        </ToggleButtonGroup>
                                    </>
                                )}

                                {filteredChatList
                                    .filter((el) => el.lastMessage)
                                    .sort(
                                        (a, b) =>
                                            Date.parse(b.lastMessageAt) -
                                            Date.parse(a.lastMessageAt),
                                    )
                                    .map((chat, index) => (
                                        <motion.div variants={item} key={chat.chat_id}>
                                            <div
                                                className={clsx(
                                                    filteredChatList.length !== index + 1 &&
                                                        'border-b-1',
                                                )}
                                            >
                                                <ChatListItem item={chat} />
                                            </div>
                                        </motion.div>
                                    ))}

                                {/* {filteredContacts.length > 0 && (
                                    <motion.div variants={item}>
                                        <Typography
                                            className="font-medium text-20 px-32 py-24"
                                            color="secondary.main"
                                        >
                                            Контакты
                                        </Typography>
                                    </motion.div>
                                )} */}

                                {/* {filteredContacts.map((contact, index) => (
                                    <motion.div variants={item} key={contact.contact_id}>
                                        <div
                                            className={clsx(
                                                filteredContacts.length !== index + 1 &&
                                                    'border-b-1',
                                            )}
                                        >
                                            <ContactListItem item={contact} />
                                        </div>
                                    </motion.div>
                                ))} */}
                                {chats && filteredChatList ? (
                                    <div
                                        onClick={() => loadingMoreChats()}
                                        className="flex items-center justify-center h-60"
                                    >
                                        Ещё
                                    </div>
                                ) : null}
                            </motion.div>
                        );
                    }, [chats, searchText, dispatch, alignment])}
                </List>
            </FuseScrollbars>
        </div>
    );
}

export default MainSidebar;
