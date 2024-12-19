import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import "./index.css";
import UploadButton from "@/components/UploadButton";


const Instructors = ({ form, setForm, controlButtons }) => {
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateInfrastructure = (type, value) => {
        setForm((prev) => ({
            ...prev,
            infrastructure: {
                ...prev.infrastructure,
                [type]: value,
            },
        }));
    };

    const updateUtility = (type, field, value) => {
        setForm((prev) => ({
            ...prev,
            utilities: {
                ...prev.utilities,
                [type]: {
                    ...(prev.utilities?.[type] || {}),
                    [field]: value,
                },
            },
        }));
    };

    const infrastructureTypes = [
        "Offices",
        "Classrooms",
        "Laboratory",
        "Workshops/Kitchen",
        "Libraries",
        "Assembly Hall",
        "Cafeterias",
        "Others (Specify)",
    ];

    const utilityTypes = [
        "Functional Restrooms",
        "Illumination",
        "Waste water disposal",
        "Solid waste disposal",
        "Electricity",
        "Desk Support",
        "Recreational",
        "Others (specify)",
    ];

    return (
        <div
            style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                marginBottom: "100px",
                background: "white",
            }}
            className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
        >
            <h1 className="text-left font-[700] text-[24px]">Training Centre Assessment</h1>

            <div className="flex items-center">
                <Label htmlFor="traineeInstructorRatio" className="w-[300px] text-left leading-[1.3]">
                    15. What is the ratio of Trainee to Instructor?
                </Label>
                <Input
                    id="traineeInstructorRatio"
                    placeholder="e.g., 10:1"
                    value={form.traineeInstructorRatio || ""}
                    onChange={(e) => updateField("traineeInstructorRatio", e.target.value)}
                />
            </div>

            <div className="flex items-center">
                <Label htmlFor="practicalTheoryRatio" className="w-[300px] text-left leading-[1.3]">
                    16. What is the ratio of practical to theory?
                </Label>
                <Input
                    id="practicalTheoryRatio"
                    placeholder="e.g., 70:30"
                    value={form.practicalTheoryRatio || ""}
                    onChange={(e) => updateField("practicalTheoryRatio", e.target.value)}
                />
            </div>

            <div className="flex items-center">
                <Label htmlFor="trainingDurationPerDay" className="w-[300px] text-left leading-[1.3]">
                    17. What is the Training duration per day?
                </Label>
                <Input
                    id="trainingDurationPerDay"
                    placeholder="e.g., 8 hours"
                    value={form.trainingDurationPerDay || ""}
                    onChange={(e) => updateField("trainingDurationPerDay", e.target.value)}
                />
            </div>

            <div className="flex items-center">
                <Label htmlFor="trainingDurationPerWeek" className="w-[300px] text-left leading-[1.3]">
                    18. What is the Training duration per week?
                </Label>
                <Input
                    id="trainingDurationPerWeek"
                    placeholder="e.g., 40 hours"
                    value={form.trainingDurationPerWeek || ""}
                    onChange={(e) => updateField("trainingDurationPerWeek", e.target.value)}
                />
            </div>

            <div className="flex items-center">
                <Label htmlFor="weeklyTrainingSchedule" className="w-[300px] text-left leading-[1.3]">
                    19. Does the Centre maintain weekly Training Schedule?
                </Label>
                <Select
                    value={form.weeklyTrainingSchedule || ""}
                    onValueChange={(value) => updateField("weeklyTrainingSchedule", value)}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center">
                <Label htmlFor="trainingCurriculum" className="w-[300px] text-left leading-[1.3]">
                    20. Does the Centre have a Training Curriculum?
                </Label>
                <Select
                    value={form.trainingCurriculum || ""}
                    onValueChange={(value) => updateField("trainingCurriculum", value)}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* {form.trainingCurriculum === "yes" && (
                <div className="flex items-center">
                    <Label htmlFor="curriculumAttachment" className="w-[300px] text-left leading-[1.3]">
                        If Yes, Please attach a copy.
                    </Label>
                    <Input
                        type="file"
                        id="curriculumAttachment"
                        onChange={(e) => updateField("curriculumAttachment", e.target.files[0])}
                    />
                </div>
            )} */}
            {form.trainingCurriculum === "yes" && (
        <div className="flex items-center">
          <Label
            htmlFor="curriculumAttachment"
            className="w-[300px] text-left leading-[1.3]"
          >
            If Yes, Please attach a copy.
          </Label>
          <UploadButton
            fileUrl={form.curriculumAttachment}
            title="curriculumAttachment"
            handleFileChange={(fileUrl) => updateField("curriculumAttachment", fileUrl)}
            accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
            removeFile={() => updateField("curriculumAttachment", null)}
          />
        </div>
      )}

            <div className="flex items-center">
                <Label htmlFor="attendanceRegister" className="w-[300px] text-left leading-[1.3]">
                    21. Does the Centre keep attendance register?
                </Label>
                <Select
                    value={form.attendanceRegister || ""}
                    onValueChange={(value) => updateField("attendanceRegister", value)}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <h2 className="text-left font-[600] text-[20px] mt-4">22. Infrastructure Available for Training:</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-100 font-semibold">
                    <div className="p-2 border-r border-b border-gray-300">Type</div>
                    <div className="p-2 border-b border-gray-300">Number</div>
                </div>
                {infrastructureTypes.map((type) => (
                    <div key={type} className="grid grid-cols-2">
                        <div className="p-2 border-r border-b border-gray-300">{type}</div>
                        <div className="p-2 border-b border-gray-300">
                            <Input
                                type="number"
                                value={form.infrastructure?.[type] || ""}
                                onChange={(e) => updateInfrastructure(type, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-left font-[600] text-[20px] mt-4">23. Utilities/Services:</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-100 font-semibold">
                    <div className="p-2 border-r border-b border-gray-300">Type</div>
                    <div className="p-2 border-r border-b border-gray-300">Number</div>
                    <div className="p-2 border-r border-b border-gray-300">Functional</div>
                    <div className="p-2 border-r border-b border-gray-300">Not Functional</div>
                    <div className="p-2 border-b border-gray-300">Remarks</div>
                </div>
                {utilityTypes.map((type) => (
                    <div key={type} className="grid grid-cols-5">
                        <div className="p-2 border-r border-b border-gray-300">{type}</div>
                        {["number", "functional", "notFunctional", "remarks"].map((field) => (
                            <div key={field} className="p-2 border-r border-b border-gray-300">
                                <Input
                                    type="text"
                                    value={form.utilities?.[type]?.[field] || ""}
                                    onChange={(e) => updateUtility(type, field, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex items-center">
                <Label htmlFor="totalFloorArea" className="w-[300px] text-left leading-[1.3]">
                    Total Floor Area (m²)
                </Label>
                <Input
                    type="number"
                    id="totalFloorArea"
                    value={form.totalFloorArea || ""}
                    onChange={(e) => updateField("totalFloorArea", e.target.value)}
                />
            </div>

            {controlButtons}
        </div>
    );
};

export default Instructors;

