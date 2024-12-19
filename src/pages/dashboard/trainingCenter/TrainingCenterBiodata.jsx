import ProtectedRoute from "@/components/ProtectedRoute";
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
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { LogOut, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PasswordChange from "./PasswordChange";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import UploadButton from "@/components/UploadButton";
import { API_BASE_URL } from "@/config/env";

const TrainingCenterBiodata = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

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
    },
    agree: false,
    regNum: "",
  });

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/training-center/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setCenter(response.data.data);
      } catch (error) {
        console.error("Error fetching center data:", error);
        toast.error("Failed to load center data");
      }
    };

    fetchCenterData();
  }, [API_BASE_URL, userId, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCenter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setCenter((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/training-centers/${userId}`, center, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("Center information updated successfully");
    } catch (error) {
      console.error("Error updating center data:", error);
      toast.error("Failed to update center information");
    }
  };

  const updateProfilePicture = async (url) => {
  
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/training-centers/${localStorage.getItem("userId")}`,
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

  return (
    <TrainingDashboardPage title="Training Center Dashboard">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/training-center/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
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
                src={
                  center.profileImage || "/placeholder.svg?height=96&width=96"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {center.trainingCentreName}
              </h2>
              <p className="text-gray-500">{center.email}</p>
              <p className="text-gray-500">{center.contactPerson}</p>
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
                fileUrl={center?.profileImage}
                handleFileChange={(url) => {
                  // setUser((old) => {
                  //   return { ...old, profileImage: url };
                  // });
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

        <Card>
          <CardHeader>
            <CardTitle>Training Center Biodata</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Center Details</TabsTrigger>
                <TabsTrigger value="bank">Bank Account</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="legal">Legal Info</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="trainingCentreName"
                    value={center.trainingCentreName}
                    onChange={handleInputChange}
                    placeholder="Training Centre Name"
                  />
                  <Input
                    name="regNum"
                    value={center.regNum}
                    onChange={handleInputChange}
                    placeholder="Registration Number"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={center.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                  <Input
                    name="phoneNumber"
                    value={center.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                  <Input
                    name="address"
                    value={center.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                  />
                  <Button type="submit">Update Basic Info</Button>
                </form>
              </TabsContent>

              <TabsContent value="details">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="state"
                    value={center.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                  <Input
                    name="lga"
                    value={center.lga}
                    onChange={handleInputChange}
                    placeholder="LGA"
                  />
                  <Input
                    name="sector"
                    value={center.sector}
                    onChange={handleInputChange}
                    placeholder="Sector"
                  />
                  <Input
                    name="contactPerson"
                    value={center.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Contact Person"
                  />
                  <Input
                    name="establishmentDate"
                    type="date"
                    value={center.establishmentDate}
                    onChange={handleInputChange}
                    placeholder="Establishment Date"
                  />
                  <Select
                    name="ownership"
                    value={center.ownership}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "ownership", value },
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federalGovt">
                        Federal Government
                      </SelectItem>
                      <SelectItem value="stateGovt">
                        State Government
                      </SelectItem>
                      <SelectItem value="localGovt">
                        Local Government
                      </SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="coOwned">Co-owned</SelectItem>
                      <SelectItem value="religiousOrganization">
                        Religious Organization
                      </SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {center.ownership === "other" && (
                    <Input
                      name="otherOwnership"
                      value={center.otherOwnership}
                      onChange={handleInputChange}
                      placeholder="Specify Other Ownership"
                    />
                  )}
                  <Select
                    name="trainingNature"
                    value={center.trainingNature}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "trainingNature", value },
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select training nature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="institutionTraining">
                        Institution Training
                      </SelectItem>
                      <SelectItem value="workplaceTraining">
                        Workplace Training
                      </SelectItem>
                      <SelectItem value="informal">Informal</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="itfRegistered"
                      checked={center.itfRegistered === "yes"}
                      onCheckedChange={(checked) =>
                        handleInputChange({
                          target: {
                            name: "itfRegistered",
                            value: checked ? "yes" : "no",
                          },
                        })
                      }
                    />
                    <Label htmlFor="itfRegistered">ITF Registered</Label>
                  </div>
                  {center.itfRegistered === "yes" && (
                    <Input
                      name="itfRegistrationNumber"
                      value={center.itfRegistrationNumber}
                      onChange={handleInputChange}
                      placeholder="ITF Registration Number"
                    />
                  )}
                  <Button type="submit">Update Center Details</Button>
                </form>
              </TabsContent>

              <TabsContent value="bank">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="accountName"
                    value={center.bankAccount?.accountName ?? ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankAccount",
                        "accountName",
                        e.target.value
                      )
                    }
                    placeholder="Account Name"
                  />
                  <Input
                    name="accountNumber"
                    value={center.bankAccount?.accountNumber ?? ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankAccount",
                        "accountNumber",
                        e.target.value
                      )
                    }
                    placeholder="Account Number"
                  />
                  <Input
                    name="bank"
                    value={center.bankAccount?.bank ?? ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankAccount",
                        "bank",
                        e.target.value
                      )
                    }
                    placeholder="Bank Name"
                  />
                  <Button type="submit">Update Bank Account</Button>
                </form>
              </TabsContent>

              <TabsContent value="amenities">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="portableWater"
                      checked={center.amenities?.portableWater === "yes"}
                      onCheckedChange={(checked) =>
                        handleNestedInputChange(
                          "amenities",
                          "portableWater",
                          checked ? "yes" : "no"
                        )
                      }
                    />
                    <Label htmlFor="portableWater">Portable Water</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="observeBreak"
                      checked={center.amenities?.observeBreak === "yes"}
                      onCheckedChange={(checked) =>
                        handleNestedInputChange(
                          "amenities",
                          "observeBreak",
                          checked ? "yes" : "no"
                        )
                      }
                    />
                    <Label htmlFor="observeBreak">Observe Break</Label>
                  </div>
                  {center.amenities?.observeBreak === "yes" && (
                    <Input
                      name="breakTime"
                      value={center.amenities.breakTime}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "amenities",
                          "breakTime",
                          e.target.value
                        )
                      }
                      placeholder="Break Time"
                    />
                  )}
                  <Textarea
                    name="otherComments"
                    value={center.amenities?.otherComments}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "amenities",
                        "otherComments",
                        e.target.value
                      )
                    }
                    placeholder="Other Comments"
                  />
                  <Button type="submit">Update Amenities</Button>
                </form>
              </TabsContent>

              <TabsContent value="assessment">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="traineeInstructorRatio"
                    value={center.assessment?.traineeInstructorRatio}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "assessment",
                        "traineeInstructorRatio",
                        e.target.value
                      )
                    }
                    placeholder="Trainee-Instructor Ratio"
                  />
                  <Input
                    name="practicalTheoryRatio"
                    value={center.assessment?.practicalTheoryRatio}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "assessment",
                        "practicalTheoryRatio",
                        e.target.value
                      )
                    }
                    placeholder="Practical-Theory Ratio"
                  />
                  <Input
                    name="trainingDurationPerDay"
                    value={center.assessment?.trainingDurationPerDay}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "assessment",
                        "trainingDurationPerDay",
                        e.target.value
                      )
                    }
                    placeholder="Training Duration Per Day"
                  />
                  <Input
                    name="trainingDurationPerWeek"
                    value={center.assessment?.trainingDurationPerWeek}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "assessment",
                        "trainingDurationPerWeek",
                        e.target.value
                      )
                    }
                    placeholder="Training Duration Per Week"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="weeklyTrainingSchedule"
                      checked={
                        center.assessment?.weeklyTrainingSchedule === "yes"
                      }
                      onCheckedChange={(checked) =>
                        handleNestedInputChange(
                          "assessment",
                          "weeklyTrainingSchedule",
                          checked ? "yes" : "no"
                        )
                      }
                    />
                    <Label htmlFor="weeklyTrainingSchedule">
                      Weekly Training Schedule
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="trainingCurriculum"
                      checked={center.assessment?.trainingCurriculum === "yes"}
                      onCheckedChange={(checked) =>
                        handleNestedInputChange(
                          "assessment",
                          "trainingCurriculum",
                          checked ? "yes" : "no"
                        )
                      }
                    />
                    <Label htmlFor="trainingCurriculum">
                      Training Curriculum
                    </Label>
                  </div>
                  {center.assessment?.trainingCurriculum === "yes" && (
                    <Input
                      name="curriculumAttachment"
                      type="file"
                      onChange={(e) =>
                        handleNestedInputChange(
                          "assessment",
                          "curriculumAttachment",
                          e.target.files[0]
                        )
                      }
                    />
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="attendanceRegister"
                      checked={center.assessment?.attendanceRegister === "yes"}
                      onCheckedChange={(checked) =>
                        handleNestedInputChange(
                          "assessment",
                          "attendanceRegister",
                          checked ? "yes" : "no"
                        )
                      }
                    />
                    <Label htmlFor="attendanceRegister">
                      Attendance Register
                    </Label>
                  </div>
                  <Input
                    name="totalFloorArea"
                    type="number"
                    value={center.assessment?.totalFloorArea}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "assessment",
                        "totalFloorArea",
                        e.target.value
                      )
                    }
                    placeholder="Total Floor Area (sq ft)"
                  />
                  <Button type="submit">Update Assessment</Button>
                </form>
              </TabsContent>

              <TabsContent value="legal">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="legalRegistration"
                    value={center.legalInfo?.legalRegistration}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "legalInfo",
                        "legalRegistration",
                        e.target.value
                      )
                    }
                    placeholder="Legal Registration"
                  />
                  <div>
                    <Label>Trade Areas</Label>
                    {center.legalInfo?.tradeAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mt-2">
                        <Input
                          value={area.tradeArea}
                          onChange={(e) => {
                            const newTradeAreas = [
                              ...center.legalInfo?.tradeAreas,
                            ];
                            newTradeAreas[index] = {
                              ...newTradeAreas[index],
                              tradeArea: e.target.value,
                            };
                            handleNestedInputChange(
                              "legalInfo",
                              "tradeAreas",
                              newTradeAreas
                            );
                          }}
                          placeholder="Trade Area"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newTradeAreas =
                              center.legalInfo?.tradeAreas.filter(
                                (_, i) => i !== index
                              );
                            handleNestedInputChange(
                              "legalInfo",
                              "tradeAreas",
                              newTradeAreas
                            );
                          }}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const newTradeAreas = [
                          ...(center.legalInfo?.tradeAreas || []),
                          { tradeArea: "" },
                        ];
                        handleNestedInputChange(
                          "legalInfo",
                          "tradeAreas",
                          newTradeAreas
                        );
                      }}
                      className="mt-2">
                      Add Trade Area
                    </Button>
                  </div>
                  <Button type="submit">Update Legal Info</Button>
                </form>
              </TabsContent>

              <TabsContent value="password">
                <PasswordChange />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TrainingDashboardPage>
  );
};

export default TrainingCenterBiodata;
