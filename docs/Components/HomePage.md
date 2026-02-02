**Componente `HomePage`** (`home / dashboard page`)

*Serve per:*
- **mostrare la pagina principale dell’applicazione**
- **mostrare una sezione “hero” di benvenuto**
- **mostrare informazioni base dell’utente loggato**
- **gestire il caso utente non autenticato**
- **fornire una vista di benvenuto semplice**

-------------------------------------------------------

**Dipendenze principali**
- `react-bootstrap`
  - `Container`
  - `Row`
  - `Col`
  - `Card`
- `redux store`
  - `useAppSelector`
- `authSlice`
  - accesso a `state.auth.user`
- `Home.css`
  - stile per hero e card profilo

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.user`
  - se presente → utente loggato
  - se `null` → utente non autenticato

-------------------------------------------------------

**Layout**
- layout a blocchi verticali:
  1. **Hero** (full-width)
  2. **Profile Card** centrata
- container:
  - `Container fluid` con `px-0` (full-width senza padding laterale)
- card centrata orizzontalmente con:
  - `Row justify-content-center`
  - `Col xs={12} md={8} lg={6}`

-------------------------------------------------------

**Sezione HERO**
- occupa tutta la larghezza
- contenuto testuale:
  - titolo: `Let&apos;s build our future.`
  - sottotitolo descrittivo (mission/overview)
- classi CSS utilizzate:
  - `home-hero`
  - `home-hero-content`
  - `home-hero-title`
  - `home-hero-sub`

-------------------------------------------------------

**Sezione PROFILE CARD**
- card centrata e responsive
- classe CSS utilizzata:
  - `profile-card`

-------------------------------------------------------

**Comportamento**
- se `user` è presente:
  - mostra messaggio di benvenuto
  - `Welcome, {name} {surname}`
  - se `user.avatar` esiste:
    - mostra immagine profilo
    - class CSS avatar:
      - `avatar-lg`
    - container centrato:
      - `text-center`
- se `user` è `null`:
  - mostra messaggio:
    - `You are not logged in. Please login to see your profile.`

-------------------------------------------------------

**Rendering condizionale**
- utilizza un controllo:
  - `user ? (...) : (...)`
- evita errori di accesso a proprietà di `null`
- avatar gestito in modo sicuro:
  - render solo se `user.avatar` esiste

-------------------------------------------------------

**Note**
- il componente **non effettua chiamate API**
- i dati mostrati provengono esclusivamente dallo store Redux
- il layout è pensato come **homepage/dashboard semplice**
- la parte “hero” è indipendente dallo stato di login
- gli stili principali sono demandati a `Home.css`

-------------------------------------------------------

**File collegati**
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/auth.ts`
- `src/css/Home.css`
