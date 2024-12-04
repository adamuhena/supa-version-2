import React from "react";
import { Navigate } from "react-router-dom";
import useLogout from "@/pages/loginPage/logout";

const PublicRoute = ({ children }) => {
  const  logout = useLogout();
  const isAuthenticated = localStorage.getItem("accessToken") && localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  // Redirect authenticated users to their respective dashboards
  if (isAuthenticated) {
    switch (userRole) {
      case "admin":
      case "superadmin":
        return <Navigate to="/admin/dashboard" replace />;
      case "artisan_user":
        return <Navigate to="/artisan/dashboard" replace />;
      case "intending_artisan":
        return <Navigate to="/intending_artisan/dashboard" replace />;
      case "training_center":
        return <Navigate to="/trainingcenter/dashboard" replace />;
      default:
        logout();
        return <Navigate to="/" replace />;
    }
  }
 
  // Allow unauthenticated users to access the route
  return children;
};

export default PublicRoute;
