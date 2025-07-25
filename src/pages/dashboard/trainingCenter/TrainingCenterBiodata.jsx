"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useLogout from "@/pages/loginPage/logout"
import ProtectedRoute from "@/components/ProtectedRoute";
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
    <ProtectedRoute href="/training-center/dashboard">
    {/* // <TrainingDashboardPage title="Training Center Dashboard"> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
        <header className="flex justify-between items-center mb-8 px-6">
          <h1 className="text-3xl font-extrabold text-blue-900">Dashboard</h1>
          <div className="flex gap-2">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-6 py-2 shadow" onClick={() => navigate("/training-center/biodata")}> 
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
            </Button>
            <Button variant="destructive" className="rounded-lg px-6 py-2 shadow" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <Card className="border-2 border-blue-600 p-6 rounded-2xl shadow-xl mb-8 bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <CardContent className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg bg-white">
              <img
                src={center.profileImage || "/placeholder.svg?height=128&width=128"}
                alt="Profile"
                className="w-full h-full object-cover"
                key={center.profileImage}
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-blue-900 mb-1">{center.trainingCentreName || "Training Center"}</h2>
              <p className="text-gray-600 text-lg">{center.email || "No email provided"}</p>
              <p className="text-gray-500 text-md">{center.contactPerson || "No contact person"}</p>
            </div>
            <div>
              <UploadButton
                fileUrl={center.profileImage || ""}
                handleFileChange={url => updateProfilePicture(url)}
                removeFile={() => updateProfilePicture("")}
                accept="image/*"
                title="Profile Picture"
                className="w-24 h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900 font-bold text-2xl">Training Center Biodata</CardTitle>
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
              <TabsList className="hidden md:grid w-full grid-cols-7 bg-blue-50 rounded-xl shadow mb-4">
                <TabsTrigger value="basic">Center Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="update">Documents</TabsTrigger>
                <TabsTrigger value="legal">Legal Info</TabsTrigger>
                <TabsTrigger value="bank">Bank Account</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>

              <TabsContent value="update">
                <div className="bg-white rounded-xl shadow p-6">
                  <BasicInfoTab
                    center={center}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="basic">
                <div className="bg-white rounded-xl shadow p-6">
                  <CenterDetailsTab
                    center={center}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="bank">
                <div className="bg-white rounded-xl shadow p-6">
                  <BankAccountTab
                    center={center}
                    handleNestedInputChange={handleNestedInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="amenities">
                <div className="bg-white rounded-xl shadow p-6">
                  <AmenitiesTab
                    center={center}
                    handleNestedInputChange={handleNestedInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="assessment">
                <div className="bg-white rounded-xl shadow p-6">
                  <AssessmentTab
                    center={center}
                    handleNestedInputChange={handleNestedInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="legal">
                <div className="bg-white rounded-xl shadow p-6">
                  <LegalInfoTab
                    center={center}
                    handleNestedInputChange={handleNestedInputChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </TabsContent>
              <TabsContent value="password">
                <div className="bg-white rounded-xl shadow p-6">
                  <PasswordChange />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    {/* </TrainingDashboardPage>     */}
    </ProtectedRoute>
  )
}

export default TrainingCenterBiodata

