import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, LogOut } from "lucide-react";
import DashboardPage from '@/components/layout/DashboardLayout';
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from '@/pages/loginPage/logout';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Spinner from '@/components/layout/spinner';

const AdminDashboard = () => {
  const logout = useLogout();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          navigate('/login'); // Redirect unauthenticated users
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login'); // Handle errors by redirecting
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
    <div class="flex justify-center items-center h-screen">
    <Spinner/>
</div>
    );
  }

  return (
    <ProtectedRoute href='/admin/dashboard'>
      <DashboardPage title="Admin Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
          <Dashboard user={userData} />
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
