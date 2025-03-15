import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssessmentTab = ({
  center,
  handleNestedInputChange,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <TabsContent value="assessment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="traineeInstructorRatio"
          value={center.assessment?.traineeInstructorRatio}
          onChange={(e) =>
            handleNestedInputChange(
              "assessment",
              "traineeInstructorRatio",
              e.target.value
            )
          }
          placeholder="Trainee-Instructor Ratio"
        />
        <Input
          name="practicalTheoryRatio"
          value={center.assessment?.practicalTheoryRatio}
          onChange={(e) =>
            handleNestedInputChange(
              "assessment",
              "practicalTheoryRatio",
              e.target.value
            )
          }
          placeholder="Practical-Theory Ratio"
        />
        <Input
          name="trainingDurationPerDay"
          value={center.assessment?.trainingDurationPerDay}
          onChange={(e) =>
            handleNestedInputChange(
              "assessment",
              "trainingDurationPerDay",
              e.target.value
            )
          }
          placeholder="Training Duration Per Day"
        />
        <Input
          name="trainingDurationPerWeek"
          value={center.assessment?.trainingDurationPerWeek}
          onChange={(e) =>
            handleNestedInputChange(
              "assessment",
              "trainingDurationPerWeek",
              e.target.value
            )
          }
          placeholder="Training Duration Per Week"
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="weeklyTrainingSchedule"
            checked={center.assessment?.weeklyTrainingSchedule === "yes"}
            onCheckedChange={(checked) =>
              handleNestedInputChange(
                "assessment",
                "weeklyTrainingSchedule",
                checked ? "yes" : "no"
              )
            }
          />
          <Label htmlFor="weeklyTrainingSchedule">
            Weekly Training Schedule
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="trainingCurriculum"
            checked={center.assessment?.trainingCurriculum === "yes"}
            onCheckedChange={(checked) =>
              handleNestedInputChange(
                "assessment",
                "trainingCurriculum",
                checked ? "yes" : "no"
              )
            }
          />
          <Label htmlFor="trainingCurriculum">Training Curriculum</Label>
        </div>
        {center.assessment?.trainingCurriculum === "yes" && (
          <Input
            name="curriculumAttachment"
            type="file"
            onChange={(e) =>
              handleNestedInputChange(
                "assessment",
                "curriculumAttachment",
                e.target.files[0]
              )
            }
          />
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="attendanceRegister"
            checked={center.assessment?.attendanceRegister === "yes"}
            onCheckedChange={(checked) =>
              handleNestedInputChange(
                "assessment",
                "attendanceRegister",
                checked ? "yes" : "no"
              )
            }
          />
          <Label htmlFor="attendanceRegister">Attendance Register</Label>
        </div>
        <Input
          name="totalFloorArea"
          type="number"
          value={center.assessment?.totalFloorArea}
          onChange={(e) =>
            handleNestedInputChange(
              "assessment",
              "totalFloorArea",
              e.target.value
            )
          }
          placeholder="Total Floor Area (sq ft)"
        />
        <Button
          disabled
          type="submit"
          className="mt-4 bg-green-500 hover:bg-green-600">
          Update Assessment
        </Button>
      </form>
    </TabsContent>
  );
};

export default AssessmentTab;
