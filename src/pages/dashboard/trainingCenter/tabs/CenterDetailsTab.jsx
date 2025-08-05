"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { states } from "@/data/nigeria.ts"

// Add this helper function at the top of your component
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const CenterDetailsTab = ({ center, handleInputChange, handleSubmit }) => {
  const [lgas, setLgas] = useState([])

  // Add this useEffect to load LGAs when component mounts
  useEffect(() => {
    if (center.state) {
      const selectedState = states.find((state) => state.value === center.state)
      setLgas(selectedState ? selectedState.lgas : [])
    }
  }, [center.state])

  const handleStateChange = (stateName) => {
    handleInputChange({
      target: { name: "state", value: stateName }
    })
    
    // Find selected state and update LGAs
    const selectedState = states.find((state) => state.value === stateName)
    setLgas(selectedState ? selectedState.lgas : [])
    
    // Reset LGA when state changes
    handleInputChange({
      target: { name: "lga", value: "" }
    })
  }

  return (
    <Tabs value="details">
      <TabsContent value="details">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[1200px] mx-auto py-[30px] flex flex-wrap px-5 gap-[30px] bg-white rounded-[16px] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]"
        >
          <h1 className="text-left font-[700] text-[24px] w-full">
            Training Centre Profile
          </h1>

          {/* State Selection */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="state"
              className="w-[300px] text-left leading-[1.3]"
            >
              State where the Training Centre is located
            </Label>
            <Select
              value={center.state}
              onValueChange={handleStateChange}
              disabled={true}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* LGA Selection */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label htmlFor="lga" className="w-[300px] text-left leading-[1.3]">
              LGA where the Training Centre is located
            </Label>
            <Select
              value={center.lga || ""}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "lga", value },
                })
              }
              // disabled={!lgas.length}
              disabled={true}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {lgas.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Area Office */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="areaOffice"
              className="w-[300px] text-left leading-[1.3]"
            >
              Area Office
            </Label>
            <Input
              id="areaOffice"
              name="areaOffice"
              value={center.areaOffice}
              onChange={handleInputChange}
              placeholder="Enter Area Office"
            />
          </div>

          {/* Training Center Name */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="trainingCentreName"
              className="w-[300px] text-left leading-[1.3]"
            >
              Name of Training Centre
            </Label>
            <Input
              id="trainingCentreName"
              name="trainingCentreName"
              value={center.trainingCentreName}
              onChange={handleInputChange}
              placeholder="Enter Training Centre Name"
              disabled={true} // Assuming this field is not editable
            />
          </div>
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="regNum"
              className="w-[300px] text-left leading-[1.3]"
            >
              Registration Number
            </Label>
            <Input
              name="regNum"
              value={center.regNum}
              onChange={handleInputChange}
              placeholder="Registration Number"
            />
          </div>

          {/* Address */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="address"
              className="w-[300px] text-left leading-[1.3]"
            >
              Address of Training Centre
            </Label>
            <Input
              id="address"
              name="address"
              value={center.address}
              onChange={handleInputChange}
              placeholder="Enter Address of Training Centre"
            />
          </div>

          {/* Contact Person */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="contactPerson"
              className="w-[300px] text-left leading-[1.3]"
            >
              Name of Contact Person
            </Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={center.contactPerson}
              onChange={handleInputChange}
              placeholder="Enter Name of Contact Person"
            />
          </div>

          {/* Phone Number */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="phoneNumber"
              className="w-[300px] text-left leading-[1.3]"
            >
              Phone No./WhatsApp
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={center.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
            />
          </div>

          {/* Email Address */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="email"
              className="w-[300px] text-left leading-[1.3]"
            >
              E-Mail Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={center.email}
              onChange={handleInputChange}
              placeholder="Enter Email Address"
              disabled
            />
          </div>

          {/* Establishment Date */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="establishmentDate"
              className="w-[300px] text-left leading-[1.3]"
            >
              Date of Establishment
            </Label>
            <Input
              id="establishmentDate"
              name="establishmentDate"
              type="date"
              value={formatDateForInput(center.establishmentDate)}
              onChange={(e) => {
                handleInputChange({
                  target: {
                    name: "establishmentDate",
                    value: e.target.value,
                  },
                });
              }}
            />
          </div>

          {/* Ownership */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="ownership"
              className="w-[300px] text-left leading-[1.3]"
            >
              Ownership
            </Label>
            <Select
              value={center.ownership}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "ownership", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="federalGovt">Federal Gov't</SelectItem>
                  <SelectItem value="stateGovt">State Gov't</SelectItem>
                  <SelectItem value="localGovt">Local Gov't</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="coOwned">Co-Owned</SelectItem>
                  <SelectItem value="religiousOrganization">
                    Religious Organization
                  </SelectItem>
                  <SelectItem value="ngo">
                    Non-Governmental Organization (NGO)
                  </SelectItem>
                  <SelectItem value="other">Others (Specify)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Other Ownership */}
          {center.ownership === "other" && (
            <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
              <Label
                htmlFor="otherOwnership"
                className="w-[300px] text-left leading-[1.3]"
              >
                Specify Other Ownership
              </Label>
              <Input
                id="otherOwnership"
                name="otherOwnership"
                value={center.otherOwnership}
                onChange={handleInputChange}
                placeholder="Specify Other Ownership"
              />
            </div>
          )}

          {/* Nature of Training */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="trainingNature"
              className="w-[300px] text-left leading-[1.3]"
            >
              Nature of Training
            </Label>
            <Select
              value={center.trainingNature}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "trainingNature", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nature of training" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="institutionTraining">
                    Institution Training
                  </SelectItem>
                  <SelectItem value="workplaceTraining">
                    Workplace/Formal Training
                  </SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* ITF Registration */}
          <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
            <Label
              htmlFor="itfRegistered"
              className="w-[300px] text-left leading-[1.3]"
            >
              Is the Centre registered with ITF?
            </Label>
            <Select
              value={center.itfRegistered}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "itfRegistered", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* ITF Registration Number */}
          {center.itfRegistered === "yes" && (
            <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
              <Label
                htmlFor="itfRegistrationNumber"
                className="w-[300px] text-left leading-[1.3]"
              >
                ITF Registration Number
              </Label>
              <Input
                id="itfRegistrationNumber"
                name="itfRegistrationNumber"
                value={center.itfRegistrationNumber}
                onChange={handleInputChange}
                placeholder="Enter ITF Registration Number"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={true}
          >
            Update Center Details
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default CenterDetailsTab


// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// const CenterDetailsTab = ({ center, handleInputChange, handleSubmit }) => {
//   return (
//     //   <TabsContent value="details">
//     <TabsContent value="details">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           name="state"
//           value={center.state}
//           onChange={handleInputChange}
//           placeholder="State"
//         />
//         <Input
//           name="lga"
//           value={center.lga}
//           onChange={handleInputChange}
//           placeholder="LGA"
//         />
//         <Input
//           name="sector"
//           value={center.sector}
//           onChange={handleInputChange}
//           placeholder="Sector"
//         />
//         <Input
//           name="contactPerson"
//           value={center.contactPerson}
//           onChange={handleInputChange}
//           placeholder="Contact Person"
//         />
//         <Input
//           name="establishmentDate"
//           type="date"
//           value={center.establishmentDate}
//           onChange={handleInputChange}
//           placeholder="Establishment Date"
//         />
//         <Select
//           name="ownership"
//           value={center.ownership}
//           onValueChange={(value) =>
//             handleInputChange({
//               target: { name: "ownership", value },
//             })
//           }>
//           <SelectTrigger>
//             <SelectValue placeholder="Select ownership" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="federalGovt">Federal Government</SelectItem>
//             <SelectItem value="stateGovt">State Government</SelectItem>
//             <SelectItem value="localGovt">Local Government</SelectItem>
//             <SelectItem value="personal">Personal</SelectItem>
//             <SelectItem value="coOwned">Co-owned</SelectItem>
//             <SelectItem value="religiousOrganization">
//               Religious Organization
//             </SelectItem>
//             <SelectItem value="ngo">NGO</SelectItem>
//             <SelectItem value="other">Other</SelectItem>
//           </SelectContent>
//         </Select>
//         {center.ownership === "other" && (
//           <Input
//             name="otherOwnership"
//             value={center.otherOwnership}
//             onChange={handleInputChange}
//             placeholder="Specify Other Ownership"
//           />
//         )}
//         <Select
//           name="trainingNature"
//           value={center.trainingNature}
//           onValueChange={(value) =>
//             handleInputChange({
//               target: { name: "trainingNature", value },
//             })
//           }>
//           <SelectTrigger>
//             <SelectValue placeholder="Select training nature" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="institutionTraining">
//               Institution Training
//             </SelectItem>
//             <SelectItem value="workplaceTraining">
//               Workplace Training
//             </SelectItem>
//             <SelectItem value="informal">Informal</SelectItem>
//           </SelectContent>
//         </Select>
//         <div className="flex items-center space-x-2">
//           <Switch
//             disabled
//             id="itfRegistered"
//             checked={center.itfRegistered === "yes"}
//             onCheckedChange={(checked) =>
//               handleInputChange({
//                 target: {
//                   name: "itfRegistered",
//                   value: checked ? "yes" : "no",
//                 },
//               })
//             }
//           />
//           <Label htmlFor="itfRegistered">ITF Registered</Label>
//         </div>
//         {center.itfRegistered === "yes" && (
//           <Input
//             name="itfRegistrationNumber"
//             value={center.itfRegistrationNumber}
//             onChange={handleInputChange}
//             placeholder="ITF Registration Number"
//           />
//         )}
//         <Button
//           type="submit"
//           disabled
//           className="mt-4 bg-green-500 hover:bg-green-600">
//           Update Center Details
//         </Button>
//       </form>
//     </TabsContent>
//   );
// };

// export default CenterDetailsTab;


// "use client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const CenterDetailsTab = ({ center, handleInputChange, handleSubmit }) => {
//   return (
//     <Tabs value="details">
//       <TabsContent value="details">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input name="state" value={center.state} onChange={handleInputChange} placeholder="State" />
//           <Input name="lga" value={center.lga} onChange={handleInputChange} placeholder="LGA" />
//           <Input name="sector" value={center.sector} onChange={handleInputChange} placeholder="Sector" />
//           <Input
//             name="contactPerson"
//             value={center.contactPerson}
//             onChange={handleInputChange}
//             placeholder="Contact Person"
//           />
//           <Input
//             name="establishmentDate"
//             type="date"
//             value={center.establishmentDate}
//             onChange={handleInputChange}
//             placeholder="Establishment Date"
//           />
//           <Select
//             name="ownership"
//             value={center.ownership}
//             onValueChange={(value) =>
//               handleInputChange({
//                 target: { name: "ownership", value },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select ownership" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="federalGovt">Federal Government</SelectItem>
//               <SelectItem value="stateGovt">State Government</SelectItem>
//               <SelectItem value="localGovt">Local Government</SelectItem>
//               <SelectItem value="personal">Personal</SelectItem>
//               <SelectItem value="coOwned">Co-owned</SelectItem>
//               <SelectItem value="religiousOrganization">Religious Organization</SelectItem>
//               <SelectItem value="ngo">NGO</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//           {center.ownership === "other" && (
//             <Input
//               name="otherOwnership"
//               value={center.otherOwnership}
//               onChange={handleInputChange}
//               placeholder="Specify Other Ownership"
//             />
//           )}
//           <Select
//             name="trainingNature"
//             value={center.trainingNature}
//             onValueChange={(value) =>
//               handleInputChange({
//                 target: { name: "trainingNature", value },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select training nature" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="institutionTraining">Institution Training</SelectItem>
//               <SelectItem value="workplaceTraining">Workplace Training</SelectItem>
//               <SelectItem value="informal">Informal</SelectItem>
//             </SelectContent>
//           </Select>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="itfRegistered"
//               checked={center.itfRegistered === "yes"}
//               onCheckedChange={(checked) =>
//                 handleInputChange({
//                   target: {
//                     name: "itfRegistered",
//                     value: checked ? "yes" : "no",
//                   },
//                 })
//               }
//             />
//             <Label htmlFor="itfRegistered">ITF Registered</Label>
//           </div>
//           {center.itfRegistered === "yes" && (
//             <Input
//               name="itfRegistrationNumber"
//               value={center.itfRegistrationNumber}
//               onChange={handleInputChange}
//               placeholder="ITF Registration Number"
//             />
//           )}
//           <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600">
//             Update Center Details
//           </Button>
//         </form>
//       </TabsContent>
//     </Tabs>
//   )
// }

// export default CenterDetailsTab



// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import { 
//   Select, 
//   SelectContent, 
//   SelectGroup,
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select"
// import { states } from "@/data/nigeria.ts"

// const CenterDetailsTab = ({ center, handleInputChange, handleSubmit }) => {
//   const [lgas, setLgas] = useState([])

//   const handleStateChange = (stateName) => {
//     handleInputChange({
//       target: { name: "state", value: stateName }
//     })
    
//     // Find selected state and update LGAs
//     const selectedState = states.find((state) => state.value === stateName)
//     setLgas(selectedState ? selectedState.lgas : [])
    
//     // Reset LGA when state changes
//     handleInputChange({
//       target: { name: "lga", value: "" }
//     })
//   }

//   return (
//     <Tabs value="details">
//       <TabsContent value="details">
//         <form 
//           onSubmit={handleSubmit} 
//           className="relative w-full max-w-[1200px] mx-auto py-[30px] flex flex-wrap px-5 gap-[30px] bg-white rounded-[16px] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]"
//         >
//           <h1 className="text-left font-[700] text-[24px] w-full">
//             Training Centre Profile
//           </h1>

//           {/* State Selection */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="state" className="w-[300px] text-left leading-[1.3]">
//               State where the Training Centre is located
//             </Label>
//             <Select value={center.state} onValueChange={handleStateChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select state" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   {states.map((state) => (
//                     <SelectItem key={state.value} value={state.value}>
//                       {state.label}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* LGA Selection */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="lga" className="w-[300px] text-left leading-[1.3]">
//               LGA where the Training Centre is located
//             </Label>
//             <Select
//               value={center.lga}
//               onValueChange={(value) => 
//                 handleInputChange({
//                   target: { name: "lga", value }
//                 })
//               }
//               disabled={!lgas.length}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select LGA" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   {lgas.map((lga) => (
//                     <SelectItem key={lga} value={lga}>
//                       {lga}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Contact Person */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="contactPerson" className="w-[300px] text-left leading-[1.3]">
//               Name of Contact Person
//             </Label>
//             <Input
//               id="contactPerson"
//               name="contactPerson"
//               value={center.contactPerson}
//               onChange={handleInputChange}
//               placeholder="Enter Name of Contact Person"
//             />
//           </div>

//           {/* Establishment Date */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="establishmentDate" className="w-[300px] text-left leading-[1.3]">
//               Date of Establishment
//             </Label>
//             <Input
//               id="establishmentDate"
//               name="establishmentDate"
//               type="date"
//               value={center.establishmentDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* Ownership */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="ownership" className="w-[300px] text-left leading-[1.3]">
//               Ownership
//             </Label>
//             <Select
//               value={center.ownership}
//               onValueChange={(value) =>
//                 handleInputChange({
//                   target: { name: "ownership", value },
//                 })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select ownership" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="federalGovt">Federal Gov't</SelectItem>
//                   <SelectItem value="stateGovt">State Gov't</SelectItem>
//                   <SelectItem value="localGovt">Local Gov't</SelectItem>
//                   <SelectItem value="personal">Personal</SelectItem>
//                   <SelectItem value="coOwned">Co-Owned</SelectItem>
//                   <SelectItem value="religiousOrganization">Religious Organization</SelectItem>
//                   <SelectItem value="ngo">Non-Governmental Organization (NGO)</SelectItem>
//                   <SelectItem value="other">Others (Specify)</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Other Ownership */}
//           {center.ownership === "other" && (
//             <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//               <Label htmlFor="otherOwnership" className="w-[300px] text-left leading-[1.3]">
//                 Specify Other Ownership
//               </Label>
//               <Input
//                 id="otherOwnership"
//                 name="otherOwnership"
//                 value={center.otherOwnership}
//                 onChange={handleInputChange}
//                 placeholder="Specify Other Ownership"
//               />
//             </div>
//           )}

//           {/* Nature of Training */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="trainingNature" className="w-[300px] text-left leading-[1.3]">
//               Nature of Training
//             </Label>
//             <Select
//               value={center.trainingNature}
//               onValueChange={(value) =>
//                 handleInputChange({
//                   target: { name: "trainingNature", value },
//                 })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select nature of training" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="institutionTraining">Institution Training</SelectItem>
//                   <SelectItem value="workplaceTraining">Workplace/Formal Training</SelectItem>
//                   <SelectItem value="informal">Informal</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* ITF Registration */}
//           <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//             <Label htmlFor="itfRegistered" className="w-[300px] text-left leading-[1.3]">
//               Is the Centre registered with ITF?
//             </Label>
//             <Select
//               value={center.itfRegistered}
//               onValueChange={(value) =>
//                 handleInputChange({
//                   target: { name: "itfRegistered", value },
//                 })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Yes or No" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="yes">Yes</SelectItem>
//                   <SelectItem value="no">No</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* ITF Registration Number */}
//           {center.itfRegistered === "yes" && (
//             <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
//               <Label htmlFor="itfRegistrationNumber" className="w-[300px] text-left leading-[1.3]">
//                 ITF Registration Number
//               </Label>
//               <Input
//                 id="itfRegistrationNumber"
//                 name="itfRegistrationNumber"
//                 value={center.itfRegistrationNumber}
//                 onChange={handleInputChange}
//                 placeholder="Enter ITF Registration Number"
//               />
//             </div>
//           )}

//           <Button 
//             type="submit" 
//             className="w-full bg-green-500 hover:bg-green-600"
//           >
//             Update Center Details
//           </Button>
//         </form>
//       </TabsContent>
//     </Tabs>
//   )
// }

// export default CenterDetailsTab

