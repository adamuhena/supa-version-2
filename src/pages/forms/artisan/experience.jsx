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
import { Textarea } from "../../../components/ui/textarea";

export default function Experience({ controlButtons, form, onchangeInput }) {
  const remove = (id) => {
    const old = [...(form?.experience || [])];

    onchangeInput(
      "experience",
      old.filter((x) => x?.id !== id)
    );
  };

  const add = () => {
    const newArray = [
      ...(form?.experience || []),
      {
        id: new Date().getTime().toString() + Math.random(),
        name: "",
        year: "",
      },
    ];
    onchangeInput("experience", newArray);
  };

  const onChange = (id, key, value) => {
    const newArray = [...(form?.experience || [])];
    onchangeInput(
      "experience",
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
      <h1 className="text-left font-[700]  text-[24px]">Experience</h1>

      <div className="flex flex-col gap-y-[40px] ">
        {form?.experience.map((item) => {
          return (
            <div key={item?.id} className="flex flex-col gap-y-[20px]">
              <div className="flex items-center ">
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Project Title *
                </Label>
                <Input
                  placeholder="Enter name"
                  value={item?.project_title}
                  onChange={(e) =>
                    onChange(item?.id, "project_title", e.target.value)
                  }
                />
              </div>

              <div className="flex items-start ">
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Description *
                </Label>
                <Textarea
                  placeholder="Enter name"
                  value={item?.description}
                  onChange={(e) =>
                    onChange(item?.id, "description", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center ">
                <Label
                  htmlFor="email"
                  className="w-[300px] text-left leading-[1.3]">
                  Date *
                </Label>
                <div className="flex gap-[30px] w-full">
                  <div>
                    <p className="text-left"> From</p>
                    <Input
                      placeholder="Start"
                      value={item?.date_to}
                      type="date"
                      onChange={(e) =>
                        onChange(item?.id, "date_to", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <p className="text-left">To</p>
                    <Input
                      placeholder="End"
                      value={item?.date_from}
                      type="date"
                      onChange={(e) =>
                        onChange(item?.id, "date_from", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* <div className="flex gap-[30px] w-full">
                  <Select
                    className="flex-1"
                    value={item?.date_from}
                    onValueChange={(value) =>
                      onChange(item?.id, "date_from", value)
                    }>
                    <SelectTrigger className="">
                      <SelectValue placeholder="From" />
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

                  <Select
                    className="flex-1"
                    value={item?.date_to}
                    onValueChange={(value) =>
                      onChange(item?.id, "date_to", value)
                    }>
                    <SelectTrigger className="">
                      <SelectValue placeholder="To" />
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
              </div>

              <div className="flex items-start relative">
                {form?.experience?.length > 1 ? (
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
          <span>Add another experience</span>
        </button>
      </div>
      {controlButtons}
    </div>
  );
}
