import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import "./index.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadButton from "@/components/UploadButton";

export default function Education({
  controlButtons,
  form,
  onchangeEducationInput,
}) {
  // Generate an array of years dynamically
  const startYear = 1980;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

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
          value={form?.education?.highestQualification}
          onValueChange={(value) =>
            onchangeEducationInput("highestQualification", value)
          }>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a qualification" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="pslc">Primary School Leaving Certificate (PSLC)</SelectItem>
              <SelectItem value="ssec">Senior Secondary Education Certificate (SSEC)</SelectItem>
              <SelectItem value="graduate">Graduate</SelectItem>
              <SelectItem value="post-graduate">Post-Graduate</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* <div className="flex items-center ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          Graduation year *
        </Label>
        <Select
          value={form?.education?.graduationYear}
          onValueChange={(value) =>
            onchangeEducationInput("graduationYear", value)
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
      </div> */}

        <div className="flex items-center">
          <Label htmlFor="graduation-year" className="w-[300px] text-left leading-[1.3]">
            Graduation year *
          </Label>
          <Select
            value={form?.education?.graduationYear}
            onValueChange={(value) => onchangeEducationInput("graduationYear", value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select graduation year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      <div className="flex items-start ">
        <Label htmlFor="email" className="w-[300px] text-left leading-[1.3]">
          Supporting Document *
        </Label>
        {/* <UploadInput /> */}

        <UploadButton
          fileUrl={form?.education?.eduUpload}
          handleFileChange={function (url) {
            onchangeEducationInput("eduUpload", url);
          }}
          removeFile={() => {
            onchangeEducationInput("eduUpload", "");
          }}
        />
      </div>

      {controlButtons}
    </div>
  );
}
