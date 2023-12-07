import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { getChatList } from './chatListSlice';
import { ChatMessagesType, ChatMessageType } from '../types/ChatMessageType';
import { ContactType } from '../types/ContactType';

type AppRootStateType = RootStateType<chatMessagesSliceType>;

/**
 * Get chat
 */
export const getMessages = createAppAsyncThunk<ChatMessagesType, ChatMessageType['chat_id']>(
    'chatApp/chat/getMessages',
    async (chat_id) => {
        const response = await axios.get(`/api/messages/${chat_id}`);

        const data = (await response.data) as ChatMessagesType;

        return data;
    },
);

/**
 * Send message
 */
export const sendMessage = createAppAsyncThunk<
    ChatMessageType,
    {
        message_value: string;
        chat_id: string;
        user_id: string;
        message_type: string;
        contact_id: string;
    }
>('chatApp/chat/sendMessage', async (params, { dispatch }) => {
    const response = await axios.post(`/api/messages/`, params);

    const data = (await response.data) as ChatMessageType;

    dispatch(getChatList());

    return data;
});

const initialState: ChatMessagesType = [];

/**
 * Chat App Chat Messages Slice
 */
export const chatMessagesSlice = createSlice({
    name: 'chatApp/messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.fulfilled, (state, action) => action.payload)
            .addCase(sendMessage.fulfilled, (state, action) => [...state, action.payload]);
    },
});

export const selectMessages = (state: AppRootStateType) => state.chatApp.messages;

export type chatMessagesSliceType = typeof chatMessagesSlice;

export default chatMessagesSlice.reducer;
