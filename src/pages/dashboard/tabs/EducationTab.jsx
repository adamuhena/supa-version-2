// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { TabsContent } from "@/components/ui/tabs";
// import UploadButton from "@/components/UploadButton";
// import { FilePreview } from "@/components/FilePreview";
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select";

// const qualifications = [
//   "Primary School Certificate",
//   "Secondary School Certificate (SSCE)",
//   "National Diploma (ND)",
//   "Higher National Diploma (HND)", 
//   "Bachelor's Degree (B.Sc/B.A/B.Tech)",
//   "Master's Degree (M.Sc/M.A/M.Tech)",
//   "Doctorate Degree (Ph.D)",
//   "Professional Certification",
//   "Others"
// ];

// const EducationTab = ({ user, handleFileUpload, handleUpdate, submitChanges }) => {
//     const [changes, setChanges] = useState({
//         school: user.education?.school || "",
//         highestQualification: user.education?.highestQualification || "",
//         graduationYear: user.education?.graduationYear || "",
//         eduUpload: user.education?.eduUpload || ""
//       });
    
//       // Add validation for graduation year
//       const currentYear = new Date().getFullYear();
//       const minYear = 1900;

//   const handleChange = (field, value) => {
//     setChanges(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     handleUpdate(`education.${field}`, value);
//   };

//   const handleSubmit = () => {
//     console.log("Submitting personal info:", user);
//     submitChanges("education");
//   };

//   return (
//     <TabsContent value="education">
//       <Card>
//         <CardHeader>
//           <CardTitle>Education</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="education-school">School</Label>
//               <Input
//                 id="education-school"
//                 value={changes.school}
//                 onChange={(e) => handleChange("school", e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="education-highestQualification">Highest Qualification</Label>
//               <Select
//                 value={changes.highestQualification}
//                 onValueChange={(value) => handleChange("highestQualification", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select highest qualification" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {qualifications.map((qual) => (
//                     <SelectItem key={qual} value={qual}>
//                       {qual}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="education-graduationYear">Graduation Year</Label>
//               <Input
//                 id="education-graduationYear"
//                 type="number" 
//                 min={minYear}
//                 max={currentYear}
//                 value={changes.graduationYear}
//                 onChange={(e) => {
//                   const value = Math.max(minYear, Math.min(currentYear, Number(e.target.value)));
//                   handleChange("graduationYear", value.toString());
//                 }}
//                 placeholder={`Enter year between ${minYear} and ${currentYear}`}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Education Document</Label>
//               <div className="flex items-center gap-4">
//                 <UploadButton
//                   fileUrl={user.education?.eduUpload || changes.eduUpload}
//                   handleFileChange={(url) => handleChange("eduUpload", url)}
//                   removeFile={() => handleChange("eduUpload", "")}
//                 />
//                 {(user.education?.eduUpload || changes.eduUpload) && (
//                   <FilePreview fileUrl={user.education?.eduUpload || changes.eduUpload} />
//                 )}
//               </div>
//             </div>

//             <Button
//               onClick={handleSubmit}
//               className="mt-4">
//               Update Education
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default EducationTab;


import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import UploadButton from "@/components/UploadButton";
import { FilePreview } from "@/components/FilePreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const qualifications = [
  {
    value: "none",
    label: "None"
  },
  {
    value: "pslc",
    label: "Primary School Leaving Certificate (PSLC)"
  },
  {
    value: "ssec",
    label: "Senior Secondary Education Certificate (SSEC)"
  },
  {
    value: "graduate",
    label: "Graduate"
  },
  {
    value: "post-graduate",
    label: "Post-Graduate"
  }
];
const EducationTab = ({ user, handleUpdate, submitChanges }) => {
  // Add validation for graduation year
  const currentYear = new Date().getFullYear();
  const minYear = 1900;

  const handleChange = (field, value) => {
    // Update the nested education object
    const updatedEducation = {
      ...user.education,
      [field]: value
    };
    
    handleUpdate("education", updatedEducation);
  };

  const handleSubmit = () => {
    submitChanges("education");
  };

  return (
    <TabsContent value="education">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education-school">School</Label>
              <Input
                id="education-school"
                value={user.education?.school || ""}
                onChange={(e) => handleChange("school", e.target.value)}
              />
            </div>


<div className="space-y-2">
  <Label htmlFor="education-highestQualification">Highest Qualification</Label>
  <Select
    value={user.education?.highestQualification || ""}
    onValueChange={(value) => handleChange("highestQualification", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select highest qualification" />
    </SelectTrigger>
    <SelectContent>
      {qualifications.map((qual) => (
        <SelectItem key={qual.value} value={qual.value}>
          {qual.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

            <div className="space-y-2">
              <Label htmlFor="education-graduationYear">Graduation Year</Label>
              <Input
                id="education-graduationYear"
                type="number" 
                min={minYear}
                max={currentYear}
                value={user.education?.graduationYear || ""}
                onChange={(e) => {
                  const value = Math.max(minYear, Math.min(currentYear, Number(e.target.value)));
                  handleChange("graduationYear", value.toString());
                }}
                placeholder={`Enter year between ${minYear} and ${currentYear}`}
              />
            </div>

            <div className="space-y-2">
              <Label>Education Document</Label>
              <div className="flex items-center gap-4">
                <UploadButton
                  fileUrl={user.education?.eduUpload || ""}
                  handleFileChange={(url) => handleChange("eduUpload", url)}
                  removeFile={() => handleChange("eduUpload", "")}
                />
                {user.education?.eduUpload && (
                  <FilePreview fileUrl={user.education.eduUpload} />
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="mt-4 bg-green-500 hover:bg-green-600"
              disabled={true} >
              Update Education
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default EducationTab;