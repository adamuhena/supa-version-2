// import React, {useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { TabsContent } from "@/components/ui/tabs";
// import { states } from "../../../data/nigeria";

// const PersonalTab = ({ user, handleUpdate, submitChanges }) => {
//   const selectedStateLGASOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find(state => state.value === user.stateOfOrigin);
//     return (selectedState?.lgas || []).map(lga => ({
//       value: lga,
//       label: lga
//     }));
//   }, [user.stateOfOrigin]);

//   const selectedStateLGASResidenceFormatted = useMemo(() => {
//     if (!user.stateOfResidence) return [];
//     const selectedState = states.find(state => state.value === user.stateOfResidence);
//     return (selectedState?.lgas || []).map(lga => ({
//       value: lga,
//       label: lga
//     }));
//   }, [user.stateOfResidence]);

//   const selectedStateSenatorialDistrictsOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find(state => state.value === user.stateOfOrigin);
//     return (selectedState?.senatorialDistricts || []).map(district => ({
//       value: district,
//       label: district
//     }));
//   }, [user.stateOfOrigin]);

//   // Has Disability
// const [hasDisability, setHasDisability] = useState(user.hasDisability ? "yes" : "no");

// const handleRadioChange = (e) => {
//   const value = e.target.value;
//   setHasDisability(value);
//   handleUpdate("hasDisability", value === "yes");
//   if (value === "no") {
//     handleUpdate("disabilityType", "");
//   }
// };

// const handleChangeSelectedDIsablity = (value) => {
//   handleUpdate("disabilityType", value);
// };

// // const handleSubmit = () => {
// //   console.log('Submitting personal info:', user);
// //   submitChanges("personal"); // Changed from "personalInfo" to "personal"
// // };

// const handleSubmit = () => {
//   console.log("Submitting personal info:", user);
//   submitChanges("personal");
// };

//   return (
//     <TabsContent value="personal">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Personal Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[
//             "firstName",
//             "middleName",
//             "lastName",
//             "phoneNumber",
//             "nin",
//             "email",
//             "street",
//           ].map((field) => (
//             <div key={field} className="space-y-2">
//               <Label htmlFor={field}>
//                 {field
//                   .split(/(?=[A-Z])/)
//                   .join(" ")
//                   .charAt(0)
//                   .toUpperCase() +
//                   field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .slice(1)}
//               </Label>
//               <Input
//                 id={field}
//                 value={user[field] ?? ""}
//                 onChange={(e) => handleUpdate(field, e.target.value)}
//               />
//             </div>
//           ))}

//           {/* Add Date of Birth field separately */}
//           <div className="space-y-2">
//             <Label htmlFor="dob">Date of Birth</Label>
//             <Input
//               id="dob"
//               type="date"
//               value={user.dob ?? ""}
//               onChange={(e) => handleUpdate("dob", e.target.value)}
//             />
//           </div>
//           {["gender", "maritalStatus"].map((field) => (
//             <div key={field} className="space-y-2">
//               <Label htmlFor={field}>
//                 {field
//                   .split(/(?=[A-Z])/)
//                   .join(" ")
//                   .charAt(0)
//                   .toUpperCase() +
//                   field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .slice(1)}
//               </Label>
//               <Select
//                 onValueChange={(value) => handleUpdate(field, value)}
//                 value={user[field] ?? ""}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder={`Select ${field}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {field === "gender" ? (
//                     <>
//                       <SelectItem value="male">Male</SelectItem>
//                       <SelectItem value="female">Female</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </>
//                   ) : (
//                     <>
//                       <SelectItem value="single">Single</SelectItem>
//                       <SelectItem value="married">Married</SelectItem>
//                       <SelectItem value="divorced">Divorced</SelectItem>
//                       <SelectItem value="widowed">Widowed</SelectItem>
//                     </>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           ))}
//            {/* State of Origin */}
//             <div className="space-y-2">
//               <Label htmlFor="stateOfOrigin">State of Origin</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfOrigin", value)}
//                 value={user.stateOfOrigin ?? ""}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Origin" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* LGA of Origin */}
//             <div className="space-y-2">
//               <Label htmlFor="lga">LGA</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lga", value)}
//                 value={user.lga ?? ""}
//                 disabled={!user.stateOfOrigin}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASOriginFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Senatorial District */}
//             <div className="space-y-2">
//               <Label htmlFor="senatorialDistrict">Senatorial District</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("senatorialDistrict", value)}
//                 value={user.senatorialDistrict ?? ""}
//                 disabled={!user.stateOfOrigin}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Senatorial District" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateSenatorialDistrictsOriginFormatted.map((district) => (
//                     <SelectItem key={district.value} value={district.value}>
//                       {district.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* State of Residence */}
//             <div className="space-y-2">
//               <Label htmlFor="stateOfResidence">State of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfResidence", value)}
//                 value={user.stateOfResidence ?? ""}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* LGA of Residence */}
//             <div className="space-y-2">
//               <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lgaOfResidence", value)}
//                 value={user.lgaOfResidence ?? ""}
//                 disabled={!user.stateOfResidence}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASResidenceFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
          
