import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { getChatList } from './chatListSlice';
import { ChatMessagesType, ChatMessageType } from '../types/ChatMessageType';
import { ContactType } from '../types/ContactType';
import { File } from 'buffer';

type AppRootStateType = RootStateType<chatMessagesSliceType>;

type UploadedFile = {
    id: string; // Уникальный ID для удаления
    file: File;
    preview: string; // Локальное превью
    from: string;
};

/**
 * Get chat
 */
export const getMessages = createAppAsyncThunk<ChatMessagesType, ChatMessageType['chat_id']>(
    'chatApp/messages/getMessages',
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
        manager_id: string;
        message_type: string;
        message_from: string;
        contact_id: string;
        messenger_type?: string;
        messenger_id?: string;
        attachments: UploadedFile[];
    }
>('chatApp/messages/sendMessage', async (params, { dispatch }) => {
    console.log('sendMessage', params);

    const formData = new FormData();
    formData.append('message_value', params.message_value);
    formData.append('chat_id', params.chat_id);
    formData.append('manager_id', params.manager_id);
    formData.append('message_type', params.message_type);
    formData.append('message_from', params.message_from);
    formData.append('contact_id', params.contact_id);

    if (params.messenger_type) {
        formData.append('messenger_type', params.messenger_type);
    }
    if (params.messenger_id) {
        formData.append('messenger_id', params.messenger_id);
    }

    // Добавляем файлы в FormData
    params.attachments.forEach((attachment) => {
        if (attachment.file instanceof Blob) {
            console.log('Да Blob');
            formData.append('attachments', attachment.file); // <-- [] добавляет массив
        }
    });

    console.log('formData', formData);

    const response = await axios.post(`/api/messages`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const data = (await response.data) as ChatMessageType;
    return data;
});

export const sendMessageFromGetcourse = createAppAsyncThunk<
    ChatMessageType,
    {
        contact_email: string;
        contact_name: string;
        contact_phone: string;
        contact_getcourse_link: string;
        message_value: string;
        manager_id: string;
        message_type: string;
        messenger_type: string;
        messenger_id: string;
    }
>('chatApp/messages/sendMessage', async (params, { dispatch }) => {
    console.log('sendMessage', params);
    const response = await axios.post(`/api/wa/fromgetcourse`, params);

    const data = (await response.data) as ChatMessageType;

    //dispatch(getChatList());

    return data;
});

const initialState: ChatMessagesType = [];

/**
 * Chat App Chat Messages Slice
 */
export const chatMessagesSlice = createSlice({
    name: 'chatApp/messages',
    initialState,
    reducers: {
        addNewMessage: (state, action) => {
            state.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, (state, action) => []),
            builder
                .addCase(getMessages.fulfilled, (state, action) =>
                    action.payload.sort(
                        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
                    ),
                )
                .addCase(sendMessage.fulfilled, (state, action) => [...state, action.payload]);
    },
});

export const selectMessages = (state: AppRootStateType) => state.chatApp.messages;
export const { addNewMessage } = chatMessagesSlice.actions;

export type chatMessagesSliceType = typeof chatMessagesSlice;

export default chatMessagesSlice.reducer;
