**Componente `SingleUserDetail`**
(pagina di dettaglio di un singolo utente)

*Serve per:*
- **mostrare il dettaglio completo di un utente**
- **recuperare l’ID utente dalla rotta**
- **caricare i dati utente dal backend**
- **gestire stati di caricamento ed errore**
- **permettere la modifica del ruolo (solo ADMIN)**
- **consentire la navigazione di ritorno alla lista utenti**

-------------------------------------------------------

**Dipendenze principali**
- `react-router-dom`
  - `useParams`
  - `useNavigate`
- `react-bootstrap`
  - `Container`
  - `Row`
  - `Col`
  - `Card`
  - `Button`
  - `Alert`
  - `Spinner`
- `redux store`
  - `useAppSelector`
- `userApi`
  - `useGetUserByIdQuery`
- componenti collegati
  - `UserRoleBadgeModal`

-------------------------------------------------------

**Parametri di rotta**
- `id`
  - ID dell’utente
  - recuperato tramite `useParams`
- se `id` è assente:
  - mostra messaggio *Missing user id*
  - interrompe il rendering della pagina

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.user`
  - usato per:
    - determinare se l’utente corrente è ADMIN
    - abilitare/disabilitare azioni amministrative

-------------------------------------------------------

**Query RTK Query**
- **`useGetUserByIdQuery`**
  - carica i dati dell’utente tramite ID
  - viene **skippata** se `id` non è presente
  - espone:
    - `data`
    - `isLoading`
    - `isError`
    - `refetch`

-------------------------------------------------------

**Layout**
- layout a due colonne responsive:
  - **colonna sinistra**
    - card profilo utente
  - **colonna destra**
    - card informazioni dettagliate
- header superiore:
  - titolo *User details*
  - pulsante *Back* verso `/users`

-------------------------------------------------------

**Card profilo utente**
- mostra:
  - avatar (se presente)
  - nome e cognome
  - email
- avatar:
  - dimensione fissa `120x120`
  - forma circolare (`borderRadius: 50%`)
  - `objectFit: cover`
- include:
  - `UserRoleBadgeModal` per gestione ruolo

-------------------------------------------------------

**Gestione ruoli**
- `UserRoleBadgeModal` riceve:
  - `currentRole`
  - `userId`
  - `isCurrentUserAdmin`
- consente la modifica del ruolo **solo se ADMIN**

-------------------------------------------------------

**Card informazioni**
- mostra:
  - `username`
  - `role`
  - `email`
- dati presentati in formato leggibile e statico

-------------------------------------------------------

**Stati di caricamento**
- `isLoading`:
  - mostra spinner centrato
- `isError`:
  - mostra alert di errore
  - include pulsante *Retry* che invoca `refetch()`

-------------------------------------------------------

**Navigazione**
- pulsante *Back*:
  - utilizza `useNavigate`
  - ritorna alla pagina `/users`

-------------------------------------------------------

**Rendering condizionale**
- utilizza controlli:
  - `if (!id)`
  - `isLoading`
  - `isError`
  - `user && (...)`
- previene accessi a dati `undefined`

-------------------------------------------------------

**Note**
- il componente **non gestisce direttamente mutazioni**
- tutta la logica di aggiornamento ruolo è delegata a `UserRoleBadgeModal`
- l’accesso ai dati è protetto dal controllo sull’ID
- la pagina è pensata come **vista di dettaglio read-only con azioni mirate**

-------------------------------------------------------

**File collegati**
- `src/api/userApi.ts`
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/components/UserRoleBadgeModal.tsx`
- `src/types/auth.ts`

-------------------------------------------------------
