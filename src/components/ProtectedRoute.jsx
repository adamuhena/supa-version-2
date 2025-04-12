// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Navigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import useLogout from "@/pages/loginPage/logout"
// import Spinner from "../components/layout/spinner"
// import { API_BASE_URL } from "@/config/env"
// import { jwtDecode } from "jwt-decode"

// // In-memory cache for roles
// const roleCache = {}

// const checkTokenExpiration = (token) => {
//   if (!token) return true

//   try {
//     const decoded = jwtDecode(token)
//     const currentTime = Date.now() / 1000
//     return decoded.exp < currentTime
//   } catch (error) {
//     console.error("Token decode error:", error)
//     return true // Consider invalid if we can't decode
//   }
// }

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const [loading, setLoading] = useState(true)
//   const [userRole, setUserRole] = useState(null)
//   const [error, setError] = useState(null)
//   const [isFirstTimeUser, setIsFirstTimeUser] = useState(null)
//   const [userData, setUserData] = useState(null)

//   const location = useLocation()
//   const logout = useLogout()

//   const isAuthenticated = localStorage.getItem("userId")
//   const accessToken = localStorage.getItem("accessToken")
//   const loginAs = localStorage.getItem("userRole")

//   // Only decode if token exists
//   const decoded = accessToken ? jwtDecode(accessToken) : null

//   // Track if component is mounted
//   const isMounted = useRef(true)
//   // Track if we've already fetched user data
//   const hasCheckedAuth = useRef(false)
//   // For API requests
//   const controllerRef = useRef(null)

//   useEffect(() => {
//     // Set isMounted to true when component mounts
//     isMounted.current = true

//     // Cleanup function to set isMounted to false when component unmounts
//     return () => {
//       isMounted.current = false
//       if (controllerRef.current) {
//         controllerRef.current.abort()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     // Skip if we've already checked auth or if there's no token
//     if (hasCheckedAuth.current || !isAuthenticated || !accessToken) {
//       if (!isAuthenticated || !accessToken) {
//         // Force logout if no authentication credentials
//         setLoading(false)
//         logout()
//       }
//       return
//     }

//     const fetchUserRole = async () => {
//       // Skip if already loading or if we've already checked
//       if (!isMounted.current || hasCheckedAuth.current) {
//         return
//       }

//       setLoading(true)

//       try {
//         // Check for token existence and expiration
//         if (checkTokenExpiration(accessToken)) {
//           console.log("Token is expired or invalid")
//           setLoading(false)
//           logout()
//           return
//         }

//         // Check cache first
//         if (roleCache[isAuthenticated]) {
//           const cached = roleCache[isAuthenticated]
//           setUserRole(cached.role)
//           setIsFirstTimeUser(cached.agree)
//           setUserData(cached)
//           setLoading(false)
//           hasCheckedAuth.current = true
//           return
//         }

//         // Setup abort controller
//         controllerRef.current = new AbortController()

//         const endpoint =
//           loginAs === "training_center"
//             ? `${API_BASE_URL}/training-center/${isAuthenticated}`
//             : `${API_BASE_URL}/users/${isAuthenticated}`

//         const response = await axios.get(endpoint, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           signal: controllerRef.current.signal,
//           timeout: 10000, // Add timeout to prevent hanging requests
//         })

//         if (!isMounted.current) return

//         // Check if response has the expected data structure
//         if (!response.data || !response.data.data || !response.data.data.role) {
//           console.error("Invalid response structure:", response.data)
//           setError("Invalid user data received")
//           setLoading(false)
//           logout()
//           return
//         }

//         const { role, agree } = response.data.data

//         // Cache result
//         roleCache[isAuthenticated] = {
//           role,
//           agree,
//           ...response.data.data,
//         }

//         setUserRole(role)
//         setIsFirstTimeUser(agree)
//         setUserData(response.data.data)
//         hasCheckedAuth.current = true
//       } catch (err) {
//         if (!isMounted.current) return

//         if (axios.isCancel(err)) {
//           console.log("Request cancelled", err.message)
//           return
//         }

//         console.error("Error fetching user role:", err.response || err)
//         setError("Failed to fetch user role. Please try again.")

//         // Force logout on any API error to prevent hanging in loading state
//         setLoading(false)
//         logout()
//       } finally {
//         if (isMounted.current) {
//           setLoading(false)
//         }
//       }
//     }

//     fetchUserRole()
//   }, [isAuthenticated, accessToken, loginAs, logout])

//   // 🔵 Loader while fetching role data
//   if (loading && !hasCheckedAuth.current) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     )
//   }

//   // 🔴 Display error message if error occurs (and not cancellation)
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
//             Logout & Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // 🔴 If not authenticated, redirect to login page
//   if (!isAuthenticated || !accessToken || checkTokenExpiration(accessToken)) {
//     // Make sure we're not in a loading state
//     if (loading) setLoading(false)
//     logout()
//     return <Navigate to="/login" state={{ from: location }} replace />
//   }

