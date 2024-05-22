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
    attachment_market?: {
        price: string;
        title: string;
        photo_url: string;
        description: string;
    };
    createdAt: Date;
};
