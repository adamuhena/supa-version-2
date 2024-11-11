import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import "./index.css";

export default function BioDataForm() {
  return (
    <div className="  ParentDiv">
      <div>
        <Label className="label" htmlFor="email">
          First Name
        </Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Middle Name</Label>
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
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Marital Status</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Sector</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Trade Area</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">Street Address</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">City</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="email">LGA</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div>
        <span>
          Are you a person with disability?{" "}
          <input type="radio" id="html" value="YES"></input>
        </span>
      </div>
    </div>
  );
}
