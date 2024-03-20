import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { BeeChatPage } from './BeeChatPage';
import { WidgetButtons } from './WidgetButtons';

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
    ],
};

export default BeeChatConfig;
