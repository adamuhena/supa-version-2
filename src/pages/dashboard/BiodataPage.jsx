
// export default BiodataPage
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DashboardPage from "@/components/layout/DashboardLayout";
import { UserCircle, Settings, LogOut, Plus, Minus } from "lucide-react";
import useLogout from "@/pages/loginPage/logout";
import { toast } from "@/hooks/use-toast";
import PasswordChange from "@/components/PasswordChange";
//import { url } from "inspector";

const Biodata = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    nin: "",
    password: "",
    gender: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    street: "",
    hasDisability: false,
    disabilityType: "",
    email: "",
    education: {
      school: "",
      highestQualification: "",
      graduationYear: "",
      eduUpload: "",
    },
    priorSkillsCerts: [],
    experience: [],
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    role: "",
    certifiedStatus: false,
    licenseStatus: false,
    agree: false,
    profileImage: "",
  });

  const [changes, setChanges] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const userData = response.data;

        if (userData && userData.success) {
          setUser((prevUser) => ({
            ...prevUser,
            ...userData.data,
            education: { ...prevUser.education, ...userData.data.education },
            bankAccount: { ...prevUser.bankAccount, ...userData.data.bankAccount },
          }));
        } else {
          console.warn("Unexpected API response:", userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          status: "error",
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (field, value) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [field]: value,
    }));
  };

  const submitChanges = async (section) => {
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const sectionChanges = Object.keys(changes)
        .filter((key) => key.startsWith(section))
        .reduce((obj, key) => {
          obj[key.replace(`${section}.`, "")] = changes[key];
          return obj;
        }, {});
  
      if (Object.keys(sectionChanges).length === 0) {
        toast({
          title: "No changes",
          description: "No changes to update",
          status: "info",
          duration: 3000,
        });
        return;
      }
  
      const response = await axios.put(
        `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
        sectionChanges,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );
  
      if (response.data.success) {
        setUser((prevUser) => ({ ...prevUser, ...sectionChanges }));
        setChanges((prevChanges) => {
          const updatedChanges = { ...prevChanges };
          Object.keys(sectionChanges).forEach((key) => delete updatedChanges[`${section}.${key}`]);
          return updatedChanges;
        });
        toast({
          title: "Success",
          description: `${section} updated successfully`,
          status: "success",
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to update");
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${section}`,
        status: "error",
        duration: 3000,
      });
    }
  };
  

  return (
    <DashboardPage title="User Profile"  href="/artisan/dashboard">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" />Update Profile 
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardContent className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img src={user.profileImage || '/placeholder.svg?height=96&width=96'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['firstName', 'middleName', 'lastName', 'phoneNumber', 'nin', 'email', 'street', 'stateOfOrigin', 'lga', 'stateOfResidence', 'lgaOfResidence'].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}
                  </label>
                  <Input
                    id={field}
                    value={changes[`personalInfo.${field}`] ?? user[field] ?? ''}
                    
                    onChange={(e) => handleUpdate(`personalInfo.${field}`, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  
                </div>
              ))}
              {['gender', 'maritalStatus'].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}
                  </label>
                  <Select onValueChange={(value) => handleUpdate(`personalInfo.${field}`, value)} value={changes[`personalInfo.${field}`] ?? user[field] ?? ''}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${field}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field === 'gender' ? (
                        <>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="space-y-2">
                <label htmlFor="hasDisability" className="block text-sm font-medium text-gray-700">
                  Has Disability
                </label>
                <Switch
                  id="hasDisability"
                  checked={user.hasDisability || false}
                  onCheckedChange={(checked) => handleUpdate('personalInfo.hasDisability', checked)}
                />
              </div>
              {user.hasDisability && (
                <div className="space-y-2">
                  <label htmlFor="disabilityType" className="block text-sm font-medium text-gray-700">
                    Disability Type
                  </label>
                  <Input
                    id="disabilityType"
                    value={(changes[`personalInfo.disabilityType`] ?? (user.disabilityType || ''))}
                    onChange={(e) => handleUpdate('personalInfo.disabilityType', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              )}
            </div>
            <Button onClick={() => submitChanges('personalInfo')} className="mt-4">Update Personal Information</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['school', 'highestQualification', 'graduationYear', 'eduUpload'].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={`education-${field}`} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Input
                    id={`education-${field}`}
                    value={changes[`education.${field}`] ?? user.education[field] ?? ''}
                    onChange={(e) => handleUpdate(`education.${field}`, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
            </div>
            <Button onClick={() => submitChanges('education')} className="mt-4">Update Education</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Prior Skills and Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            {user.priorSkillsCerts.map((cert, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['sector', 'tradeArea', 'name', 'year', 'priUpload'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label htmlFor={`cert-${index}-${field}`} className="block text-sm font-medium text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        id={`cert-${index}-${field}`}
                        value={cert[field]}
                        onChange={(e) => handleArrayUpdate('priorSkillsCerts', index, { ...cert, [field]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="destructive" onClick={() => removeArrayItem('priorSkillsCerts', index)} className="mt-2">
                  <Minus className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => addArrayItem('priorSkillsCerts', { sector: '', tradeArea: '', name: '', year: '', priUpload: '' })}>
              <Plus className="mr-2 h-4 w-4" /> Add Certification
            </Button>
            <Button onClick={() => submitChanges('priorSkillsCerts')} className="mt-4">Update Prior Skills and Certifications</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            {user.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['projectTitle', 'description', 'dateFrom', 'dateTo', 'exUpload'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label htmlFor={`exp-${index}-${field}`} className="block text-sm font-medium text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {field === 'description' ? (
                        <Textarea
                          id={`exp-${index}-${field}`}
                          value={exp[field]}
                          onChange={(e) => handleArrayUpdate('experience', index, { ...exp, [field]: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      ) : (
                        <Input
                          id={`exp-${index}-${field}`}
                          value={exp[field]}
                          onChange={(e) => handleArrayUpdate('experience', index, { ...exp, [field]: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="destructive" onClick={() => removeArrayItem('experience', index)} className="mt-2">
                  <Minus className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => addArrayItem('experience', { projectTitle: '', description: '', dateFrom: '', dateTo: '', exUpload: '' })}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
            <Button onClick={() => submitChanges('experience')} className="mt-4">Update Experience</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['accountName', 'accountNumber', 'bank'].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={`bank-${field}`} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Input
                    id={`bank-${field}`}
                    value={changes[`bankAccount.${field}`] ?? user.bankAccount[field] ?? ''}
                    onChange={(e) => handleUpdate(`bankAccount.${field}`, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
            </div>
            <Button onClick={() => submitChanges('bankAccount')} className="mt-4">Update Bank Account</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select onValueChange={(value) => handleUpdate('additionalInfo.role', value)} value={(changes[`additionalInfo.role`] ?? user.role) || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artisan_user">Artisan User</SelectItem>
                    <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                    <SelectItem value="regular_user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="certifiedStatus" className="block text-sm font-medium text-gray-700">
                  Certified Status
                </label>
                <Switch
                  id="certifiedStatus"
                  checked={user.certifiedStatus || false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.certifiedStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="licenseStatus" className="block text-sm font-medium text-gray-700">
                  License Status
                </label>
                <Switch
                  id="licenseStatus"
                  checked={user.licenseStatus || false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.licenseStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="agree" className="block text-sm font-medium text-gray-700">
                  Agree to Terms
                </label>
                <Switch
                  id="agree"
                  checked={user.agree || false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.agree', checked)}
                />
              </div>
            </div>
            <Button onClick={() => submitChanges('additionalInfo')} className="mt-4">Update Additional Information</Button>
          </CardContent>
        </Card>

        <Card className="border p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordChange />
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );
};

export default Biodata;

