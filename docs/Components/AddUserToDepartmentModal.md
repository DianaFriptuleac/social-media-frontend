**Componente `AddUserToDepartmentModal`**
(modale per aggiunta utenti a un dipartimento)

*Serve per:*
- **aggiungere un utente esistente a un dipartimento**
- **ricercare utenti tramite input testuale (con debounce)**
- **assegnare uno o più ruoli**
- **evitare l’aggiunta di utenti già presenti nel dipartimento**
- **richiedere conferma prima del salvataggio**
- **inviare la richiesta di assegnazione ruoli al backend**

-------------------------------------------------------

**Dipendenze principali**
- `react` → `useState`, `useEffect`, `useMemo`
- `react-bootstrap` → `Modal`, `Form`, `ListGroup`, `Button`, `Alert`, `Badge`, `Spinner`
- `RTK Query`
  - `useGetAllUsersQuery`
  - `useAssignRolesMutation`
- `RolePicker` → gestione ruoli
- `UserListItem` → tipo dati utente

-------------------------------------------------------

**Props**
- `show: boolean`
  - controlla la visibilità della modale
- `onHide: () => void`
  - callback di chiusura
- `departmentId: string`
  - identificativo del dipartimento
- `existingUserIds: string[]`
  - lista ID utenti già presenti (usata per bloccare duplicati)

-------------------------------------------------------

**Stato locale**
- `query`
  - testo di ricerca utente
- `debouncedQuery`
  - query con debounce (250ms)
- `selectedUser`
  - utente selezionato
- `selectedRoles`
  - ruoli assegnati all’utente
- `alertMsg`
  - messaggi di errore o validazione
- `showConfirm`
  - step di conferma finale

-------------------------------------------------------

**Costanti**
- `DEFAULT_AVAILABLE_ROLES`
  - ruoli predefiniti disponibili:
    - `MANAGER`
    - `EMPLOYEE`
    - `HR`
    - `IT`

-------------------------------------------------------

**Caricamento utenti**
- utilizza `useGetAllUsersQuery`
- carica un blocco di utenti (`page: 0`, `size: 200`)
- la chiamata è **skippata se la modale è chiusa**

-------------------------------------------------------

**Ricerca utenti**
- attiva solo con almeno **2 caratteri**
- ricerca su:
  - nome
  - cognome
  - email
  - username
- massimo **25 risultati**
- filtro case-insensitive
- implementata con `useMemo`

-------------------------------------------------------

**Gestione ruoli**
- `toggleRole`
  - aggiunge o rimuove un ruolo
- `addRole`
  - consente l’aggiunta di ruoli custom
- i ruoli vengono normalizzati:
  - uppercase
  - spazi → `_`

-------------------------------------------------------

**Flusso di interazione**
1. ricerca e selezione utente
2. selezione ruoli
3. validazione:
   - utente selezionato
   - utente non già presente
   - almeno un ruolo
4. conferma finale
5. salvataggio

-------------------------------------------------------

**Conferma**
- mostra riepilogo:
  - utente selezionato
  - ruoli assegnati
- richiede conferma esplicita prima dell’invio

-------------------------------------------------------

**Salvataggio**
- invoca `useAssignRolesMutation`
- payload:
  - `userId`
  - `departmentId`
  - `roles`
- in caso di successo:
  - chiusura modale
  - reset stato
- in caso di errore:
  - messaggio backend o fallback

-------------------------------------------------------

**Reset stato**
- eseguito:
  - all’apertura della modale
  - alla chiusura
  - dopo salvataggio riuscito
- ripristina:
  - query
  - utente
  - ruoli
  - alert
  - conferma

-------------------------------------------------------

**Note**
- la ricerca è debounced per migliorare le performance
- gli utenti già presenti nel dipartimento sono disabilitati
- nessuna operazione viene eseguita senza conferma esplicita

-------------------------------------------------------

**File collegati**
- `src/api/userApi.ts`
- `src/api/departmentApi.ts`
- `src/types/profile.ts`
- `src/components/RolePicker.tsx`

-------------------------------------------------------
