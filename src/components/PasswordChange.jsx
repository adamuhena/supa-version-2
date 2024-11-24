import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "./ui/sonner";

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      Toaster({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${API_BASE_URL}/update-password/${localStorage.getItem('userId')}`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      Toaster({
        title: "Success",
        description: "Password updated successfully.",
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      Toaster({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={passwords.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Change Password</Button>
    </form>
  );
};

export default PasswordChange;



{/* <Card className="border p-4 rounded-lg shadow-md mb-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select onValueChange={(value) => handleUpdate('role', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artisan_user">Artisan User</SelectItem>
                    <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                    <SelectItem value="regular_user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="certifiedStatus" className="block text-sm font-medium text-gray-700">
                  Certified Status
                </label>
                <Switch
                  id="certifiedStatus"
                  checked={user.certifiedStatus}
                  onCheckedChange={(checked) => handleUpdate('certifiedStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="licenseStatus" className="block text-sm font-medium text-gray-700">
                  License Status
                </label>
                <Switch
                  id="licenseStatus"
                  checked={user.licenseStatus}
                  onCheckedChange={(checked) => handleUpdate('licenseStatus', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="agree" className="block text-sm font-medium text-gray-700">
                  Agree to Terms
                </label>
                <Switch
                  id="agree"
                  checked={user.agree}
                  onCheckedChange={(checked) => handleUpdate('agree', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>
                <Input
                  id="profileImage"
                  value={user.profileImage}
                  onChange={(e) => handleUpdate('profileImage', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}