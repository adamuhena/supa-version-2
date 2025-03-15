// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import "./index.css";
// import UploadButton from "@/components/UploadButton";

// const LegalInfo = ({ form, setForm, controlButtons }) => {
//     const updateField = (field, value) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//     };

//     const updateTradeArea = (index, field, value) => {
//         setForm((prev) => {
//             const updatedTradeAreas = [...(prev.tradeAreas || [])];
//             updatedTradeAreas[index] = {
//                 ...updatedTradeAreas[index],
//                 [field]: value,
//             };
//             return { ...prev, tradeAreas: updatedTradeAreas };
//         });
//     };

//     const addTradeArea = () => {
//         setForm((prev) => ({
//             ...prev,
//             tradeAreas: [
//                 ...(prev.tradeAreas || []),
//                 {
//                     sector: "",
//                     tradeArea: "",
//                     instructors: "",
//                     trainees: "",
//                     facilities: "",
//                     equipment: "",
//                     tools: "",
//                 },
//             ],
//         }));
//     };

//     return (
//         <div
//             style={{
//                 boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//                 marginBottom: "100px",
//                 background: "white",
//             }}
//             className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
//         >
//             <h1 className="text-left font-[700] text-[24px]">Legal and Trade Information</h1>

//             <div className="flex flex-col gap-2">
//                 <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
//                     13. Does the Centre have Legal Registration/Licensing from other authorities? Specify and attach copies of supporting documents if any (e.g. CAC, City & Guilds, etc.):
//                 </Label>
//                 <Textarea
//                     id="legalRegistration"
//                     placeholder="Enter legal registration details"
//                     value={form.legalRegistration || ""}
//                     onChange={(e) => updateField("legalRegistration", e.target.value)}
//                     className="min-h-[100px]"
//                 />
//             </div>

//             {/* <div className="flex flex-col gap-2">
//                 <Label htmlFor="supportingDocuments" className="text-left leading-[1.3]">
//                     Attach supporting documents:
//                 </Label>
//                 <Input
//                     type="file"
//                     id="supportingDocuments"
//                     onChange={(e) => updateField("supportingDocuments", e.target.files[0])}
//                     multiple
//                 />
//             </div> */}

//             <div className="flex flex-col gap-2">
//       <Label
//         htmlFor="supportingDocuments"
//         className="text-left leading-[1.3]"
//       >
//         Attach supporting documents:
//       </Label>
//       <UploadButton
//         fileUrl={form.supportingDocuments}
//         title="supportingDocuments"
//         handleFileChange={(newFileUrl) =>
//           updateField("supportingDocuments", newFileUrl)
//         }
//         accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//         removeFile={() => updateField("supportingDocuments", null)}
//       />
//       </div>

//             <h2 className="text-left font-[600] text-[20px] mt-4">14. Trade Area Profile:</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border border-gray-300 p-2">S/NO.</th>
//                         <th className="border border-gray-300 p-2">Sector</th>
//                         <th className="border border-gray-300 p-2">Trade Area</th>
//                         <th className="border border-gray-300 p-2">Number of Instructors</th>
//                         <th className="border border-gray-300 p-2">Number of Trainees that can be taken</th>
//                         <th className="border border-gray-300 p-2">Facilities</th>
//                         <th className="border border-gray-300 p-2">List of Equipment</th>
//                         <th className="border border-gray-300 p-2">List of Tools</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {(form.tradeAreas || []).map((trade, index) => (
//                         <tr key={index}>
//                             <td className="border border-gray-300 p-2">{index + 1}</td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     value={trade.sector || ""}
//                                     onChange={(e) => updateTradeArea(index, "sector", e.target.value)}
//                                     placeholder="Sector"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     value={trade.tradeArea || ""}
//                                     onChange={(e) => updateTradeArea(index, "tradeArea", e.target.value)}
//                                     placeholder="Trade Area"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     type="number"
//                                     value={trade.instructors || ""}
//                                     onChange={(e) => updateTradeArea(index, "instructors", e.target.value)}
//                                     placeholder="Number of Instructors"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     type="number"
//                                     value={trade.trainees || ""}
//                                     onChange={(e) => updateTradeArea(index, "trainees", e.target.value)}
//                                     placeholder="Number of Trainees"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     value={trade.facilities || ""}
//                                     onChange={(e) => updateTradeArea(index, "facilities", e.target.value)}
//                                     placeholder="Facilities"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     value={trade.equipment || ""}
//                                     onChange={(e) => updateTradeArea(index, "equipment", e.target.value)}
//                                     placeholder="List of Equipment"
//                                 />
//                             </td>
//                             <td className="border border-gray-300 p-2">
//                                 <Input
//                                     value={trade.tools || ""}
//                                     onChange={(e) => updateTradeArea(index, "tools", e.target.value)}
//                                     placeholder="List of Tools"
//                                 />
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Button
//                 onClick={addTradeArea}
//                 className="bg-blue-500 text-white px-4 py-2 rounded self-start"
//             >
//                 Add Trade Area
//             </Button>

