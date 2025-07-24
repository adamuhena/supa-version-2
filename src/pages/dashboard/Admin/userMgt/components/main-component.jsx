"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardPage from "@/components/layout/DashboardLayout"
import { ArtisanUserView } from "./artisan-user-view"
import { IntendingArtisanView } from "./intending-artisan-view"
import { TrainingCenterView } from "./training-center-view"
import useLogout from "@/pages/loginPage/logout";
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainingStatusComponent() {
  const logout = useLogout();
  // Get user from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  console.log("userData Data: ", userData)

  const [userRole, setUserRole] = useState(userData?.role || "artisan_user")

  // Demo role switcher for testing
  const handleRoleChange = (role) => {
    setUserRole(role)
  }

  const renderView = () => {
    switch (userRole) {
      case "artisan_user" || "intending_artisan":
        return <IntendingArtisanView currentUser={userData} />
      case "training_center":
        return <TrainingCenterView currentUser={userData} />
      default:
        return <IntendingArtisanView currentUser={userData} />
    }
  }
console.log("i got here");

  return (
    <ProtectedRoute href="/admin/dashboard">  

    {/* <div className="min-h-screen"> */}
    <div className="container mx-auto p-6">
    <header className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">Document Upload</h1> */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Application Progress</h1>
            <p className="text-gray-600 mt-2">Track your journey to becoming a certified artisan</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" /> Account
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
      {/* Demo Role Switcher - Remove in production */}
      {/* <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        
          <h2 className="text-lg font-semibold">Verification Management System</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View as:</span>
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="intending_artisan">Intending Artisan</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="py-6">{renderView()}</div>
    </div>
    </ProtectedRoute>
  )
}
