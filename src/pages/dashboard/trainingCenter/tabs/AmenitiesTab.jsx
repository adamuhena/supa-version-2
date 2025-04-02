"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const AmenitiesTab = ({ center, handleNestedInputChange, handleSubmit }) => {
  return (
    <Tabs value="amenities">
      <TabsContent value="amenities">
        <form 
          onSubmit={handleSubmit} 
          className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]"
        >
          <h1 className="text-left font-[700] text-[24px]">
            Training Centre Amenities
          </h1>

          <div className="flex items-center">
            <Label 
              htmlFor="portableWater" 
              className="w-[300px] text-left leading-[1.3]"
            >
              Does the Centre have portable water that is available to Trainee?
            </Label>
            <Select 
              value={center.amenities?.portableWater || ""} 
              onValueChange={(value) => 
                handleNestedInputChange("amenities", "portableWater", value)
              }
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

          <div className="flex items-center">
            <Label 
              htmlFor="observeBreak" 
              className="w-[300px] text-left leading-[1.3]"
            >
              Does the Centre observe break?
            </Label>
            <Select 
              value={center.amenities?.observeBreak || ""} 
              onValueChange={(value) => 
                handleNestedInputChange("amenities", "observeBreak", value)
              }
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

          {center.amenities?.observeBreak === "yes" && (
            <div className="flex items-center">
              <Label 
                htmlFor="breakTime" 
                className="w-[300px] text-left leading-[1.3]"
              >
                What is the break time?
              </Label>
              <Input
                type="time"
                id="breakTime"
                value={center.amenities?.breakTime || ""}
                onChange={(e) => 
                  handleNestedInputChange("amenities", "breakTime", e.target.value)
                }
              />
            </div>
          )}

          <div className="flex items-start">
            <Label 
              htmlFor="otherComments" 
              className="w-[300px] text-left leading-[1.3]"
            >
              Any Other Comments:
            </Label>
            <Textarea
              id="otherComments"
              placeholder="Enter any additional comments"
              value={center.amenities?.otherComments || ""}
              onChange={(e) => 
                handleNestedInputChange("amenities", "otherComments", e.target.value)
              }
              className="min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md mt-4"
          >
            Update Amenities
          </button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

export default AmenitiesTab

