import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui//button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui//card";
import { Input } from "@/components/ui//input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui//table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { LogOut, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import { API_BASE_URL } from "@/config/env";

function TrainingStatus() {
  const logout = useLogout();
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const [userRole, setUserRole] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ name: "", year: "" });
  const [newGroup, setNewGroup] = useState({
    name: "",
    period: "",
    trainingCenter: "",
    startTime: "",
    endTime: "",
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [evaluation, setEvaluation] = useState({ score: "", comments: "" });
  const [usersOptions, setUsersOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserRole();
    fetchTrainingGroups();
    fetchUsers();
    fetchTrainingCenters();
    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    const options = users.map((user) => ({
      value: user._id,
      // label: `${user.firstName} ${user.lastName}` + ` - Location: state: ${user.stateOfResidence} - LGA: ${user.lgaOfResidence}`,
      label: (
        <span>
          {user.firstName} {user.lastName} -<b>Location: </b>-<b>State: </b>{" "}
          {user.stateOfResidence}-<b>LGA: </b>
          {user.lgaOfResidence}
        </span>
      ),
    }));
    setUsersOptions(options);
    console.log("Updated users options:", options); // Add this line
  }, [users]);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training-center/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("user role", response.data.data);
      setUserRole(response.data.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  console.log("user role u", userRole);

  const fetchTrainingGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("igot here: ", response.data);
      const filteredTrainingGroups = trainingGroups.filter(
        (group) => group.trainingCenter._id === userId
      );
      console.log("logged user group data ", filteredTrainingGroups, userId);
      setTrainingGroups(response.data);
    } catch (error) {
      console.error("Error fetching training groups:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training-center/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // If data is not an array, fall back to an empty array
      const usersData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUsers(usersData);
      console.log("Fetched users:", usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Fallback to empty array if there's an error
    }
  };

  const fetchTrainingCenters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTrainingCenters(response.data.data);
    } catch (error) {
      console.error("Error fetching training centers:", error);
    }
  };

  const TrainingCenterView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Training Trade Area Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((group, index) => (
              <TableRow key={group._id}>
                <TableCell>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  {group.period
                    ? `${group.period.name} - ${group.period.year}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(group.startTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(group.endTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <ul>
                    {group.users.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center justify-between mb-2">
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Assuming loggedInUser contains the user data and their associated training center ID
  const loggedInTrainingCenterId = userId;

  // Filter the training groups that belong to the logged-in user's training center
  const filteredTrainingGroups = trainingGroups.filter(
    (group) => group.trainingCenter._id === loggedInTrainingCenterId
  );
  console.log("filterd center: ", filteredTrainingGroups);

  const renderTrainingCenterView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Training Trade Area Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((group, index) => (
              <TableRow key={group._id}>
                <TableCell>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  {group.period
                    ? `${group.period.name} - ${group.period.year}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(group.startTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(group.endTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <ul>
                    {group.users.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center justify-between mb-2">
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Score"
                            min="0"
                            max="100"
                            value={evaluation.score}
                            onChange={(e) =>
                              setEvaluation({
                                ...evaluation,
                                score: e.target.value,
                              })
                            }
                            className="w-20"
                          />
                          <Input
                            type="text"
                            placeholder="Comments"
                            value={evaluation.comments}
                            onChange={(e) =>
                              setEvaluation({
                                ...evaluation,
                                comments: e.target.value,
                              })
                            }
                            className="w-40"
                          />
                          <Button
                            onClick={() =>
                              handleEvaluateUser(group._id, user._id)
                            }
                            size="sm">
                            Evaluate
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
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
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainingGroups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTrainingGroups.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ProtectedRoute href="/admin/dashboard">
      <TrainingDashboardPage>
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
          {userRole === "training_center" ? (
            renderTrainingCenterView()
          ) : (
            <p>No data available or user role is not training center.</p>
          )}
        </div>
      </TrainingDashboardPage>
    </ProtectedRoute>
  );
}

export default TrainingStatus;
