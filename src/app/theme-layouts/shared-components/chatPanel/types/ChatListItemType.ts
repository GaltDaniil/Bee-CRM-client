import { MessageType } from './MessageType';

/**
 * Chat list item type
 */
export type ChatListItemType = {
    chat_id: string;
    contact_id: string;
    unread_count: number;
    chat_muted: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: MessageType[];
};
