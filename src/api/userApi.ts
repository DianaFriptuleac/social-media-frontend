import { avatarUpdated, departmentsLoaded, profileFailed, profileLoaded, profileStarted, profileUpdated } from "../store/profileSlice";
import type { User } from "../types/auth";
import type { PageResponse, UserListItem, UserDepartmentRolesView } from "../types/profile";
import emptyApi from "./emptyApi";


// Type of body x aggiornare il profilo (UserDTO del BE)
export interface UpdateUserBody {
    name: string;
    surname: string;
    email: string;
    password?: string;            // opzionale: se presente cambio, altrimenti no
}

// Interface for the change the user Role (only for ADMIN)
export interface UpdateRoleBody {
    userId: string,
    role: "ADMIN" | "USER";
}

export const userApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({
        // ---------------------------------------------------------
        //GET /user/me - profile (legge profilo utente)
        getMyProfile: build.query<User, void>({
            //build.query<TipoRisposta, TipoArgomento>
            // qui: nessun argomento - void
            query: () => ({
                url: '/user/me',
                method: 'GET',
            }),
            // onQueryStarted viene chiamata PRIMA della fetch
            // e permette di fare "side-effects" come dispatchare azioni Redux
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                // "_" = il parametro della query (che non esiste - void)
                // Metto "_" perché è sintassi standard per dire:
                // "Questo argomento c’è ma non lo uso"
                dispatch(profileStarted()); // setto loading=true
                try {
                    // queryFulfilled = Promise che rappresenta la risposta della fetch
                    // è equivalente a `await fetch(...)` ma gestita da RTK Query
                    const { data } = await queryFulfilled;
                    // quando arriva la risposta → aggiorno Redux
                    dispatch(profileLoaded(data));
                } catch (err: any) {
                    // se la fetch fallisce - messaggio di errore
                    const msg =
                        err?.error?.data?.message ||
                        err?.message ||
                        "Error fetching profile";
                    dispatch(profileFailed(msg));
                }
            },
        }),

        // ---------------------------------------------------------
        // GET /user/me/departments  -  Lista reparti dell’utente
        getMyDepartments: build.query<UserDepartmentRolesView[], void>({
            // Risposta = array di UserDepartmentRolesView
            // Nessun argomento = void
            query: () => ({
                url: "/user/me/departments",
                method: "GET",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(profileStarted());
                try {
                    const { data } = await queryFulfilled;
                    dispatch(departmentsLoaded(data));
                } catch (err: any) {
                    const msg =
                        err?.error?.data?.message ||
                        err?.message ||
                        "Error fetching departments";
                    dispatch(profileFailed(msg));
                }
            },
        }),

        // ---------------------------------------------------------
        // PUT /user/me
        updateMyProfile: build.mutation<User, UpdateUserBody>({
            // Risposta = User
            // Argomento = UpdateUserBody
            query: (body) => ({
                url: "/user/me",
                method: "PUT",
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(profileStarted());
                try {
                    const { data } = await queryFulfilled;
                    dispatch(profileUpdated(data));
                } catch (err: any) {
                    const msg =
                        err?.error?.data?.message ||
                        err?.message ||
                        "Error updating profile";
                    dispatch(profileFailed(msg));
                }
            },
        }),
        // ---------------------------------------------------------
        // PATCH /user/me/avatar
        uploadAvatar: build.mutation<{ avatarUrl: string }, File>({
            // Risposta = { avatarUrl: string }
            // Argomento = File
            query: (file) => {
                const formData = new FormData();
                formData.append("avatar", file);

                return {
                    url: "/user/me/avatar",
                    method: "PATCH",
                    // no Conten-Type - lo mette fetch
                    body: formData,
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(profileStarted());
                try {
                    const { data } = await queryFulfilled;
                    dispatch(avatarUpdated(data.avatarUrl));
                } catch (err: any) {
                    const msg =
                        err?.error?.data?.message ||
                        err?.message ||
                        "Error uploading avatar";
                    dispatch(profileFailed(msg));
                }
            },
        }),
        // ---------------------------------------------------------
        // PATCH /user/{userId}/role - Cambia ruolo utente (solo ADMIN)
        updateUserRole: build.mutation<User, UpdateRoleBody>({
            query: ({ userId, role }) => ({
                url: `/user/${userId}/role`,
                method: "PATCH",
                body: { role },
            }),
            /**
            * invalidatesTags: // Forza il refetch automatico di utenti e lista dopo il cambio ruolo
            * - segnala a RTK Query che, dopo questa mutation, i dati in cache NON sono più validi
            * Invalida:
            * - l'utente specifico (id) → per aggiornare badge/ruolo
            * - la LIST → per aggiornare le liste paginate
            * Le query che forniscono questi tag verranno refetchate automaticamente.
            */
            invalidatesTags: (_res, _err, arg) => [
                { type: "Users", id: arg.userId },
                { type: "Users", id: "LIST" },
            ],
        }),
         // ---------------------------------------------------------
        // GET/user/{id} - get single user
        getUserById: build.query<UserListItem, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: "GET",
            }),
            providesTags: (_res, _err, id) => [{ type: "Users", id }],
        }),
        // ---------------------------------------------------------
        // DELETE /user/{id} - delete user (ADMIN)
        deleteUserById: build.mutation<void, {userId: string}>({
            query: ({userId}) => ({
                url: `/user/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_res, _err, {userId}) => [
                {type: "Users", id: userId},
                {type: "Users", id: "LIST"}
            ],
        }),
        // ---------------------------------------------------------
        // GET/user - get All users
        getAllUsers: build.query<PageResponse<UserListItem>, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: "/user",
                method: "GET",
                params: { page, size },
            }),
            /**
            * providesTags: // Rende la lista e i singoli utenti "osservabili" da RTK Query
            * - indica a RTK Query quali "pezzi di cache" questa query fornisce
            * - la LIST serve per invalidare/refetchare l'intera lista utenti
            * - id servono per invalidare/refetchare un singolo utente
            * In questo modo, quando un utente viene aggiornato (es. cambio ruolo),
            * RTK Query sa automaticamente quali query devono essere ricaricate.
            */
            providesTags: (result) =>
                result
                    ? [
                        // tag per ogni singolo utente
                        ...result.content.map((u) => ({ type: "Users" as const, id: u.id })),
                        // tag per l'intera lista utenti
                        { type: "Users" as const, id: "LIST" },
                    ]
                    : [{ type: "Users" as const, id: "LIST" }],
        }),
    }),
    // Non sovrascrivere eventuali endpoint già presenti in emptyApi
    overrideExisting: false,
});

export const {
    useGetMyProfileQuery,
    useGetMyDepartmentsQuery,
    useUpdateMyProfileMutation,
    useUploadAvatarMutation,
    useUpdateUserRoleMutation,
    useGetUserByIdQuery,
    useDeleteUserByIdMutation,
    useGetAllUsersQuery,
} = userApi;