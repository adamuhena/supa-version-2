import axios from "axios";
import React, { useMemo, useState } from "react";

import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { states } from "@/data/nigeria";
import useLogout from '@/pages/loginPage/logout';
import {
  Cross1Icon,
  DashboardIcon,
  DownloadIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import { LogOut, UserCircle } from "lucide-react";

import Spinner from "@/components/layout/spinner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

function formatString(input) {
  // Replace underscores with spaces
  const formatted = input.replace(/_/g, " ");

  // Capitalize the first letter of each word
  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatUsersToCSV(users) {
  
  if (!Array.isArray(users) || users.length === 0) {
    return [];
  }

  // Define header mapping for user-friendly column names
  const headerMapping = {
    phoneNumber: "Phone Number",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    gender: "Gender",
    stateOfOrigin: "State of Origin",
    lga: "LGA",
    stateOfResidence: "State of Residence",
    lgaOfResidence: "LGA of Residence",
    nin: "NIN",
  };

  // Get headers and use the friendly names from the mapping
  const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key);

  // Map each user object into an array of its values
  const rows = users.map((user) => Object.keys(user).map((key) => user[key]));

  // Combine headers and rows into the final CSV format
  return [headers, ...rows];
}

const emptyForm = {
  stateOfResidence: "",
  lgaOfResidence: "",
  stateOfOrigin: "",
  lga: "",
  gender: "",
  hasDisability: "",
  role: "",
};
function replaceSymbolsWithSpace(str = "") {
  let replacedStr = str.replace(/[-/]/g, " ");
  return replacedStr.toLowerCase();
}

const AdminDashboardReports = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setloading] = useState(false); // Holds user data
  const [users, setUsers] = useState([]); // Holds user data

  // Memoized CSV data
  const csvData = useMemo(() => {
    return formatUsersToCSV(
      users.map((user) => {
        return {
          phoneNumber: user?.phoneNumber,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone,
          role: user?.role,
          gender: user?.gender,
          stateOfOrigin: user?.stateOfOrigin,
          lga: user?.lga,
          stateOfResidence: user?.stateOfResidence,
          lgaOfResidence: user?.lgaOfResidence,
          nin: user?.nin,
        };
      })
    );
  }, [users]);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add a logo (make sure the image is in base64 format or a publicly accessible URL)
    const logoUrl = "/Users/j3phy/Documents/GitHub/supa-version-2/src/assets/logo.png"; 
    const logoUrl2 ="@/assets/images/logo.png" ; // Replace with your logo URL or base64 string
    const logoUrl3 ="https://via.placeholder.com/50" ;
    const name = "Industrial Training Fund - SKILL-UP Artisan - wwww.itf.gov.ng / www.supa-itf.gov.ng"; // Replace with the dynamic name if necessary
    const date = new Date().toLocaleDateString();
  
    // Load the logo
    // doc.addImage(logoUrl, "PNG", 10, 5, 20, 20); // x, y, width, height
  
    // Add title
    doc.setFontSize(16);
    doc.text("SUPA Report Artisan/Intending Artisan Report", 35, 15); // Adjust positioning based on the logo
  
    // Prepare table data
    const headers = [
      "Name",
      "Role",
      "NIN",
      "Phone",
      "Gender",
      "Residence",
      "Origin",
    ];
    const data = users.map((user) => [
      `${user.firstName} ${user.lastName}`,
      formatString(user.role || ""),
      user.nin || "---",
      user.phoneNumber || "---",
      user.gender || "---",
      `${user.stateOfResidence || "---"}, ${user.lgaOfResidence || "---"}`,
      `${user.stateOfOrigin || "---"}, ${user.lga || "---"}`,
    ]);
  
    // Add table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      headStyles: {
        fillColor: [16, 185, 129], // RGB color for the header background
        textColor: 255, // White text color
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 50, // Dark gray for the body text
      }, // Ensure the table starts below the title and logo
    });
  
    // Add footer with name and date
    const pageCount = doc.internal.getNumberOfPages(); // Get the total number of pages
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); // Go to page i
      doc.setFontSize(10);
      doc.text(`Generated by: ${name}`, 10, doc.internal.pageSize.height - 10); // Bottom-left corner
      doc.text(`Date: ${date}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10); // Bottom-right corner
    }
  
    // Save the PDF
    doc.save("Admin_Reports.pdf");
  };
  

  const [form, setForm] = useState({
    ...emptyForm,
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

  const fetchUsers = async (filterParams) => {
    setloading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/users-reports`,
        { filterParams },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUsers(response?.data?.data); // Assume data is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setloading(false);
    }
  };

  const search = () => {
    fetchUsers(form);
  };

  const clear = () => {
    setForm({
      ...emptyForm,
    });
    setUsers([]);
  };

  const showAll = () => {
    setForm({
      ...emptyForm,
    });
    fetchUsers(emptyForm);
  };
  const logout = useLogout();
  if (!users) {
    return (
    <div class="flex justify-center items-center h-screen">
    <Spinner/>
</div>
    );
  }
  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">ADMIN DASHBOARD REPORTS</h1>
              <h2 className="text-left font-[700] text-[14px]">
                (ARTISANS & INTENDIN ARTISANS)
              </h2>
            </div>
            <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/biodata')}>
            <UserCircle className="mr-2 h-4 w-4" /> Update Profile
          </Button>
          
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
          </header>

          <div className="flex gap-[20px] flex-wrap">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">User Type</p>
              <Select
                value={form?.role}
                onValueChange={(value) => onchangeInput("role", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"artisan_user"}>Artisan User</SelectItem>

                    <SelectItem value={"intending_artisan"}>
                      Intending Artisan
                    </SelectItem>
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
                  <SelectValue placeholder="" />
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
              <p className="text-left text-[14px] mb-1">State Of Origin</p>
              <Select
                value={form?.stateOfOrigin}
                onValueChange={(value) =>
                  onchangeInput("stateOfOrigin", value)
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
                  <SelectValue placeholder="" />
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
              <p className="text-left text-[14px] mb-1">Gender</p>
              <Select
                value={form?.gender}
                onValueChange={(value) => onchangeInput("gender", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
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
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="mt-auto"
              onClick={() => search()}
              disabled={loading}>
              {loading ? (
                <SewingPinFilledIcon className="animate-spin" />
              ) : (
                "Search"
              )}
            </Button>

            <Button
              className="bg-gray-300 text-[black] mt-auto hover:bg-gray-300"
              onClick={() => clear()}
              disabled={loading}>
              Clear <Cross1Icon />
            </Button>

            <Button
              className="bg-gray-300 text-[black] mt-auto hover:bg-gray-300"
              onClick={() => showAll()}
              disabled={loading}>
              Show All <DashboardIcon />
            </Button>
          </div>
        </div>

        <div>
          <div className="w-full flex justify-end gap-2 mb-3">
            {!users?.length ? null : (
              <>
              
              <CSVLink data={csvData}>
                <Button className=" mt-auto ">
                  Download <DownloadIcon />
                </Button>
              </CSVLink>
              <Button className="mt-auto" onClick={generatePDF}>
              Download PDF <DownloadIcon />
            </Button>
            </>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Residence</TableHead>
                <TableHead>Origin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-gray-200 border-[1px]">
              {(users || [])?.map((user) => {
                return (
                  <TableRow
                    key={user?._id}
                    className="border-[1px] border-gray-200  ">
                    <TableCell className="text-left">
                      <div className="text-[16px]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[12px] font-[600] text-gray-600">
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell className="text-left">
                      {formatString(`${user.role || ""}`)}
                    </TableCell>
                    <TableCell className="text-left">{user.nin}</TableCell>

                    <TableCell className="text-left">
                      {user.phoneNumber}
                    </TableCell>

                    <TableCell className="text-left capitalize">
                      {user.gender || "---"}
                    </TableCell>

                    <TableCell className="text-left">
                      <div className="text-[12px] font-[600] text-gray-600">
                        {user.stateOfResidence}
                      </div>
                      <div className="text-[12px] font-[600] text-gray-600">
                        {user.lgaOfResidence}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="text-[12px] font-[600] text-gray-600">
                        {user.stateOfOrigin}
                      </div>
                      <div className="text-[12px] font-[600] text-gray-600">
                        {user.lga}
                      </div>
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
