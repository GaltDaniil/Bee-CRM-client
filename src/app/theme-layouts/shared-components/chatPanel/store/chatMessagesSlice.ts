import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { getChatList } from './chatListSlice';
import { ChatMessagesType, ChatMessageType } from '../types/ChatMessageType';
import { ContactType } from '../types/ContactType';

type AppRootStateType = RootStateType<chatMessagesSliceType>;

/**
 * Get the chat messages.
 */
export const getMessages = createAppAsyncThunk<ChatMessagesType, ChatMessageType['chat_id']>(
    'chatPanel/messages/getMessages',
    async (chat_id) => {
        const response = await axios.get(`/api/chat/${chat_id}`);

        const data = (await response.data) as ChatMessagesType;

        return data;
    },
);

/**
 * Send a message.
 */
export const sendMessage = createAppAsyncThunk<
    ChatMessageType,
    { message_value: string; contact_id: ContactType['contact_id'] }
>('chatPanel/messages/sendMessage', async ({ message_value, contact_id }, { dispatch }) => {
    const response = await axios.post(`/api/chat/chats/${contact_id}`, message_value);

    const data = (await response.data) as ChatMessageType;

    dispatch(getChatList());

    return data;
});

const initialState: ChatMessagesType = [];

/**
 * The slice for the chat messages.
 */
export const chatMessagesSlice = createSlice({
    name: 'chatPanel/messages',
    initialState,
    reducers: {
        // removeChat: (state, action) => action.payload
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.fulfilled, (state, action) => action.payload)
            .addCase(sendMessage.fulfilled, (state, action) => [...state, action.payload]);
    },
});

export const selectChat = (state: AppRootStateType) => state.chatPanel.messages;

export type chatMessagesSliceType = typeof chatMessagesSlice;

export default chatMessagesSlice.reducer;
