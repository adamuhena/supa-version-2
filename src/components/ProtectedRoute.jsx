import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();

  // Handle redirect for already logged-in users on the login page
  if (location.pathname === "/login" && accessToken) {
    const rolePaths = {
      admin: "/admin/dashboard",
      super_admin: "/admin/dashboard",
      artisan_user: "/artisan/dashboard",
      intending_artisan: "/intending-artisan/dashboard",
    };

    return <Navigate to={rolePaths[userRole] || "/"} replace />;
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect unauthorized users to the "not authorized" page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;
