import React, { useState } from "react";
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
  // const selectedStateLGASOrigin =
  //   states.find(
  //     (state) =>
  //       replaceSymbolsWithSpace(`${state?.value}`) ===
  //       replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
  //   )?.lgas || [];

  // const selectedStateLGASOriginFormatted =
  //   selectedStateLGASOrigin && selectedStateLGASOrigin?.length
  //     ? selectedStateLGASOrigin.map((x) => ({
  //         label: x,
  //         value: x,
  //       }))
  //     : [];

  

  // const selectedStateLGASResidence =
  //   states.find(
  //     (state) =>
  //       replaceSymbolsWithSpace(`${state?.value}`) ===
  //       replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
  //   )?.lgas || [];

  // const selectedStateLGASResidenceFormatted =
  //   selectedStateLGASResidence && selectedStateLGASResidence?.length
  //     ? selectedStateLGASResidence.map((x) => ({
  //         label: x,
  //         value: x,
  //       }))
  //     : [];
// Function to find the LGAs and Senatorial Districts for State of Origin
const selectedStateLGASOrigin = 
  states.find(
    (state) =>
      replaceSymbolsWithSpace(`${state?.value}`) ===
      replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
  )?.lgas || [];

const selectedStateLGASOriginFormatted =
  selectedStateLGASOrigin && selectedStateLGASOrigin?.length
    ? selectedStateLGASOrigin.map((x) => ({
        label: x,
        value: x,
      }))
    : [];

// Find the Senatorial Districts for State of Origin
const selectedStateSenatorialDistrictsOrigin = 
  states.find(
    (state) =>
      replaceSymbolsWithSpace(`${state?.value}`) ===
      replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
  )?.senatorialDistricts || [];

const selectedStateSenatorialDistrictsOriginFormatted =
  selectedStateSenatorialDistrictsOrigin && selectedStateSenatorialDistrictsOrigin?.length
    ? selectedStateSenatorialDistrictsOrigin.map((x) => ({
        label: x,
        value: x,
      }))
    : [];

// Similarly for State of Residence
const selectedStateLGASResidence = 
  states.find(
    (state) =>
      replaceSymbolsWithSpace(`${state?.value}`) ===
      replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
  )?.lgas || [];

const selectedStateLGASResidenceFormatted =
  selectedStateLGASResidence && selectedStateLGASResidence?.length
    ? selectedStateLGASResidence.map((x) => ({
        label: x,
        value: x,
      }))
    : [];

// Find the Senatorial Districts for State of Residence
const selectedStateSenatorialDistrictsResidence = 
  states.find(
    (state) =>
      replaceSymbolsWithSpace(`${state?.value}`) ===
      replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
  )?.senatorialDistricts || [];

const selectedStateSenatorialDistrictsResidenceFormatted =
  selectedStateSenatorialDistrictsResidence && selectedStateSenatorialDistrictsResidence?.length
    ? selectedStateSenatorialDistrictsResidence.map((x) => ({
        label: x,
        value: x,
      }))
    : [];
  const { hasDisability } = form;
  const handleRadioChange = (e) => {
    onchangeInput("hasDisability", e.target?.value);
  };

  const handleChangeSelectedDIsablity = (value) => {
    onchangeInput("selectedDisability", value);
  };

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[1000px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px] ">
      <h1 className="text-left font-[700]  text-[24px]">
        Personal Information
      </h1>

      <div className="ParentDiv">
        <div className="firstDiv">
          <div className="inputGroup">
            <p htmlFor="firstName">
              First Name{" "}
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Input
              required
              placeholder="First Name"
              value={form?.firstName}
              onChange={(e) => onchangeInput("firstName", e.target?.value)}
            />
          </div>

          <div className="inputGroup">
            <p>Middle Name</p>
            <Input
              placeholder="Middle name"
              required
              value={form?.middleName}
              onChange={(e) => onchangeInput("middleName", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <p>
              Last Name
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Input
              placeholder="Last Name"
              value={form?.lastName}
              onChange={(e) => onchangeInput("lastName", e.target?.value)}
            />
          </div>

          {/* <div className="inputGroup">
            <Label>Email</Label>
            <Input
              placeholder=""
              value={form?.email}
              onChange={(e) => onchangeInput("email", e.target?.value)}
            />
          </div> */}
          {/* <div className="inputGroup">
            <Label>Phone Number</Label>
            <Input
              placeholder=""
              value={form?.phone}
              onChange={(e) => onchangeInput("phone", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label>National Identification Number (NIN)</Label>
            <Input
              placeholder=""
              value={form?.nin}
              onChange={(e) => onchangeInput("nin", e.target?.value)}
            />
          </div> */}
          <div className="inputGroup">
            <p>
              Gender
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
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
            <p>
              State Of Origin
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Select
              value={form?.state}
              onValueChange={(value) => onchangeInput("stateOfOrigin", value)}>
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
            <p>
              LGA Of Origin
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Select
              value={form?.lga}
              onValueChange={(value) => onchangeInput("lga", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedStateLGASOriginFormatted.map((item) => {
                    return (
                      <SelectItem value={item?.value}>{item?.label}</SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <p>
              State Of Residence
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Select
              value={form?.stateOfResidence}
              onValueChange={(value) =>
                onchangeInput("stateOfResidence", value)
              }>
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
            <p>
              LGA Of Residence
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Select
              value={form?.lgaOfResidence}
              onValueChange={(value) => onchangeInput("lgaOfResidence", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedStateLGASResidenceFormatted.map((item) => {
                    return (
                      <SelectItem value={item?.value}>{item?.label}</SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <p>
              Residencial Address
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Input
              placeholder=""
              value={form?.street}
              onChange={(e) => onchangeInput("street", e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <p>
              Marital Status
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
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
            <p>
              Senatorial District
              <span className="text-red-600 ml-[4px] text-[13px]">*</span>
            </p>
            <Select
              value={form?.senetorialDistrict}
              onValueChange={(value) =>
                onchangeInput("senetorialDistrict", value)
              }>
              <SelectTrigger className="">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedStateSenatorialDistrictsOriginFormatted.map((item) => {
                    return (
                      <SelectItem value={item?.value}>{item?.label}</SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <div className="radioGroup">
              <div>
                <span>Are you a person with disability? </span>
                <span className="text-red-600 ml-[4px] text-[13px]">*</span>
              </div>

              {/* <div>
                <input type="radio" id="yes" name="disability" value="yes" />{" "}
                <label for="yes">Yes</label>
                <input type="radio" id="no" name="disability" value="no" />{" "}
                <label for="no">No</label>
              </div> */}

              <div>
                {/* Radio buttons */}
                <div className="flex items-start gap-4">
                  {/* Radio buttons */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="yes"
                      name="disability"
                      value="yes"
                      onChange={handleRadioChange}
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

                  {/* Dropdown for disabilities */}
                  {hasDisability === "yes" && (
                    <div className="flex">
                      <label
                        className="block text-sm font-medium mb-2 "
                        htmlFor="disabilityType">
                        Select your disability:
                      </label>
                      <Select onValueChange={handleChangeSelectedDIsablity}>
                        <SelectTrigger id="disabilityType" className="w-full">
                          <SelectValue placeholder="-- Select --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Disability Types</SelectLabel>
                            <SelectItem value="visual">
                              Visual Impairment
                            </SelectItem>
                            <SelectItem value="hearing">
                              Hearing Impairment
                            </SelectItem>
                            <SelectItem value="mobility">
                              Mobility Impairment
                            </SelectItem>
                            <SelectItem value="cognitive">
                              Cognitive Impairment
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
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
