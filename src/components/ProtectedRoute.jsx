// import React, { useEffect, useRef, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import useLogout from "@/pages/loginPage/logout";
// import Spinner from "../components/layout/spinner";
// import { API_BASE_URL } from "@/config/env";
// import { jwtDecode } from "jwt-decode";

// // In-memory cache for roles
// const roleCache = {};

// const checkTokenExpiration = (token) => {
//   if (!token) return true;
  
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decoded.exp < currentTime;
//   } catch (error) {
//     console.error("Token decode error:", error);
//     return true;
//   }
// };

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null);
//   const [error, setError] = useState(null);
//   const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);

//   const location = useLocation();
//   const logout = useLogout();

//   const isAuthenticated = localStorage.getItem("userId");
//   const accessToken = localStorage.getItem("accessToken");
//   const loginAs = localStorage.getItem("userRole");
//   const decoded = jwtDecode(accessToken);

//   console.log(decoded);

//   const controllerRef = useRef(null);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       setLoading(true);

//       try {
//         // Check for token existence and expiration
//         if (!isAuthenticated || !accessToken || checkTokenExpiration(accessToken)) {
//           console.log("Token is expired or invalid");
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

//         // Setup abort controller
//         controllerRef.current = new AbortController();

//         const endpoint =
//           loginAs === "training_center"
//             ? `${API_BASE_URL}/training-center/${isAuthenticated}`
//             : `${API_BASE_URL}/users/${isAuthenticated}`;

//         const response = await axios.get(endpoint, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           signal: controllerRef.current.signal,
//         });

//         const { role, agree } = response.data.data;

//         // Cache result
//         roleCache[isAuthenticated] = { role, agree };

//         setUserRole(role);
//         setIsFirstTimeUser(agree);
//       } catch (err) {
//         if (axios.isCancel(err)) {
//           console.log("Request cancelled", err.message);
//           // Don't proceed on cancellation
//           return;
//         }

//         console.error("Error fetching user role:", err.response || err);
//         setError("Failed to fetch user role. Please try again.");
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();

//     // Cleanup function to cancel request on unmount or re-run
//     return () => {
//       if (controllerRef.current) {
//         controllerRef.current.abort();
//       }
//     };
//   }, [isAuthenticated, accessToken, loginAs, logout]);

//   // 🔵 Loader while fetching role data
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // 🔴 Display error message if error occurs (and not cancellation)
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <button
//             onClick={logout}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Logout & Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔴 If not authenticated, redirect to login page
//   if (!isAuthenticated || !accessToken || checkTokenExpiration(accessToken)) {
//     logout();
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 🟡 Block unauthorized redirects until role is fetched
//   if (!userRole) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // 🟢 Redirect users depending on their first time status (if on login page)
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

//   // 🟠 Restrict users without allowed roles
//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/not-authorized" replace />;
//   }

//   // ✅ Role is valid, access granted
//   return children;
// };

// export default ProtectedRoute;


"use client"

import { useEffect, useRef, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import axios from "axios"
import useLogout from "@/pages/loginPage/logout"
import Spinner from "../components/layout/spinner"
import { API_BASE_URL } from "@/config/env"
import { jwtDecode } from "jwt-decode"

// In-memory cache for roles with expiration
const roleCache = {}

const checkTokenExpiration = (token) => {
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Token decode error:", error)
    return true
  }
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [error, setError] = useState(null)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null)
  const [requestAttempts, setRequestAttempts] = useState(0)

  const location = useLocation()
  const logout = useLogout()

  const isAuthenticated = localStorage.getItem("userId")
  const accessToken = localStorage.getItem("accessToken")
  const loginAs = localStorage.getItem("userRole")

  // Only decode if token exists
  let decoded = null
  try {
    if (accessToken) {
      decoded = jwtDecode(accessToken)
    }
  } catch (error) {
    console.error("Failed to decode token:", error)
  }

  const controllerRef = useRef(null)
  const MAX_ATTEMPTS = 3

  useEffect(() => {
    const fetchUserRole = async () => {
      // Don't proceed if we've already tried too many times
      if (requestAttempts >= MAX_ATTEMPTS) {
        setError("Maximum request attempts reached. Please try logging in again.")
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        // Check for token existence and expiration
        if (!isAuthenticated || !accessToken || checkTokenExpiration(accessToken)) {
          console.log("Token is expired or invalid")
          logout()
          return
        }

        // Check cache first with timestamp validation
        if (roleCache[isAuthenticated] && roleCache[isAuthenticated].timestamp > Date.now() - 5 * 60 * 1000) {
          const cached = roleCache[isAuthenticated]
          setUserRole(cached.role)
          setIsFirstTimeUser(cached.agree)
          setLoading(false)
          return
        }

        // Setup abort controller
        if (controllerRef.current) {
          controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        const endpoint =
          loginAs === "training_center"
            ? `${API_BASE_URL}/training-center/${isAuthenticated}`
            : `${API_BASE_URL}/users/${isAuthenticated}`

        console.log(`Fetching user role from: ${endpoint}`)

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controllerRef.current.signal,
          timeout: 10000, // 10 second timeout
        })

        // Check if we got a valid response with data
        if (!response.data || !response.data.data) {
          throw new Error("Invalid response format from server")
        }

        const { role, agree } = response.data.data

        // Cache result with timestamp
        roleCache[isAuthenticated] = {
          role,
          agree,
          timestamp: Date.now(),
        }

        setUserRole(role)
        setIsFirstTimeUser(agree)
        setRequestAttempts(0) // Reset attempts on success
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled", err.message)
          // Don't proceed on cancellation
          return
        }

        console.error("Error fetching user role:", err.response || err)

        // Increment attempt counter
        setRequestAttempts((prev) => prev + 1)

        // Handle specific error cases
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 401 || err.response.status === 403) {
            setError("Authentication failed. Please log in again.")
            logout()
            return
          } else if (err.response.status === 204) {
            setError("Server returned no content. Please contact support.")
            return
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from server. Please check your connection.")
        } else {
          // Something happened in setting up the request
          setError("Failed to fetch user role: " + err.message)
        }

        // Only logout on the final attempt
        if (requestAttempts >= MAX_ATTEMPTS - 1) {
          logout()
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()

    // Cleanup function to cancel request on unmount or re-run
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
    }
  }, [isAuthenticated, accessToken, loginAs, logout, requestAttempts])

  // 🔵 Loader while fetching role data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  // 🔴 Display error message if error occurs (and not cancellation)
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout & Retry
          </button>
        </div>
      </div>
    )
  }

  // 🔴 If not authenticated, redirect to login page
  if (!isAuthenticated || !accessToken || checkTokenExpiration(accessToken)) {
    logout()
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🟡 Block unauthorized redirects until role is fetched
  if (!userRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
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
        }

    return <Navigate to={rolePaths[userRole] || "/"} replace />
  }

  // 🟠 Restrict users without allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />
  }

  // ✅ Role is valid, access granted
  return children
}

export default ProtectedRoute

