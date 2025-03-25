import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPage from "@/components/layout/DashboardLayout";
import PasswordChange from "@/components/PasswordChange";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { LogOut, Minus, Plus, Upload, UserCircle } from "lucide-react";
import UploadButton from "@/components/UploadButton";
import { API_BASE_URL } from "@/config/env";
import { states } from "../../data/nigeria";
import { replaceSymbolsWithSpace } from "../../utils/helpers";
import PersonalTab from "./tabs/PersonalTab"
import EducationTab from "./tabs/EducationTab"
import SkillsTab from "./tabs/SkillsTab"
import BankTab from "./tabs/BankTab"
import ProtectedRoute from "@/components/ProtectedRoute";
//import { url } from "inspector";

const Biodata = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    nin: "",
    password: "",
    dob: "",
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
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = response.data;

        if (userData && userData.success) {
          setUser((prevUser) => ({
            ...prevUser,
            ...userData.data,
            education: { ...prevUser.education, ...userData.data.education },
            bankAccount: {
              ...prevUser.bankAccount,
              ...userData.data.bankAccount,
            },
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

  // const handleUpdate = (field, value) => {
  //   setChanges((prevChanges) => ({
  //     ...prevChanges,
  //     [field]: value,
  //   }));
  // };

  // const handleUpdate = (key, value) => {
  //   console.log('Updating:', key, value);
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     [key]: value,
  //   }));
  // };

  const handleUpdate = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [key]: value,
    }));
    setChanges((prevChanges) => ({
      ...prevChanges,
      [key]: value,
    }));
  };

  // const submitChanges = async (section) => {
  //   try {
  //     const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
  //     if (!token) {
  //       throw new Error("No token found. Please log in again.");
  //     }

      // const sectionChanges = Object.keys(changes)
      //   .filter((key) => key.startsWith(section))
      //   .reduce((obj, key) => {
      //     obj[key.replace(`${section}.`, "")] = changes[key];
      //     return obj;
      //   }, {});

      // if (Object.keys(sectionChanges).length === 0) {
      //   toast({
      //     title: "No changes",
      //     description: "No changes to update",
      //     status: "info",
      //     duration: 3000,
      //   });
      //   return;
      // }

  //     const response = await axios.put(
  //       `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
  //       sectionChanges,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include the token here
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       setUser((prevUser) => ({ ...prevUser, ...sectionChanges }));
  //       setChanges((prevChanges) => {
  //         const updatedChanges = { ...prevChanges };
  //         Object.keys(sectionChanges).forEach(
  //           (key) => delete updatedChanges[`${section}.${key}`]
  //         );
  //         return updatedChanges;
  //       });
  //       toast({
  //         title: "Success",
  //         description: `${section} updated successfully`,
  //         status: "success",
  //         duration: 3000,
  //       });
  //     } else {
  //       throw new Error(response.data.message || "Failed to update");
  //     }
  //   } catch (error) {
  //     console.error(`Error updating ${section}:`, error);
  //     toast({
  //       title: "Error",
  //       description: `Failed to update ${section}`,
  //       status: "error",
  //       duration: 3000,
  //     });
  //   }
  // };

  const submitChanges = async (section) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      console.log('Submitting data:', user); // Debug log
  
      const response = await axios.put(
        `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
        user, // Send the entire user object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        // Update local state with response data
        setUser(response.data.data);
        
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
        description: error.response?.data?.message || `Failed to update ${section}`,
        status: "error",
        duration: 3000,
      });
    }
  };

  // const submitChanges = async (section) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       throw new Error("No token found. Please log in again.");
  //     }
  
  //     // Create section-specific payload
  //     let payload = {};
  //     switch (section) {
  //       case "personal":
  //         payload = {
  //           firstName: user.firstName,
  //           middleName: user.middleName,
  //           lastName: user.lastName,
  //           phoneNumber: user.phoneNumber,
  //           nin: user.nin,
  //           email: user.email,
  //           street: user.street,
  //           dob: user.dob,
  //           gender: user.gender,
  //           maritalStatus: user.maritalStatus,
  //           stateOfOrigin: user.stateOfOrigin,
  //           senatorialDistrict: user.senatorialDistrict,
  //           lga: user.lga,
  //           stateOfResidence: user.stateOfResidence,
  //           lgaOfResidence: user.lgaOfResidence,
  //           hasDisability: user.hasDisability,
  //           disabilityType: user.disabilityType,
  //         };
  //         break;
  //       case "education":
  //         payload = {
  //           education: user.education
  //         };
  //         break;
  //       case "bankAccount":
  //         payload = {
  //           bankAccount: user.bankAccount
  //         };
  //         break;
  //       case "additionalInfo":
  //         payload = {
  //           role: user.role,
  //           certifiedStatus: user.certifiedStatus,
  //           licenseStatus: user.licenseStatus,
  //           agree: user.agree
  //         };
  //         break;
  //       default:
  //         payload = user;
  //     }
  
  //     console.log(`Submitting ${section} changes:`, payload);
  
  //     const response = await axios.put(
  //       `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     if (response.data.success) {
  //       // Update local state with response data
  //       setUser(prevUser => ({
  //         ...prevUser,
  //         ...response.data.data
  //       }));
  
  //       toast.success(`${section} updated successfully`);
  //     } else {
  //       throw new Error(response.data.message || "Failed to update");
  //     }
  //   } catch (error) {
  //     console.error(`Error updating ${section}:`, error);
  //     toast.error(
  //       error.response?.data?.message || 
  //       error.message || 
  //       `Failed to update ${section}`
  //     );
  //   }
  // };

  const updateProfilePicture = async (url) => {
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
        { profileImage: url },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );

      if (response.data.success) {
        setUser((prevUser) => ({ ...prevUser }));

        toast({
          title: "Success",
          description: `Picture updated successfully`,
          status: "success",
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to update");
      }
    } catch (error) {
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
      [section]: (prevChanges[section] || user[section]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const [form, setForm] = useState({
    stateOfOrigin: "",
    stateOfResidence: "",
    hasDisability: false,
    selectedDisability: "",
  });

  const onchangeInput = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const selectedStateLGASOrigin =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
    )?.lgas || [];

  const selectedStateLGASOriginFormatted =
    selectedStateLGASOrigin && selectedStateLGASOrigin?.length
      ? selectedStateLGASOrigin.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const selectedStateSenatorialDistrictsOrigin =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
    )?.senatorialDistricts || [];

  const selectedStateSenatorialDistrictsOriginFormatted =
    selectedStateSenatorialDistrictsOrigin && selectedStateSenatorialDistrictsOrigin?.length
      ? selectedStateSenatorialDistrictsOrigin.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const selectedStateLGASResidence =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
    )?.lgas || [];

  const selectedStateLGASResidenceFormatted =
    selectedStateLGASResidence && selectedStateLGASResidence?.length
      ? selectedStateLGASResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const selectedStateSenatorialDistrictsResidence =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
    )?.senatorialDistricts || [];

  const selectedStateSenatorialDistrictsResidenceFormatted =
    selectedStateSenatorialDistrictsResidence && selectedStateSenatorialDistrictsResidence?.length
      ? selectedStateSenatorialDistrictsResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const { hasDisability } = form;

  const handleRadioChange = (e) => {
    onchangeInput("hasDisability", e.target?.value);
  };

  const handleChangeSelectedDisability = (value) => {
    onchangeInput("selectedDisability", value);
  };

  const [selectedTab, setSelectedTab] = useState("personal");

  return (
    <ProtectedRoute>

      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardContent className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={user.profileImage || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.role}</p>
            </div>
            <div>
              <Input
                type="file"
                onChange={(e) =>
                  handleFileUpload("profileImage", e.target.files[0])
                }
                className="hidden"
                id="profile-image-upload"
              />
              <UploadButton
                fileUrl={user?.profileImage}
                handleFileChange={(url) => {
                  setUser((old) => {
                    return { ...old, profileImage: url };
                  });
                  updateProfilePicture(url);
                }}
                removeFile={() => {
                  const url = "";
                  setUser((old) => {
                    return { ...old, profileImage: url };
                  });
                  updateProfilePicture(url);
                }}
              />
              {/* <Label htmlFor="profile-image-upload" className="cursor-pointer">

              
                <Button variant="outline" as="span">
                  <Upload className="mr-2 h-4 w-4" /> Update Profile Picture
                </Button>
              </Label> */}
            </div>
          </CardContent>
        </Card>

        <div className="block md:hidden mb-4">
          <Select
            onValueChange={(value) => setSelectedTab(value)}
            value={selectedTab}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Tab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="skills">Skills & Experience</SelectItem>
              <SelectItem value="bank">Bank Account</SelectItem>
              <SelectItem value="password">Change Password</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="personal"  value={selectedTab} onValueChange={setSelectedTab}  className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <PersonalTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges}  />
          <EducationTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges} />
          <TabsContent value="skills">
          <SkillsTab
            user={user}
            handleUpdate={handleUpdate}
            submitChanges={submitChanges}
            changes={changes}
            handleArrayUpdate={handleArrayUpdate}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
         </TabsContent>
          <BankTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges} />

          {/* <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "firstName",
            "middleName",
            "lastName",
            "phoneNumber",
            "nin",
            "email",
            "street",
          ].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>
                {field
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .charAt(0)
                  .toUpperCase() +
                  field
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .slice(1)}
              </Label>
              <Input
                id={field}
                value={user[field] ?? ""}
                onChange={(e) => handleUpdate(field, e.target.value)}
              />
            </div>
          ))}
          {["gender", "maritalStatus"].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>
                {field
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .charAt(0)
                  .toUpperCase() +
                  field
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .slice(1)}
              </Label>
              <Select
                onValueChange={(value) => handleUpdate(field, value)}
                value={user[field] ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  {field === "gender" ? (
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
            <Label htmlFor="stateOfOrigin">State of Origin</Label>
            <Select
              onValueChange={(value) => handleUpdate("stateOfOrigin", value)}
              value={user.stateOfOrigin ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State of Origin" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lga">LGA</Label>
            <Select
              onValueChange={(value) => handleUpdate("lga", value)}
              value={user.lga ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {selectedStateLGASOriginFormatted.map((lga) => (
                  <SelectItem key={lga.value} value={lga.value}>
                    {lga.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="senatorialDistrict">Senatorial District</Label>
            <Select
              onValueChange={(value) =>
                handleUpdate("senatorialDistrict", value)
              }
              value={user.senatorialDistrict ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Senatorial District" />
              </SelectTrigger>
              <SelectContent>
                {selectedStateSenatorialDistrictsOriginFormatted.map(
                  (senatorialDistrict) => (
                    <SelectItem key={senatorialDistrict.value} value={senatorialDistrict.value}>
                      {senatorialDistrict.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stateOfResidence">State of Residence</Label>
            <Select
              onValueChange={(value) => handleUpdate("stateOfResidence", value)}
              value={user.stateOfResidence ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State of Residence" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
            <Select
              onValueChange={(value) => handleUpdate("lgaOfResidence", value)}
              value={user.lgaOfResidence ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LGA of Residence" />
              </SelectTrigger>
              <SelectContent>
                {selectedStateLGASResidenceFormatted.map((lgaOfResidence) => (
                  <SelectItem key={lgaOfResidence.value} value={lgaOfResidence.value}>
                    {lgaOfResidence.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hasDisability">Has Disability</Label>
            <Switch
              id="hasDisability"
              checked={user.hasDisability ?? false}
              onCheckedChange={(checked) =>
                handleUpdate("hasDisability", checked)
              }
            />
          </div>
          {(user.hasDisability) && (
            <div className="space-y-2">
              <Label htmlFor="disabilityType">Disability Type</Label>
              <Input
                id="disabilityType"
                value={user.disabilityType ?? ""}
                onChange={(e) =>
                  handleUpdate("disabilityType", e.target.value)
                }
              />
            </div>
          )}
        </div>
        <Button onClick={() => submitChanges("personalInfo")} className="mt-4">
          Update Personal Information
        </Button>
      </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["school", "highestQualification", "graduationYear"].map(
                    (field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`education-${field}`}>
                          {field
                            .split(/(?=[A-Z])/)
                            .join(" ")
                            .charAt(0)
                            .toUpperCase() +
                            field
                              .split(/(?=[A-Z])/)
                              .join(" ")
                              .slice(1)}
                        </Label>
                        <Input
                          id={`education-${field}`}
                          value={
                            changes[`education.${field}`] ??
                            user.education[field] ??
                            ""
                          }
                          onChange={(e) =>
                            handleUpdate(`education.${field}`, e.target.value)
                          }
                        />
                      </div>
                    )
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="education-upload">Education Document</Label>
                    <Input
                      id="education-upload"
                      type="file"
                      onChange={(e) =>
                        handleFileUpload(
                          "education.eduUpload",
                          e.target.files[0]
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={() => submitChanges("education")}
                  className="mt-4">
                  Update Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills, Certifications, and Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">
                  Prior Skills and Certifications
                </h3>
                {(changes.priorSkillsCerts ?? user.priorSkillsCerts).map(
                  (cert, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["sector", "tradeArea", "name", "year"].map(
                          (field) => (
                            <div key={field} className="space-y-2">
                              <Label htmlFor={`cert-${index}-${field}`}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </Label>
                              <Input
                                id={`cert-${index}-${field}`}
                                value={cert[field]}
                                onChange={(e) =>
                                  handleArrayUpdate("priorSkillsCerts", index, {
                                    ...cert,
                                    [field]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )
                        )}
                        <div className="space-y-2">
                          <Label htmlFor={`cert-${index}-upload`}>
                            Certificate Upload
                          </Label>
                          <Input
                            id={`cert-${index}-upload`}
                            type="file"
                            onChange={(e) =>
                              handleFileUpload(
                                `priorSkillsCerts.${index}.priUpload`,
                                e.target.files[0]
                              )
                            }
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          removeArrayItem("priorSkillsCerts", index)
                        }
                        className="mt-2">
                        <Minus className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  )
                )}
                <Button
                  onClick={() =>
                    addArrayItem("priorSkillsCerts", {
                      sector: "",
                      tradeArea: "",
                      name: "",
                      year: "",
                      priUpload: "",
                    })
                  }>
                  <Plus className="mr-2 h-4 w-4" /> Add Certification
                </Button>

                <h3 className="text-lg font-semibold mb-4 mt-8">Experience</h3>
                {(changes.experience ?? user.experience).map((exp, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "projectTitle",
                        "description",
                        "dateFrom",
                        "dateTo",
                      ].map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={`exp-${index}-${field}`}>
                            {field
                              .split(/(?=[A-Z])/)
                              .join(" ")
                              .charAt(0)
                              .toUpperCase() +
                              field
                                .split(/(?=[A-Z])/)
                                .join(" ")
                                .slice(1)}
                          </Label>
                          {field === "description" ? (
                            <Textarea
                              id={`exp-${index}-${field}`}
                              value={exp[field]}
                              onChange={(e) =>
                                handleArrayUpdate("experience", index, {
                                  ...exp,
                                  [field]: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <Input
                              id={`exp-${index}-${field}`}
                              value={exp[field]}
                              onChange={(e) =>
                                handleArrayUpdate("experience", index, {
                                  ...exp,
                                  [field]: e.target.value,
                                })
                              }
                            />
                          )}
                        </div>
                      ))}
                      <div className="space-y-2">
                        <Label htmlFor={`exp-${index}-upload`}>
                          Experience Document
                        </Label>
                        <Input
                          id={`exp-${index}-upload`}
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(
                              `experience.${index}.exUpload`,
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => removeArrayItem("experience", index)}
                      className="mt-2">
                      <Minus className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    addArrayItem("experience", {
                      projectTitle: "",
                      description: "",
                      dateFrom: "",
                      dateTo: "",
                      exUpload: "",
                    })
                  }>
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
                <Button
                  onClick={() => submitChanges("skills")}
                  className="mt-4">
                  Update Skills and Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}


{/* <TabsContent value="bank">
  <Card>
    <CardHeader>
      <CardTitle>Bank Account</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["accountName", "accountNumber", "bank"].map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={`bank-${field}`}>
              {field
                .split(/(?=[A-Z])/)
                .join(" ")
                .charAt(0)
                .toUpperCase() +
                field
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .slice(1)}
            </Label>
            <Input
              id={`bank-${field}`}
              value={
                changes[`bankAccount.${field}`] ?? user.bankAccount[field] ?? ""
              }
              onChange={(e) =>
                handleUpdate(`bankAccount.${field}`, e.target.value)
              }
              type={field === "accountNumber" ? "text" : "text"} // Ensure accountNumber is treated as text
            />
          </div>
        ))}
      </div>
      <Button onClick={() => submitChanges("bankAccount")} className="mt-4">
        Update Bank Account
      </Button>
    </CardContent>
  </Card>
</TabsContent> */}

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

        {/* <Card className="border p-4 rounded-lg shadow-md mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    handleUpdate("additionalInfo.role", value)
                  }
                  value={changes["additionalInfo.role"] ?? user.role ?? ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artisan_user">Artisan User</SelectItem>
                    <SelectItem value="intending_artisan">
                      Intending Artisan
                    </SelectItem>
                    <SelectItem value="regular_user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifiedStatus">Certified Status</Label>
                <Switch
                  id="certifiedStatus"
                  checked={
                    changes["additionalInfo.certifiedStatus"] ??
                    user.certifiedStatus ??
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleUpdate("additionalInfo.certifiedStatus", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseStatus">License Status</Label>
                <Switch
                  id="licenseStatus"
                  checked={
                    changes["additionalInfo.licenseStatus"] ??
                    user.licenseStatus ??
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleUpdate("additionalInfo.licenseStatus", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agree">Agree to Terms</Label>
                <Switch
                  id="agree"
                  checked={
                    changes["additionalInfo.agree"] ?? user.agree ?? false
                  }
                  onCheckedChange={(checked) =>
                    handleUpdate("additionalInfo.agree", checked)
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => submitChanges("additionalInfo")}
              className="mt-4">
              Update Additional Information
            </Button>
          </CardContent>
        </Card> */}
        {/* {(user.role === "admin" || user.role === "superadmin") && (
          <Card className="border p-4 rounded-lg shadow-md mt-6">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={(value) =>
                      handleUpdate("additionalInfo.role", value)
                    }
                    value={changes["additionalInfo.role"] ?? user.role ?? ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="artisan_user">Artisan User</SelectItem>
                      <SelectItem value="intending_artisan">
                        Intending Artisan
                      </SelectItem>
                      <SelectItem value="regular_user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifiedStatus">Certified Status</Label>
                  <Switch
                    id="certifiedStatus"
                    checked={
                      changes["additionalInfo.certifiedStatus"] ??
                      user.certifiedStatus ??
                      false
                    }
                    onCheckedChange={(checked) =>
                      handleUpdate("additionalInfo.certifiedStatus", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseStatus">License Status</Label>
                  <Switch
                    id="licenseStatus"
                    checked={
                      changes["additionalInfo.licenseStatus"] ??
                      user.licenseStatus ??
                      false
                    }
                    onCheckedChange={(checked) =>
                      handleUpdate("additionalInfo.licenseStatus", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agree">Agree to Terms</Label>
                  <Switch
                    id="agree"
                    checked={
                      changes["additionalInfo.agree"] ?? user.agree ?? false
                    }
                    onCheckedChange={(checked) =>
                      handleUpdate("additionalInfo.agree", checked)
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => submitChanges("additionalInfo")}
                className="mt-4 bg-green-500 hover:bg-green-600">
                Update Additional Information
              </Button>
            </CardContent>
          </Card>
        )} */}
        {(user.role === "admin" || user.role === "superadmin") && (
  <Card className="border p-4 rounded-lg shadow-md mt-6">
    <CardHeader>
      <CardTitle>Additional Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) =>
              handleUpdate("role", value)
            }
            value={changes["role"] ?? user.role ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="artisan_user">Artisan User</SelectItem>
              <SelectItem value="intending_artisan">
                Intending Artisan
              </SelectItem>
              <SelectItem value="regular_user">Regular User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="certifiedStatus">Certified Status</Label>
          <Switch
            id="certifiedStatus"
            checked={changes["certifiedStatus"] ?? user.certifiedStatus ?? false}
            onCheckedChange={(checked) =>
              handleUpdate("certifiedStatus", checked)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseStatus">License Status</Label>
          <Switch
            id="licenseStatus"
            checked={changes["licenseStatus"] ?? user.licenseStatus ?? false}
            onCheckedChange={(checked) =>
              handleUpdate("licenseStatus", checked)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agree">Agree to Terms</Label>
          <Switch
            id="agree"
            checked={changes["agree"] ?? user.agree ?? false}
            onCheckedChange={(checked) =>
              handleUpdate("agree", checked)
            }
          />
        </div>
      </div>
      <Button
        onClick={() => submitChanges("additionalInfo")}
        className="mt-4 bg-green-500 hover:bg-green-600">
        Update Additional Information
      </Button>
    </CardContent>
  </Card>
)}
      </div>
    </ProtectedRoute>
    
  );
};

export default Biodata;

