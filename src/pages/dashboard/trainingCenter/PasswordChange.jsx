import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit">Change Password</Button>
    </form>
  );
};

export default PasswordChange;

