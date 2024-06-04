import { ContactStatusType } from './ContactStatusType';

/**
 * ChatContact type
 */

export type ChatContactType = {
    contact_photo_url: string;
    contact_name: string;
    contact_status: ContactStatusType;
    contact_getcourse: boolean;
    contact_bothelp_kn: boolean;
    contact_bothelp_bs: boolean;
};