//           {/* <div className="space-y-2">
//             <Label htmlFor="hasDisability">Has Disability</Label>
//             <Switch
//               id="hasDisability"
//               checked={user.hasDisability ?? false}
//               onCheckedChange={(checked) =>
//                 handleUpdate("hasDisability", checked)
//               }
//             />
//           </div>
//           {(user.hasDisability) && (
//             <div className="space-y-2">
//               <Label htmlFor="disabilityType">Disability Type</Label>
//               <Input
//                 id="disabilityType"
//                 value={user.disabilityType ?? ""}
//                 onChange={(e) =>
//                   handleUpdate("disabilityType", e.target.value)
//                 }
//               />
//             </div>
//           )} */}

//           {/* <div className="space-y-4">
//             <div className="radioGroup">
//               <div>
//                 <span>Are you a person with disability? </span>
//                 <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     id="yes"
//                     name="disability"
//                     value="yes"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "yes"}
//                   />
//                   <label htmlFor="yes">Yes</label>

//                   <input
//                     type="radio"
//                     id="no"
//                     name="disability"
//                     value="no"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "no"}
//                   />
//                   <label htmlFor="no">No</label>
//                 </div>

//                 {hasDisability === "yes" && (
//                   <div className="flex gap-2">
//                     <label
//                       className="block text-sm font-medium"
//                       htmlFor="disabilityType">
//                       Select your disability:
//                     </label>
//                     <Select 
//                       onValueChange={handleChangeSelectedDIsablity}
//                       value={user.disabilityType ?? ""}
//                     >
//                       <SelectTrigger id="disabilityType" className="w-[200px]">
//                         <SelectValue placeholder="-- Select --" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           <SelectLabel>Disability Types</SelectLabel>
//                           <SelectItem value="visual">Visual Impairment</SelectItem>
//                           <SelectItem value="hearing">Hearing Impairment</SelectItem>
//                           <SelectItem value="mobility">Mobility Impairment</SelectItem>
//                           <SelectItem value="cognitive">Cognitive Impairment</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div> */}
//         </div>

//         <div className="space-y-4 pt-6">
//             <div className="radioGroup">
              

//               <div className="flex items-start gap-4">
//               <div>
//                 <span>Are you a person with disability? </span>
//                 <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//               </div>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     id="yes"
//                     name="disability"
//                     value="yes"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "yes"}
//                   />
//                   <label htmlFor="yes">Yes</label>

//                   <input
//                     type="radio"
//                     id="no"
//                     name="disability"
//                     value="no"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "no"}
//                   />
//                   <label htmlFor="no">No</label>
//                 </div>

//                 {hasDisability === "yes" && (
//                   <div className="flex gap-2">
//                     <label
//                       className="block text-sm font-medium"
//                       htmlFor="disabilityType">
//                       Select your disability:
//                     </label>
//                     <Select 
//                       onValueChange={handleChangeSelectedDIsablity}
//                       value={user.disabilityType ?? ""}
//                     >
//                       <SelectTrigger id="disabilityType" className="w-[200px]">
//                         <SelectValue placeholder="-- Select --" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           <SelectLabel>Disability Types</SelectLabel>
//                           <SelectItem value="visual">Visual Impairment</SelectItem>
//                           <SelectItem value="hearing">Hearing Impairment</SelectItem>
//                           <SelectItem value="mobility">Mobility Impairment</SelectItem>
//                           <SelectItem value="cognitive">Cognitive Impairment</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
          
