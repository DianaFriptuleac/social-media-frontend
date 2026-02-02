**Cartella `src/routes/`** (`application routing`)

*Serve per:*
- **definire tutte le rotte dell’applicazione**
- **gestire le rotte pubbliche e protette**
- **centralizzare la logica di protezione delle pagine**
- **configurare layout condivisi (navbar + outlet)**
- **gestire redirect e catch-all**

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
  - `SingleUserDetail`
- layout:
  - `AppNavbar`

-------------------------------------------------------

**`ProtectedLayout`** (`layout per rotte protette`)

*Serve per:*
- **wrappare tutte le pagine che richiedono autenticazione**
- **mostrare la navbar solo sulle pagine protette**
- **applicare un layout comune alle pagine private**
- **fornire wrapper DOM per effetti CSS (es. push menu Offcanvas)**

*Struttura:*
- `ProtectedRoute`
  - controlla la presenza del token
- `div#page-wrapper`
  - wrapper pagina usato per gestione layout/CSS
- `AppNavbar`
  - navbar fissa in alto
- `div.pt-5`
  - padding top per evitare sovrapposizione contenuti con navbar `fixed="top"`
- `Outlet`
  - punto in cui viene renderizzata la pagina corrente

*Note layout:*
- `#page-wrapper` è richiesto per le logiche CSS legate alla navbar/offcanvas
- il padding top viene applicato con classe bootstrap:
  - `pt-5`

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

- **`/users/:id`**
  - componente: `SingleUserDetail`
  - dettaglio singolo utente

-------------------------------------------------------

**Protezione delle rotte**
- la protezione è gestita da:
  - `ProtectedRoute`
- criterio:
  - presenza del `token` nello store Redux
- se il token **non è presente**:
  - redirect automatico a `/login`
  - (la logica specifica è implementata nel componente `ProtectedRoute`)

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
    - componenti specifici (es. `UsersListPage`, `DepartmentsPage`)

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
- `src/components/SingleUserDetail.tsx`
