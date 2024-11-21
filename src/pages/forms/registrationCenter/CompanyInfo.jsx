import React, { Fragment } from "react";
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

const CompanyInfo = ({ form, setForm, controlButtons }) => {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700]  text-[24px]">
        Compnay Information
      </h1>
      <div className="ParentDiv">
        <div className="firstDiv">
          <div className="inputGroup">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              type="text"
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <Label>National Identification Number (NIN)</Label>
            <Input
              placeholder="12345678912"
              value={form?.nin}
              onChange={(e) => onchangeInput("nin", e.target?.value)}
            />
            </div>

          <div className="inputGroup">
            <Label htmlFor="RegNumber">Reg Number *</Label>
            <Input
              type="number"
              placeholder="Company Email"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Sector"
            value={form.sector}
            onChange={(e) => updateField("sector", e.target.value)}
          />
          {/* Add other fields here */}
        </div>
      </div>
    </div>
  );
};
export default CompanyInfo;
