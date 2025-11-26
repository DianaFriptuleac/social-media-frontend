import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import LoginPage from "../Components/LoginPage";
import RegisterPage from "../Components/RegisterPage";
import type React from "react";
import HomePage from "../Components/HomePage";
import UserPage from "../Components/UserPage";
import DepartmentsPage from "../Components/DepartmentsPage";

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Rotte protette
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/me",
        element: <UserPage />,
      },
      {
        path: "/departments",
        element: <DepartmentsPage />,
      },
    ],
  },
  // catch-all
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
]);
