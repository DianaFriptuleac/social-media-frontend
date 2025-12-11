import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStarted(state) {
            state.loading = true;
            state.error = null;
        },

        authSuccess(
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;

            // salvo nel localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        authFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        //Logout
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        // Ricarica utente/token salvati nel localStorage quando l’app parte
        loadFromStorage(state) {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                state.token = token;
                state.user = JSON.parse(userStr) as User;
            }
        },
    }
});

export const {
    authStarted,
    authSuccess,
    authFailed,
    logout,
    loadFromStorage
} = authSlice.actions;
export default authSlice.reducer;

