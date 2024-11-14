import React from "react";
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
import { ImageIcon, StarFilledIcon } from "@radix-ui/react-icons";
import UploadInput from "../../../components/UploadInput";

export default function Education({
  controlButtons,
  form,
  onchangeEducationInput,
}) {
  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700]  text-[24px]">Education</h1>
      <div className="flex items-center ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          School *
        </Label>
        <Input
          type="text"
          id="email"
          placeholder="Enter school name"
          value={form?.education?.school}
          onChange={(e) => onchangeEducationInput("school", e.target?.value)}
        />
      </div>

      <div className="flex items-center ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          Highest qualification obtained *
        </Label>
        <Select
          value={form?.education?.highest_qualification}
          onValueChange={(value) =>
            onchangeEducationInput("highest_qualification", value)
          }>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a qualification" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Option 1">Option 1</SelectItem>
              <SelectItem value="Option 2">Option 2</SelectItem>
              <SelectItem value="Option 3">Option 3</SelectItem>
              <SelectItem value="Option 4">Option 4</SelectItem>
              <SelectItem value="Option 5">Option 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          Graduation year *
        </Label>
        <Select
          value={form?.education?.graduation_year}
          onValueChange={(value) =>
            onchangeEducationInput("graduation_year", value)
          }>
          <SelectTrigger className="">
            <SelectValue placeholder="Select graduation year" />
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

      <div className="flex items-start ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          Supporting Document *
        </Label>
        <UploadInput />
      </div>

      {controlButtons}
    </div>
  );
}
