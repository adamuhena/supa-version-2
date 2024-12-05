import DashboardPage from '@/components/layout/DashboardLayout'
import Spinner from '@/components/layout/spinner'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useLogout from '@/pages/loginPage/logout'
import axios from 'axios'
import { Briefcase, LogOut, Star, UserCircle } from "lucide-react"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const IntendingArtisanDashboard = ({ artisan = {  rating: 4.5 } }) => {
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
    return (
    <div class="flex justify-center items-center h-screen">
      <Spinner/>
    </div>
    );
  }   


  return (
    <ProtectedRoute href='/intending-artisan/dashboard'>

    
    <DashboardPage  href='/intending-artisan/dashboard' title="Intending Artisan Dashboard">
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"> Dashboard  </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/biodata')}>
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

        

        <Card className="border-2 border-yellow-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Licensing | Certification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md text-emerald-800 mb-2">Cirtification Status:</div>
              {userData.certifiedStatus === false ? (
                <Badge variant="destructive">Not Certified</Badge>
              ) : userData.certifiedStatus === true ? (
                <Badge variant="success" className='bg-green-400 text-white'>Certified</Badge>
              ) : null}
            <div className="text-md text-red-600 mb-2 mt-5">License Status:</div>
              {userData.licenseStatus === false ? (
                <Badge variant="destructive">Not Licensed</Badge>
              ) : userData.licenseStatus === true ? (
                <Badge variant="success" className='bg-green-400 text-white'>Licensed</Badge>
              ) : null}
            <div className="mt-4">
              {userData.certifiedStatus === false || userData.licenseStatus === false ? (
                <Button className="w-full" onClick={() => navigate('/certification/upload')}>
                  {userData.certifiedStatus === false ? 'Get Certified' : 'Get Licensed'}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Profession</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="text-md text-emerald-800 mb-2">
              Sector: {userData.priorSkillsCerts[0]?.sector}
            </div>
            <div className="text-md text-emerald-800 mb-2">
              Sector: {userData.priorSkillsCerts[0]?.tradeArea}
            </div>
              
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle> Assigned Up-Skilling Center</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <div className='px-10'>
                    <p className="font-medium">{userData.stateOfResidence}</p>
                  </div>
                  <div className='px-10'>
                  <p className="text-sm text-muted-foreground">{userData.lgaOfResidence} </p>
                  </div>
                  <div className='px-10'>
                  <p className="text-sm text-muted-foreground">{userData.priorSkillsCerts[0]?.year} </p>
                  </div>
                  <div className='px-10'>
                    <p className="font-medium">{userData.street}</p>
                  </div>
                </div>
                <Badge variant='success' className='bg-green-400 text-white'>Completed</Badge>
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

export default IntendingArtisanDashboard