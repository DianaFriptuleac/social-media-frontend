**Componente `RolePicker`**
(componente riutilizzabile per selezione e gestione ruoli)

*Serve per:*
- **visualizzare una lista di ruoli disponibili**
- **selezionare / deselezionare ruoli**
- **mostrare ruoli già esistenti come disabilitati**
- **aggiungere ruoli custom manualmente**
- **mostrare i ruoli selezionati**
- **riutilizzare la stessa UI in più modali**

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
- `react-bootstrap`
  - `ListGroup`
  - `Badge`
  - `Form`
  - `Button`
- `RolePickerProps` → tipizzazione props

-------------------------------------------------------

**Props**
- `title?: string`
  - titolo della sezione (default: `"Select roles"`)
- `availableRoles: string[]`
  - elenco dei ruoli disponibili
- `selectedRoles: string[]`
  - ruoli attualmente selezionati
- `disabledRoles?: string[]`
  - ruoli disabilitati (già presenti / non selezionabili)
- `onToggle: (role: string) => void`
  - callback di selezione / rimozione ruolo
- `onAddCustom: (role: string) => void`
  - callback per aggiunta ruolo custom

-------------------------------------------------------

**Stato locale**
- `customRole`
  - valore dell’input per ruolo custom

-------------------------------------------------------

**Utility**
- `normalizeRole`
  - normalizza il nome del ruolo:
    - `trim()`
    - `toUpperCase()`
    - spazi → `_`
- garantisce coerenza tra ruoli:
  - disponibili
  - selezionati
  - disabilitati

-------------------------------------------------------

**Gestione ruoli disponibili**
- i ruoli vengono mostrati in una `ListGroup`
- ogni ruolo:
  - è normalizzato
  - può essere:
    - selezionato
    - deselezionato
    - disabilitato
- stato visivo:
  - `active` → ruolo selezionato
  - `disabled` → ruolo già esistente
- badge:
  - ruolo (`info`)
  - stato *Already exist* (`secondary`)

-------------------------------------------------------

**Gestione ruoli custom**
- input testuale per inserimento manuale
- pulsante *Add*:
  - disabilitato se input vuoto
- supporto tasto `Enter`
- dopo aggiunta:
  - reset automatico dell’input

-------------------------------------------------------

**Gestione ruoli selezionati**
- se `selectedRoles.length > 0`:
  - mostra sezione *Selected roles*
- ogni ruolo selezionato:
  - mostrato come `Badge`
  - cliccabile per rimozione
  - indicazione visiva (`✕`)

-------------------------------------------------------

**Flusso di interazione**
1. visualizzazione ruoli disponibili
2. selezione / deselezione ruoli
3. (opzionale) aggiunta ruolo custom
4. visualizzazione riepilogo ruoli selezionati

-------------------------------------------------------

**Note**
- il componente **non effettua chiamate API**
- tutta la logica di stato globale è demandata al parent
- completamente riutilizzabile in più contesti:
  - aggiunta utente
  - modifica ruoli
  - gestione permessi
- la normalizzazione evita problemi di duplicazione

-------------------------------------------------------

**File collegati**
- `src/types/departments.ts`
- componenti che utilizzano `RolePicker`:
  - `AddUserToDepartmentModal`
  - `DepartmentRolesModal`

-------------------------------------------------------
