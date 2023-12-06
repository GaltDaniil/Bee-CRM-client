/**
 * ChatMessageType
 */
export type ChatMessageType = {
    message_id: string;
    chat_id: string;
    contact_id: string;
    message_value: string;
    createdAt: string;
};

export type ChatMessagesType = ChatMessageType[];
