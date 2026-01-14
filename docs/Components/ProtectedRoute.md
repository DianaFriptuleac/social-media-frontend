**Componente `ProtectedRoute`** (`route guard / access control`)

*Serve per:*
- **proteggere le pagine private dell’applicazione**
- **impedire l’accesso a utenti non autenticati**
- **reindirizzare automaticamente al login**
- **centralizzare il controllo di autenticazione**

-------------------------------------------------------

**Responsabilità**
- controllare se l’utente è loggato
- decidere se:
  - mostrare la pagina richiesta
  - oppure reindirizzare al login

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `React.ReactNode`
- `react-router-dom`
  - `Navigate`
- `redux store`
  - `useAppSelector`
- `authSlice`
  - accesso a `state.auth.token`

-------------------------------------------------------

**Props**
- **`children: React.ReactNode`**
  - rappresenta il contenuto protetto
  - viene renderizzato solo se l’utente è autenticato

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.token`
  - se presente → utente autenticato
  - se assente → utente non autenticato

-------------------------------------------------------

**Logica di protezione**
1. legge il `token` dal Redux Store
2. se `token` **non esiste**:
   - ritorna `<Navigate to="/login" replace />`
3. se `token` **esiste**:
   - renderizza `children`

-------------------------------------------------------

**Redirect**
- utilizza `replace`
  - evita che la pagina protetta resti nella history
  - impedisce di tornare indietro con il pulsante *back*

-------------------------------------------------------

**Comportamento**
- il controllo avviene:
  - **prima del render della pagina protetta**
- non vengono fatte chiamate API
- il controllo è **sincrono e immediato**

-------------------------------------------------------

**Esempio di utilizzo**
- protezione di una rotta privata:
  - `/departments`
  - `/users`
  - `/me`

-------------------------------------------------------

**Note**
- il controllo si basa **solo sulla presenza del token**
- non verifica:
  - validità del token
  - ruolo utente
- il controllo dei ruoli è demandato ad altri componenti/pagine

-------------------------------------------------------

**File collegati**
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/routes/router.ts`
- `src/types/auth.ts`