//             <div className="flex flex-col gap-2">
//       <Label
//         htmlFor="instructorCredentials"
//         className="text-left leading-[1.3]"
//       >
//         Attach credentials of each Instructor:
//       </Label>
//       <UploadButton
//         fileUrl={form.instructorCredentials}
//         title="instructorCredentials"
//         handleFileChange={(newFileUrl) => {
//           // Update form to append new files to the existing array
//           const updatedFiles = form.instructorCredentials
//             ? [...form.instructorCredentials, newFileUrl]
//             : [newFileUrl];
//           updateField("instructorCredentials", updatedFiles);
//         }}
//         accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//         removeFile={() => updateField("instructorCredentials", null)}
//       />
//     </div>

//             <div className="flex flex-col gap-2">
//                 <Label htmlFor="additionalDetails" className="text-left leading-[1.3]">
//                     Additional Details (if necessary):
//                 </Label>
//                 <Textarea
//                     id="additionalDetails"
//                     placeholder="Enter any additional details"
//                     value={form.additionalDetails || ""}
//                     onChange={(e) => updateField("additionalDetails", e.target.value)}
//                     className="min-h-[100px]"
//                 />
//             </div>

//             {controlButtons}
//         </div>
//     );
// };

// export default LegalInfo;

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import UploadButton from "@/components/UploadButton";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { fetchSectors } from "@/services/api";

// const LegalInfo = ({ form, setForm, controlButtons }) => {
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch sectors on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await fetchSectors(accessToken);
//         setSectors(response);
//       } catch (err) {
//         setError("Failed to fetch sectors");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const updateField = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const updateTradeArea = (index, field, value) => {
//     setForm((prev) => {
//       const updatedTradeAreas = [...(prev.tradeAreas || [])];
//       updatedTradeAreas[index] = {
//         ...updatedTradeAreas[index],
//         [field]: value,
//       };
//       return { ...prev, tradeAreas: updatedTradeAreas };
//     });
//   };

//   const addTradeArea = () => {
//     setForm((prev) => ({
//       ...prev,
//       tradeAreas: [
//         ...(prev.tradeAreas || []),
//         {
//           sector: "",
//           tradeArea: "",
//           instructors: "",
//           trainees: "",
//           facilities: "",
//           equipment: "",
//           tools: "",
//         },
//       ],
//     }));
//   };

//   return (
//     <div
//       style={{
//         boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//         marginBottom: "100px",
//         background: "white",
//       }}
//       className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
//     >
//       <h1 className="text-left font-[700] text-[24px]">
//         Legal and Trade Information
//       </h1>

//       {/* Legal Registration */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
//           13. Does the Centre have Legal Registration/Licensing from other
//           authorities? Specify and attach copies of supporting documents if any
//           (e.g. CAC, City & Guilds, etc.):
//         </Label>
//         <Textarea
//           id="legalRegistration"
//           placeholder="Enter legal registration details"
//           value={form.legalRegistration || ""}
//           onChange={(e) => updateField("legalRegistration", e.target.value)}
//           className="min-h-[100px]"
//         />
//       </div>

//       {/* Supporting Documents */}
//       <div className="flex flex-col gap-2">
//         <Label
//           htmlFor="supportingDocuments"
//           className="text-left leading-[1.3]"
//         >
//           Attach supporting documents:
//         </Label>
//         <UploadButton
//           fileUrl={form.supportingDocuments}
//           title="supportingDocuments"
//           handleFileChange={(newFileUrl) =>
//             updateField("supportingDocuments", newFileUrl)
//           }
//           accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//           removeFile={() => updateField("supportingDocuments", null)}
//         />
//       </div>

