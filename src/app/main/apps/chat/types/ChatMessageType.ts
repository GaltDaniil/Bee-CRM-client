import { AttachmentType } from '../../scrumboard/types/AttachmentType';

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
    message_from: string;
    is_readed: boolean;
    createdAt: string;
    attachments: AttachmentType[];
};

/**
 * Chat Messages Type
 */
export type ChatMessagesType = ChatMessageType[];
