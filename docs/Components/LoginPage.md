**Componente `LoginPage`** (`login page`)

*Serve per:*
- **permettere all’utente di effettuare il login**
- **gestire l’autenticazione tramite RTK Query**
- **mostrare errori di login**
- **reindirizzare l’utente dopo login riuscito**

-------------------------------------------------------

**Dipendenze principali**
- `react-router-dom`
  - `useNavigate`
  - `Link`
- `react-bootstrap`
  - `Container`
  - `Row`
  - `Col`
  - `Form`
  - `Button`
  - `Alert`
- `redux store`
  - `useAppSelector`
- `authApi`
  - `useLoginMutation`

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.loading`
  - usato per disabilitare il pulsante di submit
- `state.auth.error`
  - usato per mostrare messaggi di errore

-------------------------------------------------------

**Stato locale**
- `email: string`
  - valore input email
- `password: string`
  - valore input password

-------------------------------------------------------

**Mutation RTK Query**
1. **`useLoginMutation`**
   - chiama `POST /auth/login`
   - aggiorna automaticamente `authSlice` tramite `onQueryStarted`
   - gestisce token e utente loggato

-------------------------------------------------------

**Funzioni principali**
1. **`handleSubmit`**
   - previene il submit nativo (`preventDefault`)
   - chiama la mutation `login({ email, password })`
   - usa `.unwrap()` per intercettare errori
   - se login riuscito:
     - naviga verso `/home`

-------------------------------------------------------

**Comportamento UI**
- il pulsante `Login`:
  - è disabilitato quando `loading === true`
  - mostra testo:
    - `Logging in...` durante la richiesta
    - `Login` quando inattivo
- se `error` è presente:
  - viene mostrato un `Alert`

-------------------------------------------------------

**Validazione**
- campi `email` e `password`:
  - obbligatori (`required`)
  - controllati tramite stato locale (`controlled inputs`)

-------------------------------------------------------

**Navigazione**
- dopo login riuscito:
  - redirect automatico a `/home`
- link secondario:
  - `Register` → `/register`

-------------------------------------------------------

**Rendering condizionale**
- messaggio di errore renderizzato solo se:
  - `error !== null`

-------------------------------------------------------

**Note**
- il componente **non aggiorna direttamente lo store**
- la logica di autenticazione è delegata a:
  - `authApi`
  - `authSlice`
- il flusso di errore è gestito centralmente in Redux

-------------------------------------------------------

**File collegati**
- `src/api/authApi.ts`
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/auth.ts`
