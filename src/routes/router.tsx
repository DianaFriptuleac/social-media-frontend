import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import LoginPage from "../Components/LoginPage";
import RegisterPage from "../Components/RegisterPage";
import type React from "react";
import HomePage from "../Components/HomePage";
import UserPage from "../Components/UserPage";
import DepartmentsPage from "../Components/DepartmentsPage";
import AppNavbar from "../Components/AppNavbar";
import UsersListPage from "../Components/UsersListPage";
import SingleUserDetail from "../Components/SingleUserDetail";
import PostPageInbox from "../Components/Posts/PostInboxPage";
import PostDetailPage from "../Components/Posts/PostDetailPage";
import MessagesPage from "../Components/Messages/MessagePage";
import EventsPage from "../Components/Events/EventsPage";
import EventDetailPage from "../Components/Events/EventDetailPage";

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <>
      <div id="page-wrapper">
        <AppNavbar />
        {/* Navbar fixed="top" - serve un padding */}
        <Outlet /> {/* Qui si renderizza la pagina corrente */}
      </div>
    </>
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
      {
        path: "/users",
        element: <UsersListPage />,
      },
      {
        path: "/users/:id",
        element: <SingleUserDetail />,
      },
      {
        path: "/inbox",
        element: <PostPageInbox />,
      },
      {
        path: "/posts/:id",
        element: <PostDetailPage />,
      },
      {
        path: "/messages",
        element: <MessagesPage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/events/:id",
        element: <EventDetailPage />,
      },
    ],
  },
  // catch-all
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
]);
