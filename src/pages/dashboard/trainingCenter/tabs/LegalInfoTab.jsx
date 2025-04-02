"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import UploadButton from "@/components/UploadButton"
import { useState, useEffect } from "react"
import { fetchSectors } from "@/services/api"
import { Plus, Trash2, Eye } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LegalInfoTab = ({ center, handleNestedInputChange, handleSubmit }) => {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch sectors on component mount
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

  const addTradeArea = () => {
    const newTradeArea = {
      sector: [], // Initialize as empty array to match the data structure
      tradeArea: [],
      instructors: "",
      trainees: "",
      facilities: "",
      equipment: "",
      tools: "",
    };
    
    handleNestedInputChange(
      "legalInfo",
      "tradeAreas",
      [...(center.legalInfo?.tradeAreas || []), newTradeArea]
    );
  };

  const removeTradeArea = (index) => {
    const updatedTradeAreas = (center.legalInfo?.tradeAreas || []).filter((_, i) => i !== index)
    handleNestedInputChange("legalInfo", "tradeAreas", updatedTradeAreas)
  }

  const updateTradeArea = async (sector, field, value) => {
    if (
      field === "sector" &&
      (center?.legalInfo?.tradeAreas || []).find((i) => i?.sector?.[0]?._id === value)
    ) {
      return alert(`You cannot add the same sector twice`);
    }

    const tradeAreas = center.legalInfo?.tradeAreas || [];
    const updatedTradeAreas = tradeAreas.map((z, idx) => {
      if (z?.sector === sector) {
        if (field === "sector") {
          // When selecting a sector, find it from sectors array and update
          const selectedSector = sectors.find(s => s._id === value);
          return {
            ...z,
            sector: [selectedSector], // Store full sector object
            tradeArea: [] // Reset trade areas when sector changes
          };
        } else if (field === "tradeArea") {
          const currentTradeAreas = z.tradeArea || [];
          const newTradeAreas = currentTradeAreas.includes(value)
            ? currentTradeAreas.filter(id => id !== value)
            : [...currentTradeAreas, value];
          
          return {
            ...z,
            tradeArea: newTradeAreas
          };
        } else {
          return {
            ...z,
            [field]: value
          };
        }
      }
      return z;
    });

    handleNestedInputChange("legalInfo", "tradeAreas", updatedTradeAreas);
  };

  const handleTradeAreaChange = (index, field, value) => {
    const updatedTradeAreas = [...(center.legalInfo?.tradeAreas || [])];
    updatedTradeAreas[index] = {
      ...updatedTradeAreas[index],
      [field]: value
    };
    handleNestedInputChange("legalInfo", "tradeAreas", updatedTradeAreas);
  };

  return (
    <Tabs value="legal">
      <TabsContent value="legal">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Legal Registration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
                Legal Registration/Licensing Information
              </Label>
              <Textarea
                id="legalRegistration"
                name="legalRegistration"
                value={center.legalInfo?.legalRegistration || ""}
                onChange={(e) => handleNestedInputChange("legalInfo", "legalRegistration", e.target.value)}
                placeholder="Enter legal registration details"
                className="min-h-[100px] mt-2"
              />
            </div>

            {/* Supporting Documents */}
            <div>
              <Label htmlFor="supportingDocuments">Supporting Documents</Label>
              <div className="mt-2 space-y-2">
                <UploadButton
                  fileUrl={center.legalInfo?.supportingDocuments?.[0] || ""}
                  handleFileChange={(url) => {
                    handleNestedInputChange("legalInfo", "supportingDocuments", [url])
                  }}
                  removeFile={() => {
                    handleNestedInputChange("legalInfo", "supportingDocuments", [])
                  }}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
                />
                {center.legalInfo?.supportingDocuments?.[0] && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(center.legalInfo.supportingDocuments[0], '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Document
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Trade Areas Section */}
          <div className="space-y-4">
            <h2 className="text-left font-[600] text-[20px] mt-4">
              Trade Area Profile:
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
                  {(center.legalInfo?.tradeAreas || []).map((trade, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">
                        <Select
                          value={trade.sector?.[0]?._id || ""}
                          onValueChange={(value) => {
                            updateTradeArea(trade?.sector, "sector", value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {trade.sector?.[0]?.name || "Select Sector"}
                            </SelectValue>
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
                        
                        {/* Display selected trade areas */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.isArray(trade?.tradeArea) && trade.tradeArea.map((ta_id) => {
                            const tradeAreaInfo = trade.sector?.[0]?.tradeAreas?.find(
                              ta => ta._id === ta_id
                            );
                            return tradeAreaInfo && (
                              <div 
                                key={ta_id} 
                                className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-blue-600 flex items-center gap-1"
                              >
                                {tradeAreaInfo.name}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    updateTradeArea(trade?.sector, "tradeArea", ta_id);
                                  }}
                                  className="hover:text-red-600 font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Select
                          value=""
                          onValueChange={(value) => {
                            updateTradeArea(trade?.sector, "tradeArea", value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add trade area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {trade.sector?.[0]?.tradeAreas?.filter(ta => 
                                !trade.tradeArea?.includes(ta._id)
                              ).map((ta) => (
                                <SelectItem key={ta._id} value={ta._id}>
                                  {ta.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          value={trade.instructors || ""}
                          onChange={(e) => handleTradeAreaChange(index, "instructors", e.target.value)}
                          placeholder="Number"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          value={trade.trainees || ""}
                          onChange={(e) => handleTradeAreaChange(index, "trainees", e.target.value)}
                          placeholder="Number"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={trade.facilities || ""}
                          onChange={(e) => handleTradeAreaChange(index, "facilities", e.target.value)}
                          placeholder="List facilities"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={trade.equipment || ""}
                          onChange={(e) => handleTradeAreaChange(index, "equipment", e.target.value)}
                          placeholder="List equipment"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          value={trade.tools || ""}
                          onChange={(e) => handleTradeAreaChange(index, "tools", e.target.value)}
                          placeholder="List tools"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          type="button"
                          className="text-red-500 text-[12px]"
                          onClick={(e) => {
                            e.preventDefault();
                            removeTradeArea(index);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(center.legalInfo?.tradeAreas || []).length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500 text-sm italic">
                        No trade areas added. Click "Add Trade Area" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addTradeArea();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded self-start"
            >
              Add Trade Area
            </Button>
          </div>

          {/* Instructor Credentials */}
          <div className="space-y-2">
            <Label htmlFor="instructorCredentials">Instructor Credentials</Label>
            <div className="mt-2 space-y-2">
              <UploadButton
                fileUrl={center.legalInfo?.instructorCredentials?.[0] || ""}
                handleFileChange={(url) => {
                  handleNestedInputChange("legalInfo", "instructorCredentials", [url])
                }}
                removeFile={() => {
                  handleNestedInputChange("legalInfo", "instructorCredentials", [])
                }}
                accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
              />
              {center.legalInfo?.instructorCredentials?.[0] && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(center.legalInfo.instructorCredentials[0], '_blank')}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Document
                </Button>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea
              id="additionalDetails"
              value={center.legalInfo?.additionalDetails || ""}
              onChange={(e) => handleNestedInputChange("legalInfo", "additionalDetails", e.target.value)}
              placeholder="Enter any additional details"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
            Update Legal Info
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

export default LegalInfoTab

