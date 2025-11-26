import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}

// (Metto i dati nello store)
//Login
// createAsyncThunk gestisce automaticamente pending / fulfilled / rejected
//pending (per mostrare lo spinner, disabilitare il bottone, azzerare eventuali errori)
//fulfilled (significa la promise è riuscita senza errori)
//rejected (mostrare un messaggio di errore, togliere lo spinner)

/* export const loginThunk = createAsyncThunk(
    'auth/login',   // nome action
    async (payload: { email: string; password: string }, { rejectWithValue }) => {
        try {
            // Chiamo l'API di login
            const res = await loginApi(payload.email, payload.password);
            // Mappo la risposta del backend nel tipo User che usa la mia app
            const user: User = {
                id: res.id,
                name: res.name,
                surname: res.surname,
                email: res.email,
                avatar: res.avatar,
                role: res.role,
            
            };
            // Valore che sarà disponibile in fulfilled
            return { user, token: res.accessToken };
        } catch (error: any) {
            // Se fallisce → rejected
            return rejectWithValue(error.message || "Login error")
        }
    }
);

// Register
export const registerThunk = createAsyncThunk(
    'auth/register',
    async (payload: { name: string; surname: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const user = await registerApi(payload);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Registration error")
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Logout: cancella utente e token dallo state e dal localStorage
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        // Ricarica utente/token salvati nel localStorage quando l’app parte
        loadFromStorage(state) {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (token && userStr) {
                state.token = token;
                state.user = JSON.parse(userStr);
            }
        },
    },

    // Gestione dei casi pending/fulfilled/rejected dei thunk asincroni
    extraReducers: (builder => {
        //Login
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;  // mostra spinner
                state.error = null;    // reset errori
            })
            .addCase(
                loginThunk.fulfilled,
                (state, action: PayloadAction<{ user: User; token: string }>) => {
                    state.loading = false;
                    state.user = action.payload.user;   // salvo user
                    state.token = action.payload.token; // salvo token
                    localStorage.setItem("token", action.payload.token);
                    localStorage.setItem("user", JSON.stringify(action.payload.user));

                }
            )
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;   // mostra errore
            });

        // Register
        builder
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                // Non salvo token - si rimanda al login
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }),
});
//azioni sincrone
export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;  // reducer da inserire nello store */
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