//         <Button 
//             onClick={handleSubmit} 
//             className="mt-4 bg-green-500 hover:bg-green-600"
//           >
//             Update Personal Information
//           </Button>
//         {/* <Button onClick={() => submitChanges("personalInfo")} className="mt-4">
//           Update Personal Information
//         </Button> */}
//         {/* <Button onClick={handleSubmit} className="mt-4">
//       Update Personal Information
//     </Button> */}
//       </CardContent>
//             </Card>
//           </TabsContent>
//   )
// }

// export default PersonalTab


// import React, { useState, useMemo } from "react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { TabsContent } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { states } from "../../../data/nigeria";

// const PersonalTab = ({ user, handleUpdate, submitChanges }) => {
//   const selectedStateLGASOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find((state) => state.value === user.stateOfOrigin);
//     return (selectedState?.lgas || []).map((lga) => ({
//       value: lga,
//       label: lga,
//     }));
//   }, [user.stateOfOrigin]);

//   const selectedStateLGASResidenceFormatted = useMemo(() => {
//     if (!user.stateOfResidence) return [];
//     const selectedState = states.find((state) => state.value === user.stateOfResidence);
//     return (selectedState?.lgas || []).map((lga) => ({
//       value: lga,
//       label: lga,
//     }));
//   }, [user.stateOfResidence]);

//   const selectedStateSenatorialDistrictsOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find((state) => state.value === user.stateOfOrigin);
//     return (selectedState?.senatorialDistricts || []).map((district) => ({
//       value: district,
//       label: district,
//     }));
//   }, [user.stateOfOrigin]);

//   const [hasDisability, setHasDisability] = useState(user.hasDisability ? "yes" : "no");

//   const handleRadioChange = (e) => {
//     const value = e.target.value;
//     setHasDisability(value);
//     handleUpdate("hasDisability", value === "yes");

//     if (value === "no") {
//       handleUpdate("disabilityType", "");
//     }
//   };

//   const handleChangeSelectedDisability = (value) => {
//     handleUpdate("disabilityType", value);
//   };

//   const handleSubmit = () => {
//     console.log("Submitting personal info:", user);
//     submitChanges("personal");
//   };

//   return (
//     <TabsContent value="personal">
//       <Card>
//         <CardHeader>
//           <CardTitle>Personal Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               "firstName",
//               "middleName",
//               "lastName",
//               "phoneNumber",
//               "nin",
//               "email",
//               "street",
//             ].map((field) => (
//               <div key={field} className="space-y-2">
//                 <Label htmlFor={field}>
//                   {field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .replace(/^./, (str) => str.toUpperCase())}
//                 </Label>
//                 <Input
//                   id={field}
//                   value={user[field] ?? ""}
//                   onChange={(e) => handleUpdate(field, e.target.value)}
//                 />
//               </div>
//             ))}

//             <div className="space-y-2">
//               <Label htmlFor="dob">Date of Birth</Label>
//               <Input
//                 id="dob"
//                 type="date"
//                 value={user.dob ?? ""}
//                 onChange={(e) => handleUpdate("dob", e.target.value)}
//               />
//             </div>

//             {["gender", "maritalStatus"].map((field) => (
//               <div key={field} className="space-y-2">
//                 <Label htmlFor={field}>
//                   {field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .replace(/^./, (str) => str.toUpperCase())}
//                 </Label>
//                 <Select
//                   onValueChange={(value) => handleUpdate(field, value)}
//                   value={user[field] ?? ""}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder={`Select ${field}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {field === "gender" ? (
//                       <>
//                         <SelectItem value="male">Male</SelectItem>
//                         <SelectItem value="female">Female</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </>
//                     ) : (
//                       <>
//                         <SelectItem value="single">Single</SelectItem>
//                         <SelectItem value="married">Married</SelectItem>
//                         <SelectItem value="divorced">Divorced</SelectItem>
//                         <SelectItem value="widowed">Widowed</SelectItem>
//                       </>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//             ))}

