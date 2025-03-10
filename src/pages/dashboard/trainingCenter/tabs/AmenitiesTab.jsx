import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const AmenitiesTab = ({
  center,
  handleNestedInputChange,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    //   <TabsContent value="assessment">
    <TabsContent value="amenities">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="portableWater"
            checked={center.amenities?.portableWater === "yes"}
            onCheckedChange={(checked) =>
              handleNestedInputChange(
                "amenities",
                "portableWater",
                checked ? "yes" : "no"
              )
            }
          />
          <Label htmlFor="portableWater">Portable Water</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="observeBreak"
            checked={center.amenities?.observeBreak === "yes"}
            onCheckedChange={(checked) =>
              handleNestedInputChange(
                "amenities",
                "observeBreak",
                checked ? "yes" : "no"
              )
            }
          />
          <Label htmlFor="observeBreak">Observe Break</Label>
        </div>
        {center.amenities?.observeBreak === "yes" && (
          <Input
            name="breakTime"
            value={center.amenities.breakTime}
            onChange={(e) =>
              handleNestedInputChange("amenities", "breakTime", e.target.value)
            }
            placeholder="Break Time"
          />
        )}
        <Textarea
          name="otherComments"
          value={center.amenities?.otherComments}
          onChange={(e) =>
            handleNestedInputChange(
              "amenities",
              "otherComments",
              e.target.value
            )
          }
          placeholder="Other Comments"
        />
        <Button type="submit">Update Amenities</Button>
      </form>
    </TabsContent>
  );
};

export default AmenitiesTab;
