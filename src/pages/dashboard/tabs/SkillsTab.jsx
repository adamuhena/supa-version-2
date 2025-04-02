"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import UploadButton from "@/components/UploadButton"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchSectors } from "@/services/api"
import { toast } from "sonner"

const SkillsTab = ({
  user,
  handleUpdate,
  submitChanges,
  changes,
  handleArrayUpdate,
  addArrayItem,
  removeArrayItem,
}) => {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is admin/superadmin to determine edit permissions
  const isEditable = user?.role === "admin" || user?.role === "superadmin";

  // Check user role to determine which sections to show
  const isArtisanUser = user?.role === "artisan_user"
  const isIntendingArtisan = user?.role === "intending_artisan"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetchSectors(accessToken)
        setSectors(response)
      } catch (err) {
        setError("Failed to fetch sectors")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCertUpload = (index, url) => {
    handleArrayUpdate("priorSkillsCerts", index, {
      ...(changes.priorSkillsCerts ?? user.priorSkillsCerts)[index],
      priUpload: url,
    })
  }

  const handleExpUpload = (index, url) => {
    handleArrayUpdate("experience", index, {
      ...(changes.experience ?? user.experience)[index],
      exUpload: url,
    })
  }

  const removeCertUpload = (index) => {
    handleCertUpload(index, "")
  }

  const removeExpUpload = (index) => {
    handleExpUpload(index, "")
  }

  // Handle trade area selection (add to array)
  const handleTradeAreaChange = (index, value) => {
    const currentCert = (changes.priorSkillsCerts ?? user.priorSkillsCerts)[index]
    const tradeAreas = currentCert.tradeAreas || []

    // Only add if it doesn't already exist
    if (!tradeAreas.includes(value)) {
      handleArrayUpdate("priorSkillsCerts", index, {
        ...currentCert,
        tradeAreas: [...tradeAreas, value],
      })
    }
  }

  // Handle removing a trade area from the array
  const removeTradeArea = (certIndex, tradeAreaName) => {
    const currentCert = (changes.priorSkillsCerts ?? user.priorSkillsCerts)[certIndex]
    handleArrayUpdate("priorSkillsCerts", certIndex, {
      ...currentCert,
      tradeAreas: currentCert.tradeAreas.filter((name) => name !== tradeAreaName),
    })
  }

  // Toggle hasCertificate flag
  const toggleHasCertificate = (index, checked) => {
    const currentCert = (changes.priorSkillsCerts ?? user.priorSkillsCerts)[index]
    handleArrayUpdate("priorSkillsCerts", index, {
      ...currentCert,
      hasCertificate: checked,
      // Reset certificate fields if unchecked
      name: checked ? currentCert.name : "",
      year: checked ? currentCert.year : "",
      priUpload: checked ? currentCert.priUpload : "",
    })
  }

  const PreviewButton = ({ fileUrl }) => {
    if (!fileUrl) return null;
  
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    const handlePreview = () => {
      if (isImage) {
        // Open image in a new window
        window.open(fileUrl, '_blank', 'width=800,height=600');
      } else {
        // For other files, open in new tab
        window.open(fileUrl, '_blank');
      }
    };
  
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handlePreview}
        className="flex items-center gap-2"
      >
        <span>Preview</span>
      </Button>
    );
  };

  const handleSubmit = async () => {
    try {
      // Get the latest skills data from changes or fall back to user data
      const updatedSkillsData = {
        priorSkillsCerts: changes.priorSkillsCerts || user.priorSkillsCerts,
        experience: changes.experience || user.experience
      };

      // Call the parent submitChanges function with the updated data
      await submitChanges("skills", updatedSkillsData);

      // Fix toast implementation
      toast.success("Skills and experience updated successfully");

    } catch (error) {
      console.error("Error updating skills:", error);
      // Fix toast implementation for error
      toast.error("Failed to update skills and experience");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills, Certifications, and Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Prior Skills and Certifications Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Prior Skills and Certifications</h3>
            {isEditable && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addArrayItem("priorSkillsCerts", {
                    sector: "",
                    tradeAreas: [],
                    name: "",
                    year: "",
                    priUpload: "",
                    hasCertificate: false,
                  })
                }
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Skill
              </Button>
            )}
          </div>

          {(changes.priorSkillsCerts ?? user.priorSkillsCerts).length > 0 ? (
            (changes.priorSkillsCerts ?? user.priorSkillsCerts).map((cert, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-md relative">
                {isEditable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem("priorSkillsCerts", index)}
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sector Selection */}
                  <div className="space-y-2">
                    <Label htmlFor={`cert-sector-${index}`} className="text-left text-xs text-gray-600">
                      Sector
                    </Label>
                    <Select
                      value={cert.sector}
                      onValueChange={(value) =>
                        handleArrayUpdate("priorSkillsCerts", index, {
                          ...cert,
                          sector: value,
                          tradeAreas: [], // Reset trade areas when sector changes
                        })
                      }
                      disabled={!isEditable}
                    >
                      <SelectTrigger className={`${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}>
                        <SelectValue placeholder="Select sector" />
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

                  {/* Trade Areas (Multi-Select) */}
                  <div className="space-y-2">
                    <Label htmlFor={`cert-tradeArea-${index}`} className="text-left text-xs text-gray-600">
                      Trade Areas (Select Multiple)
                    </Label>
                    <div className="flex flex-col gap-2">
                      {/* Display selected trade areas as tags */}
                      {cert.tradeAreas && cert.tradeAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {cert.tradeAreas.map((taName, taIndex) => (
                            <div key={taIndex} className="flex items-center bg-blue-100 px-2 py-1 rounded-md">
                              <span className="text-sm">{taName}</span>
                              {isEditable && (
                                <button
                                  type="button"
                                  className="ml-2 text-red-500"
                                  onClick={() => removeTradeArea(index, taName)}
                                >
                                  ��
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Trade area dropdown */}
                      {isEditable && (
                        <Select onValueChange={(value) => handleTradeAreaChange(index, value)} disabled={!cert.sector}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add trade area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sectors
                                ?.find((sector) => sector.name === cert.sector)
                                ?.tradeAreas?.filter((ta) => !cert.tradeAreas?.includes(ta.name))
                                .map((ta) => (
                                  <SelectItem key={ta._id} value={ta.name}>
                                    {ta.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Checkbox - Only for artisan_user */}
                {isArtisanUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`has-certificate-${index}`}
                          checked={cert.hasCertificate || false}
                          onChange={(e) => toggleHasCertificate(index, e.target.checked)}
                          disabled={!isEditable}
                          className={`w-4 h-4 ${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                        />
                        <Label htmlFor={`has-certificate-${index}`} className="text-left text-xs text-gray-600">
                          I have a certificate for this skill
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certificate Details (conditionally shown) */}
                {isArtisanUser && cert.hasCertificate && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Certificate Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`cert-name-${index}`} className="text-left text-xs text-gray-600">
                          Certificate Name
                        </Label>
                        <Input
                          id={`cert-name-${index}`}
                          value={cert.name || ""}
                          onChange={(e) =>
                            handleArrayUpdate("priorSkillsCerts", index, {
                              ...cert,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter certificate name"
                          readOnly={!isEditable}
                          className={`w-full ${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                        />
                      </div>

                      {/* Year Obtained */}
                      <div className="space-y-2">
                        <Label htmlFor={`cert-year-${index}`} className="text-left text-xs text-gray-600">
                          Year Obtained
                        </Label>
                        <Input
                          id={`cert-year-${index}`}
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={cert.year || ""}
                          onChange={(e) =>
                            handleArrayUpdate("priorSkillsCerts", index, {
                              ...cert,
                              year: e.target.value,
                            })
                          }
                          placeholder="Enter year"
                          readOnly={!isEditable}
                          className={`w-full ${!isEditable ? "cursor-not-allowed opacity-50" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Certificate Upload */}
                    <div className="space-y-2">
                      <Label htmlFor={`cert-upload-${index}`} className="text-left text-xs text-gray-600">
                        Upload Certificate
                      </Label>
                      <div className="flex flex-col gap-2">
                        {isEditable ? (
                          <>
                            <UploadButton
                              fileUrl={cert.priUpload}
                              handleFileChange={(url) => handleCertUpload(index, url)}
                              removeFile={() => removeCertUpload(index)}
                            />
                            {cert.priUpload && <PreviewButton fileUrl={cert.priUpload} />}
                          </>
                        ) : cert.priUpload ? (
                          <div className="flex gap-2">
                            <a
                              href={cert.priUpload}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Certificate
                            </a>
                            <PreviewButton fileUrl={cert.priUpload} />
                          </div>
                        ) : (
                          <p>No certificate uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm italic">
              No prior skills added.{" "}
              {isEditable ? 'Click "Add Skill" to add your previous skills or certifications.' : ""}
            </div>
          )}
        </div>

        {/* Experience Section - Only show for artisan_user */}
        {isArtisanUser && (
          <>
            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="text-lg font-semibold">Experience</h3>
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
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Experience
                </Button>
              )}
            </div>

            {(changes.experience ?? user.experience).length > 0 ? (
              (changes.experience ?? user.experience).map((exp, index) => (
                <div key={index} className="mb-4 p-4 border rounded relative">
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("experience", index)}
                      className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

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
                      <div className="flex flex-col gap-2">
                        {isEditable ? (
                          <>
                            <UploadButton
                              fileUrl={exp.exUpload}
                              handleFileChange={(url) => handleExpUpload(index, url)}
                              removeFile={() => removeExpUpload(index)}
                            />
                            {exp.exUpload && <PreviewButton fileUrl={exp.exUpload} />}
                          </>
                        ) : exp.exUpload ? (
                          <div className="flex gap-2">
                            <a
                              href={exp.exUpload}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Document
                            </a>
                            <PreviewButton fileUrl={exp.exUpload} />
                          </div>
                        ) : (
                          <p>No document uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm italic">
                No experience added. {isEditable ? 'Click "Add Experience" to add your work experience.' : ""}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end">
          {isEditable && (
            <Button 
              onClick={handleSubmit} 
              className="mt-4 bg-green-500 hover:bg-green-600"
            >
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillsTab

