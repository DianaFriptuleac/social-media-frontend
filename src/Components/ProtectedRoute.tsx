import type React from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";

// ProtectedRoute: componente che protegge le pagine private
// Controlla se l’utente è loggato (controllando il token)
// Se non è loggato - reindirizza al login
// Se loggato - permette l'accesso alla pagina richiesta

// Interface TS per i props del componente (ProtectedRoute deve ricevere un "children")
// quello che devo mostrare solo se l'utente è loggato
interface Props {
  children: React.ReactNode;
}
// ProtectedRoute come Functional Component che riceve i props definiti sopra
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token); // leggo il token dal Redux Store
  if (!token) {
    // replace - evita che la pagina protetta resti nella history
    // (non posso tornare indietro col tasto back)
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;
