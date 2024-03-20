import { ContactEmailsType } from './ContactEmailType';
import { ContactPhoneNumbersType } from './ContactPhoneNumberType';

/**
 * Contact Type
 */
export type ContactType = {
    contact_id: string;
    contact_photo_url: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
    tags: string[];
};

/**
 * Contacts Type
 */
export type ContactsType = ContactType[];
