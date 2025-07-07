import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PageLayout from "@/components/layout/pageLayout";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";
import { API_BASE_URL } from "@/config/env";

export default function LoginForm() {
  const [loginAs, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^234\d{10}$/;
    if (emailRegex.test(input) || phoneRegex.test(input)) {
      setInputError("");
      return true;
    } else {
      setInputError("Please enter a valid email or phone number.");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInput(email)) {
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        identifier: email,
        password,
        loginAs,
      });

      const { success, data } = response.data;

      if (success) {
        const userData = data[loginAs === "user" ? "user" : "training_center"];

        if (!userData) {
          toast.error("Login failed: Invalid user data.");
          return;
        }

        // Save user info to localStorage
        const userRole = userData.role || "training_center";
        const isFirstTimeUser = userData.agree === false;
        const { _id } = userData;

        localStorage.setItem("userId", _id);
        localStorage.setItem("userRole", userRole);
        // Store the full user object for easy access everywhere
        localStorage.setItem("user", JSON.stringify(userData));

        localStorage.setItem("accessToken", data.accessToken.accessToken);
        localStorage.setItem("refreshToken", data.accessToken.refreshToken);
        localStorage.setItem("isFirstTimeUser", JSON.stringify(isFirstTimeUser));

        toast.success(`Welcome back, ${userData.role}!`);

        // Redirect based on role and first-time user status
        redirectToAppropriatePage(userRole, isFirstTimeUser);
      } else {
        toast.error(`Login failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const redirectToAppropriatePage = (userRole, isFirstTimeUser) => {
    const rolePaths = isFirstTimeUser
      ? {
          artisan_user: "/register/artisan",
          intending_artisan: "/register/intendingArtisan",
          training_center: "/register/trainingcenter",
        }
      : {
          admin: "/admin/dashboard",
          superadmin: "/admin/dashboard",
          artisan_user: "/trainee/dashboard",
          intending_artisan: "/trainee/dashboard",
          training_center: "/trainingcenter/dashboard",
        };

    // Redirect to the relevant path
    navigate(rolePaths[userRole] || "/");
  };

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
                  <CardTitle className="text-2xl font-bold text-gray-600">
                    Welcome Back
                  </CardTitle>
                  <CardDescription>
                    Please sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={loginAs}
                    onValueChange={handleRoleChange}
                    className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-50">
                      <TabsTrigger
                        value="user"
                        className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
                        User
                      </TabsTrigger>
                      <TabsTrigger
                        value="training_center"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
                        Training Center
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="user">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="block text-left text-xs text-gray-600">
                            Email | PhoneNumber
                          </Label>
                          <Input
                            id="email"
                            type="text"
                            placeholder="john@example.com | 2348012345678"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateInput(email)}
                          />
                          {inputError && (
                            <p className="text-red-500 text-xs">{inputError}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="password"
                            className="block text-left text-xs text-gray-600">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }>
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-emerald-800">
                          {loading ? <Spinner /> : "Sign In"}
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="training_center">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="center-email"
                            className="block text-left text-xs text-gray-600">
                            Training Center Email
                          </Label>
                          <Input
                            id="center-email"
                            type="text"
                            placeholder="center@example.com | 2348012345678"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateInput(email)}
                          />
                          {inputError && (
                            <p className="text-red-500 text-xs">{inputError}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="center-password"
                            className="block text-left text-xs text-gray-600">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="center-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }>
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600">
                          {loading ? <Spinner /> : "Sign In as Training Center"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </CardFooter>
              </div>
              <div className="hidden md:block md:w-1/2">
                {loginAs === "user" ? (
                  <div className="flex h-full items-center justify-center bg-green-100 p-6">
                    <div className="text-center">
                      <h2 className="mb-2 text-2xl font-bold text-green-800">
                        Regular User
                      </h2>
                      <p className="text-green-600">
                        Access your personal dashboard and track your progress.
                      </p>
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
                      <h2 className="mb-2 text-2xl font-bold text-blue-800">
                        Training Center
                      </h2>
                      <p className="text-blue-600">
                        Manage your Artisan and training programs efficiently.
                      </p>
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



// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Button } from "../../components/ui/button";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import PageLayout from "@/components/layout/pageLayout";
// import { toast } from "sonner";
// import Spinner from "../../components/Spinner";
// import { API_BASE_URL } from "@/config/env";

// export default function LoginForm() {
//   const [loginAs, setRole] = useState("user");
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//   };

//   //   event.preventDefault();
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.post(`${API_BASE_URL}/login`, {
//   //       identifier: email,
//   //       password,
//   //       loginAs,
//   //     });

//   //     console.log("Full response:", response.data);

//   //     const { success, data } = response.data; // Assuming `tokens` contains `accessToken` and `refreshToken`

//   //     if (success) {
//   //       const userData = data[loginAs === "user" ? "user" : "training_center"];
//   //       toast.success(`Login Successfully! Role: ${userData.role}`, {
//   //         position: "top-right",
//   //       });

//   //       if (!userData) {
//   //         console.error("No valid user data found:", data);
//   //         toast.error("Login failed: Invalid user data.");
//   //         setLoading(false);
//   //         return;
//   //       }

//   //       const userRole = userData.role || "training_center";
//   //       const isFirstTimeUser = userData.agree === false;
//   //       const { _id } = userData;
//   //       const accessToken = response.data?.data?.accessToken?.accessToken;
//   //       const refreshToken = response.data?.data?.accessToken?.refreshToken;
//   //       console.log("accessToken", accessToken);
//   //       console.log("refreshToken", refreshToken);

//   //       // Store user information and tokens in localStorage
//   //       localStorage.setItem("userId", _id);
//   //       localStorage.setItem("userRole", userRole);
//   //       localStorage.setItem("accessToken", accessToken);
//   //       localStorage.setItem("refreshToken", refreshToken);
//   //       localStorage.setItem(
//   //         "isFirstTimeUser",
//   //         JSON.stringify(isFirstTimeUser)
//   //       );

//   //       console.log('i am in the login page 1')
//   //       // Navigate to appropriate pages
//   //       if (loginAs === "user") {
//   //         console.log('i am in the login page 2')
//   //         if (isFirstTimeUser) {
//   //           console.log('i am in the login page 3')
//   //           if (userRole === "artisan_user") {
//   //             navigate("/register/artisan");
//   //           } else if (userRole === "intending_artisan") {
//   //             navigate("/register/intendingArtisan");
//   //           } else if (userRole === "admin") {
//   //             navigate("/admin/dashboard"); // Default KYC route for other user types
//   //           } else if (userRole === "superadmin") {
//   //             navigate("/admin/dashboard"); // Default KYC route for other user types
//   //           }
//   //         } else if (userRole === "superadmin") {
//   //           navigate("/admin/dashboard");
//   //         } else if (userRole === "admin") {
//   //           navigate("/admin/dashboard");
//   //         } else if (userRole === "artisan_user") {
//   //           navigate("/trainee/dashboard");
//   //         } else if (userRole === "intending_artisan") {
//   //           navigate("/trainee/dashboard");
//   //         }
//   //       } else if (loginAs === "training_center") {
//   //         if (isFirstTimeUser) {
//   //           navigate("/register/trainingcenter");
//   //         } else {
//   //           navigate("/trainingcenter/dashboard");
//   //         }
//   //       } else {
//   //         navigate("/"); // Assuming this for regular users
//   //       }
//   //     } else {
//   //       toast.error(
//   //         `Login failed: Invalid user data. + ${response.data.message})`
//   //       );
//   //     }
//   //   } catch (error) {
//   //     const message = "Error!";
//   //     const description =
//   //       typeof error?.response?.data === "string"
//   //         ? error?.response?.data
//   //         : error?.response?.data?.message ||
//   //           "An error occurred. Please try again.";
//   //     toast.error(message, {
//   //       description,
//   //       position: "top-right",
//   //       style: { textAlign: "left" },
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const redirectToAppropriatePage = (userRole, isFirstTimeUser) => {
//     const rolePaths = isFirstTimeUser
//       ? {
//           artisan_user: "/register/artisan",
//           intending_artisan: "/register/intendingArtisan",
//           training_center: "/register/trainingcenter",
//         }
//       : {
//           admin: "/admin/dashboard",
//           superadmin: "/admin/dashboard",
//           artisan_user: "/trainee/dashboard",
//           intending_artisan: "/trainee/dashboard",
//           training_center: "/trainingcenter/dashboard",
//         };
  
//     // Redirect to the relevant path
//     navigate(rolePaths[userRole] || "/");
//   };
  
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
  
//     try {
//       const response = await axios.post(`${API_BASE_URL}/login`, {
//         identifier: email,
//         password,
//         loginAs,
//       });
  
//       const { success, data } = response.data;
  
//       if (success) {
//         const userData = data[loginAs === "user" ? "user" : "training_center"];

        
  
//         if (!userData) {
//           toast.error("Login failed: Invalid user data.");
//           return;
//         }
  
//         // Save user info to localStorage
//         const userRole = userData.role || "training_center";
//         const isFirstTimeUser = userData.agree === false;
//         const { _id } = userData;
  
//         localStorage.setItem("userId", _id);
//         localStorage.setItem("userRole", userRole);
//         localStorage.setItem("accessToken", data.accessToken.accessToken);
//         localStorage.setItem("refreshToken", data.accessToken.refreshToken);
//         localStorage.setItem("isFirstTimeUser", JSON.stringify(isFirstTimeUser));
  
//         toast.success(`Welcome back, ${userData.role}!`);
  
//         // Redirect based on role and first-time user status
//         redirectToAppropriatePage(userRole, isFirstTimeUser);
//       } else {
//         toast.error(`Login failed: ${response.data.message}`);
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "An error occurred. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <>
//       <PageLayout>
//         <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
//           {/* <div className="inline-block rounded-lg bg-muted pl-80 pr-5 py-5 text-5xl font-bold text-green-600">About SUPA</div> */}
//         </section>
//         {/* <div className="flex min-h-screen items-center justify-center "> */}
//         <div className="flex min-h-screen items-center justify-center absolute top-0 left-0 right-0 bottom-0">
//           <Card className="w-full max-w-4xl overflow-hidden">
//             <div className="flex flex-col md:flex-row">
//               <div className="md:w-1/2">
//                 <CardHeader>
//                   <CardTitle className="text-2xl font-bold text-gray-600">
//                     Welcome Back
//                   </CardTitle>
//                   <CardDescription>
//                     Please sign in to your account
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs
//                     value={loginAs}
//                     onValueChange={handleRoleChange}
//                     className="w-full">
//                     <TabsList className="grid w-full grid-cols-2 bg-gray-50">
//                       <TabsTrigger
//                         value="user"
//                         className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                         User
//                       </TabsTrigger>
//                       <TabsTrigger
//                         value="training_center"
//                         className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                         Training Center
//                       </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="user">
//                       <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="email"
//                             className="block text-left text-xs text-gray-600">
//                             Email | PhoneNumber
//                           </Label>
//                           <Input
//                             id="email"
//                             type="text"
//                             placeholder="john@example.com | 2348012345678"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="password"
//                             className="block text-left text-xs text-gray-600">
//                             Password
//                           </Label>
//                           <div className="relative">
//                             <Input
//                               id="password"
//                               type={showPassword ? "text" : "password"}
//                               placeholder="Enter your password"
//                               required
//                               value={password}
//                               onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                               onClick={() => setShowPassword(!showPassword)}
//                               aria-label={
//                                 showPassword ? "Hide password" : "Show password"
//                               }>
//                               {showPassword ? (
//                                 <EyeOffIcon className="h-4 w-4" />
//                               ) : (
//                                 <EyeIcon className="h-4 w-4" />
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                         <Button type="submit" className="w-full bg-emerald-800">
//                           {loading ? <Spinner /> : "Sign In"}
//                         </Button>
//                       </form>
//                     </TabsContent>
//                     <TabsContent value="training_center">
//                       <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="center-email"
//                             className="block text-left text-xs text-gray-600">
//                             Training Center Email
//                           </Label>
//                           <Input
//                             id="center-email"
//                             type="text"
//                             placeholder="center@example.com | 2348012345678"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="center-password"
//                             className="block text-left text-xs text-gray-600">
//                             Password
//                           </Label>
//                           <div className="relative">
//                             <Input
//                               id="center-password"
//                               type={showPassword ? "text" : "password"}
//                               placeholder="Enter your password"
//                               required
//                               value={password}
//                               onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                               onClick={() => setShowPassword(!showPassword)}
//                               aria-label={
//                                 showPassword ? "Hide password" : "Show password"
//                               }>
//                               {showPassword ? (
//                                 <EyeOffIcon className="h-4 w-4" />
//                               ) : (
//                                 <EyeIcon className="h-4 w-4" />
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                         <Button type="submit" className="w-full bg-blue-600">
//                           Sign In as Training Center
//                         </Button>
//                       </form>
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//                 <CardFooter className="flex justify-center">
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-blue-600 hover:underline">
//                     Forgot password?
//                   </Link>
//                 </CardFooter>
//               </div>
//               <div className="hidden md:block md:w-1/2">
//                 {loginAs === "user" ? (
//                   <div className="flex h-full items-center justify-center bg-green-100 p-6">
//                     <div className="text-center">
//                       <h2 className="mb-2 text-2xl font-bold text-green-800">
//                         Regular User
//                       </h2>
//                       <p className="text-green-600">
//                         Access your personal dashboard and track your progress.
//                       </p>
//                       <img
//                         src="/hairdresser copy.jpeg?height=200&width=200"
//                         alt="User learning illustration"
//                         className="mx-auto mt-4 h-48 w-48 object-cover"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex h-full items-center justify-center bg-blue-100 p-6">
//                     <div className="text-center">
//                       <h2 className="mb-2 text-2xl font-bold text-blue-800">
//                         Training Center
//                       </h2>
//                       <p className="text-blue-600">
//                         Manage your Artisan and training programs efficiently.
//                       </p>
//                       <img
//                         src="/plumber copy.jpeg?height=200&width=200"
//                         alt="Training center illustration"
//                         className="mx-auto mt-4 h-48 w-48 object-cover"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>
//         </div>
//       </PageLayout>
//     </>
//   );
// }
