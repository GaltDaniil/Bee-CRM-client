/**
 * Attachment Type
 */
export type AttachmentType2 = {
    attachment_id: string;
    attachment_name: string;
    attachment_src: string;
    time: number;
    attachment_type: string;
    attachment_extension?: string;
    attachment_payload: object;
    attachment_market?: {
        price: string;
        title: string;
        photo_url: string;
        description: string;
    };
    attachment_replay?: {
        sender_name: string; // Имя автора исходного сообщения
        message_text?: string; // Текст исходного сообщения (если есть)
        attachment?: AttachmentType; // Вложение из исходного сообщения (если есть)
    };
    createdAt: Date;
};
export type AttachmentType = {
    attachment_id?: string;
    attachment_name: string;
    attachment_type: string;
    attachment_src?: string;
    attachment_extension?: string;
    attachment_size?: number;
    attachment_payload?: AttachmentPayload;
    attachment_status?: string; // 'success', 'failed', 'pending'
    message_id?: string;

    createdAt: Date;
};
export type AttachmentPayload = {
    price?: string;
    title?: string;
    caption?: string;
    reply_message_id?: string;
    reply_text?: string;
    reply_from?: {
        id: string;
        first_name: string;
        username: string;
        is_bot: boolean;
    };
    description?: string;
    photo_url?: string;
    duration?: number;
    width?: number;
    height?: number;
};
