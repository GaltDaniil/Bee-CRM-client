import { ChatListItemType } from '../../chat/types/ChatListItemType';
import { ChatListType } from '../../chat/types/ChatListType';
import { CardType } from '../../scrumboard/types/CardType';
import { ContactEmailsType } from './ContactEmailType';
import { ContactPhoneNumbersType } from './ContactPhoneNumberType';

/**
 * Contact Type
 */
export type ContactType2 = {
    contact_id: string;
    contact_photo_url: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
    tags: string[];
};
export type ContactType = {
    account_id: string;
    cards: CardType[];
    chats: ChatListType;
    contact_about: string;
    contact_address: string;
    contact_birthday: string;
    contact_docs: string;
    contact_email: string;
    contact_id: string;
    contact_links: string;
    contact_media: string;
    contact_name: string;
    contact_phone: string;
    contact_photo_url: string;
    contact_status: string;
    contact_getcourse: boolean;
    contact_getcourse_link: string;
    contact_bothelp_kn: boolean;
    contact_bothelp_bs: boolean;
    contact_wa_status: boolean;
    createdAt: string;
    updatedAt: string;
};

/**
 * Contacts Type
 */
export type ContactsType = ContactType[];
