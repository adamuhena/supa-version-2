

import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import "./index.css";
import { TrashIcon } from "@radix-ui/react-icons";

export default function Declaration({ controlButtons, form, setForm }) {
    const [passwordError, setPasswordError] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    // Password confirmation validation
    const validatePasswords = (password, confirmPassword) => {
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError("");
        }
    };

    // Handle profile image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
            setForm("profileImage", file);
        }
    };

    // Delete profile image
    const handleDeleteImage = () => {
        setProfileImage(null);
        setForm("profileImage", null);
    };

    return (
        <div
            style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                marginBottom: "100px",
                background: "white",
            }}
            className="relative w-full max-w-[700px] mx-auto py-[30px] flex flex-col px-5 gap-[30px] bg-white rounded-[16px]"
        >
            <h1 className="text-left font-[700] text-[24px]">Declaration</h1>

            {/* Password and Confirm Password */}
            {/* <div className="flex flex-col gap-4">
        <div className="flex items-start">
          <Label htmlFor="password" className="w-[300px] text-left leading-[1.3]">
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={form?.password || ""}
            onChange={(e) => {
              setForm("password", e.target.value);
              validatePasswords(e.target.value, form?.confirmPassword);
            }}
            placeholder="Enter your password"
            className="w-full"
          />
        </div>
        <div className="flex items-start">
          <Label
            htmlFor="confirmPassword"
            className="w-[300px] text-left leading-[1.3]"
          >
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={form?.confirmPassword || ""}
            onChange={(e) => {
              setForm("confirmPassword", e.target.value);
              validatePasswords(form?.password, e.target.value);
            }}
            placeholder="Re-enter your password"
            className="w-full"
          />
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div> */}

            {/* Profile Image Upload */}
            {/* <div className="flex items-start gap-4">
        <Label htmlFor="profileImage" className="w-[300px] text-left leading-[1.3]">
          Profile Image *
        </Label>
        <div className="flex flex-col items-center">

          {profileImage ? (
            <div className="relative w-24 h-24">
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
              <button
                onClick={handleDeleteImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                Upload
              </div>
            </label>
          )}
        </div>
      </div> */}

            {/* Accept Terms and Conditions */}
            <div className="flex">
                <label>
                    <input
                        type="checkbox"
                        name="terms"
                        required
                        className="size-[20px] cursor-pointer"
                        checked={form?.agree}
                        onClick={() => setForm("agree", !form.agree)}
                    />
                </label>

                <p
                    className="cursor-pointer"
                    onClick={() => setForm("agree", !form.agree)}
                >
                    Please note that signing up constitutes acceptance of our Terms of
                    Service and Privacy Policy. You must be at least 18 years old to
                    register and must provide truthful information.
                </p>
            </div>

            {controlButtons}
        </div>
    );
}
