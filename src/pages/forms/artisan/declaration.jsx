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

export default function Declaration({ controlButtons, form, onchangeInput }) {
  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[700px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px]">
      <h1 className="text-left font-[700]  text-[24px]">Declaration</h1>

      <div className="flex">
        <label>
          <input
            type="checkbox"
            name="terms"
            required
            className="size-[20px] cursor-pointer"
            checked={form?.agree}
            onClick={() => onchangeInput("agree", !form.agree)}
          />
        </label>

        <p
          className="cursor-pointer"
          onClick={() => onchangeInput("agree", !form.agree)}>
          Please note that signing up constitutes acceptance of our Terms of
          Service and Privacy Policy. You must be at least 18 years old to
          register and must provide truthful information."
        </p>
      </div>
      {controlButtons}
    </div>
  );
}
