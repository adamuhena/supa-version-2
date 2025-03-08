import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSectors } from "@/services/api";
import UploadButton from "@/components/UploadButton";
import { FilePreview } from "@/components/FilePreview";

const SkillsTab = ({ user, handleArrayUpdate, handleInputChange, handleFileUpload }) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialSkills = (user.priorSkillsCerts || []).map(skill => ({
    ...skill,
    id: skill._id || new Date().getTime().toString() + Math.random()
  }));

  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetchSectors(accessToken);
        setSectors(response);
      } catch (err) {
        setError('Failed to fetch sectors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (id, field, value) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === id) {
        const updated = { ...skill, [field]: value };
        handleArrayUpdate('priorSkillsCerts', skill._id, field, value);
        return updated;
      }
      return skill;
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: new Date().getTime().toString() + Math.random(),
      sector: "",
      tradeArea: "",
      name: "",
      year: "",
      priUpload: ""
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const removeSkill = (id) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  if (loading) return <div>Loading sectors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TabsContent value="skills">
      <Card>
        <CardHeader>
          <CardTitle>Prior Skill Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 border rounded">
                <div className="flex flex-row justify-center gap-4">
                  <div className="w-full">
                    <Label>Sector</Label>
                    <Select
                      value={skill.sector}
                      onValueChange={(value) => handleChange(skill.id, "sector", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sectors.map((sector) => (
                            <SelectItem key={sector._id} value={sector.name}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label>Trade Area</Label>
                    <Select
                      value={skill.tradeArea}
                      onValueChange={(value) => handleChange(skill.id, "tradeArea", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Trade Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sectors
                            .find((sector) => sector.name === skill.sector)
                            ?.tradeAreas?.map((tradeArea) => (
                              <SelectItem key={tradeArea._id} value={tradeArea.name}>
                                {tradeArea.name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Certificate Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => handleChange(skill.id, "name", e.target.value)}
                    placeholder="Enter certificate name"
                  />
                </div>

                <div className="mt-4">
                  <Label>Year Obtained</Label>
                  <Input
                    type="date"
                    value={skill.year}
                    onChange={(e) => handleChange(skill.id, "year", e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <Label>Supporting Document</Label>
                  <div className="flex items-center gap-4">
                    <UploadButton
                      fileUrl={skill.priUpload}
                      handleFileChange={(url) => handleChange(skill.id, "priUpload", url)}
                      removeFile={() => handleChange(skill.id, "priUpload", "")}
                    />
                    {skill.priUpload && <FilePreview fileUrl={skill.priUpload} />}
                  </div>
                </div>

                {skills.length > 1 && (
                  <Button
                    onClick={() => removeSkill(skill.id)}
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Remove Skill
                  </Button>
                )}
              </div>
            ))}

            <Button 
              onClick={addSkill} 
              variant="outline" 
              className="w-full"
            >
              <PlusCircledIcon className="w-4 h-4 mr-2" />
              Add Another Skill
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SkillsTab;

// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { TabsContent } from "@/components/ui/tabs";
// import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
// import { FilePreview } from "@/components/FilePreview";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { fetchSectors } from "@/services/api";
// import UploadButton from "@/components/UploadButton";

// const SkillsTab = ({ user, handleArrayUpdate, handleInputChange, handleFileUpload }) => {
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const initialSkills = (user.priorSkillsCerts || []).map(skill => ({
//     ...skill,
//     id: skill._id || new Date().getTime().toString() + Math.random()
//   }));
//   const [changes, setChanges] = useState({
//     priorSkillsCerts: user.priorSkillsCerts || []
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken');
//         const response = await fetchSectors(accessToken);
//         setSectors(response);
//       } catch (err) {
//         setError('Failed to fetch sectors');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (field, index, value) => {
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: prev.priorSkillsCerts.map((cert, i) => 
//         i === index ? { ...cert, [field]: value } : cert
//       )
//     }));
//     handleArrayUpdate("priorSkillsCerts", index, field, value);
//   };

//   const addNewSkill = () => {
//     const newSkill = {
//       id: new Date().getTime().toString() + Math.random(),
//       sector: "",
//       tradeArea: "",
//       name: "",
//       year: "",
//       priUpload: ""
//     };
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: [...prev.priorSkillsCerts, newSkill]
//     }));
//   };

//   const removeSkill = (id) => {
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: prev.priorSkillsCerts.filter(cert => cert.id !== id)
//     }));
//   };

//   return (
//     <TabsContent value="skills">
//       <Card>
//         <CardHeader>
//           <CardTitle>Prior Skill Certificates</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {changes.priorSkillsCerts.map((cert, index) => (
//               <div key={cert.id} className="p-4 border rounded">
//                 <div className="flex flex-row justify-center">
//                   <div className="inputGroup">
//                     <Label>Sector</Label>
//                     <Select
//                       value={cert.sector}
//                       onValueChange={(value) => handleChange("sector", index, value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a Sector" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           {sectors.map((sector) => (
//                             <SelectItem key={sector._id} value={sector.name}>
//                               {sector.name}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="inputGroup">
//                     <Label>Trade Area</Label>
//                     <Select
//                       value={cert.tradeArea}
//                       onValueChange={(value) => handleChange("tradeArea", index, value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Trade Area" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           {sectors
//                             .find((sector) => sector.name === cert.sector)
//                             ?.tradeAreas?.map((tradeArea) => (
//                               <SelectItem key={tradeArea._id} value={tradeArea.name}>
//                                 {tradeArea.name}
//                               </SelectItem>
//                             ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="flex items-center mt-4">
//                   <Label className="w-[300px] text-left leading-[1.3]">
//                     Name *
//                   </Label>
//                   <Input
//                     value={cert.name}
//                     onChange={(e) => handleChange("name", index, e.target.value)}
//                     placeholder="Enter name"
//                   />
//                 </div>

//                 <div className="flex items-center mt-4">
//                   <Label className="w-[300px] text-left leading-[1.3]">
//                     Year obtained *
//                   </Label>
//                   <Input
//                     type="date"
//                     value={cert.year}
//                     onChange={(e) => handleChange("year", index, e.target.value)}
//                   />
//                 </div>

//                 <div className="flex items-start mt-4">
//                   <Label className="w-[300px] text-left leading-[1.3]">
//                     Supporting Document *
//                   </Label>
//                   <UploadButton
//                     fileUrl={cert.priUpload}
//                     handleFileChange={(url) => handleChange("priUpload", index, url)}
//                     removeFile={() => handleChange("priUpload", index, "")}
//                   />
//                 </div>

//                 {changes.priorSkillsCerts.length > 1 && (
//                   <Button
//                     onClick={() => removeSkill(cert.id)}
//                     variant="destructive"
//                     size="sm"
//                     className="mt-4"
//                   >
//                     <TrashIcon className="w-4 h-4 mr-1" />
//                     Delete
//                   </Button>
//                 )}
//               </div>
//             ))}

//             <Button onClick={addNewSkill} variant="outline" className="w-full">
//               <PlusCircledIcon className="w-4 h-4 mr-1" />
//               Add Another Skill
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default SkillsTab;

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { TabsContent } from "@/components/ui/tabs";
// import { Minus, Plus } from "lucide-react";
// import { FilePreview } from "@/components/FilePreview";

// const SkillsTab = ({ user, handleArrayUpdate, handleInputChange, handleFileUpload }) => {
//   const [changes, setChanges] = useState({
//     priorSkillsCerts: user.priorSkillsCerts || []
//   });

//   const handleChange = (field, index, value) => {
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: prev.priorSkillsCerts.map((cert, i) => 
//         i === index ? { ...cert, [field]: value } : cert
//       )
//     }));
//     handleArrayUpdate("priorSkillsCerts", index, field, value);
//   };

//   const addNewSkill = () => {
//     const newSkill = {
//       sector: "",
//       tradeArea: "",
//       name: "",
//       year: "",
//       priUpload: ""
//     };
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: [...prev.priorSkillsCerts, newSkill]
//     }));
//   };

//   const removeSkill = (index) => {
//     setChanges(prev => ({
//       ...prev,
//       priorSkillsCerts: prev.priorSkillsCerts.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <TabsContent value="skills">
//       <Card>
//         <CardHeader>
//           <CardTitle>Skills, Certifications, and Experience</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {(changes.priorSkillsCerts).map((cert, index) => (
//               <div key={index} className="p-4 border rounded">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label>Sector</Label>
//                     <Input
//                       value={cert.sector}
//                       onChange={(e) => handleChange("sector", index, e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Trade Area</Label>
//                     <Input
//                       value={cert.tradeArea}
//                       onChange={(e) => handleChange("tradeArea", index, e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Certification Name</Label>
//                     <Input
//                       value={cert.name}
//                       onChange={(e) => handleChange("name", index, e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Year</Label>
//                     <Input
//                       type="number"
//                       min="1900"
//                       max={new Date().getFullYear()}
//                       value={cert.year}
//                       onChange={(e) => handleChange("year", index, e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Certificate Upload</Label>
//                     <Input
//                       type="file"
//                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                       onChange={(e) => handleFileUpload("priorSkillsCerts", index, "priUpload", e.target.files[0])}
//                     />
//                     <FilePreview fileUrl={cert.priUpload} />
//                   </div>
//                 </div>

//                 <Button 
//                   variant="destructive" 
//                   size="sm" 
//                   className="mt-2"
//                   onClick={() => removeSkill(index)}
//                 >
//                   <Minus className="w-4 h-4 mr-1" />
//                   Remove Skill
//                 </Button>
//               </div>
//             ))}

//             <Button onClick={addNewSkill} className="w-full">
//               <Plus className="w-4 h-4 mr-1" />
//               Add New Skill
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default SkillsTab;