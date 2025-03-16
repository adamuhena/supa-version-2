import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  BookUser,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  FolderKanban,
  Frame,
  LifeBuoy,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Send,
  Settings2,
  Share,
  ShieldQuestion,
  Sparkles,
  SquarePen,
  SquareTerminal,
  Star,
  Trash2,
  UploadIcon,
  UserCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import logo3 from "../../assets/logo.png";
import { useNavigate } from "react-router-dom"; // To handle log out
import axios from "axios"; // Make sure axios is installed or replace with your preferred HTTP client
import { DotPattern } from "../ui/dot-pattern";
import { toast } from "sonner";
import Spinner from "./spinner";
import { API_BASE_URL } from "@/config/env";
import UploadButton from "../UploadButton";

export default function DashboardPage({ href, title, children }) {
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    toast.success("Logged Out Successfully...");
    navigate("/login");
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
//       <div className="fixed inset-0 flex justify-center items-center bg-green-200 bg-opacity-50 z-50">
//   <Spinner />
// </div>

    );
  }

  // Role-based filtering function
  const isLinkAccessible = (allowedRoles) => {
    if (!userData || !userData.role) {
      console.error("User data or role is missing:", userData);
      return false;
    }
    return allowedRoles.includes(userData.role);
  };

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
                    e.preventDefault(); // Prevent default link behavior to allow `navigate` to take control
                    navigate("/login");
                  }}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex aspect-square bg-white size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <img src={logo3} alt="Logo 1" className="size-8" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-emerald-800 text-xl font-semibold">
                      ITF SUPA
                    </span>
                    <span className="truncate text-red-700 text-xs">
                      Skill-Up Artisan
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {userData && isLinkAccessible(["superadmin", "admin"]) ? ( // Set default roles or use `allowedRoles` property in data
            <SidebarGroup>
              <SidebarGroupLabel>User Setup</SidebarGroupLabel>
              {/* <SidebarMenu>
                  <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRight />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items
                                .filter((subItem) =>
                                  isLinkAccessible(subItem.allowedRoles || ["admin", "super_admin", "artisan_user", "intending_artisan"])
                                )
                                .map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>

                </SidebarMenu> */}

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/dashboard">
                      <SquareTerminal />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/usermanagement">
                      <BookUser />
                      <span>User Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/certification">
                      <FolderKanban />
                      <span>User Certification | MGT</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/training-status">
                      <FolderKanban />
                      <span>Training Managment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {isLinkAccessible(["training_center"]) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/training/groups">
                        <BookOpen />
                        <span>Training Groups</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/sectors">
                      <BookOpen />
                      <span>Sector Managment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/document/verification">
                      <ShieldQuestion />
                      <span>Document Verification</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link to="/documents">
                      <UploadIcon />
                      <span>Artisan List Update</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/dashboard/reports">
                      <Settings2 />
                      <span>Artisan & Intending Artisan Reports</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/trainingcenter/reports">
                      <Settings2 />
                      <span>Training Center Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          ) : null}

          {isLinkAccessible([
            "admin",
            "superadmin",
            "artisan_user",
            "intending_artisan",
          ]) ? (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Artisans</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/trainee/dashboard">
                      <Frame />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Only render this SidebarMenuItem if the user is not an intending_artisan */}
                {isLinkAccessible(["admin", "superadmin", "artisan_user"]) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/certification/upload">
                        <Star />
                        <span>Certification</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          ) : null}

          {isLinkAccessible(["admin", "superadmin"]) ? (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Training Center</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/trainee/dashboard">
                      <Frame />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/training-center/status">
                      <Star />
                      <span>Students Assigned</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          ) : null}

          {isLinkAccessible([
            "admin",
            "superadmin",
            "artisan_user",
            "intending_artisan",
          ]) ? (
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
                  {/* Add more static menu items here */}
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
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent  bg-green-50 rounded-lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={userData.profileImage}
                        alt={userData.firstName}
                      />
                      <AvatarFallback>{userData.firstName}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.firstName}
                      </span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-green-50 min-w-56 rounded-lg">
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData.profileImage}
                          alt={userData.firstName}
                        />
                        <AvatarFallback>{userData.firstName}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData.firstName}
                        </span>
                        <span className="truncate text-xs">
                          {userData.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="outline"
                      onClick={() => navigate("/biodata")}>
                      <UserCircle />
                      Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="outline"
                      onClick={() => navigate("#")}>
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
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn("fill-neutral-200/40 ")}
          />

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
