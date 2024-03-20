import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import appsConfigs from '../main/apps/appsConfigs';
import Chat from '../main/apps/chat/chat/Chat';
import BeeChatConfig from '../main/beechat/BeeChatConfig';

const routeConfigs: FuseRouteConfigsType = [
    ExampleConfig,
    SignOutConfig,
    SignInConfig,
    SignUpConfig,
    BeeChatConfig,
    ...appsConfigs,
];

/**
 * The routes of the application.
 */
export const SERVER_IP = 'https://beechat.ru/';

const routes: FuseRoutesType = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
    {
        path: '/',
        element: <Navigate to="/apps/chat" />,
        auth: settingsConfig.defaultAuth,
    },
    {
        path: 'loading',
        element: <FuseLoading />,
    },
    {
        path: '404',
        element: <Error404Page />,
    },
    {
        path: '*',
        element: <Navigate to="404" />,
    },
];

export default routes;
