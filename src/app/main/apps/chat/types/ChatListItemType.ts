import { ChatContactType } from 'app/theme-layouts/shared-components/chatPanel/types/ChatContactType';
import { MessageType } from './MessageType';

/**
 * Chat List Item Type
 */
export type ChatListItemType = {
    chat_id: string;
    contact_id?: string;
    unread_count?: number;
    chat_muted?: boolean;
    chat_hidden?: boolean;
    messenger_id?: string;
    messenger_type?: string;
    messenger_username?: string;
    instagram_chat_id?: string;
    from_url?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    chat_contact?: ChatContactType;
    messages?: MessageType[];
};
