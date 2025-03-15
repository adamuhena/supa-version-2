import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CenterDetailsTab = ({ center, handleInputChange, handleSubmit }) => {
  return (
    //   <TabsContent value="details">
    <TabsContent value="details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="state"
          value={center.state}
          onChange={handleInputChange}
          placeholder="State"
        />
        <Input
          name="lga"
          value={center.lga}
          onChange={handleInputChange}
          placeholder="LGA"
        />
        <Input
          name="sector"
          value={center.sector}
          onChange={handleInputChange}
          placeholder="Sector"
        />
        <Input
          name="contactPerson"
          value={center.contactPerson}
          onChange={handleInputChange}
          placeholder="Contact Person"
        />
        <Input
          name="establishmentDate"
          type="date"
          value={center.establishmentDate}
          onChange={handleInputChange}
          placeholder="Establishment Date"
        />
        <Select
          name="ownership"
          value={center.ownership}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "ownership", value },
            })
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select ownership" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="federalGovt">Federal Government</SelectItem>
            <SelectItem value="stateGovt">State Government</SelectItem>
            <SelectItem value="localGovt">Local Government</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="coOwned">Co-owned</SelectItem>
            <SelectItem value="religiousOrganization">
              Religious Organization
            </SelectItem>
            <SelectItem value="ngo">NGO</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {center.ownership === "other" && (
          <Input
            name="otherOwnership"
            value={center.otherOwnership}
            onChange={handleInputChange}
            placeholder="Specify Other Ownership"
          />
        )}
        <Select
          name="trainingNature"
          value={center.trainingNature}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "trainingNature", value },
            })
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select training nature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="institutionTraining">
              Institution Training
            </SelectItem>
            <SelectItem value="workplaceTraining">
              Workplace Training
            </SelectItem>
            <SelectItem value="informal">Informal</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch
            disabled
            id="itfRegistered"
            checked={center.itfRegistered === "yes"}
            onCheckedChange={(checked) =>
              handleInputChange({
                target: {
                  name: "itfRegistered",
                  value: checked ? "yes" : "no",
                },
              })
            }
          />
          <Label htmlFor="itfRegistered">ITF Registered</Label>
        </div>
        {center.itfRegistered === "yes" && (
          <Input
            name="itfRegistrationNumber"
            value={center.itfRegistrationNumber}
            onChange={handleInputChange}
            placeholder="ITF Registration Number"
          />
        )}
        <Button
          type="submit"
          disabled
          className="mt-4 bg-green-500 hover:bg-green-600">
          Update Center Details
        </Button>
      </form>
    </TabsContent>
  );
};

export default CenterDetailsTab;
