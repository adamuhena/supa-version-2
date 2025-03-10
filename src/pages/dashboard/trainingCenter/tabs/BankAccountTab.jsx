import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BankAccountTab = ({
  center,
  handleNestedInputChange,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    //   <TabsContent value="BankAccount">
    <TabsContent value="bank">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="accountName"
          value={center.bankAccount?.accountName ?? ""}
          onChange={(e) =>
            handleNestedInputChange(
              "bankAccount",
              "accountName",
              e.target.value
            )
          }
          placeholder="Account Name"
        />
        <Input
          name="accountNumber"
          value={center.bankAccount?.accountNumber ?? ""}
          onChange={(e) =>
            handleNestedInputChange(
              "bankAccount",
              "accountNumber",
              e.target.value
            )
          }
          placeholder="Account Number"
        />
        <Input
          name="bank"
          value={center.bankAccount?.bank ?? ""}
          onChange={(e) =>
            handleNestedInputChange("bankAccount", "bank", e.target.value)
          }
          placeholder="Bank Name"
        />
        <Button type="submit">Update Bank Account</Button>
      </form>
    </TabsContent>
  );
};

export default BankAccountTab;
