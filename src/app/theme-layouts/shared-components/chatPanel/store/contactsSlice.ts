import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { getMessages } from 'app/theme-layouts/shared-components/chatPanel/store/chatMessagesSlice';
import { ContactsType, ContactType } from '../types/ContactType';

export type AppRootStateType = RootStateType<contactsSliceType>;

/**
 * Get the contacts.
 */
export const getContacts = createAppAsyncThunk<ContactsType>(
    'chatPanel/contacts/getContacts',
    async () => {
        const response = await axios.get('/api/chat/contacts');

        const data = (await response.data) as ContactsType;

        return data;
    },
);

const contactsAdapter = createEntityAdapter<ContactType>();

const initialState = contactsAdapter.getInitialState({
    selectedContactId: '',
});

export const {
    selectAll: selectContacts,
    selectEntities: selectContactsEntities,
    selectById,
} = contactsAdapter.getSelectors((state: AppRootStateType) => state.chatPanel.contacts);

/**
 * The slice for the contacts.
 */
export const contactsSlice = createSlice({
    name: 'chatPanel/contacts',
    initialState,
    reducers: {
        setSelectedContactId: (state, action) => {
            state.selectedContactId = action.payload as string;
        },
        removeSelectedContactId: (state) => {
            state.selectedContactId = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getContacts.fulfilled, (state, action) =>
                contactsAdapter.setAll(state, action.payload),
            )
            .addCase(getMessages.pending, (state, action) => {
                state.selectedContactId = action.meta.arg;
            });
    },
});

export const selectSelectedContactId = (state: AppRootStateType) =>
    state.chatPanel.contacts.selectedContactId;

export const selectContactById = (id: ContactType['contact_id']) => (state: AppRootStateType) =>
    selectById(state, id);

export type contactsSliceType = typeof contactsSlice;

export default contactsSlice.reducer;
