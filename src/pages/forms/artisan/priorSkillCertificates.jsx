import React, { Fragment } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import "./index.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageIcon,
  StarFilledIcon,
  PlusCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import UploadInput from "../../../components/UploadInput";

export default function PriorSkills({ controlButtons, form, onchangeInput }) {
  const remove = (id) => {
    const old = [...(form?.priorSkillsCerts || [])];

    onchangeInput(
      "priorSkillsCerts",
      old.filter((x) => x?.id !== id)
    );
  };

  const add = () => {
    const newArray = [
      ...(form?.priorSkillsCerts || []),
      {
        id: new Date().getTime().toString() + Math.random(),
        name: "",
        year: "",
      },
    ];
    onchangeInput("priorSkillsCerts", newArray);
  };

  const onChange = (id, key, value) => {
    const newArray = [...(form?.priorSkillsCerts || [])];
    onchangeInput(
      "priorSkillsCerts",
      newArray.map((item) => {
        if (item?.id === id) item[key] = value;
        return item;
      })
    );
  };

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700]  text-[24px]">
        Prior Skill Certificates
      </h1>

      <div className="flex flex-col gap-y-[40px] ">
        {form?.priorSkillsCerts.map((item) => {
          return (
            <div key={item?.id} className="flex flex-col gap-y-[20px]">
              <div className="flex flex-row justify-center">
      <div className="inputGroup">
            <Label>Sector</Label>
            <Select
              value={form?.sector}
              onValueChange={(value) => onchangeInput("sector", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Building and Construction">
                    Building and Construction
                  </SelectItem>
                  <SelectItem value="Welding">Welding</SelectItem>
                  <SelectItem value="ICT">ICT</SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Animal Husbandry">
                    Animal Husbandry
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="inputGroup">
            <Label>Trade Area</Label>
            <Select
              value={form?.tradeArea}
              onValueChange={(value) => onchangeInput("tradeArea", value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Trade Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Trade Area 1">Trade Area 1</SelectItem>
                  <SelectItem value="Trade Area 2">Trade Area 2</SelectItem>
                  <SelectItem value="Trade Area 3">Trade Area 3</SelectItem>
                  <SelectItem value="Trade Area 4">Trade Area 4</SelectItem>
                  <SelectItem value="Trade Area 5">Trade Area 5</SelectItem>
                  <SelectItem value="Trade Area 6">Trade Area 6</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

      </div>
              <div className="flex items-center ">
                
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Name *
                </Label>
                <Input
                  placeholder="Enter name"
                  value={item?.name}
                  onChange={(e) => onChange(item?.id, "name", e.target.value)}
                />
              </div>

              <div className="flex items-center ">
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Date attained obtained *
                </Label>
                <Select
                  value={item?.year}
                  onValueChange={(value) => onChange(item?.id, "year", value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="2001">2001</SelectItem>
                      <SelectItem value="2002">2002</SelectItem>
                      <SelectItem value="2003">2003</SelectItem>
                      <SelectItem value="2004">2004</SelectItem>
                      <SelectItem value="2005">2005</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start relative">
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Supporting Document *
                </Label>
                <UploadInput />
                {form?.priorSkillsCerts?.length > 1 ? (
                  <button
                    onClick={() => remove(item?.id)}
                    className="absolute flex border border-red-700 text-red-700 px-2  py-1 text-[11px]  gap-2 rounded-[100px] left-0 bottom-[20px]">
                    <TrashIcon />
                    <span>Delete</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button
          onClick={add}
          className="flex border border-gray-200 px-2  py-1 text-[12px]  gap-2 rounded-[100px]">
          <PlusCircledIcon />
          <span>Add</span>
        </button>
      </div>
      {controlButtons}
    </div>
  );
}
