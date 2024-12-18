import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FlexibleContactInput = ({ 
  value, 
  onChange, 
  label = "Contact Information", 
  placeholder = "Enter email or phone number" 
}) => {
  const [isPhoneMode, setIsPhoneMode] = useState(false);

  const validateInput = (inputValue) => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone number regex (supports various international formats)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    return isPhoneMode 
      ? phoneRegex.test(inputValue) 
      : emailRegex.test(inputValue);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="contact-input">{label}</Label>
        <div className="flex items-center space-x-2">
          <Label>
            {isPhoneMode ? 'Phone' : 'Email'}
          </Label>
          <Switch
            checked={isPhoneMode}
            onCheckedChange={setIsPhoneMode}
          />
        </div>
      </div>
      <Input
        id="contact-input"
        type={isPhoneMode ? "tel" : "email"}
        placeholder={isPhoneMode 
          ? "+1 (123) 456-7890" 
          : "center@example.com"
        }
        required
        value={value}
        onChange={handleInputChange}
        className={
          value && !validateInput(value) 
            ? "border-red-500 focus:border-red-500" 
            : ""
        }
      />
      {value && !validateInput(value) && (
        <p className="text-red-500 text-sm">
          Please enter a valid {isPhoneMode ? 'phone number' : 'email address'}
        </p>
      )}
    </div>
  );
};

export default FlexibleContactInput;