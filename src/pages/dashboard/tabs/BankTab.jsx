// File: BankTab.jsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  { id: 26, name: "Others" }
];

const BankTab = ({ user, handleUpdate, submitChanges }) => {
  const [selectedBank, setSelectedBank] = useState(user.bankAccount?.bank || "");
  const [customBank, setCustomBank] = useState("");

  useEffect(() => {
    if (user.bankAccount) {
      setSelectedBank(user.bankAccount.bank || "");
    }
  }, [user.bankAccount]);

  const handleFieldChange = (field, value) => {
    handleUpdate(`bankAccount.${field}`, value);
  };

  const handleCustomBankChange = (e) => {
    setCustomBank(e.target.value);
  };

  const handleAddCustomBank = (e) => {
    e.preventDefault();
    if (customBank.trim()) {
      handleFieldChange("bank", customBank);
      setSelectedBank(customBank);
      setCustomBank("");
    }
  };

  // Directly check user.role instead of using a separate prop
  const isEditable =  user?.role === "superadmin";
  // const isEditable = user?.role === "admin" || user?.role === "superadmin" || user?.role === "artisan_user"
  const validateAccountNumber = (value) => /^\d{10}$/.test(value);

  return (
    <TabsContent value="bank">
      <Card>
        <CardHeader>
          <CardTitle>Bank Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={user.bankAccount?.accountName || ""}
                onChange={(e) => handleFieldChange("accountName", e.target.value)}
                type="text"
                disabled={!isEditable}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={user.bankAccount?.accountNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  handleFieldChange("accountNumber", value);
                }}
                type="text"
                pattern="\d{10}"
                maxLength={10}
                disabled={!isEditable}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">Bank Name</Label>
              <Select
                value={selectedBank}
                onValueChange={(value) => {
                  setSelectedBank(value);
                  if (value !== "Others") {
                    handleFieldChange("bank", value);
                  }
                }}
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBank === "Others" && (
            <div className="flex items-center mt-4">
              <Label htmlFor="customBank" className="w-[300px] text-left leading-[1.3]">
                Enter Custom Bank *
              </Label>
              <Input
                type="text"
                id="customBank"
                placeholder="Enter custom bank name"
                value={customBank}
                onChange={handleCustomBankChange}
                disabled={!isEditable}
              />
              <Button
                onClick={handleAddCustomBank}
                className="ml-2"
                variant="secondary"
                disabled={!isEditable}
              >
                Add Bank
              </Button>
            </div>
          )}

          <Button
            onClick={() => submitChanges("bankAccount")}
            className="mt-4  bg-green-500 hover:bg-green-600"
            disabled={!isEditable || !validateAccountNumber(user.bankAccount?.accountNumber)}
          >
            Update Bank Account
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default BankTab;
