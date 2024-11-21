import React from "react";
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
import {states} from "@/data/nigeria.ts";

function replaceSymbolsWithSpace(str = "") {
  let replacedStr = str.replace(/[-/]/g, " ");
  return replacedStr.toLowerCase();
}

const CompanyInfo = ({ form, setForm, controlButtons }) => {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
          className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
      >
        <h1 className="text-left font-[700] text-[24px]">Company Information</h1>

        <div className="flex items-center">
          <Label htmlFor="companyName" className="w-[300px] text-left leading-[1.3]">
            Company Name *
          </Label>
          <Input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="nin" className="w-[300px] text-left leading-[1.3]">
            National Identification Number (NIN)
          </Label>
          <Input
              id="nin"
              placeholder="12345678912"
              value={form.nin}
              onChange={(e) => updateField("nin", e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="regNum" className="w-[300px] text-left leading-[1.3]">
            Reg Number *
          </Label>
          <Input
              type="string"
              id="regNumber"
              placeholder="Enter registration number"
              value={form.regNum}
              onChange={(e) => updateField("regNum", e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="sector" className="w-[300px] text-left leading-[1.3]">
            Sector
          </Label>
          <Select
              value={form.sector}
              onValueChange={(value) => updateField("sector", value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select sector"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Label  htmlFor="state" className="w-[300px] text-left leading-[1.3]">State</Label>
          <Select
              value={form?.state}
              onValueChange={(value) => updateField("state", value)}>
            <SelectTrigger className="">
              <SelectValue placeholder=""/>
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

        <div className="flex items-center">
          <Label htmlFor="lga" className="w-[300px] text-left leading-[1.3]">LGA</Label>
          <Select
              value={form?.lga}
              onValueChange={(value) => updateField("lga", value)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select LGA"/>
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

        <div className="flex items-center">
          <Label htmlFor="address" className="w-[300px] text-left leading-[1.3]">
            Address *
          </Label>
          <Input
              type="string"
              id="address"
              placeholder="Enter Address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
          />
        </div>


        {controlButtons}
      </div>
  );
};

export default CompanyInfo;

