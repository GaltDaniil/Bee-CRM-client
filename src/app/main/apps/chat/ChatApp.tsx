import { createContext, Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import MainSidebar from './sidebars/main/MainSidebar';
import ContactSidebar from './sidebars/contact/ContactSidebar';
import UserSidebar from './sidebars/user/UserSidebar';

import { getUserData } from './store/userSlice';
import { getContacts } from './store/contactsSlice';
import { selectUser } from 'app/store/user/userSlice';

import { useAppDispatch, useAppSelector } from 'app/store';
import OrderSidebar from './sidebars/order/OrderSidebar';

const drawerWidth = 400;

type ChatAppContextType = {
    setMainSidebarOpen: (isOpen?: boolean) => void;
    setOrderSidebarOpen: (isOpen?: boolean) => void;
    setContactSidebarOpen: (isOpen?: boolean) => void;
    setUserSidebarOpen: (isOpen?: boolean) => void;
};

export const ChatAppContext = createContext<ChatAppContextType>({
    setMainSidebarOpen: () => {},
    setOrderSidebarOpen: () => {},
    setContactSidebarOpen: () => {},
    setUserSidebarOpen: () => {},
});

const Root = styled(FusePageSimple)(() => ({
    '& .FusePageSimple-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        height: '100%',
    },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        maxWidth: '100%',
        overflow: 'hidden',
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
}));

function ChatApp() {
    const dispatch = useAppDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const userData = useAppSelector(selectUser);
    const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
    const [contactSidebarOpen, setContactSidebarOpen] = useState(false);
    const [orderSidebarOpen, setOrderSidebarOpen] = useState(false);
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        dispatch(getUserData(userData.user_id));
        //изменил тут
        //dispatch(getChatListPart(limit));
    }, [dispatch]);

    useEffect(() => {
        setMainSidebarOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            setMainSidebarOpen(false);
        }
    }, [location, isMobile]);

    useEffect(() => {
        if (isMobile && userSidebarOpen) {
            setMainSidebarOpen(false);
        }
    }, [isMobile, userSidebarOpen]);

    const ChatAppContextData = useMemo(
        () => ({
            setMainSidebarOpen,
            setContactSidebarOpen,
            setOrderSidebarOpen,
            setUserSidebarOpen,
        }),
        [setOrderSidebarOpen, setMainSidebarOpen, setContactSidebarOpen, setUserSidebarOpen],
    );

    return (
        <ChatAppContext.Provider value={ChatAppContextData as ChatAppContextType}>
            <Root
                content={<Outlet />}
                leftSidebarContent={<MainSidebar />}
                leftSidebarOpen={mainSidebarOpen}
                leftSidebarOnClose={() => {
                    setMainSidebarOpen(false);
                }}
                leftSidebarWidth={400}
                rightSidebarContent={
                    <Suspense fallback={<div>Loading...</div>}>
                        {contactSidebarOpen && <ContactSidebar />}
                    </Suspense>
                }
                rightSidebarOpen={contactSidebarOpen}
                rightSidebarOnClose={() => {
                    setContactSidebarOpen(false);
                }}
                rightOrderSidebarContent={
                    <Suspense fallback={<div>Loading...</div>}>
                        {orderSidebarOpen && <OrderSidebar />}
                    </Suspense>
                }
                rightOrderSidebarOpen={orderSidebarOpen}
                rightOrderSidebarOnClose={() => {
                    setOrderSidebarOpen(false);
                }}
                rightSidebarWidth={400}
                scroll="content"
            />
            <StyledSwipeableDrawer
                className="h-full absolute z-9999"
                variant="temporary"
                anchor="left"
                open={userSidebarOpen}
                onOpen={() => {}}
                onClose={() => setUserSidebarOpen(false)}
                classes={{
                    paper: 'absolute left-0',
                }}
                style={{ position: 'absolute' }}
                ModalProps={{
                    keepMounted: false,
                    disablePortal: true,
                    BackdropProps: {
                        classes: {
                            root: 'absolute',
                        },
                    },
                }}
            >
                <UserSidebar />
            </StyledSwipeableDrawer>
        </ChatAppContext.Provider>
    );
}

export default ChatApp;
