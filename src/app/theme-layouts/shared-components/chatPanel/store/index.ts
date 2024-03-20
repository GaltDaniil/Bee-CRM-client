import { combineReducers } from '@reduxjs/toolkit';
import chatList from './chatListSlice';
import messages from './chatMessagesSlice';
import contacts from './contactsSlice';
import user from './userSlice';
import state from './stateSlice';

/**
 * Chat panel reducer.
 */
const reducer = combineReducers({
    user,
    contacts,
    chatList,
    messages,
    state,
});

export default reducer;
