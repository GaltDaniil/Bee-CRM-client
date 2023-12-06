import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { ContactsType, ContactType } from '../types/ContactType';

export type AppRootStateType = RootStateType<contactsSliceType>;

/**
 * Get contacts
 */
export const getContacts = createAppAsyncThunk<ContactsType>(
    'chatApp/contacts/getContacts',
    async () => {
        console.log('getContacts');
        const response = await axios.get('/api/chat/contacts');

        const data = (await response.data) as ContactsType;

        return data;
    },
);

const contactsAdapter = createEntityAdapter<ContactType>({
    selectId: (contact) => contact.contact_id,
});

const initialState = contactsAdapter.getInitialState();

export const {
    selectAll: selectContacts,
    selectEntities: selectContactsEntities,
    selectById,
} = contactsAdapter.getSelectors((state: AppRootStateType) => state.chatApp.contacts);

/**
 * Chat App Contacts Slice
 */
export const contactsSlice = createSlice({
    name: 'chatApp/contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getContacts.fulfilled, (state, action) =>
            contactsAdapter.setAll(state, action.payload),
        );
    },
});

export const selectContactById = (id: ContactType['contact_id']) => (state: AppRootStateType) =>
    selectById(state, id);

export type contactsSliceType = typeof contactsSlice;

export default contactsSlice.reducer;
