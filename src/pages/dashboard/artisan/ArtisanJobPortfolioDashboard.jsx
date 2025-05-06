import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { CheckCheckIcon, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/config/env";
import Spinner from "@/components/Spinner";
import { startCase } from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross1Icon } from "@radix-ui/react-icons";

function generateUserAvatarFalback({ first_name, last_name }) {
  return `${!first_name ? "" : `${(first_name || "").trim()[0]}`}${
    !last_name ? "" : `${(last_name || "").trim()[0]}`
  }`;
}

const Status = ({ status }) => {
  return (
    <>
      <span
        className={` py-1 px-2 rounded text-white ${
          status === "artisan-rejected"
            ? "bg-red-500"
            : status === "requested"
            ? "bg-yellow-500"
            : status === "accepted"
            ? "bg-blue-500"
            : status === "artisan-completed" || status === "completed"
            ? "bg-green-500"
            : "bg-gray-500"
        }`}>
        {startCase(status)}
      </span>
    </>
  );
};

const ArtisanDashboard = () => {
  const logout = useLogout();

  return (
    <ProtectedRoute href="/trainee/dashboard">
      {/* <DashboardPage title="Trainee Dashboard"> */}
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Portfolio</h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <div></div>
      </div>
    </ProtectedRoute>
  );
};

export default ArtisanDashboard;
