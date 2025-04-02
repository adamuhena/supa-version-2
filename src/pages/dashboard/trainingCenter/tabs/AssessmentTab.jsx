// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const AssessmentTab = ({
//   center,
//   handleNestedInputChange,
//   handleInputChange,
//   handleSubmit,
// }) => {
//   return (
//     <TabsContent value="assessment">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           name="traineeInstructorRatio"
//           value={center.assessment?.traineeInstructorRatio}
//           onChange={(e) =>
//             handleNestedInputChange(
//               "assessment",
//               "traineeInstructorRatio",
//               e.target.value
//             )
//           }
//           placeholder="Trainee-Instructor Ratio"
//         />
//         <Input
//           name="practicalTheoryRatio"
//           value={center.assessment?.practicalTheoryRatio}
//           onChange={(e) =>
//             handleNestedInputChange(
//               "assessment",
//               "practicalTheoryRatio",
//               e.target.value
//             )
//           }
//           placeholder="Practical-Theory Ratio"
//         />
//         <Input
//           name="trainingDurationPerDay"
//           value={center.assessment?.trainingDurationPerDay}
//           onChange={(e) =>
//             handleNestedInputChange(
//               "assessment",
//               "trainingDurationPerDay",
//               e.target.value
//             )
//           }
//           placeholder="Training Duration Per Day"
//         />
//         <Input
//           name="trainingDurationPerWeek"
//           value={center.assessment?.trainingDurationPerWeek}
//           onChange={(e) =>
//             handleNestedInputChange(
//               "assessment",
//               "trainingDurationPerWeek",
//               e.target.value
//             )
//           }
//           placeholder="Training Duration Per Week"
//         />
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="weeklyTrainingSchedule"
//             checked={center.assessment?.weeklyTrainingSchedule === "yes"}
//             onCheckedChange={(checked) =>
//               handleNestedInputChange(
//                 "assessment",
//                 "weeklyTrainingSchedule",
//                 checked ? "yes" : "no"
//               )
//             }
//           />
//           <Label htmlFor="weeklyTrainingSchedule">
//             Weekly Training Schedule
//           </Label>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="trainingCurriculum"
//             checked={center.assessment?.trainingCurriculum === "yes"}
//             onCheckedChange={(checked) =>
//               handleNestedInputChange(
//                 "assessment",
//                 "trainingCurriculum",
//                 checked ? "yes" : "no"
//               )
//             }
//           />
//           <Label htmlFor="trainingCurriculum">Training Curriculum</Label>
//         </div>
//         {center.assessment?.trainingCurriculum === "yes" && (
//           <Input
//             name="curriculumAttachment"
//             type="file"
//             onChange={(e) =>
//               handleNestedInputChange(
//                 "assessment",
//                 "curriculumAttachment",
//                 e.target.files[0]
//               )
//             }
//           />
//         )}
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="attendanceRegister"
//             checked={center.assessment?.attendanceRegister === "yes"}
//             onCheckedChange={(checked) =>
//               handleNestedInputChange(
//                 "assessment",
//                 "attendanceRegister",
//                 checked ? "yes" : "no"
//               )
//             }
//           />
//           <Label htmlFor="attendanceRegister">Attendance Register</Label>
//         </div>
//         <Input
//           name="totalFloorArea"
//           type="number"
//           value={center.assessment?.totalFloorArea}
//           onChange={(e) =>
//             handleNestedInputChange(
//               "assessment",
//               "totalFloorArea",
//               e.target.value
//             )
//           }
//           placeholder="Total Floor Area (sq ft)"
//         />
//         <Button
//           disabled
//           type="submit"
//           className="mt-4 bg-green-500 hover:bg-green-600">
//           Update Assessment
//         </Button>
//       </form>
//     </TabsContent>
//   );
// };

// export default AssessmentTab;

// "use client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import UploadButton from "@/components/UploadButton"

