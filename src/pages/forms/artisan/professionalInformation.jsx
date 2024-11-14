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

export default function ProfessionalInformaiton({
  controlButtons,
  form,
  onchangeInput,
}) {
  return (
    <div
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        marginBottom: "100px",
        background: "white",
      }}
      className="relative w-full max-w-[900px] mx-auto py-[30px]   flex flex-col px-5 gap-[30px] bg-white rounded-[16px] ">
      <h1 className="text-left font-[700]  text-[24px]">
        Professional Information
      </h1>

      <div className="ParentDiv">
        <div className="firstDiv">
          <div className="inputGroup">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              type="text"
              id="first_name"
              placeholder="first_name"
              //
              value={form?.first_name}
              onChange={(e) => onchangeInput("first_name", e.target?.value)}
            />
          </div>

          <div className="inputGroup">
            <Label htmlFor="email">Middle Name</Label>
            <Input
              type="text"
              id="email"
              placeholder="Middle name"
              required
              value={form?.middle_name}
              onChange={(e) => onchangeInput("middle_name", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Last Name</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={form?.email}
              onChange={(e) => onchangeInput("email", e.target?.value)}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Phone Number</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Gender</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Male</SelectItem>
                  <SelectItem value="cst">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Marital Status</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Single</SelectItem>
                  <SelectItem value="cst">Married</SelectItem>
                  <SelectItem value="cst">Married</SelectItem>
                  <SelectItem value="cst">Married</SelectItem>
                  <SelectItem value="cst">Married</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Sector</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Building and Construction</SelectItem>
                  <SelectItem value="cst">Welding</SelectItem>
                  <SelectItem value="cst">ICT</SelectItem>
                  <SelectItem value="cst">Power</SelectItem>
                  <SelectItem value="cst">Animal Husbandry</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="secondDiv">
          <div className="inputGroup">
            <Label htmlFor="email">Trade Area</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Trade Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Single</SelectItem>
                  <SelectItem value="cst">Married</SelectItem>
                  <SelectItem value="cst">Divorced</SelectItem>
                  <SelectItem value="cst">Seperated</SelectItem>
                  <SelectItem value="cst">Widowed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">Street Address</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">City</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Plateau</SelectItem>
                  <SelectItem value="cst">Maiduguri</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <Label htmlFor="email">LGA</Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="est">Biu</SelectItem>
                  <SelectItem value="cst">Kwaya-kusar</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="inputGroup">
            <div className="radioGroup">
              <div>
                <span>Are you a person with disability? </span>
              </div>

              <div>
                <input type="radio" id="yes" name="disability" value="yes" />{" "}
                <label for="yes">Yes</label>
                <input type="radio" id="no" name="disability" value="no" />{" "}
                <label for="no">No</label>
              </div>
            </div>
            <br />

            <label>
              <input type="checkbox" name="terms" required />
              <span>
                By submitting this form, I agree to abide by SUPA platform’s
              </span>
              <a
                href="https://supa.itf.gov.ng/terms-and-conditions"
                target="_blank">
                Terms and Conditions
              </a>
            </label>
            <br />
          </div>
        </div>
      </div>
      {controlButtons}
    </div>
  );
}
