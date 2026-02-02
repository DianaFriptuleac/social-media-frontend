**Componente `AppNavbar`** (`navigation bar + menu laterale`)

*Serve per:*
- **mostrare la barra di navigazione principale**
- **gestire la navigazione tra le pagine con useNavigate()**
- **gestire logout utente(dispatch(logout()) + redirect /login)**
- **gestire menu Offcanvas in modo responsive:**
       -**mobile: menu dall'alto**
       -**desktop: menu laterale da sinistra**


-------------------------------------------------------

**Dipendenze principali**
- `react-router-dom` → navigazione (`useNavigate`)
- `react-redux` → accesso allo store (`useAppDispatch`, `useAppSelector`)
- `react-bootstrap` → UI (`Navbar`, `Offcanvas`, `Nav`, `Button`)
- `react-icons` → icone (`BsPersonCircle`, `BsBoxArrowRight`)
- `Nav.css` → stili custom

-------------------------------------------------------

**Stato locale**
- `show: boolean`
  - indica se il menu Offcanvas è aperto o chiuso
- `isMobile: boolean`
  - indica se la viewport è mobile (`window.innerWidth < 768`)

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.user`
  - usato per:
    - mostrare avatar + nome utente
    - link al profilo /me
    - gestire logout

-------------------------------------------------------

**Funzioni principali**
1. **`handleLogout`**
   - dispatch di `logout()`
   - naviga verso `/login`
   - pulisce lo stato auth

2. **`handleNavigate(path)`**
   - naviga verso la rotta passata
   - chiude il menu laterale (`setShow(false)`)

-------------------------------------------------------

**Gestione responsive**
- su **desktop**
  - navbar sempre visibile
  - user + logout sulla destra
  - offcanvas placement="start"
  - quando offcanvas aperto: aggiunge una classe al body per spingere il contenuto
- su **mobile**
  - menu offcanvas dall’alto (`placement="top"`)
  - user info e logout spostati dentro la tendina

-------------------------------------------------------

**Effetti (`useEffect`)**
1. **Gestione layout desktop**
   - aggiunge/rimuove la classe `push-right` al wrapper `#page-wrapper`
   - attiva solo quando:
     - non mobile
     - menu aperto

2. **Gestione resize finestra**
   - aggiorna `isMobile` al cambio di dimensione
   - mantiene il comportamento responsive sincronizzato

-------------------------------------------------------

**Navigazione disponibile**
- `Home` → `/`
- `Departments` → `/departments`
- `My Profile` → `/me`
- `Users List` → `/users`

-------------------------------------------------------

**Note**
- il componente assume l’esistenza dell’elemento DOM `#page-wrapper`
- il menu Offcanvas usa:
  - `backdrop={false}`
  - `scroll={true}`
- il logout è accessibile sia da desktop che da mobile

-------------------------------------------------------

**File collegati**
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/css/Nav.css`
