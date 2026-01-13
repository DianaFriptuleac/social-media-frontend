**Cartella `src/store/`** (`Redux Store`)

*Serve per:*
- **gestire lo stato globale dell’applicazione**
- **centralizzare autenticazione, profilo utente e stato UI**
- **integrare RTK Query nello store Redux**
- **fornire hook tipizzati per React** (`useAppDispatch`, `useAppSelector`)

-----------------------------------------------------------------------------------------------------

**1. `authSlice.ts`** (`authentication slice`)

*Gestisce:*
- **stato di login e logout**
- **utente loggato**
- **token JWT**
- **errori di autenticazione**
- **persistenza dati in `localStorage`**

*Stato (initialState) (`AuthState`):*
- `user: User | null`
- `token: string | null`
- `loading: boolean`
- `error: string | null`

*Reducers principali:*
1. **`authStarted`**
   - imposta `loading = true`
   - resetta eventuali errori

2. **`authSuccess`**
   - salva `user` e `token` nello store
   - persiste `token` e `user` in `localStorage`

3. **`authFailed`**
   - imposta `loading = false`
   - salva il messaggio di errore

4. **`logout`**
   - resetta lo stato auth
   - rimuove `token` e `user` dal `localStorage`

5. **`loadFromStorage`**
   - ricarica `user` e `token` dal `localStorage`
   - usato all’avvio dell’applicazione

-----------------------------------------------------------------------------------------------------

**2. `departmentSlice.ts`** (`department UI slice`)

*Gestisce:*
- **stato UI dei departments**
- **reparto selezionato**
- **paginazione lato frontend**

*Stato (initialState) (`DepartmentUIState`):*
- `selectedDepartmentId: string | null`
- `page: number`
- `pageSize: number`

*Reducers principali:*
1. **`setSelectedDepartment`**
   - imposta il reparto selezionato
   - resetta la pagina a `1`

2. **`setPage`**
   - aggiorna la pagina corrente

3. **`setPageSize`**
   - aggiorna la dimensione pagina
   - resetta la pagina a `1`

-----------------------------------------------------------------------------------------------------

**3. `profileSlice.ts`** (`profile slice`)

*Gestisce:*
- **profilo dell’utente loggato**
- **reparti dell’utente con ruoli**
- **stato di loading ed error del profilo**

*Stato (initialState) (`ProfileState`):*
- `profile: User | null`
- `departments: UserDepartmentRolesView[]`
- `loading: boolean`
- `error: string | null`

*Reducers principali:*
1. **`profileStarted`**
   - attiva lo stato di loading

2. **`profileFailed`**
   - salva il messaggio di errore

3. **`profileLoaded`**
   - salva i dati del profilo utente

4. **`departmentsLoaded`**
   - salva reparti e ruoli dell’utente

5. **`profileUpdated`**
   - aggiorna i dati del profilo

6. **`avatarUpdated`**
   - aggiorna solo l’`avatar` del profilo

7. **`resetProfile`**
   - resetta lo stato iniziale

-----------------------------------------------------------------------------------------------------

**4. `hooks.ts`** (`typed redux hooks`)

*Serve per:*
- **evitare l’uso diretto di `useDispatch` e `useSelector`**
- **garantire tipizzazione corretta dello store Redux**

*Hook esportati:*
- **`useAppDispatch`** → dispatch tipizzato con `AppDispatch`
- **`useAppSelector`** → selector tipizzato con `RootState`

-----------------------------------------------------------------------------------------------------

**5. `store.ts`** (`store configuration`)

*Serve per:*
- **creare lo store Redux tramite `configureStore`**
- **registrare slice Redux e RTK Query**
- **configurare i middleware**

*Reducer registrati:*
- **`auth`** → `authSlice`
- **`profile`** → `profileSlice`
- **`departmentUI`** → `departmentSlice`
- **`api`** → RTK Query (`emptyApi.reducer`)

*Middleware (livello intermedio tra dispatch(action) e reducer -  "filtro"):*
- middleware di default Redux Toolkit
- middleware RTK Query (`emptyApi.middleware`)

`middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(emptyApi.middleware)`

`getDefaultMiddleware()`
*Redux Toolkit aggiunge automaticamente middleware standard:*
- `thunk` → permette async logic
- `serializableCheck` → controlla che lo stato sia serializzabile
- `immutableCheck` → controlla che lo stato non venga mutato

               - evitano bug
               - non li scrivo io
               - sono “di sicurezza”

`emptyApi.middleware` (RTK Query)
Fondamentale e serve per:
- eseguire le chiamate HTTP
- gestire cache
- gestire loading / error
- fare refetch automatico
- invalidare cache con i tag
- deduplicare richieste uguali

*Senza questo middleware:*
- `useGetAllUsersQuery` non funzionerebbe
- le API non partirebbero
- la cache non esisterebbe

*Tipi esportati:*
- **`RootState`** → tipo dello stato globale
- **`AppDispatch`** → tipo del dispatch Redux
