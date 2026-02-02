**Componente `EditDepartmentModal`**
(modale per modifica ed eliminazione di un dipartimento)

*Serve per:*
- **modificare i dati di un department esistente**
- **aggiornare nome e descrizione**
- **eliminare un department**
- **mostrare il numero di utenti associati**
- **gestire stati di salvataggio ed eliminazione**
- **mostrare errori provenienti dal backend**

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
  - `useEffect`
  - `useMemo`
- `react-bootstrap`
  - `Modal`, `Form`, `Button`, `Alert`, `Spinner`
- `EditDepartmentModalProps` → tipizzazione props

-------------------------------------------------------

**Props**
- `show: boolean`
  - controlla la visibilità della modale
- `onHide: () => void`
  - callback di chiusura
- `department`
  - oggetto department da modificare
- `onSave: (payload) => void`
  - callback di salvataggio modifiche
- `onDelete: (id: string) => void`
  - callback di eliminazione department
- `isSaving: boolean`
  - stato di salvataggio in corso
- `isDeleting: boolean`
  - stato di eliminazione in corso
- `errorMsg?: string`
  - messaggio di errore da backend o validazione

-------------------------------------------------------

**Stato locale**
- `name`
  - nome del department
- `description`
  - descrizione del department

-------------------------------------------------------

**Sincronizzazione stato**
- allo **show della modale**:
  - lo stato locale viene riallineato ai dati del `department`
- evita incoerenze in caso di:
  - cambio department selezionato
  - riapertura modale

-------------------------------------------------------

**Stato derivato**
- `canSave` (calcolato con `useMemo`)
  - `true` solo se:
    - il nome non è vuoto
    - almeno un campo è cambiato
    - non è in corso un salvataggio
    - non è in corso un’eliminazione
- previene salvataggi inutili o duplicati

-------------------------------------------------------

**Validazione**
- il nome:
  - è obbligatorio
  - viene sempre `trim()` prima dell’invio
- la descrizione:
  - viene `trim()`
- il pulsante *Save changes*:
  - è disabilitato se non ci sono modifiche

-------------------------------------------------------

**Flusso di modifica**
1. apertura modale
2. modifica nome e/o descrizione
3. abilitazione pulsante *Save changes*
4. invocazione `onSave(payload)`
5. gestione loading / errori

-------------------------------------------------------

**Eliminazione department**
- protetta da `window.confirm`
- mostra messaggio di avviso
- disabilitata durante:
  - salvataggio
  - eliminazione in corso
- invoca `onDelete(department.id)`

-------------------------------------------------------

**Feedback utente**
- spinner su:
  - *Save changes* → `Saving...`
  - *Delete* → `Deleting...`
- alert di errore mostrato nel body
- pulsanti disabilitati durante operazioni critiche

-------------------------------------------------------

**UI aggiuntiva**
- visualizza:
  - `Users in department: {department.userCount}`
- separazione visiva con `<hr />` tra form e azioni distruttive

-------------------------------------------------------

**Note**
- il componente è completamente controllato dal parent
- non effettua chiamate API dirette
- tutte le operazioni critiche sono protette da conferma o validazione
- salvataggio ed eliminazione sono mutualmente esclusivi

-------------------------------------------------------

**File collegati**
- `src/types/departments.ts`
- component parent che gestisce:
  - chiamate API
  - stati `isSaving` / `isDeleting`
  - gestione errori

-------------------------------------------------------