// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Minus, Plus } from "lucide-react";
// import UploadButton from "@/components/UploadButton"; // Import UploadButton
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { fetchSectors } from "@/services/api"; // Adjust the import path as needed

// const SkillsTab = ({
//   user,
//   handleUpdate,
//   submitChanges,
//   changes,
//   handleArrayUpdate,
//   addArrayItem,
//   removeArrayItem,
// }) => {
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   const handleCertUpload = (index, url) => {
//     handleArrayUpdate("priorSkillsCerts", index, {
//       ...(changes.priorSkillsCerts ?? user.priorSkillsCerts)[index],
//       priUpload: url,
//     });
//   };

//   const handleExpUpload = (index, url) => {
//     handleArrayUpdate("experience", index, {
//       ...(changes.experience ?? user.experience)[index],
//       exUpload: url,
//     });
//   };

//   const removeCertUpload = (index) => {
//     handleCertUpload(index, "");
//   };

//   const removeExpUpload = (index) => {
//     handleExpUpload(index, "");
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Skills, Certifications, and Experience</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <h3 className="text-lg font-semibold mb-4">
//           Prior Skills and Certifications
//         </h3>
//         {(changes.priorSkillsCerts ?? user.priorSkillsCerts).map(
//           (cert, index) => (
//             <div key={index} className="mb-4 p-4 border rounded">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor={`cert-${index}-sector`}>Sector</Label>
//                   <Select
//                     value={cert.sector}
//                     onValueChange={(value) =>
//                       handleArrayUpdate("priorSkillsCerts", index, {
//                         ...cert,
//                         sector: value,
//                       })
//                     }
//                   >
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Select a Sector" />
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
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`cert-${index}-tradeArea`}>Trade Area</Label>
//                   <Select
//                     value={cert.tradeArea}
//                     onValueChange={(value) =>
//                       handleArrayUpdate("priorSkillsCerts", index, {
//                         ...cert,
//                         tradeArea: value,
//                       })
//                     }
//                   >
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Select Trade Area" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         {sectors
//                           .find((sector) => sector.name === cert.sector)
//                           ?.tradeAreas.map((tradeArea) => (
//                             <SelectItem key={tradeArea._id} value={tradeArea.name}>
//                               {tradeArea.name}
//                             </SelectItem>
//                           ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {["name", "year"].map((field) => (
//                   <div key={field} className="space-y-2">
//                     <Label htmlFor={`cert-${index}-${field}`}>
//                       {field.charAt(0).toUpperCase() + field.slice(1)}
//                     </Label>
//                     <Input
//                       id={`cert-${index}-${field}`}
//                       type={field === "year" ? "date" : "text"}
//                       value={cert[field]}
//                       onChange={(e) =>
//                         handleArrayUpdate("priorSkillsCerts", index, {
//                           ...cert,
//                           [field]: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 ))}
//                 <div className="space-y-2">
//                   <Label htmlFor={`cert-${index}-upload`}>
//                     Certificate Upload
//                   </Label>
//                   <UploadButton
//                     fileUrl={cert.priUpload}
//                     handleFileChange={(url) => handleCertUpload(index, url)}
//                     removeFile={() => removeCertUpload(index)}
//                   />
//                 </div>
//               </div>
//               <Button
//                 variant="destructive"
//                 onClick={() => removeArrayItem("priorSkillsCerts", index)}
//                 className="mt-2"
//               >
//                 <Minus className="mr-2 h-4 w-4" /> Remove
//               </Button>
//             </div>
//           )
//         )}
//         <Button
//           onClick={() =>
//             addArrayItem("priorSkillsCerts", {
//               sector: "",
//               tradeArea: "",
//               name: "",
//               year: "",
//               priUpload: "",
//             })
//           }
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add Certification
//         </Button>

//         <h3 className="text-lg font-semibold mb-4 mt-8">Experience</h3>
//         {(changes.experience ?? user.experience).map((exp, index) => (
//           <div key={index} className="mb-4 p-4 border rounded">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {["projectTitle", "description", "dateFrom", "dateTo"].map(
//                 (field) => (
//                   <div key={field} className="space-y-2">
//                     <Label htmlFor={`exp-${index}-${field}`}>
//                       {field
//                         .split(/(?=[A-Z])/)
//                         .join(" ")
//                         .charAt(0)
//                         .toUpperCase() +
//                         field
//                           .split(/(?=[A-Z])/)
//                           .join(" ")
//                           .slice(1)}
//                     </Label>
//                     <Input
//                       id={`exp-${index}-${field}`}
//                       type={field === "dateFrom" || field === "dateTo" ? "date" : "text"}
//                       value={exp[field]}
//                       onChange={(e) =>
//                         handleArrayUpdate("experience", index, {
//                           ...exp,
//                           [field]: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 )
//               )}
//               <div className="space-y-2">
//                 <Label htmlFor={`exp-${index}-upload`}>
//                   Experience Document
//                 </Label>
//                 <UploadButton
//                   fileUrl={exp.exUpload}
//                   handleFileChange={(url) => handleExpUpload(index, url)}
//                   removeFile={() => removeExpUpload(index)}
//                 />
//               </div>
//             </div>
//             <Button
//               variant="destructive"
//               onClick={() => removeArrayItem("experience", index)}
//               className="mt-2"
//             >
//               <Minus className="mr-2 h-4 w-4" /> Remove
//             </Button>
//           </div>
//         ))}
//         <Button
//           onClick={() =>
//             addArrayItem("experience", {
//               projectTitle: "",
//               description: "",
//               dateFrom: "",
//               dateTo: "",
//               exUpload: "",
//             })
//           }
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add Experience
//         </Button>