// const AssessmentTab = ({ center, handleNestedInputChange, handleSubmit }) => {
//   return (
//     <Tabs value="assessment">
//       <TabsContent value="assessment">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             name="traineeInstructorRatio"
//             value={center.assessment?.traineeInstructorRatio}
//             onChange={(e) => handleNestedInputChange("assessment", "traineeInstructorRatio", e.target.value)}
//             placeholder="Trainee-Instructor Ratio"
//           />
//           <Input
//             name="practicalTheoryRatio"
//             value={center.assessment?.practicalTheoryRatio}
//             onChange={(e) => handleNestedInputChange("assessment", "practicalTheoryRatio", e.target.value)}
//             placeholder="Practical-Theory Ratio"
//           />
//           <Input
//             name="trainingDurationPerDay"
//             value={center.assessment?.trainingDurationPerDay}
//             onChange={(e) => handleNestedInputChange("assessment", "trainingDurationPerDay", e.target.value)}
//             placeholder="Training Duration Per Day"
//           />
//           <Input
//             name="trainingDurationPerWeek"
//             value={center.assessment?.trainingDurationPerWeek}
//             onChange={(e) => handleNestedInputChange("assessment", "trainingDurationPerWeek", e.target.value)}
//             placeholder="Training Duration Per Week"
//           />
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="weeklyTrainingSchedule"
//               checked={center.assessment?.weeklyTrainingSchedule === "yes"}
//               onCheckedChange={(checked) =>
//                 handleNestedInputChange("assessment", "weeklyTrainingSchedule", checked ? "yes" : "no")
//               }
//             />
//             <Label htmlFor="weeklyTrainingSchedule">Weekly Training Schedule</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="trainingCurriculum"
//               checked={center.assessment?.trainingCurriculum === "yes"}
//               onCheckedChange={(checked) =>
//                 handleNestedInputChange("assessment", "trainingCurriculum", checked ? "yes" : "no")
//               }
//             />
//             <Label htmlFor="trainingCurriculum">Training Curriculum</Label>
//           </div>
//           {center.assessment?.trainingCurriculum === "yes" && (
//             <div>
//               <Label htmlFor="curriculumAttachment">Curriculum Attachment</Label>
//               <div className="mt-2">
//                 <UploadButton
//                   fileUrl={center.assessment?.curriculumAttachment}
//                   handleFileChange={(url) => {
//                     handleNestedInputChange("assessment", "curriculumAttachment", url)
//                   }}
//                   removeFile={() => {
//                     handleNestedInputChange("assessment", "curriculumAttachment", "")
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="attendanceRegister"
//               checked={center.assessment?.attendanceRegister === "yes"}
//               onCheckedChange={(checked) =>
//                 handleNestedInputChange("assessment", "attendanceRegister", checked ? "yes" : "no")
//               }
//             />
//             <Label htmlFor="attendanceRegister">Attendance Register</Label>
//           </div>
//           <Input
//             name="totalFloorArea"
//             type="number"
//             value={center.assessment?.totalFloorArea}
//             onChange={(e) => handleNestedInputChange("assessment", "totalFloorArea", e.target.value)}
//             placeholder="Total Floor Area (sq ft)"
//           />
//           <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600">
//             Update Assessment
//           </Button>
//         </form>
//       </TabsContent>
//     </Tabs>
//   )
// }

// export default AssessmentTab



"use client"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import UploadButton from "@/components/UploadButton"

const infrastructureTypes = [
  "Offices",
  "Classrooms",
  "Laboratory",
  "Workshops/Kitchen",
  "Libraries",
  "Assembly Hall",
  "Cafeterias",
  "Others (Specify)",
]

const utilityTypes = [
  "Functional Restrooms",
  "Illumination",
  "Waste water disposal",
  "Solid waste disposal",
  "Electricity",
  "Desk Support",
  "Recreational",
  "Others (specify)",
]

