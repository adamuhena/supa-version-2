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

const AdminDocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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

  return (
    <ProtectedRoute>
        <DashboardPage>

        
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {Array.isArray(documents) && documents.length > 0 ? (
    documents.map((doc) => (
      <TableRow key={doc._id}>
        <TableCell>{doc.user.firstName} {doc.user.lastName}</TableCell>
        <TableCell>{doc.type}</TableCell>
        <TableCell>{doc.purpose}</TableCell>
        <TableCell>
          <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'default'}>
            {doc.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button onClick={() => {
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Document</DialogTitle>
              <DialogDescription>
                Review and verify the selected document.
              </DialogDescription>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-4">
                <div>
                  <strong>User:</strong> {selectedDocument.user.firstName} {selectedDocument.user.lastName}
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
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Add comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <Button onClick={handleVerify}>Submit Verification</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
    </DashboardPage>
        </ProtectedRoute>
  );
};

export default AdminDocumentVerification;

