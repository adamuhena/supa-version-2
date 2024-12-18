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
import { LogOut, Star, UserCircle } from "lucide-react";
import Calendar from "../Admin/components/Calendar";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import Trainingtable from "./TrainingGroupList";
import { API_BASE_URL } from "@/config/env";

const TrainingCenterDashboard = ({
  artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 },
}) => {
  const logout = useLogout();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null); // Holds the user data
  const navigate = useNavigate();

  console.log(userData);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          return; // If no token or userId, you can handle this with a redirect or error state
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
          setUserData(response.data.data); // Set the user data in state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <ProtectedRoute href="/training-center/dashboard">
      <TrainingDashboardPage title="Training Center Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold"> Dashboard </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/training-center/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt={artisan.name}
                  />
                  <AvatarFallback>
                    {userData?.trainingCentreName}
                  </AvatarFallback>
                  {/* {artisan.name.split(' ').map(n => n[0]).join('')}  */}
                </Avatar>
                <h2 className="text-2xl font-semibold">
                  {userData?.trainingCentreName}
                </h2>
                <Badge className="mt-2">{userData?.contactPerson}</Badge>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{artisan.rating}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-400 p-6 rounded-lg shadow-md bg-white">
              <CardHeader className="border-b border-yellow-400 pb-2">
                <CardTitle className="text-xl font-semibold text-gray-700">
                  Company Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 mt-4 text-gray-600">
                <p className="text-sm">
                  {userData?.ownership && `Ownership: ${userData?.ownership}`}
                </p>
                <p className="text-sm">
                  {userData?.state && `State: ${userData?.state}`}
                </p>
                <p className="text-sm">
                  {userData?.lga && `LGA: ${userData?.lga}`}
                </p>
                <p className="text-sm">
                  {userData?.senatorialDistrict &&
                    `Senatorial District: ${userData?.senatorialDistrict}`}
                </p>
                <p className="text-sm">
                  {userData?.agree ? "Agreed" : "Not Agreed"}
                </p>
              </CardContent>
            </Card>

            <Calendar />
          </div>

          <div className="mt-6">
            <Trainingtable />
          </div>
        </div>
      </TrainingDashboardPage>
    </ProtectedRoute>
  );
};

export default TrainingCenterDashboard;
