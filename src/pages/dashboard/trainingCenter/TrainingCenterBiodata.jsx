"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useLogout from "@/pages/loginPage/logout"
import axios from "axios"
import { LogOut, UserCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import PasswordChange from "./PasswordChange";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import UploadButton from "@/components/UploadButton";
import { API_BASE_URL } from "@/config/env";
import BasicInfoTab from "./tabs/BasicInfoTab";
import CenterDetailsTab from "./tabs/CenterDetailsTab";
import BankAccountTab from "./tabs/BankAccountTab";
import AmenitiesTab from "./tabs/AmenitiesTab";
import AssessmentTab from "./tabs/AssessmentTab";
import LegalInfoTab from "./tabs/LegalInfoTab";


const TrainingCenterBiodata = () => {
  const navigate = useNavigate()
  const logout = useLogout()
  const accessToken = localStorage.getItem("accessToken")
  const userId = localStorage.getItem("userId")

  const [center, setCenter] = useState({
    state: "",
    senatorialDistrict: "",
    lga: "",
    areaOffice: "",
    trainingCentreName: "",
    profileImage: "",
    address: "",
    sector: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    establishmentDate: "",
    ownership: "personal",
    otherOwnership: "",
    trainingNature: "institutionTraining",
    itfRegistered: "no",
    itfRegistrationNumber: "",
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    amenities: {
      portableWater: "no",
      observeBreak: "no",
      breakTime: "",
      otherComments: "",
    },
    assessment: {
      traineeInstructorRatio: "",
      practicalTheoryRatio: "",
      trainingDurationPerDay: "",
      trainingDurationPerWeek: "",
      weeklyTrainingSchedule: "no",
      trainingCurriculum: "no",
      curriculumAttachment: "",
      attendanceRegister: "no",
      infrastructure: [],
      utilities: [],
      totalFloorArea: 0,
    },
    legalInfo: {
      legalRegistration: "",
      tradeAreas: [],
      instructorCredentials: [],
      supportingDocuments: [],
      additionalDetails: "",
    },
    verificationDocuments: {
      certificateOfRegistration: "",
      taxClearanceCertificate: "",
      proofOfAddress: "",
      accreditationCertificate: "",
    },
    agree: false,
    regNum: "",
  })

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-center/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        setCenter(response.data.data)
      } catch (error) {
        console.error("Error fetching center data:", error)
        toast.error("Failed to load center data")
      }
    }

    fetchCenterData()
  }, [API_BASE_URL, userId, accessToken])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested updates (for dot notation in names)
    if (name.includes('.')) {
      const [category, field] = name.split('.')
      setCenter((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [field]: value
        }
      }))
    } else {
      // Handle top-level updates
      setCenter((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNestedInputChange = (category, field, value) => {
    setCenter((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/training-centers/${userId}`, 
        center,
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        }
      )

      if (response.data.success) {
        toast.success("Center information updated successfully")
        // Update local state with server response if needed
        setCenter(prev => ({
          ...prev,
          ...response.data.data
        }))
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (error) {
      console.error("Error updating center data:", error)
      toast.error(error.message || "Failed to update center information")
    }
  }

// Update the updateProfilePicture function
const updateProfilePicture = async (url) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");

    const newProfileImage = url || "";
    setCenter(prev => ({ ...prev, profileImage: newProfileImage }));

    const response = await axios.patch(
      `${API_BASE_URL}/training-centers/${userId}`, // Make sure this matches your GET endpoint!
      { profileImage: newProfileImage },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log("Profile image update response:", response.data);

    // Adjust this check to match your backend response
    if (response.data.success || response.data.status === "success") {
      toast.success("Profile picture updated successfully");
      setCenter(prev => ({
        ...prev,
        profileImage: response.data.data?.profileImage || newProfileImage
      }));
    } else {
      setCenter(prev => ({ ...prev, profileImage: prev.profileImage }));
      throw new Error(response.data.message || "Failed to update");
    }
  } catch (error) {
    console.error("Profile picture update error:", error);
    toast.error(error.response?.data?.message || error.message || "Failed to update profile picture");
    setCenter(prev => ({ ...prev, profileImage: prev.profileImage }));
  }
};

  const [selectedTab, setSelectedTab] = useState("basic")

  return (
    <TrainingDashboardPage title="Training Center Dashboard">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/training-center/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardContent className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              <img
                src={center.profileImage || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
                className="w-full h-full object-cover"
                key={center.profileImage} // Add key to force re-render
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{center.trainingCentreName || "Training Center"}</h2>
              <p className="text-gray-500">{center.email || "No email provided"}</p>
              <p className="text-gray-500">{center.contactPerson || "No contact person"}</p>
            </div>
            <div className="ml-auto">
              <UploadButton
                fileUrl={center.profileImage || ""} // Ensure fileUrl is never undefined
                handleFileChange={(url) => {
                  updateProfilePicture(url)
                }}
                removeFile={() => {
                  updateProfilePicture("")
                }}
                accept="image/*"
                title="Profile Picture"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Center Biodata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="block md:hidden mb-4">
              <Select onValueChange={(value) => setSelectedTab(value)} value={selectedTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tab" />
                </SelectTrigger>
                <SelectContent>
                  
                  <SelectItem value="basic">Center Details</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="update">Documents</SelectItem>
                  <SelectItem value="legal">Legal Info</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="password">Change Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs defaultValue="basic" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="hidden md:grid w-full grid-cols-7">
                <TabsTrigger value="basic">Center Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="update">Documents</TabsTrigger>
                <TabsTrigger value="legal">Legal Info</TabsTrigger>
                <TabsTrigger value="bank">Bank Account</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>

              <TabsContent value="update">
              <BasicInfoTab
                center={center}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
              </TabsContent>
              <TabsContent value="basic">
              <CenterDetailsTab
                center={center}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
              </TabsContent>
              <TabsContent value="bank">
              <BankAccountTab
                center={center}
                handleNestedInputChange={handleNestedInputChange}
                handleSubmit={handleSubmit}
              />
              </TabsContent>
              <TabsContent value="amenities">
                <AmenitiesTab
                  center={center}
                  handleNestedInputChange={handleNestedInputChange}
                  handleSubmit={handleSubmit}
                />
              </TabsContent>
              <TabsContent value="assessment">
              <AssessmentTab
                center={center}
                handleNestedInputChange={handleNestedInputChange}
                handleSubmit={handleSubmit}
              />
              </TabsContent>
              <TabsContent value="legal">
              <LegalInfoTab
                center={center}
                handleNestedInputChange={handleNestedInputChange}
                handleSubmit={handleSubmit}
              />
              </TabsContent>
              <TabsContent value="password">
                <PasswordChange />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TrainingDashboardPage>
  )
}

export default TrainingCenterBiodata

