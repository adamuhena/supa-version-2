import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, LogOut } from "lucide-react";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from "@/pages/loginPage/logout";
import { API_BASE_URL } from "@/config/env";

function TrainingCenterGroup() {
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState("");
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1, limit = 25) => {
    setIsLoading(true);
    try {
      const [usersRes, trainingCentersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/userscert`, {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
        axios.get(`${API_BASE_URL}/pagetraining-centers`, {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
      ]);


      setUsers(usersRes.data.data.users || []);
      setTrainingCenters(trainingCentersRes.data.data.trainingCenters || []);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (!selectedTrainingCenter) {
      setError("Please select a training center");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please select at least one user");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Create the new group and assign the users
      await axios.post(
        `${API_BASE_URL}/training-groups`,
        {
          name: groupName,
          trainingCenterId: selectedTrainingCenter,
          userIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Reset form
      setGroupName("");
      setSelectedUsers([]);
      setSelectedTrainingCenter("");
      fetchData(); // Refresh data
    } catch (err) {
      setError("Failed to create group");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) => !selectedUsers.includes(user._id)
  );

  return (
    <ProtectedRoute>
      {/* <DashboardPage title="Artisan Dashboard"> */}
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          {error && <p className="text-red-500">{error}</p>}

          <Card className="p-4 rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="groupName">Group Name</label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label htmlFor="trainingCenter">Select Training Center</label>
                  <select
                    id="trainingCenter"
                    value={selectedTrainingCenter}
                    onChange={(e) => setSelectedTrainingCenter(e.target.value)}
                    className="select select-bordered w-full">
                    <option value="">Select Training Center</option>
                    {trainingCenters.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="users">Select Users</label>
                  <select
                    id="users"
                    multiple
                    value={selectedUsers}
                    onChange={(e) =>
                      setSelectedUsers(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    className="select select-bordered w-full">
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleCreateGroup}
                  className="mt-4"
                  isLoading={isLoading}>
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
}

export default TrainingCenterGroup;
