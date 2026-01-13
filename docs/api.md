*Questa cartella contiene tutto lo strato di comunicazione col backend usando Redux Toolkit Query (RTK Query).*

**Obiettivi principali:**
- centralizzare le chiamate HTTP
- gestire caching, loading/error state e refetch automatici
- allegare il token JWT in automatico alle richieste (Authorization header)
- generare hook React pronti all’uso (useLoginMutation, useGetAllUsersQuery, ecc.)

**Struttura**
1. **`emptyApi.ts`** → base “service” RTK Query condiviso (baseUrl, headers, tagTypes)
2. **`authApi.ts`** → endpoint autenticazione (login, register) + aggiornamento authSlice
3. **`department.ts`** → endpoint departments + invalidazione cache con tag
4. **`userApi.ts`** → endpoint utente/profilo/lista utenti/ruoli + sync con profileSlice

-----------------------------------------------------------------------------------------------------

**1. `emptyApi.ts`** (foundation)
*Questo file crea l’istanza principale di RTK Query tramite `createApi()`.*
*Gli endpoint veri non sono definiti qui, ma vengono “iniettati” dai file **`authApi.ts`**, **`userApi.ts`**, ecc. tramite injectEndpoints.*

**Cosa fa**
1. Imposta *`baseUrl`* (che attualmente è `http://localhost:3001`)
2. Configura *`prepareHeaders`*:
- legge *`state.auth.token`*
- se presente aggiunge: *`Authorization: Bearer <token>`*
3. Definisce *`tagTypes`* globali:
- Departments
- Department
- Users
4. Imposta *reducerPath: 'api'* (la cache RTK Query vive in **`state.api`**)

**è il punto unico per:**
- `token auth`
- `base url`
- `tag types`
*garantisce coerenza tra tutte le API (un solo “service”)*

-----------------------------------------------------------------------------------------------------

**2.`authApi.ts`** (authentication)
*Define gli endpoint di autenticazione iniettandoli dentro **`emptyApi`**.*
**Endpoint**
*1. `login — POST /auth/login`*
- Input: `{ email, password }`
- Output: `LoginResponce` (token + dati utente)
- Effetto collaterale (side effect) importante:
            - **`onQueryStarted`** fa dispatch su **`authSlice`**:
            - **`authStarted()`**
            - **`authSuccess({ user, token })`** se ok
            - **`authFailed(msg)`** se errore
Il login non è solo una chiamata, ma aggiorna anche lo stato globale di autenticazione.

*2. `register — POST /auth/register`*
- Input: dati registrazione
- Output: `User`
- Non aggiorna lo slice: dopo register l’utente fa login normalmente.
**Hook esportati:**
- **`useLoginMutation()`**
- **`useRegisterMutation()`**
-----------------------------------------------------------------------------------------------------

**3.`department.ts`** (departments management)
*Gestisce i reparti e le relazioni utenti/ruoli in reparto.*
**Endpoint**
*1.`getDepartments — GET /departments`*
- ritorna **`Department[]`**
- `providesTags: ['Departments']`
- permette refetch automatico quando invalidato

*2.`getDepartmentById — GET /departments/{id}`*
- ritorna **`DepartmentWithUsers`**
- `providesTags: [{ type: 'Department', id }]`
- cache specifica per singolo department

*3.`updateDepartment — PUT /departments/{id}`*
- aggiorna un reparto
- **invalidatesTags:**
         -`'Departments'` (lista)
         - `{ type: 'Department', id }` (singolo)

*4.`assignRoles — POST /departments/assign`*
- assegna ruoli a un utente dentro un department
- invalida solo il department coinvolto:
      - `{ type: 'Department', id: departmentId }`

*5.`removeUserFromDepartment — DELETE /departments/{departmentId}/members/{userId}`*
- rimuove utente dal reparto
- invalida il department coinvolto

**Hook esportati**
**`useGetDepartmentsQuery()`**
**`useGetDepartmentByIdQuery(id)`**
**`useUpdateDepartmentMutation()`**
**`useAssignRolesMutation()`**
**`useRemoveUserFromDepartmentMutation()`**

-----------------------------------------------------------------------------------------------------

**userApi.ts** (`user/profile/users list`)
*Gestisce:*
- profilo dell’utente loggato
- reparti dell’utente loggato
- update profilo e avatar
- funzioni admin: cambio ruolo
- lista utenti paginata

*Endpoint principali*
*1.`getMyProfile — GET /user/me`*
- ritorna **`User`**
- usa **`onQueryStarted`** per sincronizzare **`profileSlice`**:
            - **`profileStarted()`**
            - **`profileLoaded(data)`**
            - **`profileFailed(msg)`**

*2.`getMyDepartments — GET /user/me/departments`*
- ritorna **`UserDepartmentRolesView[]`**
- aggiorna **`profileSlice`** (departmentsLoaded)

*3.`updateMyProfile — PUT /user/me`*
- aggiorna i dati utente
- aggiorna `profileSlice` (profileUpdated)

*4.`uploadAvatar — PATCH /user/me/avatar`*
- manda `FormData` (file)
- aggiorna lo slice con `avatarUpdated(avatarUrl)`

*5. `updateUserRole — PATCH /user/{userId}/role`* (solo ADMIN)
- invalida cache con tag:
            - `{ type: "Users", id: userId }`
            - `{ type: "Users", id: "LIST" }`
Così si aggiornano automaticamente:
- il singolo utente (badge/ruolo)
- le liste paginated

*6 `getAllUsers — GET /user?page=&size=` (solo ADMIN)*
- ritorna `PageResponse<UserListItem>`
- `providesTags`:
      - tag per ogni user id
      - tag "LIST" per invalidare liste

**Hook esportati**
`useGetMyProfileQuery()`
`useGetMyDepartmentsQuery()`
`useUpdateMyProfileMutation()`
`useUploadAvatarMutation()`
`useUpdateUserRoleMutation()`
`useGetAllUsersQuery({ page, size })`