"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
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
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatStatus(status) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const emptyForm = {
  status: "",
  periodId: "",
  trainingCenterId: "",
  trainingCenterSearch: "",
  trainingCenterState: "",
  trainingCenterLga: "",
  year: "",
  trainingType: "",
  sector: "",
  tradeArea: "",
  dateFrom: "",
  dateTo: "",
  state: "",
  lga: "",
  userSearch: "", // For searching user by email, phone, name
  artisanState: "",
  artisanLga: "",
};

const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
    case 'completed':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
    case 'cancelled':
      return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
  }
};

const AssignmentReportsView = () => {
  const navigate = useNavigate();

  // History modal state
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyPagination, setHistoryPagination] = useState({
//     currentPage: 1,
//     totalPages: 0,
//     limit: 10
//   });

  const [loading, setLoading] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [tradeAreas, setTradeAreas] = useState([]);

  // History modal functions
  const openHistoryModal = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowHistoryModal(true);
    await fetchAssignmentHistory(assignment._id, 1);
  };

  const [states] = useState([
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
    "Yobe", "Zamfara"
  ]);
  const [lgas, setLgas] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [allData, setAllData] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    limit: 20,
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    limit: 50,
  });

  // Form State
  const [form, setForm] = useState({
    ...emptyForm,
  });

  // Fetch periods and training centers on component mount
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };

        const [periodsRes, centersRes, sectorsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/periods`, { headers }),
          axios.get(`${API_BASE_URL}/training-centers`, { headers }),
          axios.get(`${API_BASE_URL}/sectors`, { headers }),
        ]);

        // Debug logging
        console.log('Sectors response:', sectorsRes.data);

        // Ensure we're setting arrays
        const sectorsData = Array.isArray(sectorsRes.data) 
          ? sectorsRes.data 
          : Array.isArray(sectorsRes.data?.data) 
            ? sectorsRes.data.data 
            : [];

        setPeriods(Array.isArray(periodsRes.data) ? periodsRes.data : []);
        setTrainingCenters(Array.isArray(centersRes.data) ? centersRes.data : []);
        setFilteredCenters(Array.isArray(centersRes.data) ? centersRes.data : []);
        setSectors(sectorsData);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch reference data");
        setPeriods([]);
        setTrainingCenters([]);
        setFilteredCenters([]);
        setSectors([]);
      }
    };

    fetchData();
  }, []);

  // Update LGAs when state changes
  useEffect(() => {
    if (form.state) {
      // You would typically fetch LGAs for the selected state from an API
      // For now, using a placeholder
      setLgas(["Loading LGAs..."]);
      // Simulating API call
      setTimeout(() => {
        // Replace this with actual LGA data for the selected state
        setLgas(["LGA 1", "LGA 2", "LGA 3"]);
      }, 500);
    } else {
      setLgas([]);
    }
  }, [form.state]);

  // Update artisan LGAs when artisan state changes
  useEffect(() => {
    if (form.artisanState) {
      setLgas(["Loading LGAs..."]);
      setTimeout(() => {
        setLgas(["LGA 1", "LGA 2", "LGA 3"]);
      }, 500);
    }
  }, [form.artisanState]);

  // Filter training centers based on search
  useEffect(() => {
    if (form.trainingCenterSearch) {
      const filtered = trainingCenters.filter(center => 
        center.trainingCentreName.toLowerCase().includes(form.trainingCenterSearch.toLowerCase()) ||
        center.state.toLowerCase().includes(form.trainingCenterSearch.toLowerCase()) ||
        center.lga.toLowerCase().includes(form.trainingCenterSearch.toLowerCase())
      );
      setFilteredCenters(filtered);
    } else {
      setFilteredCenters(trainingCenters);
    }
  }, [form.trainingCenterSearch, trainingCenters]);

  // Update trade areas when sector changes
  useEffect(() => {
    if (form.sector) {
      const selectedSector = sectors.find(s => s._id === form.sector);
      setTradeAreas(selectedSector?.tradeAreas || []);
    } else {
      setTradeAreas([]);
    }
  }, [form.sector, sectors]);

  const fetchAssignments = async (filterParams, page = 1, limit = 50) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Build query parameters
      const params = new URLSearchParams();
      
      // Handle standard filters
      const standardFilters = ['status', 'periodId', 'trainingCenterId', 'year', 'trainingType', 'sector', 'tradeArea'];
      standardFilters.forEach(key => {
        if (filterParams[key]) params.append(key, filterParams[key].toString());
      });

      // Add training center location filters
      if (filterParams.trainingCenterState) params.append('trainingCenterState', filterParams.trainingCenterState);
      if (filterParams.trainingCenterLga) params.append('trainingCenterLga', filterParams.trainingCenterLga);

      // Handle date range
      if (filterParams.dateFrom || filterParams.dateTo) {
        if (filterParams.dateFrom) params.append('dateFrom', filterParams.dateFrom);
        if (filterParams.dateTo) params.append('dateTo', filterParams.dateTo);
      }

      // Handle artisan location filters
      if (filterParams.artisanState) params.append('artisanState', filterParams.artisanState);
      if (filterParams.artisanLga) params.append('artisanLga', filterParams.artisanLga);

      // Handle user search
      if (filterParams.userSearch) params.append('userSearch', filterParams.userSearch);

      // Add pagination parameters
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await axios.get(
        `${API_BASE_URL}/reports/assignments?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { data, pagination: serverPagination } = response.data;
      setAssignments(data || []);
      setPagination(prev => ({
        ...prev,
        ...serverPagination,
        currentPage: page,
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const downloadAllData = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      // Build query with all filters but large limit
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(form)) {
        if (value) params.append(key, value.toString());
      }
      params.append("limit", "1000000");

      const response = await axios.get(
        `${API_BASE_URL}/reports/assignments?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.data?.length) {
        const processedData = response.data.data.map(assignment => ({
          "Assignment ID": assignment._id,
          "Trainee Name": `${assignment.userId.firstName} ${assignment.userId.lastName}`,
          "Phone Number": assignment.userId.phoneNumber,
          "Training Center": assignment.currentAssignment.trainingCenterId.trainingCentreName,
          "Training Type": assignment.currentAssignment.trainingType,
          "Sector": assignment.currentAssignment.sector,
          "Trade Area": assignment.currentAssignment.tradeArea,
          "Status": formatStatus(assignment.currentAssignment.status),
          "Period": assignment.currentAssignment.periodId.name,
          "Year": assignment.currentAssignment.year,
          "Assigned By": `${assignment.currentAssignment.assignedBy.firstName} ${assignment.currentAssignment.assignedBy.lastName}`,
          "Assigned Date": formatDate(assignment.currentAssignment.assignedDate),
        }));

        setCsvData([
          Object.keys(processedData[0]),
          ...processedData.map(Object.values),
        ]);
        setAllData(true);
        toast.success("CSV data generated successfully");
      } else {
        toast.error("No data available to download");
      }
    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Failed to generate CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Training Assignment Reports", 35, 15);

    const headers = [
      "ID",
      "Trainee",
      "Center",
      "Type",
      "Sector/Trade",
      "Status",
      "Period",
      "Assigned By",
      "Date",
    ];

    const data = assignments.map(assignment => [
      assignment._id,
      `${assignment.userId.firstName} ${assignment.userId.lastName}`,
      assignment.currentAssignment.trainingCenterId.trainingCentreName,
      assignment.currentAssignment.trainingType,
      `${assignment.currentAssignment.sector} - ${assignment.currentAssignment.tradeArea}`,
      formatStatus(assignment.currentAssignment.status),
      assignment.currentAssignment.periodId.name,
      `${assignment.currentAssignment.assignedBy.firstName} ${assignment.currentAssignment.assignedBy.lastName}`,
      formatDate(assignment.currentAssignment.assignedDate),
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save("Assignment_Reports.pdf");
  };

  // Event Handlers
  const onChangeInput = (id, value) => {
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const search = () => {
    fetchAssignments(form);
    setAllData(false);
  };

  const clear = () => {
    setForm({ ...emptyForm });
    setAssignments([]);
    setCsvData([]);
    setAllData(false);
    setPagination({
      currentPage: 1,
      totalPages: 0,
      total: 0,
      limit: 50,
    });
  };

  const showAll = () => {
    setForm({ ...emptyForm });
    fetchAssignments(emptyForm);
    setAllData(false);
  };

  const handlePageChange = (page) => {
    fetchAssignments(form, page, pagination.limit);
  };

  const fetchAssignmentHistory = async (assignmentId, page = 1) => {
    setHistoryLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/reports/assignments/${assignmentId}/history?page=${page}&limit=${historyPagination.limit}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { data, pagination: serverPagination } = response.data;
      setAssignmentHistory(data || []);
      setHistoryPagination(prev => ({
        ...prev,
        ...serverPagination,
        currentPage: page,
      }));
    } catch (error) {
      console.error("Error fetching assignment history:", error);
      toast.error("Failed to fetch assignment history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewHistory = (assignment) => {
    setSelectedAssignment(assignment);
    setShowHistoryModal(true);
    fetchAssignmentHistory(assignment._id);
  };

  const handleHistoryPageChange = (page) => {
    if (selectedAssignment) {
      fetchAssignmentHistory(selectedAssignment._id, page);
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedAssignment(null);
    setAssignmentHistory([]);
    setHistoryPagination({
      currentPage: 1,
      totalPages: 0,
      total: 0,
      limit: 20,
    });
  };

  const logout = useLogout();

  return (
    <ProtectedRoute>
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
      <div className="container mx-auto py-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">TRAINING REPORTS</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              <UserCircle className="mr-2 h-4 w-4" /> Profile
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-[20px] flex-wrap">
            {/* Status Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Status</p>
              <Select
                value={form.status}
                onValueChange={(value) => onChangeInput("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Training Period Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Training Period</p>
              <Select
                value={form.periodId}
                onValueChange={(value) => onChangeInput("periodId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {periods.map(period => (
                      <SelectItem key={period._id} value={period._id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Training Center State */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Training Center State</p>
              <Select
                value={form.trainingCenterState}
                onValueChange={(value) => onChangeInput("trainingCenterState", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Training Center LGA */}
            {form.trainingCenterState && (
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Training Center LGA</p>
                <Select
                  value={form.trainingCenterLga}
                  onValueChange={(value) => onChangeInput("trainingCenterLga", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {lgas.map(lga => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Training Center Search */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Training Center Search</p>
              <Input
                type="text"
                value={form.trainingCenterSearch}
                onChange={(e) => onChangeInput("trainingCenterSearch", e.target.value)}
                placeholder="Search centers..."
              />
            </div>

            {/* Training Center Selection */}
            {filteredCenters.length > 0 && (
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Select Center</p>
                <Select
                  value={form.trainingCenterId}
                  onValueChange={(value) => onChangeInput("trainingCenterId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filteredCenters.map(center => (
                        <SelectItem key={center._id} value={center._id}>
                          {center.trainingCentreName}
                          <span className="text-sm text-gray-500 ml-1">
                            ({center.state}, {center.lga})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* User Search */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Search Artisan</p>
              <Input
                type="text"
                value={form.userSearch}
                onChange={(e) => onChangeInput("userSearch", e.target.value)}
                placeholder="Email, Phone, Name..."
              />
            </div>

            {/* Artisan State */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Artisan State</p>
              <Select
                value={form.artisanState}
                onValueChange={(value) => onChangeInput("artisanState", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Artisan LGA */}
            {form.artisanState && (
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Artisan LGA</p>
                <Select
                  value={form.artisanLga}
                  onValueChange={(value) => onChangeInput("artisanLga", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {lgas.map(lga => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Year Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Year</p>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => onChangeInput("year", e.target.value)}
                placeholder="Enter Year"
                min="2020"
                max="2030"
              />
            </div>

            {/* Training Type */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Training Type</p>
              <Select
                value={form.trainingType}
                onValueChange={(value) => onChangeInput("trainingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Sector Filter */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Sector</p>
              <Select
                value={form.sector}
                onValueChange={(value) => onChangeInput("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.isArray(sectors) && sectors.map(sector => (
                      <SelectItem key={sector._id} value={sector._id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Trade Area Filter */}
            {form.sector && (
              <div className="w-[200px]">
                <p className="text-left text-[14px] mb-1">Trade Area</p>
                <Select
                  value={form.tradeArea}
                  onValueChange={(value) => onChangeInput("tradeArea", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trade Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tradeAreas.map(area => (
                        <SelectItem key={area._id} value={area._id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Filters */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date From</p>
              <Input
                type="date"
                value={form.dateFrom}
                onChange={(e) => onChangeInput("dateFrom", e.target.value)}
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date To</p>
              <Input
                type="date"
                value={form.dateTo}
                onChange={(e) => onChangeInput("dateTo", e.target.value)}
              />
            </div>

            <Button
              className="bg-emerald-700 mt-auto"
              onClick={search}
              disabled={loading}>
              {loading ? <SewingPinFilledIcon className="animate-spin" /> : "Search"}
            </Button>

            <Button
              className="bg-red-500 text-white mt-auto hover:bg-gray-300"
              onClick={clear}
              disabled={loading}>
              Clear <Cross1Icon />
            </Button>

            <Button
              className="bg-slate-500 text-white mt-auto hover:bg-gray-300"
              onClick={showAll}
              disabled={loading}>
              Show All <DashboardIcon />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {/* Download Buttons */}
          <div className="w-full flex justify-end gap-2 mb-3">
            {assignments?.length > 0 && (
              <>
                {!allData ? (
                  <Button className="mt-auto" onClick={downloadAllData} disabled={loadingCSV}>
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
                    filename="Assignment_Reports.csv"
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

          {/* Assignments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-medium">SN</TableHead>
                  {/* <TableHead className="font-medium">Assignment ID</TableHead> */}
                  <TableHead className="font-medium">Trainee Details</TableHead>
                  <TableHead className="font-medium">Training Center</TableHead>
                  <TableHead className="font-medium">Training Type</TableHead>
                  <TableHead className="font-medium">Sector/Trade Area</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Period</TableHead>
                  <TableHead className="font-medium">Assigned By</TableHead>
                  <TableHead className="font-medium">Assigned Date</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <TableRow key={assignment._id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        {index + 1 + (pagination.currentPage - 1) * pagination.limit}
                      </TableCell>
                      {/* <TableCell>{assignment._id}</TableCell> */}
                      <TableCell>
                        <div className="text-sm text-gray-800">
                          {assignment.userId.firstName} {assignment.userId.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {assignment.userId.phoneNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {assignment.userId.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-800">
                          {assignment.currentAssignment.trainingCenterId.trainingCentreName}
                        </div>
                      </TableCell>
                      <TableCell>{assignment.currentAssignment.trainingType}</TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-800">{assignment.currentAssignment.sector}</div>
                        <div className="text-xs text-gray-500">
                          {assignment.currentAssignment.tradeArea}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        {formatStatus(assignment.currentAssignment.status)}
                      </TableCell> */}
                      <TableCell>
                        <span className={getStatusStyle(assignment.currentAssignment.status)}>
                          {formatStatus(assignment.currentAssignment.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">{assignment.currentAssignment.periodId.name}</div>
                        <div className="text-xs text-gray-500">
                          {assignment.currentAssignment.year}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">{assignment.currentAssignment.assignedBy.firstName} {assignment.currentAssignment.assignedBy.lastName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">{assignment.currentAssignment?.assignedAt ? 
                          new Date(assignment.currentAssignment.assignedAt).toLocaleDateString() : 
                          "N/A"
                        }</div>
                      </TableCell>
                      {/* <TableCell>
                        {assignment.currentAssignment?.assignedAt ? 
                          new Date(assignment.currentAssignment.assignedAt).toLocaleDateString() : 
                          "N/A"
                        }
                      </TableCell> */}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewHistory(assignment)}
                        >
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      No assignments found. Try adjusting your filters.
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
                      onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
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
                        isActive={pagination.currentPage === pagination.totalPages}>
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.totalPages, pagination.currentPage + 1)
                        )
                      }
                      disabled={pagination.currentPage === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-sm text-gray-500 mt-2">
                Page {pagination.currentPage} of {pagination.totalPages} | Total{" "}
                {pagination.total} assignments
              </div>
            </div>
          )}
        </div>

        {/* Assignment History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <AlertDialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Assignment History</AlertDialogTitle>
                  <AlertDialogDescription>
                    View the complete history of changes for this assignment
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {historyLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="font-semibold">Current Assignment Details</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Trainee</p>
                          <p>{selectedAssignment?.userId.firstName} {selectedAssignment?.userId.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Training Center</p>
                          <p>{selectedAssignment?.currentAssignment.trainingCenterId.trainingCentreName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p>{formatStatus(selectedAssignment?.currentAssignment.status)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Period</p>
                          <p>{selectedAssignment?.currentAssignment.periodId.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date Changed</TableHead>
                            <TableHead>Training Center</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Changed By</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignmentHistory.length > 0 ? (
                            assignmentHistory.map((history, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(history.changedAt)}</TableCell>
                                <TableCell>{history.trainingCenterId.trainingCentreName}</TableCell>
                                <TableCell>{formatStatus(history.status)}</TableCell>
                                <TableCell>
                                  {history.assignedBy.firstName} {history.assignedBy.lastName}
                                </TableCell>
                                <TableCell>{history.notes || '-'}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                No history records found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {historyPagination.totalPages > 0 && (
                      <div className="mt-4 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => handleHistoryPageChange(
                                  Math.max(1, historyPagination.currentPage - 1)
                                )}
                                disabled={historyPagination.currentPage === 1}
                              />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink isActive={true}>
                                {historyPagination.currentPage} of {historyPagination.totalPages}
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => handleHistoryPageChange(
                                  Math.min(historyPagination.totalPages, historyPagination.currentPage + 1)
                                )}
                                disabled={historyPagination.currentPage === historyPagination.totalPages}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AssignmentReportsView;
