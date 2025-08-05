"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Edit, Key, Printer, Trash2, UserPlus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useLogout from "@/pages/loginPage/logout";
import { LogOut, UserCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/env";

const ITEMS_PER_PAGE = 25;

const UserManagement = () => {
  const logout = useLogout();
  // const navigate = useRouter()

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalUsers: 0,
    pageSize: 50,
  });
  const itemsPerPage = 50;

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    nin: "",
    role: "",
  });

  const [editUser, setEditUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(search);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setCurrentUserRole(userRole);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchUsers = useCallback(
    async (page = 1, limit = 50, role = "", searchQuery = "") => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/usersmgt`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page,
            limit,
            role: role || undefined,
            search: searchQuery || undefined,
          },
        });

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data.users)
        ) {
          setUsers(response.data.data.users);
          setPagination({
            totalPages: response.data.data.pagination?.totalPages || 1,
            totalUsers: response.data.data.pagination?.totalUsers || 0,
            pageSize: response.data.data.pagination?.pageSize || limit,
          });

          // Only show toast on initial load or errors
          if (page === 1 && !role && !searchQuery) {
            toast.success("Users loaded successfully");
          }
        } else {
          toast.error("No users found or invalid response structure");
        }
      } catch (error) {
        toast.error("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update effect to use proper dependencies
  useEffect(() => {
    fetchUsers(currentPage, pagination.pageSize, roleFilter, searchQuery);
  }, [currentPage, pagination.pageSize, roleFilter, searchQuery, fetchUsers]);

  // useEffect(() => {
  //   fetchUsers(currentPage, pagination.pageSize, roleFilter, searchQuery);
  // }, [currentPage, roleFilter, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, pagination.pageSize, roleFilter, search);
  };
  const totalPages = Math.ceil(pagination.totalUsers / pagination.pageSize);

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
  };

  const handleRoleChange = (value, setStateFunction) => {
    setStateFunction((prevState) => ({
      ...prevState,
      role: value,
    }));
  };

  const handleDelete = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("User deleted successfully");
      fetchUsers(currentPage, pagination.pageSize, roleFilter, search);
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e, setStateFunction) => {
    const { name, value } = e.target;
    setStateFunction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${API_BASE_URL}/create`, newUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        setUsers((prevUsers) => [...prevUsers, response.data.data]);
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          nin: "",
          role: "",
        });
        setIsCreateDialogOpen(false);
        toast.success("User Created Successfully");
      }
    } catch (error) {
      toast.error("Error creating user");
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const updateData = { ...editUser };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const response = await axios.put(
        `${API_BASE_URL}/update/${editUser._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? response.data.data : user
          )
        );
        toast.success("User Updated Successfully");
        setIsEditDialogOpen(false);
        setNewPassword("");
      }
    } catch (error) {
      toast.error("Error updating user");
      console.error("Error updating user:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `${API_BASE_URL}/users/${editUser._id}/change-password`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Password changed successfully.");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };

  // CSV Data
  const csvData = useMemo(() => {
    if (!users?.length) return [];
    const headers = ["SN", "Full Name", "Role", "Email", "Phone Number", "NIN"];
    const rows = users.map((user, index) => [
      index + 1,
      `${user.firstName} ${user.lastName}`,
      user.role,
      user.email,
      user.phoneNumber,
      user.nin,
    ]);
    return [headers, ...rows];
  }, [users]);

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const headers = ["SN", "Full Name", "Role", "Email", "Phone Number", "NIN"];
    const data = users.map((user, index) => [
      index + 1,
      `${user.firstName} ${user.lastName}`,
      user.role,
      user.email,
      user.phoneNumber,
      user.nin,
    ]);

    doc.setFontSize(16);
    doc.text("User Management Report", 20, 15);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 50,
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Generated by: ITF SUPA`, 10, doc.internal.pageSize.height - 10);
      doc.text(
        `Date: ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.width - 50,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("User_Management_Report.pdf");
  };

  return (
    <ProtectedRoute>
      {/* <DashboardPage title="User Management"> */}
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
            <h2 className="text-left font-[700] text-[14px]">
              (USERS & ADMINISTRATORS)
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

        <div className="flex gap-2">
          <CSVLink data={csvData} filename="user_management_report.csv">
            <Button className="bg-gray-900 text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" /> Print CSV
            </Button>
          </CSVLink>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={generatePDF}
          >
            <Printer className="mr-2 h-4 w-4" /> Print PDF
          </Button>
        </div>

        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearchChange}
          />
          <Select onValueChange={handleRoleFilter} value={roleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {/* <SelectItem value="superadmin">Super Admin</SelectItem> */}
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="artisan_user">Artisan User</SelectItem>
              <SelectItem value="intending_artisan">
                Intending Artisan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User List
            </h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" /> Create New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new user. Click save when
                    you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      onValueChange={(value) =>
                        handleRoleChange(value, setNewUser)
                      }
                      value={newUser.role}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="superadmin">Super Admin</SelectItem> */}
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="artisan_user">
                          Artisan User
                        </SelectItem>
                        <SelectItem value="intending_artisan">
                          Intending Artisan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                      required
                    />
                  </div>
                  {/* Show NIN field only if role is not admin or superadmin */}
                  {newUser.role !== "admin" &&
                    newUser.role !== "superadmin" && (
                      <div className="space-y-2">
                        <Label htmlFor="nin">NIN</Label>
                        <Input
                          id="nin"
                          name="nin"
                          value={newUser.nin}
                          onChange={(e) => handleInputChange(e, setNewUser)}
                          required
                        />
                      </div>
                    )}
                  {/* <div className="space-y-2">
                    <Label htmlFor="nin">NIN</Label>
                    <Input
                      id="nin"
                      name="nin"
                      value={newUser.nin}
                      onChange={(e) => handleInputChange(e, setNewUser)}
                      required
                    />
                  </div> */}
                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.phoneNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === "superadmin" || user.role === "admin" } // Disable for admin roles
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                        {currentUserRole === "supersuperadmin" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {/* First Page */}
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* First Ellipsis */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Page Numbers */}
                {Array.from({ length: 3 }, (_, i) => {
                  const pageNum = currentPage - 1 + i;
                  if (pageNum > 1 && pageNum < totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {/* Last Ellipsis */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={currentPage === totalPages}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details or change password. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select
                  onValueChange={(value) =>
                    handleRoleChange(value, setEditUser)
                  }
                  value={editUser.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="superadmin">Super Admin</SelectItem> */}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artisan_user">Artisan User</SelectItem>
                    <SelectItem value="intending_artisan">
                      Intending Artisan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    name="firstName"
                    value={editUser.firstName}
                    onChange={(e) => handleInputChange(e, setEditUser)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    name="lastName"
                    value={editUser.lastName}
                    onChange={(e) => handleInputChange(e, setEditUser)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  name="email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => handleInputChange(e, setEditUser)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                <Input
                  id="editPhoneNumber"
                  name="phoneNumber"
                  value={editUser.phoneNumber}
                  onChange={(e) => handleInputChange(e, setEditUser)}
                  required
                />
              </div>
              {/* Show NIN field only if role is not admin or superadmin */}
              {editUser.role !== "admin" && editUser.role !== "superadmin" && (
                <div className="space-y-2">
                  <Label htmlFor="editNin">NIN</Label>
                  <Input
                    id="editNin"
                    name="nin"
                    value={editUser.nin}
                    onChange={(e) => handleInputChange(e, setEditUser)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="editPassword">New Password</Label>
                <Input
                  id="editPassword"
                  name="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-between">
                <Button type="submit" className="w-1/2 mr-2">
                  Update User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 ml-2"
                  onClick={handleChangePassword}
                >
                  <Key className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
};

export default UserManagement;
