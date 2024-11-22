import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();

  // Redirect authenticated users away from the login page
  if (location.pathname === "/login" && accessToken) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "superadmin":
        return <Navigate to="/admin/dashboard" replace />;
      case "artisan_user":
        return <Navigate to="/artisan/dashboard" replace />;
      case "intending_artisan":
        return <Navigate to="/intendingArtisan/dashboard" replace />;
      default:
        return <Navigate to="/register/trainingcenter" replace />;
    }
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect unauthorized users to the not-authorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;


// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   // Fetch session details
//   const isAuthenticated = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("userRole");

//   // Redirect to login if the user is not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check role-based access
//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/not-authorized" replace />;
//   }

//   // Render the protected content if all checks pass
//   return children;
// };

// export default ProtectedRoute;
