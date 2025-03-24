import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, LogOut } from "lucide-react";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from "@/pages/loginPage/logout";
import { Filter } from "lucide-react";
import Spinner from "@/components/layout/spinner";
import { API_BASE_URL } from "@/config/env";

function TrainingCenterGroupRe() {
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLga, setSelectedLga] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, trainingCentersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
        axios.get(`${API_BASE_URL}/training-centers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
      ]);
      setUsers(usersRes.data.data || []);
      setTrainingCenters(trainingCentersRes.data.data || []);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUsers = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
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
      setSelectedUsers([]);
      setSelectedTrainingCenter("");
      setGroupName("");
      fetchData(); // Refresh data
    } catch (err) {
      setError("Failed to assign users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassignUser = async (userId, newGroupId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/update-user-group`,
        {
          userId,
          newGroupId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchData(); // Refresh data
    } catch (err) {
      setError("Failed to reassign user");
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (!selectedRole || user.role === selectedRole) &&
      (!selectedState || user.stateOfResidence === selectedState) &&
      (!selectedLga || user.lgaOfResidence === selectedLga)
  );

  const filteredTrainingCenters = trainingCenters.filter(
    (center) =>
      (!selectedState || center.state === selectedState) &&
      (!selectedLga || center.lga === selectedLga)
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
          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="filters mb-4 grid grid-cols-3 gap-4">
                <Filter
                  label="Role"
                  value={selectedRole}
                  onChange={(value) => setSelectedRole(value)}
                  options={[
                    { label: "All Roles", value: "" },
                    { label: "Artisan", value: "artisan_user" },
                    { label: "Intending Artisan", value: "intending_artisan" },
                  ]}
                />
                <Filter
                  label="State"
                  value={selectedState}
                  onChange={(value) => setSelectedState(value)}
                  options={[
                    { label: "All States", value: "" },
                    ...Array.from(
                      new Set(users.map((user) => user.stateOfResidence))
                    ).map((state) => ({ label: state, value: state })),
                  ]}
                />
                <Filter
                  label="LGA"
                  value={selectedLga}
                  onChange={(value) => setSelectedLga(value)}
                  options={[
                    { label: "All LGAs", value: "" },
                    ...Array.from(
                      new Set(
                        users
                          .filter(
                            (user) =>
                              !selectedState ||
                              user.stateOfResidence === selectedState
                          )
                          .map((user) => user.lgaOfResidence)
                      )
                    ).map((lga) => ({ label: lga, value: lga })),
                  ]}
                />
              </div>

              <Card className="p-4 rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle>User List</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <li key={user._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`user-${user._id}`}
                            checked={selectedUsers.includes(user._id)}
                            onChange={() =>
                              setSelectedUsers((prev) =>
                                prev.includes(user._id)
                                  ? prev.filter((id) => id !== user._id)
                                  : [...prev, user._id]
                              )
                            }
                          />
                          <span>
                            {user.firstName} {user.lastName}
                          </span>
                          <span>
                            {user.trainingGroups[0]?.name ||
                              "No group assigned"}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleReassignUser(user._id, "newGroupId")
                            }>
                            Reassign Group
                          </Button>
                        </li>
                      ))
                    ) : (
                      <p>No users found</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
}

export default TrainingCenterGroupRe;
