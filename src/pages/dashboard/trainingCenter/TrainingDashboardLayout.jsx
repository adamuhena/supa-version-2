// import {
//   Bell,
//   ChevronsUpDown,
//   CreditCard,
//   Frame,
//   LifeBuoy,
//   LogOut,
//   Send,
//   Star,
//   UserCircle,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { cn } from "../../../lib/utils";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import axios from "axios"; // Make sure axios is installed or replace with your preferred HTTP client
// import { useNavigate } from "react-router-dom"; // To handle log out
// import { toast } from "sonner";
// import logo3 from "../../../assets/logo.png";
// import Spinner from "../../../components/layout/spinner";
// import { DotPattern } from "../../../components/ui/dot-pattern";
// import { API_BASE_URL } from "@/config/env";

// export default function TrainingDashboardPage({ href, title, children }) {
//   const [userData, setUserData] = useState(null); // Holds the user data
//   const navigate = useNavigate();

//   // Fetch user data from API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const userId = localStorage.getItem("userId");

//         if (!accessToken || !userId) {
//           return; // If no token or userId, you can handle this with a redirect or error state
//         }

//         const response = await axios.get(
//           `${API_BASE_URL}/training-center/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setUserData(response.data.data); // Set the user data in state
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("userId");
//     toast.success("Logged Out Successfully...");
//     navigate("/login");
//   };

//   if (!userData) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // Role-based filtering function
//   const isLinkAccessible = (allowedRoles) => {
//     if (!userData || !userData.role) {
//       toast.error(`User data or role is missing: ${userData}`);
//       console.error("User data or role is missing:", userData);
//       return false;
//     }
//     return allowedRoles.includes(userData.role);
//   };

//   return (
//     <SidebarProvider>
//       <Sidebar variant="inset">
//         <SidebarHeader>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton size="lg" asChild>
//                 <Link
//                   to="/login"
//                   onClick={(e) => {
//                     e.preventDefault(); // Prevent default link behavior to allow `navigate` to take control
//                     navigate("/login");
//                   }}
//                   className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition">
//                   <div className="flex aspect-square bg-white size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//                     <img src={logo3} alt="Logo 1" className="size-8" />
//                   </div>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate text-emerald-800 text-xl font-semibold">
//                       ITF SUPA
//                     </span>
//                     <span className="truncate text-red-700 text-xs">
//                       Skill-Up Artisan
//                     </span>
//                   </div>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarHeader>

//         <SidebarContent>
//           {isLinkAccessible(["admin", "superadmin", "training_center"]) ? (
//             <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//               <SidebarGroupLabel>Training Center</SidebarGroupLabel>
//               <SidebarMenu>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild>
//                     <Link to="/trainingcenter/dashboard">
//                       <Frame />
//                       <span>Dashboard</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild>
//                     <Link to="/training-center/groups">
//                       <Star />
//                       <span>Students Assigned</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </SidebarMenu>
//             </SidebarGroup>
//           ) : null}

//           {isLinkAccessible(["admin", "superadmin", "training_center"]) ? (
//             <SidebarGroup className="mt-auto">
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   <SidebarMenuItem>
//                     <SidebarMenuButton asChild size="sm">
//                       <Link to="/about">
//                         <Send />
//                         <span>Feedback</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                   <SidebarMenuItem>
//                     <SidebarMenuButton asChild size="sm">
//                       <Link to="/contact">
//                         <LifeBuoy />
//                         <span>Help Center</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                   {/* Add more static menu items here */}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           ) : null}
//         </SidebarContent>

//         <SidebarFooter>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild className="bg-red-600 ">
//                   <SidebarMenuButton
//                     size="lg"
//                     className="data-[state=open]:bg-sidebar-accent  bg-green-50 rounded-lg">
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage
//                         src={userData.profileImage}
//                         alt={userData.trainingCentreName}
//                       />
//                       <AvatarFallback>
//                         {userData.trainingCentreName}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {userData.trainingCentreName}
//                       </span>
//                       <span className="truncate text-xs">{userData.email}</span>
//                     </div>
//                     <ChevronsUpDown className="ml-auto size-4" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-green-50 min-w-56 rounded-lg">
//                   <DropdownMenuLabel className="p-0 font-normal">
//                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                       <Avatar className="h-8 w-8 rounded-lg">
//                         <AvatarImage
//                           src={userData.profileImage}
//                           alt={userData.trainingCentreName}
//                         />
//                         <AvatarFallback>
//                           {userData.trainingCentreName}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="grid flex-1 text-left text-sm leading-tight">
//                         <span className="truncate font-semibold">
//                           {userData.trainingCentreName}
//                         </span>
//                         <span className="truncate text-xs">
//                           {userData.email}
//                         </span>
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem
//                       variant="outline"
//                       onClick={() => navigate("/training-center/biodata")}>
//                       <UserCircle />
//                       Account
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <CreditCard />
//                       Billing
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       variant="outline"
//                       onClick={() => navigate("#")}>
//                       <Bell />
//                       Notifications
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut />
//                     Log out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarFooter>
//       </Sidebar>

