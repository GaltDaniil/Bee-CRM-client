import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { AsyncStateType, RootStateType } from 'app/store/types';
import { ChatFullContactType, ContactsType, ContactType } from '../types/ContactType';
import { ChatListItemType } from '../types/ChatListItemType';

export type AppRootStateType = RootStateType<contactsSliceType>;

/**
 * Get contacts
 */
export const getContacts = createAppAsyncThunk<ContactsType>(
    'chatApp/contacts/getContacts',
    async () => {
        const response = await axios.get('/api/chat/contacts');

        const data = (await response.data) as ContactsType;

        return data;
    },
);

export const getContactByChatId = createAppAsyncThunk<
    ChatFullContactType,
    ChatListItemType['contact_id']
>('chatApp/contacts/getContacts', async (contact_id) => {
    const response = await axios.get(`/api/chat/contact/${contact_id}`);

    const data = (await response.data) as ChatFullContactType;

    return data;
});

const initialState: AsyncStateType<ChatFullContactType> = {
    data: null,
    status: 'idle',
};

/**
 * Chat App Contacts Slice
 */
export const contactsSlice = createSlice({
    name: 'chatApp/contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getContactByChatId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getContactByChatId.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'succeeded';
            });
    },
});

export const selectChatContact = (state: AppRootStateType) => state.chatApp.contacts;

export type contactsSliceType = typeof contactsSlice;

export default contactsSlice.reducer;
