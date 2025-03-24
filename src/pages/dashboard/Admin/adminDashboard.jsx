import DashboardPage from '@/components/layout/DashboardLayout';
import Spinner from '@/components/layout/spinner';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import useLogout from '@/pages/loginPage/logout';
import axios from 'axios';
import { LogOut, UserCircle } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';


const AdminDashboard = () => {
  const logout = useLogout();

  const navigate = useNavigate();



  return (
    <ProtectedRoute href='/admin/dashboard'>
      {/* <DashboardPage title="Admin Dashboard"> */}
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
          <Dashboard />
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
};

export default AdminDashboard;
