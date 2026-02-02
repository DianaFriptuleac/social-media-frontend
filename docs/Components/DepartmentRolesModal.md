**Componente `DepartmentRolesModal`**
(modale per gestione ruoli di un utente in un dipartimento)

*Serve per:*
- **visualizzare i ruoli attuali di un utente nel dipartimento**
- **aggiungere nuovi ruoli**
- **rimuovere ruoli esistenti**
- **impedire la rimozione dell’ultimo ruolo**
- **richiedere conferma prima di modifiche**
- **limitare la modifica agli utenti con permessi admin**

-------------------------------------------------------

**Dipendenze principali**
- `react` → `useState`, `useEffect`, `useMemo`
- `react-bootstrap` → `Modal`, `Button`, `Alert`, `Badge`
- `RTK Query`
  - `useAssignRolesMutation`
  - `useRemoveDepartmentRoleFromUserMutation`
- `RolePicker` → selezione e gestione ruoli

-------------------------------------------------------

**Props**
- `userId: string`
  - identificativo utente
- `departmentId: string`
  - identificativo dipartimento
- `currentRoles: string[]`
  - ruoli attuali dell’utente nel dipartimento
- `availableRoles?: string[]`
  - ruoli suggeriti (default interni)
- `canEdit: boolean`
  - permesso di modifica (admin only)

-------------------------------------------------------

**Costanti**
- `DEFAULT_AVAILABLE_ROLES`
  - elenco ruoli disponibili di default:
    - `MANAGER`
    - `EMPLOYEE`
    - `HR`
    - `IT`
    - `ACCOUNTANT`

-------------------------------------------------------

**Stato locale**
- `showModal`
  - visibilità della modale
- `selectedToAdd`
  - ruoli selezionati da aggiungere
- `showConfirm`
  - step di conferma finale
- `alertMsg`
  - messaggi di errore o avviso

-------------------------------------------------------

**Utility**
- `normalizeRole`
  - normalizza i ruoli:
    - trim
    - uppercase
    - spazi → `_`

-------------------------------------------------------

**Caricamento e mutazioni**
- `useAssignRolesMutation`
  - aggiunta nuovi ruoli
- `useRemoveDepartmentRoleFromUserMutation`
  - rimozione ruolo dal dipartimento

-------------------------------------------------------

**Gestione permessi**
- se `canEdit === false`:
  - bottone *Edit Roles* disabilitato
  - apertura modale bloccata
  - tooltip “Admin only”

-------------------------------------------------------

**Gestione ruoli correnti**
- i ruoli attuali sono mostrati come `Badge`
- ogni ruolo può essere rimosso solo se:
  - l’utente ha più di un ruolo
  - l’utente ha permessi admin
- rimozione protetta da `window.confirm`

-------------------------------------------------------

**Gestione aggiunta ruoli**
- selezione tramite `RolePicker`
- ruoli già presenti:
  - disabilitati
  - non selezionabili
- prevenzione duplicati anche su ruoli custom

-------------------------------------------------------

**Validazioni**
- non è possibile:
  - confermare senza ruoli selezionati
  - rimuovere l’ultimo ruolo
- messaggi di errore mostrati via `Alert`

-------------------------------------------------------

**Flusso di interazione**
1. click su *Edit Roles*
2. visualizzazione ruoli correnti
3. selezione nuovi ruoli
4. click su *Continue*
5. conferma finale
6. salvataggio

-------------------------------------------------------

**Conferma**
- mostra riepilogo ruoli da aggiungere
- richiede conferma esplicita

-------------------------------------------------------

**Salvataggio**
- invia i ruoli selezionati al backend
- in caso di successo:
  - reset stato
  - chiusura modale
- in caso di errore:
  - messaggio backend o fallback

-------------------------------------------------------

**Reset stato**
- eseguito alla:
  - chiusura modale
  - conferma riuscita
- ripristina:
  - selezioni
  - alert
  - step di conferma

-------------------------------------------------------

**Note**
- un utente deve avere **almeno un ruolo** nel dipartimento
- i ruoli sono sempre normalizzati
- nessuna modifica avviene senza conferma

-------------------------------------------------------

**File collegati**
- `src/api/departmentApi.ts`
- `src/components/RolePicker.tsx`
- component parent che gestisce permessi admin

