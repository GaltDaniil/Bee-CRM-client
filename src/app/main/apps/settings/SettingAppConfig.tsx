import { lazy } from 'react';

const SettingApp = lazy(() => import('./SettingApp'));

/**
 * The Profile app config.
 */
const SettingAppConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'apps/setting',
            element: <SettingApp />,
        },
    ],
};

export default SettingAppConfig;
