import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import HomePage from "./Components/HomePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserPage from "./Components/UserPage";
import DepartmentsPage from "./Components/DepartmentsPage";

// Da coomentare- non utilizzo piu.
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/me" element = {
        <ProtectedRoute><UserPage/></ProtectedRoute>}/>
          <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DepartmentsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