//       {/* Trade Area Profile */}
//       <h2 className="text-left font-[600] text-[20px] mt-4">
//         14. Trade Area Profile:
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2">S/NO.</th>
//               <th className="border border-gray-300 p-2">Sector</th>
//               <th className="border border-gray-300 p-2">Trade Area</th>
//               <th className="border border-gray-300 p-2">Instructors</th>
//               <th className="border border-gray-300 p-2">Trainees</th>
//               <th className="border border-gray-300 p-2">Facilities</th>
//               <th className="border border-gray-300 p-2">Equipment</th>
//               <th className="border border-gray-300 p-2">Tools</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(form.tradeAreas || []).map((trade, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 p-2">{index + 1}</td>

//                 {/* Sector Dropdown */}
//                 <td className="border border-gray-300 p-2">
//                   <Select
//                     value={trade.sector}
//                     onValueChange={(value) =>
//                       updateTradeArea(index, "sector", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Sector" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         {sectors.map((sector) => (
//                           <SelectItem key={sector._id} value={sector.name}>
//                             {sector.name}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </td>

//                 {/* Trade Area Dropdown */}
//                 <td className="border border-gray-300 p-2">
//                   <Select
//                     value={trade.tradeArea}
//                     onValueChange={(value) =>
//                       updateTradeArea(index, "tradeArea", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Trade Area" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         {sectors
//                           .find((sector) => sector.name === trade.sector)
//                           ?.tradeAreas?.map((ta) => (
//                             <SelectItem key={ta._id} value={ta.name}>
//                               {ta.name}
//                             </SelectItem>
//                           ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </td>

//                 {/* Instructors */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     type="number"
//                     value={trade.instructors || ""}
//                     onChange={(e) =>
//                       updateTradeArea(index, "instructors", e.target.value)
//                     }
//                     placeholder="Instructors"
//                   />
//                 </td>

//                 {/* Trainees */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     type="number"
//                     value={trade.trainees || ""}
//                     onChange={(e) =>
//                       updateTradeArea(index, "trainees", e.target.value)
//                     }
//                     placeholder="Trainees"
//                   />
//                 </td>

//                 {/* Facilities */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.facilities || ""}
//                     onChange={(e) =>
//                       updateTradeArea(index, "facilities", e.target.value)
//                     }
//                     placeholder="Facilities"
//                   />
//                 </td>

//                 {/* Equipment */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.equipment || ""}
//                     onChange={(e) =>
//                       updateTradeArea(index, "equipment", e.target.value)
//                     }
//                     placeholder="Equipment"
//                   />
//                 </td>

//                 {/* Tools */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.tools || ""}
//                     onChange={(e) =>
//                       updateTradeArea(index, "tools", e.target.value)
//                     }
//                     placeholder="Tools"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Trade Area Button */}
//       <Button
//         onClick={addTradeArea}
//         className="bg-blue-500 text-white px-4 py-2 rounded self-start"
//       >
//         Add Trade Area
//       </Button>

//       {/* Instructor Credentials */}
//       <div className="flex flex-col gap-2">
//         <Label
//           htmlFor="instructorCredentials"
//           className="text-left leading-[1.3]"
//         >
//           Attach credentials of each Instructor:
//         </Label>
//         <UploadButton
//           fileUrl={form.instructorCredentials}
//           title="instructorCredentials"
//           handleFileChange={(newFileUrl) => {
//             const updatedFiles = form.instructorCredentials
//               ? [...form.instructorCredentials, newFileUrl]
//               : [newFileUrl];
//             updateField("instructorCredentials", updatedFiles);
//           }}
//           accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//           removeFile={() => updateField("instructorCredentials", null)}
//         />
//       </div>

//       {/* Additional Details */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="additionalDetails" className="text-left leading-[1.3]">
//           Additional Details (if necessary):
//         </Label>
//         <Textarea
//           id="additionalDetails"
//           placeholder="Enter any additional details"
//           value={form.additionalDetails || ""}
//           onChange={(e) => updateField("additionalDetails", e.target.value)}
//           className="min-h-[100px]"
//         />
//       </div>

//       {controlButtons}
//     </div>
//   );
// };