//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href={href}>Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>{title}</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <DotPattern
//             width={20}
//             height={20}
//             cx={1}
//             cy={1}
//             cr={1}
//             className={cn("fill-neutral-200/40 ")}
//           />

//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


"use client"

import { Bell, ChevronsUpDown, CreditCard, Frame, LifeBuoy, LogOut, Send, Star, UserCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { cn } from "../../../lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logo3 from "../../../assets/logo.png"
import Spinner from "../../../components/layout/spinner"
import { DotPattern } from "@/components/ui/dot-pattern"
import { API_BASE_URL } from "@/config/env"
import useLogout from "@/pages/loginPage/logout"
import { jwtDecode } from "jwt-decode"
import { Outlet } from "react-router-dom"
  
// Token expiration check function
const checkTokenExpiration = (token) => {
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Token decode error:", error)
    return true // Consider invalid if we can't decode
  }
}

export default function TrainingDashboardPage({ href, title, children }) {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const logout = useLogout()
  const isMounted = useRef(true)
  const hasDataFetched = useRef(false)

  // Fetch user data from API
  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true

    // Only fetch data if we haven't already
    if (hasDataFetched.current) return

    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const userId = localStorage.getItem("userId")

        if (!accessToken || !userId) {
          logout()
          return
        }

        // Check token expiration before making the request
        if (checkTokenExpiration(accessToken)) {
          console.log("Token expired in TrainingDashboardPage")
          logout()
          return
        }

        const response = await axios.get(`${API_BASE_URL}/training-center/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (isMounted.current && response.data.success) {
          setUserData(response.data.data)
          hasDataFetched.current = true
        }
      } catch (error) {
        console.error("Error fetching user data:", error)

        // Check if error is due to token expiration (401 Unauthorized)
        if (error.response && error.response.status === 401) {
          console.log("401 Unauthorized in TrainingDashboardPage - logging out")
          logout()
        }
      }
    }

    fetchUserData()

    // Cleanup function
    return () => {
      isMounted.current = false
    }
  }, []) // Empty dependency array to run only once

  // Use the logout hook instead of implementing logout logic again
  const handleLogout = () => {
    logout()
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  // Role-based filtering function
  const isLinkAccessible = (allowedRoles) => {
    if (!userData || !userData.role) {
      console.error("User data or role is missing:", userData)
      return false
    }
    return allowedRoles.includes(userData.role)
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/login")
                  }}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex aspect-square bg-white size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img src={logo3 || "/placeholder.svg"} alt="Logo 1" className="size-8" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-emerald-800 text-xl font-semibold">ITF SUPA</span>
                    <span className="truncate text-red-700 text-xs">Skill-Up Artisan</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {isLinkAccessible(["admin", "superadmin", "training_center"]) ? (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Training Center</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/trainingcenter/dashboard">
                      <Frame />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/training-center/groups">
                      <Star />
                      <span>Students Assigned</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          ) : null}

          {isLinkAccessible(["admin", "superadmin", "training_center"]) ? (
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="sm">
                      <Link to="/about">
                        <Send />
                        <span>Feedback</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="sm">
                      <Link to="/contact">
                        <LifeBuoy />
                        <span>Help Center</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="bg-red-600 ">
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent  bg-green-50 rounded-lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData.profileImage} alt={userData.trainingCentreName} />
                      <AvatarFallback>{userData.trainingCentreName}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.trainingCentreName}</span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-green-50 min-w-56 rounded-lg">
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userData.profileImage} alt={userData.trainingCentreName} />
                        <AvatarFallback>{userData.trainingCentreName}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{userData.trainingCentreName}</span>
                        <span className="truncate text-xs">{userData.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="outline" onClick={() => navigate("/training-center/biodata")}>
                      <UserCircle />
                      Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="outline" onClick={() => navigate("#")}>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={href}>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className={cn("fill-neutral-200/40 ")} />

          {/* {children} */}
          <Outlet /> {/* This will render the nested routes */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
