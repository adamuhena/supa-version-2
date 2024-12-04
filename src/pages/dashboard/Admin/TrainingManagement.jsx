import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui//button"
import { Input } from "@/components/ui//input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui//select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui//table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui//card"
import MultiSelect from "./ui/multi-select"
import {toast} from 'sonner'
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/components/layout/DashboardLayout';
import { UserCircle, Settings, LogOut } from "lucide-react";
import useLogout from '@/pages/loginPage/logout';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


const EnhancedTrainingManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const logout = useLogout();
  const accessToken = localStorage.getItem("accessToken");
  const [userRole, setUserRole] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ name: '', year: '' });
  const [newGroup, setNewGroup] = useState({
    name: '',
    period: '',
    trainingCenter: '',
    startTime: '',
    endTime: '',
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [evaluation, setEvaluation] = useState({ score: '', comments: '' });
  const [usersOptions, setUsersOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserRole();
    fetchPeriods();
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
          {user.firstName} {user.lastName} - 
          <b>Location: </b>- 
          <b>State: </b> {user.stateOfResidence}- 
          <b>LGA: </b>{user.lgaOfResidence}
        </span>
      ),
    }));
    setUsersOptions(options);
    console.log('Updated users options:', options); // Add this line
  }, [users]);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/periods`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPeriods(response.data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const fetchTrainingGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTrainingGroups(response.data);
    } catch (error) {
      console.error('Error fetching training groups:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      // If data is not an array, fall back to an empty array
      const usersData = Array.isArray(response.data.data) ? response.data.data : [];
      setUsers(usersData);
      console.log('Fetched users:', usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      console.error('Error fetching training centers:', error);
    }
  };

  const handleCreatePeriod = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/periods`, newPeriod, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNewPeriod({ name: '', year: '' });
      fetchPeriods();
    } catch (error) {
      console.error('Error creating period:', error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/training-groups`, newGroup, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNewGroup({
        name: '',
        period: '',
        trainingCenter: '',
        startTime: '',
        endTime: '',
      });
      fetchTrainingGroups();
    } catch (error) {
      console.error('Error creating training group:', error);
    }
  };

  const handleAssignUsers = async () => {
    if (!selectedGroup || selectedUsers.length === 0) return;
    try {
      await axios.post(`${API_BASE_URL}/training-groups/${selectedGroup}/assign-multiple`, { userIds: selectedUsers }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success(response.data.message);
      fetchTrainingGroups();
      setSelectedUsers([]);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message); // Display the backend error message
      } else {
        console.error('Error assigning users to group:', error);
      }
      
    }
  };

  const handleRemoveUser = async (groupId, userId) => {
    try {
      await axios.post(`${API_BASE_URL}/training-groups/${groupId}/remove`, { userId }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchTrainingGroups();
    } catch (error) {
      console.error('Error removing user from group:', error);
    }
  };

  const handleEvaluateUser = async (groupId, userId) => {
    try {
      await axios.post(`${API_BASE_URL}/training-groups/${groupId}/evaluate/${userId}`, evaluation, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEvaluation({ score: '', comments: '' });
      fetchTrainingGroups();
    } catch (error) {
      console.error('Error evaluating user:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trainingGroups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(trainingGroups.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderAdminView = () => (
    <div className="space-y-8">
      <div className='flex flex-row gap-4'>
        <div className="w-1/2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Period</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePeriod} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Period Name"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={newPeriod.year}
                  onChange={(e) => setNewPeriod({ ...newPeriod, year: e.target.value })}
                />
                <Button type="submit">Create Period</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Trainee to Trade Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              <Select
                  value={selectedGroup}
                  onValueChange={setSelectedGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trade Area Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingGroups.map((group) => (
                      <SelectItem key={group._id} value={group._id}>
                        {group.name} - 
                        <b>Training Center: </b> {group.trainingCenter.trainingCentreName} - 
                        <b>State: </b> {group.trainingCenter.state} -
                        <b>LGA: </b> {group.trainingCenter.lga}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <MultiSelect
                  options={usersOptions}
                  selected={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Select Trainee"
                />
                <Button onClick={handleAssignUsers}>Assign to Trade Area</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='w-1/2'>
          <Card>
            <CardHeader>
              <CardTitle>Create Trade Area Group</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Trade Area Group Name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
                <Select
                  value={newGroup.period}
                  onValueChange={(value) => setNewGroup({ ...newGroup, period: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period._id} value={period._id}>
                        {period.name} - {period.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newGroup.trainingCenter}
                  onValueChange={(value) => setNewGroup({ ...newGroup, trainingCenter: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Training Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingCenters.map((center) => (
                      <SelectItem key={center._id} value={center._id}>
                        {center.trainingCentreName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="datetime-local"
                  value={newGroup.startTime}
                  onChange={(e) => setNewGroup({ ...newGroup, startTime: e.target.value })}
                />
                <Input
                  type="datetime-local"
                  value={newGroup.endTime}
                  onChange={(e) => setNewGroup({ ...newGroup, endTime: e.target.value })}
                />
                <Button type="submit">Create Trade Area Group</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div>
        <Card>
          <CardHeader>
            <CardTitle>All Training Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Training Center</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingGroups.map((group) => (
                  <TableRow key={group._id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.period?.name} - {group.period?.year}</TableCell>
                    <TableCell>{group.trainingCenter?.trainingCentreName}</TableCell>
                    <TableCell>{new Date(group.startTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(group.endTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <ul>
                        {group.users.map((user) => (
                          <li key={user._id} className="flex items-center justify-between">
                            <span>{user.firstName} {user.lastName}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveUser(group._id, user._id)}
                            >
                              Remove
                            </Button>
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

      </div> */}

<div>
    <Card>
      <CardHeader>
        <CardTitle>All Training Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Trade Area</TableHead>
              <TableHead>Training Period</TableHead>
              <TableHead>Training Center</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((group, index) => (
              <TableRow key={group._id}>
                <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.period?.name} - {group.period?.year}</TableCell>
                <TableCell>{group.trainingCenter?.trainingCentreName}</TableCell>
                <TableCell>{new Date(group.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(group.endTime).toLocaleString()}</TableCell>
                <TableCell>
                  <ul>
                    {group.users.map((user) => (
                      <li key={user._id} className="flex items-center justify-between">
                        <span>{user.firstName} {user.lastName}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(group._id, user._id)}
                        >
                          Remove
                        </Button>
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
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
      </CardContent>
    </Card>
  </div>

      

      
    </div>
  );

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
            {trainingGroups.map((group, index) => (
              <TableRow key={group._id}>
                <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.period ? `${group.period.name} - ${group.period.year}` : 'N/A'}</TableCell>
                <TableCell>{new Date(group.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(group.endTime).toLocaleString()}</TableCell>
                <TableCell>
                  <ul>
                    {group.users.map((user) => (
                      <li key={user._id} className="flex items-center justify-between mb-2">
                        <span>{user.firstName} {user.lastName}</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Score"
                            min="0"
                            max="100"
                            value={evaluation.score}
                            onChange={(e) => setEvaluation({ ...evaluation, score: e.target.value })}
                            className="w-20"
                          />
                          <Input
                            type="text"
                            placeholder="Comments"
                            value={evaluation.comments}
                            onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                            className="w-40"
                          />
                          <Button
                            onClick={() => handleEvaluateUser(group._id, user._id)}
                            size="sm"
                          >
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
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
      </CardContent>
    </Card>
  );
  const renderArtisanView = () => {
    const filteredGroups = trainingGroups.filter(group => 
      group.users.some(user => user._id === currentUser._id)
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Training Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Trade Area</TableHead>
                <TableHead>Training Center</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Your Evaluation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {currentItems.map((group, index) => { */}
              {filteredGroups.map((group, index) => {
                const userEvaluation = group.users.find(user => user._id === currentUser._id); // Assuming you have the current user's ID
                return (
                  <TableRow key={group._id}>
                    <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      {group.trainingCenter.trainingCentreName}<br />
                      {group.trainingCenter.address}<br />
                      {group.trainingCenter.state}, {group.trainingCenter.lga}<br />
                      {group.trainingCenter.phoneNumber}
                    </TableCell>
                    <TableCell>{new Date(group.startTime).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(group.endTime).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {userEvaluation ? (
                        <>
                          <p>Score: {userEvaluation.score}</p>
                          <p>Comments: {userEvaluation.comments}</p>
                        </>
                      ) : (
                        <p>Not Evaluated Yet</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* Pagination component */}
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
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedRoute href='/admin/dashboard'>
      <DashboardPage title="Training Management">
      <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
        <h1 className="text-3xl font-bold mb-8"></h1>
        {userRole === 'admin' || 'superadmin' ? renderAdminView() : renderTrainingCenterView()}
        {userRole === 'admin' || 'superadmin' ? renderTrainingCenterView() : renderAdminView()  }
        {userRole === 'admin' || 'superadmin' ? renderArtisanView() : renderTrainingCenterView() }
      </div>
      </DashboardPage>
      </ProtectedRoute>
    
  );
};

export default EnhancedTrainingManagement;