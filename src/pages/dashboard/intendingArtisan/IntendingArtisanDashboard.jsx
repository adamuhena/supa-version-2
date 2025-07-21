// import DashboardPage from "@/components/layout/DashboardLayout";
// import Spinner from "@/components/layout/spinner";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { Briefcase, LogOut, Star, UserCircle } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "@/config/env";

// const IntendingArtisanDashboard = ({ artisan = { rating: 4.5 } }) => {
//   const logout = useLogout();

//   const [userData, setUserData] = useState(null); // Holds the user data
//   const navigate = useNavigate();

//   // Fetch user data from API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const userId = localStorage.getItem("userId");

//         if (!accessToken || !userId) {
//           return; // If no token or userId, you can handle this with a redirect or error state
//         }

//         const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (response.data.success) {
//           setUserData(response.data.data); // Set the user data in state
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (!userData) {
//     return (
//           <div className="flex justify-center items-center h-screen">
//             <Spinner />
//           </div>
//         );
//   }

//   return (
//     <ProtectedRoute href="/intending-artisan/dashboard">
//       {/* <DashboardPage
//         href="/intending-artisan/dashboard"
//         title="Intending Artisan Dashboard"> */}
//         <div className="container mx-auto p-6">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold"> Dashboard </h1>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate("/biodata")}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>

//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
//               <CardHeader>
//                 <CardTitle>Profile</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col items-center">
//                 <Avatar className="h-24 w-24 mb-4">
//                   <AvatarImage
//                     src="/placeholder.svg?height=96&width=96"
//                     alt={artisan.name}
//                   />
//                   <AvatarFallback>{userData.firstName}</AvatarFallback>
//                   {/* {artisan.name.split(' ').map(n => n[0]).join('')}  */}
//                 </Avatar>
//                 <h2 className="text-2xl font-semibold">{userData.firstName}</h2>
//                 <Badge className="mt-2">
//                   {userData.priorSkillsCerts.tradeArea}
//                 </Badge>
//                 <div className="flex items-center mt-2">
//                   <Star className="h-5 w-5 text-yellow-400 mr-1" />
//                   <span>{artisan.rating}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-yellow-400 p-4 rounded-lg shadow-md">
//               <CardHeader>
//                 <CardTitle>Licensing | Certification</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-md text-emerald-800 mb-2">
//                   Cirtification Status:
//                 </div>
//                 {userData.certifiedStatus === false ? (
//                   <Badge variant="destructive">Not Certified</Badge>
//                 ) : userData.certifiedStatus === true ? (
//                   <Badge variant="success" className="bg-green-400 text-white">
//                     Certified
//                   </Badge>
//                 ) : null}
//                 <div className="text-md text-red-600 mb-2 mt-5">
//                   License Status:
//                 </div>
//                 {userData.licenseStatus === false ? (
//                   <Badge variant="destructive">Not Licensed</Badge>
//                 ) : userData.licenseStatus === true ? (
//                   <Badge variant="success" className="bg-green-400 text-white">
//                     Licensed
//                   </Badge>
//                 ) : null}
//                 <div className="mt-4">
//                   {userData.certifiedStatus === false ||
//                   userData.licenseStatus === false ? (
//                     <Button
//                       className="w-full"
//                       onClick={() => navigate("/certification/upload")}>
//                       {userData.certifiedStatus === false
//                         ? "Get Certified"
//                         : "Get Licensed"}
//                     </Button>
//                   ) : null}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
//               <CardHeader>
//                 <CardTitle>Profession</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-md text-emerald-800 mb-2">
//                   Sector: {userData.priorSkillsCerts[0]?.sector}
//                 </div>
//                 <div className="text-md text-emerald-800 mb-2">
//                   Sector: {userData.priorSkillsCerts[0]?.tradeArea}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="mt-6">
//             <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
//               <CardHeader>
//                 <CardTitle> Assigned Up-Skilling Center</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-4">
//                   <li className="flex items-center justify-between">
//                     <div className="flex items-center gap-10">
//                       <Briefcase className="h-5 w-5 mr-2" />
//                       <div className="px-10">
//                         <p className="font-medium">
//                           {userData.stateOfResidence}
//                         </p>
//                       </div>
//                       <div className="px-10">
//                         <p className="text-sm text-muted-foreground">
//                           {userData.lgaOfResidence}{" "}
//                         </p>
//                       </div>
//                       <div className="px-10">
//                         <p className="text-sm text-muted-foreground">
//                           {userData.priorSkillsCerts[0]?.year}{" "}
//                         </p>
//                       </div>
//                       <div className="px-10">
//                         <p className="font-medium">{userData.street}</p>
//                       </div>
//                     </div>
//                     <Badge
//                       variant="success"
//                       className="bg-green-400 text-white">
//                       Completed
//                     </Badge>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       {/* </DashboardPage> */}
//     </ProtectedRoute>
//   );
// };

// export default IntendingArtisanDashboard;


import DashboardPage from "@/components/layout/DashboardLayout";
import Spinner from "@/components/layout/spinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { 
  Briefcase, 
  LogOut, 
  Star, 
  UserCircle,
  Award,
  Shield,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Calendar as CalendarIcon,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../Admin/components/Calendar";
import { API_BASE_URL } from "@/config/env";

const IntendingArtisanDashboard = ({ artisan = { rating: 4.5 } }) => {
  const logout = useLogout();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  const getUserRole = (userRole) => {
    if (userRole === "artisan_user") {
      return "ARTISAN";
    } else if (userRole === "intending_artisan") {
      return "INTENDING ARTISAN";
    } else if (userRole === "superadmin") {
      return "SUPER ADMIN";
    }
    return "GUEST";
  };

  const role = getUserRole(userRole);

  // Fetch user data from API with improved error handling
  const fetchUserData = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
        setError(null);
      }

      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken || !userId) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setError(null);
      } else {
        setError("Failed to load user data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Unable to connect to server. Please check your internet connection.");
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Calculate progress based on user data completion
  const calculateProgress = (userData) => {
    if (!userData) return 0;
    
    let progress = 0;
    const totalSteps = 4;
    
    if (userData.firstName) progress += 25;
    if (userData?.priorSkillsCerts?.length > 0) progress += 25;
    if (userData.certifiedStatus) progress += 25;
    if (userData.licenseStatus) progress += 25;
    
    return progress;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ARTISAN":
        return "bg-emerald-600";
      case "INTENDING ARTISAN":
        return "bg-blue-600";
      case "SUPER ADMIN":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusBadge = (status, type) => {
    if (status === true) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-800 font-medium text-sm">
            {type === 'cert' ? 'Certified' : 'Licensed'}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-800 font-medium text-sm">
            {type === 'cert' ? 'Not Certified' : 'Not Licensed'}
          </span>
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => fetchUserData(true)}
            disabled={isRetrying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(userData);

  return (
    <ProtectedRoute href="/intending-artisan/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4 md:px-8 py-8">
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <AvatarImage
                      src={userData?.profileImage}
                      alt={userData?.firstName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600">
                      {userData?.firstName?.[0] || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                    <div className={`w-4 h-4 rounded-full ${getRoleColor(role)}`}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">
                    Welcome back, {userData?.firstName || 'User'}!
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={`${getRoleColor(role)} text-white px-3 py-1 font-medium`}>
                      {role}
                    </Badge>
                    {userData?.priorSkillsCerts?.[0]?.sector && (
                      <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
                        {userData.priorSkillsCerts[0].sector}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">
                      {userData?.priorSkillsCerts?.[0]?.tradeArea || 'Trade Area Not Specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/biodata")}
                  className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <UserCircle className="h-4 w-4" />
                  Update Profile
                </Button>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-0"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Certification</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData?.certifiedStatus ? 'Certified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">License</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData?.licenseStatus ? 'Licensed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Progress</p>
                    <p className="text-lg font-bold text-gray-900">{progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Since</p>
                    <p className="text-lg font-bold text-gray-900">2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sector</p>
                      <p className="font-semibold text-gray-900">
                        {userData?.priorSkillsCerts?.[0]?.sector || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Trade Area</p>
                      <p className="font-semibold text-gray-900">
                        {userData?.priorSkillsCerts?.[0]?.tradeArea || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">
                        {userData?.lgaOfResidence || 'Not specified'}, {userData?.stateOfResidence || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certification & Licensing */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Certification Status</p>
                    {getStatusBadge(userData?.certifiedStatus, 'cert')}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">License Status</p>
                    {getStatusBadge(userData?.licenseStatus, 'license')}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {(userData?.certifiedStatus === false || userData?.licenseStatus === false) && (
                    <Button
                      className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate("/certification/upload")}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      {userData?.certifiedStatus === false ? "Get Certified" : "Get Licensed"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <Calendar />
              </CardContent>
            </Card>
          </div>

          {/* Up-skilling Center Section */}
          <div className="mt-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Assigned Up-Skilling Center
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-semibold text-gray-900">
                          {userData?.stateOfResidence || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">LGA</p>
                        <p className="font-semibold text-gray-900">
                          {userData?.lgaOfResidence || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Year</p>
                        <p className="font-semibold text-gray-900">
                          {userData?.priorSkillsCerts?.[0]?.year || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold text-gray-900">
                          {userData?.street || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-emerald-900">Training Center Assignment</p>
                        <p className="text-sm text-emerald-700">You have been assigned to a training center</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white px-4 py-2">
                      Assigned
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default IntendingArtisanDashboard;