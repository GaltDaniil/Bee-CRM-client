import i18next from 'i18next';
import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import ru from './navigation-i18n/ru';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ru', 'navigation', ru);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavigationType = [
    {
        id: 'apps',
        title: 'Applications',
        subtitle: 'Custom made application designs',
        type: 'group',
        icon: 'heroicons-outline:cube',
        translate: 'APPLICATIONS',
        children: [
            {
                id: 'apps.chat',
                title: 'Chat',
                type: 'item',
                icon: 'heroicons-outline:chat-alt',
                url: '/apps/chat',
                translate: 'CHAT',
            },
            {
                id: 'apps.contacts',
                title: 'Contacts',
                type: 'item',
                icon: 'heroicons-outline:user-group',
                url: '/apps/contacts',
                translate: 'CONTACTS',
            },
            {
                id: 'apps.settings',
                title: 'Settings',
                type: 'item',
                icon: 'material-outline:settings',
                url: '/apps/setting',
                translate: 'SETTINGS',
            },
            {
                id: 'apps.scrumboard',
                title: 'Scrumboard',
                type: 'item',
                icon: 'heroicons-outline:view-boards',
                url: '/apps/scrumboard',
                translate: 'CRM',
            },
            {
                id: 'apps.orders',
                title: 'Orders',
                type: 'item',
                icon: 'heroicons-outline:view-boards',
                url: '/apps/orders',
                translate: 'ORDERS',
            },
        ],
    },
];

export default navigationConfig;