//         <div className="flex justify-end">
//           <Button onClick={() => submitChanges("skills")} className="mt-4 bg-green-500 hover:bg-green-600">
//             Save Changes
//           </Button>

//         </div>
        
//       </CardContent>
//     </Card>
//   );
// };

// export default SkillsTab;
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
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

const SkillsTab = ({
  user,
  handleUpdate,
  submitChanges,
  changes,
  handleArrayUpdate,
  addArrayItem,
  removeArrayItem,
}) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Directly check user.role instead of using a separate prop
  const isEditable = user?.role === "admin" || user?.role === "superadmin";

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

  const handleCertUpload = (index, url) => {
    handleArrayUpdate("priorSkillsCerts", index, {
      ...(changes.priorSkillsCerts ?? user.priorSkillsCerts)[index],
      priUpload: url,
    });
  };

  const handleExpUpload = (index, url) => {
    handleArrayUpdate("experience", index, {
      ...(changes.experience ?? user.experience)[index],
      exUpload: url,
    });
  };

  const removeCertUpload = (index) => {
    handleCertUpload(index, "");
  };

  const removeExpUpload = (index) => {
    handleExpUpload(index, "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills, Certifications, and Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">
          Prior Skills and Certifications
        </h3>

        {(changes.priorSkillsCerts ?? user.priorSkillsCerts).map((cert, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`cert-${index}-sector`}>Sector</Label>
                <Select
                  value={cert.sector}
                  onValueChange={(value) =>
                    handleArrayUpdate("priorSkillsCerts", index, {
                      ...cert,
                      sector: value,
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger
                    className={`${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                  >
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

              <div className="space-y-2">
                <Label htmlFor={`cert-${index}-tradeArea`}>Trade Area</Label>
                <Select
                  value={cert.tradeArea}
                  onValueChange={(value) =>
                    handleArrayUpdate("priorSkillsCerts", index, {
                      ...cert,
                      tradeArea: value,
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger
                    className={`${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <SelectValue placeholder="Select Trade Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sectors
                        .find((sector) => sector.name === cert.sector)
                        ?.tradeAreas.map((tradeArea) => (
                          <SelectItem key={tradeArea._id} value={tradeArea.name}>
                            {tradeArea.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {["name", "year"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`cert-${index}-${field}`}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={`cert-${index}-${field}`}
                    type={field === "year" ? "date" : "text"}
                    value={cert[field]}
                    onChange={(e) =>
                      handleArrayUpdate("priorSkillsCerts", index, {
                        ...cert,
                        [field]: e.target.value,
                      })
                    }
                    readOnly={!isEditable}
                    className={`${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor={`cert-${index}-upload`}>Certificate Upload</Label>
                {isEditable ? (
                  <UploadButton
                    fileUrl={cert.priUpload}
                    handleFileChange={(url) => handleCertUpload(index, url)}
                    removeFile={() => removeCertUpload(index)}
                  />
                ) : (
                  cert.priUpload ? (
                    <a
                      href={cert.priUpload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <p>No certificate uploaded</p>
                  )
                )}
              </div>
            </div>

            {isEditable && (
              <Button
                variant="destructive"
                onClick={() => removeArrayItem("priorSkillsCerts", index)}
                className="mt-2"
              >
                <Minus className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        ))}

        {isEditable && (
          <Button
            onClick={() =>
              addArrayItem("priorSkillsCerts", {
                sector: "",
                tradeArea: "",
                name: "",
                year: "",
                priUpload: "",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Certification
          </Button>
        )}

        <h3 className="text-lg font-semibold mb-4 mt-8">Experience</h3>

        {(changes.experience ?? user.experience).map((exp, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["projectTitle", "description", "dateFrom", "dateTo"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`exp-${index}-${field}`}>
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
                    id={`exp-${index}-${field}`}
                    type={field === "dateFrom" || field === "dateTo" ? "date" : "text"}
                    value={exp[field]}
                    onChange={(e) =>
                      handleArrayUpdate("experience", index, {
                        ...exp,
                        [field]: e.target.value,
                      })
                    }
                    readOnly={!isEditable}
                    className={`${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor={`exp-${index}-upload`}>Experience Document</Label>
                {isEditable ? (
                  <UploadButton
                    fileUrl={exp.exUpload}
                    handleFileChange={(url) => handleExpUpload(index, url)}
                    removeFile={() => removeExpUpload(index)}
                  />
                ) : (
                  exp.exUpload ? (
                    <a
                      href={exp.exUpload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <p>No document uploaded</p>
                  )
                )}
              </div>
            </div>

            {isEditable && (
              <Button
                variant="destructive"
                onClick={() => removeArrayItem("experience", index)}
                className="mt-2"
              >
                <Minus className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        ))}

        {isEditable && (
          <Button
            onClick={() =>
              addArrayItem("experience", {
                projectTitle: "",
                description: "",
                dateFrom: "",
                dateTo: "",
                exUpload: "",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        )}

        <div className="flex justify-end">
          {isEditable && (
            <Button
              onClick={() => submitChanges("skills")}
              className="mt-4 bg-green-500 hover:bg-green-600"
            >
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsTab;
