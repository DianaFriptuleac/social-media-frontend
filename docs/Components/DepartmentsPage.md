**Componente `DepartmentsPage`** (`departments management page`)

*Serve per:*
- **mostrare la lista dei departments**
- **mostrare il dettaglio di un department selezionato**
- **visualizzare gli utenti appartenenti al department**
- **gestire paginazione utenti**
- **abilitare azioni amministrative (solo ADMIN)**
- **creare, modificare ed eliminare departments**
- **gestire utenti e ruoli nei departments**

-------------------------------------------------------

**Layout generale**
- layout a **due colonne**
  - **colonna sinistra**
    - lista dei departments
    - pulsante *Add New* (solo ADMIN)
  - **colonna destra**
    - dettaglio del department selezionato
    - informazioni generali
    - dettaglio del department selezionato
    - tabella utenti
    - azioni admin

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
  - `useMemo`
- `react-bootstrap`
  - `Container`, `Row`, `Col`
  - `Card`, `Table`, `Button`, `Pagination`, `Badge`
- `departmentApi`
  - `useGetDepartmentsQuery`
  - `useGetDepartmentByIdQuery`
  - `useRemoveUserFromDepartmentMutation`
  - `useCreateDepartmentMutation`
  - `useUpdateDepartmentMutation`
  - `useDeleteDepartmentMutation`
- `redux store`
  - `useAppDispatch`
  - `useAppSelector`
  - `departmentSlice`
    - `setSelectedDepartment`
    - `setPage`
- componenti collegati
  - `DepartmentRolesModal`
  - `AddUserToDepartmentModal`
  - `CreateDepartmentModal`
  - `EditDepartmentModal`

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

4. **`useCreateDepartmentMutation`**
   - crea un nuovo department
   - disponibile solo per ADMIN

5. **`useUpdateDepartmentMutation`**
   - aggiorna un department
   - disponibile solo per ADMIN

6. **`useDeleteDepartmentMutation`**
   - elimina un department
   - disponibile solo per ADMIN

-------------------------------------------------------

**Stato locale**
- `showAddUserModal`
  - controlla la visibilità della modale di aggiunta utente
- `showCreateDept`
  - controlla la visibilità della modale di creazione department
- `showEditDepartment`
  - controlla la visibilità della modale di modifica department

-------------------------------------------------------

**Stato derivato / memoizzato**
- `pagedUsers`
  - calcolato con `useMemo`
  - contiene solo gli utenti della pagina corrente
  - dipende da:
    - `selectedDepartment`
    - `page`
    - `pageSize`


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

**Paginazione**
- completamente **lato frontend**
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

**Gestione selezione department**
- al click su un department:
  - dispatch di `setSelectedDepartment(dept.id)`
  - reset automatico della pagina a `1`
- il department selezionato:
  - viene evidenziato con `border-primary`
- se un department viene eliminato:
  - la selezione viene resettata (`setSelectedDepartment(null)`)

-------------------------------------------------------

**Gestione ruoli (ADMIN)**
- se `user.role === "ADMIN"`:
  - mostra pulsanti:
    - *Add New*
    - *Edit department*
    - *Add user*
  - mostra colonna `Actions` nella tabella utenti
  - abilita:
    - modifica ruoli (`DepartmentRolesModal`)
    - rimozione utenti dal department
    - creazione / modifica / eliminazione department

-------------------------------------------------------

**Tabella utenti**
- colonne:
  - `Name`
  - `Email`
  - `Ruoli`
  - `Actions` *(solo ADMIN)*
- ruoli visualizzati come `Badge`
- stato vuoto:
  - mostra `No users found`

-------------------------------------------------------


**Stati di caricamento**
- lista departments:
  - mostra `Loading...`
- dettaglio department:
  - mostra `Loading data...`
- nessun department selezionato:
  - mostra `Select a department...`

-------------------------------------------------------

**Gestione errori**
- errori di creazione / modifica / eliminazione:
  - intercettati tramite `isFetchBaseQueryError`
  - gestione dedicata per `403 (ADMIN only)`
- messaggi mostrati nelle rispettive modali

-------------------------------------------------------

**Note**
- la paginazione è **lato frontend**
- il numero utenti (`userCount`) viene mostrato separatamente
- le mutazioni RTK Query invalidano automaticamente la cache
- il componente funge da **container principale** per la gestione departments

-------------------------------------------------------

**File collegati**
- `src/api/department.ts`
- `src/store/departmentSlice.ts`
- `src/store/hooks.ts`
- `src/types/departments.ts`
- `src/components/DepartmentRolesModal.tsx`
- `src/components/AddUserToDepartmentModal.tsx`
- `src/components/CreateDepartmentModal.tsx`
- `src/components/EditDepartmentModal.tsx`
