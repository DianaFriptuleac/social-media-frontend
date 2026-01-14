**Componente `HomePage`** (`home / dashboard page`)

*Serve per:*
- **mostrare la pagina principale dell’applicazione**
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

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.user`
  - se presente → utente loggato
  - se `null` → utente non autenticato

-------------------------------------------------------

**Layout**
- contenitore centrale
- card centrata orizzontalmente
- layout responsive:
  - `xs={12}` → mobile
  - `md={8}` → tablet
  - `lg={6}` → desktop

-------------------------------------------------------

**Comportamento**
- se `user` è presente:
  - mostra messaggio di benvenuto
  - mostra:
    - `name`
    - `surname`
    - `email`
  - se `avatar` esiste:
    - mostra immagine profilo
    - avatar circolare (`borderRadius: 50%`)
- se `user` è `null`:
  - mostra messaggio:
    - `You are not logged in. Please login to see your profile.`

-------------------------------------------------------

**Rendering condizionale**
- utilizza un controllo:
  - `user ? (...) : (...)`
- evita errori di accesso a proprietà di `null`

-------------------------------------------------------

**Note**
- il componente **non effettua chiamate API**
- i dati mostrati provengono esclusivamente dallo store Redux
- l’avatar è opzionale e gestito in modo sicuro
- il componente è pensato come **pagina di ingresso** post-login

-------------------------------------------------------

**File collegati**
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/auth.ts`
