// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import useLogout from "@/pages/loginPage/logout";
// import Spinner from "../components/layout/spinner";
// import { API_BASE_URL } from "@/config/env";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null);
//   const [error, setError] = useState(null);

//   const isAuthenticated = localStorage.getItem("userId");
//   const accessToken = localStorage.getItem("accessToken");
//   const loginAs = localStorage.getItem("userRole");
//   const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);
//   const location = useLocation();
//   const logout = useLogout();

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         if (isAuthenticated && accessToken) {
//           let response;
//           const endpoint = loginAs === "training_center"
//             ? `${API_BASE_URL}/training-center/${isAuthenticated}`
//             : `${API_BASE_URL}/users/${isAuthenticated}`;
  
//           response = await axios.get(endpoint, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           });
  
//           setUserRole(response.data.data.role);
//           setIsFirstTimeUser(response.data.data.agree);
//         }
//       } catch (err) {
//         console.error("Error fetching user role:", err.response || err);
//         setError("Failed to fetch user role. Please try again.");
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchUserRole();
//   }, [isAuthenticated, accessToken, loginAs, API_BASE_URL, logout]);
  

//   if (loading) {
//     return (
//     <div className="flex justify-center items-center h-screen">
//       <Spinner />
//     </div>
//     );
    
//   }

//   if (error) {
//     return <div>{error}</div>; // Display error message
//   }

//   if (!isAuthenticated || !accessToken) {
//     logout(); // Cleanup and redirect unauthenticated users
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (location.pathname === "/login" && userRole && isFirstTimeUser !== null) {
//     const rolePaths = isFirstTimeUser
//       ? {
//           admin: "/admin/dashboard",
//           superadmin: "/admin/dashboard",
//           artisan_user: "/trainee/dashboard",
//           intending_artisan: "/trainee/dashboard",
//           training_center: "/trainingcenter/dashboard",
//         }
//       : {
//           artisan_user: "/register/artisan",
//           intending_artisan: "/register/intendingArtisan",
//           training_center: "/register/trainingcenter",
//         };

    
//     return <Navigate to={rolePaths[userRole] || "/"} replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/not-authorized" replace />;
//   }

//   return children; // Allow access to protected route
// };

// export default ProtectedRoute;

// import React, { useEffect, useState, useRef } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import useLogout from "@/pages/loginPage/logout";
// import Spinner from "../components/layout/spinner";
// import { API_BASE_URL } from "@/config/env";

// const roleCache = {}; // Simple cache object (could be expanded later)

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null);
//   const [error, setError] = useState(null);

//   const isAuthenticated = localStorage.getItem("userId");
//   const accessToken = localStorage.getItem("accessToken");
//   const loginAs = localStorage.getItem("userRole");
//   const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);

//   const location = useLocation();
//   const logout = useLogout();

//   const controllerRef = useRef(null);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       setLoading(true);

//       try {
//         if (!isAuthenticated || !accessToken) {
//           logout();
//           return;
//         }

//         // Check cache first
//         if (roleCache[isAuthenticated]) {
//           const cached = roleCache[isAuthenticated];
//           setUserRole(cached.role);
//           setIsFirstTimeUser(cached.agree);
//           setLoading(false);
//           return;
//         }

//         controllerRef.current = new AbortController();

//         const endpoint =
//           loginAs === "training_center"
//             ? `${API_BASE_URL}/training-center/${isAuthenticated}`
//             : `${API_BASE_URL}/users/${isAuthenticated}`;

//         const response = await axios.get(endpoint, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           signal: controllerRef.current.signal, // Pass AbortController signal
//         });

//         const { role, agree } = response.data.data;


//         // Cache result
//         roleCache[isAuthenticated] = { role, agree };

//         setUserRole(role);
//         setIsFirstTimeUser(agree);
//       } catch (err) {
//         if (axios.isCancel(err)) {
//           console.log("Request cancelled", err.message);
//         } else {
//           console.error("Error fetching user role:", err.response || err);
//           setError("Failed to fetch user role. Please try again.");
//           logout();
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();

//     // Cleanup function to abort request on unmount
//     return () => {
//       if (controllerRef.current) {
//         controllerRef.current.abort();
//       }
//     };
//   }, [isAuthenticated, accessToken, loginAs, logout]);

//   // Loading spinner
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return <div>{error}</div>;
//   }

//   // Not authenticated
//   if (!isAuthenticated || !accessToken) {
//     logout();
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Handle first-time user redirects
//   if (location.pathname === "/login" && userRole && isFirstTimeUser !== null) {
//     const rolePaths = isFirstTimeUser
//       ? {
//           admin: "/admin/dashboard",
//           superadmin: "/admin/dashboard",
//           artisan_user: "/trainee/dashboard",
//           intending_artisan: "/trainee/dashboard",
//           training_center: "/trainingcenter/dashboard",
//         }
//       : {
//           artisan_user: "/register/artisan",
//           intending_artisan: "/register/intendingArtisan",
//           training_center: "/register/trainingcenter",
//           admin: "/admin/dashboard",
//           superadmin: "/admin/dashboard",
//         };

//     return <Navigate to={rolePaths[userRole] || "/"} replace />;
//   }

//   // Restrict unauthorized roles
//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/not-authorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import useLogout from "@/pages/loginPage/logout";
import Spinner from "../components/layout/spinner";
import { API_BASE_URL } from "@/config/env";

// In-memory cache for roles
const roleCache = {};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);

  const location = useLocation();
  const logout = useLogout();

  const isAuthenticated = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const loginAs = localStorage.getItem("userRole");

  const controllerRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);

      try {
        if (!isAuthenticated || !accessToken) {
          logout();
          return;
        }

        // Check cache first
        if (roleCache[isAuthenticated]) {
          const cached = roleCache[isAuthenticated];
          setUserRole(cached.role);
          setIsFirstTimeUser(cached.agree);
          setLoading(false);
          return;
        }

        // Setup abort controller
        controllerRef.current = new AbortController();

        const endpoint =
          loginAs === "training_center"
            ? `${API_BASE_URL}/training-center/${isAuthenticated}`
            : `${API_BASE_URL}/users/${isAuthenticated}`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controllerRef.current.signal,
        });

        const { role, agree } = response.data.data;

        // Cache result
        roleCache[isAuthenticated] = { role, agree };

        setUserRole(role);
        setIsFirstTimeUser(agree);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled", err.message);
          // Don't proceed on cancellation
          return;
        }

        console.error("Error fetching user role:", err.response || err);
        setError("Failed to fetch user role. Please try again.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Cleanup function to cancel request on unmount or re-run
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [isAuthenticated, accessToken, loginAs, logout]);

  // 🔵 Loader while fetching role data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 🔴 Display error message if error occurs (and not cancellation)
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout & Retry
          </button>
        </div>
      </div>
    );
  }

  // 🔴 If not authenticated, redirect to login page
  if (!isAuthenticated || !accessToken) {
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🟡 Block unauthorized redirects until role is fetched
  if (!userRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 🟢 Redirect users depending on their first time status (if on login page)
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

    return <Navigate to={rolePaths[userRole] || "/"} replace />;
  }

  // 🟠 Restrict users without allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // ✅ Role is valid, access granted
  return children;
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
