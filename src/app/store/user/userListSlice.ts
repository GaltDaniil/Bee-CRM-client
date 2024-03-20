/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';
import { UserListType } from './UserListType';

type AppRootStateType = RootStateType<userListSliceType>;

export const getUsers = createAsyncThunk('userList/getUsers', async () => {
    const response = await axios.get('api/users');
    const data = (await response.data) as UserListType;
    return data;
});

const initialState: UserListType = [];

/**
 * The User slice
 */
export const userListSlice = createSlice({
    name: 'userList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => action.payload);
    },
});

export const selectUsers = (state: AppRootStateType) => state.userList;

export type userListSliceType = typeof userListSlice;

export default userListSlice.reducer;
