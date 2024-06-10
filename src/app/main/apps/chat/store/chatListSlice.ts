import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import { ChatListItemType } from '../types/ChatListItemType';
import { ChatListType } from '../types/ChatListType';
import { ContactType } from '../types/ContactType';

type AppRootStateType = RootStateType<chatListSliceType>;

/**
 * Get chat list
 */
export const getChatList = createAppAsyncThunk<ChatListType>('chatApp/chatList/get', async () => {
    const response = await axios.get(`/api/chat/chats`);

    const data = (await response.data) as ChatListType;

    return data;
});

export const getChatListPart = createAppAsyncThunk<
    ChatListType,
    { limit: number; filter?: string }
>('chatApp/chatList/getPart', async (data) => {
    const response = await axios.get(`/api/chat/part?limit=${data.limit}&filter=${data.filter}`);

    const chats = (await response.data) as ChatListType;

    return chats;
});

export const getChat = createAppAsyncThunk<ChatListItemType, ChatListItemType['chat_id']>(
    'chatApp/chatList/getOne',
    async (chat_id) => {
        const response = await axios.get(`/api/chat/${chat_id}`);
        const data = (await response.data) as ChatListItemType;

        return data;
    },
);

export const getChatByContactId = createAppAsyncThunk<ChatListItemType, ContactType['contact_id']>(
    'chatApp/chatList/getOneByContactId',
    async (contact_id) => {
        const response = await axios.get(`/api/chat/bycontact/${contact_id}`);
        const data = (await response.data) as ChatListItemType;
        return data;
    },
);

export const readChatMessages = createAppAsyncThunk<ChatListItemType, ChatListItemType['chat_id']>(
    'chatApp/chatList/read',
    async (chat_id) => {
        const response = await axios.patch(`/api/chat/${chat_id}/read-all`);
        const data = (await response.data) as ChatListItemType;
        getChatList();
        return data;
    },
);

export const updateOneChat = createAppAsyncThunk<ChatListItemType, ChatListItemType>(
    'chatApp/chatList/updateOneChat',
    async (body) => {
        const response = await axios.put(`/api/chat/${body.chat_id}`, body);
        const data = (await response.data) as ChatListItemType;

        return data;
    },
);

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
    reducers: {
        readChat(state, action) {
            console.log('action', action);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getChatList.fulfilled, (state, action) =>
            chatsAdapter.setAll(state, action.payload),
        );
        builder.addCase(getChatListPart.fulfilled, (state, action) =>
            chatsAdapter.setAll(state, action.payload),
        );

        builder.addCase(readChatMessages.fulfilled, (state, action) => {
            const updatedChat: ChatListItemType = action.payload;
            chatsAdapter.updateOne(state, { id: updatedChat.chat_id, changes: updatedChat });
        });
    },
});

export type chatListSliceType = typeof chatListSlice;
export const { readChat } = chatListSlice.actions;

export default chatListSlice.reducer;
