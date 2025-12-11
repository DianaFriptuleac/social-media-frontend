import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState, UserDepartmentRolesView } from "../types/profile";
import type { User } from "../types/auth";



const initialState: ProfileState = {
    profile: null,
    departments: [],
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        profileStarted(state) {
            state.loading = true;
            state.error = null;
        },
        profileFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        profileLoaded(state, action: PayloadAction<User>) {
            state.loading = false;
            state.error = null;
            state.profile = action.payload;
        },
        departmentsLoaded(
            state,
            action: PayloadAction<UserDepartmentRolesView[]>
        ) {
            state.loading = false;
            state.error = null;
            state.departments = action.payload;
        },
        profileUpdated(state, action: PayloadAction<User>) {
            state.loading = false;
            state.error = null;
            state.profile = action.payload;
        },
        avatarUpdated(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = null;
            if (state.profile) {
                state.profile = {
                    ...state.profile,
                    avatar: action.payload,
                };
            }
        },
        resetProfile() {
            return initialState;
        }
    }
});
export const {
    profileStarted,
    profileFailed,
    profileLoaded,
    departmentsLoaded,
    profileUpdated,
    avatarUpdated,
} = profileSlice.actions;

export default profileSlice.reducer; 