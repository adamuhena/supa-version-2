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
import Spinner from '@/components/layout/spinner';

// Constants

const UserCertification = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // State Management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBioDataDialogOpen, setIsBioDataDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

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
  const handlePageChange = (page) => {
    if (page > 0 && page <= (pagination?.totalPages || 1)) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
      // Fetch the new page of data
      fetchUsers(page);
    }
  };

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
          fromDate,
          toDate, 
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

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // Adjust the debounce delay as needed
    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [pagination.currentPage, pagination.pageSize, filters, fromDate, toDate]);




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
            <div className="filters">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From Date"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To Date"
            />
            <Button onClick={fetchUsers}>Apply Filters</Button>
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