// export default LegalInfo;

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import UploadButton from "@/components/UploadButton"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// import { fetchSectors } from "@/services/api"

// const LegalInfo = ({ form, setForm, controlButtons }) => {
//   const [sectors, setSectors] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Fetch sectors on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken")
//         const response = await fetchSectors(accessToken)
//         setSectors(response)
//       } catch (err) {
//         setError("Failed to fetch sectors")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const updateField = (field, value) => {
//     // Check if the field contains a dot notation for nested properties
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".")
//       setForm((prev) => ({
//         ...prev,
//         legalInfo: {
//           ...prev.legalInfo,
//           [parent]: {
//             ...(prev.legalInfo?.[parent] || {}),
//             [child]: value,
//           },
//         },
//       }))
//     } else {
//       // For direct properties of legalInfo
//       setForm((prev) => ({
//         ...prev,
//         legalInfo: {
//           ...prev.legalInfo,
//           [field]: value,
//         },
//       }))
//     }
//   }

//   // Update the tradeArea function to properly nest under legalInfo
//   const updateTradeArea = (index, field, value) => {
//     setForm((prev) => {
//       const updatedTradeAreas = [...(prev.legalInfo?.tradeAreas || [])]
//       updatedTradeAreas[index] = {
//         ...updatedTradeAreas[index],
//         [field]: value,
//       }
//       return {
//         ...prev,
//         legalInfo: {
//           ...prev.legalInfo,
//           tradeAreas: updatedTradeAreas,
//         },
//       }
//     })
//   }

//   const addTradeArea = () => {
//     setForm((prev) => ({
//       ...prev,
//       legalInfo: {
//         ...prev.legalInfo,
//         tradeAreas: [
//           ...(prev.legalInfo?.tradeAreas || []),
//           {
//             sector: "",
//             tradeArea: "",
//             instructors: "",
//             trainees: "",
//             facilities: "",
//             equipment: "",
//             tools: "",
//           },
//         ],
//       },
//     }))
//   }

//   return (
//     <div
//       style={{
//         boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//         marginBottom: "100px",
//         background: "white",
//       }}
//       className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
//     >
//       <h1 className="text-left font-[700] text-[24px]">Legal and Trade Information</h1>

//       {/* Legal Registration */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
//           13. Does the Centre have Legal Registration/Licensing from other authorities? Specify and attach copies of
//           supporting documents if any (e.g. CAC, City & Guilds, etc.):
//         </Label>
//         <Textarea
//           id="legalRegistration"
//           placeholder="Enter legal registration details"
//           value={form.legalInfo?.legalRegistration || ""}
//           onChange={(e) => updateField("legalRegistration", e.target.value)}
//           className="min-h-[100px]"
//         />
//       </div>

//       {/* Supporting Documents */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="supportingDocuments" className="text-left leading-[1.3]">
//           Attach supporting documents:
//         </Label>
//         <UploadButton
//           fileUrl={form.legalInfo?.supportingDocuments}
//           title="supportingDocuments"
//           handleFileChange={(newFileUrl) => updateField("supportingDocuments", newFileUrl)}
//           accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//           removeFile={() => updateField("supportingDocuments", null)}
//         />
//       </div>

//       {/* Trade Area Profile */}
//       <h2 className="text-left font-[600] text-[20px] mt-4">14. Trade Area Profile:</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2">S/NO.</th>
//               <th className="border border-gray-300 p-2">Sector</th>
//               <th className="border border-gray-300 p-2">Trade Area</th>
//               <th className="border border-gray-300 p-2">Instructors</th>
//               <th className="border border-gray-300 p-2">Trainees</th>
//               <th className="border border-gray-300 p-2">Facilities</th>
//               <th className="border border-gray-300 p-2">Equipment</th>
//               <th className="border border-gray-300 p-2">Tools</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(form.legalInfo?.tradeAreas || []).map((trade, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 p-2">{index + 1}</td>

//                 {/* Sector Dropdown */}
//                 <td className="border border-gray-300 p-2">
//                   <Select value={trade.sector} onValueChange={(value) => updateTradeArea(index, "sector", value)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Sector" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         {sectors.map((sector) => (
//                           <SelectItem key={sector._id} value={sector.name}>
//                             {sector.name}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </td>

