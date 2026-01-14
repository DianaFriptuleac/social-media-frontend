**Cartella `src/utils/`** (`utility functions`)

*Serve per:*
- **contenere funzioni di utilità riutilizzabili**
- **evitare duplicazione di logica**
- **centralizzare helper legati a RTK Query, tipi ed error handling**

-------------------------------------------------------

**1 File `rtkQuery.ts`**

*Serve per:*
- **identificare in modo sicuro gli errori di RTK Query**
- **distinguere gli errori di rete / backend da altri errori**
- **abilitare controlli tipizzati sugli errori**

-------------------------------------------------------

**Dipendenze**
- `@reduxjs/toolkit/query`
  - `FetchBaseQueryError`

-------------------------------------------------------

**Funzione `isFetchBaseQueryError`**
- riceve un valore di tipo `unknown`
- verifica se:
  - è un oggetto
  - non è `null`
  - contiene la proprietà `status`
- se sì:
  - TypeScript lo riconosce come `FetchBaseQueryError`

-------------------------------------------------------

**Perché `error: unknown`**
- RTK Query può restituire errori di tipo diverso
- usare `unknown`:
  - è più sicuro di `any`
  - obbliga a fare controlli prima di accedere alle proprietà
- evita errori runtime

-------------------------------------------------------

**Type Guard**
- la funzione è una **type guard**
- grazie a:
  - `error is FetchBaseQueryError`
- TypeScript:
  - restringe automaticamente il tipo
  - abilita autocomplete e controlli corretti

-------------------------------------------------------

**Esempio di utilizzo**
- gestione errori API
- distinzione tra:
  - errore 401 / 403 (permessi)
  - errore 500 (server)
  - errori generici JS

**Vantaggi**
- codice più leggibile
- meno `as any`
- meno errori runtime
- migliore integrazione con TypeScript

**Note**
- la funzione **non gestisce l’errore**
- serve solo a:
  - identificarlo
  - tipizzarlo correttamente
- la logica di UI (alert, redirect, ecc.) resta nei componenti

-------------------------------------------------------

**File collegati**
- `src/components/UsersListPage.tsx`
- `src/api/userApi.ts`
- `src/api/authApi.ts`

