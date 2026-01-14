**Componente `DepartmentsPage`** (`departments management page`)

*Serve per:*
- **mostrare la lista dei departments**
- **mostrare il dettaglio di un department selezionato**
- **visualizzare gli utenti appartenenti al department**
- **gestire paginazione utenti**
- **abilitare azioni amministrative (solo ADMIN)**

-------------------------------------------------------

**Layout generale**
- layout a **due colonne**
  - **colonna sinistra**
    - lista dei departments
  - **colonna destra**
    - dettaglio del department selezionato
    - tabella utenti
    - azioni admin

-------------------------------------------------------

**Dipendenze principali**
- `react-bootstrap`
  - `Container`, `Row`, `Col`
  - `Card`, `Table`, `Button`, `Pagination`, `Badge`
- `departmentApi`
  - `useGetDepartmentsQuery`
  - `useGetDepartmentByIdQuery`
  - `useRemoveUserFromDepartmentMutation`
- `redux store`
  - `useAppDispatch`
  - `useAppSelector`
  - `departmentSlice` (`setSelectedDepartment`, `setPage`)

-------------------------------------------------------

**Stato Redux utilizzato**
- `state.departmentUI.selectedDepartmentId`
- `state.departmentUI.page`
- `state.departmentUI.pageSize`
- `state.auth.user.role`

-------------------------------------------------------

**Query RTK Query**
1. **`useGetDepartmentsQuery`**
   - carica la lista di tutti i departments
   - usata nella colonna sinistra

2. **`useGetDepartmentByIdQuery`**
   - carica il dettaglio del department selezionato
   - viene **skippata** se `selectedDepartmentId` è `null`

3. **`useRemoveUserFromDepartmentMutation`**
   - rimuove un utente dal department
   - disponibile solo per ADMIN

-------------------------------------------------------

**Stato locale / derivato**
- `pagedUsers`
  - calcolato con `useMemo`
  - contiene solo gli utenti della pagina corrente

************
  **Note per `useMemo`** :
  un React Hook che serve a memorizzare (cache)il risultato di un calcolo e ricalcolarlo solo quando cambiano certe dipendenze (*“Non rifare questo calcolo a ogni render, fallo solo quando serve”*)
  *Serve per*:
  - evitare ricalcoli inutili
  - migliorare performance 
  - mantenere riferimenti stabili (array/oggetti)
  *Quando si usa*:
  - il valore dipende da altri dati
  - il calcolo non è banale
  - il valore viene usato nel render
  *NON va usato quando*:
  - valori semplici
  -state setter
  - logica non usata nel render
  *In questo caso*:
  `const pagedUsers = useMemo(() => {` `if(!selectedDepartment) return [];`
 ` const start = (page - 1) * pageSize;`
 ` return selectedDepartment.users.slice(start, start + pageSize);`
`}, [selectedDepartment, page, pageSize]);`
*Senza `useMemo` a ogni render React rifarebbe `slice`anche se `page` e `selectDepartment` non sono cambiati.*
*Con `useMemo` il calcolo viene fatto solo se cambiano `selectedDepartment, page, pageSize`*
************

- `totalPages`
  - calcolato in base a:
    - `selectedDepartment.users.length`
    - `pageSize`

-------------------------------------------------------

**Gestione selezione department**
- al click su un department:
  - dispatch di `setSelectedDepartment(dept.id)`
  - reset automatico della pagina a `1`
- il department selezionato:
  - viene evidenziato con `border-primary`

-------------------------------------------------------

**Gestione ruoli (ADMIN)**
- se `user.role === "ADMIN"`:
  - mostra pulsanti:
    - `Modifica department`
    - `Aggiungi utente`
  - mostra colonna `Actions` nella tabella utenti
  - abilita:
    - `Modifica Ruoli`
    - `Rimuovi utente`

-------------------------------------------------------

**Tabella utenti**
- colonne:
  - `Name`
  - `Email`
  - `Ruoli`
  - `Actions` *(solo ADMIN)*
- ruoli visualizzati come `Badge`
- stato vuoto:
  - mostra `Nessun utente presente`

-------------------------------------------------------

**Paginazione**
- attiva solo se:
  - `selectedDepartment.users.length > pageSize`
- controllata da:
  - `state.departmentUI.page`
- pulsanti:
  - `Prev`
  - numeri pagina
  - `Next`
- ogni cambio pagina:
  - dispatch di `setPage(...)`

-------------------------------------------------------

**Stati di caricamento**
- lista departments:
  - mostra `Caricamento...`
- dettaglio department:
  - mostra `Caricamento dati...`
- nessun department selezionato:
  - mostra `Seleziona un department...`

-------------------------------------------------------

**Note**
- la paginazione è **lato frontend**
- il numero utenti (`userCount`) viene mostrato separatamente
- la rimozione utente invalida automaticamente la cache RTK Query

-------------------------------------------------------

**File collegati**
- `src/api/department.ts`
- `src/store/departmentSlice.ts`
- `src/store/hooks.ts`
- `src/types/departments.ts`
