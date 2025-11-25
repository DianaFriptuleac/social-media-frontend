// src/api/departmentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Department, DepartmentWithUsers } from '../types/departments';

// da RTK Query:
// - createApi: crea il "service" con tutte le chiamate
// - fetchBaseQuery: una fetch semplificata

// se hai già un baseUrl in env:
const baseUrl = 'http://localhost:3001';


// Creo l'API RTK Query per i departments - verranno generati:
// - reducer
// - middleware
// - hook React (useGetDepartmentsQuery, ecc.)
export const departmentApi = createApi({
    // nome del "pezzo" di store dove RTK Query salverà cache, stato, ecc.
    // diventerà la chiave nel reducer globale: state.departmentApi
    reducerPath: 'departmentApi',

    // baseQuery - funzione che effettua materialmente le richieste HTTP
    // fetchBaseQuery-fornito da RTK Query (usa la fetch API nativa)
    baseQuery: fetchBaseQuery({
        // prefisso fisso per tutte le chiamate di questa API
        baseUrl,
        // prepareHeaders - eseguito PRIMA di ogni richiesta (per aggiungere header comuni (es. Authorization))
        prepareHeaders: (headers, { getState }) => {

            // recupero lo stato globale Redux
            const state: any = getState();
            // token da authSlice
            const token = state.auth?.token;
            // se esiste-aggiungi l'header Authorization: Bearer <token>
            if (token) headers.set('Authorization', `Bearer ${token}`);
            // IMPORTANTISSIMO: bisogna SEMPRE restituire gli headers
            return headers;
        },
    }),
    // tagTypes definisce i "nomi" dei tag usati per cache invalidation
    // Usati poi con providesTags / invalidatesTags
    tagTypes: ['Departments', 'Department'],

    // Definisco tutti gli endpoint (GET, POST...)
    endpoints: (builder) => ({
        // builder.query = chiamata "di sola lettura" (GET)
        // <Department[], void> = tipo dei dati che tornano e tipo dell'argomento
        getDepartments: builder.query<Department[], void>({

            // query definisce URL (relativo al baseUrl)
            // qui nessun parametro, solo "/departments"
            query: () => '/departments',

            // questa query "fornisce" il tag "Departments"
            // quando faccio invalidatesTags: ['Departments'] RTK Query sa che deve ricaricare questa lista
            providesTags: ['Departments'],
        }),

        // --------------------GET /departments/{id} (singolo department con la lista utenti)----------------
        getDepartmentById: builder.query<DepartmentWithUsers, string>({
            // id-argomento passato all'hook (useGetDepartmentByIdQuery(id))
            query: (id) => `/departments/${id}`,

            // fornisce un tag specifico per QUEL department
            // se viene invalidato { type: 'Department', id }, solo lui viene ricaricato
            providesTags: (result, error, id) => [{ type: 'Department', id }],
        }),

        // ------------------  PUT /departments/{id} ---------------------------------------------------------
        // builder.mutation = chiamata che MODIFICA dati (POST/PUT/DELETE, ecc.)
        // <Department, Partial<Department> & { id: string }>
        // cosa ritorna il server (Department)
        // cosa passo alla mutation (un oggetto con id + campi da aggiornare)
        updateDepartment: builder.mutation<Department, Partial<Department> & { id: string }>({
            // query costruisce l'oggetto "request"
            query: ({ id, ...body }) => ({
                url: `/departments/${id}`,     // endpoint
                method: 'PUT',                 //method HTTP
                body,
            }),
            // quando aggiorno un department:
            // -ricaricare la lista di tutti (tag 'Departments')
            // -ricaricare il singolo (tag { type: 'Department', id })
            invalidatesTags: (result, error, { id }) => [
                'Departments',
                { type: 'Department', id },
            ],
        }),

        // ------------------------------------ POST /departments/assign ---------------------------
        //(assegna ruoli ad un utente in un department)
        //userId: string; departmentId: string; roles: string[]-> payload atteso
        assignRoles: builder.mutation<void, { userId: string; departmentId: string; roles: string[] }>({
            // payload "body" arriverà dalla mutation hook
            query: (body) => ({
                url: '/departments/assign',
                method: 'POST',
                body,
            }),
            // dopo l'assegnazione ruoli - invalida il singolo department
            // la query getDepartmentById verrà ricaricata con i ruoli aggioranti
            invalidatesTags: (result, error, { departmentId }) => [
                { type: 'Department', id: departmentId },
            ],
        }),

        // ------------------------------  DELETE /departments/{departmentId}/members/{userId}------
        removeUserFromDepartment: builder.mutation<void, { departmentId: string; userId: string }>({
            query: ({ departmentId, userId }) => ({
                url: `/departments/${departmentId}/members/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { departmentId }) => [
                { type: 'Department', id: departmentId },
            ],
        }),
    }),
});

// Da questo "service" RTK Query genera automaticamente gli hook React.
// Questi hook li uso direttamente nei componenti:
//
// - useGetDepartmentsQuery()           → GET /departments
// - useGetDepartmentByIdQuery(id)      → GET /departments/{id}
// - useUpdateDepartmentMutation()      → mutation PUT (ritorna una funzione)
// - useAssignRolesMutation()           → mutation POST
// - useRemoveUserFromDepartmentMutation() → mutation DELETE
//
export const {
    useGetDepartmentsQuery,
    useGetDepartmentByIdQuery,
    useUpdateDepartmentMutation,
    useAssignRolesMutation,
    useRemoveUserFromDepartmentMutation,
} = departmentApi;
