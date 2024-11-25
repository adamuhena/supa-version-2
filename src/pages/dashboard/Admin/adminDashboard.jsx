import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Briefcase, Star, Settings, LogOut, UserCircle } from "lucide-react"
import DashboardPage from '@/components/layout/DashboardLayout'
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from '@/pages/loginPage/logout'
import axios from 'axios'
import Dashboard from './components/Dashboard'


const AdminDashboard = ({ artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 } }) => {
  const logout = useLogout();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [userData, setUserData] = useState(null); // Holds the user data
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          return; // If no token or userId, you can handle this with a redirect or error state
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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
    return <div>Loading...</div>; // Show loading state until data is fetched
  }



  return (
    <ProtectedRoute href='/admin/dashboard'>


      <DashboardPage title="Admin Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold"> Dashboard  </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
          <Dashboard />
        </div>


    </DashboardPage>
    </ProtectedRoute >
  )
}

export default AdminDashboard