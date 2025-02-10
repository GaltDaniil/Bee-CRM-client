import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { BeeChatPage } from './BeeChatPage';
import { WidgetButtons } from './WidgetButtons';
import MessagePage from './getcourseWidgets/waChatFrame';
import ContactChatPage from './getcourseWidgets/contactChatFrame';
import ChatPlusPage from './getcourseWidgets/ChatAppGetcourse/chatPlusPage';

const BeeChatConfig: FuseRouteConfigType = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
                footer: {
                    display: false,
                },
                leftSidePanel: {
                    display: false,
                },
                rightSidePanel: {
                    display: false,
                },
            },
        },
    },
    auth: null,
    routes: [
        {
            path: 'beechat',
            element: <BeeChatPage />,
        },
        {
            path: 'buttons',
            element: <WidgetButtons />,
        },
        {
            path: 'waframe',
            element: <MessagePage />,
        },
        {
            path: 'contactchatframe',
            element: <ContactChatPage />,
        },
        {
            path: 'chatplus',
            element: <ChatPlusPage />,
        },
    ],
};

export default BeeChatConfig;