//                 {/* Trade Area Dropdown */}
//                 <td className="border border-gray-300 p-2">
//                   <Select value={trade.tradeArea} onValueChange={(value) => updateTradeArea(index, "tradeArea", value)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Trade Area" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         {sectors
//                           .find((sector) => sector.name === trade.sector)
//                           ?.tradeAreas?.map((ta) => (
//                             <SelectItem key={ta._id} value={ta.name}>
//                               {ta.name}
//                             </SelectItem>
//                           ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </td>

//                 {/* Instructors */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     type="number"
//                     value={trade.instructors || ""}
//                     onChange={(e) => updateTradeArea(index, "instructors", e.target.value)}
//                     placeholder="Instructors"
//                   />
//                 </td>

//                 {/* Trainees */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     type="number"
//                     value={trade.trainees || ""}
//                     onChange={(e) => updateTradeArea(index, "trainees", e.target.value)}
//                     placeholder="Trainees"
//                   />
//                 </td>

//                 {/* Facilities */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.facilities || ""}
//                     onChange={(e) => updateTradeArea(index, "facilities", e.target.value)}
//                     placeholder="Facilities"
//                   />
//                 </td>

//                 {/* Equipment */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.equipment || ""}
//                     onChange={(e) => updateTradeArea(index, "equipment", e.target.value)}
//                     placeholder="Equipment"
//                   />
//                 </td>

//                 {/* Tools */}
//                 <td className="border border-gray-300 p-2">
//                   <Input
//                     value={trade.tools || ""}
//                     onChange={(e) => updateTradeArea(index, "tools", e.target.value)}
//                     placeholder="Tools"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Trade Area Button */}
//       <Button onClick={addTradeArea} className="bg-blue-500 text-white px-4 py-2 rounded self-start">
//         Add Trade Area
//       </Button>

//       {/* Instructor Credentials */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="instructorCredentials" className="text-left leading-[1.3]">
//           Attach credentials of each Instructor:
//         </Label>
//         <UploadButton
//           fileUrl={form.legalInfo?.instructorCredentials}
//           title="instructorCredentials"
//           handleFileChange={(newFileUrl) => {
//             const updatedFiles = form.legalInfo?.instructorCredentials
//               ? [...form.legalInfo?.instructorCredentials, newFileUrl]
//               : [newFileUrl]
//             updateField("instructorCredentials", updatedFiles)
//           }}
//           accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
//           removeFile={() => updateField("instructorCredentials", null)}
//         />
//       </div>

//       {/* Additional Details */}
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="additionalDetails" className="text-left leading-[1.3]">
//           Additional Details (if necessary):
//         </Label>
//         <Textarea
//           id="additionalDetails"
//           placeholder="Enter any additional details"
//           value={form.legalInfo?.additionalDetails || ""}
//           onChange={(e) => updateField("additionalDetails", e.target.value)}
//           className="min-h-[100px]"
//         />
//       </div>

//       {controlButtons}
//     </div>
//   )
// }

// export default LegalInfo

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/UploadButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchSectors } from "@/services/api";
import { CloudCog } from "lucide-react";

