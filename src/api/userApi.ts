import { avatarUpdated, departmentsLoaded, profileFailed, profileLoaded, profileStarted, profileUpdated } from "../store/profileSlice";
import type { User } from "../types/auth";
import type { UserDepartmentRolesView } from "../types/profile";
import emptyApi from "./emptyApi";


// Type of body x aggiornare il profilo (UserDTO del BE)
export interface UpdateUserBody {
    name: string;
    surname: string;
    email: string;
    password?: string;            // opzionale: se presente cambio, altrimenti no
}


//GET /user/me - profile
/* export async function getMyProfileApi(token: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error fetching profile")
    }
    return res.json();

} */



// Get/user/me/departments
/* export async function getMyDepartmentsApi(token: string): Promise<UserDepartmentRolesView[]> {
    const res = await fetch(`${API_BASE_URL}/user/me/departments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error fetching departments")
    }
    return res.json();

} */
//PUT /user/me - aggiorna profilo
/* export async function updateMyProfileApi(token: string, body: UpdateUserBody): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error updating profile")
    }
    return res.json();

} */
//PATCH /user/me/avatar -> upload img
/* export async function uploadAvatarApi(token: string, file: File): Promise<{ avatarUrl: string }> {
    // FormData x multipart/form-data
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_BASE_URL}/user/me/avatar`, {
        method: 'PATCH',
        headers: {
            // No content-type, fetch lo setta da solo x FormData
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error uploading avatar")
    }
    return res.json();

} */
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
    }),
    // Non sovrascrivere eventuali endpoint già presenti in emptyApi
    overrideExisting: false,
});

export const {
    useGetMyProfileQuery,
    useGetMyDepartmentsQuery,
    useUpdateMyProfileMutation,
    useUploadAvatarMutation,
} = userApi;