//             <div className="space-y-2">
//               <Label htmlFor="stateOfOrigin">State of Origin</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfOrigin", value)}
//                 value={user.stateOfOrigin ?? ""}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Origin" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="lga">LGA</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lga", value)}
//                 value={user.lga ?? ""}
//                 disabled={!user.stateOfOrigin}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASOriginFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="senatorialDistrict">Senatorial District</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("senatorialDistrict", value)}
//                 value={user.senatorialDistrict ?? ""}
//                 disabled={!user.stateOfOrigin}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Senatorial District" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateSenatorialDistrictsOriginFormatted.map((district) => (
//                     <SelectItem key={district.value} value={district.value}>
//                       {district.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="stateOfResidence">State of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfResidence", value)}
//                 value={user.stateOfResidence ?? ""}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lgaOfResidence", value)}
//                 value={user.lgaOfResidence ?? ""}
//                 disabled={!user.stateOfResidence}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASResidenceFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-4 pt-6">
//             <div className="flex items-start gap-4">
//               <div>
//                 <span>Are you a person with disability?</span>
//                 <span className="text-red-600 ml-1 text-sm">*</span>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     id="yes"
//                     name="disability"
//                     value="yes"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "yes"}
//                   />
//                   <label htmlFor="yes">Yes</label>

//                   <input
//                     type="radio"
//                     id="no"
//                     name="disability"
//                     value="no"
//                     onChange={handleRadioChange}
//                     checked={hasDisability === "no"}
//                   />
//                   <label htmlFor="no">No</label>
//                 </div>

//                 {hasDisability === "yes" && (
//                   <div className="flex gap-2">
//                     <label
//                       htmlFor="disabilityType"
//                       className="block text-sm font-medium"
//                     >
//                       Select your disability:
//                     </label>
//                     <Select
//                       onValueChange={handleChangeSelectedDisability}
//                       value={user.disabilityType ?? ""}
//                     >
//                       <SelectTrigger id="disabilityType" className="w-52">
//                         <SelectValue placeholder="-- Select --" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           <SelectLabel>Disability Types</SelectLabel>
//                           <SelectItem value="visual">Visual Impairment</SelectItem>
//                           <SelectItem value="hearing">Hearing Impairment</SelectItem>
//                           <SelectItem value="mobility">Mobility Impairment</SelectItem>
//                           <SelectItem value="cognitive">Cognitive Impairment</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={handleSubmit}
//             className="mt-6 bg-green-500 hover:bg-green-600"
//           >
//             Update Personal Information
//           </Button>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default PersonalTab;

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { states } from "../../../data/nigeria";

