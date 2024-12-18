import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { LogOut, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import { API_BASE_URL } from "@/config/env";

function Trainingtable() {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const [userRole, setUserRole] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserRole();
    fetchTrainingGroups();
  }, [accessToken]);

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
      console.error("Error fetching user role 3:", error);
    }
  };

  const fetchTrainingGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Fetched training groups: ", response.data);
      setTrainingGroups(response.data);
    } catch (error) {
      console.error("Error fetching training groups:", error);
    }
  };

  // Filter training groups based on the logged-in user's training center
  const filteredTrainingGroups = trainingGroups.filter(
    (group) => group.trainingCenter._id === userId
  );

  // Sort by start time in descending order and take the 5 most recent
  const sortedGroups = filteredTrainingGroups.sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );
  const recentGroups = sortedGroups.slice(0, 5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recentGroups.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  {group.users.length}
                  {/* <ul>
                    {group.users.map((user) => (
                      <li key={user._id} className="flex items-center justify-between mb-2">
                        <span>{user.firstName} {user.lastName}</span>
                      </li>
                    ))}
                  </ul> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      {userRole === "training_center" ? (
        TrainingCenterView()
      ) : (
        <p>No data available or user role is not training center.</p>
      )}
    </div>
  );
}

export default Trainingtable;
