import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import "./index.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { states } from "../../../data/nigeria";

function replaceSymbolsWithSpace(str = "") {
  let replacedStr = str.replace(/[-/]/g, " ");
  return replacedStr.toLowerCase();
}

export default function ProfessionalInformaiton({
  controlButtons,
  form,
  onchangeInput,
}) {
  const selectedStateLGAS =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.state}`)
    )?.lgas || [];

  const selectedStateLGASFormatted =
    selectedStateLGAS && selectedStateLGAS?.length
      ? selectedStateLGAS.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[1000px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px] ">
      <h1 className="text-left font-[700]  text-[24px]">
        Professional Information
      </h1>

      <div className="ParentDiv">
        <div className="firstDiv">
          <div className="inputGroup">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              placeholder=""
              value={form?.firstName}
              onChange={(e) => onchangeInput("firstName", e.target?.value)}
            />
          </div>

          <div className="inputGroup">
            <Label>Middle Name</Label>
            <Input
              placeholder="Middle name"
              required
              value={form?.middleName}
              onChange={(e) => onchangeInput("middleName", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label>Last Name</Label>
            <Input
              placeholder="Last Name"
              value={form?.lastName}
              onChange={(e) => onchangeInput("lastName", e.target?.value)}
            />
          </div>

          <div className="inputGroup">
            <Label>Email</Label>
            <Input
              placeholder=""
              value={form?.email}
              onChange={(e) => onchangeInput("email", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label>Phone Number</Label>
            <Input
              placeholder=""
              value={form?.phone}
              onChange={(e) => onchangeInput("phone", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label>Gender</Label>
            <Select
              value={form?.gender}
              onValueChange={(value) => onchangeInput("gender", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label>Marital Status</Label>
            <Select
              value={form?.maritalStatus}
              onValueChange={(value) => onchangeInput("maritalStatus", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label>Sector</Label>
            <Select
              value={form?.sector}
              onValueChange={(value) => onchangeInput("sector", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Building and Construction">
                    Building and Construction
                  </SelectItem>
                  <SelectItem value="Welding">Welding</SelectItem>
                  <SelectItem value="ICT">ICT</SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Animal Husbandry">
                    Animal Husbandry
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <Label>Trade Area</Label>
            <Select
              value={form?.tradeArea}
              onValueChange={(value) => onchangeInput("tradeArea", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Trade Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Trade Area 1">Trade Area 1</SelectItem>
                  <SelectItem value="Trade Area 2">Trade Area 2</SelectItem>
                  <SelectItem value="Trade Area 3">Trade Area 3</SelectItem>
                  <SelectItem value="Trade Area 4">Trade Area 4</SelectItem>
                  <SelectItem value="Trade Area 5">Trade Area 5</SelectItem>
                  <SelectItem value="Trade Area 6">Trade Area 6</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label>State</Label>
            <Select
              value={form?.state}
              onValueChange={(value) => onchangeInput("state", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {states.map((item) => {
                    return (
                      <SelectItem value={item?.value}>{item?.label}</SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <Label>LGA</Label>
            <Select
              value={form?.lga}
              onValueChange={(value) => onchangeInput("lga", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedStateLGASFormatted.map((item) => {
                    return (
                      <SelectItem value={item?.value}>{item?.label}</SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <Label>City</Label>
            <Input
              placeholder=""
              value={form?.city}
              onChange={(e) => onchangeInput("city", e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <Label>Street Address</Label>
            <Input
              placeholder=""
              value={form?.street}
              onChange={(e) => onchangeInput("street", e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <div className="radioGroup">
              <div>
                <span>Are you a person with disability? </span>
              </div>

              <div>
                <input type="radio" id="yes" name="disability" value="yes" />{" "}
                <label for="yes">Yes</label>
                <input type="radio" id="no" name="disability" value="no" />{" "}
                <label for="no">No</label>
              </div>
            </div>
            <br />

            <br />
          </div>
        </div>
      </div>
      {controlButtons}
    </div>
  );
}
