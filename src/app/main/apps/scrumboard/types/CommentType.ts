/**
 * Comment Type
 */
export type CommentType = {
    comment_id: string;
    comment_type: string;
    user_id: string;
    comment_message: string;
    createdAt: number;
};

/**
 * Comments Type
 */
export type CommentsType = CommentType[];
