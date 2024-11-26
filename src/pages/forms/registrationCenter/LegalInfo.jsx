import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import "./index.css";

const LegalInfo = ({ form, setForm, controlButtons }) => {
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateTradeArea = (index, field, value) => {
        setForm((prev) => {
            const updatedTradeAreas = [...(prev.tradeAreas || [])];
            updatedTradeAreas[index] = {
                ...updatedTradeAreas[index],
                [field]: value,
            };
            return { ...prev, tradeAreas: updatedTradeAreas };
        });
    };

    const addTradeArea = () => {
        setForm((prev) => ({
            ...prev,
            tradeAreas: [
                ...(prev.tradeAreas || []),
                {
                    tradeArea: "",
                    instructors: "",
                    trainees: "",
                    facilities: "",
                    equipment: "",
                    tools: "",
                },
            ],
        }));
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
            <h1 className="text-left font-[700] text-[24px]">Legal and Trade Information</h1>

            <div className="flex flex-col gap-2">
                <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
                    13. Does the Centre have Legal Registration/Licensing from other authorities? Specify and attach copies of supporting documents if any (e.g. CAC, City & Guilds, etc.):
                </Label>
                <Textarea
                    id="legalRegistration"
                    placeholder="Enter legal registration details"
                    value={form.legalRegistration || ""}
                    onChange={(e) => updateField("legalRegistration", e.target.value)}
                    className="min-h-[100px]"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="supportingDocuments" className="text-left leading-[1.3]">
                    Attach supporting documents:
                </Label>
                <Input
                    type="file"
                    id="supportingDocuments"
                    onChange={(e) => updateField("supportingDocuments", e.target.files[0])}
                    multiple
                />
            </div>

            <h2 className="text-left font-[600] text-[20px] mt-4">14. Trade Area Profile:</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">S/NO.</th>
                        <th className="border border-gray-300 p-2">Trade Area</th>
                        <th className="border border-gray-300 p-2">Number of Instructors</th>
                        <th className="border border-gray-300 p-2">Number of Trainees that can be taken</th>
                        <th className="border border-gray-300 p-2">Facilities</th>
                        <th className="border border-gray-300 p-2">List of Equipment</th>
                        <th className="border border-gray-300 p-2">List of Tools</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(form.tradeAreas || []).map((trade, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{index + 1}</td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    value={trade.tradeArea || ""}
                                    onChange={(e) => updateTradeArea(index, "tradeArea", e.target.value)}
                                    placeholder="Trade Area"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    type="number"
                                    value={trade.instructors || ""}
                                    onChange={(e) => updateTradeArea(index, "instructors", e.target.value)}
                                    placeholder="Number of Instructors"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    type="number"
                                    value={trade.trainees || ""}
                                    onChange={(e) => updateTradeArea(index, "trainees", e.target.value)}
                                    placeholder="Number of Trainees"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    value={trade.facilities || ""}
                                    onChange={(e) => updateTradeArea(index, "facilities", e.target.value)}
                                    placeholder="Facilities"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    value={trade.equipment || ""}
                                    onChange={(e) => updateTradeArea(index, "equipment", e.target.value)}
                                    placeholder="List of Equipment"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Input
                                    value={trade.tools || ""}
                                    onChange={(e) => updateTradeArea(index, "tools", e.target.value)}
                                    placeholder="List of Tools"
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Button
                onClick={addTradeArea}
                className="bg-blue-500 text-white px-4 py-2 rounded self-start"
            >
                Add Trade Area
            </Button>

            <div className="flex flex-col gap-2">
                <Label htmlFor="instructorCredentials" className="text-left leading-[1.3]">
                    Attach credentials of each Instructor:
                </Label>
                <Input
                    type="file"
                    id="instructorCredentials"
                    onChange={(e) => updateField("instructorCredentials", e.target.files)}
                    multiple
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="additionalDetails" className="text-left leading-[1.3]">
                    Additional Details (if necessary):
                </Label>
                <Textarea
                    id="additionalDetails"
                    placeholder="Enter any additional details"
                    value={form.additionalDetails || ""}
                    onChange={(e) => updateField("additionalDetails", e.target.value)}
                    className="min-h-[100px]"
                />
            </div>

            {controlButtons}
        </div>
    );
};

export default LegalInfo;

