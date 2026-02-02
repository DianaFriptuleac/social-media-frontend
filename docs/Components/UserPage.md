**Componente `UserPage`** (`user profile page`)

*Serve per:*
- **mostrare il profilo dell’utente loggato**
- **mostrare departments e ruoli associati all’utente**
- **permettere la modifica dei dati del profilo**
- **gestire il cambio password**
- **gestire il caricamento dell’avatar**
- **mostrare il ruolo utente tramite badge/modale**

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
  - `useEffect`
  - `React.FormEvent`
- `redux store`
  - `useAppSelector`
- `userApi`
  - `useGetMyProfileQuery`
  - `useGetMyDepartmentsQuery`
  - `useUpdateMyProfileMutation`
  - `useUploadAvatarMutation`
- `react-bootstrap`
  - `Container`
  - `Row`
  - `Col`
  - `Card`
  - `Alert`
  - `Spinner`
  - `Form`
  - `ListGroup`
  - `Button`
  - `InputGroup`
- `react-icons`
  - `BsEye`
  - `BsEyeSlash`
- `UserRoleBadgeModal`

-------------------------------------------------------

**Query RTK Query**
1. **`useGetMyProfileQuery`**
   - carica i dati del profilo dell’utente loggato
   - aggiorna `profileSlice`

2. **`useGetMyDepartmentsQuery`**
   - carica i departments associati all’utente
   - aggiorna `profileSlice`

-------------------------------------------------------

**Mutazioni RTK Query**
1. **`useUpdateMyProfileMutation`**
   - aggiorna i dati del profilo (name/surname/email)
   - aggiorna password solo se inviata nel payload

2. **`useUploadAvatarMutation`**
   - carica un file immagine e aggiorna l’avatar profilo


-------------------------------------------------------

**Stato Redux utilizzato**
- `state.profile.profile`
- `state.profile.departments`
- `state.profile.loading`
- `state.profile.error`
- `state.auth.user`

-------------------------------------------------------

**Stato locale**
- `name: string`
- `surname: string`
- `email: string`
- `password: string`
- `showPassword: boolean`

-------------------------------------------------------

**Sincronizzazione stato**
- quando `profile` cambia:
  - `useEffect` aggiorna:
    - `name`
    - `surname`
    - `email`
- evita form vuoti al primo render

-------------------------------------------------------

**Funzioni principali**
1. **`handleSubmit`**
   - tipizzata come `React.FormEvent<HTMLFormElement>`
   - previene il submit nativo
   - costruisce il payload dinamicamente
   - include `password` **solo se valorizzata**
   - chiama `updateMyProfile(payload).unwrap()`
   - resetta il campo password
   - mostra messaggio di conferma

2. **`handleAvatarChange`**
   - legge il file selezionato
  - se non c’è file esce subito
   - chiama `uploadAvatar(file).unwrap()`
   - mostra messaggio di conferma

-------------------------------------------------------

**Layout**
- layout a **due colonne**
  - **colonna sinistra**
    - avatar
    - upload avatar
    - info utente
    - badge ruolo
    - lista departments e ruoli
  - **colonna destra**
    - form di modifica profilo

-------------------------------------------------------

**Rendering condizionale**
- `loading === true`
  - mostra spinner centrale
- `error !== null`
  - mostra alert globale
- avatar
  - mostrato solo se `profile.avatar` esiste
- lista departments
  - se vuota: `No departments assigned.`
  - altrimenti: elenco con `departmentName` e `roles`

-------------------------------------------------------

**Gestione password**
- campo opzionale
- visibilità password gestita da:
  - `showPassword`
- toggle con icone:
  - `BsEye` (mostra)
  - `BsEyeSlash` (nasconde)
- se password vuota:
  - **non viene inviata** al backend

-------------------------------------------------------

**Gestione ruolo utente**
- il ruolo è mostrato/gestito tramite `UserRoleBadgeModal`
- il componente riceve:
  - `currentRole` (cast a `"ADMIN" | "USER"`)
  - `userId`
  - `isCurrentUserAdmin`
- nota: nel codice `isCurrentUserAdmin` viene passato come:
  - `profile?.role === "ADMIN"`


-------------------------------------------------------

**Comportamento UI**
- pulsante `Save changes`:
  - disabilitato durante `loading`
  - mostra `Saving...` durante la richiesta
- upload avatar immediato al cambio file

-------------------------------------------------------

**Note**
- il componente **non gestisce autenticazione**
- assume che l’utente sia già autenticato
- la validazione avanzata è demandata al backend
- la gestione ruoli è visiva (badge/modale)

-------------------------------------------------------

**File collegati**
- `src/api/userApi.ts`
- `src/store/profileSlice.ts`
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/profile.ts`
- `src/types/auth.ts`
- `src/components/UserRoleBadgeModal.tsx`
