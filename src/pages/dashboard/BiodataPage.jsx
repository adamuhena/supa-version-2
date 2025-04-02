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
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       throw new Error("No token found. Please log in again.");
  //     }
  
  //     console.log('Submitting data:', user); // Debug log
  
  //     const response = await axios.put(
  //       `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
  //       user, // Send the entire user object
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     if (response.data.success) {
  //       // Update local state with response data
  //       setUser(response.data.data);
        
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
  //       description: error.response?.data?.message || `Failed to update ${section}`,
  //       status: "error",
  //       duration: 3000,
  //     });
  //   }
  // };


  const submitChanges = async (section, data) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      let updateData;
      
      // Handle different section updates
      if (section === "skills") {
        // For skills section, only send the skills-related data
        updateData = {
          priorSkillsCerts: data.priorSkillsCerts,
          experience: data.experience
        };
      } else {
        // For other sections, use the existing logic
        updateData = user;
      }
  
      const response = await axios.put(
        `${API_BASE_URL}/update/${localStorage.getItem("userId")}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        // Update local state
        if (section === "skills") {
          setUser(prev => ({
            ...prev,
            priorSkillsCerts: data.priorSkillsCerts,
            experience: data.experience
          }));
          // Clear changes for skills section
          setChanges(prev => ({
            ...prev,
            priorSkillsCerts: undefined,
            experience: undefined
          }));
        } else {
          setUser(response.data.data);
        }
  
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

          <TabsContent value="personal">
            <PersonalTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges}  />
          </TabsContent>

          <TabsContent value="education">
            <EducationTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges} />
          </TabsContent>
          
          {/* <TabsContent value="skills">
          <SkillsTab
            user={user}
            handleUpdate={handleUpdate}
            submitChanges={submitChanges}
            changes={changes}
            handleArrayUpdate={handleArrayUpdate}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
         </TabsContent> */}

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
         <TabsContent value="bank">
          <BankTab user={user} handleUpdate={handleUpdate} submitChanges={submitChanges} />
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

