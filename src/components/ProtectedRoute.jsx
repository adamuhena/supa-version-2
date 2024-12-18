
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import useLogout from "@/pages/loginPage/logout";
import Spinner from "../components/layout/spinner";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isAuthenticated = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const loginAs = localStorage.getItem("userRole");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);
  const location = useLocation();
  const logout = useLogout();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (isAuthenticated && accessToken) {
          let response;
          if (loginAs === "training_center") {
            response = await axios.get(
              `${API_BASE_URL}/training-center/${isAuthenticated}`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          } else {
            response = await axios.get(`${API_BASE_URL}/users/${isAuthenticated}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }
          setUserRole(response.data.data.role);
          setIsFirstTimeUser(response.data.data.agree);

          console.log("My role ", response.data.data.role);
          console.log("isFirstTimeUser ", response.data.data.agree);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError("Failed to fetch user role. Please try again.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, accessToken, loginAs, API_BASE_URL, logout]);

  if (loading) {
    return <Spinner />; // Show a spinner while loading
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  if (!isAuthenticated || !accessToken) {
    logout(); // Cleanup and redirect unauthenticated users
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === "/login" && userRole && isFirstTimeUser !== null) {
    const rolePaths = isFirstTimeUser
      ? {
          admin: "/admin/dashboard",
          superadmin: "/admin/dashboard",
          artisan_user: "/trainee/dashboard",
          intending_artisan: "/trainee/dashboard",
          training_center: "/trainingcenter/dashboard",
        }
      : {
          artisan_user: "/register/artisan",
          intending_artisan: "/register/intendingArtisan",
          training_center: "/register/trainingcenter",
        };
  
    console.log("Redirecting to:", rolePaths[userRole]);
    return <Navigate to={rolePaths[userRole] || "/"} replace />;
  }
  

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children; // Allow access to protected route
};

export default ProtectedRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const accessToken = localStorage.getItem("accessToken");
//   const userRole = localStorage.getItem("userRole");

//   // If no token exists, redirect to the login page
//   if (!accessToken) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check if the user role is authorized to access the route
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // If authorized, render the child components
//   return children;
// };

// export default ProtectedRoute;
