import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import axios from 'axios';
import { ChatListItemType } from '../../apps/chat/types/ChatListItemType';

export const addChatToContact = createAppAsyncThunk<
    ChatListItemType,
    { email: string; chat_id: string }
>('integrationApp/getcourse/addchat', async (body) => {
    const response = await axios.post(`/api/integration/getcourse/addchat`, body);

    const data = await response.data;

    return data;
});

const initialState = '';

export const getcourseSlice = createSlice({
    name: 'integrationApp/getcourse',
    initialState,
    reducers: {
        readChat(state, action) {
            console.log('action', action);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addChatToContact.fulfilled, (state, action) => {});
    },
});

export default getcourseSlice.reducer;
