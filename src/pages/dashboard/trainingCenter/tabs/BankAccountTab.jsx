"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Bank list data
const banks = [
  { id: 1, name: "Access Bank" },
  { id: 2, name: "First Bank of Nigeria" },
  { id: 3, name: "Guaranty Trust Bank (GTBank)" },
  { id: 4, name: "United Bank for Africa (UBA)" },
  { id: 5, name: "Zenith Bank" },
  { id: 6, name: "Ecobank Nigeria" },
  { id: 7, name: "Stanbic IBTC Bank" },
  { id: 8, name: "Fidelity Bank" },
  { id: 9, name: "Diamond Bank" },
  { id: 10, name: "Wema Bank" },
  { id: 11, name: "Union Bank" },
  { id: 12, name: "Citibank Nigeria" },
  { id: 13, name: "Heritage Bank" },
  { id: 14, name: "Keystone Bank" },
  { id: 15, name: "Providus Bank" },
  { id: 16, name: "Standard Chartered Bank" },
  { id: 17, name: "Jaiz Bank" },
  { id: 18, name: "Paga" },
  { id: 19, name: "Paystack" },
  { id: 20, name: "Flutterwave" },
  { id: 21, name: "Kuda Bank" },
  { id: 22, name: "Opay" },
  { id: 23, name: "Carbon" },
  { id: 24, name: "TeamApt" },
  { id: 25, name: "Interswitch" },
]

const BankAccountTab = ({ center, handleNestedInputChange, handleSubmit }) => {
  const [accountNumberError, setAccountNumberError] = useState("")
  const [customBank, setCustomBank] = useState("")
  const [selectedBank, setSelectedBank] = useState(center?.bankAccount?.bank || "")

  const handleAccountNumberChange = (e) => {
    const accountNumber = e.target.value
    if (accountNumber.length === 10) {
      setAccountNumberError("")
    } else if (accountNumber.length > 10) {
      e.preventDefault()
      setAccountNumberError("Account number cannot exceed 10 digits")
    } else {
      setAccountNumberError("Account number must be 10 digits")
    }
    handleNestedInputChange("bankAccount", "accountNumber", accountNumber)
  }

  const handleCustomBankChange = (e) => {
    setCustomBank(e.target.value)
  }

  const handleAddCustomBank = () => {
    if (customBank.trim() !== "") {
      banks.push({ id: banks.length + 1, name: customBank })
      setCustomBank("")
      handleNestedInputChange("bankAccount", "bank", customBank)
    }
  }

  const handleBankChange = (value) => {
    setSelectedBank(value)
    handleNestedInputChange("bankAccount", "bank", value)
  }

  return (
    <Tabs defaultValue="bank" className="w-full">
      <TabsContent value="bank">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="accountName" className="w-[300px] text-left leading-[1.3]">
              Account Name *
            </Label>
            <Input
              id="accountName"
              name="accountName"
              value={center.bankAccount?.accountName ?? ""}
              onChange={(e) => handleNestedInputChange("bankAccount", "accountName", e.target.value)}
              placeholder="Enter account name"
            />
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="accountNumber" className="w-[300px] text-left leading-[1.3]">
              Account Number *
            </Label>
            <div className="flex-1">
              <Input
                id="accountNumber"
                type="number"
                name="accountNumber"
                value={center.bankAccount?.accountNumber ?? ""}
                onChange={handleAccountNumberChange}
                placeholder="Enter 10-digit account number"
              />
              {accountNumberError && (
                <p className="text-sm text-red-500 mt-1">{accountNumberError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="bank" className="w-[300px] text-left leading-[1.3]">
              Bank Name *
            </Label>
            <Select value={selectedBank} onValueChange={handleBankChange}>
              <SelectTrigger className="flex-1">
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

          {selectedBank === "Others" && (
            <div className="flex items-center gap-4">
              <Label htmlFor="customBank" className="w-[300px] text-left leading-[1.3]">
                Enter Custom Bank *
              </Label>
              <div className="flex-1 flex gap-2">
                <Input
                  id="customBank"
                  type="text"
                  value={customBank}
                  onChange={handleCustomBankChange}
                  placeholder="Enter custom bank name"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomBank}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Add Bank
                </Button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={!!accountNumberError}
          >
            Update Bank Account
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

export default BankAccountTab

