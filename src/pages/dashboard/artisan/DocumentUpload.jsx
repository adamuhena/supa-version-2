import DashboardPage from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useLogout from '@/pages/loginPage/logout';
import axios from 'axios';
import { Briefcase, LogOut, UserCircle } from 'lucide-react';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DocumentUpload = () => {
  const logout = useLogout();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [attachments, setAttachments] = useState([
    { id: Date.now(), type: "", file: null },
  ]);
  const [documentPurpose, setDocumentPurpose] = useState("");

  const documentTypes = ["Passport", "NIN Slip", "Certificate", "Utility Bill"];

  const handleAttachmentChange = (id, field, value) => {
    setAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === id ? { ...attachment, [field]: value } : attachment
      )
    );
  };

  const handleAddAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      { id: Date.now(), type: "", file: null },
    ]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!documentPurpose) {
      alert("Please select a document purpose (Certification or Licensing)");
      return;
    }
  
    const formData = new FormData();
    formData.append("purpose", documentPurpose);
  
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      alert("User ID is required. Please log in.");
      return;
    }
  
    formData.append("userId", userId);
  
    attachments.forEach((attachment, index) => {
      if (!attachment.type || !attachment.file) {
        alert(`Attachment #${index + 1} is incomplete.`);
        return;
      }
  
      formData.append("types", attachment.type);
      formData.append("documents", attachment.file);
    });
  
    try {
      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      console.log(response.data); // Log the response data to inspect the structure
  
      // Check if response contains a success field and its value
      if (response.data && response.data.success) {
        alert("Documents uploaded successfully!");
      } else {
        alert("Error uploading documents. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("Error uploading documents. Please try again.");
    }
  };
  
  

  return (
    <DashboardPage title="Certification / Licensing" href="/trainee/dashboard">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Upload</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/biodata')}>
              <UserCircle className="mr-2 h-4 w-4" /> Account
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <Card className="border p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="documentPurpose">Document Purpose</Label>
                <Select onValueChange={setDocumentPurpose} value={documentPurpose}>
                  <SelectTrigger id="documentPurpose">
                    <SelectValue placeholder="Select Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="licensing">Licensing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {attachments.map((attachment, index) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-4 mb-4 border p-4 rounded-lg"
                >
                  <Select
                    onValueChange={(value) =>
                      handleAttachmentChange(attachment.id, "type", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      handleAttachmentChange(attachment.id, "file", e.target.files[0])
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" type="button" onClick={handleAddAttachment}>
                Add Attachment
              </Button>
              <Button type="submit" className="ml-4">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Application for Certification</p>
                      <p className="text-sm text-muted-foreground">10/12/2024</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-400 border-red-500">Submitted</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Application for Licensing</p>
                      <p className="text-sm text-muted-foreground">05/15/2024</p>
                    </div>
                  </div>
                  <Badge className="bg-green-400 border-orange-500">Approved</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DocumentUpload;

