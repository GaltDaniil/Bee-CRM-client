import { ContactAttachmentsType } from './ContactAttachmentsType';
import { ContactDetailsType } from './ContactDetailsType';
import { ContactStatusType } from './ContactStatusType';

/**
 * Contact type
 */
export type ContactType = {
    contact_id: string;
    contact_photo_url: string;
    contact_name: string;
    contact_about: string;
    contact_status: ContactStatusType;
    details: Partial<ContactDetailsType>;
    attachments: ContactAttachmentsType;
    unread?: number;
};

export type ContactsType = ContactType[];
