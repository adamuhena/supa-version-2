import { useParams } from "react-router-dom";
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
  LogOut, 
  Star, 
  UserCircle, 
  Award,
  Shield,
  Calendar as CalendarIcon,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Phone,
  Mail,
  House as HouseIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../Admin/components/Calendar";
import {
  default as ArtisanTrainingManagement,
  default as UserGroupDetails,
} from "./userGroupDetail";
import { API_BASE_URL } from "@/config/env";
import { downloadAdmissionLetterPDF } from "@/components/AdmissionLetterPDF";

const ArtisanDashboard = ({
  artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
}) => {
  const logout = useLogout();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const [admissionEnabled, setAdmissionEnabled] = useState(false);
  const [periodStatus, setPeriodStatus] = useState("");
  const [periodName, setPeriodName] = useState("");

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


  useEffect(() => {
    async function fetchAdmissionStatus() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/periods/current`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setAdmissionEnabled(res.data.admissionLetterEnabled);
        setPeriodStatus(res.data.status);
        setPeriodName(res.data.name);
      } catch (err) {
        setAdmissionEnabled(false);
        setPeriodStatus("");
        setPeriodName("");
      }
    }
    fetchAdmissionStatus();
  }, []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Spinner />
          
        </div>
      </div>
    );
  }

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

  // Find most recent verification (by date)
  const sortedVerifications = [...(userData.verifications || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestVerification = sortedVerifications[0];

  let assignment = null;
  if (latestVerification && latestVerification.trainingAssignment) {
    assignment = Array.isArray(latestVerification.trainingAssignment)
      ? latestVerification.trainingAssignment[0]
      : latestVerification.trainingAssignment;
  }

  // Get training center details
  let center = null;
  if (
    assignment &&
    assignment.currentAssignment &&
    assignment.currentAssignment.trainingCenterId &&
    typeof assignment.currentAssignment.trainingCenterId === "object"
  ) {
    center = assignment.currentAssignment.trainingCenterId;
  } else if (assignment && typeof assignment.trainingCenterId === "object" && assignment.trainingCenterId !== null) {
    center = assignment.trainingCenterId;
  }

  return (
    <ProtectedRoute href="/trainee/dashboard">
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
                      {userData.firstName?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                    <div className={`w-4 h-4 rounded-full ${getRoleColor(role)}`}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">
                    Welcome back, {userData.firstName}!
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={`${getRoleColor(role)} text-white px-3 py-1 font-medium`}>
                      {role}
                    </Badge>
                    {userData.priorSkillsCerts[0]?.sector && (
                      <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
                        {userData.priorSkillsCerts[0]?.sector}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">
                      {userData.priorSkillsCerts[0]?.tradeArea || 'Trade Area Not Specified'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Certification / Licensing</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData.certifiedStatus ? 'Certified' : 'Pending'}
                    </p>
                  </div>
                  {userData.certifiedStatus !== true && userData.role !== "intending_artisan" && (
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => navigate("/certification/upload")}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Get Certified
                      </Button>
                    </div>
                  )}
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
                    <p className="text-sm text-gray-600 font-medium">Verification Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData.currentVerificationStatus.charAt(0).toUpperCase() + userData.currentVerificationStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Progress</p>
                    <p className="text-lg font-bold text-gray-900">85%</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Since</p>
                    <p className="text-md font-bold text-gray-900">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  
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
                        {userData.priorSkillsCerts[0]?.sector || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Trade Area</p>
                      <p className="font-semibold text-gray-900">
                        {userData.priorSkillsCerts[0]?.tradeArea || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Training Center */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {/* <Shield className="h-5 w-5 text-emerald-600" />
                  Credentials */}
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  {userRole === "intending_artisan" || userRole === "artisan_user"
                    ? "Assigned Training Center"
                    : "Training Center"}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                {/* <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Certification Status</p>
                    {getStatusBadge(userData.certifiedStatus, 'cert')}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">License Status</p>
                    {getStatusBadge(userData.licenseStatus, 'license')}
                  </div>
                </div>

                {(userData.certifiedStatus === false || userData.licenseStatus === false) && (
                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate("/certification/upload")}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      {userData.certifiedStatus === false ? "Get Certified" : "Get Licensed"}
                    </Button>
                  </div>
                )} */}

{latestVerification && (
                  <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                    {assignment && center ? (
                      <>
                        <div className="p-2 mb-2 rounded bg-gray-50 border text-xs text-gray-700">
                          <div><strong>Name:</strong> {center.trainingCentreName || center.name || "—"}</div>
                          <div><strong>Email:</strong> {center.email || "—"}</div>
                          <div><strong>Phone:</strong> {center.phoneNumber || "—"}</div>
                          <div><strong>State:</strong> {center.state || "—"}</div>
                          <div><strong>LGA:</strong> {center.lga || "—"}</div>
                          <div><strong>Address:</strong> {center.address || "—"}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Assignment Status:</span>
                          <Badge className={(() => {
                            const status = assignment.currentAssignment?.status || assignment.status;
                            if (status === "completed") return "bg-green-100 text-green-800 border-green-200";
                            if (status === "active") return "bg-blue-100 text-blue-800 border-blue-200";
                            if (status === "cancelled") return "bg-red-100 text-red-800 border-red-200";
                            return "bg-yellow-100 text-yellow-800 border-yellow-200";
                          })()}>
                            {(assignment.currentAssignment?.status || assignment.status)
                              ? (assignment.currentAssignment?.status || assignment.status).charAt(0).toUpperCase() +
                                (assignment.currentAssignment?.status || assignment.status).slice(1)
                              : "Unknown"}
                          </Badge>
                        </div>
                        {((assignment.currentAssignment?.status || assignment.status) === "completed") && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Completion Date:</span>{" "}
                            {assignment.currentAssignment?.completionDate || assignment.completionDate
                              ? new Date(assignment.currentAssignment?.completionDate || assignment.completionDate).toLocaleDateString()
                              : "—"}
                            {assignment.currentAssignment?.completionNotes || assignment.completionNotes ? (
                              <div>
                                <span className="font-medium">Completion Notes:</span>{" "}
                                {assignment.currentAssignment?.completionNotes || assignment.completionNotes}
                              </div>
                            ) : null}
                          </div>
                        )}
                        {assignment && admissionEnabled && periodStatus !== "suspended" && center && (assignment.currentAssignment?.status || assignment.status) === "active"  && (assignment.currentAssignment?.status || assignment.status) !== "cancelled" && (
                          <Button
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              const pdfAssignment = assignment.currentAssignment || assignment;
                              const assignmentId = assignment._id;
                             const period = { name: periodName, status: periodStatus, year: new Date().getFullYear() };
                              downloadAdmissionLetterPDF({
                                user: userData,
                                assignment: { ...pdfAssignment, _id: assignmentId },
                                period,
                                verificationId: latestVerification?._id
                              });
                            }}
                          >
                            Print Admission Letter
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-600">No training assignment yet for your most recent verification.</div>
                    )}
                  </div>
                )}
                
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

          {/* Training Center Section */}
          {/* <div className="mt-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  {userRole === "intending_artisan"
                    ? "Assigned Training Center"
                    : userRole === "artisan_user"
                    ? "Assigned Skill-UP Training Center"
                    : "Training Center"}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                {latestVerification && (
                  <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      <span className="text-green-600 font-medium">Training Center Assigned</span>
                    </div>
                    {assignment && center ? (
                      <>
                        <div className="p-2 mb-2 rounded bg-gray-50 border text-xs text-gray-700">
                          <div><strong>Name:</strong> {center.trainingCentreName || center.name || "—"}</div>
                          <div><strong>Email:</strong> {center.email || "—"}</div>
                          <div><strong>Phone:</strong> {center.phoneNumber || "—"}</div>
                          <div><strong>State:</strong> {center.state || "—"}</div>
                          <div><strong>LGA:</strong> {center.lga || "—"}</div>
                          <div><strong>Address:</strong> {center.address || "—"}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Assignment Status:</span>
                          <Badge className={(() => {
                            const status = assignment.currentAssignment?.status || assignment.status;
                            if (status === "completed") return "bg-green-100 text-green-800 border-green-200";
                            if (status === "active") return "bg-blue-100 text-blue-800 border-blue-200";
                            if (status === "cancelled") return "bg-red-100 text-red-800 border-red-200";
                            return "bg-yellow-100 text-yellow-800 border-yellow-200";
                          })()}>
                            {(assignment.currentAssignment?.status || assignment.status)
                              ? (assignment.currentAssignment?.status || assignment.status).charAt(0).toUpperCase() +
                                (assignment.currentAssignment?.status || assignment.status).slice(1)
                              : "Unknown"}
                          </Badge>
                        </div>
                        {((assignment.currentAssignment?.status || assignment.status) === "completed") && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Completion Date:</span>{" "}
                            {assignment.currentAssignment?.completionDate || assignment.completionDate
                              ? new Date(assignment.currentAssignment?.completionDate || assignment.completionDate).toLocaleDateString()
                              : "—"}
                            {assignment.currentAssignment?.completionNotes || assignment.completionNotes ? (
                              <div>
                                <span className="font-medium">Completion Notes:</span>{" "}
                                {assignment.currentAssignment?.completionNotes || assignment.completionNotes}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-600">No training assignment yet for your most recent verification.</div>
                    )}
                  </div>
                )}
                <div className="space-y-6">
                  <UserGroupDetails />
                  <ArtisanTrainingManagement />
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ArtisanDashboard;


// import { useParams } from "react-router-dom";
// import DashboardPage from "@/components/layout/DashboardLayout";
// import Spinner from "@/components/layout/spinner";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { LogOut, Star, UserCircle } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Calendar from "../Admin/components/Calendar";
// import {
//   default as ArtisanTrainingManagement,
//   default as UserGroupDetails,
// } from "./userGroupDetail";
// import { API_BASE_URL } from "@/config/env";

// const ArtisanDashboard = ({
//   artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
// }) => {
//   const logout = useLogout();

//   const [userData, setUserData] = useState(null); // Holds the user data
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem("userRole");

//   const getUserRole = (userRole) => {
//     if (userRole === "artisan_user") {
//       return "ARTISAN";
//     } else if (userRole === "intending_artisan") {
//       return "INTENDING ARTISAN";
//     } else if (userRole === "superadmin") {
//       return "SUPER ADMIN";
//     }
//     return "GUEST"; // Default case
//   };

//   const role = getUserRole(userRole);

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
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute href="/trainee/dashboard">
//       {/* <DashboardPage title="Trainee Dashboard"> */}
//       <div className="container mx-auto p-6">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold"> Dashboard </h1>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => navigate("/biodata")}>
//               <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//             </Button>

//             <Button variant="destructive" onClick={logout}>
//               <LogOut className="mr-2 h-4 w-4" /> Logout
//             </Button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
//             <CardHeader>
//               <CardTitle>Profile</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center">
//               <Avatar className="h-24 w-24 mb-4">
//                 <AvatarImage
//                   src={userData?.profileImage}
//                   alt={userData?.firstName}
//                 />
//                 <AvatarFallback>{userData.firstName}</AvatarFallback>
//                 {/* {artisan.name.split(' ').map(n => n[0]).join('')}  */}
//               </Avatar>
//               <h2 className="text-2xl font-semibold">{userData.firstName}</h2>
//               <div className="flex flex-col text-sm gap-4 items-center">
//                 <Badge className="mt-2">
//                   {userData.priorSkillsCerts[0]?.sector}
//                 </Badge>
//                 <div className="text-md text-emerald-800 mb-2">
//                   Trade Area: {userData.priorSkillsCerts[0]?.tradeArea}
//                 </div>
//               </div>

//               <div className="flex flex-row items-center font-semibold mt-2">
//                 <Star className="h-5 w-5  text-yellow-400 mr-1" />
//                 <span> {" " + role}</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-2 border-yellow-400 p-4 rounded-lg shadow-md">
//             <CardHeader>
//               <CardTitle>Licensing | Certification</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-md text-emerald-800 mb-2">
//                 Cirtification Status:
//               </div>
//               {userData.certifiedStatus === false ? (
//                 <Badge variant="destructive">Not Certified</Badge>
//               ) : userData.certifiedStatus === true ? (
//                 <Badge variant="success" className="bg-green-400 text-white">
//                   Certified
//                 </Badge>
//               ) : null}
//               <div className="text-md text-red-600 mb-2 mt-5">
//                 License Status:
//               </div>
//               {userData.licenseStatus === false ? (
//                 <Badge variant="destructive">Not Licensed</Badge>
//               ) : userData.licenseStatus === true ? (
//                 <Badge variant="success" className="bg-green-400 text-white">
//                   Licensed
//                 </Badge>
//               ) : null}
//               {userData.role !== "artisan_user" ||
//                 ("admin" && (
//                   <div className="mt-4">
//                     {userData.certifiedStatus === false ||
//                     userData.licenseStatus === false ? (
//                       <Button
//                         className="w-full"
//                         onClick={() => navigate("/certification/upload")}>
//                         {userData.certifiedStatus === false
//                           ? "Get Certified"
//                           : "Get Licensed"}
//                       </Button>
//                     ) : null}
//                   </div>
//                 ))}
//             </CardContent>
//           </Card>

//           <Calendar />
//         </div>

//         <div className="mt-6">
//           <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
//             <CardHeader>
//               {userRole === "intending_artisan" && (
//                 <CardTitle> Assigned Training Center</CardTitle>
//               )}{" "}
//               {userRole === "artisan_user" && (
//                 <CardTitle> Assigned Skill-UP Training Center</CardTitle>
//               )}
//             </CardHeader>
//             <CardContent>
//               <UserGroupDetails />
//               <ArtisanTrainingManagement />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {/* </DashboardPage> */}
//     </ProtectedRoute>
//   );
// };

// export default ArtisanDashboard;

// import { useParams } from "react-router-dom";
// import DashboardPage from "@/components/layout/DashboardLayout";
// import Spinner from "@/components/layout/spinner";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { 
//   LogOut, 
//   Star, 
//   UserCircle, 
//   Award,
//   Shield,
//   Calendar as CalendarIcon,
//   Building2,
//   TrendingUp,
//   Clock,
//   CheckCircle,
//   XCircle,
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   House as HouseIcon
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Calendar from "../Admin/components/Calendar";
// import {
//   default as ArtisanTrainingManagement,
//   default as UserGroupDetails,
// } from "./userGroupDetail";
// import { API_BASE_URL } from "@/config/env";

// const ArtisanDashboard = ({
//   artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
// }) => {
//   const logout = useLogout();
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem("userRole");

//   const getUserRole = (userRole) => {
//     if (userRole === "artisan_user") {
//       return "ARTISAN";
//     } else if (userRole === "intending_artisan") {
//       return "INTENDING ARTISAN";
//     } else if (userRole === "superadmin") {
//       return "SUPER ADMIN";
//     }
//     return "GUEST";
//   };

//   const role = getUserRole(userRole);

//   // Fetch user data from API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const userId = localStorage.getItem("userId");

//         if (!accessToken || !userId) {
//           return;
//         }

//         const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (response.data.success) {
//           setUserData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (!userData) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         <div className="text-center">
//           <Spinner />
//           <p className="mt-4 text-slate-600 font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "ARTISAN":
//         return "bg-emerald-600";
//       case "INTENDING ARTISAN":
//         return "bg-blue-600";
//       case "SUPER ADMIN":
//         return "bg-purple-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getStatusBadge = (status, type) => {
//     if (status === true) {
//       return (
//         <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
//           <CheckCircle className="h-4 w-4 text-emerald-600" />
//           <span className="text-emerald-800 font-medium text-sm">
//             {type === 'cert' ? 'Certified' : 'Licensed'}
//           </span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
//           <XCircle className="h-4 w-4 text-red-600" />
//           <span className="text-red-800 font-medium text-sm">
//             {type === 'cert' ? 'Not Certified' : 'Not Licensed'}
//           </span>
//         </div>
//       );
//     }
//   };

//   // Find most recent verification and assignment
//   const sortedVerifications = [...(userData.verifications || [])].sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   );
//   const latestWithAssignment = sortedVerifications.find(
//     v => Array.isArray(v.trainingAssignment)
//       ? v.trainingAssignment.length > 0
//       : !!v.trainingAssignment
//   );

//   let assignment = null;
//   if (latestWithAssignment && latestWithAssignment.trainingAssignment) {
//     assignment = Array.isArray(latestWithAssignment.trainingAssignment)
//       ? latestWithAssignment.trainingAssignment[0]
//       : latestWithAssignment.trainingAssignment;
//   }

//   // Get training center details
//   let center = null;
//   if (
//     assignment &&
//     assignment.currentAssignment &&
//     assignment.currentAssignment.trainingCenterId &&
//     typeof assignment.currentAssignment.trainingCenterId === "object"
//   ) {
//     center = assignment.currentAssignment.trainingCenterId;
//   } else if (assignment && typeof assignment.trainingCenterId === "object" && assignment.trainingCenterId !== null) {
//     center = assignment.trainingCenterId;
//   }

//   return (
//     <ProtectedRoute href="/trainee/dashboard">
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         {/* Header with gradient background */}
//         <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
//           <div className="container mx-auto px-4 md:px-8 py-8">
//             {/* Profile Header */}
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
//               <div className="flex items-center gap-6">
//                 <div className="relative">
//                   <Avatar className="h-24 w-24 shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm">
//                     <AvatarImage
//                       src={userData?.profileImage}
//                       alt={userData?.firstName}
//                       className="object-cover"
//                     />
//                     <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600">
//                       {userData.firstName?.[0] || "A"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
//                     <div className={`w-4 h-4 rounded-full ${getRoleColor(role)}`}></div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <h1 className="text-3xl md:text-4xl font-bold mb-1">
//                     Welcome back, {userData.firstName}!
//                   </h1>
//                   <div className="flex items-center gap-3 flex-wrap">
//                     <Badge className={`${getRoleColor(role)} text-white px-3 py-1 font-medium`}>
//                       {role}
//                     </Badge>
//                     {userData.priorSkillsCerts[0]?.sector && (
//                       <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
//                         {userData.priorSkillsCerts[0]?.sector}
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 text-blue-100">
//                     <Star className="h-4 w-4 text-yellow-400" />
//                     <span className="text-sm">
//                       {userData.priorSkillsCerts[0]?.tradeArea || 'Trade Area Not Specified'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => navigate("/biodata")}
//                   className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
//                 >
//                   <UserCircle className="h-4 w-4" />
//                   Update Profile
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={logout}
//                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-0"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Logout
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="container mx-auto px-4 md:px-8 py-8">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-emerald-100 rounded-full">
//                     <Award className="h-6 w-6 text-emerald-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 font-medium">Certification</p>
//                     <p className="text-lg font-bold text-gray-900">
//                       {userData.certifiedStatus ? 'Certified' : 'Pending'}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-blue-100 rounded-full">
//                     <Shield className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 font-medium">License</p>
//                     <p className="text-lg font-bold text-gray-900">
//                       {userData.licenseStatus ? 'Licensed' : 'Pending'}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-purple-100 rounded-full">
//                     <TrendingUp className="h-6 w-6 text-purple-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 font-medium">Progress</p>
//                     <p className="text-lg font-bold text-gray-900">85%</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-orange-100 rounded-full">
//                     <Clock className="h-6 w-6 text-orange-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 font-medium">Active Since</p>
//                     <p className="text-lg font-bold text-gray-900">2024</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Dashboard Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Profile Information */}
//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-4 border-b border-gray-100">
//                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <User className="h-5 w-5 text-blue-600" />
//                   Profile Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-6 space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Building2 className="h-5 w-5 text-gray-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Sector</p>
//                       <p className="font-semibold text-gray-900">
//                         {userData.priorSkillsCerts[0]?.sector || 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Award className="h-5 w-5 text-gray-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Trade Area</p>
//                       <p className="font-semibold text-gray-900">
//                         {userData.priorSkillsCerts[0]?.tradeArea || 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Certification & Licensing */}
//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-4 border-b border-gray-100">
//                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <Shield className="h-5 w-5 text-emerald-600" />
//                   Credentials
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-6 space-y-6">
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-2 font-medium">Certification Status</p>
//                     {getStatusBadge(userData.certifiedStatus, 'cert')}
//                   </div>
                  
//                   <div>
//                     <p className="text-sm text-gray-600 mb-2 font-medium">License Status</p>
//                     {getStatusBadge(userData.licenseStatus, 'license')}
//                   </div>
//                 </div>

//                 {(userData.certifiedStatus === false || userData.licenseStatus === false) && (
//                   <div className="pt-4 border-t border-gray-100">
//                     <Button
//                       className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
//                       onClick={() => navigate("/certification/upload")}
//                     >
//                       <Award className="h-4 w-4 mr-2" />
//                       {userData.certifiedStatus === false ? "Get Certified" : "Get Licensed"}
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Calendar */}
//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-4 border-b border-gray-100">
//                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <CalendarIcon className="h-5 w-5 text-purple-600" />
//                   Calendar
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-6">
//                 <Calendar />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Training Center Section */}
//           <div className="mt-8">
//             <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-4 border-b border-gray-100">
//                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <Building2 className="h-5 w-5 text-indigo-600" />
//                   {userRole === "intending_artisan"
//                     ? "Assigned Training Center"
//                     : userRole === "artisan_user"
//                     ? "Assigned Skill-UP Training Center"
//                     : "Training Center"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-6">
//                 {/* Most recent verification's training center assignment */}
//                 {assignment && (
//                   <div className="mb-6 p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Building2 className="h-5 w-5 text-indigo-600" />
//                       <span className="text-green-600 font-medium">Training Center Assigned</span>
//                     </div>
//                     {center && (
//                       <div className="p-2 mb-2 rounded bg-gray-50 border text-xs text-gray-700">
//                         <div><strong>Name:</strong> {center.trainingCentreName || center.name || "—"}</div>
//                         <div><strong>Email:</strong> {center.email || "—"}</div>
//                         <div><strong>Phone:</strong> {center.phoneNumber || "—"}</div>
//                         <div><strong>State:</strong> {center.state || "—"}</div>
//                         <div><strong>LGA:</strong> {center.lga || "—"}</div>
//                         <div><strong>Address:</strong> {center.address || "—"}</div>
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium">Assignment Status:</span>
//                       <Badge className={(() => {
//                         const status = assignment.currentAssignment?.status || assignment.status;
//                         if (status === "completed") return "bg-green-100 text-green-800 border-green-200";
//                         if (status === "active") return "bg-blue-100 text-blue-800 border-blue-200";
//                         if (status === "cancelled") return "bg-red-100 text-red-800 border-red-200";
//                         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//                       })()}>
//                         {(assignment.currentAssignment?.status || assignment.status)
//                           ? (assignment.currentAssignment?.status || assignment.status).charAt(0).toUpperCase() +
//                             (assignment.currentAssignment?.status || assignment.status).slice(1)
//                           : "Unknown"}
//                       </Badge>
//                     </div>
//                     {((assignment.currentAssignment?.status || assignment.status) === "completed") && (
//                       <div className="text-sm text-muted-foreground mt-2">
//                         <span className="font-medium">Completion Date:</span>{" "}
//                         {assignment.currentAssignment?.completionDate || assignment.completionDate
//                           ? new Date(assignment.currentAssignment?.completionDate || assignment.completionDate).toLocaleDateString()
//                           : "—"}
//                         {assignment.currentAssignment?.completionNotes || assignment.completionNotes ? (
//                           <div>
//                             <span className="font-medium">Completion Notes:</span>{" "}
//                             {assignment.currentAssignment?.completionNotes || assignment.completionNotes}
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {/* <div className="space-y-6">
//                   <UserGroupDetails />
//                   <ArtisanTrainingManagement />
//                 </div> */}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ArtisanDashboard;


// import { useParams } from "react-router-dom";
// import DashboardPage from "@/components/layout/DashboardLayout";
// import Spinner from "@/components/layout/spinner";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { LogOut, Star, UserCircle } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Calendar from "../Admin/components/Calendar";
// import {
//   default as ArtisanTrainingManagement,
//   default as UserGroupDetails,
// } from "./userGroupDetail";
// import { API_BASE_URL } from "@/config/env";

// const ArtisanDashboard = ({
//   artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
// }) => {
//   const logout = useLogout();

//   const [userData, setUserData] = useState(null); // Holds the user data
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem("userRole");

//   const getUserRole = (userRole) => {
//     if (userRole === "artisan_user") {
//       return "ARTISAN";
//     } else if (userRole === "intending_artisan") {
//       return "INTENDING ARTISAN";
//     } else if (userRole === "superadmin") {
//       return "SUPER ADMIN";
//     }
//     return "GUEST"; // Default case
//   };

//   const role = getUserRole(userRole);

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
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute href="/trainee/dashboard">
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 md:px-8">
//           {/* Profile Banner */}
//           <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 mb-10 w-full">
//             <div className="flex flex-row items-center gap-6 w-full">
//               <Avatar className="h-24 w-24 shadow border-2 border-white bg-gray-100">
//                 <AvatarImage
//                   src={userData?.profileImage}
//                   alt={userData?.firstName}
//                 />
//                 <AvatarFallback className="text-2xl font-bold text-emerald-800 bg-white">
//                   {userData.firstName?.[0] || "A"}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col items-center md:items-start">
//                 <h1 className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">{userData.firstName}</h1>
//                 <div className="flex items-center gap-2 mb-1">
//                   <Badge className="rounded-full px-3 py-1 bg-emerald-100 text-emerald-700 font-medium text-xs">
//                     {userData.priorSkillsCerts[0]?.sector}
//                   </Badge>
//                   <span className="text-sm text-muted-foreground">{userData.priorSkillsCerts[0]?.tradeArea}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Star className="h-5 w-5 text-yellow-400" />
//                   <span className="uppercase tracking-wide text-gray-600 text-xs font-semibold">{role}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4 md:mt-0 ml-auto">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/biodata")}
//                 className="flex items-center gap-2"
//               >
//                 <UserCircle className="h-4 w-4" /> Update Profile
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={logout}
//                 className="flex items-center gap-2"
//               >
//                 <LogOut className="h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </div>

//           {/* Dashboard Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Profile Card */}
//             <Card className="rounded-xl shadow bg-white border-0">
//               <CardHeader className="pb-2 border-b">
//                 <CardTitle className="text-lg font-bold text-gray-900">Profile</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col items-center py-6">
//                 <div className="flex flex-col text-sm gap-2 items-center mb-2">
//                   <span className="text-gray-700 font-medium">Sector:</span>
//                   <span className="text-emerald-700 font-semibold">{userData.priorSkillsCerts[0]?.sector}</span>
//                   <span className="text-gray-700 font-medium">Trade Area:</span>
//                   <span className="text-blue-700 font-semibold">{userData.priorSkillsCerts[0]?.tradeArea}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Licensing/Certification Card */}
//             <Card className="rounded-xl shadow bg-white border-0">
//               <CardHeader className="pb-2 border-b">
//                 <CardTitle className="text-lg font-bold text-gray-900">Licensing & Certification</CardTitle>
//               </CardHeader>
//               <CardContent className="py-6 flex flex-col items-center">
//                 <div className="text-md text-gray-700 mb-2 font-medium">Certification Status:</div>
//                 {userData.certifiedStatus === false ? (
//                   <Badge variant="destructive" className="rounded-full px-3 py-1 text-white">Not Certified</Badge>
//                 ) : userData.certifiedStatus === true ? (
//                   <Badge variant="success" className="bg-emerald-500 text-white rounded-full px-3 py-1">Certified</Badge>
//                 ) : null}
//                 <div className="text-md text-gray-700 mb-2 mt-5 font-medium">License Status:</div>
//                 {userData.licenseStatus === false ? (
//                   <Badge variant="destructive" className="rounded-full px-3 py-1 text-white">Not Licensed</Badge>
//                 ) : userData.licenseStatus === true ? (
//                   <Badge variant="success" className="bg-blue-500 text-white rounded-full px-3 py-1">Licensed</Badge>
//                 ) : null}
//                 {userData.role !== "artisan_user" || ("admin" && (
//                   <div className="mt-6 w-full">
//                     {userData.certifiedStatus === false || userData.licenseStatus === false ? (
//                       <Button
//                         className="w-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
//                         onClick={() => navigate("/certification/upload")}
//                         variant="outline"
//                       >
//                         {userData.certifiedStatus === false ? "Get Certified" : "Get Licensed"}
//                       </Button>
//                     ) : null}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Calendar Card */}
//             <Card className="rounded-xl shadow bg-white border-0 flex flex-col">
//               <CardHeader className="pb-2 border-b">
//                 <CardTitle className="text-lg font-bold text-gray-900">Calendar</CardTitle>
//               </CardHeader>
//               <CardContent className="py-6">
//                 <Calendar />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Training Center Card */}
//           <div className="mt-10">
//             <Card className="rounded-xl shadow bg-white border-0">
//               <CardHeader className="pb-2 border-b">
//                 <CardTitle className="text-lg font-bold text-gray-900">
//                   {userRole === "intending_artisan"
//                     ? "Assigned Training Center"
//                     : userRole === "artisan_user"
//                     ? "Assigned Skill-UP Training Center"
//                     : "Training Center"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-6">
//                 <UserGroupDetails />
//                 <ArtisanTrainingManagement />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ArtisanDashboard;
