import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { LabelType, LabelsType } from '../types/LabelType';
import { CommentsType, CommentType } from '../types/CommentType';

type AppRootStateType = RootStateType<CommentsSliceType>;

/**
 * Get Labels
 */
interface dtoCreate {
    user_id: string;
    comment_message: string;
    comment_type: string;
    card_id: string;
}

export const createComment = createAppAsyncThunk<CommentType, dtoCreate>(
    'scrumboardApp/comments/createComment',
    async (dto) => {
        const response = await axios.post(`/api/scrumboard/boards/comments/add`, dto);
        const data = (await response.data) as CommentType;

        return data;
    },
);

const commentsAdapter = createEntityAdapter<CommentType>({});

const initialState: {
    comment: CommentType | null;
} = {
    comment: null,
};

/**
 * The Scrumboard Labels Slice.
 */
export const commentsSlice = createSlice({
    name: 'scrumboardApp/comments',
    initialState,
    reducers: {
        resetComments: () => {},
    },
    extraReducers: (builder) => {
        builder.addCase(createComment.fulfilled, (state, action) => {
            state.comment = action.payload as CommentType;
        });
    },
});

export const { resetComments } = commentsSlice.actions;

export const selectComment = (state: AppRootStateType) => state.scrumboardApp.comments.comment;

export type CommentsSliceType = typeof commentsSlice;

export default commentsSlice.reducer;