const AssessmentTab = ({ center, handleNestedInputChange, handleSubmit }) => {
  const updateInfrastructure = (type, value) => {
    const currentInfrastructure = Array.isArray(center.assessment?.infrastructure) 
      ? center.assessment.infrastructure 
      : []

    const existingIndex = currentInfrastructure.findIndex((item) => item.type === type)
    let updatedInfrastructure

    if (existingIndex >= 0) {
      updatedInfrastructure = [...currentInfrastructure]
      updatedInfrastructure[existingIndex] = {
        ...updatedInfrastructure[existingIndex],
        number: value,
      }
    } else {
      updatedInfrastructure = [...currentInfrastructure, { type, number: value }]
    }

    handleNestedInputChange("assessment", "infrastructure", updatedInfrastructure)
  }

  const updateUtility = (type, field, value) => {
    const currentUtilities = Array.isArray(center.assessment?.utilities) 
      ? center.assessment.utilities 
      : []

    const existingIndex = currentUtilities.findIndex((item) => item.type === type)
    let updatedUtilities

    if (existingIndex >= 0) {
      updatedUtilities = [...currentUtilities]
      updatedUtilities[existingIndex] = {
        ...updatedUtilities[existingIndex],
        [field]: value,
      }
    } else {
      updatedUtilities = [...currentUtilities, { type, [field]: value }]
    }

    handleNestedInputChange("assessment", "utilities", updatedUtilities)
  }

  return (
    <Tabs value="assessment">
      <TabsContent value="assessment">
        <form onSubmit={handleSubmit} 
          className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]"
        >
          <h1 className="text-left font-[700] text-[24px]">Training Centre Assessment</h1>

          <div className="space-y-6">
            {/* Trainee-Instructor Ratio */}
            <div className="flex items-center">
              <Label htmlFor="traineeInstructorRatio" className="w-[300px] text-left leading-[1.3]">
                15. What is the ratio of Trainee to Instructor?
              </Label>
              <Input
                id="traineeInstructorRatio"
                placeholder="e.g., 10:1"
                value={center.assessment?.traineeInstructorRatio || ""}
                onChange={(e) => handleNestedInputChange("assessment", "traineeInstructorRatio", e.target.value)}
              />
            </div>

            {/* Practical-Theory Ratio */}
            <div className="flex items-center">
              <Label htmlFor="practicalTheoryRatio" className="w-[300px] text-left leading-[1.3]">
                16. What is the ratio of practical to theory?
              </Label>
              <Input
                id="practicalTheoryRatio"
                placeholder="e.g., 70:30"
                value={center.assessment?.practicalTheoryRatio || ""}
                onChange={(e) => handleNestedInputChange("assessment", "practicalTheoryRatio", e.target.value)}
              />
            </div>

            {/* Training Duration Per Day */}
            <div className="flex items-center">
              <Label htmlFor="trainingDurationPerDay" className="w-[300px] text-left leading-[1.3]">
                17. What is the Training duration per day?
              </Label>
              <Input
                id="trainingDurationPerDay"
                placeholder="e.g., 8 hours"
                value={center.assessment?.trainingDurationPerDay || ""}
                onChange={(e) => handleNestedInputChange("assessment", "trainingDurationPerDay", e.target.value)}
              />
            </div>

            {/* Training Duration Per Week */}
            <div className="flex items-center">
              <Label htmlFor="trainingDurationPerWeek" className="w-[300px] text-left leading-[1.3]">
                18. What is the Training duration per week?
              </Label>
              <Input
                id="trainingDurationPerWeek"
                placeholder="e.g., 40 hours"
                value={center.assessment?.trainingDurationPerWeek || ""}
                onChange={(e) => handleNestedInputChange("assessment", "trainingDurationPerWeek", e.target.value)}
              />
            </div>

            {/* Weekly Training Schedule */}
            <div className="flex items-center">
              <Label htmlFor="weeklyTrainingSchedule" className="w-[300px] text-left leading-[1.3]">
                19. Does the Centre maintain weekly Training Schedule?
              </Label>
              <Select
                value={center.assessment?.weeklyTrainingSchedule || ""}
                onValueChange={(value) => handleNestedInputChange("assessment", "weeklyTrainingSchedule", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Training Curriculum */}
            <div className="flex items-center">
              <Label htmlFor="trainingCurriculum" className="w-[300px] text-left leading-[1.3]">
                20. Does the Centre have a Training Curriculum?
              </Label>
              <Select
                value={center.assessment?.trainingCurriculum || ""}
                onValueChange={(value) => handleNestedInputChange("assessment", "trainingCurriculum", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Curriculum Attachment */}
            {center.assessment?.trainingCurriculum === "yes" && (
              <div className="flex items-center">
                <Label htmlFor="curriculumAttachment" className="w-[300px] text-left leading-[1.3]">
                  If Yes, Please attach a copy.
                </Label>
                <UploadButton
                  fileUrl={center.assessment?.curriculumAttachment}
                  title="curriculumAttachment"
                  handleFileChange={(fileUrl) => handleNestedInputChange("assessment", "curriculumAttachment", fileUrl)}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                  removeFile={() => handleNestedInputChange("assessment", "curriculumAttachment", null)}
                />
              </div>
            )}

            {/* Attendance Register */}
            <div className="flex items-center">
              <Label htmlFor="attendanceRegister" className="w-[300px] text-left leading-[1.3]">
                21. Does the Centre keep attendance register?
              </Label>
              <Select
                value={center.assessment?.attendanceRegister || ""}
                onValueChange={(value) => handleNestedInputChange("assessment", "attendanceRegister", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Infrastructure Section */}
            <h2 className="text-left font-[600] text-[20px] mt-4">22. Infrastructure Available for Training:</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-100 font-semibold">
                <div className="p-2 border-r border-b border-gray-300">Type</div>
                <div className="p-2 border-b border-gray-300">Number</div>
              </div>
              {infrastructureTypes.map((type) => (
                <div key={type} className="grid grid-cols-2">
                  <div className="p-2 border-r border-b border-gray-300">{type}</div>
                  <div className="p-2 border-b border-gray-300">
                    <Input
                      type="number"
                      value={center.assessment?.infrastructure?.find((item) => item.type === type)?.number || ""}
                      onChange={(e) => updateInfrastructure(type, e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Utilities Section */}
            <h2 className="text-left font-[600] text-[20px] mt-4">23. Utilities/Services:</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="grid grid-cols-5 bg-gray-100 font-semibold">
                <div className="p-2 border-r border-b border-gray-300">Type</div>
                <div className="p-2 border-r border-b border-gray-300">Number</div>
                <div className="p-2 border-r border-b border-gray-300">Functional</div>
                <div className="p-2 border-r border-b border-gray-300">Not Functional</div>
                <div className="p-2 border-b border-gray-300">Remarks</div>
              </div>
              {utilityTypes.map((type) => (
                <div key={type} className="grid grid-cols-5">
                  <div className="p-2 border-r border-b border-gray-300">{type}</div>
                  {["number", "functional", "notFunctional", "remarks"].map((field) => (
                    <div key={field} className="p-2 border-r border-b border-gray-300">
                      <Input
                        type={field === "number" ? "number" : "text"}
                        value={center.assessment?.utilities?.find((item) => item.type === type)?.[field] || ""}
                        onChange={(e) => updateUtility(type, field, e.target.value)}
                        min={field === "number" ? "0" : undefined}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Total Floor Area */}
            <div className="flex items-center">
              <Label htmlFor="totalFloorArea" className="w-[300px] text-left leading-[1.3]">
                Total Floor Area (m²)
              </Label>
              <Input
                type="number"
                id="totalFloorArea"
                value={center.assessment?.totalFloorArea || ""}
                onChange={(e) => handleNestedInputChange("assessment", "totalFloorArea", e.target.value)}
                min="0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md mt-4"
          >
            Update Assessment
          </button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

export default AssessmentTab