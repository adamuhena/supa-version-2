import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";
import PageLayout from "../../components/layout/pageLayout";

export default function ForgotPassword() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/forgot-password`,
            { identifier },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
      const { success, message } = response.data;

      if (success) {
        toast.success("Password reset instructions sent successfully!", {
          description: "Please check your email and phone for the new password.",
          position: "top-right",
        });
        navigate("/login");
      } else {
        toast.error("Failed to process request", {
          description: message,
          position: "top-right",
        });
      }
    } catch (error) {
      const description =
        error?.response?.data?.message || "An error occurred. Please try again.";
      toast.error("Error!", {
        description,
        position: "top-right",
      });
      console.dir(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
        <div className="flex min-h-screen items-center justify-center absolute top-0 left-0 right-0 bottom-0">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-600">
                Forgot Password
              </CardTitle>
              <CardDescription>
                Enter your email or phone number to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="identifier"
                    className="block text-left text-xs text-gray-600"
                  >
                    Email or Phone Number
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter email or phone number"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-800">
                  {loading ? <Spinner /> : "Reset Password"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}