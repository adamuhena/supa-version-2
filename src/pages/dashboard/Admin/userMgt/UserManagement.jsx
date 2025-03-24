// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { LogOut, SquareCheckBig, UserCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import DashboardPage from "@/components/layout/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// import useLogout from "../../../loginPage/logout";
// import { BioDataDialog } from "./components/BioDataDialog";
// import { API_BASE_URL } from "@/config/env";
// import Spinner from '@/components/layout/spinner';

// // Constants

// const UserCertification = () => {
//   const navigate = useNavigate();
//   const logout = useLogout();

//   // State Management
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isBioDataDialogOpen, setIsBioDataDialogOpen] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [debounceTimer, setDebounceTimer] = useState(null);

//   // Pagination State
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalUsers: 0,
//     pageSize: 25,
//   });

//   // Filter States
//   const [filters, setFilters] = useState({
//     role: null,
//     state: "",
//     lga: "",
//     senatorialDistrict: null,
//     tradeArea: null,
//     sector: null,
//   });

//   // Predefined Filter Options
//   const filterOptions = {
//     roles: [
//       { value: "artisan_user", label: "Artisan User" },
//       { value: "intending_artisan", label: "Intending Artisan" },
//     ],
//     senatorialDistricts: ["District A", "District B", "District C"],
//     tradeAreas: ["Carpentry", "Plumbing", "Electrical", "Masonry"],
//     sectors: ["Construction", "Technology", "Agriculture", "Healthcare"],
//   };
//   const handlePageChange = (page) => {
//     if (page > 0 && page <= (pagination?.totalPages || 1)) {
//       setPagination((prev) => ({
//         ...prev,
//         currentPage: page,
//       }));
//       // Fetch the new page of data
//       fetchUsers(page);
//     }
//   };

//   // const fetchUsers = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const accessToken = localStorage.getItem("accessToken");

//   //     const response = await axios.get(`${API_BASE_URL}/userscert`, {
//   //       params: {
//   //         page: pagination?.currentPage || 1, // Fallback to 1
//   //         limit: pagination?.pageSize || 50, // Fallback to 25
//   //         ...Object.fromEntries(
//   //           Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
//   //         ),
//   //       },
//   //       headers: { Authorization: `Bearer ${accessToken}` },
//   //     });

//   //     // if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.users)) {

//   //     if (
//   //       response.data &&
//   //       response.data.success &&
//   //       response.data.data &&
//   //       Array.isArray(response.data.data.users)
//   //     ) {
//   //       const { pagination: apiPagination } = response.data.data;

//   //       setUsers(response.data.data.users || []); // Fallback to empty array
//   //       setPagination({
//   //         currentPage: apiPagination?.currentPage || 1,
//   //         totalPages: apiPagination?.totalPages || 1,
//   //         totalUsers: apiPagination?.totalUsers || 0,
//   //         pageSize: apiPagination?.pageSize || 50,
//   //       });
//   //       toast.success("Users fetched successfully");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Error fetching users");
//   //     console.error("Error fetching users:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const accessToken = localStorage.getItem("accessToken");
  
//       const response = await axios.get(`${API_BASE_URL}/userscert`, {
//         params: {
//           page: pagination?.currentPage || 1, // Fallback to 1
//           limit: pagination?.pageSize || 50, // Fallback to 50
//           userType: ["artisan_user", "intending_artisan"], // Filter for specific user types
//           fromDate,
//           toDate, 
//           ...Object.fromEntries(
//             Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
//           ),
//         },
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
  
//       if (
//         response.data &&
//         response.data.success &&
//         response.data.data &&
//         Array.isArray(response.data.data.users)
//       ) {
//         const { pagination: apiPagination } = response.data.data;
  
//         setUsers(response.data.data.users || []); // Fallback to empty array
//         setPagination({
//           currentPage: apiPagination?.currentPage || 1,
//           totalPages: apiPagination?.totalPages || 1,
//           totalUsers: apiPagination?.totalUsers || 0,
//           pageSize: apiPagination?.pageSize || 50,
//         });
//         toast.success("Users fetched successfully");
//       }
//     } catch (error) {
//       toast.error("Error fetching users");
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // User Details Fetch
//   const handleUserDetails = async (userId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (response.data.success) {
//         setSelectedUser(response.data.data);
//         setIsBioDataDialogOpen(true);
//       }
//     } catch (error) {
//       toast.error("Error fetching user details");
//       console.error("Error fetching user details:", error);
//     }
//   };

//   useEffect(() => {
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }
//     const timer = setTimeout(() => {
//       fetchUsers();
//     }, 500); // Adjust the debounce delay as needed
//     setDebounceTimer(timer);

//     return () => clearTimeout(timer);
//   }, [pagination.currentPage, pagination.pageSize, filters, fromDate, toDate]);




//   // Filter Change Handlers
//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//     // Reset to first page when filters change
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: 1,
//     }));
//   };




//   return (
//     <ProtectedRoute>
//       <DashboardPage title="User Management">
//         <div className="container mx-auto p-6 space-y-8">
//           {/* Page Header */}
//           <header className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold">USER VERIFICATION</h1>
//               <h2 className="text-left font-bold text-sm">
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

//           {/* Filters Section */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="mb-4 flex flex-wrap gap-4">
//               {/* Role Filter */}
//               <Select
//                 value={filters.role || ""}
//                 onValueChange={(value) => updateFilter("role", value)}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Filter by Role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Roles</SelectItem>
//                   {filterOptions.roles.map((role) => (
//                     <SelectItem key={role.value} value={role.value}>
//                       {role.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* State Filter */}
//               <Input
//                 placeholder="Filter by State"
//                 value={filters.state}
//                 onChange={(e) => updateFilter("state", e.target.value)}
//                 className="w-[200px]"
//               />

//               {/* LGA Filter */}
//               <Input
//                 placeholder="Filter by LGA"
//                 value={filters.lga}
//                 onChange={(e) => updateFilter("lga", e.target.value)}
//                 className="w-[200px]"
//               />

//               {/* Senatorial District Filter */}
//               <Select
//                 value={filters.senatorialDistrict || ""}
//                 onValueChange={(value) =>
//                   updateFilter("senatorialDistrict", value)
//                 }>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Senatorial District" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Districts</SelectItem>
//                   {filterOptions.senatorialDistricts.map((district) => (
//                     <SelectItem key={district} value={district}>
//                       {district}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Trade Area Filter */}
//               <Select
//                 value={filters.tradeArea || ""}
//                 onValueChange={(value) => updateFilter("tradeArea", value)}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Trade Area" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Trade Areas</SelectItem>
//                   {filterOptions.tradeAreas.map((area) => (
//                     <SelectItem key={area} value={area}>
//                       {area}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Sector Filter */}
//               <Select
//                 value={filters.sector || ""}
//                 onValueChange={(value) => updateFilter("sector", value)}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Sector" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={null}>All Sectors</SelectItem>
//                   {filterOptions.sectors.map((sector) => (
//                     <SelectItem key={sector} value={sector}>
//                       {sector}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="filters">
//             <Input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               placeholder="From Date"
//             />
//             <Input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               placeholder="To Date"
//             />
//             <Button onClick={fetchUsers}>Apply Filters</Button>
//           </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>SN</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>State</TableHead>
//                   <TableHead>LGA</TableHead>
//                   <TableHead>Senatorial District</TableHead>
//                   <TableHead>Trade Area</TableHead>
//                   <TableHead>Sector</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {users?.map((user, index) => (
//                   <TableRow key={user._id}>
//                     <TableCell>
//                       {index +
//                         1 +
//                         (pagination.currentPage - 1) * pagination.pageSize}
//                     </TableCell>
//                     <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>{user.role}</TableCell>
//                     <TableCell>{user.stateOfResidence}</TableCell>
//                     <TableCell>{user.lgaOfResidence}</TableCell>
//                     <TableCell>{user.senatorialDistrict}</TableCell>
//                     <TableCell>{user.tradeArea}</TableCell>
//                     <TableCell>{user.sector}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleUserDetails(user._id)}>
//                         <SquareCheckBig className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             <div className="mt-4 flex justify-center">
//   <Pagination>
//     <PaginationContent>
//       {/* Previous */}
//       <PaginationItem>
//         <PaginationPrevious
//           onClick={() => handlePageChange(Math.max(1, pagination?.currentPage - 1))}
//           disabled={pagination?.currentPage === 1}
//         />
//       </PaginationItem>

//       {/* First Page */}
//       <PaginationItem>
//         <PaginationLink 
//           onClick={() => handlePageChange(1)}
//           isActive={pagination?.currentPage === 1}
//         >
//           1
//         </PaginationLink>
//       </PaginationItem>

//       {/* Ellipsis after first */}
//       {pagination?.currentPage > 3 && (
//         <PaginationItem>
//           <PaginationLink disabled>...</PaginationLink>
//         </PaginationItem>
//       )}

//       {/* Middle Pages */}
//       {Array.from({ length: 3 }, (_, i) => {
//         const pageNumber = pagination?.currentPage + i - 1;
//         return pageNumber > 1 && pageNumber < pagination?.totalPages ? (
//           <PaginationItem key={pageNumber}>
//             <PaginationLink
//               isActive={pageNumber === pagination?.currentPage}
//               onClick={() => handlePageChange(pageNumber)}
//             >
//               {pageNumber}
//             </PaginationLink>
//           </PaginationItem>
//         ) : null;
//       })}

//       {/* Ellipsis before last */}
//       {pagination?.currentPage < (pagination?.totalPages - 2) && (
//         <PaginationItem>
//           <PaginationLink disabled>...</PaginationLink>
//         </PaginationItem>
//       )}

