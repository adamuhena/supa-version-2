import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./index.css";
import { states } from "@/data/nigeria.ts";

const CompanyInfo = ({ form, setForm, controlButtons }) => {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const [lgas, setLgas] = useState([]);

  const handleStateChange = (stateName) => {
    updateField("state", stateName); // Update state in the form
    const selectedState = states.find((state) => state.value === stateName); // Find the selected state
    setLgas(selectedState ? selectedState.lgas : []); // Update LGAs based on the selected state
    updateField("lga", ""); // Reset LGA field when state changes
  };

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[1200px] mx-auto py-[30px] flex flex-wrap px-5 gap-[30px] bg-white rounded-[16px] ">
      <h1 className="text-left font-[700] text-[24px] w-full">
        Training Centre Profile
      </h1>

      {/* <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label htmlFor="state" className="w-[300px] text-left leading-[1.3]">
          State
        </Label>
        <Select
          value={form.state}
          onValueChange={(value) => updateField("state", value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {states.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label htmlFor="lga" className="w-[300px] text-left leading-[1.3]">
          LGA
        </Label>
        <Select
          value={form.lga}
          onValueChange={(value) => updateField("lga", value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select LGA" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {states.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
{/* State Dropdown */}
<div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label htmlFor="state" className="w-[300px] text-left leading-[1.3]">
          State where the Training Centre is located
        </Label>
        <Select value={form.state} onValueChange={handleStateChange}>
          <SelectTrigger className="">
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

      {/* LGA Dropdown */}
      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
  <Label htmlFor="lga" className="w-[300px] text-left leading-[1.3]">
    LGA where the Training Centre is located
  </Label>
  <Select
    value={form.lga}
    onValueChange={(value) => updateField("lga", value)}
    disabled={!lgas.length} // Disable dropdown if no LGAs are available
  >
    <SelectTrigger className="">
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


      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="areaOffice"
          className="w-[300px] text-left leading-[1.3]">
          Area Office
        </Label>
        <Input
          id="areaOffice"
          placeholder="Enter Area Office"
          value={form.areaOffice}
          onChange={(e) => updateField("areaOffice", e.target.value)}
        />
      </div>

      {/* <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="trainingCentreName"
          className="w-[300px] text-left leading-[1.3]">
          Name of Training Centre
        </Label>
        <Input
          id="trainingCentreName"
          placeholder="Enter Training Centre Name"
          value={form.trainingCentreName}
          onChange={(e) => updateField("trainingCentreName", e.target.value)}
        />
      </div> */}

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label htmlFor="address" className="w-[300px] text-left leading-[1.3]">
          Address of Training Centre
        </Label>
        <Input
          id="address"
          placeholder="Enter Address of Training Centre"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </div>

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="contactPerson"
          className="w-[300px] text-left leading-[1.3]">
          Name of Contact Person
        </Label>
        <Input
          id="contactPerson"
          placeholder="Enter Name of Contact Person"
          value={form.contactPerson}
          onChange={(e) => updateField("contactPerson", e.target.value)}
        />
      </div>

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="phoneNumber"
          className="w-[300px] text-left leading-[1.3]">
          Phone No./WhatsApp
        </Label>
        <Input
          id="phoneNumber"
          placeholder="Enter Phone Number"
          value={form.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
        />
      </div>

      {/* <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          E-Mail Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email Address"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div> */}

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="establishmentDate"
          className="w-[300px] text-left leading-[1.3]">
          Date of Establishment
        </Label>
        <Input
          id="establishmentDate"
          type="date"
          value={form.establishmentDate}
          onChange={(e) => updateField("establishmentDate", e.target.value)}
        />
      </div>

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="ownership"
          className="w-[300px] text-left leading-[1.3]">
          Ownership
        </Label>
        <Select
          value={form.ownership}
          onValueChange={(value) => updateField("ownership", value)}>
          <SelectTrigger className="">
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

      {form.ownership === "other" && (
        <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
          <Label
            htmlFor="otherOwnership"
            className="w-[300px] text-left leading-[1.3]">
            Specify Other Ownership
          </Label>
          <Input
            id="otherOwnership"
            placeholder="Specify Other Ownership"
            value={form.otherOwnership}
            onChange={(e) => updateField("otherOwnership", e.target.value)}
          />
        </div>
      )}

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="trainingNature"
          className="w-[300px] text-left leading-[1.3]">
          Nature of Training
        </Label>
        <Select
          value={form.trainingNature}
          onValueChange={(value) => updateField("trainingNature", value)}>
          <SelectTrigger className="">
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

      <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
        <Label
          htmlFor="itfRegistered"
          className="w-[300px] text-left leading-[1.3]">
          Is the Centre registered with ITF?
        </Label>
        <Select
          value={form.itfRegistered}
          onValueChange={(value) => updateField("itfRegistered", value)}>
          <SelectTrigger className="">
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

      {form.itfRegistered === "yes" && (
        <div className="flex basis-[30%] flex-col items-start justify-start text-left gap-y-2">
          <Label
            htmlFor="itfRegistrationNumber"
            className="w-[300px] text-left leading-[1.3]">
            ITF Registration Number
          </Label>
          <Input
            id="itfRegistrationNumber"
            placeholder="Enter ITF Registration Number"
            value={form.itfRegistrationNumber}
            onChange={(e) =>
              updateField("itfRegistrationNumber", e.target.value)
            }
          />
        </div>
      )}

      {controlButtons}
    </div>
  );
};

export default CompanyInfo;
