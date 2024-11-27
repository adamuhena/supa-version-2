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
import UserGroupDetails from './userGroupDetail'
import Calendar from '../Admin/components/Calendar'
import Spinner from '@/components/layout/spinner'


const ArtisanDashboard = ({ artisan = { name: "John Doe", skill: "Carpenter", rating: 4.5 } }) => {
  const logout = useLogout();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [userData, setUserData] = useState(null); // Holds the user data
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const getUserRole = (userRole) => {
    if (userRole === 'artisan_user') {
      return "ARTISAN";
    } else if (userRole === 'intending_artisan') {
      return "INTENDING ARTISAN";
    } else if (userRole === 'superadmin') {
      return "SUPER ADMIN";
    }
    return "GUEST"; // Default case
  };

  const role = getUserRole(userRole);
  console.log(role); //




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
    <ProtectedRoute href='/artisan/dashboard'>


      <DashboardPage title="Artisan Dashboard">
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
                <div className="flex flex-col text-sm gap-4 items-center">
                  <Badge className="mt-2">{userData.priorSkillsCerts[0]?.sector}</Badge>
                  <div className="text-md text-emerald-800 mb-2">
                    Trade Area: {userData.priorSkillsCerts[0]?.tradeArea}
                  </div>
                </div>

                <div className="flex items-center font-semibold mt-2">
                  <Star className="h-5 w-5  text-yellow-400 mr-1" />
                  <span> {role + " " + artisan.rating}</span>
                  <span> {userData.priorSkillsCerts[0]?.tradeArea}</span>
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
                {userData.role !== "artisan_user" || "admin" && (
                  <div className="mt-4">
                    {userData.certifiedStatus === false || userData.licenseStatus === false ? (
                      <Button
                        className="w-full"
                        onClick={() => navigate('/certification/upload')}
                      >
                        {userData.certifiedStatus === false ? 'Get Certified' : 'Get Licensed'}
                      </Button>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>


            <Calendar />


          </div>

          <div className="mt-6">
            <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
              <CardHeader>
              {userRole === "intending_artisan" && (
                <CardTitle> Assigned Training Center</CardTitle>
              )} {userRole === "artisan_user" && (<CardTitle> Assigned Skill-UP Training Center</CardTitle>)}
              </CardHeader>
              <CardContent>
                <UserGroupDetails />
              </CardContent>
            </Card>
          </div>
        </div>


      </DashboardPage>
    </ProtectedRoute>
  )
}

export default ArtisanDashboard