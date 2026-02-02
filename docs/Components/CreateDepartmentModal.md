**Componente `CreateDepartmentModal`**
(modale per creazione di un dipartimento)

*Serve per:*
- **creare un nuovo dipartimento**
- **inserire nome e descrizione**
- **validare i dati prima dell’invio**
- **mostrare stato di caricamento**
- **mostrare eventuali errori**
- **invocare la callback di creazione**

-------------------------------------------------------

**Dipendenze principali**
- `react` → `useState`, `useEffect`
- `react-bootstrap` → `Modal`, `Form`, `Button`, `Alert`, `Spinner`
- `CreateDepartmentModalProps` → tipizzazione props

-------------------------------------------------------

**Props**
- `show: boolean`
  - controlla la visibilità della modale
- `onHide: () => void`
  - callback di chiusura
- `onCreate: (payload) => void`
  - callback di creazione dipartimento
- `isLoading: boolean`
  - stato di caricamento durante la creazione
- `errorMsg?: string`
  - messaggio di errore da backend o validazione

-------------------------------------------------------

**Stato locale**
- `name`
  - nome del dipartimento
- `description`
  - descrizione del dipartimento

-------------------------------------------------------

**Gestione stato**
- lo stato viene **resettato automaticamente** quando:
  - la modale viene chiusa
  - `show` passa a `false`
- previene dati residui tra aperture successive

-------------------------------------------------------

**Validazione**
- il pulsante *Create* è disabilitato se:
  - il nome è vuoto
  - è in corso una creazione (`isLoading`)
- `name` viene sempre:
  - `trim()` prima dell’invio
- `description`:
  - `trim()`
  - inviata come `undefined` se vuota

-------------------------------------------------------

**Flusso di interazione**
1. apertura modale
2. inserimento nome
3. inserimento descrizione (opzionale)
4. click su *Create*
5. invocazione `onCreate(payload)`
6. gestione loading / errori

-------------------------------------------------------

**Feedback utente**
- spinner durante la creazione
- testo dinamico:
  - *Create*
  - *Creating…*
- alert di errore visibile nel body

-------------------------------------------------------

**Chiusura modale**
- possibile tramite:
  - pulsante *Cancel*
  - icona *close*
- alla chiusura:
  - reset stato
  - chiamata `onHide()`

-------------------------------------------------------

**Note**
- il componente è completamente controllato dal parent
- non effettua chiamate API dirette
- tutta la logica di persistenza è esterna

-------------------------------------------------------

**File collegati**
- `src/types/departments.ts`
- component parent che gestisce:
  - creazione dipartimento
  - chiamata API
  - stato `isLoading`
  - gestione errori

-------------------------------------------------------
