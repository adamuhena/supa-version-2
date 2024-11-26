import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import "./index.css";

const Directors = ({ form, setForm, controlButtons }) => {
    const updateDirector = (id, field, value) => {
        setForm((prev) => ({
            ...prev,
            directors: prev.directors.map((dir) =>
                dir.id === id ? { ...dir, [field]: value } : dir
            ),
        }));
    };

    const addDirector = () => {
        setForm((prev) => ({
            ...prev,
            directors: [
                ...prev.directors,
                {
                    id: `${new Date().getTime()}${Math.random()}`,
                    fullName: "",
                    dateOfBirth: "",
                    nationality: "",
                    residentialAddress: "",
                    email: "",
                    phoneNumber: "",
                    meansOfIdentification: "",
                },
            ],
        }));
    };

    const removeDirector = (id) => {
        setForm((prev) => ({
            ...prev,
            directors: prev.directors.filter((dir) => dir.id !== id),
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
            <h1 className="text-left font-[700] text-[24px]">Directors Information</h1>

            {form.directors.map((director, index) => (
                <div key={director.id} className="flex flex-col gap-[20px]">
                    <h2 className="text-left font-[600] text-[20px]">Director {index + 1}</h2>

                    <div className="flex items-center">
                        <Label htmlFor={`fullName-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Full Name *
                        </Label>
                        <Input
                            type="text"
                            id={`fullName-${director.id}`}
                            placeholder="Enter full name"
                            value={director.fullName}
                            onChange={(e) => updateDirector(director.id, "fullName", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`dateOfBirth-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Date of Birth *
                        </Label>
                        <Input
                            type="date"
                            id={`dateOfBirth-${director.id}`}
                            value={director.dateOfBirth}
                            onChange={(e) => updateDirector(director.id, "dateOfBirth", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`nationality-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Nationality *
                        </Label>
                        <Input
                            type="text"
                            id={`nationality-${director.id}`}
                            placeholder="Enter nationality"
                            value={director.nationality}
                            onChange={(e) => updateDirector(director.id, "nationality", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`residentialAddress-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Residential Address *
                        </Label>
                        <Input
                            type="text"
                            id={`residentialAddress-${director.id}`}
                            placeholder="Enter residential address"
                            value={director.residentialAddress}
                            onChange={(e) => updateDirector(director.id, "residentialAddress", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`email-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Email *
                        </Label>
                        <Input
                            type="email"
                            id={`email-${director.id}`}
                            placeholder="Enter email"
                            value={director.email}
                            onChange={(e) => updateDirector(director.id, "email", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`phoneNumber-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Phone Number *
                        </Label>
                        <Input
                            type="tel"
                            id={`phoneNumber-${director.id}`}
                            placeholder="Enter phone number"
                            value={director.phoneNumber}
                            onChange={(e) => updateDirector(director.id, "phoneNumber", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor={`meansOfIdentification-${director.id}`} className="w-[300px] text-left leading-[1.3]">
                            Means of Identification *
                        </Label>
                        <Input
                            type="text"
                            id={`meansOfIdentification-${director.id}`}
                            placeholder="Enter means of identification"
                            value={director.meansOfIdentification}
                            onChange={(e) => updateDirector(director.id, "meansOfIdentification", e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => removeDirector(director.id)}
                        variant="destructive"
                        className="self-end"
                    >
                        Remove Director
                    </Button>
                </div>
            ))}

            <Button onClick={addDirector} className="self-start">Add Director</Button>

            {controlButtons}
        </div>
    );
};

export default Directors;

