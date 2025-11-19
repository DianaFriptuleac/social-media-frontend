import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store/store";
import { loadFromStorage } from "./store/authSlice";

import "bootstrap/dist/css/bootstrap.min.css";

// carico token/utente da localStorage all'avvio (per mantenere l'utente loggato anche dopo refresh della pagina)
store.dispatch(loadFromStorage());
// Monta l'app React dentro il div #root della pagina HTML
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // StrictMode aiuta a trovare errori e warning in sviluppo (non in produzione)
  <React.StrictMode>
    {/* Provider x Redux */}
    <Provider store={store}>
      {/* BrowserRouter: abilito le rotte (/home, /login, /profile etc.) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
