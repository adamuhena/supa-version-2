// export default ArtisanDashboard

import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { Edit, LogOut, Trash2, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/env";

const UserManagement = () => {
  const logout = useLogout();

  const [users, setUsers] = useState([]); // Holds user data
  const navigate = useNavigate();

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          setUsers(response.data.data); // Assume data is an array of users
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle edit action
  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // Redirect to edit user page
  };

  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="mt-6">
            <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>User List</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">
                        First Name
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Last Name
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Role
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        NIN
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Email
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Phone Number
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">
                          {user.firstName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.lastName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.role}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.nin}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.email}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {user.phoneNumber}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user.id)}>
                              <Edit className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user.id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default UserManagement;
