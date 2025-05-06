"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

// Utility Functions
function formatString(input) {
  if (!input) return "";
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
    street: "Address",
    lga: "LGA",
    stateOfResidence: "State of Residence",
    lgaOfResidence: "LGA of Residence",
    nin: "NIN",
    sectors: "Sectors",
    tradeAreas: "Trade Areas",
    createdAt: "Date Registered",
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
  sector: "",
  tradeArea: "",
  dateFrom: "",
  dateTo: "",
};

const AdminDashboardReports = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [users, setUsers] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [allData, setAllData] = useState(false);

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

  // Fetch sectors on component mount
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSectors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };

    fetchSectors();
  }, []);

  // Fetch Users with Pagination
  // const fetchUsers = async (filterParams, page = 1, limit = 50) => {
  //   setLoading(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")

  //     const response = await axios.post(
  //       `${API_BASE_URL}/users-reports`,
  //       {
  //         filterParams: {
  //           ...filterParams,
  //           page,
  //           limit,
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     )

  //     const { users, pagination: serverPagination } = response?.data?.data || {}

  //     setUsers(users || [])
  //     setPagination((prevPagination) => ({
  //       ...prevPagination,
  //       ...serverPagination,
  //       currentPage: page,
  //       limit,
  //     }))
  //   } catch (error) {
  //     console.error("Error fetching users:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  // const fetchUsers = async (filterParams, page = 1, limit = 50) => {
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");

  //     // Format date params with timezone handling
  //     const formattedParams = {
  //       ...filterParams,
  //       page,
  //       limit,
  //       ...(filterParams.dateFrom || filterParams.dateTo) && {
  //         createdAt: {
  //           ...(filterParams.dateFrom && {
  //             $gte: new Date(filterParams.dateFrom)
  //               .setHours(0, 0, 0, 0)
  //               .toISOString()
  //           }),
  //           ...(filterParams.dateTo && {
  //             $lte: new Date(filterParams.dateTo)
  //               .setHours(23, 59, 59, 999)
  //               .toISOString()
  //           })
  //         }
  //       }
  //     };

  //     const response = await axios.post(
  //       `${API_BASE_URL}/users-reports`,
  //       { filterParams: formattedParams },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Accept': 'application/json'
  //         }
  //       }
  //     );

  //     const { users, pagination } = response?.data?.data || {};

  //     setUsers(users || []);
  //     setPagination(prev => ({
  //       ...prev,
  //       ...pagination,
  //       currentPage: page,
  //       limit
  //     }));
  //   } catch (error) {
  //     toast.error("Failed to fetch users");
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchUsers = async (filterParams, page = 1, limit = 50) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Format date params
      const formattedParams = {
        ...filterParams,
        page,
        limit,
      };

      // Handle date range filtering
      if (filterParams.dateFrom || filterParams.dateTo) {
        formattedParams.createdAt = {};

        if (filterParams.dateFrom) {
          const startDate = new Date(filterParams.dateFrom);
          startDate.setHours(0, 0, 0, 0);
          formattedParams.createdAt.$gte = startDate.toISOString();
        }

        if (filterParams.dateTo) {
          const endDate = new Date(filterParams.dateTo);
          endDate.setHours(23, 59, 59, 999);
          formattedParams.createdAt.$lte = endDate.toISOString();
        }
      }

      const response = await axios.post(
        `${API_BASE_URL}/users-reports`,
        {
          filterParams: formattedParams,
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

  const downloadAllData = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Format date params
      const formattedParams = {
        ...form,
        page: 1,
        limit: 1000000,
      };

      if (form.dateFrom) {
        // Set time to start of day for dateFrom
        const startDate = new Date(form.dateFrom);
        startDate.setHours(0, 0, 0, 0);
        formattedParams.createdAt = {
          ...formattedParams.createdAt,
          $gte: startDate.toISOString(),
        };
      }

      if (form.dateTo) {
        // Set time to end of day for dateTo
        const endDate = new Date(form.dateTo);
        endDate.setHours(23, 59, 59, 999);
        formattedParams.createdAt = {
          ...formattedParams.createdAt,
          $lte: endDate.toISOString(),
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/users-reports`,
        {
          filterParams: formattedParams,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { users } = response?.data?.data || {};

      if (users && users.length > 0) {
        // Process users to extract sector and trade area information
        const processedUsers = users.map((user) => {
          // Extract sectors and trade areas from priorSkillsCerts
          let sectors = "";
          let tradeAreas = "";

          if (user.priorSkillsCerts && user.priorSkillsCerts.length > 0) {
            user.priorSkillsCerts.forEach((cert) => {
              if (cert.sector) sectors += cert.sector + ", ";
              if (cert.tradeArea) tradeAreas += cert.tradeArea + ", ";
            });

            // Remove trailing comma and space
            sectors = sectors.replace(/,\s*$/, "");
            tradeAreas = tradeAreas.replace(/,\s*$/, "");
          }

          return {
            "Ref-Number": user?._id || "",
            phoneNumber: user?.phoneNumber || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            role: formatString(user?.role || ""),
            gender: user?.gender || "",
            stateOfOrigin: user?.stateOfOrigin || "",
            lga: user?.lga || "",
            stateOfResidence: user?.stateOfResidence || "",
            lgaOfResidence: user?.lgaOfResidence || "",
            street: user?.street || "",
            nin: user?.nin || "",
            sectors: sectors || "",
            tradeAreas: tradeAreas || "",
            hasDisability: user?.hasDisability || "",
            disabilityType: user?.disabilityType || "",
            createdAt: user?.createdAt || "",
          };
        });

        const formattedData = formatUsersToCSV(processedUsers);
        setCsvData(formattedData);
        setAllData(true);

        toast.success(
          "CSV data has been generated with all records. Click 'Download CSV' to download.",
          "Registration Date"
        );
      } else {
        toast.error("No data available to download");
      }
    } catch (error) {
      console.error("Error fetching all users for CSV:", error);
      toast.error("Failed to generate CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };
  // const downloadAllData = async () => {
  //   setLoadingCSV(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");

  //     // Build filter params object
  //     const filterParams = {
  //       ...form,
  //       page: 1,
  //       limit: 1000000, // Large limit to get all records
  //       ...(form.dateFrom || form.dateTo) && {
  //         createdAt: {
  //           ...(form.dateFrom && {
  //             $gte: new Date(form.dateFrom).toISOString()
  //           }),
  //           ...(form.dateTo && {
  //             $lte: new Date(form.dateTo).toISOString()
  //           })
  //         }
  //       }
  //     };

  //     const response = await axios.post(
  //       `${API_BASE_URL}/users-reports`,
  //       { filterParams },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json'
  //         },
  //       }
  //     );

  //     const { users } = response?.data?.data || {};

  //     if (users?.length > 0) {
  //       const processedUsers = users.map((user) => {
  //         // Process prior skills and certifications
  //         const skillsInfo = user.priorSkillsCerts?.reduce((acc, cert) => {
  //           acc.sectors.add(cert.sector || '');
  //           acc.tradeAreas.add(cert.tradeArea || '');
  //           return acc;
  //         }, { sectors: new Set(), tradeAreas: new Set() });

  //         return {
  //           "Ref-Number": user?._id || "",
  //           "Phone Number": user?.phoneNumber || "",
  //           "First Name": user?.firstName || "",
  //           "Last Name": user?.lastName || "",
  //           "Email": user?.email || "",
  //           "Role": formatString(user?.role || ""),
  //           "Gender": user?.gender || "",
  //           "State of Origin": user?.stateOfOrigin || "",
  //           "LGA of Origin": user?.lga || "",
  //           "State of Residence": user?.stateOfResidence || "",
  //           "LGA of Residence": user?.lgaOfResidence || "",
  //           "Address": user?.street || "",
  //           "NIN": user?.nin || "",
  //           "Sectors": Array.from(skillsInfo?.sectors || []).filter(Boolean).join(", ") || "",
  //           "Trade Areas": Array.from(skillsInfo?.tradeAreas || []).filter(Boolean).join(", ") || "",
  //           "Has Disability": user?.hasDisability ? "Yes" : "No",
  //           "Disability Type": user?.disabilityType || "",
  //           "Registration Date": new Date(user?.createdAt).toLocaleDateString()
  //         };
  //       });

  //       const formattedData = formatUsersToCSV(processedUsers);
  //       setCsvData(formattedData);
  //       setAllData(true);

  //       toast.success("CSV data generated successfully. Click 'Download CSV' to save.");
  //     } else {
  //       toast.error("No data available to download");
  //     }
  //   } catch (error) {
  //     console.error("Error generating CSV:", error);
  //     toast.error("Failed to generate CSV data");
  //   } finally {
  //     setLoadingCSV(false);
  //   }
  // };

  // const downloadAllData = async () => {
  //   setLoadingCSV(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const CHUNK_SIZE = 1000;
  //     let currentPage = 1;
  //     let allProcessedUsers = [];

  //     // Build filter params with non-empty values only
  //     const filterParams = {
  //       page: currentPage,
  //       limit: CHUNK_SIZE,
  //       ...(form.role && { role: form.role }),
  //       ...(form.stateOfResidence && { stateOfResidence: form.stateOfResidence }),
  //       ...(form.lgaOfResidence && { lgaOfResidence: form.lgaOfResidence }),
  //       ...(form.stateOfOrigin && { stateOfOrigin: form.stateOfOrigin }),
  //       ...(form.lga && { lga: form.lga }),
  //       ...(form.gender && { gender: form.gender }),
  //       ...(form.hasDisability && { hasDisability: form.hasDisability === "Yes" }),
  //       ...(form.sector && { sector: form.sector }),
  //       ...(form.tradeArea && { tradeArea: form.tradeArea }),
  //       ...(form.dateFrom || form.dateTo) && {
  //         createdAt: {
  //           ...(form.dateFrom && {
  //             $gte: new Date(form.dateFrom).toISOString()
  //           }),
  //           ...(form.dateTo && {
  //             $lte: new Date(form.dateTo).toISOString()
  //           })
  //         }
  //       }
  //     };

  //     while (true) {
  //       const response = await axios.post(
  //         `${API_BASE_URL}/users-reports`,
  //         {
  //           filterParams: {
  //             ...filterParams,
  //             page: currentPage
  //           }
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             'Content-Type': 'application/json'
  //           }
  //         }
  //       );

  //       const { users, pagination } = response?.data?.data || {};

  //       if (!users?.length) break;

  //       const processedChunk = users.map(user => ({
  //         "Ref-Number": user?._id || "",
  //         "Phone Number": user?.phoneNumber || "",
  //         "First Name": user?.firstName || "",
  //         "Last Name": user?.lastName || "",
  //         "Email": user?.email || "",
  //         "Role": formatString(user?.role || ""),
  //         "Gender": user?.gender || "",
  //         "State of Origin": user?.stateOfOrigin || "",
  //         "LGA of Origin": user?.lga || "",
  //         "State of Residence": user?.stateOfResidence || "",
  //         "LGA of Residence": user?.lgaOfResidence || "",
  //         "Address": user?.street || "",
  //         "NIN": user?.nin || "",
  //         "Sectors": processSkillsInfo(user.priorSkillsCerts, 'sector'),
  //         "Trade Areas": processSkillsInfo(user.priorSkillsCerts, 'tradeArea'),
  //         "Has Disability": user?.hasDisability ? "Yes" : "No",
  //         "Disability Type": user?.disabilityType || "",
  //         "Registration Date": new Date(user?.createdAt).toLocaleDateString()
  //       }));

  //       allProcessedUsers = [...allProcessedUsers, ...processedChunk];

  //       if (currentPage >= pagination.totalPages) break;
  //       currentPage++;
  //     }

  //     if (allProcessedUsers.length > 0) {
  //       const formattedData = formatUsersToCSV(allProcessedUsers);
  //       setCsvData(formattedData);
  //       setAllData(true);
  //       toast.success("CSV data generated successfully. Click 'Download CSV' to save.");
  //     } else {
  //       toast.error("No data available to download");
  //     }
  //   } catch (error) {
  //     console.error("Error generating CSV:", error);
  //     toast.error("Failed to generate CSV data");
  //   } finally {
  //     setLoadingCSV(false);
  //   }
  // };

  // Helper function to process skills info
  const processSkillsInfo = (skillsCerts = [], field) => {
    if (!skillsCerts?.length) return "";
    const items = new Set();
    skillsCerts.forEach((cert) => {
      if (cert[field]) items.add(cert[field]);
    });
    return Array.from(items).filter(Boolean).join(", ");
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

    // Reset trade area when sector changes
    if (id === "sector") {
      setForm((prevForm) => ({
        ...prevForm,
        tradeArea: "",
      }));
    }
  };

  const search = () => {
    fetchUsers(form);
    setAllData(false);
  };

  const clear = () => {
    setForm({ ...emptyForm });
    setUsers([]);
    setCsvData([]);
    setAllData(false);
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
    setAllData(false);
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

  // Get trade areas for selected sector
  const selectedSectorTradeAreas =
    (Array.isArray(sectors)
      ? sectors.find((sector) => sector._id === form.sector)
      : null
    )?.tradeAreas || [];

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    const name = "Industrial Training Fund - SKILL-UP Artisan";
    const date = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("SUPA Report Artisan/Intending Artisan Report", 35, 15);

    const headers = [
      "Ref-Number",
      "Name",
      "Role",
      "NIN",
      "Phone",
      "Gender",
      "State of Residence",
      "Address",
      "State of Origin",
      "Sectors/Trade Areas",
    ];

    const data = users.map((user) => {
      // Extract sectors and trade areas
      let sectorsTradeAreas = "";
      if (user.priorSkillsCerts && user.priorSkillsCerts.length > 0) {
        user.priorSkillsCerts.forEach((cert) => {
          if (cert.sector || cert.tradeArea) {
            sectorsTradeAreas += `${cert.sector || ""} - ${
              cert.tradeArea || ""
            }, `;
          }
        });
        sectorsTradeAreas = sectorsTradeAreas.replace(/,\s*$/, "");
      }

      return [
        `${user._id || ""}`, // Ref-Number
        `${user.firstName || ""} ${user.lastName || ""}`,
        formatString(user.role || ""),
        user.nin || "---",
        user.phoneNumber || "---",
        user.gender || "---",
        `${user.stateOfResidence || "---"}, ${user.lgaOfResidence || "---"}, ${
          user.street || "---"
        }`,
        `${user.stateOfOrigin || "---"}, ${user.lga || "---"}`,
        sectorsTradeAreas || "---",
        `${user.hasDisability || "---"} , ${user.disabilityType}`, // Has Disability
        `${user.createdAt || "---"}`, // Date Registered
      ];
    });

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

    doc.save("Artisan_Admin_Reports.pdf");
  };

  // Logout handler
  const logout = useLogout();

  return (
    <ProtectedRoute>
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
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
                  onChangeInput("stateOfResidence", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => (
                      <SelectItem key={item.value} value={item?.value}>
                        {item?.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">LGA Of Residence</p>
              <Select
                value={form?.lgaOfResidence}
                onValueChange={(value) =>
                  onChangeInput("lgaOfResidence", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASResidenceFormatted?.map((item) => (
                      <SelectItem key={item.value} value={item?.value}>
                        {item?.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State Of Origin</p>
              <Select
                value={form?.stateOfOrigin}
                onValueChange={(value) =>
                  onChangeInput("stateOfOrigin", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => (
                      <SelectItem key={item.value} value={item?.value}>
                        {item?.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">LGA Of Origin</p>
              <Select
                value={form?.lga}
                onValueChange={(value) => onChangeInput("lga", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASOriginFormatted.map((item) => (
                      <SelectItem key={item.value} value={item?.value}>
                        {item?.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Gender</p>
              <Select
                value={form?.gender}
                onValueChange={(value) => onChangeInput("gender", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Gender" />
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
                  onChangeInput("hasDisability", value)
                }>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* New Sector Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Sector</p>
              <Select
                value={form?.sector}
                onValueChange={(value) => onChangeInput("sector", value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sectors.map((sector) => (
                      <SelectItem key={sector._id} value={sector._id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* New Trade Area Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Trade Area</p>
              <Select
                value={form?.tradeArea}
                onValueChange={(value) => onChangeInput("tradeArea", value)}
                disabled={!form.sector}>
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={
                      form.sector ? "Select Trade Area" : "Select Sector First"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedSectorTradeAreas.map((tradeArea) => (
                      <SelectItem key={tradeArea._id} value={tradeArea._id}>
                        {tradeArea.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date From</p>
              <Input
                type="date"
                value={form.dateFrom}
                onChange={(e) => onChangeInput("dateFrom", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date To</p>
              <Input
                type="date"
                value={form.dateTo}
                onChange={(e) => onChangeInput("dateTo", e.target.value)}
                className="w-full"
                min={form.dateFrom} // Ensure dateTo is not before dateFrom
              />
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
                {!allData ? (
                  <Button
                    className="mt-auto"
                    onClick={downloadAllData}
                    disabled={loadingCSV}>
                    {loadingCSV ? (
                      <SewingPinFilledIcon className="animate-spin mr-2" />
                    ) : (
                      <DownloadIcon className="mr-2" />
                    )}
                    Generate CSV
                  </Button>
                ) : (
                  <CSVLink
                    data={csvData}
                    filename="Artisan_Admin_Reports.csv"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <DownloadIcon className="mr-2" />
                    Download CSV
                  </CSVLink>
                )}
                <Button className="mt-auto" onClick={generatePDF}>
                  <DownloadIcon className="mr-2" />
                  Download PDF
                </Button>
              </>
            )}
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-medium">SN</TableHead>
                  <TableHead clasName="font-medium">Ref-Number</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">NIN</TableHead>
                  <TableHead className="font-medium">Phone</TableHead>
                  <TableHead className="font-medium">Gender</TableHead>
                  <TableHead className="font-medium">
                    {" "}
                    State of Residence
                  </TableHead>
                  <TableHead className="font-medium">
                    LGA of Residence
                  </TableHead>
                  <TableHead className="font-medium"> Address</TableHead>
                  <TableHead className="font-medium">State of Origin</TableHead>
                  <TableHead className="font-medium">LGA of Origin</TableHead>
                  <TableHead className="font-medium">
                    Sectors/Trade Areas
                  </TableHead>
                  <TableHead className="font-medium">Has Disability</TableHead>
                  <TableHead className="font-medium">Registered Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => {
                    // Extract sectors and trade areas
                    const sectorsTradeAreas = [];
                    if (
                      user.priorSkillsCerts &&
                      user.priorSkillsCerts.length > 0
                    ) {
                      user.priorSkillsCerts.forEach((cert) => {
                        if (cert.sector || cert.tradeArea) {
                          sectorsTradeAreas.push({
                            sector: cert.sector,
                            tradeArea: cert.tradeArea,
                          });
                        }
                      });
                    }

                    return (
                      <TableRow key={user?._id || index}>
                        <TableCell>
                          {index +
                            1 +
                            (pagination.currentPage - 1) * pagination.limit}
                        </TableCell>
                        <TableCell>{formatString(user._id || "")}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>{formatString(user.role || "")}</TableCell>
                        <TableCell>{user.nin || "---"}</TableCell>
                        <TableCell>{user.phoneNumber || "---"}</TableCell>
                        <TableCell className="capitalize">
                          {user.gender || "---"}
                        </TableCell>
                        {/* <TableCell>
                            <div>{user.stateOfResidence || "---"}</div>
                            <div className="text-sm text-gray-500">{user.lgaOfResidence || "---"}</div>
                          </TableCell> */}
                        <TableCell>
                          <div>{user.stateOfResidence || "---"}</div>
                          {/* <div className="text-sm text-gray-500">{user.lgaOfResidence || "---"}</div> */}
                        </TableCell>
                        <TableCell>
                          {/* <div>{user.stateOfResidence || "---"}</div> */}
                          <div className="text-sm text-gray-500">
                            {user.lgaOfResidence || "---"}
                          </div>
                        </TableCell>
                        <TableCell>{user.street || "---"}</TableCell>
                        {/* <TableCell>
                            <div>{user.stateOfOrigin || "---"}</div>
                            <div className="text-sm text-gray-500">{user.lga || "---"}</div>
                          </TableCell> */}
                        <TableCell>
                          <div>{user.stateOfOrigin || "---"}</div>
                          {/* <div className="text-sm text-gray-500">{user.lga || "---"}</div> */}
                        </TableCell>
                        <TableCell>
                          {/* <div>{user.stateOfOrigin || "---"}</div> */}
                          <div className="text-sm text-gray-500">
                            {user.lga || "---"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sectorsTradeAreas.length > 0 ? (
                            <div className="space-y-1">
                              {sectorsTradeAreas.map((item, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">
                                    {item.sector || "---"}
                                  </span>
                                  {item.tradeArea && (
                                    <span className="text-gray-500">
                                      {" "}
                                      - {item.tradeArea}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            "---"
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{user.hasDisability || "---"}</div>
                          <div className="text-sm text-gray-500">
                            {user.disabilityType || "---"}
                          </div>
                        </TableCell>
                        <TableCell>{user.createdAt || "---"}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
                        onClick={() => handlePageChange(pagination.totalPages)}
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
                Page {pagination.currentPage} of {pagination.totalPages} | Total{" "}
                {pagination.totalUsers} users
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
