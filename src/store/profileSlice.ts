import { createAsyncThunk, createSlice, isRejectedWithValue, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState, UserDepartmentRolesView } from "../types/profile";
import type { User } from "../types/auth";
//import type { RootState } from "./store";
//import { getMyDepartmentsApi, getMyProfileApi, updateMyProfileApi, uploadAvatarApi } from "../api/userApi";


const initialState: ProfileState = {
    profile: null,
    departments: [],
    loading: false,
    error: null,
};

/* // Thrunk carica profile
export const fetchProfileThunk = createAsyncThunk<
    User, // tipo di ritorno
    void, // nessun argomento (payload)
    { state: RootState } // per tipizzare getState
>("profile/fetchProfile", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState();
        const token = state.auth.token;

        if (!token) {
            throw new Error("User not authenticated");
        }
        // Chiamata API: /user/me
        const profile = await getMyProfileApi(token);
        return profile;
    } catch (err: any) {
        return rejectWithValue(err.message || "Error fetching profile");
    }
});

// Thrunk carica reparti e ruoli user
export const fetchDepartmentsThunk = createAsyncThunk<
    any,   // o UserDDepartmentRoleView[]
    void,
    { state: RootState }
>("profile/fetchDepartments", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState();
        const token = state.auth.token;

        if (!token) {
            throw new Error("User not authenticated");
        }
        // Chiamata API: /user/me/departments
        const departments = await getMyDepartmentsApi(token);
        return departments;
    } catch (err: any) {
        return rejectWithValue(err.message || "Error fetching profile");
    }
});

// Thrunk update profile
export const updateProfileThunk = createAsyncThunk<
    User,
    { name: string; surname: string; email: string; password?: string },
    { state: RootState }
>("profile/updateProfile", async (payload, { getState, rejectWithValue }) => {
    try {
        const state = getState();
        const token = state.auth.token;

        if (!token) {
            throw new Error("User not authenticated");
        }
        const updated = await updateMyProfileApi(token, payload);
        return updated;
    } catch (err: any) {
        return rejectWithValue(err.message || "Error updating profile");
    }
});

// Thrunk upload avatar
export const uploadAvatarThunk = createAsyncThunk<
    string,   // ritorna il nuovo URL del avatar
    File,
    { state: RootState }
>("profile/uploadAvatar", async (file, { getState, rejectWithValue }) => {
    try {
        const state = getState();
        const token = state.auth.token;

        if (!token) {
            throw new Error("User not authenticated");
        }
        const res = await uploadAvatarApi(token, file);
        return res.avatarUrl;   // arrriva dal BE
    } catch (err: any) {
        return rejectWithValue(err.message || "Error uploading avatar");
    }
});

/* -------------------------- Slice Redux -------------------------- */
/*const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {// reducers normali (sincroni) -> resetProfile() ?}
    },

    //gestione dei vari casi dei thunk (pending/fulfilled/rejected)
    extraReducers: (builder) => {
        // fetchProfile
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchProfileThunk.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.loading = false;
                    state.profile = action.payload;
                }
            )
            .addCase(
                fetchProfileThunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
        //  fetchDepartments
        builder
            .addCase(fetchDepartmentsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentsThunk.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload - lista di UserDepartmentRolesView
                state.departments = action.payload;
            })
            .addCase(fetchDepartmentsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // updateProfile 
        builder
            .addCase(updateProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateProfileThunk.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.loading = false;
                    state.profile = action.payload; // aggiorno lo stato con i nuovi dati
                }
            )
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // uploadAvatar
        builder
            .addCase(uploadAvatarThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                uploadAvatarThunk.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    // aggiorno l'avatar nello stato, se il profilo esiste
                    if (state.profile) {
                        state.profile = {
                            ...state.profile,
                            avatar: action.payload,
                        };
                    }
                }
            )
            .addCase(uploadAvatarThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default profileSlice.reducer; */
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