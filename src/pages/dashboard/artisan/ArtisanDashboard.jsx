import React , { useState, useEffect } from 'react'
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


const ArtisanDashboard = ({ artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 } }) => {
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
    <ProtectedRoute>

    
    <DashboardPage  title="Artisan Dashboard">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={artisan.name} />
              <AvatarFallback>{userData.firstName}</AvatarFallback> 
              {/* {artisan.name.split(' ').map(n => n[0]).join('')}  */}
            </Avatar>
            <h2 className="text-2xl font-semibold">{userData.firstName}</h2>
            <Badge className="mt-2">{userData.priorSkillsCerts.tradeArea}</Badge>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{artisan.rating}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Home Renovation</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
              </li>
              <li className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Office Repair</p>
                  <p className="text-sm text-muted-foreground">Friday, 2:00 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Licensing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md  text-emerald-800 mb-2">Status:</div>
            <Badge variant="destructive">Not Cirtified</Badge>
            <div className="mt-4">
              <Button className="w-full">Get License</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Job History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Kitchen Remodeling</p>
                    <p className="text-sm text-muted-foreground">Completed on May 15, 2023</p>
                  </div>
                </div>
                <Badge>Completed</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Bathroom Tiling</p>
                    <p className="text-sm text-muted-foreground">Completed on April 30, 2023</p>
                  </div>
                </div>
                <Badge>Completed</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>

      
    </DashboardPage>
    </ProtectedRoute>
  )
}

export default ArtisanDashboard