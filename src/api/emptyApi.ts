import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store/store';

// da RTK Query:
// - createApi: crea il "service" con tutte le chiamate
// - fetchBaseQuery: una fetch semplificata
const baseUrl = 'http://localhost:3001';

const emptyApi = createApi({
    // nome del "pezzo" di store dove RTK Query salverà cache, stato, ecc.
    // diventerà la chiave nel reducer globale: state.api
    reducerPath: 'api', // un solo reducerPath per tutte le API
    // baseQuery - funzione che effettua materialmente le richieste HTTP
    // fetchBaseQuery-fornito da RTK Query (usa la fetch API nativa)
    baseQuery: fetchBaseQuery({
        // prefisso fisso per tutte le chiamate di questa API
        baseUrl,
        // prepareHeaders - eseguito PRIMA di ogni richiesta (per aggiungere header comuni (es. Authorization))
        prepareHeaders: (headers, { getState }) => {
            // recupero lo stato globale Redux
            const state = getState() as RootState;
            const token = state.auth?.token;    // token da authSlice

            // se esiste-aggiungi l'header Authorization: Bearer <token>
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            // IMPORTANTISSIMO: bisogna SEMPRE restituire gli headers
            return headers;
        },
    }),
    // Elenco dei "nomi" dei tag che usero in TUTTE le API iniettate
    // (Departments, Department, MyProfile, ecc...)
    tagTypes: ['Departments', 'Department'],

    endpoints: () => ({}),   // nessun endpoint qui, li inietto dopo
});

export default emptyApi;
