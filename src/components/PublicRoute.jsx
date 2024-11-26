import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken") && localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  // Redirect authenticated users to their respective dashboards
  if (isAuthenticated) {
    switch (userRole) {
      case "admin":
      case "super_admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "artisan_user":
        return <Navigate to="/artisan/dashboard" replace />;
      case "intending_artisan":
        return <Navigate to="/intending-artisan/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
 
  // Allow unauthenticated users to access the route
  return children;
};

export default PublicRoute;
