import { LabelsType } from './LabelType';
import { BoardListsType } from './BoardListType';

/**
 * Settings Type
 */
type SettingsType = {
    subscribed: boolean;
    cardCoverImages: boolean;
};

/**
 * Board Type
 */
export type BoardType = {
    board_id: string;
    board_title: string;
    board_description: string;
    lastActivity: string;
    board_icon: string;
    board_members: string[];
    settings: SettingsType;
    board_lists: BoardListsType;
    labels: LabelsType;
};

/**
 * Boards Type
 */
export type BoardsType = BoardType[];
