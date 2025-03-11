import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

const LegalInfoTab = ({
  center,
  handleNestedInputChange,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    //   <TabsContent value="legal">
    <TabsContent value="legal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="legalRegistration"
          value={center.legalInfo?.legalRegistration}
          onChange={(e) =>
            handleNestedInputChange(
              "legalInfo",
              "legalRegistration",
              e.target.value
            )
          }
          placeholder="Legal Registration"
        />
        <div>
          <Label>Trade Areas</Label>
          {center.legalInfo?.tradeAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={area.tradeArea}
                onChange={(e) => {
                  const newTradeAreas = [...center.legalInfo?.tradeAreas];
                  newTradeAreas[index] = {
                    ...newTradeAreas[index],
                    tradeArea: e.target.value,
                  };
                  handleNestedInputChange(
                    "legalInfo",
                    "tradeAreas",
                    newTradeAreas
                  );
                }}
                placeholder="Trade Area"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const newTradeAreas = center.legalInfo?.tradeAreas.filter(
                    (_, i) => i !== index
                  );
                  handleNestedInputChange(
                    "legalInfo",
                    "tradeAreas",
                    newTradeAreas
                  );
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              const newTradeAreas = [
                ...(center.legalInfo?.tradeAreas || []),
                { tradeArea: "" },
              ];
              handleNestedInputChange("legalInfo", "tradeAreas", newTradeAreas);
            }}
            className="mt-2"
          >
            Add Trade Area
          </Button>
        </div>
        <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600">Update Legal Info</Button>
      </form>
    </TabsContent>
  );
};

export default LegalInfoTab;
