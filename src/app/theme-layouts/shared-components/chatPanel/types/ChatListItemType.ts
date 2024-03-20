import { ChatContactType } from './ChatContactType';
import { MessageType } from './MessageType';

/**
 * Chat list item type
 */
export type ChatListItemType = {
    chat_id: string;
    contact_id: string;
    messenger_id: string;
    unread_count: number;
    chat_muted: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    chat_contact: ChatContactType;
    messages?: MessageType[];
};
