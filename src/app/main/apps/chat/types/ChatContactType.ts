import { ContactStatusType } from './ContactStatusType';

/**
 * ChatContact type
 */

export type ChatContactType = {
    contact_photo_url: string;
    contact_name: string;
    contact_status: ContactStatusType;
};
