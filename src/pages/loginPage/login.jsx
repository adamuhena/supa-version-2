
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import PageLayout from '@/components/layout/pageLayout';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function LoginForm() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loginAs, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

          
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        identifier: email,
        password,
        loginAs
      });

      const {success, data} = response.data;

      const accessToken =response.data?.data?.accessToken?.accessToken;
      const refreshToken =response.data?.data?.accessToken?.refreshToken;
      console.log("accessToken",accessToken);
      console.log("refreshToken",refreshToken);


      if (success) {
        const userData = data[loginAs === 'user' ? 'user' : 'training_center'];
      const userRole = userData?.role || 'training_center'; // Default to 'training_center' if userRole is undefined
      const isFirstTimeUser = userData?.agree !== true; // Check status for both users and training centers
      const {  _id } = userData || {};


        localStorage.setItem('userId', _id);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isFirstTimeUser', JSON.stringify(isFirstTimeUser));
        

        
        console.log('User ID saved:', userData?._id);
        console.log('the user role is: ', userRole);

        // if (loginAs === 'user') {
        //   if (isFirstTimeUser && ['regular_user', 'intending_artisan', 'artisan_user'].includes(userRole)) {
        //     navigate('/kyc');
        //   } else if (userRole === 'admin' || userRole === 'superadmin') {
        //     navigate('/admin-dashboard');
        //   } else if (userRole === 'artisan_user') {
        //     navigate('/artisan-dashboard');
        //   } else if (userRole === 'intending_artisan') {
        //     navigate('/intending-artisan-dashboard');
        //   } else {
        //     navigate('/marketplace');
        //   }
        // } 
        
        if (loginAs === 'user') {
          if (isFirstTimeUser) {
            // Navigate to specific KYC routes for first-time users
            if (userRole === 'artisan_user') {
              navigate('/register/artisan');
            } else if (userRole === 'intending_artisan') {
              navigate('/register/intendingArtisan');
            } else if (userRole === 'super_admin') {
              navigate('/admin/dashboard'); // Default KYC route for other user types
            }
          
          } else if (userRole === 'superadmin'){
            navigate('/admin/dashboard');
          }else if (userRole === 'artisan_user'){
            navigate('/artisan/dashboard');
          }else if (userRole === 'intending_artisan'){
            navigate('/intendingArtisan/dashboard');
          }
            // Navigation for non-first-time users

            // switch (userRole) {
            //   case 'admin':
            //     navigate('/admin/dashboard');
            //   break;
            //   case 'superadmin':
            //     navigate('/admin/dashboard');
            //     break;
            //   case 'artisan_user':
            //     navigate('/artisan/dashboard');
            //     break;
            //   case 'intending_artisan':
            //     navigate('/intendingArtisan/dashboard');
            //     break;
            //   default:
            //     navigate('/marketplace');
            // }
          
        } else if (loginAs === 'training_center') {
          if (isFirstTimeUser && 'training_center'.includes(userRole)) {
            navigate('/register/trainingcenter');
          } else {
            navigate(userRole === '/about');
          }
          console.log(userRole);
        }
      } else {
        navigate('/login')
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.log('Error logging in:', error);
      
      alert('An error occurred. Please try again.');
    }
  };



  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/login`, {
  //       identifier: email,
  //       password,
  //       loginAs
  //     });
  
  //     const { success, data } = response.data;
  
  //     if (success) {
  //       const userData = data[loginAs === 'user' ? 'user' : 'training_center'];
  //       const userRole = userData?.role || 'training_center';
  //       const isFirstTimeUser = userData?.agree !== true; // Check if first-time user
  //       const { accessToken, refreshToken } = userData?.accessToken || {};
  //       const { _id } = userData || {};
  
  //       // Save relevant data to localStorage
  //       localStorage.setItem('userId', _id);
  //       localStorage.setItem('userRole', userRole);
  //       localStorage.setItem('accessToken', accessToken);
  //       localStorage.setItem('refreshToken', refreshToken);
  //       localStorage.setItem('isFirstTimeUser', JSON.stringify(isFirstTimeUser));
  
  //       console.log('User ID:', _id);
  //       console.log('User Role:', userRole);
  
  //       // Navigate based on role and first-time status
  //       if (loginAs === 'user') {
  //         if (isFirstTimeUser) {
  //           navigate(
  //             userRole === 'artisan_user'
  //               ? '/register/artisan'
  //               : userRole === 'intending_artisan'
  //               ? '/register/intendingArtisan'
  //               : '/kyc'
  //           );
  //         } else {
  //           switch (userRole) {
  //             case 'admin':
  //             case 'superadmin':
  //               navigate('/admin/dashboard');
  //               break;
  //             case 'artisan_user':
  //               navigate('/artisan/dashboard');
  //               break;
  //             case 'intending_artisan':
  //               navigate('/intendingArtisan/dashboard');
  //               break;
  //             default:
  //               navigate('/marketplace');
  //           }
  //         }
  //       } else if (loginAs === 'training_center') {
  //         if (isFirstTimeUser) {
  //           navigate('/trainingcenter/dashboard');
  //         } else {
  //           navigate('/about'); // Adjust based on training center requirements
  //         }
  //       }
  //     } else {
  //       alert('Login failed: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     alert('An error occurred. Please try again.');
  //   }
  // };
  
return (
    <>
   
    <PageLayout>  
<section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
      
      {/* <div className="inline-block rounded-lg bg-muted pl-80 pr-5 py-5 text-5xl font-bold text-green-600">About SUPA</div> */}
  </section>
      {/* <div className="flex min-h-screen items-center justify-center "> */}
      <div className="flex min-h-screen items-center justify-center absolute top-0 left-0 right-0 bottom-0"> 
        <Card className="w-full max-w-4xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-600">Welcome Back</CardTitle>
                <CardDescription>Please sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={loginAs} onValueChange={handleRoleChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-50">
                    <TabsTrigger 
                      value="user" 
                      className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                      >
                        Regular User
                    </TabsTrigger>
                    <TabsTrigger 
                      value="training_center"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                      >
                        Training Center
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="user">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2" >
                        <Label htmlFor="email" className="block text-left text-xs text-gray-600">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required 
                               value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="block text-left text-xs text-gray-600">Password</Label>
                        <div className="relative">
                          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" required 
                                 value={password} onChange={(e) => setPassword(e.target.value)} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-emerald-800">Sign In</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="training_center">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="center-email" className="block text-left text-xs text-gray-600">Training Center Email</Label>
                        <Input id="center-email" type="email" placeholder="center@example.com" required 
                               value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="center-password" className="block text-left text-xs text-gray-600">Password</Label>
                        <div className="relative">
                          <Input id="center-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" required 
                                 value={password} onChange={(e) => setPassword(e.target.value)} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600">Sign In as Training Center</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </CardFooter>
            </div>
            <div className="hidden md:block md:w-1/2">
              {loginAs === 'user' ? (
                <div className="flex h-full items-center justify-center bg-green-100 p-6">
                  <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-green-800">Regular User</h2>
                    <p className="text-green-600">Access your personal dashboard and track your progress.</p>
                    <img
                      src="/hairdresser copy.jpeg?height=200&width=200"
                      alt="User learning illustration"
                      className="mx-auto mt-4 h-48 w-48 object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-blue-100 p-6">
                  <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-blue-800">Training Center</h2>
                    <p className="text-blue-600">Manage your Artisan and training programs efficiently.</p>
                    <img
                      src="/plumber copy.jpeg?height=200&width=200"
                      alt="Training center illustration"
                      className="mx-auto mt-4 h-48 w-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      </PageLayout>
      </>
  );
}
