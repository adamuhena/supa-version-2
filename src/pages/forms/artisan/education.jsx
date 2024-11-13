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

export default function BioData() {
  return (
    <div className="ParentDiv">
      <div className="firstDiv">
        <div className="inputGroup">
          <Label htmlFor="email">First Name *</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="inputGroup">
          <Label htmlFor="email">Middle Name</Label>
          <Input type="email" id="email" placeholder="Email" required />
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
              <label>Are you a person with disability? </label>
            </div>

            <div>
              <input type="radio" id="yes" name="disability" value="yes" />{" "}
              <label for="yes">Yes</label>
              <input type="radio" id="no" name="disability" value="no" />
              <label for="no">No</label>
            </div>
          </div>
          <br />

          <label>
            <input type="checkbox" name="terms" required />
            <span>
              By submitting this form, I agree to abide by SUPA platform’s
            </span>
            <a href="https://supa.itf.gov.ng/terms-and-conditions" target="_blank">
              Terms and Conditions
            </a>
          </label>
          <br />
        </div>
      </div>
    </div>
  );
}
