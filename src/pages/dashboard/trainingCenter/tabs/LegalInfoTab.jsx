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
  console.log(center);
  return (
    //   <TabsContent value="legal">
    <TabsContent value="legal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>Legal Registration</label>
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
          <Label>Sectors / Trade Areas</Label>

          {(center.legalInfo?.tradeAreas || []).map((area, index) => {
            return (
              <>
                {(area?.sector || []).map((sector) => {
                  return (
                    <div className="mb-[30px]">
                      <h1 className="text-left font-medium text-[16px] ">
                        Sector: {sector?.name}
                      </h1>

                      <div className="flex gap-[15px]">
                        {(area?.tradeArea || []).map((ta_id) => {
                          const found = (sector.tradeAreas || []).find(
                            (x) => x?._id === ta_id
                          );

                          console.log("found", area?.sector);
                          return (
                            <p className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-black rounded-full" />
                              <span>{found?.name}</span>
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })}
          {/* {center.legalInfo?.tradeAreas.map((area, index) => (
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
                }}>
                Remove
              </Button>
            </div>
          ))} */}
          <Button
            disabled
            type="button"
            onClick={() => {
              const newTradeAreas = [
                ...(center.legalInfo?.tradeAreas || []),
                { tradeArea: "" },
              ];
              handleNestedInputChange("legalInfo", "tradeAreas", newTradeAreas);
            }}
            className="mt-2">
            Add Trade Area
          </Button>
        </div>
        <Button
          type="submit"
          disabled
          className="mt-4 bg-green-500 hover:bg-green-600">
          Update Legal Info
        </Button>
      </form>
    </TabsContent>
  );
};

export default LegalInfoTab;
