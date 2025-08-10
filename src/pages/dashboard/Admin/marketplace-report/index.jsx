"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/layout/spinner";
import { states } from "@/data/nigeria";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import "jspdf-autotable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cross1Icon, SewingPinFilledIcon } from "@radix-ui/react-icons";
import useLogout from "@/pages/loginPage/logout";
import { LogOut, UserCircle, Eye, Download } from "lucide-react";
import { API_BASE_URL } from "@/config/env";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExportButtons from "@/components/ExportButtons";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const useDebounce = ({ onChange, debounce = 500 }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return { value, setValue };
};

const MarketplaceReport = () => {
  // Component state management
  const [isMounted, setIsMounted] = useState(false);
  const [hasLoadedFirst, sethasLoadedFirst] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [csvData, setcsvData] = useState([]);
  const [activeTab, setActiveTab] = useState("artisans");

  const logout = useLogout();
  const navigate = useNavigate();
  const MAX_CSV_ROWS = 1000000;

  // Data states
  const [artisans, setArtisans] = useState([]);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination states
  const [artisanPagination, setArtisanPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
    pageSize: 25,
  });

  const [clientPagination, setClientPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
    pageSize: 25,
  });

  const [requestPagination, setRequestPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    pageSize: 25,
  });

  const itemsPerPage = 25;

  // Filter states
  const [sectors, setSectors] = useState([]);
  const [tradeAreas, setTradeAreas] = useState([]);

  const defaultData = {
    currentPage: 1,
    search: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    sector: "",
    tradeArea: "",
    name: "",
    role: "",
    status: "",
    fromDate: "",
    toDate: "",
    sort: "-createdAt",
  };

  const [artisanFilter, setArtisanFilter] = useState({ ...defaultData })
  const [clientFilter, setClientFilter] = useState({ ...defaultData })
  const [requestFilter, setRequestFilter] = useState({ ...defaultData })


  // Set mounted state on component mount/unmount
  // useEffect(() => {
  //   setIsMounted(true)
  //   return () => {
  //     setIsMounted(false)
  //   }
  // }, [])
  

  // Filter change handlers
  const handleArtisanFilterChange = (key, value) => {
    const filterValue = value === "all" ? "" : value;
    setArtisanFilter((x) => ({ ...x, [key]: filterValue }));

    if (key === "stateOfResidence") {
      setArtisanFilter((x) => ({ ...x, lgaOfResidence: "" }));
    }
    if (key === "stateOfOrigin") {
      setArtisanFilter((x) => ({ ...x, lgaOfOrigin: "" }));
    }
    if (key === "sector") {
      setArtisanFilter((x) => ({ ...x, tradeArea: "" }));
    }
  };

  const handleClientFilterChange = (key, value) => {
    const filterValue = value === "all" ? "" : value;
    setClientFilter((x) => ({ ...x, [key]: filterValue }));

    if (key === "stateOfResidence") {
      setClientFilter((x) => ({ ...x, lgaOfResidence: "" }));
    }
  };

  const handleRequestFilterChange = (key, value) => {
    const filterValue = value === "all" ? "" : value;
    setRequestFilter((x) => ({ ...x, [key]: filterValue }));
  };

  // Pagination handlers
  const handleArtisanPageChange = (page) => {
    setArtisanFilter((x) => ({ ...x, currentPage: page }));
  };

  const handleClientPageChange = (page) => {
    setClientFilter((x) => ({ ...x, currentPage: page }));
  };

  const handleRequestPageChange = (page) => {
    setRequestFilter((x) => ({ ...x, currentPage: page }));
  };

  // Debounced search handlers
  const { value: artisanSearchValue, setValue: setArtisanSearchValue } =
    useDebounce({
      debounce: 500,
      onChange: (debouncedValue) => {
        setArtisanFilter((x) => ({ ...x, search: debouncedValue }));
      },
    });

  const { value: clientSearchValue, setValue: setClientSearchValue } =
    useDebounce({
      debounce: 500,
      onChange: (debouncedValue) => {
        setClientFilter((x) => ({ ...x, search: debouncedValue }));
      },
    });

  const { value: requestSearchValue, setValue: setRequestSearchValue } =
    useDebounce({
      debounce: 500,
      onChange: (debouncedValue) => {
        setRequestFilter((x) => ({ ...x, search: debouncedValue }));
      },
    });

  // Helper functions
  function replaceSymbolsWithSpace(str = "") {
    const replacedStr = str.replace(/[-/]/g, " ");
    return replacedStr.toLowerCase();
  }

  const getSelectedStateLGAS = (stateValue) => {
    return (
      states.find(
        (state) =>
          replaceSymbolsWithSpace(`${state?.value}`) ===
          replaceSymbolsWithSpace(`${stateValue}`)
      )?.lgas || []
    );
  };

  // CSV formatting functions
  function formatArtisansToCSV(artisans) {
    if (!Array.isArray(artisans) || artisans.length === 0) {
      return [];
    }

    const headerMapping = {
      sn: "S/N",
      fullName: "Full Name",
      email: "Email",
      phoneNumber: "Phone Number",
      stateOfResidence: "State of Residence",
      lgaOfResidence: "LGA of Residence",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
      portfolioItems: "Portfolio Items",
      createdAt: "Registration Date",
    };

    const headers = Object.keys(artisans[0]).map(
      (key) => headerMapping[key] || key
    );
    const rows = artisans.map((artisan) =>
      Object.keys(artisan).map((key) => artisan[key])
    );

    return [headers, ...rows];
  }

  function formatClientsToCSV(clients) {
    if (!Array.isArray(clients) || clients.length === 0) {
      return [];
    }

    const headerMapping = {
      sn: "S/N",
      fullName: "Full Name",
      email: "Email",
      phoneNumber: "Phone Number",
      stateOfResidence: "State of Residence",
      lgaOfResidence: "LGA of Residence",
      address: "Address",
      createdAt: "Registration Date",
    };

    const headers = Object.keys(clients[0]).map(
      (key) => headerMapping[key] || key
    );
    const rows = clients.map((client) =>
      Object.keys(client).map((key) => client[key])
    );

    return [headers, ...rows];
  }

  function formatRequestsToCSV(requests) {
    if (!Array.isArray(requests) || requests.length === 0) {
      return [];
    }

    const headerMapping = {
      sn: "S/N",
      clientName: "Client Name",
      artisanName: "Artisan Name",
      jobTitle: "Job Title",
      jobLocation: "Job Location",
      status: "Status",
      createdAt: "Request Date",
    };

    const headers = Object.keys(requests[0]).map(
      (key) => headerMapping[key] || key
    );
    const rows = requests.map((request) =>
      Object.keys(request).map((key) => request[key])
    );

    return [headers, ...rows];
  }

  // Download functions
  const downloadArtisanCSV = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const params = {
        limit: MAX_CSV_ROWS,
        page: 1,
        ...artisanFilter,
      };

      const response = await axios.get(`${API_BASE_URL}/marketplace/artisan`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data } = response.data;
      const formatted = formatArtisansToCSV(
        (data?.users || []).map((x, i) => ({
          sn: i + 1,
          fullName: `${x?.firstName || ""} ${x?.lastName || ""}`,
          email: x?.email || "",
          phoneNumber: x?.phoneNumber || "",
          stateOfResidence: x?.stateOfResidence || "",
          lgaOfResidence: x?.lgaOfResidence || "",
          sectors:
            x.priorSkillsCerts?.map((cert) => cert.sector).join(", ") || "",
          tradeAreas:
            x.priorSkillsCerts?.map((cert) => cert.tradeArea).join(", ") || "",
          portfolioItems: x.artisanMarketplacePortfolio?.length || 0,
          createdAt: x?.createdAt
            ? new Date(x.createdAt).toLocaleDateString()
            : "",
        }))
      );
      setcsvData(formatted);
      toast.success("Artisan CSV data generated successfully!");
    } catch (error) {
      console.error("Error fetching artisans:", error);
      toast.error("Failed to generate artisan CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };

  const downloadClientCSV = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const params = {
        limit: MAX_CSV_ROWS,
        page: 1,
        ...clientFilter,
      };

      // Note: You'll need to implement the client endpoint in your backend
      const response = await axios.get(
        `${API_BASE_URL}/marketplace-reports/clients`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data } = response.data;
      const formatted = formatClientsToCSV(
        (data?.clients || []).map((x, i) => ({
          sn: i + 1,
          fullName: `${x?.firstName || ""} ${x?.lastName || ""}`,
          email: x?.email || "",
          phoneNumber: x?.phoneNumber || "",
          stateOfResidence: x?.stateOfResidence || "",
          lgaOfResidence: x?.lgaOfResidence || "",
          address: x?.address || "",
          createdAt: x?.createdAt
            ? new Date(x.createdAt).toLocaleDateString()
            : "",
        }))
      );
      setcsvData(formatted);
      toast.success("Client CSV data generated successfully!");
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to generate client CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };

  const downloadRequestCSV = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const params = {
        limit: MAX_CSV_ROWS,
        page: 1,
        ...requestFilter,
      };

      const response = await axios.get(
        `${API_BASE_URL}/marketplace-reports/requests`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data } = response.data;
      const formatted = formatRequestsToCSV(
        (data?.requests || []).map((x, i) => ({
          sn: i + 1,
          clientName: `${x?.client?.firstName || ""} ${
            x?.client?.lastName || ""
          }`,
          artisanName: `${x?.artisan?.firstName || ""} ${
            x?.artisan?.lastName || ""
          }`,
          jobTitle: x?.jobTitle || "",
          jobLocation: `${x?.jobLocation?.address || ""}, ${
            x?.jobLocation?.lga || ""
          }, ${x?.jobLocation?.state || ""}`,
          status: x?.status || "",
          createdAt: x?.createdAt
            ? new Date(x.createdAt).toLocaleDateString()
            : "",
        }))
      );
      setcsvData(formatted);
      toast.success("Request CSV data generated successfully!");
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to generate request CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };

  // Clear filter functions
  const clearArtisanFilter = () => {
    setArtisanFilter(defaultData);
    setArtisanSearchValue("");
    setcsvData([]);
  };

  const clearClientFilter = () => {
    setClientFilter(defaultData);
    setClientSearchValue("");
    setcsvData([]);
  };

  const clearRequestFilter = () => {
    setRequestFilter(defaultData);
    setRequestSearchValue("");
    setcsvData([]);
  };

  // Fetch data functions
  const fetchArtisans = useCallback(async () => {
    if (!hasLoadedFirst) {
      setLoading(true);
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found");
        return;
      }

      const params = {
        limit: itemsPerPage,
        page: artisanFilter?.currentPage,
        ...artisanFilter,
      };

      const response = await axios.get(`${API_BASE_URL}/marketplace/artisan`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data?.success) {
        setArtisans(response.data.data.users || []);
        setArtisanPagination(response.data.data.pagination);
        sethasLoadedFirst(true);
      }
    } catch (error) {
      console.error("Error fetching artisans:", error);
      toast.error("Failed to fetch artisans");
    } finally {
      setLoading(false);
    }
  }, [artisanFilter, hasLoadedFirst, itemsPerPage]);

  // Memoize filter parameters
  const filterParams = useMemo(
    () => ({
      ...clientFilter,
      page: clientFilter.page,
      limit: clientFilter.limit,
    }),
    [
      clientFilter.page,
      clientFilter.limit,
      clientFilter.stateOfResidence,
      clientFilter.lgaOfResidence,
      clientFilter.name,
      clientFilter.fromDate,
      clientFilter.toDate,
      clientFilter.sort,
    ]
  );

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/marketplace-reports/clients`,
        {
          params: filterParams,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        setClients(response.data.data.clients || []);
        setClientPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  }, [filterParams]); // Only depend on memoized filterParams

  const fetchRequests = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const params = {
        limit: itemsPerPage,
        page: requestFilter?.currentPage,
        ...requestFilter,
      };

      const response = await axios.get(
        `${API_BASE_URL}/marketplace-reports/requests`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.success) {
        console.log('API Response:', response.data);
        console.log('Pagination Data:', response.data.data.pagination);
        setRequests(response.data.data.requests || []);
        // setRequestPagination(response.data.data.pagination);
        setRequestPagination({
          ...requestPagination,
          currentPage: response.data.data.pagination.currentPage,
          totalPages: response.data.data.pagination.totalPages,
          totalUsers: response.data.data.pagination.total || response.data.data.pagination.totalUsers, // Check which field name your API uses
          pageSize: itemsPerPage
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    }
  }, [requestFilter, itemsPerPage]);

  // Fetch sectors and trade areas
  useEffect(() => {
    const fetchSectorsAndTradeAreas = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.success) {
          setSectors(response.data.data || []);
          const allTradeAreas = [];
          response.data.data.forEach((sector) => {
            if (sector.tradeAreas && Array.isArray(sector.tradeAreas)) {
              sector.tradeAreas.forEach((ta) => {
                allTradeAreas.push({
                  ...ta,
                  sectorId: sector._id,
                  sectorName: sector.name,
                });
              });
            }
          });
          setTradeAreas(allTradeAreas);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };

    fetchSectorsAndTradeAreas();
  }, []);

  const handleViewItem = (item) => {
    setSelectedItem(item);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-800";
      case "amount-proposed":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "artisan-started":
        return "bg-indigo-100 text-indigo-800";
      case "artisan-rejected":
        return "bg-red-100 text-red-800";
      case "client-rejected":
        return "bg-pink-100 text-pink-800";
      case "artisan-completed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Single effect to handle tab changes and initial load
  useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case "artisans":
          await fetchArtisans();
          break;
        case "requests":
          await fetchRequests();
          break;

        case "clients":
          await fetchClients();
          break;
      }
    };

    fetchData();
  }, [activeTab]);

  // 5. Add modal state and action handlers to the component
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [artisanRejectionReason, setArtisanRejectionReason] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [adminRejectReason, setAdminRejectReason] = useState("");

  const acceptAmount = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/accept-amount`,
        {
          request_id: selectedItem._id,
          artisan_id: selectedItem.artisan?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Amount accepted successfully!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "accepted" } : req
          )
        );
        setRequestPagination((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
        }));
        setSelectedItem(null);
      } else {
        toast.error(response.data.message || "Failed to accept amount");
      }
    } catch (error) {
      console.error("Error accepting amount:", error);
      toast.error(error.response?.data?.message || "Failed to accept amount");
    } finally {
      setModalLoading(false);
    }
  };
  const rejectAmount = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/reject-amount`,
        {
          request_id: selectedItem._id,
          artisan_id: selectedItem.artisan?._id,
          artisanRejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Amount rejected successfully!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "artisan-rejected" } : req
          )
        );
        setRequestPagination((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
        }));
        setSelectedItem(null);
      } else {
        toast.error(response.data.message || "Failed to reject amount");
      }
    } catch (error) {
      console.error("Error rejecting amount:", error);
      toast.error(error.response?.data?.message || "Failed to reject amount");
    } finally {
      setModalLoading(false);
      setConfirmReject(false);
      setArtisanRejectionReason("");
    }
  };
  const startJob = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/start-job`,
        {
          request_id: selectedItem._id,
          artisan_id: selectedItem.artisan?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Job started successfully!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "artisan-started" } : req
          )
        );
        setRequestPagination((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
        }));
        setSelectedItem(null);
      } else {
        toast.error(response.data.message || "Failed to start job");
      }
    } catch (error) {
      console.error("Error starting job:", error);
      toast.error(error.response?.data?.message || "Failed to start job");
    } finally {
      setModalLoading(false);
    }
  };
  const completeJob = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/update-request-status`,
        {
          artisan_id: selectedItem.artisan?._id,
          status: "artisan-completed",
          request_id: selectedItem._id,
          agreedSum: selectedItem.agreedSum || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Job completed successfully. Awaiting client approval!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "artisan-completed" } : req
          )
        );
        setSelectedItem(null);
      } else {
        toast.error(response.data.message || "Failed to complete job");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setModalLoading(false);
    }
  };

  const approveCompletion = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.put(
        `${API_BASE_URL}/marketplace/requests/${selectedItem._id}/approve-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Job marked as completed!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "completed" } : req
          )
        );
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error approving completion:", error);
      toast.error("Failed to approve completion");
    } finally {
      setModalLoading(false);
      setShowApproveDialog(false);
    }
  };

  const rejectCompletion = async () => {
    if (!selectedItem) return;
    setModalLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found");
        return;
      }
      const response = await axios.put(
        `${API_BASE_URL}/marketplace/requests/${selectedItem._id}/reject-completion`,
        { reason: adminRejectReason },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data?.success) {
        toast.success("Job completion rejected!");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === selectedItem._id ? { ...req, status: "client-rejected" } : req
          )
        );
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error rejecting completion:", error);
      toast.error("Failed to reject completion");
    } finally {
      setModalLoading(false);
      setShowRejectDialog(false);
      setAdminRejectReason("");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        {loading && !hasLoadedFirst && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
            <Spinner />
          </div>
        )}

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Marketplace Report</h1>
            <p className="text-muted-foreground">
              View and analyze marketplace data
            </p>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="artisans">Artisans</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="artisans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Artisan Filters</CardTitle>
                <CardDescription>
                  Filter artisans by various criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-[20px] flex-wrap mb-4">
                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Search</p>
                    <Input
                      className="text-[12px] placeholder:text-[12px]"
                      placeholder="Name or email"
                      value={artisanSearchValue}
                      onChange={(e) => setArtisanSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">
                      State of Residence
                    </p>
                    <Select
                      value={artisanFilter?.stateOfResidence}
                      onValueChange={(value) =>
                        handleArtisanFilterChange("stateOfResidence", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All States
                          </SelectItem>
                          {states.map((item) => (
                            <SelectItem
                              className="text-[12px]"
                              value={item?.value}
                              key={item.value}>
                              {item?.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">
                      LGA of Residence
                    </p>
                    <Select
                      value={artisanFilter.lgaOfResidence}
                      onValueChange={(value) =>
                        handleArtisanFilterChange("lgaOfResidence", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All LGAs
                          </SelectItem>
                          {getSelectedStateLGAS(
                            artisanFilter?.stateOfResidence
                          ).map((lga) => (
                            <SelectItem
                              className="text-[12px]"
                              value={lga}
                              key={lga}>
                              {lga}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Sector</p>
                    <Select
                      value={artisanFilter?.sector}
                      onValueChange={(value) =>
                        handleArtisanFilterChange("sector", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All Sectors
                          </SelectItem>
                          {sectors.map((sector) => (
                            <SelectItem
                              className="text-[12px]"
                              key={sector._id}
                              value={sector._id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Trade Area</p>
                    <Select
                      value={artisanFilter.tradeArea}
                      onValueChange={(value) =>
                        handleArtisanFilterChange("tradeArea", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select Trade Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All Trade Areas
                          </SelectItem>
                          {tradeAreas
                            .filter(
                              (ta) =>
                                !artisanFilter.sector ||
                                ta.sectorId === artisanFilter.sector
                            )
                            .map((ta) => (
                              <SelectItem
                                className="text-[12px]"
                                key={ta._id}
                                value={ta._id}>
                                {ta.name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={clearArtisanFilter}
                    variant="outline"
                    disabled={loading}>
                    Clear Filters
                    {loading ? (
                      <SewingPinFilledIcon className="animate-spin ml-2" />
                    ) : (
                      <Cross1Icon className="ml-2" />
                    )}
                  </Button>

                  {!csvData?.length ? (
                    <Button
                      onClick={downloadArtisanCSV}
                      variant="outline"
                      disabled={loadingCSV || !artisans?.length}>
                      <Download className="mr-2 h-4 w-4" /> Generate CSV
                      {loadingCSV ? (
                        <SewingPinFilledIcon className="animate-spin ml-2" />
                      ) : null}
                    </Button>
                  ) : (
                    <CSVLink
                      data={csvData}
                      filename="artisans-report.csv"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </CSVLink>
                  )}
                </div>

                {/* Add export buttons */}
                <div className="flex justify-end mb-4">
                  <ExportButtons
                    exportType="artisans"
                    filters={artisanFilter}
                    disabled={loading || !artisans?.length}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="font-medium">
                Total Artisans Found: {artisanPagination?.totalUsers || 0}
              </h2>
            </div>

            <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artisans.map((artisan, index) => (
                  <TableRow key={artisan._id || index}>
                    <TableCell className="text-left text-[12px]">
                      {index +
                        1 +
                        (artisanPagination.currentPage - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell className="text-left max-w-[200px] text-[12px]">
                      {`${artisan.firstName || ""} ${artisan.lastName || ""}`}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {artisan.email || ""}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {artisan.phoneNumber || ""}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <div className="flex flex-col">
                        <span>{artisan?.stateOfResidence || "---"}</span>
                        <span className="text-[10px] text-gray-500">
                          {artisan?.lgaOfResidence || "---"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <div className="flex flex-wrap gap-1">
                        {artisan.priorSkillsCerts
                          ?.slice(0, 2)
                          .map((cert, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-[10px]">
                              {sectors.find((s) => s._id === cert.sector)
                                ?.name || cert.sector}
                            </Badge>
                          ))}
                        {artisan.priorSkillsCerts?.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{artisan.priorSkillsCerts.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {artisan.artisanMarketplacePortfolio?.length || 0} items
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {artisan?.createdAt
                        ? new Date(artisan.createdAt).toLocaleDateString()
                        : "---"}
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewItem(artisan)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Artisan Details</SheetTitle>
                            <SheetDescription>
                              View artisan information and portfolio
                            </SheetDescription>
                          </SheetHeader>
                          {selectedItem && (
                            <div className="py-4 space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                  <img
                                    src={
                                      selectedItem.profileImage ||
                                      "/placeholder.svg?height=64&width=64"
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {`${selectedItem.firstName || ""} ${
                                      selectedItem.lastName || ""
                                    }`}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedItem.email}
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Contact Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">Phone:</p>
                                      <p>{selectedItem.phoneNumber || "---"}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Email:</p>
                                      <p>{selectedItem.email || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Location</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="font-medium">
                                        State of Residence:
                                      </p>
                                      <p>
                                        {selectedItem.stateOfResidence || "---"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        LGA of Residence:
                                      </p>
                                      <p>
                                        {selectedItem.lgaOfResidence || "---"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Address:</p>
                                      <p>{selectedItem.street || "---"}</p>
                                    </div>
                                  </div>
                                </div>

                                {selectedItem.priorSkillsCerts &&
                                  selectedItem.priorSkillsCerts.length > 0 && (
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Skills & Certifications
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedItem.priorSkillsCerts.map(
                                          (cert, index) => (
                                            <div
                                              key={index}
                                              className="border p-2 rounded-md">
                                              <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                  <p className="font-medium">
                                                    Sector:
                                                  </p>
                                                  <p>
                                                    {sectors.find(
                                                      (s) =>
                                                        s._id === cert.sector
                                                    )?.name ||
                                                      cert.sector ||
                                                      "---"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Trade Area:
                                                  </p>
                                                  <p>
                                                    {tradeAreas.find(
                                                      (ta) =>
                                                        ta._id ===
                                                        cert.tradeArea
                                                    )?.name ||
                                                      cert.tradeArea ||
                                                      "---"}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {selectedItem.artisanMarketplacePortfolio &&
                                  selectedItem.artisanMarketplacePortfolio
                                    .length > 0 && (
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Portfolio (
                                        {
                                          selectedItem
                                            .artisanMarketplacePortfolio.length
                                        }{" "}
                                        items)
                                      </h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        {selectedItem.artisanMarketplacePortfolio
                                          .slice(0, 4)
                                          .map((item, index) => (
                                            <div
                                              key={index}
                                              className="aspect-square rounded-md overflow-hidden">
                                              <img
                                                src={
                                                  item.imageUrl ||
                                                  "/placeholder.svg?height=100&width=100"
                                                }
                                                alt={`Portfolio ${index + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                          <SheetFooter>
                            <SheetClose asChild>
                              <Button variant="secondary">Close</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handleArtisanPageChange(
                        Math.max(1, artisanPagination.currentPage - 1)
                      )
                    }
                    disabled={artisanPagination.currentPage === 1}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    onClick={() => handleArtisanPageChange(1)}
                    isActive={artisanPagination.currentPage === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {artisanPagination.currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = artisanPagination.currentPage + i - 1;
                  return pageNumber > 1 &&
                    pageNumber < artisanPagination.totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === artisanPagination.currentPage}
                        onClick={() => handleArtisanPageChange(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                {artisanPagination.currentPage <
                  artisanPagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {artisanPagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        handleArtisanPageChange(artisanPagination.totalPages)
                      }
                      isActive={
                        artisanPagination.currentPage ===
                        artisanPagination.totalPages
                      }>
                      {artisanPagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handleArtisanPageChange(
                        Math.min(
                          artisanPagination.totalPages,
                          artisanPagination.currentPage + 1
                        )
                      )
                    }
                    disabled={
                      artisanPagination.currentPage ===
                      artisanPagination.totalPages
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Filters</CardTitle>
                <CardDescription>
                  Filter clients by various criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-[20px] flex-wrap mb-4">
                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Search</p>
                    <Input
                      className="text-[12px] placeholder:text-[12px]"
                      placeholder="Name or email"
                      value={clientSearchValue}
                      onChange={(e) => setClientSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">
                      State of Residence
                    </p>
                    <Select
                      value={clientFilter?.stateOfResidence}
                      onValueChange={(value) =>
                        handleClientFilterChange("stateOfResidence", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All States
                          </SelectItem>
                          {states.map((item) => (
                            <SelectItem
                              className="text-[12px]"
                              value={item?.value}
                              key={item.value}>
                              {item?.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">
                      LGA of Residence
                    </p>
                    <Select
                      value={clientFilter.lgaOfResidence}
                      onValueChange={(value) =>
                        handleClientFilterChange("lgaOfResidence", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All LGAs
                          </SelectItem>
                          {getSelectedStateLGAS(
                            clientFilter?.stateOfResidence
                          ).map((lga) => (
                            <SelectItem
                              className="text-[12px]"
                              value={lga}
                              key={lga}>
                              {lga}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={clearClientFilter}
                    variant="outline"
                    disabled={loading}>
                    Clear Filters
                    {loading ? (
                      <SewingPinFilledIcon className="animate-spin ml-2" />
                    ) : (
                      <Cross1Icon className="ml-2" />
                    )}
                  </Button>

                  {!csvData?.length ? (
                    <Button
                      onClick={downloadClientCSV}
                      variant="outline"
                      disabled={loadingCSV || !clients?.length}>
                      <Download className="mr-2 h-4 w-4" /> Generate CSV
                      {loadingCSV ? (
                        <SewingPinFilledIcon className="animate-spin ml-2" />
                      ) : null}
                    </Button>
                  ) : (
                    <CSVLink
                      data={csvData}
                      filename="clients-report.csv"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </CSVLink>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SN</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>State of Residence</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Date Registered</TableHead>
                    {/* <TableHead>Amount</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        <Spinner />
                      </TableCell>
                    </TableRow>
                  ) : clients.length > 0 ? (
                    clients.map((client, index) => (
                      <TableRow key={client._id}>
                        {/* <TableCell>
                          {index +
                            1 +
                            (clientFilter.page - 1) * clientFilter.limit}
                        </TableCell> */}
                        <TableCell>
                          {index + 1 + ((clientFilter?.currentPage || 1) - 1) * (clientFilter?.limit || 25)}
                        </TableCell>
                        <TableCell className="text-left max-w-[200px] text-[12px]">
                          {client.firstName} {client.lastName}
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phoneNumber}</TableCell>
                        <TableCell>{client.stateOfResidence}</TableCell>
                        <TableCell>{client.lgaOfResidence}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>
                          {new Date(client.createdAt).toLocaleDateString()}
                        </TableCell>
                        {/* <TableCell>
                          {(() => {
                            if ([
                              'completed',
                              'accepted',
                              'artisan-completed',
                              'artisan-rejected',
                              'client-rejected',
                            ].includes(client.status)) {
                              return client.agreedSum ? `₦${Number(client.agreedSum).toLocaleString()}` : 'N/A';
                            } else if (client.status === 'amount-proposed') {
                              return client.proposedSum ? `₦${Number(client.proposedSum).toLocaleString()} (Proposed)` : 'N/A';
                            } else {
                              return 'N/A';
                            }
                          })()}
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No clients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handleClientPageChange(Math.max(1, clientFilter.page - 1))
                    }
                    disabled={clientFilter.page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handleClientPageChange(1)}
                    isActive={clientFilter.page === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {clientPagination.currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = clientPagination.currentPage + i - 1;
                  return pageNumber > 1 &&
                    pageNumber < clientPagination.totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === clientPagination.currentPage}
                        onClick={() => handleClientPageChange(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                {clientPagination.currentPage <
                  clientPagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {clientPagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        handleClientPageChange(clientPagination.totalPages)
                      }
                      isActive={
                        clientFilter.page === clientPagination.totalPages
                      }>
                      {clientPagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handleClientPageChange(
                        Math.min(
                          clientPagination.totalPages,
                          clientFilter.page + 1
                        )
                      )
                    }
                    disabled={clientFilter.page === clientPagination.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Filters</CardTitle>
                <CardDescription>
                  Filter marketplace requests by various criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-[20px] flex-wrap mb-4">
                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Search</p>
                    <Input
                      className="text-[12px] placeholder:text-[12px]"
                      placeholder="Job title or client name"
                      value={requestSearchValue}
                      onChange={(e) => setRequestSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="w-[200px]">
                    <p className="text-left text-[14px] mb-1">Status</p>
                    <Select
                      value={requestFilter?.status}
                      onValueChange={(value) =>
                        handleRequestFilterChange("status", value)
                      }>
                      <SelectTrigger className="text-[12px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-[12px]" value="all">
                            All Statuses
                          </SelectItem>
                          <SelectItem className="text-[12px]" value="requested">Requested</SelectItem>
                          <SelectItem className="text-[12px]" value="amount-proposed">Amount Proposed</SelectItem>
                          <SelectItem className="text-[12px]" value="accepted">Accepted</SelectItem>
                          <SelectItem className="text-[12px]" value="artisan-started">Artisan Started</SelectItem>
                          <SelectItem className="text-[12px]" value="artisan-rejected">Artisan Rejected</SelectItem>
                          <SelectItem className="text-[12px]" value="client-rejected">Client Rejected</SelectItem>
                          <SelectItem className="text-[12px]" value="artisan-completed">Artisan Completed</SelectItem>
                          <SelectItem className="text-[12px]" value="completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={clearRequestFilter}
                    variant="outline"
                    disabled={loading}>
                    Clear Filters
                    {loading ? (
                      <SewingPinFilledIcon className="animate-spin ml-2" />
                    ) : (
                      <Cross1Icon className="ml-2" />
                    )}
                  </Button>

                  {!csvData?.length ? (
                    <Button
                      onClick={downloadRequestCSV}
                      variant="outline"
                      disabled={loadingCSV || !requests?.length}>
                      <Download className="mr-2 h-4 w-4" /> Generate CSV
                      {loadingCSV ? (
                        <SewingPinFilledIcon className="animate-spin ml-2" />
                      ) : null}
                    </Button>
                  ) : (
                    <CSVLink
                      data={csvData}
                      filename="requests-report.csv"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </CSVLink>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="font-medium">
                Total Requests Found: {requestPagination?.totalUsers || 0}
              </h2>
            </div>

            <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Job Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={request._id || index}>
                    <TableCell className="text-left text-[12px]">
                      {index +
                        1 +
                        (requestPagination.currentPage - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <div className="flex flex-col">
                        <span>{`${request.client?.firstName || ""} ${
                          request.client?.lastName || ""
                        }`}</span>
                        <span className="text-[10px] text-gray-500">
                          {request.client?.email || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <div className="flex flex-col">
                        <span>{`${request.artisan?.firstName || ""} ${
                          request.artisan?.lastName || ""
                        }`}</span>
                        <span className="text-[10px] text-gray-500">
                          {request.artisan?.email || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {request.jobTitle || "---"}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <div className="flex flex-col">
                        <span>{request.jobLocation?.state || "---"}</span>
                        <span className="text-[10px] text-gray-500">
                          {request.jobLocation?.lga || "---"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      <Badge className={getStatusBadgeColor(request.status)}>
                        {request.status || "---"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {request?.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : "---"}
                    </TableCell>
                    <TableCell className="text-left text-[12px]">
                      {(() => {
                        if ([
                          'completed',
                          'accepted',
                          'artisan-completed',
                          'artisan-rejected',
                          'client-rejected',
                        ].includes(request.status)) {
                          return request.agreedSum ? `₦${Number(request.agreedSum).toLocaleString()}` : 'N/A';
                        } else if (request.status === 'amount-proposed') {
                          return request.proposedSum ? `₦${Number(request.proposedSum).toLocaleString()} (Proposed)` : 'N/A';
                        } else {
                          return 'N/A';
                        }
                      })()}
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewItem(request)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Request Details</SheetTitle>
                            <SheetDescription>
                              View marketplace request information
                            </SheetDescription>
                          </SheetHeader>
                          {selectedItem && (
                            <Tabs defaultValue="job" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="job">Job</TabsTrigger>
                                <TabsTrigger value="client">Client</TabsTrigger>
                              </TabsList>
                              <TabsContent value="job">
                                {/* Job Information (reuse existing job info UI) */}
                                <div className="grid gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Job Information
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">Job Title:</p>
                                        <p>{selectedItem.jobTitle || "---"}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          Job Description:
                                        </p>
                                        <p className="whitespace-pre-wrap">
                                          {selectedItem.jobDescription || "---"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Status:</p>
                                        <Badge
                                          className={getStatusBadgeColor(
                                            selectedItem.status
                                          )}>
                                          {selectedItem.status || "---"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Job Location
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">State:</p>
                                        <p>
                                          {selectedItem.jobLocation?.state ||
                                            "---"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">LGA:</p>
                                        <p>
                                          {selectedItem.jobLocation?.lga || "---"}
                                        </p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="font-medium">Address:</p>
                                        <p>
                                          {selectedItem.jobLocation?.address ||
                                            "---"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Client Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">Name:</p>
                                        <p>{`${
                                          selectedItem.client?.firstName || ""
                                        } ${
                                          selectedItem.client?.lastName || ""
                                        }`}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Email:</p>
                                        <p>
                                          {selectedItem.client?.email || "---"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Phone:</p>
                                        <p>
                                          {selectedItem.client?.phoneNumber ||
                                            "---"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Artisan Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">Name:</p>
                                        <p>{`${
                                          selectedItem.artisan?.firstName || ""
                                        } ${
                                          selectedItem.artisan?.lastName || ""
                                        }`}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Email:</p>
                                        <p>
                                          {selectedItem.artisan?.email || "---"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Phone:</p>
                                        <p>
                                          {selectedItem.artisan?.phoneNumber ||
                                            "---"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedItem.artisanRejectionReason && (
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Rejection Reason
                                      </h4>
                                      <p className="text-sm text-red-600">
                                        {selectedItem.artisanRejectionReason}
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-medium mb-2">Timeline</h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">
                                          Request Date:
                                        </p>
                                        <p>
                                          {selectedItem.createdAt
                                            ? new Date(
                                                selectedItem.createdAt
                                              ).toLocaleString()
                                            : "---"}
                                        </p>
                                      </div>
                                      {selectedItem.acceptedOn && (
                                        <div>
                                          <p className="font-medium">
                                            Accepted On:
                                          </p>
                                          <p>
                                            {new Date(
                                              selectedItem.acceptedOn
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                      )}
                                      {selectedItem.rejectedOn && (
                                        <div>
                                          <p className="font-medium">
                                            Rejected On:
                                          </p>
                                          <p>
                                            {new Date(
                                              selectedItem.rejectedOn
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                      )}
                                      {selectedItem.completedOn && (
                                        <div>
                                          <p className="font-medium">
                                            Completed On:
                                          </p>
                                          <p>
                                            {new Date(
                                              selectedItem.completedOn
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* Action buttons based on status */}
                                {selectedItem.status === 'amount-proposed' && (
                                  <div className="w-full mt-4">
                                    <Label>Client Proposed Amount</Label>
                                    <p className="text-lg font-bold mb-4">
                                      ₦{Number(selectedItem?.proposedSum).toLocaleString()}
                                    </p>
                                    <div className="flex gap-4">
                                      <Button onClick={acceptAmount} disabled={modalLoading} className="bg-green-600">
                                        Accept Amount
                                      </Button>
                                      {confirmReject ? (
                                        <div className="flex-1">
                                          <Textarea
                                            value={artisanRejectionReason}
                                            onChange={(e) => setArtisanRejectionReason(e.target.value)}
                                            placeholder="Reason for rejecting amount"
                                            className="mb-2"
                                          />
                                          <Button
                                            onClick={rejectAmount}
                                            disabled={modalLoading || !artisanRejectionReason.trim()}
                                            className="bg-red-600 w-full"
                                          >
                                            Confirm Reject
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          onClick={() => setConfirmReject(true)}
                                          disabled={modalLoading}
                                          variant="outline"
                                          className="border-red-600 text-red-600"
                                        >
                                          Reject Amount
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {selectedItem.status === 'accepted' && (
                                  <Button
                                    onClick={startJob}
                                    disabled={modalLoading}
                                    className="bg-blue-600 mt-4"
                                  >
                                    {modalLoading ? <Spinner /> : "Confirm Job Start"}
                                  </Button>
                                )}
                                {(selectedItem.status === 'artisan-started' || selectedItem.status === 'artisan-completed') && (
                                  <Button
                                    onClick={completeJob}
                                    disabled={modalLoading || selectedItem.status === 'artisan-completed'}
                                    className="bg-green-600 mt-4"
                                  >
                                    {modalLoading ? <Spinner /> : "Mark Job as Completed"}
                                  </Button>
                                )}
                                {/* Admin: Approve/Reject Completion when status is artisan-completed */}
                                {selectedItem.status === 'artisan-completed' && (
                                  <div className="flex gap-4 mt-4">
                                    <Button
                                      onClick={() => setShowApproveDialog(true)}
                                      disabled={modalLoading}
                                      className="bg-green-700"
                                    >
                                      Approve Completion
                                    </Button>
                                    <Button
                                      onClick={() => setShowRejectDialog(true)}
                                      disabled={modalLoading}
                                      className="bg-red-700"
                                    >
                                      Reject Completion
                                    </Button>
                                  </div>
                                )}
                                {/* Approve dialog */}
                                {showApproveDialog && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    <div className="bg-white p-6 rounded shadow-lg">
                                      <p>Are you sure you want to approve this job as completed?</p>
                                      <div className="flex gap-4 mt-4">
                                        <Button onClick={approveCompletion} disabled={modalLoading} className="bg-green-700">Yes, Approve</Button>
                                        <Button onClick={() => setShowApproveDialog(false)} variant="outline">Cancel</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* Reject dialog */}
                                {showRejectDialog && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    <div className="bg-white p-6 rounded shadow-lg">
                                      <p>Please provide a reason for rejection:</p>
                                      <Textarea
                                        value={adminRejectReason}
                                        onChange={e => setAdminRejectReason(e.target.value)}
                                        className="mb-2 mt-2"
                                        placeholder="Reason for rejection"
                                      />
                                      <div className="flex gap-4 mt-2">
                                        <Button onClick={rejectCompletion} disabled={modalLoading || !adminRejectReason.trim()} className="bg-red-700">Reject</Button>
                                        <Button onClick={() => setShowRejectDialog(false)} variant="outline">Cancel</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                              <TabsContent value="client">
                                {/* Client Information (reuse existing client info UI) */}
                                <div className="grid gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Client Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="font-medium">Name:</p>
                                        <p>{`${
                                          selectedItem.client?.firstName || ""
                                        } ${
                                          selectedItem.client?.lastName || ""
                                        }`}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Email:</p>
                                        <p>
                                          {selectedItem.client?.email || "---"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Phone:</p>
                                        <p>
                                          {selectedItem.client?.phoneNumber ||
                                            "---"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                          <SheetFooter>
                            <SheetClose asChild>
                              <Button variant="secondary">Close</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handleRequestPageChange(
                        Math.max(1, requestPagination.currentPage - 1)
                      )
                    }
                    disabled={requestPagination.currentPage === 1}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    onClick={() => handleRequestPageChange(1)}
                    isActive={requestPagination.currentPage === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {requestPagination.currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = requestPagination.currentPage + i - 1;
                  return pageNumber > 1 &&
                    pageNumber < requestPagination.totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === requestPagination.currentPage}
                        onClick={() => handleRequestPageChange(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                {requestPagination.currentPage <
                  requestPagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {requestPagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        handleRequestPageChange(requestPagination.totalPages)
                      }
                      isActive={
                        requestPagination.currentPage ===
                        requestPagination.totalPages
                      }>
                      {requestPagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handleRequestPageChange(
                        Math.min(
                          requestPagination.totalPages,
                          requestPagination.currentPage + 1
                        )
                      )
                    }
                    disabled={
                      requestPagination.currentPage ===
                      requestPagination.totalPages
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default MarketplaceReport;
