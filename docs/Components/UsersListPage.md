**Componente `UsersListPage`** (`users list + admin role management`)

*Serve per:*
- **mostrare la lista utenti paginata**
- **gestire refresh manuale della lista**
- **mostrare loading e fetching state**
- **gestire errori di rete e di permessi**
- **bloccare la UI e mostrare messaggio dedicato per errore 403 (forbidden)**
- **permettere cambio ruolo tramite `UserRoleBadgeModal` (solo ADMIN)**
- **permettere la navigazione al dettaglio utente**
- **permettere eliminazione utente (solo ADMIN, non su se stesso)**

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
  - `useMemo`
- `react-router-dom`
  - `useNavigate`
- `react-bootstrap`
  - `Container`
  - `Row`
  - `Col`
  - `Card`
  - `Table`
  - `Image`
  - `Pagination`
  - `Spinner`
  - `Alert`
  - `Button`
- `redux store`
  - `useAppSelector`
- `userApi`
  - `useGetAllUsersQuery`
  - `useDeleteUserByIdMutation`
- componenti collegati
- `UserRoleBadgeModal`
- `utils`
  - `isFetchBaseQueryError`
- `@reduxjs/toolkit/query`
  - `FetchBaseQueryError`
- `react-icons/bs`
  - `BsTrash`

-------------------------------------------------------

**Costanti**
- `PAGE_SIZE = 10`
  - dimensione pagina per la query utenti

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.auth.user`
  - per capire se l’utente corrente è ADMIN
  - evitare eliminazione di se stesso
  - `isCurrentUserAdmin = currentUser?.role === "ADMIN"`

-------------------------------------------------------

**Stato locale**
- `page: number`
  - indice pagina (0-based)

-------------------------------------------------------

**Query RTK Query**
1. **`useGetAllUsersQuery({ page, size: PAGE_SIZE })`**
   - recupera la lista utenti paginata
   - ritorna:
     - `data`
     - `isLoading`
     - `isError`
     - `error`
     - `refetch`
     - `isFetching`

-------------------------------------------------------

**Gestione permessi (403)**
- variabile di controllo:
  - `isForbidden = isError && isFetchBaseQueryError(error) && error.status === 403`
- se `isForbidden` è true:
  - viene mostrato **solo** un alert dedicato
  - la tabella utenti **non viene renderizzata**
  - viene mostrato un bottone:
    - `Back to Home` → naviga a `/`

-------------------------------------------------------

**Gestione permessi (403)**
- variabile di controllo:
  - `isForbidden = isError && isFetchBaseQueryError(error) && error.status === 403`
- se `isForbidden` è true:
  - viene mostrato **solo** un alert dedicato
  - la tabella utenti **non viene renderizzata**
  - viene mostrato un bottone:
    - `Back to Home` → naviga a `/`

-------------------------------------------------------

**Messaggio errore 403**
- `forbiddenMsg` calcolato con `useMemo`
- legge eventuale messaggio dal backend:
  - `(error as FetchBaseQueryError).data.msg`
- fallback:
  - `You don't have permission. Administrator only.`

-------------------------------------------------------

**Gestione altri errori**
- se `isError` è true ma non è 403:
  - mostra `Alert`
  - include bottone `Retry` che chiama `refetch()`
  - stampa dettaglio errore con:
    - `JSON.stringify(error)` o `String(error)`

-------------------------------------------------------

**Dati derivati**
- `users = data?.content ?? []`
- `totalPages = data?.totalPages ?? 1`

-------------------------------------------------------

**Paginazione UI**
- `paginationItems` calcolato con `useMemo`
- mostra massimo **5** pagine visibili:
  1. calcola `start = max(0, page - 2)`
  2. calcola `end = min(totalPages - 1, start + 4)`
  3. genera array pagine `[start..end]`
- componenti bootstrap:
  - `First`, `Prev`, `Item`, `Next`, `Last`
- UI aggiuntiva:
  - testo pagina: `Page {page + 1} / {totalPages}`

-------------------------------------------------------

**Loading vs Fetching**
- `isLoading`
  - primo caricamento → spinner grande al centro
- `isFetching`
  - refetch/paginazione → spinner piccolo vicino a `Refresh`

-------------------------------------------------------

**Refresh manuale**
- bottone `Refresh`
  - richiama `refetch()`
  - non cambia pagina

-------------------------------------------------------

**Tabella utenti**
- righe cliccabili:
  - click su riga → naviga a `/users/{id}`
- colonne:
  - `Avatar`
  - `Name`
  - `Email`
  - `Username`
  - `Role`
- avatar:
  - `Image` con `roundedCircle`
  - dimensioni 42x42
  - `objectFit: "cover"`
- ruolo:
  - renderizzato tramite `UserRoleBadgeModal`
  - la cella blocca la navigazione con:
    - `onClick={(e) => e.stopPropagation()}`

-------------------------------------------------------

**Azioni admin (delete)**
- icona cestino (`BsTrash`) visibile solo se:
  - `isCurrentUserAdmin === true`
  - utente in riga non è l’utente corrente (`!isSelf`)
- click cestino:
  - blocca navigazione riga con `stopPropagation()`
  - mostra `window.confirm`
  - invoca `deleteUserById({ userId }).unwrap()`
- stato bottone:
  - disabilitato durante `isDeleting`

-------------------------------------------------------

**Stato vuoto**
- se `users.length === 0`:
  - mostra riga:
    - `No users found.`

-------------------------------------------------------

**Messaggio non-admin**
- se `!isCurrentUserAdmin`:
  - mostra nota:
    - `Only admins can change roles.`

-------------------------------------------------------

**Note**
- la pagina gestisce esplicitamente il caso `403` per evitare leak UI (lista utenti non visibile)
- `refetch()` permette refresh manuale senza cambiare pagina
- il cambio ruolo reale è demandato a `UserRoleBadgeModal`
- la paginazione è basata su `PageResponse` del backend
- l’eliminazione utente è protetta da:
  - controllo admin
  - blocco self-delete
  - confirm dialog

-------------------------------------------------------

**File collegati**
- `src/api/userApi.ts`
- `src/utils/rtkQuery.ts`
- `src/store/hooks.ts`
- `src/store/authSlice.ts`
- `src/types/profile.ts`
- `src/components/UserRoleBadgeModal.tsx`
