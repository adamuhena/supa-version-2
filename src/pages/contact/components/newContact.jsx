import React, { useState } from "react";
import axios from "axios";
import {
  Palette,
  Scissors,
  ShoppingBag,
  Hammer,
  Award,
  Users,
  Headset,
  UserCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/env";

export function NewContact() {
  const [attachment, setAttachment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle', 'sending', 'success', 'error'

  const departments = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "SUPA HOTLINE 1",
      email: "supasec@itf.gov.ng",
      phone: "0803 324 3748",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "SUPA HOTLINE 2",
      email: "supasec@itf.gov.ng",
      phone: "0806 050 0426",
      bgColor: "bg-pink-100",
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "SUPA HOTLINE 3",
      email: "supasec@itf.gov.ng",
      phone: "0802 840 3049",
      bgColor: "bg-green-100",
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "SUPA HOTLINE 4",
      email: "supasec@itf.gov.ng",
      phone: "0703 615 0770",
      bgColor: "bg-yellow-100",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "SUPA HOTLINE 5",
      email: "supasec@itf.gov.ng",
      phone: "0706 085 0476",
      bgColor: "bg-orange-100",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "SUPA HOTLINE 6",
      email: "supasec@itf.gov.ng",
      phone: "0803 318 1752",
      bgColor: "bg-green-100",
    },
    {
      icon: <Headset className="w-6 h-6" />,
      title: "SUPA HOTLINE 7",
      email: "",
      phone: "0803 653 7260",
      bgColor: "bg-blue-100",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("inquiryType", formData.inquiryType);
      payload.append("subject", formData.subject);
      payload.append("message", formData.message);
      if (attachment) payload.append("attachment", attachment);

      const response = await axios.post(`${API_BASE_URL}/contactus`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSubmitStatus("success");
        toast.success("Inquiry submitted successfully!");
        setFormData({
          name: "",
          email: "",
          inquiryType: "",
          subject: "",
          message: "",
        });
        setAttachment(null);
      } else {
        setSubmitStatus("error");
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitStatus("error");
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container my-auto mx-auto px-4 py-0 max-w-7xl h-screen flex flex-col overflow-auto">
      <div className="flex flex-col lg:flex-row flex-grow overflow-auto space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Form Section */}
        <div
          className="w-full lg:w-2/3 bg-amber-50 p-6 rounded-lg py-8 pb-9
        ">
          <h2 className="text-center text-2xl font-semibold mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have questions about registering as an artisan? Need help with your
            portfolio submission? We're here to assist you in joining our
            vibrant artisan community.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inquiryType">Inquiry Type*</Label>
                <Select
                  name="inquiryType"
                  onValueChange={(value) =>
                    setFormData({ ...formData, inquiryType: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Order</SelectItem>
                    <SelectItem value="workshop">Workshop Inquiry</SelectItem>
                    <SelectItem value="collaboration">
                      Artisan Collaboration
                    </SelectItem>
                    <SelectItem value="support">General Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name*</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email*</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject*</Label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message*</Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (optional)</Label>
              <Input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={submitStatus === "sending"}>
              {submitStatus === "sending" ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>

        {/* Department List Section - 1/3 width on larger screens, scrollable */}
        <div className="w-full lg:w-1/3 bg-white overflow-y-auto flex-shrink-0 h-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${dept.bgColor}`}>
                      {dept.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{dept.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{dept.email}</p>
                      <p className="text-sm text-gray-600">{dept.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
