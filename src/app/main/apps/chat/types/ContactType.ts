import { ContactAttachmentsType } from './ContactAttachmentsType';
import { ContactDetailsType } from './ContactDetailsType';
import { ContactStatusType } from './ContactStatusType';

/**
 * Contact Type
 */
export type ContactType = {
    contact_id: string;
    contact_photo_url: string;
    contact_name: string;
    contact_about: string;
    contact_status: ContactStatusType;
    details: Partial<ContactDetailsType>;
    attachments: ContactAttachmentsType;
};

export type ContactTypeDemo = {
    contact_id: string;
    account_id: string;
    contact_name: string;
    contact_photo_url: string;
    contact_email: string;
    contact_phone?: string;
    contact_about?: string;
    contact_address?: string;
    contact_birthday?: string;
    contact_status: string;
    contact_links?: string[];
    contact_media?: string[];
    contact_docs?: string[];
};

export type ContactsType = ContactType[];
