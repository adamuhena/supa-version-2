import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios"; // Or fetch if you prefer
import useLogout from "@/pages/loginPage/logout";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isAuthenticated = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  const logout = useLogout();

  useEffect(() => {
    // If the user is authenticated, fetch their role from the API
    if (isAuthenticated && accessToken) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/${isAuthenticated}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUserRole(response.data.data.role);
        } catch (err) {
          setError(err);
          logout(); // Correctly call the logout function
        } finally {
          setLoading(false);
          
        }
      };

      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, accessToken, logout]);

  // Handle redirect for already logged-in users on the login page
  if (location.pathname === "/login" && accessToken && userRole) {
    const rolePaths = {
      admin: "/admin/dashboard",
      superadmin: "/admin/dashboard",
      artisan_user: "/artisan/dashboard",
      intending_artisan: "/intending-artisan/dashboard",
      training_center: "/trainingcenter/dashboard",
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

  // Handle loading state while fetching role
  if (loading) {
    return <div></div>; // You can replace this with a spinner or other indicator
  }

  // Handle error during the role fetch
  if (error) {
    console.error(error); // Log error for debugging
    return <div>Error: {error.message}</div>;
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;
