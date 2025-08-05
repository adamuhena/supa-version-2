// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Spinner from "@/components/layout/spinner";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Badge } from "@/components/ui/badge";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { LogOut, Star, UserCircle } from "lucide-react";
// import Calendar from "../Admin/components/Calendar";
// import TrainingDashboardPage from "./TrainingDashboardLayout";
// import Trainingtable from "./TrainingGroupList";
// import { API_BASE_URL } from "@/config/env";

// const TrainingCenterDashboard = ({
//   artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
// }) => {
//   const logout = useLogout();
//   const userId = localStorage.getItem("userId");
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

//         const response = await axios.get(
//           `${API_BASE_URL}/training-center/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

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
//     <ProtectedRoute href="/training-center/dashboard">
//       <TrainingDashboardPage title="Training Center Dashboard">
//         <div className="container mx-auto p-6">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold"> Dashboard </h1>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/training-center/biodata")}>
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
//                     src={userData?.profileImage}
//                     alt={userData?.name}
//                   />
//                   <AvatarFallback>
//                     {userData?.trainingCentreName}
//                   </AvatarFallback>
//                   {/* {artisan.name.split(' ').map(n => n[0]).join('')}  */}
//                 </Avatar>
//                 <h2 className="text-2xl font-semibold">
//                   {userData?.trainingCentreName}
//                 </h2>
//                 <Badge className="mt-2">{userData?.contactPerson}</Badge>
//                 <div className="flex items-center mt-2">
//                   <Star className="h-5 w-5 text-yellow-400 mr-1" />
//                   <span>{artisan.rating}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-yellow-400 p-6 rounded-lg shadow-md bg-white">
//               <CardHeader className="border-b border-yellow-400 pb-2">
//                 <CardTitle className="text-xl font-semibold text-gray-700">
//                   Company Info
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2 mt-4 text-gray-600">
//                 <p className="text-sm">
//                   {userData?.ownership && `Ownership: ${userData?.ownership}`}
//                 </p>
//                 <p className="text-sm">
//                   {userData?.state && `State: ${userData?.state}`}
//                 </p>
//                 <p className="text-sm">
//                   {userData?.lga && `LGA: ${userData?.lga}`}
//                 </p>
//                 <p className="text-sm">
//                   {userData?.senatorialDistrict &&
//                     `Senatorial District: ${userData?.senatorialDistrict}`}
//                 </p>
//                 <p className="text-sm">
//                   {userData?.agree ? "Agreed" : "Not Agreed"}
//                 </p>
//               </CardContent>
//             </Card>

//             <Calendar />
//           </div>

//           <div className="mt-6">
//             <Trainingtable />
//           </div>
//         </div>
//       </TrainingDashboardPage>
//     </ProtectedRoute>
//   );
// };

// export default TrainingCenterDashboard;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "@/components/layout/spinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { 
  LogOut, 
  Star, 
  UserCircle, 
  Building2,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  Clock,
  Settings,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import Calendar from "../Admin/components/Calendar";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import Trainingtable from "./TrainingGroupList";
import { API_BASE_URL } from "@/config/env";

const TrainingCenterDashboard = ({
  artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
}) => {
  const logout = useLogout();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [center, setCenter] = useState(null);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/training-center/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Add the fetch function
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const centerId = localStorage.getItem("userId");
        
        const [periodRes, assignmentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/periods`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          }),
          axios.get(`${API_BASE_URL}/training/center/${centerId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
        ]);
        setPeriods(periodRes.data);
        setAssignments(assignmentsRes.data.assignments);
        setFilteredAssignments(assignmentsRes.data.assignments);
        setCenter(assignmentsRes.data.trainingCenter);
        setTotals(assignmentsRes.data.totals);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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

  // // Update the Quick Stats section
  // const totals = center?.totals || {};
  // console.log("Totals", totals); // Log the totals object
  
  
  

  return (
    <ProtectedRoute href="/training-center/dashboard">
      {/* <TrainingDashboardPage title="Training Center Dashboard"> */}
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
                      alt={userData?.trainingCentreName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600">
                      {userData?.trainingCentreName
                        ?.substring(0, 2)
                        ?.toUpperCase() || "TC"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                    <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">
                    {userData?.trainingCentreName}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-emerald-600 text-white px-3 py-1 font-medium">
                      TRAINING CENTER
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
                      {userData?.ownership}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">
                      Contact: {userData?.contactPerson}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/training-center/biodata")}
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
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Trainees
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {assignments?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Programs
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {Object.keys(totals?.byPeriod || {}).length}
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
                    <p className="text-sm text-gray-600 font-medium">
                      Trade Areas
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {Object.keys(totals?.byTradeArea || {}).length}
                    </p>
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
                    <p className="text-sm text-gray-600 font-medium">
                      Active Programs
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {Object.keys(totals?.byTrainingType || {}).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Center Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Center Information
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-4">
                {/* Location Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {center?.state}, {center?.lga}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {center?.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-900">{center?.email}</p>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Registered On:{" "}
                      {new Date(center?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agreement Status */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Center Assessment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  {center?.assessmentRecords?.length > 0 ? (
                    <>
                      {/* Get most recent assessment */}
                      {(() => {
                        const mostRecent = [...center.assessmentRecords].sort((a, b) => 
                          new Date(b.date) - new Date(a.date)
                        )[0];

                        return (
                          <>
                            <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg ${
                              mostRecent.status === "approved"
                                ? "bg-emerald-50 border border-emerald-200"
                                : mostRecent.status === "denied"
                                ? "bg-red-50 border border-red-200"
                                : "bg-yellow-50 border border-yellow-200"
                            }`}>
                              <div className={`w-3 h-3 rounded-full ${
                                mostRecent.status === "approved"
                                  ? "bg-emerald-500"
                                  : mostRecent.status === "denied"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}></div>
                              <span className={`font-medium ${
                                mostRecent.status === "approved"
                                  ? "text-emerald-800"
                                  : mostRecent.status === "denied"
                                  ? "text-red-800"
                                  : "text-yellow-800"
                              }`}>
                                {mostRecent.status.charAt(0).toUpperCase() + 
                                 mostRecent.status.slice(1)} ({mostRecent.year})
                              </span>
                            </div>

                            {/* Show expiration date only for approved status */}
                            {mostRecent.status === "approved" && mostRecent.expirationDate && (
                              <div className="mt-2 text-sm text-gray-600">
                                Expires: {new Date(mostRecent.expirationDate).toLocaleDateString()}
                              </div>
                            )}

                            {/* <div className="pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 mb-2">Assessed By</p>
                              <p className="font-semibold text-gray-900">
                                {mostRecent.assessorName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(mostRecent.date).toLocaleDateString()}
                              </p>
                            </div> */}

                            {mostRecent.notes && (
                              <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-600 mb-2">Assessment Notes</p>
                                <p className="text-sm text-gray-900">{mostRecent.notes}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-800 font-medium">Not Assessed</span>
                    </div>
                  )}

                  {/* Rest of your card content */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">ITF Registration Status</p>
                    <p className="font-semibold text-gray-900">
                      {center?.itfRegistered === "yes" ? "Registered" : "Not Registered"}
                    </p>
                  </div>
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

          {/* Training Groups Section */}
          {/* <div className="mt-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Training Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <Trainingtable />
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
      {/* </TrainingDashboardPage> */}
    </ProtectedRoute>
  );
};

export default TrainingCenterDashboard;