import React, { useEffect, useState } from "react";
import axios from "axios";

import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/data/nigeria";
import { Button } from "@/components/ui/button";
import { PrinterCheckIcon } from "lucide-react";
import { DownloadIcon } from "@radix-ui/react-icons";

function replaceSymbolsWithSpace(str = "") {
  let replacedStr = str.replace(/[-/]/g, " ");
  return replacedStr.toLowerCase();
}

const AdminDashboardReports = () => {
  const [users, setUsers] = useState([]); // Holds user data
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    stateOfOrigin: "",
    lga: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    gender: "",
    hasDisability: "",
  });
  const onchangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const selectedStateLGASOrigin =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfOrigin}`)
    )?.lgas || [];

  const selectedStateLGASOriginFormatted =
    selectedStateLGASOrigin && selectedStateLGASOrigin?.length
      ? selectedStateLGASOrigin.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const selectedStateLGASResidence =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${form?.stateOfResidence}`)
    )?.lgas || [];

  const selectedStateLGASResidenceFormatted =
    selectedStateLGASResidence && selectedStateLGASResidence?.length
      ? selectedStateLGASResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // const response = await axios.post(`${API_BASE_URL}/users-reports`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });

      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUsers(response?.data?.data); // Assume data is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">ADMIN DASHBOARD REPORTS</h1>
          </header>

          <div className="flex gap-[20px] flex-wrap">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State Of Residence</p>
              <Select
                value={form?.stateOfResidence}
                onValueChange={(value) =>
                  onchangeInput("stateOfResidence", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => {
                      return (
                        <SelectItem value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">LGA Of Origin</p>
              <Select
                value={form?.lga}
                onValueChange={(value) => onchangeInput("lga", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASOriginFormatted.map((item) => {
                      return (
                        <SelectItem value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State Of Residence</p>
              <Select
                value={form?.stateOfResidence}
                onValueChange={(value) =>
                  onchangeInput("stateOfResidence", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => {
                      return (
                        <SelectItem value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">LGA Of Residence</p>
              <Select
                value={form?.lgaOfResidence}
                onValueChange={(value) =>
                  onchangeInput("lgaOfResidence", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASResidenceFormatted.map((item) => {
                      return (
                        <SelectItem value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Gender</p>
              <Select
                value={form?.gender}
                onValueChange={(value) => onchangeInput("gender", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Has Disability</p>
              <Select
                value={form?.hasDisability}
                onValueChange={(value) =>
                  onchangeInput("hasDisability", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select " />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button className="mt-auto ">Search</Button>
          </div>
        </div>

        <div>
          <div className="w-full flex justify-end gap-2 mb-3">
            <Button className=" mt-auto ">
              Print <PrinterCheckIcon />
            </Button>
            <Button className=" mt-auto ">
              Download <DownloadIcon />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-gray-200 border-[1px]">
              {(users || [])?.map((user) => {
                return (
                  <TableRow
                    key={user?._id}
                    className="border-[1px] border-gray-200  ">
                    <TableCell className="text-left">
                      {user.firstName}
                    </TableCell>
                    <TableCell className="text-left">{user.lastName}</TableCell>
                    <TableCell className="text-left">{user.role}</TableCell>
                    <TableCell className="text-left">{user.nin}</TableCell>
                    <TableCell className="text-left">{user.email}</TableCell>
                    <TableCell className="text-left">
                      {user.phoneNumber}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default AdminDashboardReports;
