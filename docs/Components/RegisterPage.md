**Componente `RegisterPage`** (`user registration page`)

*Serve per:*
- **permettere la registrazione di un nuovo utente**
- **gestire l’invio dei dati di registrazione al backend**
- **mostrare eventuali errori di registrazione**
- **reindirizzare l’utente al login dopo registrazione riuscita**

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
  - `React.FormEvent`
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
- `authApi`
  - `useRegisterMutation`

-------------------------------------------------------

**Stato locale**
- `name: string`
  - valore input nome
- `surname: string`
  - valore input cognome
- `email: string`
  - valore input email
- `password: string`
  - valore input password

-------------------------------------------------------

**Mutation RTK Query**
1. **`useRegisterMutation`**
   - chiama `POST /auth/register`
   - restituisce:
     - `isLoading`
     - `error`
   - non aggiorna direttamente lo store Redux

-------------------------------------------------------

**Funzioni principali**
1. **`handleSubmit`**
   - tipizzata con `React.FormEvent`
   - previene il submit nativo (`preventDefault`)
   - invia i dati di registrazione:
     - `name`
     - `surname`
     - `email`
     - `password`
   - utilizza `.unwrap()` per intercettare errori
   ******
   **Note su `.unwrap()`**:
   *`.unwrap()` serve per usare RTK Query con `async / await` e `try / catch` in modo pulito e naturale*
  *In pratica:*
    *-se la richiesta va a buon fine → la Promise risolve con data*
   *- se la richiesta fallisce → la Promise rigetta con l’errore*

   ******
   - se registrazione riuscita:
     - naviga verso `/login`

-------------------------------------------------------

**Gestione errori**
- il messaggio di errore viene ricavato da:
  - `error.data.message`
  - oppure `error.message`
- se presente:
  - viene mostrato un `Alert`

-------------------------------------------------------

**Comportamento UI**
- il pulsante `Registrati`:
  - è disabilitato quando `isLoading === true`
  - mostra testo:
    - `Registrazione...` durante la richiesta
    - `Registrati` quando inattivo
- i campi form sono:
  - obbligatori (`required`)
  - controllati tramite stato locale (`controlled inputs`)

-------------------------------------------------------

**Navigazione**
- dopo registrazione riuscita:
  - redirect automatico a `/login`
- link secondario:
  - `Login` → `/login`

-------------------------------------------------------

**Rendering condizionale**
- il messaggio di errore viene renderizzato solo se:
  - `errorMessage !== null`

-------------------------------------------------------

**Note**
- il componente **non autentica automaticamente l’utente**
- il login deve essere effettuato manualmente dopo la registrazione
- la logica di persistenza token è demandata al login
- il flusso di errore è gestito interamente dalla mutation RTK Query

-------------------------------------------------------

**File collegati**
- `src/api/authApi.ts`
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/auth.ts`