const PersonalTab = ({ user, handleUpdate, submitChanges }) => {
  // Check if user is admin/superadmin to determine edit permissions
  const isEditable =  user?.role === "superadmin";
  
  const selectedStateLGASOriginFormatted = useMemo(() => {
    if (!user.stateOfOrigin) return [];
    const selectedState = states.find(state => state.value === user.stateOfOrigin);
    return (selectedState?.lgas || []).map(lga => ({
      value: lga,
      label: lga
    }));
  }, [user.stateOfOrigin]);

  const selectedStateLGASResidenceFormatted = useMemo(() => {
    if (!user.stateOfResidence) return [];
    const selectedState = states.find(state => state.value === user.stateOfResidence);
    return (selectedState?.lgas || []).map(lga => ({
      value: lga,
      label: lga
    }));
  }, [user.stateOfResidence]);

  const selectedStateSenatorialDistrictsOriginFormatted = useMemo(() => {
    if (!user.stateOfOrigin) return [];
    const selectedState = states.find(state => state.value === user.stateOfOrigin);
    return (selectedState?.senatorialDistricts || []).map(district => ({
      value: district,
      label: district
    }));
  }, [user.stateOfOrigin]);

  // Initialize hasDisability state based on user data
  const [hasDisability, setHasDisability] = useState(user.hasDisability ? "yes" : "no");

  // Update hasDisability state when user data changes
  useEffect(() => {
    setHasDisability(user.hasDisability ? "yes" : "no");
  }, [user.hasDisability]);

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setHasDisability(value);
    handleUpdate("hasDisability", value === "yes");
    if (value === "no") {
      handleUpdate("disabilityType", "");
    }
  };

  const handleChangeSelectedDisability = (value) => {
    handleUpdate("disabilityType", value);
  };

  const handleSubmit = () => {
    console.log("Submitting personal info:", user);
    submitChanges("personal");
  };

  return (
    // <Tabs value="personal">
    //   <TabsContent value="personal">
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
                    readOnly={!isEditable}
                    className={!isEditable ? "cursor-not-allowed opacity-70" : ""}
                  />
                </div>
              ))}

              {/* Date of Birth field */}
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={user.dob ?? ""}
                  onChange={(e) => handleUpdate("dob", e.target.value)}
                  readOnly={!isEditable}
                  className={!isEditable ? "cursor-not-allowed opacity-70" : ""}
                />
              </div>

              {/* Gender and Marital Status */}
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
                    disabled={!isEditable}
                  >
                    <SelectTrigger className={!isEditable ? "cursor-not-allowed opacity-70" : ""}>
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

              {/* State of Origin */}
              <div className="space-y-2">
                <Label htmlFor="stateOfOrigin">State of Origin</Label>
                <Select
                  onValueChange={(value) => handleUpdate("stateOfOrigin", value)}
                  value={user.stateOfOrigin ?? ""}
                  disabled={!isEditable}
                >
                  <SelectTrigger className={!isEditable ? "cursor-not-allowed opacity-70" : ""}>
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

              {/* LGA of Origin */}
              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Select
                  onValueChange={(value) => handleUpdate("lga", value)}
                  value={user.lga ?? ""}
                  disabled={!user.stateOfOrigin || !isEditable}
                >
                  <SelectTrigger className={!user.stateOfOrigin || !isEditable ? "cursor-not-allowed opacity-70" : ""}>
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

              {/* Senatorial District */}
              <div className="space-y-2">
                <Label htmlFor="senatorialDistrict">Senatorial District</Label>
                <Select
                  onValueChange={(value) => handleUpdate("senatorialDistrict", value)}
                  value={user.senatorialDistrict ?? ""}
                  disabled={!user.stateOfOrigin || !isEditable}
                >
                  <SelectTrigger className={!user.stateOfOrigin || !isEditable ? "cursor-not-allowed opacity-70" : ""}>
                    <SelectValue placeholder="Select Senatorial District" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedStateSenatorialDistrictsOriginFormatted.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State of Residence */}
              <div className="space-y-2">
                <Label htmlFor="stateOfResidence">State of Residence</Label>
                <Select
                  onValueChange={(value) => handleUpdate("stateOfResidence", value)}
                  value={user.stateOfResidence ?? ""}
                  disabled={!isEditable}
                >
                  <SelectTrigger className={!isEditable ? "cursor-not-allowed opacity-70" : ""}>
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

              {/* LGA of Residence */}
              <div className="space-y-2">
                <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
                <Select
                  onValueChange={(value) => handleUpdate("lgaOfResidence", value)}
                  value={user.lgaOfResidence ?? ""}
                  disabled={!user.stateOfResidence || !isEditable}
                >
                  <SelectTrigger className={!user.stateOfResidence || !isEditable ? "cursor-not-allowed opacity-70" : ""}>
                    <SelectValue placeholder="Select LGA of Residence" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedStateLGASResidenceFormatted.map((lga) => (
                      <SelectItem key={lga.value} value={lga.value}>
                        {lga.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Disability Section */}
            <div className="space-y-4 pt-6 border-t mt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div>
                  <span>Are you a person with disability?</span>
                  <span className="text-red-600 ml-1 text-sm">*</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="yes"
                        name="disability"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={hasDisability === "yes"}
                        disabled={!isEditable}
                        className={!isEditable ? "cursor-not-allowed opacity-70" : ""}
                      />
                      <label htmlFor="yes" className={!isEditable ? "cursor-not-allowed opacity-70" : ""}>Yes</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="no"
                        name="disability"
                        value="no"
                        onChange={handleRadioChange}
                        checked={hasDisability === "no"}
                        disabled={!isEditable}
                        className={!isEditable ? "cursor-not-allowed opacity-70" : ""}
                      />
                      <label htmlFor="no" className={!isEditable ? "cursor-not-allowed opacity-70" : ""}>No</label>
                    </div>
                  </div>

                  {hasDisability === "yes" && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label
                        htmlFor="disabilityType"
                        className={`block text-sm font-medium ${!isEditable ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        Select your disability:
                      </label>
                      <Select
                        onValueChange={handleChangeSelectedDisability}
                        value={user.disabilityType ?? ""}
                        disabled={!isEditable}
                      >
                        <SelectTrigger id="disabilityType" className={`w-full md:w-52 ${!isEditable ? "cursor-not-allowed opacity-70" : ""}`}>
                          <SelectValue placeholder="-- Select --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Disability Types</SelectLabel>
                            <SelectItem value="visual">Visual Impairment</SelectItem>
                            <SelectItem value="hearing">Hearing Impairment</SelectItem>
                            <SelectItem value="mobility">Mobility Impairment</SelectItem>
                            <SelectItem value="cognitive">Cognitive Impairment</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditable && (
              <Button
                onClick={handleSubmit}
                className="mt-6 bg-green-500 hover:bg-green-600"
              >
                Update Personal Information
              </Button>
            )}
          </CardContent>
        </Card>
    //   </TabsContent>
    // </Tabs>
  );
};

export default PersonalTab;


// import React, { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { TabsContent } from "@/components/ui/tabs";
// import { states } from "../../../data/nigeria";

// const PersonalTab = ({ user, handleUpdate, submitChanges }) => {
//   const selectedStateLGASOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find(state => state.value === user.stateOfOrigin);
//     return (selectedState?.lgas || []).map(lga => ({
//       value: lga,
//       label: lga
//     }));
//   }, [user.stateOfOrigin]);

//   const selectedStateLGASResidenceFormatted = useMemo(() => {
//     if (!user.stateOfResidence) return [];
//     const selectedState = states.find(state => state.value === user.stateOfResidence);
//     return (selectedState?.lgas || []).map(lga => ({
//       value: lga,
//       label: lga
//     }));
//   }, [user.stateOfResidence]);

//   const selectedStateSenatorialDistrictsOriginFormatted = useMemo(() => {
//     if (!user.stateOfOrigin) return [];
//     const selectedState = states.find(state => state.value === user.stateOfOrigin);
//     return (selectedState?.senatorialDistricts || []).map(district => ({
//       value: district,
//       label: district
//     }));
//   }, [user.stateOfOrigin]);

//   const [hasDisability, setHasDisability] = useState(user.hasDisability ? "yes" : "no");

//   const handleRadioChange = (e) => {
//     const value = e.target.value;
//     setHasDisability(value);
//     handleUpdate("hasDisability", value === "yes");
//     if (value === "no") {
//       handleUpdate("disabilityType", "");
//     }
//   };

//   const handleChangeSelectedDIsablity = (value) => {
//     handleUpdate("disabilityType", value);
//   };

//   const handleSubmit = () => {
//     console.log("Submitting personal info:", user);
//     submitChanges("personal");
//   };

//   const isEditable = user.role === "admin" || user.role === "superadmin"; // Check if the user is admin or superadmin

//   return (
//     <TabsContent value="personal">
//       <Card>
//         <CardHeader>
//           <CardTitle>Personal Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               "firstName",
//               "middleName",
//               "lastName",
//               "phoneNumber",
//               "nin",
//               "email",
//               "street",
//             ].map((field) => (
//               <div key={field} className="space-y-2">
//                 <Label htmlFor={field}>
//                   {field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .charAt(0)
//                     .toUpperCase() +
//                     field
//                       .split(/(?=[A-Z])/)
//                       .join(" ")
//                       .slice(1)}
//                 </Label>
//                 <Input
//                   id={field}
//                   value={user[field] ?? ""}
//                   onChange={(e) => handleUpdate(field, e.target.value)}
//                   disabled={!isEditable} // Disable input if not admin or superadmin
//                 />
//               </div>
//             ))}

//             {/* Add Date of Birth field separately */}
//             <div className="space-y-2">
//               <Label htmlFor="dob">Date of Birth</Label>
//               <Input
//                 id="dob"
//                 type="date"
//                 value={user.dob ?? ""}
//                 onChange={(e) => handleUpdate("dob", e.target.value)}
//                 disabled={!isEditable} // Disable input if not admin or superadmin
//               />
//             </div>
//             {["gender", "maritalStatus"].map((field) => (
//               <div key={field} className="space-y-2">
//                 <Label htmlFor={field}>
//                   {field
//                     .split(/(?=[A-Z])/)
//                     .join(" ")
//                     .charAt(0)
//                     .toUpperCase() +
//                     field
//                       .split(/(?=[A-Z])/)
//                       .join(" ")
//                       .slice(1)}
//                 </Label>
//                 {/* <Select
//                   onValueChange={(value) => handleUpdate(field, value)}
//                   value={user[field] ?? ""}
//                   disabled={!isEditable} // Disable select if not admin or superadmin
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder={`Select ${field}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {field === "gender" ? (
//                       <>
//                         <SelectItem value="male">Male</SelectItem>
//                         <SelectItem value="female">Female</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </>
//                     ) : (
//                       <>
//                         <SelectItem value="single">Single</SelectItem>
//                         <SelectItem value="married">Married</SelectItem>
//                         <SelectItem value="divorced">Divorced</SelectItem>
//                         <SelectItem value="widowed">Widowed</SelectItem>
//                       </>
//                     )}
//                   </SelectContent>
//                 </Select> */}
//                 <Select
//   onValueChange={(value) => {
//     handleUpdate(field, value);
//     console.log(`${field} updated to: ${value}`);
//   }}
//   value={user[field] || ""} // ensure it has a valid value
//   disabled={!isEditable}
// >
//   <SelectTrigger>
//     <SelectValue placeholder={`Select ${field}`} />
//   </SelectTrigger>
//   <SelectContent>
//     {field === "gender" ? (
//       <>
//         <SelectItem value="male">Male</SelectItem>
//         <SelectItem value="female">Female</SelectItem>
//         <SelectItem value="other">Other</SelectItem>
//       </>
//     ) : (
//       <>
//         <SelectItem value="single">Single</SelectItem>
//         <SelectItem value="married">Married</SelectItem>
//         <SelectItem value="divorced">Divorced</SelectItem>
//         <SelectItem value="widowed">Widowed</SelectItem>
//       </>
//     )}
//   </SelectContent>
// </Select>

//               </div>
//             ))}
//             {/* State of Origin */}
//             <div className="space-y-2">
//               <Label htmlFor="stateOfOrigin">State of Origin</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfOrigin", value)}
//                 value={user.stateOfOrigin ?? ""}
//                 disabled={!isEditable} // Disable select if not admin or superadmin
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Origin" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* LGA of Origin */}
//             <div className="space-y-2">
//               <Label htmlFor="lga">LGA</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lga", value)}
//                 value={user.lga ?? ""}
//                 disabled={!user.stateOfOrigin || !isEditable} // Disable select if not admin or superadmin
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASOriginFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Senatorial District */}
//             <div className="space-y-2">
//               <Label htmlFor="senatorialDistrict">Senatorial District</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("senatorialDistrict", value)}
//                 value={user.senatorialDistrict ?? ""}
//                 disabled={!user.stateOfOrigin || !isEditable} // Disable select if not admin or superadmin
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Senatorial District" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateSenatorialDistrictsOriginFormatted.map((district) => (
//                     <SelectItem key={district.value} value={district.value}>
//                       {district.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* State of Residence */}
//             <div className="space-y-2">
//               <Label htmlFor="stateOfResidence">State of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("stateOfResidence", value)}
//                 value={user.stateOfResidence ?? ""}
//                 disabled={!isEditable} // Disable select if not admin or superadmin
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select State of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* LGA of Residence */}
//             <div className="space-y-2">
//               <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
//               <Select
//                 onValueChange={(value) => handleUpdate("lgaOfResidence", value)}
//                 value={user.lgaOfResidence ?? ""}
//                 disabled={!user.stateOfResidence || !isEditable} // Disable select if not admin or superadmin
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select LGA of Residence" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedStateLGASResidenceFormatted.map((lga) => (
//                     <SelectItem key={lga.value} value={lga.value}>
//                       {lga.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <Button
//             onClick={handleSubmit}
//             className="mt-4 bg-green-500 hover:bg-green-600"
//             disabled={!isEditable} // Disable button if not admin or superadmin
//           >
//             Update Personal Information
//           </Button>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default PersonalTab;

