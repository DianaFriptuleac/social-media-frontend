**Cartella `src/routes/`** (`application routing`)

*Serve per:*
- **definire tutte le rotte dell’applicazione**
- **gestire le rotte pubbliche e protette**
- **centralizzare la logica di protezione delle pagine**
- **configurare layout condivisi (navbar + outlet)**

-------------------------------------------------------

**Dipendenze principali**
- `react-router-dom`
  - `createBrowserRouter`
  - `Navigate`
  - `Outlet`
- `react`
  - `React.FC`
- `ProtectedRoute`
- componenti pagina:
  - `LoginPage`
  - `RegisterPage`
  - `HomePage`
  - `UserPage`
  - `DepartmentsPage`
  - `UsersListPage`
- layout:
  - `AppNavbar`

-------------------------------------------------------

**`ProtectedLayout`** (`layout per rotte protette`)

*Serve per:*
- **wrappare tutte le pagine che richiedono autenticazione**
- **mostrare la navbar solo sulle pagine protette**
- **applicare un layout comune alle pagine private**

*Struttura:*
- `ProtectedRoute`
  - controlla la presenza del token
- `AppNavbar`
  - navbar fissa in alto
- `Outlet`
  - punto in cui viene renderizzata la pagina corrente

*Note layout:*
- il `div` con id `page-wrapper`:
  - viene usato per gestire effetti CSS (es. push menu)
- `paddingTop: "70px"`:
  - necessario perché la navbar è `fixed="top"`

-------------------------------------------------------

**Rotte pubbliche**
1. **`/`**
   - redirect automatico a `/home`

2. **`/login`**
   - pagina di login
   - accessibile senza autenticazione

3. **`/register`**
   - pagina di registrazione
   - accessibile senza autenticazione

-------------------------------------------------------

**Rotte protette**
*Tutte le rotte sotto `ProtectedLayout` richiedono autenticazione.*

- **`/home`**
  - componente: `HomePage`
  - pagina principale dopo login

- **`/me`**
  - componente: `UserPage`
  - profilo utente loggato

- **`/departments`**
  - componente: `DepartmentsPage`
  - gestione e visualizzazione departments

- **`/users`**
  - componente: `UsersListPage`
  - lista utenti (accesso effettivo controllato anche lato API)

-------------------------------------------------------

**Protezione delle rotte**
- la protezione è gestita da:
  - `ProtectedRoute`
- criterio:
  - presenza del `token` nello store Redux
- se il token **non è presente**:
  - redirect automatico a `/login`
  - uso di `replace` per evitare ritorno con back

-------------------------------------------------------

**Catch-all route**
- **`*`**
  - intercetta tutte le rotte non definite
  - redirect a `/home`
  - evita pagine 404 non gestite

-------------------------------------------------------

**Flusso di navigazione**
1. utente non loggato:
   - accesso a `/login` o `/register`
2. login riuscito:
   - redirect a `/home`
3. accesso a rotta protetta senza token:
   - redirect automatico a `/login`
4. rotta inesistente:
   - redirect a `/home`

-------------------------------------------------------

**Note**
- il routing è **centralizzato in un unico file**
- il layout protetto evita duplicazioni di navbar
- la protezione dei ruoli (ADMIN) **non è gestita qui**
  - è demandata a:
    - API
    - componenti specifici (es. `UsersListPage`)

-------------------------------------------------------

**File collegati**
- `src/components/ProtectedRoute.tsx`
- `src/components/AppNavbar.tsx`
- `src/components/HomePage.tsx`
- `src/components/LoginPage.tsx`
- `src/components/RegisterPage.tsx`
- `src/components/UserPage.tsx`
- `src/components/DepartmentsPage.tsx`
- `src/components/UsersListPage.tsx`
