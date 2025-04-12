

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

// Extended list of Nigerian Banks and Fintechs
const banks = [
  { id: 1, name: "Access Bank" },
  { id: 2, name: "First Bank of Nigeria" },
  { id: 3, name: "Guaranty Trust Bank (GTBank)" },
  { id: 4, name: "United Bank for Africa (UBA)" },
  { id: 5, name: "Zenith Bank" },
  { id: 6, name: "Ecobank Nigeria" },
  { id: 7, name: "Stanbic IBTC Bank" },
  { id: 8, name: "Fidelity Bank" },
  { id: 9, name: "Polaris Bank" },
  { id: 10, name: "Wema Bank" },
  { id: 11, name: "Union Bank" },
  { id: 12, name: "Citibank Nigeria" },
  { id: 13, name: "Heritage Bank" },
  { id: 14, name: "Keystone Bank" },
  { id: 15, name: "Providus Bank" },
  { id: 16, name: "Standard Chartered Bank" },
  { id: 17, name: "Jaiz Bank" },
  { id: 18, name: "Paga" }, // Fintech
  { id: 19, name: "Paystack" }, // Fintech
  { id: 20, name: "Flutterwave" }, // Fintech
  { id: 21, name: "Kuda Bank" }, // Fintech
  { id: 22, name: "Opay" }, // Fintech
  { id: 23, name: "Carbon" }, // Fintech
  { id: 24, name: "TeamApt" }, // Fintech
  { id: 25, name: "Interswitch" }, // Fintech
];

export default function BankDetails({
  controlButtons,
  form,
  onChangeBankInput,
}) {
  const [accountNumberError, setAccountNumberError] = useState("");
  const [customBank, setCustomBank] = useState(""); // State for custom bank input
  const [selectedBank, setSelectedBank] = useState(form?.bankAccount?.bank || ""); // State for selected bank

  const handleAccountNumberChange = (e) => {
    const accountNumber = e.target.value;
    if (accountNumber.length === 10) {
      setAccountNumberError("");
    } else if (accountNumber.length > 10) {
      e.preventDefault();
      setAccountNumberError("Account number cannot exceed 10 digits");
    } else {
      setAccountNumberError("Account number must be 10 digits");
    }
    onChangeBankInput("accountNumber", accountNumber);
  };

  const handleCustomBankChange = (e) => {
    setCustomBank(e.target.value);
  };

  const handleAddCustomBank = () => {
    if (customBank.trim() !== "") {
      // Add the custom bank to the list
      banks.push({ id: banks.length + 1, name: customBank });
      setCustomBank(""); // Clear the input after adding
      onChangeBankInput("bank", customBank); // Set custom bank value in form
    }
  };

  const handleBankChange = (value) => {
    setSelectedBank(value);
    onChangeBankInput("bank", value); // Update the selected bank in form
  };

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
    >
      <h1 className="text-left font-[700] text-[24px]">Bank Account Details</h1>

      <div className="flex items-center ">
        <Label htmlFor="accountName" className="w-[300px] text-left leading-[1.3]">
          Account Name *
        </Label>
        <Input
          type="text"
          id="accountName"
          placeholder="Enter account name"
          value={form?.bankAccount?.accountName}
          onChange={(e) => onChangeBankInput("accountName", e.target?.value)}
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
          onChange={handleAccountNumberChange}
        />
        {accountNumberError && <div className="text-red-500">{accountNumberError}</div>}
      </div>

      <div className="flex items-center ">
        <Label htmlFor="bank" className="w-[300px] text-left leading-[1.3]">
          Bank Name *
        </Label>
        <Select
          value={selectedBank}
          onValueChange={handleBankChange}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.name}>
                  {bank.name}
                </SelectItem>
              ))}
              <SelectItem value="Others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Conditionally show the custom bank input field when 'Others' is selected */}
      {selectedBank === "Others" && (
        <div className="flex items-center ">
          <Label htmlFor="customBank" className="w-[300px] text-left leading-[1.3]">
            Enter Custom Bank *
          </Label>
          <Input
            type="text"
            id="customBank"
            placeholder="Enter custom bank name"
            value={customBank}
            onChange={handleCustomBankChange}
          />
          <button
            onClick={handleAddCustomBank}
            className="ml-5 p-2 bg-emarald-500 text-white rounded"
          >
            Add Bank
          </button>
        </div>
      )}

      {controlButtons}
    </div>
  );
}
