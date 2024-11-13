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

export default function ProfessionalInformation() {
  return (
    <div className="  ParentDiv">
      <div>
        School: <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="email">Middle Name</label>
        <Input type="email" id="email" placeholder="Email" required />
      </div>
      <div>
        <Label htmlFor="email">Last Name</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Phone Number</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Gender</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
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
      <div>
        <Label htmlFor="email">Marital Status</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
            <SelectValue placeholder="Select Marital Status" />
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
      <div>
        <Label htmlFor="email">Sector</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
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
      <div>
        <Label htmlFor="email">Trade Area</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
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
      <div>
        <Label htmlFor="email">Street Address</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">City</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
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
      <div>
        <Label htmlFor="email">LGA</Label>
        <Select>
          <SelectTrigger className="w-[750px]">
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
      <div>
        <label>Are you a person with disability? *</label>
        <input type="radio" id="yes" name="disability" value="yes" />{" "}
        <label for="yes">Yes</label>
        <input type="radio" id="no" name="disability" value="no" />
        <label for="no">No</label>
        <br />

        <label className="checkboxLabel">
          <div className="checkBox">
         
          </div>
          <a
            href="/"
            target="_blank"
           
          >
            Terms and Conditions
          </a>
          .
        </label>
        <br />
        <div style="display: flex; align-items: center;">
    <input type="checkbox" id="myCheckbox"/>
    <label for="myCheckbox" style="margin-left: 10px;">This is some text</label>
</div>

      </div>
    </div>
  );
}
