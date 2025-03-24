import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { states } from "@/data/nigeria";
import useLogout from "@/pages/loginPage/logout";
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
import { API_BASE_URL } from "@/config/env";

// Utility Functions
function formatString(input) {
  // Replace underscores with spaces and capitalize
  return input
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatUsersToCSV(users) {
  if (!Array.isArray(users) || users.length === 0) {
    return [];
  }

  const headerMapping = {
    phoneNumber: "Phone Number",
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

  const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key);
  const rows = users.map((user) => Object.keys(user).map((key) => user[key]));

  return [headers, ...rows];
}

function replaceSymbolsWithSpace(str = "") {
  return str.replace(/[-/]/g, " ").toLowerCase();
}

// Initial Form State
const emptyForm = {
  stateOfResidence: "",
  lgaOfResidence: "",
  stateOfOrigin: "",
  lga: "",
  gender: "",
  hasDisability: "",
  role: "",
};

const AdminDashboardReports = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
    limit: 50,
  });

  // Form State
  const [form, setForm] = useState({
    ...emptyForm,
  });

  // Memoized CSV data
  const csvData = useMemo(() => {
    return formatUsersToCSV(
      users.map((user) => ({
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
      }))
    );
  }, [users]);

  // Fetch Users with Pagination
  const fetchUsers = async (filterParams, page = 1, limit = 50) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/users-reports`,
        {
          filterParams: {
            ...filterParams,
            page,
            limit,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { users, pagination: serverPagination } =
        response?.data?.data || {};

      setUsers(users || []);
      setPagination((prevPagination) => ({
        ...prevPagination,
        ...serverPagination,
        currentPage: page,
        limit,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get LGA options for selected state
  const getStateLGAS = (selectedState) => {
    const state = states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${selectedState}`)
    );

    return (state?.lgas || []).map((x) => ({
      label: x,
      value: x,
    }));
  };

  // Event Handlers
  const onChangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const search = () => {
    fetchUsers(form);
  };

  const clear = () => {
    setForm({ ...emptyForm });
    setUsers([]);
    setPagination({
      currentPage: 1,
      totalPages: 0,
      totalUsers: 0,
      limit: 50,
    });
  };

  const showAll = () => {
    setForm({ ...emptyForm });
    fetchUsers(emptyForm);
  };

  const handlePageChange = (page) => {
    fetchUsers(form, page, pagination.limit);
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

  const onchangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    const name = "Industrial Training Fund - SKILL-UP Artisan";
    const date = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("SUPA Report Artisan/Intending Artisan Report", 35, 15);

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

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 50,
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Generated by: ${name}`, 10, doc.internal.pageSize.height - 10);
      doc.text(
        `Date: ${date}`,
        doc.internal.pageSize.width - 50,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("Admin_Reports.pdf");
  };

  // Logout handler
  const logout = useLogout();

  // // Render
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <ProtectedRoute>
      {/* <DashboardPage title="Artisan Dashboard"> */}
        
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">ADMIN DASHBOARD REPORTS</h1>
              <h2 className="text-left font-[700] text-[14px]">
                (ARTISANS & INTENDING ARTISANS)
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex gap-[20px] flex-wrap">
              {/* Filter Dropdowns */}
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">User Type</p>
                <Select
                  value={form?.role}
                  onValueChange={(value) => onChangeInput("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="artisan_user">Artisan User</SelectItem>
                      <SelectItem value="intending_artisan">
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
                      {selectedStateLGASResidenceFormatted?.map((item) => {
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
                className="bg-emerald-700 mt-auto"
                onClick={search}
                disabled={loading}>
                {loading ? (
                  <SewingPinFilledIcon className="animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>

              <Button
                className="bg-red-500 text-[white] mt-auto hover:bg-gray-300"
                onClick={clear}
                disabled={loading}>
                Clear <Cross1Icon />
              </Button>

              <Button
                className="bg-slate-500 text-[white] mt-auto hover:bg-gray-300"
                onClick={showAll}
                disabled={loading}>
                Show All <DashboardIcon />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {/* Download Buttons */}
            <div className="w-full flex justify-end gap-2 mb-3">
              {users?.length > 0 && (
                <>
                  <CSVLink data={csvData}>
                    <Button className="mt-auto">
                      Download CSV <DownloadIcon />
                    </Button>
                  </CSVLink>
                  <Button className="mt-auto" onClick={generatePDF}>
                    Download PDF <DownloadIcon />
                  </Button>
                </>
              )}
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>SN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>NIN</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Residence</TableHead>
                  <TableHead>Origin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user?._id}>
                    <TableCell>
                      {index +
                        1 +
                        (pagination.currentPage - 1) * pagination.limit}
                    </TableCell>
                    <TableCell>
                      <div>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell>{formatString(user.role || "")}</TableCell>
                    <TableCell>{user.nin}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell className="capitalize">
                      {user.gender || "---"}
                    </TableCell>
                    <TableCell>
                      <div>{user.stateOfResidence}</div>
                      <div className="text-sm text-gray-500">
                        {user.lgaOfResidence}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{user.stateOfOrigin}</div>
                      <div className="text-sm text-gray-500">{user.lga}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
              <div className="mt-4 flex flex-col items-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(
                            Math.max(1, pagination.currentPage - 1)
                          )
                        }
                        disabled={pagination.currentPage === 1}
                      />
                    </PaginationItem>

                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={pagination.currentPage === 1}>
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {/* Ellipsis after first page */}
                    {pagination.currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink disabled>...</PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Middle pages */}
                    {Array.from({ length: 3 }, (_, i) => {
                      const pageNum = pagination.currentPage + i - 1;
                      if (pageNum > 1 && pageNum < pagination.totalPages) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={pagination.currentPage === pageNum}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    {/* Ellipsis before last page */}
                    {pagination.currentPage < pagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink disabled>...</PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {pagination.totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          isActive={
                            pagination.currentPage === pagination.totalPages
                          }>
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(
                              pagination.totalPages,
                              pagination.currentPage + 1
                            )
                          )
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-sm text-gray-500 mt-2">
                  Page {pagination.currentPage} of {pagination.totalPages} |
                  Total {pagination.totalUsers} users
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  );
};

export default AdminDashboardReports;
