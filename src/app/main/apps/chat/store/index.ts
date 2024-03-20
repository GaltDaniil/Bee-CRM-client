import { combineReducers } from '@reduxjs/toolkit';
import chatList from './chatListSlice';
import messages from './chatMessagesSlice';
import contacts from './contactsSlice';
import user from './userSlice';

/**
 * The reducer of the Chat app.
 */
const reducer = combineReducers({
    user,
    contacts,
    chatList,
    messages,
});

export default reducer;
