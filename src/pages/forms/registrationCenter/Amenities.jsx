import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
// import { Button } from "../../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import "./index.css";

const TrainingAmenities = ({ form, setForm, controlButtons }) => {
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-left font-[700] text-[24px]">Training Centre Amenities</h1>

            <div className="flex items-center">
                <Label htmlFor="portableWater" className="w-[300px] text-left leading-[1.3]">
                    Does the Centre have portable water that is available to Trainee?
                </Label>
                <Select
                    value={form.portableWater}
                    onValueChange={(value) => updateField("portableWater", value)}
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
                <Label htmlFor="observeBreak" className="w-[300px] text-left leading-[1.3]">
                    Does the Centre observe break?
                </Label>
                <Select
                    value={form.observeBreak}
                    onValueChange={(value) => updateField("observeBreak", value)}
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

            {form.observeBreak === "yes" && (
                <div className="flex items-center">
                    <Label htmlFor="breakTime" className="w-[300px] text-left leading-[1.3]">
                        What is the break time?
                    </Label>
                    <Input
                        type="time"
                        id="breakTime"
                        value={form.breakTime}
                        onChange={(e) => updateField("breakTime", e.target.value)}
                    />
                </div>
            )}

            <div className="flex items-start">
                <Label htmlFor="otherComments" className="w-[300px] text-left leading-[1.3]">
                    Any Other Comments:
                </Label>
                <Textarea
                    id="otherComments"
                    placeholder="Enter any additional comments"
                    value={form.otherComments}
                    onChange={(e) => updateField("otherComments", e.target.value)}
                    className="min-h-[100px]"
                />
            </div>

            {/* <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                    NOTE: Completed form should be submitted at the nearest ITF Area Office or emailed to supasec@itf.gov.ng
                </p>
            </div> */}

            {controlButtons}
        </div>
    );
};

export default TrainingAmenities;

