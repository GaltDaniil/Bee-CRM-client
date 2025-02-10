/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { AppDispatchType, RootStateType } from 'app/store/types';
import { UserType } from 'app/store/user';
import { PartialDeep } from 'type-fest';
import axios, { AxiosError } from 'axios';
import jwtService from '../../auth/services/jwtService';
import createAppAsyncThunk from '../createAppAsyncThunk';
import { UserListType } from './UserListType';

type AppRootStateType = RootStateType<userSliceType>;

/**
 * Sets the user data in the Redux store and updates the login redirect URL if provided.
 */
export const setUser = createAsyncThunk('user/setUser', (user: UserType) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
        settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return Promise.resolve(user);
});

export const createUser = createAsyncThunk(
    'user/createUser',
    async (params: {
        user_name: string;
        user_password: string;
        user_email: string;
        user_role: string;
    }) => {
        const response = await axios.post('api/users', params);

        const data = (await response.data) as UserType;

        return data;
    },
);

/**
 * Updates the user's settings in the Redux store and returns the updated user object.
 */
export const updateUserSettings = createAppAsyncThunk(
    'user/updateSettings',
    async (settings: FuseSettingsConfigType, { dispatch, rejectWithValue, getState }) => {
        const AppState = getState() as AppRootStateType;
        const { user } = AppState;

        const isUserGuest = selectIsUserGuest(AppState);

        if (isUserGuest) {
            return null;
        }

        const userRequestData = { data: { ...user.data, settings } } as UserType;

        try {
            const response = await jwtService.updateUserData(userRequestData);

            dispatch(showMessage({ message: 'User settings saved with api' }));

            return response.data as UserType;
        } catch (error) {
            const axiosError = error as AxiosError;

            dispatch(showMessage({ message: axiosError.message }));

            return rejectWithValue(axiosError.message);
        }
    },
);

/**
 * Updates the user's shortcuts in the Redux store and returns the updated user object.
 */
export const updateUserShortcuts = createAppAsyncThunk(
    'user/updateShortucts',
    async (shortcuts: string[], { dispatch, getState, rejectWithValue }) => {
        const AppState = getState() as AppRootStateType;
        const { user } = AppState;

        const isUserGuest = selectIsUserGuest(AppState);

        if (isUserGuest) {
            return null;
        }

        const userRequestData = { data: { ...user.data, shortcuts } } as PartialDeep<UserType>;

        try {
            const response = await jwtService.updateUserData(userRequestData);

            dispatch(showMessage({ message: 'User shortcuts saved with api' }));

            return response.data as UserType;
        } catch (error) {
            const axiosError = error as AxiosError;

            dispatch(showMessage({ message: axiosError.message }));

            return rejectWithValue(axiosError.message);
        }
    },
);

/**
 * Logs the user out and resets the Redux store.
 */
export const logoutUser =
    () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
        const AppState = getState() as AppRootStateType;

        const isUserGuest = selectIsUserGuest(AppState);

        if (isUserGuest) {
            return null;
        }

        history.push({
            pathname: '/',
        });

        dispatch(setInitialSettings());

        return Promise.resolve(dispatch(userLoggedOut()));
    };

/**
 * Updates the user's data in the Redux store and returns the updated user object.
 */
export const updateUserData = createAppAsyncThunk<UserType, PartialDeep<UserType>>(
    'user/update',
    async (userRequestData, { dispatch, rejectWithValue, getState }) => {
        const AppState = getState() as AppRootStateType;

        const isUserGuest = selectIsUserGuest(AppState);

        if (isUserGuest) {
            return null;
        }

        try {
            const response = await jwtService.updateUserData(userRequestData);

            dispatch(showMessage({ message: 'User data saved with api' }));

            return response.data as UserType;
        } catch (error) {
            const axiosError = error as AxiosError;

            dispatch(showMessage({ message: axiosError.message }));

            return rejectWithValue(axiosError.message);
        }
    },
);

/**
 * The initial state of the user slice.
 */
const initialState: UserType = {
    user_id: '',
    user_role: [], // guest
    data: {
        user_name: '',
        user_photo_url: '',
        user_email: '',
        user_shortcuts: [],
    },
};

/**
 * The User slice
 */
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLoggedOut: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUser.fulfilled, (state, action) => action.payload)
            .addCase(updateUserData.fulfilled, (state, action) => action.payload)
            .addCase(updateUserShortcuts.fulfilled, (state, action) => {
                state.data.user_shortcuts = action.payload.data.user_shortcuts;
            })
            .addCase(updateUserSettings.fulfilled, (state, action) => {
                state.data.settings = action.payload.data.settings;
            });
    },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = (state: AppRootStateType) => state.user;

export const selectUserRole = (state: AppRootStateType) => state.user.user_role;

export const selectIsUserGuest = (state: AppRootStateType) => {
    const { user_role } = state.user;

    return !user_role || user_role.length === 0;
};

export const selectUserShortcuts = (state: AppRootStateType) => state.user.data.user_shortcuts;

export type userSliceType = typeof userSlice;

export default userSlice.reducer;