//       {/* Last Page */}
//       {pagination?.totalPages > 1 && (
//         <PaginationItem>
//           <PaginationLink
//             onClick={() => handlePageChange(pagination?.totalPages)}
//             isActive={pagination?.currentPage === pagination?.totalPages}
//           >
//             {pagination?.totalPages}
//           </PaginationLink>
//         </PaginationItem>
//       )}

//       {/* Next */}  
//       <PaginationItem>
//         <PaginationNext
//           onClick={() => handlePageChange(Math.min(pagination?.totalPages, pagination?.currentPage + 1))}
//           disabled={pagination?.currentPage === pagination?.totalPages}
//         />
//       </PaginationItem>
//     </PaginationContent>
//   </Pagination>
// </div>
//           </div>

//           {/* Bio Data Dialog */}
//           {selectedUser && (
//             <BioDataDialog
//               isOpen={isBioDataDialogOpen}
//               onClose={() => setIsBioDataDialogOpen(false)}
//               userData={selectedUser}
//             />
//           )}
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   );
// };

// export default UserCertification;

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DashboardPage from "@/components/layout/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import Spinner from "@/components/layout/spinner"
import { states } from "@/data/nigeria"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"
import jsPDF from "jspdf"
import "jspdf-autotable"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cross1Icon, SewingPinFilledIcon } from "@radix-ui/react-icons"
import useLogout from "@/pages/loginPage/logout"
import { LogOut, Mail, PhoneCall, UserCircle, Edit, Eye, Save, X, Download, FileText } from "lucide-react"
import { API_BASE_URL } from "@/config/env"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const useDebounce = ({ onChange, debounce = 500 }) => {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return { value, setValue }
}

