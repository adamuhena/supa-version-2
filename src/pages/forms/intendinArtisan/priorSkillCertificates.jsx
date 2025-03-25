import React, { useState, useEffect, Fragment } from "react";
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
import { fetchSectors } from "@/services/api";

export default function PriorSkills({ controlButtons, form, onchangeInput }) {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetchSectors(accessToken);
        setSectors(response);
      } catch (err) {
        setError('Failed to fetch sectors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700]  text-[24px]">Intending Skill</h1>

      <div className="flex flex-col gap-y-[40px] ">
        {form?.priorSkillsCerts.map((item) => {
          return (
            <div key={item?.id} className="flex flex-col gap-y-[20px]">
              <div className="flex flex-row justify-center">
                <div className="inputGroup">
                  <Label>Sector</Label>
                  <Select
                    value={item?.sector}
                    onValueChange={(value) => onChange(item?.id, "sector", value)}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectors.map((sector) => (
                          <SelectItem key={sector._id} value={sector.name}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="inputGroup">
                  <Label>Trade Area</Label>
                  <Select
                    value={item?.tradeArea}
                    onValueChange={(value) => onChange(item?.id, "tradeArea", value)}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Trade Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectors
                          .find((sector) => sector.name === item?.sector)?.tradeAreas
                          ?.map((tradeArea) => (
                            <SelectItem key={tradeArea._id} value={tradeArea.name}>
                              {tradeArea.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start relative">
                {form?.priorSkillsCerts?.length > 1 ? (
                  <button
                    onClick={() => remove(item?.id)}
                    className=" flex border border-red-700 text-red-700 px-2  py-1 text-[11px]  gap-2 rounded-[100px] left-0 bottom-[20px]">
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
          disabled={true}
          className="flex border border-gray-200 px-2  py-1 text-[12px]  gap-2 rounded-[100px]">
          <PlusCircledIcon />
          <span>Add</span>
        </button>
      </div>
      {controlButtons}
    </div>
  );
}