//   // 🟡 Block unauthorized redirects until role is fetched
//   if (!userRole && !hasCheckedAuth.current) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     )
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
//         }

//     return <Navigate to={rolePaths[userRole] || "/"} replace />
//   }

//   // 🟠 Restrict users without allowed roles
//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/not-authorized" replace />
//   }

//   // Create a context provider to pass user data to children
//   return <div className="protected-route-wrapper">{children}</div>
// }

// export default ProtectedRoute


"use client"

import { useEffect, useRef, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import axios from "axios"
import useLogout from "@/pages/loginPage/logout"
import Spinner from "../components/layout/spinner"
import { API_BASE_URL } from "@/config/env"
import { jwtDecode } from "jwt-decode"

// In-memory cache for roles
const roleCache = {}

// Token expiration check function
const checkTokenExpiration = (token) => {
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Token decode error:", error)
    return true // Consider invalid if we can't decode
  }
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [error, setError] = useState(null)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null)
  const [userData, setUserData] = useState(null)

  const location = useLocation()
  const logout = useLogout()

  const isAuthenticated = localStorage.getItem("userId")
  const accessToken = localStorage.getItem("accessToken")
  const loginAs = localStorage.getItem("userRole")

  // Track if component is mounted
  const isMounted = useRef(true)
  // Track if we've already fetched user data
  const hasCheckedAuth = useRef(false)
  // For API requests
  const controllerRef = useRef(null)

  // Check token expiration immediately on mount
  useEffect(() => {
    if (accessToken && checkTokenExpiration(accessToken)) {
      console.log("Token expired on initial check")
      setLoading(false)
      logout()
    }
  }, [accessToken, logout])

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    // Skip if we've already checked auth or if there's no token
    if (hasCheckedAuth.current || !isAuthenticated || !accessToken) {
      if (!isAuthenticated || !accessToken) {
        // Force logout if no authentication credentials
        setLoading(false)
        logout()
      }
      return
    }

    const fetchUserRole = async () => {
      // Skip if already loading or if we've already checked
      if (!isMounted.current || hasCheckedAuth.current) {
        return
      }

      setLoading(true)

      try {
        // Check for token existence and expiration
        if (checkTokenExpiration(accessToken)) {
          console.log("Token is expired or invalid")
          setLoading(false)
          logout()
          return
        }

        // Check cache first
        if (roleCache[isAuthenticated]) {
          const cached = roleCache[isAuthenticated]
          setUserRole(cached.role)
          setIsFirstTimeUser(cached.agree)
          setUserData(cached)
          setLoading(false)
          hasCheckedAuth.current = true
          return
        }

        // Setup abort controller
        controllerRef.current = new AbortController()

        const endpoint =
          loginAs === "training_center"
            ? `${API_BASE_URL}/training-center/${isAuthenticated}`
            : `${API_BASE_URL}/users/${isAuthenticated}`

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controllerRef.current.signal,
          timeout: 10000, // Add timeout to prevent hanging requests
        })

        if (!isMounted.current) return

        // Check if response has the expected data structure
        if (!response.data || !response.data.data || !response.data.data.role) {
          console.error("Invalid response structure:", response.data)
          setError("Invalid user data received")
          setLoading(false)
          logout()
          return
        }

        const { role, agree } = response.data.data

        // Cache result
        roleCache[isAuthenticated] = {
          role,
          agree,
          ...response.data.data,
        }

        setUserRole(role)
        setIsFirstTimeUser(agree)
        setUserData(response.data.data)
        hasCheckedAuth.current = true
      } catch (err) {
        if (!isMounted.current) return

        if (axios.isCancel(err)) {
          console.log("Request cancelled", err.message)
          return
        }

        // Check if error is due to token expiration
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log("Authentication error - token likely expired:", err.response.data)
          setLoading(false)
          logout()
          return
        }

        console.error("Error fetching user role:", err.response || err)
        setError("Failed to fetch user role. Please try again.")

        // Force logout on any API error to prevent hanging in loading state
        setLoading(false)
        logout()
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    fetchUserRole()
  }, [isAuthenticated, accessToken, loginAs, logout])

  // If token is expired, force logout immediately
  if (accessToken && checkTokenExpiration(accessToken)) {
    if (loading) setLoading(false)
    logout()
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🔵 Loader while fetching role data
  if (loading && !hasCheckedAuth.current) {
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
  if (!isAuthenticated || !accessToken) {
    // Make sure we're not in a loading state
    if (loading) setLoading(false)
    logout()
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🟡 Block unauthorized redirects until role is fetched
  if (!userRole && !hasCheckedAuth.current) {
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

  // Create a context provider to pass user data to children
  return <div className="protected-route-wrapper">{children}</div>
}

export default ProtectedRoute