const UserManagement = () => {
  // At the top of the file, add a new state to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)

  const logout = useLogout()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const [hasLoadedFirst, sethasLoadedFirst] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editedUser, setEditedUser] = useState(null)
  const [loadingCSV, setLoadingCSV] = useState(false)
  const [csvData, setcsvData] = useState([])
  const MAX_CSV_ROWS = 1000000

  // Filter states
  const [sectors, setSectors] = useState([
    { _id: "construction", name: "Construction" },
    { _id: "technology", name: "Technology" },
    { _id: "agriculture", name: "Agriculture" },
    { _id: "healthcare", name: "Healthcare" },
  ])

  const [tradeAreas, setTradeAreas] = useState([
    { _id: "carpentry", name: "Carpentry", sectorId: "construction" },
    { _id: "plumbing", name: "Plumbing", sectorId: "construction" },
    { _id: "electrical", name: "Electrical", sectorId: "construction" },
    { _id: "masonry", name: "Masonry", sectorId: "construction" },
    { _id: "software", name: "Software Development", sectorId: "technology" },
    { _id: "networking", name: "Networking", sectorId: "technology" },
    { _id: "farming", name: "Farming", sectorId: "agriculture" },
    { _id: "nursing", name: "Nursing", sectorId: "healthcare" },
  ])

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
    pageSize: 25,
  })
  const totalPages = pagination.totalPages

  const itemsPerPage = 25

  const defaultData = {
    currentPage: 1,
    search: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    role: "",
    fromDate: "",
    toDate: "",
    sort: "-createdAt",
  }
  const [filter, setFilter] = useState({
    ...defaultData,
  })

  // Add this useEffect at the beginning of the component to set the mounted state
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  const handleFilterChange = (key, value) => {
    // If the value is "all", set it to an empty string in the filter
    const filterValue = value === "all" ? "" : value
    setFilter((x) => ({ ...x, [key]: filterValue }))

    // If changing state, reset LGA and senatorial district
    if (key === "state") {
      setFilter((x) => ({ ...x, lga: "", senatorialDistrict: "" }))
    }

    // If changing sector, reset trade area
    if (key === "sector") {
      setFilter((x) => ({ ...x, tradeArea: "" }))
    }
  }

  const currentPage = filter?.currentPage

  // Add pagination state handler
  const handlePageChange = (page) => {
    setFilter((x) => ({ ...x, currentPage: page }))
  }

  function replaceSymbolsWithSpace(str = "") {
    const replacedStr = str.replace(/[-/]/g, " ")
    return replacedStr.toLowerCase()
  }

  const selectedStateLGASResidence =
    states.find((state) => replaceSymbolsWithSpace(`${state?.value}`) === replaceSymbolsWithSpace(`${filter?.state}`))
      ?.lgas || []

  const selectedStateLGASResidenceFormatted =
    selectedStateLGASResidence && selectedStateLGASResidence?.length
      ? selectedStateLGASResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : []

  const { value: searchv, setValue } = useDebounce({
    debounce: 500,
    onChange: (debouncedValue) => {
      setFilter((x) => ({ ...x, search: debouncedValue }))
    },
  })

  function formatUserToCSV(users) {
    if (!Array.isArray(users) || users.length === 0) {
      return []
    }

    const headerMapping = {
      sn: "S/N",
      fullName: "Full Name",
      email: "Email",
      phoneNumber: "Phone Number",
      role: "Role",
      stateOfResidence: "State of Residence",
      lgaOfResidence: "LGA of Residence",
      senatorialDistrict: "Senatorial District",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
      createdAt: "Registration Date",
    }

    const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

    return [headers, ...rows]
  }

  const downloadCSV = async () => {
    setLoadingCSV(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params: {
          limit: MAX_CSV_ROWS,
          page: 1,
          search: filter?.search,
          state: filter?.state,
          lga: filter?.lga,
          sector: filter?.sector,
          tradeArea: filter?.tradeArea,
          role: filter?.role,
          fromDate: filter?.fromDate,
          toDate: filter?.toDate,
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data
      const formatted = formatUserToCSV(
        (data?.users || []).map((x, i) => {
          // Extract sector and trade area information
          const sectors = x.priorSkillsCerts
            ? x.priorSkillsCerts
                .map((cert) => cert.sector)
                .filter(Boolean)
                .join(", ")
            : ""
          const tradeAreas = x.priorSkillsCerts
            ? x.priorSkillsCerts
                .map((cert) => cert.tradeArea)
                .filter(Boolean)
                .join(", ")
            : ""

          return {
            sn: i + 1,
            fullName: `${x?.firstName || ""} ${x?.lastName || ""}`,
            email: x?.email || "",
            phoneNumber: x?.phoneNumber || "",
            role: x?.role || "",
            stateOfResidence: x?.stateOfResidence || "",
            lgaOfResidence: x?.lgaOfResidence || "",
            senatorialDistrict: x?.senatorialDistrict || "",
            sectors: sectors,
            tradeAreas: tradeAreas,
            createdAt: x?.createdAt ? new Date(x.createdAt).toLocaleDateString() : "",
          }
        }),
      )
      setcsvData(formatted)

      toast.success(
        "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
      )
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to generate CSV data")
    } finally {
      setLoadingCSV(false)
    }
  }

  const downloadPDF = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params: {
          limit: 1000000, // Limit for PDF to avoid large files
          page: 1,
          search: filter?.search,
          state: filter?.state,
          lga: filter?.lga,
          sector: filter?.sector,
          tradeArea: filter?.tradeArea,
          role: filter?.role,
          fromDate: filter?.fromDate,
          toDate: filter?.toDate,
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data
      const users = data?.users || []

      // Create PDF document
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text("User Management Report", 14, 22)
      doc.setFontSize(11)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

      // Define table columns
      const columns = [
        { header: "S/N", dataKey: "sn" },
        { header: "Name", dataKey: "name" },
        { header: "Email", dataKey: "email" },
        { header: "Phone", dataKey: "phone" },
        { header: "Role", dataKey: "role" },
        { header: "State", dataKey: "state" },
        { header: "LGA", dataKey: "lga" },
      ]

      // Prepare data for table
      const tableData = users.map((user, index) => ({
        sn: index + 1,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.email || "",
        phone: user.phoneNumber || "",
        role: user.role || "",
        state: user.stateOfResidence || "",
        lga: user.lgaOfResidence || "",
      }))

      // Add table to PDF
      doc.autoTable({
        columns,
        body: tableData,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [66, 66, 66] },
      })

      // Add filter information
      const filterInfo = []
      if (filter.search) filterInfo.push(`Search: ${filter.search}`)
      if (filter.state) filterInfo.push(`State: ${filter.state}`)
      if (filter.lga) filterInfo.push(`LGA: ${filter.lga}`)
      if (filter.role) filterInfo.push(`Role: ${filter.role}`)
      if (filter.sector) filterInfo.push(`Sector: ${filter.sector}`)
      if (filter.tradeArea) filterInfo.push(`Trade Area: ${filter.tradeArea}`)
      if (filter.fromDate) filterInfo.push(`From: ${filter.fromDate}`)
      if (filter.toDate) filterInfo.push(`To: ${filter.toDate}`)

      if (filterInfo.length > 0) {
        const finalY = doc.lastAutoTable.finalY || 40
        doc.setFontSize(10)
        doc.text("Filters Applied:", 14, finalY + 10)
        doc.setFontSize(8)
        filterInfo.forEach((info, index) => {
          doc.text(info, 14, finalY + 15 + index * 5)
        })
      }

      // Save the PDF
      doc.save("user-management-report.pdf")
      toast.success("PDF report has been generated and downloaded")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF report")
    } finally {
      setLoading(false)
    }
  }

  const clearFilter = () => {
    setFilter(defaultData)
    setValue("")
    setcsvData([])
  }

  // Remove the original fetchUsers function since we're now handling it directly in the useEffect
  // Delete this function:
  // const fetchUsers = async () => { ... }

  // Add a new state to track if we're currently editing a user
  const [isEditing, setIsEditing] = useState(false)

  // Modify the handleEditUser function to set this flag
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditedUser({ ...user })
    setEditMode(true)
    setIsEditing(true) // Set the editing flag
  }

  // Update the handleSaveChanges function to manually fetch users after saving
  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      await axios.patch(`${API_BASE_URL}/users/${editedUser._id}`, editedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      toast.success("User updated successfully")

      // Set isEditing to false first
      setIsEditing(false)
      setEditMode(false)
      setSelectedUser(null)
      setEditedUser(null)

      // Then manually trigger a fetch with a slight delay to avoid race conditions
      setTimeout(() => {
        const fetchUpdatedUsers = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/userscert`, {
              params: {
                limit: itemsPerPage,
                page: filter?.currentPage,
                search: filter?.search,
                state: filter?.state,
                lga: filter?.lga,
                sector: filter?.sector,
                tradeArea: filter?.tradeArea,
                role: filter?.role,
                fromDate: filter?.fromDate,
                toDate: filter?.toDate,
                sort: filter?.sort,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })

            if (response.data && response.data.success && response.data.data) {
              const { users, pagination } = response.data.data
              setUsers(users || [])
              setPagination({
                currentPage: pagination?.currentPage || 1,
                totalPages: pagination?.totalPages || 1,
                totalUsers: pagination?.totalUsers || 0,
                pageSize: pagination?.pageSize || 25,
              })
            }
          } catch (error) {
            console.error("Error fetching updated users:", error)
          }
        }

        fetchUpdatedUsers()
      }, 300)
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  // Modify the handleCancelEdit function to reset this flag
  const handleCancelEdit = () => {
    setEditMode(false)
    setEditedUser(null)
    setIsEditing(false) // Reset the editing flag
  }

  // Replace the existing fetchUsers useEffect with this version that includes additional safeguards
  useEffect(() => {
    // Only fetch users if the component is mounted and we're not currently editing
    if (isMounted && !isEditing) {
      const controller = new AbortController()
      const signal = controller.signal

      const fetchData = async () => {
        setLoading(true)
        try {
          const accessToken = localStorage.getItem("accessToken")
          const response = await axios.get(`${API_BASE_URL}/userscert`, {
            params: {
              limit: itemsPerPage,
              page: filter?.currentPage,
              search: filter?.search,
              state: filter?.state,
              lga: filter?.lga,
              sector: filter?.sector,
              tradeArea: filter?.tradeArea,
              role: filter?.role,
              fromDate: filter?.fromDate,
              toDate: filter?.toDate,
              sort: filter?.sort,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: signal,
          })

          if (response.data && response.data.success && response.data.data) {
            const { users, pagination } = response.data.data
            setUsers(users || [])
            setPagination({
              currentPage: pagination?.currentPage || 1,
              totalPages: pagination?.totalPages || 1,
              totalUsers: pagination?.totalUsers || 0,
              pageSize: pagination?.pageSize || 25,
            })
          } else {
            toast.error("Failed to fetch users data")
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Error fetching users:", error)
            toast.error("Failed to fetch users")
          }
        } finally {
          setLoading(false)
          setcsvData([])
        }
      }

      fetchData()

      return () => {
        controller.abort()
      }
    }
  }, [
    filter?.search,
    filter?.currentPage,
    filter?.state,
    filter?.lga,
    filter?.sector,
    filter?.tradeArea,
    filter?.role,
    filter?.fromDate,
    filter?.toDate,
    filter?.senatorialDistrict,
    isEditing,
    isMounted,
    itemsPerPage,
  ])

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setEditMode(false)
  }

  const handleInputChange = (field, value) => {
    if (typeof field === "string" && field.includes(".")) {
      // Handle nested fields like "bankAccount.accountName"
      const [parent, child] = field.split(".")
      setEditedUser((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      // Handle regular fields or when an object is passed directly
      setEditedUser((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSort = (field) => {
    const currentSort = filter.sort
    let newSort = `-${field}`

    // If already sorting by this field, toggle direction
    if (currentSort === `-${field}`) {
      newSort = field
    } else if (currentSort === field) {
      newSort = `-${field}`
    }

    setFilter((prev) => ({ ...prev, sort: newSort }))
  }

  return (
    <ProtectedRoute>
      {/* {loading && !hasLoadedFirst ? (
        <div className="flex relative justify-center items-center h-screen ">
          <Spinner />
        </div>
      ) : null} */}
      
      {/* <DashboardPage title="User Management"> */}
      
         <div className="container mx-auto py-6">
         {/* {loading && !hasLoadedFirst && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
              <Spinner />
            </div>
          )} */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">View, edit and export user data</p>
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

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium mb-4">Filters</h2>
            <div className="flex gap-[20px] flex-wrap mb-4">
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Search</p>
                <Input
                  className="text-[12px] placeholder:text-[12px]"
                  placeholder="Name or email"
                  value={searchv}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">State</p>
                <Select value={filter?.state} onValueChange={(value) => handleFilterChange("state", value)}>
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {states.map((item) => {
                        return (
                          <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
                            {item?.label}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Local Government</p>
                <Select value={filter.lga} onValueChange={(value) => handleFilterChange("lga", value)}>
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selectedStateLGASResidenceFormatted.map((item) => {
                        return (
                          <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
                            {item?.label}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Senatorial District</p>
                <Select
                  value={filter.senatorialDistrict || ""}
                  onValueChange={(value) => handleFilterChange("senatorialDistrict", value)}
                >
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-[12px]" value="all">
                        All Districts
                      </SelectItem>
                      {states
                        .find((state) => state.value === filter.state)
                        ?.senatorialDistricts?.map((district) => (
                          <SelectItem className="text-[12px]" key={district} value={district}>
                            {district}
                          </SelectItem>
                        )) || []}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Role</p>
                <Select value={filter?.role} onValueChange={(value) => handleFilterChange("role", value)}>
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-[12px]" value="all">
                        All Roles
                      </SelectItem>
                      <SelectItem className="text-[12px]" value="artisan_user">
                        Artisan User
                      </SelectItem>
                      <SelectItem className="text-[12px]" value="intending_artisan">
                        Intending Artisan
                      </SelectItem>
                      <SelectItem className="text-[12px]" value="regular_user">
                        Regular User
                      </SelectItem>
                      <SelectItem className="text-[12px]" value="admin">
                        Admin
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Sector</p>
                <Select value={filter?.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-[12px]" value="all">
                        All Sectors
                      </SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem className="text-[12px]" key={sector._id} value={sector._id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Trade Area</p>
                <Select value={filter.tradeArea} onValueChange={(value) => handleFilterChange("tradeArea", value)}>
                  <SelectTrigger className="text-[12px]">
                    <SelectValue placeholder="Select Trade Area" className="text-[12px]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-[12px]" value="all">
                        All Trade Areas
                      </SelectItem>
                      {tradeAreas
                        .filter((ta) => !filter.sector || ta.sectorId === filter.sector)
                        .map((ta) => (
                          <SelectItem className="text-[12px]" key={ta._id} value={ta._id}>
                            {ta.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-[20px] flex-wrap mb-4">
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">From Date</p>
                <Input
                  type="date"
                  className="text-[12px]"
                  value={filter.fromDate}
                  onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                />
              </div>

              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">To Date</p>
                <Input
                  type="date"
                  className="text-[12px]"
                  value={filter.toDate}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                />
              </div>
            </div>

            <div className="w-full items-center justify-start flex gap-4">
              <Button
                className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
                onClick={clearFilter}
                disabled={loading}
              >
                Clear
                {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : <Cross1Icon className="ml-2" />}
              </Button>
            </div>
          </div>

          <div className="gap-2 flex justify-between w-full mt-4">
            <h2 className="font-medium">Total Records Found: {pagination?.totalUsers || 0}</h2>
            <div className="gap-2 flex flex-row-reverse justify-start mb-4">
              <Button onClick={downloadPDF} className="ml-2" variant="outline" disabled={loading || !users?.length}>
                <FileText className="mr-2 h-4 w-4" /> Export PDF
                {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
              </Button>

              {!csvData?.length ? (
                <Button onClick={downloadCSV} variant="outline" disabled={loadingCSV || !users?.length}>
                  <Download className="mr-2 h-4 w-4" /> Generate CSV
                  {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
                </Button>
              ) : (
                <CSVLink
                  data={csvData}
                  filename="user-management-report.csv"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  disabled={loadingCSV || !users?.length}
                >
                  <Download className="mr-2 h-4 w-4" /> Download CSV
                  {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
                </CSVLink>
              )}
            </div>
          </div>

          <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("firstName")}>
                  Name {filter.sort === "firstName" ? "↑" : filter.sort === "-firstName" ? "↓" : ""}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                  Email {filter.sort === "email" ? "↑" : filter.sort === "-email" ? "↓" : ""}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
                  Role {filter.sort === "role" ? "↑" : filter.sort === "-role" ? "↓" : ""}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("stateOfResidence")}>
                  State/LGA {filter.sort === "stateOfResidence" ? "↑" : filter.sort === "-stateOfResidence" ? "↓" : ""}
                </TableHead>
                <TableHead className="cursor-pointer">
                  Senatorial District{" "}
                  {filter.sort === "senatorialDistrict" ? "↑" : filter.sort === "-senatorialDistrict" ? "↓" : ""}
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                  Registration Date {filter.sort === "createdAt" ? "↑" : filter.sort === "-createdAt" ? "↓" : ""}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id || index}>
                  <TableCell className="text-left text-[12px]">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="text-left max-w-[200px] text-[12px]">
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </TableCell>
                  <TableCell className="text-left text-[12px]">{user.email || ""}</TableCell>
                  <TableCell className="text-left text-[12px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "artisan_user"
                          ? "bg-green-100 text-green-800"
                          : user.role === "intending_artisan"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role || ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-left text-[12px]">{user?.stateOfResidence || "---"}</span>
                        <span className="text-left text-[10px]">{user?.lgaOfResidence || "---"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left text-[12px]">{user?.senatorialDistrict || "---"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-1 items-center">
                          <PhoneCall className="size-[14px]" />
                          <span className="text-left text-[10px]">{user?.phoneNumber || "---"}</span>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                          <Mail className="size-[14px]" />
                          <span className="text-left text-[10px]">{user?.email || "---"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left text-[12px]">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "---"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[600px] md:w-[800px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>User Details</SheetTitle>
                            <SheetDescription>View and manage user information</SheetDescription>
                          </SheetHeader>

                          {selectedUser && !editMode && (
                            <div className="py-4">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedUser.role} • {selectedUser.email}
                                  </p>
                                </div>

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Personal Information</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">First Name:</p>
                                      <p>{selectedUser.firstName || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Last Name:</p>
                                      <p>{selectedUser.lastName || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Middle Name:</p>
                                      <p>{selectedUser.middleName || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Gender:</p>
                                      <p>{selectedUser.gender || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Date of Birth:</p>
                                      <p>{selectedUser.dob || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Marital Status:</p>
                                      <p>{selectedUser.maritalStatus || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">NIN:</p>
                                      <p>{selectedUser.nin || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Has Disability:</p>
                                      <p>{selectedUser.hasDisability ? "Yes" : "No"}</p>
                                    </div>
                                    {selectedUser.hasDisability && (
                                      <div>
                                        <p className="font-medium">Disability Type:</p>
                                        <p>{selectedUser.disabilityType || "---"}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Contact Information</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">Email:</p>
                                      <p>{selectedUser.email || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Phone Number:</p>
                                      <p>{selectedUser.phoneNumber || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Location</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">State of Origin:</p>
                                      <p>{selectedUser.stateOfOrigin || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">LGA of Origin:</p>
                                      <p>{selectedUser.lga || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">State of Residence:</p>
                                      <p>{selectedUser.stateOfResidence || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">LGA of Residence:</p>
                                      <p>{selectedUser.lgaOfResidence || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Senatorial District:</p>
                                      <p>{selectedUser.senatorialDistrict || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Street Address:</p>
                                      <p>{selectedUser.street || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Education</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">School:</p>
                                      <p>{selectedUser.education?.school || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Highest Qualification:</p>
                                      <p>{selectedUser.education?.highestQualification || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Graduation Year:</p>
                                      <p>{selectedUser.education?.graduationYear || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                {selectedUser.priorSkillsCerts && selectedUser.priorSkillsCerts.length > 0 && (
                                  <div className="grid gap-2">
                                    <h4 className="font-medium">Skills & Certifications</h4>
                                    {selectedUser.priorSkillsCerts.map((cert, index) => (
                                      <div key={index} className="border p-2 rounded-md">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div>
                                            <p className="font-medium">Sector:</p>
                                            <p>{cert.sector || "---"}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Trade Area:</p>
                                            <p>{cert.tradeArea || "---"}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Certificate Name:</p>
                                            <p>{cert.name || "---"}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Year:</p>
                                            <p>{cert.year || "---"}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {selectedUser.experience && selectedUser.experience.length > 0 && (
                                  <div className="grid gap-2">
                                    <h4 className="font-medium">Experience</h4>
                                    {selectedUser.experience.map((exp, index) => (
                                      <div key={index} className="border p-2 rounded-md">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div>
                                            <p className="font-medium">Project Title:</p>
                                            <p>{exp.projectTitle || "---"}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Date Range:</p>
                                            <p>
                                              {exp.dateFrom || "---"} to {exp.dateTo || "---"}
                                            </p>
                                          </div>
                                          <div className="col-span-2">
                                            <p className="font-medium">Description:</p>
                                            <p>{exp.description || "---"}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Bank Information</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">Account Name:</p>
                                      <p>{selectedUser.bankAccount?.accountName || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Account Number:</p>
                                      <p>{selectedUser.bankAccount?.accountNumber || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Bank:</p>
                                      <p>{selectedUser.bankAccount?.bank || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-2">
                                  <h4 className="font-medium">Account Status</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">Certified Status:</p>
                                      <p>{selectedUser.certifiedStatus ? "Certified" : "Not Certified"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">License Status:</p>
                                      <p>{selectedUser.licenseStatus ? "Licensed" : "Not Licensed"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Registration Date:</p>
                                      <p>
                                        {selectedUser.createdAt
                                          ? new Date(selectedUser.createdAt).toLocaleDateString()
                                          : "---"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedUser && editMode && editedUser && (
                            <div className="py-4">
                              <div className="space-y-6">
                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="firstName">First Name</Label>
                                      <Input
                                        id="firstName"
                                        value={editedUser.firstName || ""}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="lastName">Last Name</Label>
                                      <Input
                                        id="lastName"
                                        value={editedUser.lastName || ""}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="middleName">Middle Name</Label>
                                      <Input
                                        id="middleName"
                                        value={editedUser.middleName || ""}
                                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="gender">Gender</Label>
                                      <Select
                                        value={editedUser.gender || ""}
                                        onChange={(value) => handleInputChange("gender", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="male">Male</SelectItem>
                                          <SelectItem value="female">Female</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="dob">Date of Birth</Label>
                                      <Input
                                        id="dob"
                                        type="date"
                                        value={editedUser.dob || ""}
                                        onChange={(e) => handleInputChange("dob", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="maritalStatus">Marital Status</Label>
                                      <Select
                                        value={editedUser.maritalStatus || ""}
                                        onChange={(value) => handleInputChange("maritalStatus", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Marital Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="single">Single</SelectItem>
                                          <SelectItem value="married">Married</SelectItem>
                                          <SelectItem value="divorced">Divorced</SelectItem>
                                          <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="nin">NIN</Label>
                                      <Input
                                        id="nin"
                                        value={editedUser.nin || ""}
                                        onChange={(e) => handleInputChange("nin", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="hasDisability">Has Disability</Label>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="hasDisability"
                                          checked={editedUser.hasDisability || false}
                                          onCheckedChange={(checked) => handleInputChange("hasDisability", checked)}
                                        />
                                        <label
                                          htmlFor="hasDisability"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                    </div>

                                    {editedUser.hasDisability && (
                                      <div className="grid gap-2">
                                        <Label htmlFor="disabilityType">Disability Type</Label>
                                        <Input
                                          id="disabilityType"
                                          value={editedUser.disabilityType || ""}
                                          onChange={(e) => handleInputChange("disabilityType", e.target.value)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={editedUser.email || ""}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="phoneNumber">Phone Number</Label>
                                      <Input
                                        id="phoneNumber"
                                        value={editedUser.phoneNumber || ""}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="profileImage">Profile Image URL</Label>
                                      <Input
                                        id="profileImage"
                                        value={editedUser.profileImage || ""}
                                        onChange={(e) => handleInputChange("profileImage", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-medium mb-4">Location</h3>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="stateOfOrigin">State of Origin</Label>
                                      <Select
                                        value={editedUser.stateOfOrigin || ""}
                                        onChange={(value) => handleInputChange("stateOfOrigin", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {states.map((item) => (
                                              <SelectItem value={item.value} key={item.value}>
                                                {item.label}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="lga">LGA of Origin</Label>
                                      <Select
                                        value={editedUser.lga || ""}
                                        onChange={(value) => handleInputChange("lga", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select LGA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {states
                                              .find((state) => state.value === editedUser.stateOfOrigin)
                                              ?.lgas.map((lga) => (
                                                <SelectItem value={lga} key={lga}>
                                                  {lga}
                                                </SelectItem>
                                              ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="stateOfResidence">State of Residence</Label>
                                      <Select
                                        value={editedUser.stateOfResidence || ""}
                                        onChange={(value) => handleInputChange("stateOfResidence", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {states.map((item) => (
                                              <SelectItem value={item.value} key={item.value}>
                                                {item.label}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
                                      <Select
                                        value={editedUser.lgaOfResidence || ""}
                                        onChange={(value) => handleInputChange("lgaOfResidence", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select LGA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {states
                                              .find((state) => state.value === editedUser.stateOfResidence)
                                              ?.lgas.map((lga) => (
                                                <SelectItem value={lga} key={lga}>
                                                  {lga}
                                                </SelectItem>
                                              ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="senatorialDistrict">Senatorial District</Label>
                                      <Input
                                        id="senatorialDistrict"
                                        value={editedUser.senatorialDistrict || ""}
                                        onChange={(e) => handleInputChange("senatorialDistrict", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="street">Street Address</Label>
                                      <Textarea
                                        id="street"
                                        value={editedUser.street || ""}
                                        onChange={(e) => handleInputChange("street", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-medium mb-4">Account Status</h3>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="role">Role</Label>
                                      <Select
                                        value={editedUser.role || ""}
                                        onChange={(value) => handleInputChange("role", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="artisan_user">Artisan User</SelectItem>
                                          <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                                          <SelectItem value="regular_user">Regular User</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="certifiedStatus">Certified Status</Label>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="certifiedStatus"
                                          checked={editedUser.certifiedStatus || false}
                                          onChange={(checked) => handleInputChange("certifiedStatus", checked)}
                                        />
                                        <label
                                          htmlFor="certifiedStatus"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          Certified
                                        </label>
                                      </div>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="licenseStatus">License Status</Label>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="licenseStatus"
                                          checked={editedUser.licenseStatus || false}
                                          onChange={(checked) => handleInputChange("licenseStatus", checked)}
                                        />
                                        <label
                                          htmlFor="licenseStatus"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          Licensed
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="bankAccountName">Account Name</Label>
                                      <Input
                                        id="bankAccountName"
                                        value={editedUser.bankAccount?.accountName || ""}
                                        onChange={(e) => handleInputChange("bankAccount.accountName", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                                      <Input
                                        id="bankAccountNumber"
                                        value={editedUser.bankAccount?.accountNumber || ""}
                                        onChange={(e) => handleInputChange("bankAccount.accountNumber", e.target.value)}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="bankName">Bank</Label>
                                      <Input
                                        id="bankName"
                                        value={editedUser.bankAccount?.bank || ""}
                                        onChange={(e) => handleInputChange("bankAccount.bank", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <SheetFooter className="pt-4">
                            {!editMode ? (
                              <div className="flex justify-between w-full">
                                <Button variant="outline" onClick={() => handleEditUser(selectedUser)}>
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <SheetClose asChild>
                                  <Button variant="secondary">Close</Button>
                                </SheetClose>
                              </div>
                            ) : (
                              <div className="flex justify-between w-full">
                                <Button variant="destructive" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} disabled={loading}>
                                  <Save className="h-4 w-4 mr-1" /> Save Changes
                                  {loading && <SewingPinFilledIcon className="animate-spin ml-1" />}
                                </Button>
                              </div>
                            )}
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {/* First Page */}
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Ellipsis after first */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Middle Pages */}
                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = currentPage + i - 1
                  return pageNumber > 1 && pageNumber < totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null
                })}

                {/* Ellipsis before last */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  )
}

export default UserManagement




// "use client"

// import { useEffect, useState } from "react"
// import axios from "axios"
// import DashboardPage from "@/components/layout/DashboardLayout"
// import ProtectedRoute from "@/components/ProtectedRoute"
// import Spinner from "@/components/layout/spinner"
// import { states } from "@/data/nigeria"
// import { toast } from "sonner"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { CSVLink } from "react-csv"
// import jsPDF from "jspdf"
// import "jspdf-autotable"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Cross1Icon, SewingPinFilledIcon } from "@radix-ui/react-icons"
// import useLogout from "@/pages/loginPage/logout"
// import { LogOut, Mail, PhoneCall, UserCircle, Edit, Eye, Save, X, Download, FileText } from "lucide-react"
// import { API_BASE_URL } from "@/config/env"
// import { Input } from "@/components/ui/input"
// import { useNavigate } from "react-router-dom"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"

// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// const useDebounce = ({ onChange, debounce = 500 }) => {
//   const [value, setValue] = useState("")

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange?.(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//   }, [value, debounce, onChange])

//   return { value, setValue }
// }

// const UserManagement = () => {
//   const logout = useLogout()
//   const navigate = useNavigate()
//   const [error, setError] = useState(null)

//   const [hasLoadedFirst, sethasLoadedFirst] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [editMode, setEditMode] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [editedUser, setEditedUser] = useState(null)
//   const [loadingCSV, setLoadingCSV] = useState(false)
//   const [csvData, setcsvData] = useState([])
//   const MAX_CSV_ROWS = 1000000

//   // Filter states
//   const [sectors, setSectors] = useState([
//     { _id: "construction", name: "Construction" },
//     { _id: "technology", name: "Technology" },
//     { _id: "agriculture", name: "Agriculture" },
//     { _id: "healthcare", name: "Healthcare" },
//   ])

//   const [tradeAreas, setTradeAreas] = useState([
//     { _id: "carpentry", name: "Carpentry", sectorId: "construction" },
//     { _id: "plumbing", name: "Plumbing", sectorId: "construction" },
//     { _id: "electrical", name: "Electrical", sectorId: "construction" },
//     { _id: "masonry", name: "Masonry", sectorId: "construction" },
//     { _id: "software", name: "Software Development", sectorId: "technology" },
//     { _id: "networking", name: "Networking", sectorId: "technology" },
//     { _id: "farming", name: "Farming", sectorId: "agriculture" },
//     { _id: "nursing", name: "Nursing", sectorId: "healthcare" },
//   ])

//   const [users, setUsers] = useState([])
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 0,
//     totalUsers: 0,
//     pageSize: 25,
//   })
//   const totalPages = pagination.totalPages

//   const itemsPerPage = 25

//   const defaultData = {
//     currentPage: 1,
//     search: "",
//     state: "",
//     lga: "",
//     sector: "",
//     tradeArea: "",
//     role: "",
//     fromDate: "",
//     toDate: "",
//     sort: "-createdAt",
//   }
//   const [filter, setFilter] = useState({
//     ...defaultData,
//   })

//   const handleFilterChange = (key, value) => {
//     // If the value is "all", set it to an empty string in the filter
//     const filterValue = value === "all" ? "" : value
//     setFilter((x) => ({ ...x, [key]: filterValue }))
//   }

//   const currentPage = filter?.currentPage

//   // Add pagination state handler
//   const handlePageChange = (page) => {
//     setFilter((x) => ({ ...x, currentPage: page }))
//   }

//   function replaceSymbolsWithSpace(str = "") {
//     const replacedStr = str.replace(/[-/]/g, " ")
//     return replacedStr.toLowerCase()
//   }

//   const selectedStateLGASResidence =
//     states.find((state) => replaceSymbolsWithSpace(`${state?.value}`) === replaceSymbolsWithSpace(`${filter?.state}`))
//       ?.lgas || []

//   const selectedStateLGASResidenceFormatted =
//     selectedStateLGASResidence && selectedStateLGASResidence?.length
//       ? selectedStateLGASResidence.map((x) => ({
//           label: x,
//           value: x,
//         }))
//       : []

//   const { value: searchv, setValue } = useDebounce({
//     debounce: 500,
//     onChange: (debouncedValue) => {
//       setFilter((x) => ({ ...x, search: debouncedValue }))
//     },
//   })

//   function formatUserToCSV(users) {
//     if (!Array.isArray(users) || users.length === 0) {
//       return []
//     }

//     const headerMapping = {
//       sn: "S/N",
//       fullName: "Full Name",
//       email: "Email",
//       phoneNumber: "Phone Number",
//       role: "Role",
//       stateOfResidence: "State of Residence",
//       lgaOfResidence: "LGA of Residence",
//       senatorialDistrict: "Senatorial District",
//       sectors: "Sectors",
//       tradeAreas: "Trade Areas",
//       createdAt: "Registration Date",
//     }

//     const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
//     const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

//     return [headers, ...rows]
//   }

//   const downloadCSV = async () => {
//     setLoadingCSV(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.get(`${API_BASE_URL}/userscert`, {
//         params: {
//           limit: MAX_CSV_ROWS,
//           page: 1,
//           search: filter?.search,
//           state: filter?.state,
//           lga: filter?.lga,
//           sector: filter?.sector,
//           tradeArea: filter?.tradeArea,
//           role: filter?.role,
//           fromDate: filter?.fromDate,
//           toDate: filter?.toDate,
//           sort: filter?.sort,
//         },
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })

//       const { data } = response.data
//       const formatted = formatUserToCSV(
//         (data?.users || []).map((x, i) => {
//           // Extract sector and trade area information
//           const sectors = x.priorSkillsCerts
//             ? x.priorSkillsCerts
//                 .map((cert) => cert.sector)
//                 .filter(Boolean)
//                 .join(", ")
//             : ""
//           const tradeAreas = x.priorSkillsCerts
//             ? x.priorSkillsCerts
//                 .map((cert) => cert.tradeArea)
//                 .filter(Boolean)
//                 .join(", ")
//             : ""

//           return {
//             sn: i + 1,
//             fullName: `${x?.firstName || ""} ${x?.lastName || ""}`,
//             email: x?.email || "",
//             phoneNumber: x?.phoneNumber || "",
//             role: x?.role || "",
//             stateOfResidence: x?.stateOfResidence || "",
//             lgaOfResidence: x?.lgaOfResidence || "",
//             senatorialDistrict: x?.senatorialDistrict || "",
//             sectors: sectors,
//             tradeAreas: tradeAreas,
//             createdAt: x?.createdAt ? new Date(x.createdAt).toLocaleDateString() : "",
//           }
//         }),
//       )
//       setcsvData(formatted)

//       toast.success(
//         "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
//       )
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       toast.error("Failed to generate CSV data")
//     } finally {
//       setLoadingCSV(false)
//     }
//   }

//   const downloadPDF = async () => {
//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.get(`${API_BASE_URL}/userscert`, {
//         params: {
//           limit: 1000, // Limit for PDF to avoid large files
//           page: 1,
//           search: filter?.search,
//           state: filter?.state,
//           lga: filter?.lga,
//           sector: filter?.sector,
//           tradeArea: filter?.tradeArea,
//           role: filter?.role,
//           fromDate: filter?.fromDate,
//           toDate: filter?.toDate,
//           sort: filter?.sort,
//         },
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })

//       const { data } = response.data
//       const users = data?.users || []

//       // Create PDF document
//       const doc = new jsPDF()
//       doc.setFontSize(18)
//       doc.text("User Management Report", 14, 22)
//       doc.setFontSize(11)
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

//       // Define table columns
//       const columns = [
//         { header: "S/N", dataKey: "sn" },
//         { header: "Name", dataKey: "name" },
//         { header: "Email", dataKey: "email" },
//         { header: "Phone", dataKey: "phone" },
//         { header: "Role", dataKey: "role" },
//         { header: "State", dataKey: "state" },
//         { header: "LGA", dataKey: "lga" },
//       ]

//       // Prepare data for table
//       const tableData = users.map((user, index) => ({
//         sn: index + 1,
//         name: `${user.firstName || ""} ${user.lastName || ""}`,
//         email: user.email || "",
//         phone: user.phoneNumber || "",
//         role: user.role || "",
//         state: user.stateOfResidence || "",
//         lga: user.lgaOfResidence || "",
//       }))

//       // Add table to PDF
//       doc.autoTable({
//         columns,
//         body: tableData,
//         startY: 40,
//         styles: { fontSize: 8, cellPadding: 2 },
//         headStyles: { fillColor: [66, 66, 66] },
//       })

//       // Add filter information
//       const filterInfo = []
//       if (filter.search) filterInfo.push(`Search: ${filter.search}`)
//       if (filter.state) filterInfo.push(`State: ${filter.state}`)
//       if (filter.lga) filterInfo.push(`LGA: ${filter.lga}`)
//       if (filter.role) filterInfo.push(`Role: ${filter.role}`)
//       if (filter.sector) filterInfo.push(`Sector: ${filter.sector}`)
//       if (filter.tradeArea) filterInfo.push(`Trade Area: ${filter.tradeArea}`)
//       if (filter.fromDate) filterInfo.push(`From: ${filter.fromDate}`)
//       if (filter.toDate) filterInfo.push(`To: ${filter.toDate}`)

//       if (filterInfo.length > 0) {
//         const finalY = doc.lastAutoTable.finalY || 40
//         doc.setFontSize(10)
//         doc.text("Filters Applied:", 14, finalY + 10)
//         doc.setFontSize(8)
//         filterInfo.forEach((info, index) => {
//           doc.text(info, 14, finalY + 15 + index * 5)
//         })
//       }

//       // Save the PDF
//       doc.save("user-management-report.pdf")
//       toast.success("PDF report has been generated and downloaded")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF report")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const clearFilter = () => {
//     setFilter(defaultData)
//     setValue("")
//     setcsvData([])
//   }

//   const fetchUsers = async () => {
//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.get(`${API_BASE_URL}/userscert`, {
//         params: {
//           limit: itemsPerPage,
//           page: filter?.currentPage,
//           search: filter?.search,
//           state: filter?.state,
//           lga: filter?.lga,
//           sector: filter?.sector,
//           tradeArea: filter?.tradeArea,
//           role: filter?.role,
//           fromDate: filter?.fromDate,
//           toDate: filter?.toDate,
//           sort: filter?.sort,
//         },
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })

//       if (response.data && response.data.success && response.data.data) {
//         const { users, pagination } = response.data.data
//         setUsers(users || [])
//         setPagination({
//           currentPage: pagination?.currentPage || 1,
//           totalPages: pagination?.totalPages || 1,
//           totalUsers: pagination?.totalUsers || 0,
//           pageSize: pagination?.pageSize || 25,
//         })
//       } else {
//         toast.error("Failed to fetch users data")
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       toast.error("Failed to fetch users")
//     } finally {
//       setLoading(false)
//       setcsvData([])
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [
//     filter?.search,
//     filter?.currentPage,
//     filter?.state,
//     filter?.lga,
//     filter?.sector,
//     filter?.tradeArea,
//     filter?.role,
//     filter?.fromDate,
//     filter?.toDate,
//   ])

//   const handleViewUser = (user) => {
//     setSelectedUser(user)
//     setEditMode(false)
//   }

//   const handleEditUser = (user) => {
//     setSelectedUser(user)
//     setEditedUser({ ...user })
//     setEditMode(true)
//   }

//   const handleInputChange = (field, value) => {
//     if (typeof field === "string" && field.includes(".")) {
//       // Handle nested fields like "bankAccount.accountName"
//       const [parent, child] = field.split(".")
//       setEditedUser((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }))
//     } else {
//       // Handle regular fields or when an object is passed directly
//       setEditedUser((prev) => ({
//         ...prev,
//         [field]: value,
//       }))
//     }
//   }

//   const handleSaveChanges = async () => {
//     try {
//       setLoading(true)
//       const accessToken = localStorage.getItem("accessToken")
//       await axios.patch(`${API_BASE_URL}/users/${editedUser._id}`, editedUser, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })

//       toast.success("User updated successfully")
//       fetchUsers()
//       setEditMode(false)
//       setSelectedUser(null)
//       setEditedUser(null)
//     } catch (error) {
//       console.error("Error updating user:", error)
//       toast.error("Failed to update user")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCancelEdit = () => {
//     setEditMode(false)
//     setEditedUser(null)
//   }

//   const handleSort = (field) => {
//     const currentSort = filter.sort
//     let newSort = `-${field}`

//     // If already sorting by this field, toggle direction
//     if (currentSort === `-${field}`) {
//       newSort = field
//     } else if (currentSort === field) {
//       newSort = `-${field}`
//     }

//     setFilter((prev) => ({ ...prev, sort: newSort }))
//   }

//   return (
//     <ProtectedRoute>
//       {loading && !hasLoadedFirst ? (
//         <div className="flex justify-center items-center h-screen ">
//           <Spinner />
//         </div>
//       ) : null}
//       <DashboardPage title="User Management">
//         <div className="container mx-auto py-6">
//           <header className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold">User Management</h1>
//               <p className="text-muted-foreground">View, edit and export user data</p>
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

//           <div className="bg-white p-6 rounded-lg shadow mb-6">
//             <h2 className="text-lg font-medium mb-4">Filters</h2>
//             <div className="flex gap-[20px] flex-wrap mb-4">
//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">Search</p>
//                 <Input
//                   className="text-[12px] placeholder:text-[12px]"
//                   placeholder="Name or email"
//                   value={searchv}
//                   onChange={(e) => setValue(e.target.value)}
//                 />
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">State</p>
//                 <Select value={filter?.state} onValueChange={(value) => handleFilterChange("state", value)}>
//                   <SelectTrigger className="text-[12px]">
//                     <SelectValue placeholder="Select State" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       {states.map((item) => {
//                         return (
//                           <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
//                             {item?.label}
//                           </SelectItem>
//                         )
//                       })}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">Local Government</p>
//                 <Select value={filter.lga} onValueChange={(value) => handleFilterChange("lga", value)}>
//                   <SelectTrigger className="text-[12px]">
//                     <SelectValue placeholder="Select LGA" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       {selectedStateLGASResidenceFormatted.map((item) => {
//                         return (
//                           <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
//                             {item?.label}
//                           </SelectItem>
//                         )
//                       })}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">Role</p>
//                 <Select value={filter?.role} onValueChange={(value) => handleFilterChange("role", value)}>
//                   <SelectTrigger className="text-[12px]">
//                     <SelectValue placeholder="Select Role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectItem className="text-[12px]" value="all">
//                         All Roles
//                       </SelectItem>
//                       <SelectItem className="text-[12px]" value="artisan_user">
//                         Artisan User
//                       </SelectItem>
//                       <SelectItem className="text-[12px]" value="intending_artisan">
//                         Intending Artisan
//                       </SelectItem>
//                       <SelectItem className="text-[12px]" value="regular_user">
//                         Regular User
//                       </SelectItem>
//                       <SelectItem className="text-[12px]" value="admin">
//                         Admin
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">Sector</p>
//                 <Select value={filter?.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
//                   <SelectTrigger className="text-[12px]">
//                     <SelectValue placeholder="Select Sector" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectItem className="text-[12px]" value="all">
//                         All Sectors
//                       </SelectItem>
//                       {sectors.map((sector) => (
//                         <SelectItem className="text-[12px]" key={sector._id} value={sector._id}>
//                           {sector.name}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">Trade Area</p>
//                 <Select value={filter.tradeArea} onValueChange={(value) => handleFilterChange("tradeArea", value)}>
//                   <SelectTrigger className="text-[12px]">
//                     <SelectValue placeholder="Select Trade Area" className="text-[12px]" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectItem className="text-[12px]" value="all">
//                         All Trade Areas
//                       </SelectItem>
//                       {tradeAreas
//                         .filter((ta) => !filter.sector || ta.sectorId === filter.sector)
//                         .map((ta) => (
//                           <SelectItem className="text-[12px]" key={ta._id} value={ta._id}>
//                             {ta.name}
//                           </SelectItem>
//                         ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="flex gap-[20px] flex-wrap mb-4">
//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">From Date</p>
//                 <Input
//                   type="date"
//                   className="text-[12px]"
//                   value={filter.fromDate}
//                   onChange={(e) => handleFilterChange("fromDate", e.target.value)}
//                 />
//               </div>

//               <div className="w-[200px]">
//                 <p className="text-left text-[14px] mb-1">To Date</p>
//                 <Input
//                   type="date"
//                   className="text-[12px]"
//                   value={filter.toDate}
//                   onChange={(e) => handleFilterChange("toDate", e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="w-full items-center justify-start flex gap-4">
//               <Button
//                 className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
//                 onClick={clearFilter}
//                 disabled={loading}
//               >
//                 Clear
//                 {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : <Cross1Icon className="ml-2" />}
//               </Button>
//             </div>
//           </div>

//           <div className="gap-2 flex justify-between w-full mt-4">
//             <h2 className="font-medium">Total Records Found: {pagination?.totalUsers || 0}</h2>
//             <div className="gap-2 flex flex-row-reverse justify-start mb-4">
//               <Button onClick={downloadPDF} className="ml-2" variant="outline" disabled={loading || !users?.length}>
//                 <FileText className="mr-2 h-4 w-4" /> Export PDF
//                 {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
//               </Button>

//               {!csvData?.length ? (
//                 <Button onClick={downloadCSV} variant="outline" disabled={loadingCSV || !users?.length}>
//                   <Download className="mr-2 h-4 w-4" /> Generate CSV
//                   {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
//                 </Button>
//               ) : (
//                 <CSVLink
//                   data={csvData}
//                   filename="user-management-report.csv"
//                   className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
//                   disabled={loadingCSV || !users?.length}
//                 >
//                   <Download className="mr-2 h-4 w-4" /> Download CSV
//                   {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
//                 </CSVLink>
//               )}
//             </div>
//           </div>

//           <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>S/N</TableHead>
//                 <TableHead className="cursor-pointer" onClick={() => handleSort("firstName")}>
//                   Name {filter.sort === "firstName" ? "↑" : filter.sort === "-firstName" ? "↓" : ""}
//                 </TableHead>
//                 <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
//                   Email {filter.sort === "email" ? "↑" : filter.sort === "-email" ? "↓" : ""}
//                 </TableHead>
//                 <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
//                   Role {filter.sort === "role" ? "↑" : filter.sort === "-role" ? "↓" : ""}
//                 </TableHead>
//                 <TableHead className="cursor-pointer" onClick={() => handleSort("stateOfResidence")}>
//                   State/LGA {filter.sort === "stateOfResidence" ? "↑" : filter.sort === "-stateOfResidence" ? "↓" : ""}
//                 </TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
//                   Registration Date {filter.sort === "createdAt" ? "↑" : filter.sort === "-createdAt" ? "↓" : ""}
//                 </TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user, index) => (
//                 <TableRow key={user._id || index}>
//                   <TableCell className="text-left text-[12px]">
//                     {index + 1 + (currentPage - 1) * itemsPerPage}
//                   </TableCell>
//                   <TableCell className="text-left max-w-[200px] text-[12px]">
//                     {`${user.firstName || ""} ${user.lastName || ""}`}
//                   </TableCell>
//                   <TableCell className="text-left text-[12px]">{user.email || ""}</TableCell>
//                   <TableCell className="text-left text-[12px]">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         user.role === "artisan_user"
//                           ? "bg-green-100 text-green-800"
//                           : user.role === "intending_artisan"
//                             ? "bg-blue-100 text-blue-800"
//                             : user.role === "admin"
//                               ? "bg-purple-100 text-purple-800"
//                               : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {user.role || ""}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <div className="flex flex-col">
//                         <span className="text-left text-[12px]">{user?.stateOfResidence || "---"}</span>
//                         <span className="text-left text-[10px]">{user?.lgaOfResidence || "---"}</span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <div className="flex flex-col">
//                         <div className="flex flex-row gap-1 items-center">
//                           <PhoneCall className="size-[14px]" />
//                           <span className="text-left text-[10px]">{user?.phoneNumber || "---"}</span>
//                         </div>

//                         <div className="flex flex-row gap-1 items-center">
//                           <Mail className="size-[14px]" />
//                           <span className="text-left text-[10px]">{user?.email || "---"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-left text-[12px]">
//                     {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "---"}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Sheet>
//                         <SheetTrigger asChild>
//                           <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
//                             <Eye className="h-4 w-4 mr-1" /> View
//                           </Button>
//                         </SheetTrigger>
//                         <SheetContent className="w-[400px] sm:w-[600px] md:w-[800px] overflow-y-auto">
//                           <SheetHeader>
//                             <SheetTitle>User Details</SheetTitle>
//                             <SheetDescription>View and manage user information</SheetDescription>
//                           </SheetHeader>

//                           {selectedUser && !editMode && (
//                             <div className="py-4">
//                               <div className="space-y-4">
//                                 <div>
//                                   <h3 className="text-lg font-semibold">{`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}</h3>
//                                   <p className="text-sm text-muted-foreground">
//                                     {selectedUser.role} • {selectedUser.email}
//                                   </p>
//                                 </div>

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Personal Information</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">First Name:</p>
//                                       <p>{selectedUser.firstName || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Last Name:</p>
//                                       <p>{selectedUser.lastName || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Middle Name:</p>
//                                       <p>{selectedUser.middleName || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Gender:</p>
//                                       <p>{selectedUser.gender || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Date of Birth:</p>
//                                       <p>{selectedUser.dob || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Marital Status:</p>
//                                       <p>{selectedUser.maritalStatus || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">NIN:</p>
//                                       <p>{selectedUser.nin || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Has Disability:</p>
//                                       <p>{selectedUser.hasDisability ? "Yes" : "No"}</p>
//                                     </div>
//                                     {selectedUser.hasDisability && (
//                                       <div>
//                                         <p className="font-medium">Disability Type:</p>
//                                         <p>{selectedUser.disabilityType || "---"}</p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Contact Information</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">Email:</p>
//                                       <p>{selectedUser.email || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Phone Number:</p>
//                                       <p>{selectedUser.phoneNumber || "---"}</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Location</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">State of Origin:</p>
//                                       <p>{selectedUser.stateOfOrigin || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">LGA of Origin:</p>
//                                       <p>{selectedUser.lga || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">State of Residence:</p>
//                                       <p>{selectedUser.stateOfResidence || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">LGA of Residence:</p>
//                                       <p>{selectedUser.lgaOfResidence || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Senatorial District:</p>
//                                       <p>{selectedUser.senatorialDistrict || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Street Address:</p>
//                                       <p>{selectedUser.street || "---"}</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Education</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">School:</p>
//                                       <p>{selectedUser.education?.school || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Highest Qualification:</p>
//                                       <p>{selectedUser.education?.highestQualification || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Graduation Year:</p>
//                                       <p>{selectedUser.education?.graduationYear || "---"}</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {selectedUser.priorSkillsCerts && selectedUser.priorSkillsCerts.length > 0 && (
//                                   <div className="grid gap-2">
//                                     <h4 className="font-medium">Skills & Certifications</h4>
//                                     {selectedUser.priorSkillsCerts.map((cert, index) => (
//                                       <div key={index} className="border p-2 rounded-md">
//                                         <div className="grid grid-cols-2 gap-2 text-sm">
//                                           <div>
//                                             <p className="font-medium">Sector:</p>
//                                             <p>{cert.sector || "---"}</p>
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">Trade Area:</p>
//                                             <p>{cert.tradeArea || "---"}</p>
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">Certificate Name:</p>
//                                             <p>{cert.name || "---"}</p>
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">Year:</p>
//                                             <p>{cert.year || "---"}</p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {selectedUser.experience && selectedUser.experience.length > 0 && (
//                                   <div className="grid gap-2">
//                                     <h4 className="font-medium">Experience</h4>
//                                     {selectedUser.experience.map((exp, index) => (
//                                       <div key={index} className="border p-2 rounded-md">
//                                         <div className="grid grid-cols-2 gap-2 text-sm">
//                                           <div>
//                                             <p className="font-medium">Project Title:</p>
//                                             <p>{exp.projectTitle || "---"}</p>
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">Date Range:</p>
//                                             <p>
//                                               {exp.dateFrom || "---"} to {exp.dateTo || "---"}
//                                             </p>
//                                           </div>
//                                           <div className="col-span-2">
//                                             <p className="font-medium">Description:</p>
//                                             <p>{exp.description || "---"}</p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Bank Information</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">Account Name:</p>
//                                       <p>{selectedUser.bankAccount?.accountName || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Account Number:</p>
//                                       <p>{selectedUser.bankAccount?.accountNumber || "---"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Bank:</p>
//                                       <p>{selectedUser.bankAccount?.bank || "---"}</p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                   <h4 className="font-medium">Account Status</h4>
//                                   <div className="grid grid-cols-2 gap-2 text-sm">
//                                     <div>
//                                       <p className="font-medium">Certified Status:</p>
//                                       <p>{selectedUser.certifiedStatus ? "Certified" : "Not Certified"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">License Status:</p>
//                                       <p>{selectedUser.licenseStatus ? "Licensed" : "Not Licensed"}</p>
//                                     </div>
//                                     <div>
//                                       <p className="font-medium">Registration Date:</p>
//                                       <p>
//                                         {selectedUser.createdAt
//                                           ? new Date(selectedUser.createdAt).toLocaleDateString()
//                                           : "---"}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {selectedUser && editMode && editedUser && (
//                             <div className="py-4">
//                               <div className="space-y-6">
//                                 <div className="border-b pb-4">
//                                   <h3 className="text-lg font-medium mb-4">Personal Information</h3>
//                                   <div className="grid gap-4 md:grid-cols-2">
//                                     <div className="grid gap-2">
//                                       <Label htmlFor="firstName">First Name</Label>
//                                       <Input
//                                         id="firstName"
//                                         value={editedUser.firstName || ""}
//                                         onChange={(e) => handleInputChange("firstName", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="lastName">Last Name</Label>
//                                       <Input
//                                         id="lastName"
//                                         value={editedUser.lastName || ""}
//                                         onChange={(e) => handleInputChange("lastName", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="middleName">Middle Name</Label>
//                                       <Input
//                                         id="middleName"
//                                         value={editedUser.middleName || ""}
//                                         onChange={(e) => handleInputChange("middleName", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="gender">Gender</Label>
//                                       <Select
//                                         value={editedUser.gender || ""}
//                                         onChange={(value) => handleInputChange("gender", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select Gender" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="male">Male</SelectItem>
//                                           <SelectItem value="female">Female</SelectItem>
//                                           <SelectItem value="other">Other</SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="dob">Date of Birth</Label>
//                                       <Input
//                                         id="dob"
//                                         type="date"
//                                         value={editedUser.dob || ""}
//                                         onChange={(e) => handleInputChange("dob", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="maritalStatus">Marital Status</Label>
//                                       <Select
//                                         value={editedUser.maritalStatus || ""}
//                                         onChange={(value) => handleInputChange("maritalStatus", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select Marital Status" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="single">Single</SelectItem>
//                                           <SelectItem value="married">Married</SelectItem>
//                                           <SelectItem value="divorced">Divorced</SelectItem>
//                                           <SelectItem value="widowed">Widowed</SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="nin">NIN</Label>
//                                       <Input
//                                         id="nin"
//                                         value={editedUser.nin || ""}
//                                         onChange={(e) => handleInputChange("nin", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="hasDisability">Has Disability</Label>
//                                       <div className="flex items-center space-x-2">
//                                         <Checkbox
//                                           id="hasDisability"
//                                           checked={editedUser.hasDisability || false}
//                                           onCheckedChange={(checked) => handleInputChange("hasDisability", checked)}
//                                         />
//                                         <label
//                                           htmlFor="hasDisability"
//                                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                         >
//                                           Yes
//                                         </label>
//                                       </div>
//                                     </div>

//                                     {editedUser.hasDisability && (
//                                       <div className="grid gap-2">
//                                         <Label htmlFor="disabilityType">Disability Type</Label>
//                                         <Input
//                                           id="disabilityType"
//                                           value={editedUser.disabilityType || ""}
//                                           onChange={(e) => handleInputChange("disabilityType", e.target.value)}
//                                         />
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <div className="border-b pb-4">
//                                   <h3 className="text-lg font-medium mb-4">Contact Information</h3>
//                                   <div className="grid gap-4 md:grid-cols-2">
//                                     <div className="grid gap-2">
//                                       <Label htmlFor="email">Email</Label>
//                                       <Input
//                                         id="email"
//                                         type="email"
//                                         value={editedUser.email || ""}
//                                         onChange={(e) => handleInputChange("email", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="phoneNumber">Phone Number</Label>
//                                       <Input
//                                         id="phoneNumber"
//                                         value={editedUser.phoneNumber || ""}
//                                         onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="profileImage">Profile Image URL</Label>
//                                       <Input
//                                         id="profileImage"
//                                         value={editedUser.profileImage || ""}
//                                         onChange={(e) => handleInputChange("profileImage", e.target.value)}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="border-b pb-4">
//                                   <h3 className="text-lg font-medium mb-4">Location</h3>
//                                   <div className="grid gap-4 md:grid-cols-2">
//                                     <div className="grid gap-2">
//                                       <Label htmlFor="stateOfOrigin">State of Origin</Label>
//                                       <Select
//                                         value={editedUser.stateOfOrigin || ""}
//                                         onChange={(value) => handleInputChange("stateOfOrigin", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select State" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectGroup>
//                                             {states.map((item) => (
//                                               <SelectItem value={item.value} key={item.value}>
//                                                 {item.label}
//                                               </SelectItem>
//                                             ))}
//                                           </SelectGroup>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="lga">LGA of Origin</Label>
//                                       <Select
//                                         value={editedUser.lga || ""}
//                                         onChange={(value) => handleInputChange("lga", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select LGA" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectGroup>
//                                             {states
//                                               .find((state) => state.value === editedUser.stateOfOrigin)
//                                               ?.lgas.map((lga) => (
//                                                 <SelectItem value={lga} key={lga}>
//                                                   {lga}
//                                                 </SelectItem>
//                                               ))}
//                                           </SelectGroup>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="stateOfResidence">State of Residence</Label>
//                                       <Select
//                                         value={editedUser.stateOfResidence || ""}
//                                         onChange={(value) => handleInputChange("stateOfResidence", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select State" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectGroup>
//                                             {states.map((item) => (
//                                               <SelectItem value={item.value} key={item.value}>
//                                                 {item.label}
//                                               </SelectItem>
//                                             ))}
//                                           </SelectGroup>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
//                                       <Select
//                                         value={editedUser.lgaOfResidence || ""}
//                                         onChange={(value) => handleInputChange("lgaOfResidence", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select LGA" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectGroup>
//                                             {states
//                                               .find((state) => state.value === editedUser.stateOfResidence)
//                                               ?.lgas.map((lga) => (
//                                                 <SelectItem value={lga} key={lga}>
//                                                   {lga}
//                                                 </SelectItem>
//                                               ))}
//                                           </SelectGroup>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="senatorialDistrict">Senatorial District</Label>
//                                       <Input
//                                         id="senatorialDistrict"
//                                         value={editedUser.senatorialDistrict || ""}
//                                         onChange={(e) => handleInputChange("senatorialDistrict", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="street">Street Address</Label>
//                                       <Textarea
//                                         id="street"
//                                         value={editedUser.street || ""}
//                                         onChange={(e) => handleInputChange("street", e.target.value)}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="border-b pb-4">
//                                   <h3 className="text-lg font-medium mb-4">Account Status</h3>
//                                   <div className="grid gap-4 md:grid-cols-2">
//                                     <div className="grid gap-2">
//                                       <Label htmlFor="role">Role</Label>
//                                       <Select
//                                         value={editedUser.role || ""}
//                                         onChange={(value) => handleInputChange("role", value)}
//                                       >
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select Role" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="artisan_user">Artisan User</SelectItem>
//                                           <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
//                                           <SelectItem value="regular_user">Regular User</SelectItem>
//                                           <SelectItem value="admin">Admin</SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="certifiedStatus">Certified Status</Label>
//                                       <div className="flex items-center space-x-2">
//                                         <Checkbox
//                                           id="certifiedStatus"
//                                           checked={editedUser.certifiedStatus || false}
//                                           onCheckedChange={(checked) => handleInputChange("certifiedStatus", checked)}
//                                         />
//                                         <label
//                                           htmlFor="certifiedStatus"
//                                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                         >
//                                           Certified
//                                         </label>
//                                       </div>
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="licenseStatus">License Status</Label>
//                                       <div className="flex items-center space-x-2">
//                                         <Checkbox
//                                           id="licenseStatus"
//                                           checked={editedUser.licenseStatus || false}
//                                           onCheckedChange={(checked) => handleInputChange("licenseStatus", checked)}
//                                         />
//                                         <label
//                                           htmlFor="licenseStatus"
//                                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                         >
//                                           Licensed
//                                         </label>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="border-b pb-4">
//                                   <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
//                                   <div className="grid gap-4 md:grid-cols-2">
//                                     <div className="grid gap-2">
//                                       <Label htmlFor="bankAccountName">Account Name</Label>
//                                       <Input
//                                         id="bankAccountName"
//                                         value={editedUser.bankAccount?.accountName || ""}
//                                         onChange={(e) => handleInputChange("bankAccount.accountName", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="bankAccountNumber">Account Number</Label>
//                                       <Input
//                                         id="bankAccountNumber"
//                                         value={editedUser.bankAccount?.accountNumber || ""}
//                                         onChange={(e) => handleInputChange("bankAccount.accountNumber", e.target.value)}
//                                       />
//                                     </div>

//                                     <div className="grid gap-2">
//                                       <Label htmlFor="bankName">Bank</Label>
//                                       <Input
//                                         id="bankName"
//                                         value={editedUser.bankAccount?.bank || ""}
//                                         onChange={(e) => handleInputChange("bankAccount.bank", e.target.value)}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           <SheetFooter className="pt-4">
//                             {!editMode ? (
//                               <div className="flex justify-between w-full">
//                                 <Button variant="outline" onClick={() => handleEditUser(selectedUser)}>
//                                   <Edit className="h-4 w-4 mr-1" /> Edit
//                                 </Button>
//                                 <SheetClose asChild>
//                                   <Button variant="secondary">Close</Button>
//                                 </SheetClose>
//                               </div>
//                             ) : (
//                               <div className="flex justify-between w-full">
//                                 <Button variant="destructive" onClick={handleCancelEdit}>
//                                   <X className="h-4 w-4 mr-1" /> Cancel
//                                 </Button>
//                                 <Button onClick={handleSaveChanges} disabled={loading}>
//                                   <Save className="h-4 w-4 mr-1" /> Save Changes
//                                   {loading && <SewingPinFilledIcon className="animate-spin ml-1" />}
//                                 </Button>
//                               </div>
//                             )}
//                           </SheetFooter>
//                         </SheetContent>
//                       </Sheet>

//                       <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
//                         <Edit className="h-4 w-4 mr-1" /> Edit
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <div className="mt-4">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                   />
//                 </PaginationItem>

//                 {/* First Page */}
//                 <PaginationItem>
//                   <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
//                     1
//                   </PaginationLink>
//                 </PaginationItem>

//                 {/* Ellipsis after first */}
//                 {currentPage > 3 && (
//                   <PaginationItem>
//                     <PaginationLink disabled>...</PaginationLink>
//                   </PaginationItem>
//                 )}

//                 {/* Middle Pages */}
//                 {Array.from({ length: 3 }, (_, i) => {
//                   const pageNumber = currentPage + i - 1
//                   return pageNumber > 1 && pageNumber < totalPages ? (
//                     <PaginationItem key={pageNumber}>
//                       <PaginationLink
//                         isActive={pageNumber === currentPage}
//                         onClick={() => handlePageChange(pageNumber)}
//                       >
//                         {pageNumber}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ) : null
//                 })}

//                 {/* Ellipsis before last */}
//                 {currentPage < totalPages - 2 && (
//                   <PaginationItem>
//                     <PaginationLink disabled>...</PaginationLink>
//                   </PaginationItem>
//                 )}

//                 {/* Last Page */}
//                 {totalPages > 1 && (
//                   <PaginationItem>
//                     <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
//                       {totalPages}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )}

//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   )
// }

// export default UserManagement

