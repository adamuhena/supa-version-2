import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./index.css";

const BankDetails = ({ form, setForm , controlButtons}) => {
    const updateField = (field, value) => {
      setForm((prev) => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, [field]: value },
      }));
    };
  
    return (
      <div 
        style={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          marginBottom: "100px",
          background: "white",
        }}
        className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
        <h1 className="text-left font-[700] text-[24px]">Bank Account Details</h1>
        <div className="flex items-center ">
          <Label htmlFor="accountName" className="w-[300px] text-left leading-[1.3]">
            Account Name *
          </Label>
          <Input
            type="text"
            id="accountName"
            placeholder="Account Name"
            value={form.bankAccount.accountName}
            onChange={(e) => updateField("accountName", e.target.value)}
          />
        </div>
        <div className="flex items-center ">
        <Label htmlFor="accountNumber" className="w-[300px] text-left leading-[1.3]">
          Account Number *
        </Label>
        <Input
          type="number"
          id="accountNumber"
          placeholder="Enter 10-digit account number"
          value={form?.bankAccount?.accountNumber}
          onChange={(e) => onChangeBankInput("accountNumber", e.target?.value)}
        />
      </div>

      <div className="flex items-center ">
        <Label htmlFor="bank" className="w-[300px] text-left leading-[1.3]">
          Bank Name *
        </Label>
        <Select
          value={form?.bankAccount?.bank}
          onChange={(e) => updateField("bank", e.target.value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Bank 1">Bank 1</SelectItem>
              <SelectItem value="Bank 2">Bank 2</SelectItem>
              <SelectItem value="Bank 3">Bank 3</SelectItem>
              <SelectItem value="Bank 4">Bank 4</SelectItem>
              <SelectItem value="Bank 5">Bank 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {controlButtons}
      </div>
    );
  };
  
  export default BankDetails;
  