// import DashboardPage from "@/components/layout/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { LogOut, SquareCheckBig, UserCircle } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { BioDataDialog } from "./components/BioDataDialog";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const UserCert = () => {
//   const logout = useLogout();
//   const [isBioDataDialogOpen, setIsBioDataDialogOpen] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [filteredUsers, setFilteredUsers] = useState(users || []);
//   const [roleFilter, setRoleFilter] = useState("");
//   const [stateFilter, setStateFilter] = useState("");
//   const [lgaFilter, setLgaFilter] = useState("");
//   const [senatorialDistrictFilter, setSenatorialDistrictFilter] = useState("");
//   const [tradeAreaFilter, setTradeAreaFilter] = useState("");
//   const [sectorFilter, setSectorFilter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 25;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get(`${API_BASE_URL}/users`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         if (response.data.success) {
//           setUsers(response.data.data);
//         }
//         toast.success("Users fetched successfully");
//       } catch (error) {
//         toast.error("Error fetching users");
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     console.log("Users:", users); // Check what users contains
//     if (users && Array.isArray(users)) {
//       const filtered = users.filter(
//         (user) =>
//           (roleFilter ? user.role === roleFilter : true) &&
//           (stateFilter
//             ? user.stateOfResidence
//               .toLowerCase()
//               .includes(stateFilter.toLowerCase())
//             : true) &&
//           (lgaFilter
//             ? user.lgaOfResidence
//               .toLowerCase()
//               .includes(lgaFilter.toLowerCase())
//             : true) &&
//           (senatorialDistrictFilter
//             ? user.senatorialDistrict === senatorialDistrictFilter
//             : true) &&
//           (tradeAreaFilter ? user.tradeArea === tradeAreaFilter : true) &&
//           (sectorFilter ? user.sector === sectorFilter : true)
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [
//     users,
//     roleFilter,
//     stateFilter,
//     lgaFilter,
//     senatorialDistrictFilter,
//     tradeAreaFilter,
//     sectorFilter,
//   ]);

//   const handleBio = async (userId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       if (response.data.success) {
//         setSelectedUser(response.data.data);
//         setIsBioDataDialogOpen(true);
//         console.log("data:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       toast.error("Error fetching user data");
//     }
//   };
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // These arrays would typically come from your backend or be defined elsewhere
//   const senatorialDistricts = ["District A", "District B", "District C"];
//   const tradeAreas = ["Carpentry", "Plumbing", "Electrical", "Masonry"];
//   const sectors = ["Construction", "Technology", "Agriculture", "Healthcare"];

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <ProtectedRoute>
//       <DashboardPage title="User Management">
//         <div className="container mx-auto p-6 space-y-8 ">
//           <header className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold">USER VERIFICATION</h1>
//               <h2 className="text-left font-[700] text-[14px]">
//                 (VERIFICATION & ADMINISTRATORS)
//               </h2>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate("/biodata")}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>

//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="mb-4 flex flex-wrap gap-4">
//               <Select onValueChange={setRoleFilter} value={roleFilter}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Filter by role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Roles</SelectItem>
//                   <SelectItem value="artisan_user">Artisan User</SelectItem>
//                   <SelectItem value="intending_artisan">
//                     Intending Artisan
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//               <Input
//                 placeholder="Filter by State"
//                 value={stateFilter}
//                 onChange={(e) => setStateFilter(e.target.value)}
//                 className="w-[200px]"
//               />
//               <Input
//                 placeholder="Filter by LGA"
//                 value={lgaFilter}
//                 onChange={(e) => setLgaFilter(e.target.value)}
//                 className="w-[200px]"
//               />
//               <Select
//                 onValueChange={setSenatorialDistrictFilter}
//                 value={senatorialDistrictFilter}
//               >
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Senatorial District" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Districts</SelectItem>
//                   {senatorialDistricts.map((district) => (
//                     <SelectItem key={district} value={district}>
//                       {district}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 onValueChange={setTradeAreaFilter}
//                 value={tradeAreaFilter}
//               >
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Trade Area" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Trade Areas</SelectItem>
//                   {tradeAreas.map((area) => (
//                     <SelectItem key={area} value={area}>
//                       {area}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select onValueChange={setSectorFilter} value={sectorFilter}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Sector" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Sectors</SelectItem>
//                   {sectors.map((sector) => (
//                     <SelectItem key={sector} value={sector}>
//                       {sector}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="w-full flex justify-end gap-2 mb-3 ">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>SN</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>State</TableHead>
//                     <TableHead>LGA</TableHead>
//                     <TableHead>Senatorial District</TableHead>
//                     <TableHead>Trade Area</TableHead>
//                     <TableHead>Sector</TableHead>
//                     <TableHead>Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentItems?.map((user, index) => (
//                     <TableRow key={user._id}>
//                       <TableCell>
//                         {index + 1 + (currentPage - 1) * itemsPerPage}
//                       </TableCell>
//                       <TableCell>
//                         {user.firstName} {user.lastName}
//                       </TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell>{user.role}</TableCell>
//                       <TableCell>{user.stateOfResidence}</TableCell>
//                       <TableCell>{user.lgaOfResidence}</TableCell>
//                       <TableCell>{user.senatorialDistrict}</TableCell>
//                       <TableCell>{user.tradeArea}</TableCell>
//                       <TableCell>{user.sector}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleBio(user._id)}
//                         >
//                           <SquareCheckBig className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <BioDataDialog
//                 isOpen={isBioDataDialogOpen}
//                 onClose={() => setIsBioDataDialogOpen(false)}
//                 userData={selectedUser}
//               />
//             </div>
//             <div className="mt-4">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() =>
//                         handlePageChange(Math.max(1, currentPage - 1))
//                       }
//                       disabled={currentPage === 1}
//                     />
//                   </PaginationItem>
//                   {[...Array(totalPages)].map((_, index) => (
//                     <PaginationItem key={index}>
//                       <PaginationLink
//                         onClick={() => handlePageChange(index + 1)}
//                         isActive={currentPage === index + 1}
//                       >
//                         {index + 1}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}
//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() =>
//                         handlePageChange(Math.min(totalPages, currentPage + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           </div>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   );
// };

// export default UserCert;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LogOut, SquareCheckBig, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import useLogout from "../../../loginPage/logout";
import { BioDataDialog } from "./components/BioDataDialog";
import { API_BASE_URL } from "@/config/env";

// Constants

const UserCertification = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // State Management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBioDataDialogOpen, setIsBioDataDialogOpen] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    pageSize: 25,
  });

  // Filter States
  const [filters, setFilters] = useState({
    role: null,
    state: "",
    lga: "",
    senatorialDistrict: null,
    tradeArea: null,
    sector: null,
  });

  // Predefined Filter Options
  const filterOptions = {
    roles: [
      { value: "artisan_user", label: "Artisan User" },
      { value: "intending_artisan", label: "Intending Artisan" },
    ],
    senatorialDistricts: ["District A", "District B", "District C"],
    tradeAreas: ["Carpentry", "Plumbing", "Electrical", "Masonry"],
    sectors: ["Construction", "Technology", "Agriculture", "Healthcare"],
  };

  // Fetch Users Function
  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const accessToken = localStorage.getItem("accessToken");

  //     const response = await axios.get(`${API_BASE_URL}/userscert`, {
  //       params: {
  //         page: pagination?.currentPage || 1, // Fallback to 1
  //         limit: pagination?.pageSize || 50, // Fallback to 25
  //         ...Object.fromEntries(
  //           Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
  //         ),
  //       },
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });

  //     // if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.users)) {

  //     if (
  //       response.data &&
  //       response.data.success &&
  //       response.data.data &&
  //       Array.isArray(response.data.data.users)
  //     ) {
  //       const { pagination: apiPagination } = response.data.data;

  //       setUsers(response.data.data.users || []); // Fallback to empty array
  //       setPagination({
  //         currentPage: apiPagination?.currentPage || 1,
  //         totalPages: apiPagination?.totalPages || 1,
  //         totalUsers: apiPagination?.totalUsers || 0,
  //         pageSize: apiPagination?.pageSize || 50,
  //       });
  //       toast.success("Users fetched successfully");
  //     }
  //   } catch (error) {
  //     toast.error("Error fetching users");
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
  
      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params: {
          page: pagination?.currentPage || 1, // Fallback to 1
          limit: pagination?.pageSize || 50, // Fallback to 50
          userType: ["artisan_user", "intending_artisan"], // Filter for specific user types
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
          ),
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data.users)
      ) {
        const { pagination: apiPagination } = response.data.data;
  
        setUsers(response.data.data.users || []); // Fallback to empty array
        setPagination({
          currentPage: apiPagination?.currentPage || 1,
          totalPages: apiPagination?.totalPages || 1,
          totalUsers: apiPagination?.totalUsers || 0,
          pageSize: apiPagination?.pageSize || 50,
        });
        toast.success("Users fetched successfully");
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  // User Details Fetch
  const handleUserDetails = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setSelectedUser(response.data.data);
        setIsBioDataDialogOpen(true);
      }
    } catch (error) {
      toast.error("Error fetching user details");
      console.error("Error fetching user details:", error);
    }
  };

  // Effect for Fetching Users
  useEffect(() => {
    fetchUsers();
  }, [
    pagination?.currentPage || 1, // Fallback to 1
    JSON.stringify(filters),
  ]);

  // Pagination Handlers
  const handlePageChange = (page) => {
    if (page > 0 && page <= (pagination?.totalPages || 1)) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  // Filter Change Handlers
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardPage title="User Management">
        <div className="container mx-auto p-6 space-y-8">
          {/* Page Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">USER VERIFICATION</h1>
              <h2 className="text-left font-bold text-sm">
                (VERIFICATION & ADMINISTRATORS)
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          {/* Filters Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4 flex flex-wrap gap-4">
              {/* Role Filter */}
              <Select
                value={filters.role || ""}
                onValueChange={(value) => updateFilter("role", value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Roles</SelectItem>
                  {filterOptions.roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* State Filter */}
              <Input
                placeholder="Filter by State"
                value={filters.state}
                onChange={(e) => updateFilter("state", e.target.value)}
                className="w-[200px]"
              />

              {/* LGA Filter */}
              <Input
                placeholder="Filter by LGA"
                value={filters.lga}
                onChange={(e) => updateFilter("lga", e.target.value)}
                className="w-[200px]"
              />

              {/* Senatorial District Filter */}
              <Select
                value={filters.senatorialDistrict || ""}
                onValueChange={(value) =>
                  updateFilter("senatorialDistrict", value)
                }>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Senatorial District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Districts</SelectItem>
                  {filterOptions.senatorialDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Trade Area Filter */}
              <Select
                value={filters.tradeArea || ""}
                onValueChange={(value) => updateFilter("tradeArea", value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trade Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Trade Areas</SelectItem>
                  {filterOptions.tradeAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sector Filter */}
              <Select
                value={filters.sector || ""}
                onValueChange={(value) => updateFilter("sector", value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Sectors</SelectItem>
                  {filterOptions.sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>LGA</TableHead>
                  <TableHead>Senatorial District</TableHead>
                  <TableHead>Trade Area</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      {index +
                        1 +
                        (pagination.currentPage - 1) * pagination.pageSize}
                    </TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.stateOfResidence}</TableCell>
                    <TableCell>{user.lgaOfResidence}</TableCell>
                    <TableCell>{user.senatorialDistrict}</TableCell>
                    <TableCell>{user.tradeArea}</TableCell>
                    <TableCell>{user.sector}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserDetails(user._id)}>
                        <SquareCheckBig className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
              {/* <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                    disabled={pagination?.currentPage === 1}
                  />
                </PaginationItem>

                {[...Array(pagination?.totalPages || 1)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={(pagination?.currentPage || 1) === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                    disabled={(pagination?.currentPage || 1) === pagination?.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination> */}
              <Pagination>
                <PaginationContent>
                  {/* Previous Button */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, pagination?.currentPage - 1)
                        )
                      }
                      disabled={pagination?.currentPage === 1}
                    />
                  </PaginationItem>

                  {/* First Page */}
                  {pagination?.currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pagination?.currentPage > 4 && (
                        <PaginationItem>
                          <PaginationLink disabled>...</PaginationLink>
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Dynamic Page Range */}
                  {Array.from(
                    {
                      length: Math.min(5, pagination?.totalPages || 1),
                    },
                    (_, i) => {
                      const pageNumber = Math.max(
                        1,
                        Math.min(
                          pagination?.totalPages || 1,
                          (pagination?.currentPage || 1) - 2 + i
                        )
                      );

                      return (
                        pageNumber > 0 &&
                        pageNumber <= (pagination?.totalPages || 1) && (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={pageNumber === pagination?.currentPage}
                              onClick={() => handlePageChange(pageNumber)}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      );
                    }
                  )}

                  {/* Last Page */}
                  {pagination?.currentPage <
                    (pagination?.totalPages || 1) - 2 && (
                    <>
                      {pagination?.currentPage <
                        (pagination?.totalPages || 1) - 3 && (
                        <PaginationItem>
                          <PaginationLink disabled>...</PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handlePageChange(pagination?.totalPages || 1)
                          }>
                          {pagination?.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {/* Next Button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            pagination?.totalPages || 1,
                            (pagination?.currentPage || 1) + 1
                          )
                        )
                      }
                      disabled={
                        pagination?.currentPage === pagination?.totalPages
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/* Bio Data Dialog */}
          {selectedUser && (
            <BioDataDialog
              isOpen={isBioDataDialogOpen}
              onClose={() => setIsBioDataDialogOpen(false)}
              userData={selectedUser}
            />
          )}
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default UserCertification;
