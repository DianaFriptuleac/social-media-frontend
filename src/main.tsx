import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { loadFromStorage } from "./store/authSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/theme.css"
import { router } from "./routes/router";

// carico token/utente da localStorage all'avvio (per mantenere l'utente loggato anche dopo refresh della pagina)
store.dispatch(loadFromStorage());

// Monta l'app React dentro il div #root della pagina HTML
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // StrictMode aiuta a trovare errori e warning in sviluppo (non in produzione)
  <React.StrictMode>
    {/* Provider x Redux: DEVE avere dei children  */}
    <Provider store={store}>
      <RouterProvider router={router} />   {/*tutte le rotte */}
    </Provider>
  </React.StrictMode>
);
