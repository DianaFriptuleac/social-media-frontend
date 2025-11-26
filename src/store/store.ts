import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./ptofileSlice";
import departmentUIReducer from "./departmentSlice";
import emptyApi from "../api/emptyApi";
//configureStore - crea lo store Redux in modo semplificato

export const store = configureStore({
    reducer: {
        auth: authReducer, // stato di login, logout, registrazione, errori, token ecc.
        profile: profileReducer, // stato di profilo (dati utente + departments)
        departmentUI: departmentUIReducer,

        [emptyApi.reducerPath] : emptyApi.reducer,   /// RTK Query
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(emptyApi.middleware),
    
});
// ReturnType<typeof store.getState>:
// prende automaticamente il tipo dello stato globale che ritorna getState()
// Serve per usare useSelector con i tipi corretti
export type RootState = ReturnType<typeof store.getState>;

// Tipizzare useDispatch() - evita errori nelle thunk
export type AppDispatch = typeof store.dispatch;
