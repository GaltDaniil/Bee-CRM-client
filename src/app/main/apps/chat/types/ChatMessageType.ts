/**
 * Chat Message Type
 */
export type ChatMessageType = {
    message_id: string;
    chat_id: string;
    contact_id: string;
    manager_id: string;
    message_value: string;
    message_type: string;
    is_readed: boolean;
    createdAt: string;
};

/**
 * Chat Messages Type
 */
export type ChatMessagesType = ChatMessageType[];
