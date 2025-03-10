import React, {useState, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { states } from "../../../data/nigeria";

const PersonalTab = ({ user, handleUpdate, submitChanges }) => {
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

  // Has Disability
const [hasDisability, setHasDisability] = useState(user.hasDisability ? "yes" : "no");

const handleRadioChange = (e) => {
  const value = e.target.value;
  setHasDisability(value);
  handleUpdate("hasDisability", value === "yes");
  if (value === "no") {
    handleUpdate("disabilityType", "");
  }
};

const handleChangeSelectedDIsablity = (value) => {
  handleUpdate("disabilityType", value);
};

// const handleSubmit = () => {
//   console.log('Submitting personal info:', user);
//   submitChanges("personal"); // Changed from "personalInfo" to "personal"
// };

const handleSubmit = () => {
  console.log("Submitting personal info:", user);
  submitChanges("personal");
};

  return (
    <TabsContent value="personal">
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
              />
            </div>
          ))}

          {/* Add Date of Birth field separately */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={user.dob ?? ""}
              onChange={(e) => handleUpdate("dob", e.target.value)}
            />
          </div>
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
              >
                <SelectTrigger>
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
              >
                <SelectTrigger>
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
                disabled={!user.stateOfOrigin}
              >
                <SelectTrigger>
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
                disabled={!user.stateOfOrigin}
              >
                <SelectTrigger>
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
              >
                <SelectTrigger>
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
                disabled={!user.stateOfResidence}
              >
                <SelectTrigger>
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
          
          {/* <div className="space-y-2">
            <Label htmlFor="hasDisability">Has Disability</Label>
            <Switch
              id="hasDisability"
              checked={user.hasDisability ?? false}
              onCheckedChange={(checked) =>
                handleUpdate("hasDisability", checked)
              }
            />
          </div>
          {(user.hasDisability) && (
            <div className="space-y-2">
              <Label htmlFor="disabilityType">Disability Type</Label>
              <Input
                id="disabilityType"
                value={user.disabilityType ?? ""}
                onChange={(e) =>
                  handleUpdate("disabilityType", e.target.value)
                }
              />
            </div>
          )} */}

          {/* <div className="space-y-4">
            <div className="radioGroup">
              <div>
                <span>Are you a person with disability? </span>
                <span className="text-red-600 ml-[4px] text-[13px]">*</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="yes"
                    name="disability"
                    value="yes"
                    onChange={handleRadioChange}
                    checked={hasDisability === "yes"}
                  />
                  <label htmlFor="yes">Yes</label>

                  <input
                    type="radio"
                    id="no"
                    name="disability"
                    value="no"
                    onChange={handleRadioChange}
                    checked={hasDisability === "no"}
                  />
                  <label htmlFor="no">No</label>
                </div>

                {hasDisability === "yes" && (
                  <div className="flex gap-2">
                    <label
                      className="block text-sm font-medium"
                      htmlFor="disabilityType">
                      Select your disability:
                    </label>
                    <Select 
                      onValueChange={handleChangeSelectedDIsablity}
                      value={user.disabilityType ?? ""}
                    >
                      <SelectTrigger id="disabilityType" className="w-[200px]">
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
          </div> */}
        </div>

        <div className="space-y-4 pt-6">
            <div className="radioGroup">
              

              <div className="flex items-start gap-4">
              <div>
                <span>Are you a person with disability? </span>
                <span className="text-red-600 ml-[4px] text-[13px]">*</span>
              </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="yes"
                    name="disability"
                    value="yes"
                    onChange={handleRadioChange}
                    checked={hasDisability === "yes"}
                  />
                  <label htmlFor="yes">Yes</label>

                  <input
                    type="radio"
                    id="no"
                    name="disability"
                    value="no"
                    onChange={handleRadioChange}
                    checked={hasDisability === "no"}
                  />
                  <label htmlFor="no">No</label>
                </div>

                {hasDisability === "yes" && (
                  <div className="flex gap-2">
                    <label
                      className="block text-sm font-medium"
                      htmlFor="disabilityType">
                      Select your disability:
                    </label>
                    <Select 
                      onValueChange={handleChangeSelectedDIsablity}
                      value={user.disabilityType ?? ""}
                    >
                      <SelectTrigger id="disabilityType" className="w-[200px]">
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
          
        <Button 
            onClick={handleSubmit} 
            className="mt-4"
          >
            Update Personal Information
          </Button>
        {/* <Button onClick={() => submitChanges("personalInfo")} className="mt-4">
          Update Personal Information
        </Button> */}
        {/* <Button onClick={handleSubmit} className="mt-4">
      Update Personal Information
    </Button> */}
      </CardContent>
            </Card>
          </TabsContent>
  )
}

export default PersonalTab