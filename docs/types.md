Cartella src/types/ (tipi TypeScript condivisi)
**Serve per:**
- centralizzare le interfacce e i type usati in tutta l’app (API, Redux slice, componenti)
- evitare duplicazioni e incoerenze nei campi (*id, role, avatar*, ecc.)
- tipizzare correttamente:
       - risposte del backend (DTO / paginazione)
       - stato Redux (`AuthState`, `ProfileState`)
       - dati per UI (es. `UserListItem`)
-----------------------------------------------------------------------------------------------------

**`auth.d.ts`** (auth types + auth store state)
*Gestisce*:
- modello utente base usato dopo il login
- stato della sezione auth nel Redux Store

*Tipi principali*
1. **User**
- rappresenta l’utente loggato salvato nello store
- usato da:
    - `authSlice` (user + token)
    - `emptyApi.ts` (token in header)
    - pagine che mostrano dati del profilo/ruolo

**Campi**:
- id, name, surname, email
- `avatar?` → opzionale (può non esistere)
- `role → "ADMIN" | "USER" | string` (string per compatibilità se il backend aggiunge ruoli futuri)

2. **AuthState**
- rappresenta lo stato Redux per autenticazione:
     - `user: User | null`
     - `token: string | null`
     - `loading: boolean`
     - `error: string | null`

-----------------------------------------------------------------------------------------------------

** `departments.ts` ** (departments + users in department)
*Gestisce:*
- struttura dati dei reparti
- struttura dati dell’utente dentro un reparto (con ruoli)
- struttura “department completo” con lista utenti

*Tipi principali*
1. **Department**
- modello base reparto:
id, name, description

2. **UserInDepartment**
- rappresenta un utente dentro un reparto
include i ruoli nel reparto:
 - `roles: string[]`

**Note:**
`avatar?: string | null` → può mancare oppure essere `null` (dipende dal backend)

3. **DepartmentWithUsers**
- reparto + metadati + elenco utenti:
- `userCount` → numero utenti (utile per UI)
- `users: UserInDepartment[]` → lista completa

4. **RolePickerProps**
- le props del componente UI per la gestione dei ruoli utente nei department
- `availableRoles` → ruoli suggeriti/selezionabili (es. MANAGER, HR, IT)
- `disabledRoles?` → ruoli non cliccabili (es. già assegnati all’utente nel department)
- `onToggle` → callback per aggiungere/rimuovere un ruolo dalla selezione
- `onAddCustom` → callback per aggiungere un ruolo inserito manualmente
-----------------------------------------------------------------------------------------------------

**`profile.ts`** (profile + users list + pagination)
*Gestisce:*
- dati del profilo dell’utente loggato
- reparti dell’utente con ruoli
- modello della lista utenti (admin)
- paginazione standard del backend

*Tipi principali*
1. **UserDepartmentRolesView**
rappresenta “utente loggato, reparti, ruoli”
*campi:*
`departmentId`
`departmentName`
`roles: string[]`

2.**ProfileState**
stato Redux della sezione profilo:
- `profile: User | null` → dettagli utente loggato
- `departments: UserDepartmentRolesView[]` → reparti + ruoli
- `loading: boolean`
- `error: string | null`

3. **Role** alias di ruolo base:
`"ADMIN" | "USER"`
usato per uniformare i ruoli lato UI/API (es. lista utenti)

4. **UserListItem** rappresenta una riga della tabella “Users” (admin)
*campi tipici UI:*
- `id, name, surname, email`
- `avatar` (qui non è opzionale → la UI si aspetta una stringa)
- `role: Role`
- `username`

5. **PageResponse<T>**
struttura generica paginata (standard backend):
- `content: T[]` → dati della pagina
- `totalElements` → totale record
- `totalPages` → totale pagine
- `number` → indice pagina (0-based)
- `size` → page size

Usato in: `userApi.ts` → `getAllUsers` ritorna `PageResponse<UserListItem>`