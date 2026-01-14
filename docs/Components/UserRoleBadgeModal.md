**Componente `UserRoleBadgeModal`** (`user role badge + modal`)

*Serve per:*
- **mostrare il ruolo di un utente come badge**
- **permettere agli ADMIN di cambiare il ruolo di un utente**
- **gestire la conferma del cambio ruolo**
- **impedire modifiche a utenti non autorizzati**

-------------------------------------------------------

**Props**
- **`currentRole: "ADMIN" | "USER"`**
  - ruolo attuale dell’utente
- **`userId: string`**
  - id dell’utente di cui modificare il ruolo
- **`isCurrentUserAdmin: boolean`**
  - indica se l’utente loggato è ADMIN
  - abilita o disabilita le azioni

-------------------------------------------------------

**Dipendenze principali**
- `react`
  - `useState`
- `react-bootstrap`
  - `Badge`
  - `Modal`
  - `Button`
  - `Alert`
  - `ListGroup`
- `userApi`
  - `useUpdateUserRoleMutation`

-------------------------------------------------------

**Stato locale**
- `showModal: boolean`
  - controlla apertura/chiusura modale
- `selectedRole: "ADMIN" | "USER" | null`
  - ruolo selezionato dall’ADMIN
- `showConfirm: boolean`
  - indica se mostrare la conferma finale
- `alertMessage: string | null`
  - messaggio di avviso o errore
- `canClick: boolean`
  - true solo se `isCurrentUserAdmin === true`

-------------------------------------------------------

**Mutation RTK Query**
1. **`useUpdateUserRoleMutation`**
   - chiama `PATCH /user/{userId}/role`
   - aggiorna il ruolo dell’utente
   - invalida automaticamente la cache utenti

-------------------------------------------------------

**Comportamento Badge**
- il badge mostra:
  - `ADMIN` → colore `danger`
  - `USER` → colore `success`
- se l’utente loggato **non è ADMIN**:
  - il badge non è cliccabile
  - `pointerEvents: none`
  - opacità ridotta
- se l’utente loggato **è ADMIN**:
  - click apre la modale
  - tooltip: `Click to change role`

-------------------------------------------------------

**Flusso di cambio ruolo**
1. click sul badge (solo ADMIN)
2. apertura modale selezione ruolo
3. selezione nuovo ruolo:
   - se uguale a `currentRole`:
     - mostra avviso
     - blocca conferma
4. se ruolo diverso:
   - mostra schermata di conferma
5. conferma finale:
   - chiama `updateUserRole({ userId, role })`
   - usa `.unwrap()`
   - chiude modale
   - ricarica la pagina

-------------------------------------------------------

**Gestione conferma**
- **prima schermata**
  - selezione ruolo tramite `ListGroup`
- **seconda schermata**
  - alert di conferma
  - pulsanti:
    - `No, go back`
    - `Yes, change role`

-------------------------------------------------------

**Gestione errori**
- errori intercettati nel `catch`
- messaggio mostrato tramite `Alert`
- fallback:
  - `Error updating role`

-------------------------------------------------------

**Comportamento UI**
- pulsante conferma:
  - disabilitato durante `isLoading`
  - testo dinamico:
    - `Updating...`
    - `Yes, change role`
- chiusura modale resetta:
  - `selectedRole`
  - `showConfirm`
  - `alertMessage`

-------------------------------------------------------

**Note**
- il componente **non controlla l’autenticazione**
- il controllo di accesso è basato solo su `isCurrentUserAdmin`
- il `window.location.reload()` forza il refresh dei dati
- il componente è riutilizzabile in:
  - lista utenti
  - pagina profilo

-------------------------------------------------------

**File collegati**
- `src/api/userApi.ts`
- `src/store/authSlice.ts`
- `src/store/hooks.ts`
- `src/types/profile.ts`
- `src/components/UserRoleBadgeModal.tsx`
