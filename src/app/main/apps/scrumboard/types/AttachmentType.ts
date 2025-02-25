/**
 * Attachment Type
 */
export type AttachmentType = {
    attachment_id: string;
    attachment_name: string;
    attachment_src: string;
    time: number;
    attachment_type: string;
    attachment_url?: string;
    attachment_extension?: string;
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