const LegalInfo = ({ form, setForm, controlButtons }) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sectors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetchSectors(accessToken);
        setSectors(response);
      } catch (err) {
        setError("Failed to fetch sectors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize legalInfo if it doesn't exist
  useEffect(() => {
    if (!form.legalInfo) {
      setForm((prev) => ({
        ...prev,
        legalInfo: {
          legalRegistration: "",
          supportingDocuments: [],
          tradeAreas: [],
          instructorCredentials: [],
          additionalDetails: "",
        },
      }));
    }
  }, []);

  const updateField = (field, value) => {
    // Check if the field contains a dot notation for nested properties
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setForm((prev) => ({
        ...prev,
        legalInfo: {
          ...prev.legalInfo,
          [parent]: {
            ...(prev.legalInfo?.[parent] || {}),
            [child]: value,
          },
        },
      }));
    } else {
      // For direct properties of legalInfo
      setForm((prev) => ({
        ...prev,
        legalInfo: {
          ...prev.legalInfo,
          [field]: value,
        },
      }));
    }
  };

  // Update the tradeArea function to properly nest under legalInfo
  const updateTradeArea = async (sector, field, value) => {
    if (
      field === "sector" &&
      (form?.legalInfo?.tradeAreas || []).find((i) => i?.sector === value)
    ) {
      return alert(`You cannot add the same sector twice`);
    }

    setForm((prev) => {
      // Make sure legalInfo and tradeAreas exist
      const legalInfo = prev.legalInfo || {};
      const tradeAreas = legalInfo?.tradeAreas || [];

      return {
        ...prev,
        legalInfo: {
          ...legalInfo,
          tradeAreas: tradeAreas.map((z) => {
            const x = { ...(z || {}) };

            if (x?.sector === sector) {
              if (field === "tradeArea") {
                const isArr = typeof x?.tradeArea === "object" ? true : false;

                const found = isArr
                  ? (x?.tradeArea || []).find((z) => z === value)
                  : false;
                console.log("found", found);

                if (found) {
                  x.tradeArea = (x?.tradeArea || []).filter((z) => z !== value);
                } else {
                  x.tradeArea = [...(isArr ? x?.tradeArea : []), value];
                }
              } else {
                x[field] = value;
              }
            }
            console.log("x", x);
            return x;
          }),
        },
      };
    });
  };

  const addTradeArea = () => {
    setForm((prev) => {
      // Make sure legalInfo exists
      const legalInfo = prev.legalInfo || {};

      return {
        ...prev,
        legalInfo: {
          ...legalInfo,
          tradeAreas: [
            ...(legalInfo.tradeAreas || []),
            {
              sector: `${new Date().getTime()}`,
              tradeArea: "",
              instructors: "",
              trainees: "",
              facilities: "",
              equipment: "",
              tools: "",
            },
          ],
        },
      };
    });
  };

  const removeTradearea = (sector) => {
    setForm((prev) => {
      // Make sure legalInfo and tradeAreas exist
      const legalInfo = prev.legalInfo || {};
      const tradeAreas = legalInfo?.tradeAreas || [];

      return {
        ...prev,
        legalInfo: {
          ...legalInfo,
          tradeAreas: tradeAreas.filter((x) => {
            return x?.sector !== sector;
          }),
        },
      };
    });
  };
  console.log(form?.legalInfo?.tradeAreas);
  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[1000px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700] text-[24px]">
        Legal and Trade Information
      </h1>

      {/* Legal Registration */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
          13. Does the Centre have Legal Registration/Licensing from other
          authorities? Specify and attach copies of supporting documents if any
          (e.g. CAC, City & Guilds, etc.):
        </Label>
        <Textarea
          id="legalRegistration"
          placeholder="Enter legal registration details"
          value={form.legalInfo?.legalRegistration || ""}
          onChange={(e) => updateField("legalRegistration", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Supporting Documents */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="supportingDocuments"
          className="text-left leading-[1.3]">
          Attach supporting documents:
        </Label>
        <UploadButton
          fileUrl={form.legalInfo?.supportingDocuments}
          title="supportingDocuments"
          handleFileChange={(newFileUrl) =>
            updateField("supportingDocuments", newFileUrl)
          }
          accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
          removeFile={() => updateField("supportingDocuments", null)}
        />
      </div>

      {/* Trade Area Profile */}
      <h2 className="text-left font-[600] text-[20px] mt-4">
        14. Trade Area Profile:
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">S/NO.</th>
              <th className="border border-gray-300 p-2">Sector</th>
              <th className="border border-gray-300 p-2">Trade Area</th>
              <th className="border border-gray-300 p-2">Instructors</th>
              <th className="border border-gray-300 p-2">Trainees</th>
              <th className="border border-gray-300 p-2">Facilities</th>
              <th className="border border-gray-300 p-2">Equipment</th>
              <th className="border border-gray-300 p-2">Tools</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {(form.legalInfo?.tradeAreas || []).map((trade, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>

                {/* Sector Dropdown */}
                <td className="border border-gray-300 p-2">
                  <Select
                    value={trade.sector}
                    onValueChange={(value) =>
                      updateTradeArea(trade?.sector, "sector", value)
                    }>
                    <SelectTrigger>
                      {!sectors.find(
                        (sector) => sector._id === trade.sector
                      ) ? (
                        <p>Select Sector</p>
                      ) : (
                        <SelectValue placeholder="Select Sector" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectors.map((sector) => (
                          <SelectItem key={sector._id} value={sector._id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {Array.isArray(trade?.tradeArea) &&
                  typeof trade?.tradeArea === "object"
                    ? (trade?.tradeArea || []).map((x) => {
                        const n = sectors
                          .find((sector) => sector._id === trade.sector)
                          ?.tradeAreas?.find((ta) => ta?._id === x);
                        console.log({ nnnnnnx: n });

                        return (
                          <button
                            onClick={() =>
                              updateTradeArea(trade?.sector, "tradeArea", x)
                            }
                            className="mt-1 mr-1 border-[1px] border-blue-200 w-fit text-[11px] text-blue-500 p-1">
                            {n?.name}{" "}
                            <span className="font-bold text-red-600">x</span>
                          </button>
                        );
                      })
                    : null}
                </td>

                {/* Trade Area Dropdown */}
                <td className="border border-gray-300 p-2">
                  <Select
                    value={trade.tradeArea}
                    onValueChange={(value) =>
                      updateTradeArea(trade?.sector, "tradeArea", value)
                    }>
                    <SelectTrigger>
                      {/* <SelectValue placeholder="Select Trade Area" /> */}
                      <p>Select as many trade areas</p>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectors
                          .find((sector) => sector._id === trade.sector)
                          ?.tradeAreas?.map((ta) => {
                            console.log("ta", ta);
                            return (
                              <SelectItem key={ta._id} value={ta._id}>
                                {ta.name}
                              </SelectItem>
                            );
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </td>

                {/* Instructors */}
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={trade.instructors || ""}
                    onChange={(e) =>
                      updateTradeArea(
                        trade?.sector,
                        "instructors",
                        e.target.value
                      )
                    }
                    placeholder="Instructors"
                  />
                </td>

                {/* Trainees */}
                <td className="border border-gray-300 p-2">
                  <Input
                    type="number"
                    value={trade.trainees || ""}
                    onChange={(e) =>
                      updateTradeArea(trade?.sector, "trainees", e.target.value)
                    }
                    placeholder="Trainees"
                  />
                </td>

                {/* Facilities */}
                <td className="border border-gray-300 p-2">
                  <Input
                    value={trade.facilities || ""}
                    onChange={(e) =>
                      updateTradeArea(
                        trade?.sector,
                        "facilities",
                        e.target.value
                      )
                    }
                    placeholder="Facilities"
                  />
                </td>

                {/* Equipment */}
                <td className="border border-gray-300 p-2">
                  <Input
                    value={trade.equipment || ""}
                    onChange={(e) =>
                      updateTradeArea(
                        trade?.sector,
                        "equipment",
                        e.target.value
                      )
                    }
                    placeholder="Equipment"
                  />
                </td>

                {/* Tools */}
                <td className="border border-gray-300 p-2">
                  <Input
                    value={trade.tools || ""}
                    onChange={(e) =>
                      updateTradeArea(trade?.sector, "tools", e.target.value)
                    }
                    placeholder="Tools"
                  />
                </td>

                <td className="border border-gray-300 p-2">
                  <button
                    className="text-red-500 text-[12px]"
                    onClick={() => removeTradearea(trade?.sector)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Trade Area Button */}
      <Button
        onClick={addTradeArea}
        className="bg-blue-500 text-white px-4 py-2 rounded self-start">
        Add Trade Area
      </Button>

      {/* Instructor Credentials */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="instructorCredentials"
          className="text-left leading-[1.3]">
          Attach credentials of each Instructor:
        </Label>
        <UploadButton
          fileUrl={form.legalInfo?.instructorCredentials}
          title="instructorCredentials"
          handleFileChange={(newFileUrl) => {
            const updatedFiles = form.legalInfo?.instructorCredentials
              ? [...form.legalInfo?.instructorCredentials, newFileUrl]
              : [newFileUrl];
            updateField("instructorCredentials", updatedFiles);
          }}
          accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
          removeFile={() => updateField("instructorCredentials", null)}
        />
      </div>

      {/* Additional Details */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="additionalDetails" className="text-left leading-[1.3]">
          Additional Details (if necessary):
        </Label>
        <Textarea
          id="additionalDetails"
          placeholder="Enter any additional details"
          value={form.legalInfo?.additionalDetails || ""}
          onChange={(e) => updateField("additionalDetails", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {controlButtons}
    </div>
  );
};

export default LegalInfo;
