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
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError("Failed to fetch user role. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, accessToken, loginAs, API_BASE_URL]);

  // Handle redirect for already logged-in users on the login page
  if (location.pathname === "/login" && accessToken && userRole) {
    const rolePaths = {
      admin: "/admin/dashboard",
      superadmin: "/admin/dashboard",
      artisan_user: "/trainee/dashboard",
      intending_artisan: "/trainee/dashboard",
      training_center: "/trainingcenter/dashboard",
    };

    return <Navigate to={rolePaths[userRole] || "/"} replace />;
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated || !accessToken) {
    logout(); // Ensure proper cleanup
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect unauthorized users to the "not authorized" page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Handle loading state while fetching role
  if (loading) {
    return
  }

  // Handle error during the role fetch
  if (error) {
    return <div>{error}</div>;
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;
