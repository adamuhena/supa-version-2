import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DashboardPage from "@/components/layout/DashboardLayout";
import { UserCircle, Briefcase, Star } from "lucide-react";
import { Settings , LogOut} from "lucide-react";
import useLogout from '@/pages/loginPage/logout';
import { Badge } from "@/components/ui/badge"



const DocumentUpload = () => {
  const logout = useLogout();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]); // Holds user data
  const navigate = useNavigate();

  const [attachments, setAttachments] = useState([
    { id: Date.now(), type: "", file: null },
  ]);

  const documentTypes = ["Passport", "NIN Slip", "Certificate", "Utility Bill"];

  // Handle changes to a specific attachment
  const handleAttachmentChange = (id, field, value) => {
    setAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === id ? { ...attachment, [field]: value } : attachment
      )
    );
  };

  // Add a new attachment field
  const handleAddAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      { id: Date.now(), type: "", file: null },
    ]);
  };

  // Remove an attachment field
  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  // Handle file upload submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate and process the attachments
    const formData = new FormData();
    attachments.forEach((attachment, index) => {
      if (!attachment.type || !attachment.file) {
        alert(`Attachment #${index + 1} is incomplete.`);
        return;
      }

      formData.append(`documents[${index}][type]`, attachment.type);
      formData.append(`documents[${index}][file]`, attachment.file);
    });

    // Simulate API call
    console.log("Form data submitted:", formData);
    alert("Documents uploaded successfully!");
  };

  return (
    <DashboardPage title="Certification / Licensing"  href="/artisan/dashboard">
      <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">USER MANAGEMENT</h1>
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
            <CardTitle> Certification Request</CardTitle>
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
                <Badge className="bg-yellow-400 border-red-500">Submited</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Bathroom Tiling</p>
                    <p className="text-sm text-muted-foreground">Completed on April 30, 2023</p>
                  </div>
                </div>
                <Badge className="bg-green-400 border-orange-500">Completed</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardPage >
  );
};

export default DocumentUpload;
