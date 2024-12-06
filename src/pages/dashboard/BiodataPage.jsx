import DashboardPage from "@/components/layout/DashboardLayout";
import PasswordChange from "@/components/PasswordChange";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { LogOut, Minus, Plus, Upload, UserCircle } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    senatorialDistrict: "",
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

  const handleArrayUpdate = (section, index, value) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [section]: [
        ...(prevChanges[section] || user[section]).slice(0, index),
        value,
        ...(prevChanges[section] || user[section]).slice(index + 1),
      ],
    }));
  };

  const addArrayItem = (section, item) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [section]: [...(prevChanges[section] || user[section]), item],
    }));
  };

  const removeArrayItem = (section, index) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [section]: (prevChanges[section] || user[section]).filter((_, i) => i !== index),
    }));
  };
  
  return (
    <DashboardPage title="User Profile" href="/trainee/dashboard">
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
            <div>
              <Input
                type="file"
                onChange={(e) => handleFileUpload('profileImage', e.target.files[0])}
                className="hidden"
                id="profile-image-upload"
              />
              <Label htmlFor="profile-image-upload" className="cursor-pointer">
                <Button variant="outline" as="span">
                  <Upload className="mr-2 h-4 w-4" /> Update Profile Picture
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['firstName', 'middleName', 'lastName', 'phoneNumber', 'nin', 'email', 'street', 'stateOfOrigin', 'senatorialDistrict', 'lga', 'stateOfResidence', 'lgaOfResidence'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}</Label>
                      <Input
                        id={field}
                        value={changes[`personalInfo.${field}`] ?? user[field] ?? ''}
                        onChange={(e) => handleUpdate(`personalInfo.${field}`, e.target.value)}
                      />
                    </div>
                  ))}
                  {['gender', 'maritalStatus'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}</Label>
                      <Select onValueChange={(value) => handleUpdate(`personalInfo.${field}`, value)} value={changes[`personalInfo.${field}`] ?? user[field] ?? ''}>
                        <SelectTrigger>
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
                    <Label htmlFor="hasDisability">Has Disability</Label>
                    <Switch
                      id="hasDisability"
                      checked={changes['personalInfo.hasDisability'] ?? user.hasDisability ?? false}
                      onCheckedChange={(checked) => handleUpdate('personalInfo.hasDisability', checked)}
                    />
                  </div>
                  {(changes['personalInfo.hasDisability'] ?? user.hasDisability) && (
                    <div className="space-y-2">
                      <Label htmlFor="disabilityType">Disability Type</Label>
                      <Input
                        id="disabilityType"
                        value={changes['personalInfo.disabilityType'] ?? user.disabilityType ?? ''}
                        onChange={(e) => handleUpdate('personalInfo.disabilityType', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <Button onClick={() => submitChanges('personalInfo')} className="mt-4">Update Personal Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['school', 'highestQualification', 'graduationYear'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={`education-${field}`}>{field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}</Label>
                      <Input
                        id={`education-${field}`}
                        value={changes[`education.${field}`] ?? user.education[field] ?? ''}
                        onChange={(e) => handleUpdate(`education.${field}`, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="education-upload">Education Document</Label>
                    <Input
                      id="education-upload"
                      type="file"
                      onChange={(e) => handleFileUpload('education.eduUpload', e.target.files[0])}
                    />
                  </div>
                </div>
                <Button onClick={() => submitChanges('education')} className="mt-4">Update Education</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills, Certifications, and Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Prior Skills and Certifications</h3>
                {(changes.priorSkillsCerts ?? user.priorSkillsCerts).map((cert, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['sector', 'tradeArea', 'name', 'year'].map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={`cert-${index}-${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                          <Input
                            id={`cert-${index}-${field}`}
                            value={cert[field]}
                            onChange={(e) => handleArrayUpdate('priorSkillsCerts', index, { ...cert, [field]: e.target.value })}
                          />
                        </div>
                      ))}
                      <div className="space-y-2">
                        <Label htmlFor={`cert-${index}-upload`}>Certificate Upload</Label>
                        <Input
                          id={`cert-${index}-upload`}
                          type="file"
                          onChange={(e) => handleFileUpload(`priorSkillsCerts.${index}.priUpload`, e.target.files[0])}
                        />
                      </div>
                    </div>
                    <Button variant="destructive" onClick={() => removeArrayItem('priorSkillsCerts', index)} className="mt-2">
                      <Minus className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={() => addArrayItem('priorSkillsCerts', { sector: '', tradeArea: '', name: '', year: '', priUpload: '' })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Certification
                </Button>

                <h3 className="text-lg font-semibold mb-4 mt-8">Experience</h3>
                {(changes.experience ?? user.experience).map((exp, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['projectTitle', 'description', 'dateFrom', 'dateTo'].map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={`exp-${index}-${field}`}>{field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}</Label>
                          {field === 'description' ? (
                            <Textarea
                              id={`exp-${index}-${field}`}
                              value={exp[field]}
                              onChange={(e) => handleArrayUpdate('experience', index, { ...exp, [field]: e.target.value })}
                            />
                          ) : (
                            <Input
                              id={`exp-${index}-${field}`}
                              value={exp[field]}
                              onChange={(e) => handleArrayUpdate('experience', index, { ...exp, [field]: e.target.value })}
                            />
                          )}
                        </div>
                      ))}
                      <div className="space-y-2">
                        <Label htmlFor={`exp-${index}-upload`}>Experience Document</Label>
                        <Input
                          id={`exp-${index}-upload`}
                          type="file"
                          onChange={(e) => handleFileUpload(`experience.${index}.exUpload`, e.target.files[0])}
                        />
                      </div>
                    </div>
                    <Button variant="destructive" onClick={() => removeArrayItem('experience', index)} className="mt-2">
                      <Minus className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={() => addArrayItem('experience', { projectTitle: '', description: '', dateFrom: '', dateTo: '', exUpload: '' })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
                <Button onClick={() => submitChanges('skills')} className="mt-4">Update Skills and Experience</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['accountName', 'accountNumber', 'bank'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={`bank-${field}`}>{field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}</Label>
                      <Input
                        id={`bank-${field}`}
                        value={changes[`bankAccount.${field}`] ?? user.bankAccount[field] ?? ''}
                        onChange={(e) => handleUpdate(`bankAccount.${field}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => submitChanges('bankAccount')} className="mt-4">Update Bank Account</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordChange />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border p-4 rounded-lg shadow-md mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleUpdate('additionalInfo.role', value)} value={changes['additionalInfo.role'] ?? user.role ?? ''}>
                  <SelectTrigger>
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
                <Label htmlFor="certifiedStatus">Certified Status</Label>
                <Switch
                  id="certifiedStatus"
                  checked={changes['additionalInfo.certifiedStatus'] ?? user.certifiedStatus ?? false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.certifiedStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseStatus">License Status</Label>
                <Switch
                  id="licenseStatus"
                  checked={changes['additionalInfo.licenseStatus'] ?? user.licenseStatus ?? false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.licenseStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agree">Agree to Terms</Label>
                <Switch
                  id="agree"
                  checked={changes['additionalInfo.agree'] ?? user.agree ?? false}
                  onCheckedChange={(checked) => handleUpdate('additionalInfo.agree', checked)}
                />
              </div>
            </div>
            <Button onClick={() => submitChanges('additionalInfo')} className="mt-4">Update Additional Information</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );
};

export default Biodata;

