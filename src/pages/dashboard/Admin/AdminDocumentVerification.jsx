import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/components/layout/DashboardLayout';
import useLogout from '@/pages/loginPage/logout';
import { LogOut, UserCircle } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


const AdminDocumentVerification = () => {
  const logout = useLogout();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`,{
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setDocuments(response.data.data);  // Set documents from response.data.data
      } else {
        console.error('Error: ', response.data.message);
        setDocuments([]);  // No documents available, set empty array
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);  // Handle API fetch error gracefully
    }
  };




  const handleVerify = async () => {
    try {
      await axios.put(`${API_BASE_URL}/documents/${selectedDocument._id}/verify`, {
        status: verificationStatus,
        comments: comments
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setIsDialogOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = documents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ProtectedRoute>
      <DashboardPage>
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">DOCUMENT APROVAL | VERIFICATION</h1>
              <h2 className="text-left font-[700] text-[14px]">
                (ARTISANS & INTENDIN ARTISANS)
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>


          <Card className="w-full">
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SN</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(documents) && currentItems.length > 0 ? (
                    currentItems.map((doc, index) => (
                      <TableRow key={doc._id}>
                        <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage} </TableCell>
                        <TableCell>{doc.user?.firstName} {doc.user?.lastName}</TableCell>
                        <TableCell>{doc?.type}</TableCell>
                        <TableCell>{doc?.purpose}</TableCell>
                        <TableCell>
                          <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'default'}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button className="bg-emerald-800" onClick={() => {
                            setSelectedDocument(doc);
                            setIsDialogOpen(true);
                          }}>
                            Verify
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>No documents available</TableCell>
                    </TableRow>
                  )}
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

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-700 ">Verify Document</DialogTitle>
                    <DialogDescription className="text-slate-700">
                      Review and verify the selected document.
                    </DialogDescription>
                  </DialogHeader>
                  {selectedDocument && (
                    <div className="space-y-4">
                      <div>
                        <strong>User:</strong> {selectedDocument.user?.firstName} {selectedDocument.user?.lastName}
                      </div>
                      <div>
                        <strong>Document Type:</strong> {selectedDocument.type}
                      </div>
                      <div>
                        <strong>Purpose:</strong> {selectedDocument.purpose}
                      </div>
                      <div>
                        <strong>File:</strong> <a href={selectedDocument.file} target="_blank" rel="noopener noreferrer">View Document</a>
                      </div>
                      <Select onValueChange={setVerificationStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select verification status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="text-red-700 hover:text-red-700" value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Add comments..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                      <Button className="bg-emerald-700" onClick={handleVerify}>Submit Verification</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default AdminDocumentVerification;

