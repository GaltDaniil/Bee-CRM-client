import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import { ChatListItemType } from '../types/ChatListItemType';
import { ChatListType } from '../types/ChatListType';

type AppRootStateType = RootStateType<chatListSliceType>;

/**
 * Get chat list
 */
export const getChatList = createAppAsyncThunk<ChatListType>('chatApp/chatList/get', async () => {
    const response = await axios.get(`/api/chat/chats`);

    const data = (await response.data) as ChatListType;

    return data;
});

const chatsAdapter = createEntityAdapter<ChatListItemType>({
    selectId: (chat) => chat.chat_id,
});

const initialState = chatsAdapter.getInitialState();

export const {
    selectAll: selectChats,
    selectEntities: selectChatEntities,
    selectById,
} = chatsAdapter.getSelectors((state: AppRootStateType) => state.chatApp.chatList);

export const selectChatById = (id: ChatListItemType['chat_id']) => (state: AppRootStateType) =>
    selectById(state, id);
/**
 * Chat App Chat List Slice
 */
export const chatListSlice = createSlice({
    name: 'chatApp/chatList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getChatList.fulfilled, (state, action) =>
            chatsAdapter.setAll(state, action.payload),
        );
    },
});

export type chatListSliceType = typeof chatListSlice;

export default chatListSlice.reducer;
