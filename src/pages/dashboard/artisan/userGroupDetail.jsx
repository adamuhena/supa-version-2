import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui//card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui//table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const ArtisanTrainingManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTrainingGroups();
    fetchUserData();
  }, [accessToken]);



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


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trainingGroups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(trainingGroups.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const userRole = currentUser.role


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
      <div className="container mx-auto p-6">
          
        <h1 className="text-3xl font-bold mb-8"></h1>
        {(userRole === 'artisan_user' || userRole === 'intending_artisan') && renderArtisanView()}

      </div>
    
  );
};

export default ArtisanTrainingManagement;