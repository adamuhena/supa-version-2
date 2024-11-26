import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import "./index.css";

const Instructors = ({ form, setForm, controlButtons }) => {
    const updateInstructor = (id, field, value) => {
        setForm((prev) => ({
            ...prev,
            instructors: prev.instructors.map((inst) =>
                inst.id === id ? { ...inst, [field]: value } : inst
            ),
        }));
    };

    const addInstructor = () => {
        setForm((prev) => ({
            ...prev,
            instructors: [
                ...prev.instructors,
                {
                    id: `${new Date().getTime()}${Math.random()}`,
                    fullName: "",
                    dateOfBirth: "",
                    nationality: "",
                    residentialAddress: "",
                    email: "",
                    phoneNumber: "",
                    qualifications: "",
                },
            ],
        }));
    };

    const removeInstructor = (id) => {
        setForm((prev) => ({
            ...prev,
            instructors: prev.instructors.filter((inst) => inst.id !== id),
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
            <h1 className="text-left font-[700] text-[24px]">Instructors Information</h1>

            {form.instructors.map((instructor, index) => (
                <div key={instructor.id} className="flex flex-col gap-[20px]">
                    <h2 className="text-left font-[600] text-[20px]">Instructor {index + 1}</h2>

                    <div className="flex items-center">
                        <Label htmlFor={`fullName-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Full Name *
                        </Label>
                        <Input
                            type="text"
                            id={`fullName-${instructor.id}`}
                            placeholder="Enter full name"
                            value={instructor.fullName}
                            onChange={(e) => updateInstructor(instructor.id, "fullName", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`dateOfBirth-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Date of Birth *
                        </Label>
                        <Input
                            type="date"
                            id={`dateOfBirth-${instructor.id}`}
                            value={instructor.dateOfBirth}
                            onChange={(e) => updateInstructor(instructor.id, "dateOfBirth", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`nationality-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Nationality *
                        </Label>
                        <Input
                            type="text"
                            id={`nationality-${instructor.id}`}
                            placeholder="Enter nationality"
                            value={instructor.nationality}
                            onChange={(e) => updateInstructor(instructor.id, "nationality", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`residentialAddress-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Residential Address *
                        </Label>
                        <Input
                            type="text"
                            id={`residentialAddress-${instructor.id}`}
                            placeholder="Enter residential address"
                            value={instructor.residentialAddress}
                            onChange={(e) => updateInstructor(instructor.id, "residentialAddress", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`email-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Email *
                        </Label>
                        <Input
                            type="email"
                            id={`email-${instructor.id}`}
                            placeholder="Enter email"
                            value={instructor.email}
                            onChange={(e) => updateInstructor(instructor.id, "email", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`phoneNumber-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Phone Number *
                        </Label>
                        <Input
                            type="tel"
                            id={`phoneNumber-${instructor.id}`}
                            placeholder="Enter phone number"
                            value={instructor.phoneNumber}
                            onChange={(e) => updateInstructor(instructor.id, "phoneNumber", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`qualifications-${instructor.id}`} className="w-[300px] text-left leading-[1.3]">
                            Qualifications *
                        </Label>
                        <Input
                            type="text"
                            id={`qualifications-${instructor.id}`}
                            placeholder="Enter qualifications"
                            value={instructor.qualifications}
                            onChange={(e) => updateInstructor(instructor.id, "qualifications", e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => removeInstructor(instructor.id)}
                        variant="destructive"
                        className="self-end"
                    >
                        Remove Instructor
                    </Button>
                </div>
            ))}

            <Button onClick={addInstructor} className="self-start">Add Instructor</Button>

            {controlButtons}
        </div>
    );
};

export default Instructors;

