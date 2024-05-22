import { ChecklistType } from './ChecklistType';
import { CommentsType } from './CommentType';
import { AttachmentType } from './AttachmentType';
import { ContactType } from '../../contacts/types/ContactType';

export type LabelId = string;

type MemberId = string;

/**
 * Card Type
 */
export type CardType = {
    card_id: string;
    board_id: string;
    list_id: string;
    contact_id: string;
    card_deal_manager: string;
    card_deal_manager_email: string;
    card_deal_title: string;
    card_deal_description: string;
    card_labels: LabelId[];
    dueDate: number;
    card_attachmentCoverId: string;
    memberIds: MemberId[];
    attachments: AttachmentType[];
    card_subscribed: boolean;
    card_checklists: CommentsType;
    card_deal_files: string[];

    card_deal_num: string;
    card_deal_price: number;
    card_deal_left_cost: string;
    card_deal_payed_money: string;
    card_deal_status: string;
    left_cost_money;
    card_deal_pay_url: string;
    card_deal_url: string;
    card_client_url: string;

    card_utm_source: string;
    card_utm_medium: string;
    card_utm_campaign: string;
    card_utm_content: string;
    card_utm_term: string;
    card_deal_created: string;
    card_deal_payed: string;
    createdAt: Date;
    contact: ContactType;
    activities: CommentsType;
};

/**
 * Cards Type
 */
export type CardsType = CardType[];
