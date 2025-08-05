import DashboardPage from '@/components/layout/DashboardLayout';
import Spinner from '@/components/layout/spinner';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { API_BASE_URL } from "@/config/env";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import useLogout from '@/pages/loginPage/logout';
import axios from 'axios';
import { LogOut, UserCircle } from "lucide-react";
import Dashboard from './components/Dashboard';
import DistributionDashboard from "./components/distribution-dashboard";


const AdminDashboard = () => {
  const logout = useLogout();

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");  

  // console.log("userData fro response:", userData  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("User data fetched:", response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };  
    fetchUserData();
  }, [accessToken, userId]);  



  return (
    <ProtectedRoute href="/admin/dashboard">
      {/* <DashboardPage title="Admin Dashboard"> */}
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
                    {userData?.firstName?.substring(0, 2)?.toUpperCase() ||
                      "TC"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-emerald-600 text-white px-3 py-1 font-medium">
                    Wellcome Back, {userData?.firstname || "User"}!
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
                    {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || "User Role"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">
                    Contact: {userData?.phoneNumber}
                  </span>
                  <span className="text-sm">
                    Email: {userData?.email || "Not provided"}
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

      <div className="container mx-auto p-6">
        {/* <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
            </Button>

            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header> */}
        {/* <Dashboard /> */}
        <DistributionDashboard />
      </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
};

export default AdminDashboard;
