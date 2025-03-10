
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/layout/spinner";
import { states } from "@/data/nigeria";
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
import jsPDF from "jspdf";
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
import {
  Cross1Icon,
  DashboardIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import useLogout from "@/pages/loginPage/logout";
import { LogOut, UserCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/env";

const TrainingCenterReport = () => {
  const logout = useLogout();
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 25;
  // const [loading, setLoading] = useState(false);
  // const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  // const [filter, setFilter] = useState({
  //   stateOfResidence: "",
  //   localGovernment: "",
  //   senatorialDistrict: "",
  //   sector: "",
  //   tradeArea: "",
  // });

  // // Fetch training center reports
  // const fetchReports = async () => {
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const response = await axios.get(
  //       `${API_BASE_URL}/trainingcenter/report`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setReports(response?.data?.data || []);
  //     setFilteredReports(response?.data?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching reports:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const itemsPerPage = 25;

  const [filter, setFilter] = useState({
    state: "",
    lga: "",
    areaOffice: "",
    sector: "",
    ownership: "",
    trainingNature: "",
    itfRegistered: "",
    amenities: {
      portableWater: "",
      observeBreak: ""
    },
    establishmentDate: "",
    contactPerson: "",
    role: "",
    email: "",
    phoneNumber: "",
    assessment: "",
    legalInfo: "",
    verificationDocuments: ""
  });

  // Add pagination state handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    // Update fetch function to use currentPage
  // const fetchReports = async () => {
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const response = await axios.get(
  //       `${API_BASE_URL}/trainingcenter/report`, {
  //         params: {
  //           page: currentPage,
  //           limit: itemsPerPage,
  //           filterParams: filter // Send filter as filterParams
  //         },
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         }
  //       }
  //     );

  //     const { data, pagination } = response.data;
      
  //     // Update states with response data
  //     setReports(data);
  //     setTotalPages(pagination.totalPages);
  //     setLoading(false);

  //   } catch (error) {
  //     console.error("Error fetching reports:", error);
  //     setLoading(false);
  //   }
  // };
  const fetchReports = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/trainingcenter/report`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            filterParams: filter,
            sort: '-createdAt' // Add sort parameter
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
  
      const { data, pagination } = response.data;
      setReports(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports();
  }, [currentPage, filter]); // Re-fetch when page or filters change

  const emptyForm = {
    stateOfResidence: "",
    lgaOfResidence: "",
    stateOfOrigin: "",
    lga: "",
    gender: "",
    hasDisability: "",
    role: "",
  };

  // useEffect(() => {
  //   fetchReports();
  // }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, reports]);

  const [form, setForm] = useState({
    ...emptyForm,
  });

  function replaceSymbolsWithSpace(str = "") {
    let replacedStr = str.replace(/[-/]/g, " ");
    return replacedStr.toLowerCase();
  }

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

  const applyFilter = () => {
    let filtered = reports;
    if (filter.stateOfResidence) {
      filtered = filtered.filter(
        (center) =>
          center.state &&
          center.state.toLowerCase() === filter.state.toLowerCase()
      );
    }
    if (filter.localGovernment) {
      filtered = filtered.filter(
        (center) =>
          center.lga &&
          center.lga.toLowerCase() ===
            filter.localGovernment.toLowerCase()
      );
    }
    if (filter.senatorialDistrict) {
      filtered = filtered.filter(
        (center) =>
          center.senatorialDistrict &&
          center.senatorialDistrict.toLowerCase() ===
            filter.senatorialDistrict.toLowerCase()
      );
    }
    if (filter.sector) {
      filtered = filtered.filter(
        (center) =>
          center.sector &&
          center.sector.toLowerCase() === filter.sector.toLowerCase()
      );
    }
    if (filter.tradeArea) {
      filtered = filtered.filter(
        (center) =>
          center.tradeArea &&
          center.tradeArea.toLowerCase() === filter.tradeArea.toLowerCase()
      );
    }
    setFilteredReports(filtered);
  };

  const clearFilter = () => {
    setFilter({
      stateOfResidence: "",
      localGovernment: "",
      senatorialDistrict: "",
      sector: "",
      tradeArea: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Memoized CSV Data
  const csvData = useMemo(() => {
    if (!reports.length) return [];
    const headers = [
      "S/N",
      "Training Center",
      "Address",
      "State",
      "Local Government",
      "Senatorial District",
      "Sector",
      "Trade Area",
      "Phone",
      "Email",
    ];
    const rows = reports.map(
      (
        {
          
          trainingCentreName,
          address,
          state,
          lga,
          senatorialDistrict,
          sector,
          tradeArea,
          phoneNumber,
          email,
        },
        index
      ) => [
        index + 1,
        trainingCentreName || "",
        address || "",
        state || "",
        lga || "",
        senatorialDistrict || "",
        sector || "",
        tradeArea || "",
        phoneNumber || "",
        email || "",
      ]
    );
    return [headers, ...rows];
  }, [reports]);

  // Generate PDF
  const generatePDF = () => {
    if (!reports.length) return;
    const doc = new jsPDF();
    const headers = [
      "S/N",
      "Training Center",
      "Address",
      "State",
      "Local Government",
      "Senatorial District",
      "Sector",
      "Trade Area",
      "Phone",
      "Email",
    ];
    const data = reports.map(
      (
        {
          trainingCentreName,
          address,
          state,
          lga,
          senatorialDistrict,
          sector,
          tradeArea,
          phoneNumber,
          email,
        },
        index
      ) => [
        index + 1,
        trainingCentreName || "",
        address || "",
        state || "",
        lga || "",
        senatorialDistrict || "",
        sector || "",
        tradeArea || "",
        phoneNumber || "",
        email || "",
      ]
    );
    doc.setFontSize(16);
    doc.text("Training Center Report", 20, 20);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });
    doc.save("Training_Center_Report.pdf");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardPage title="Training Center Report">
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Center Reports</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className=" gap-2 flex flex-row-reverse pr-40">
            <CSVLink
              data={csvData}
              filename="training_center_report.csv"
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${
                !reports.length ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(event) => !reports.length && event.preventDefault()}>
              Download CSV
            </CSVLink>
            <Button onClick={generatePDF} disabled={!reports.length}>
              Download PDF
            </Button>
          </div>

          <div className="flex gap-[20px] flex-wrap mb-6">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State</p>
              <Select
                value={filter?.stateOfResidence}
                onValueChange={(value) =>
                  handleFilterChange("stateOfResidence", value)
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
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
              <p className="text-left text-[14px] mb-1">Local Government</p>
              <Select
                value={filter.localGovernment}
                onValueChange={(value) =>
                  handleFilterChange("lgaOfResidence", value)
                }>
                <SelectTrigger>
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
              <p className="text-left text-[14px] mb-1">Senatorial District</p>
              <Select
                value={filter.senatorialDistrict}
                onValueChange={(value) =>
                  handleFilterChange("senatorialDistrict", value)
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Lagos Central">Lagos Central</SelectItem>
                    <SelectItem value="Lagos East">Lagos East</SelectItem>
                    <SelectItem value="Lagos West">Lagos West</SelectItem>
                    {/* Add more senatorial districts as needed */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Sector</p>
              <Select
                value={filter.sector}
                onValueChange={(value) => handleFilterChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    {/* Add more sectors as needed */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Trade Area</p>
              <Select
                value={filter.tradeArea}
                onValueChange={(value) =>
                  handleFilterChange("tradeArea", value)
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select Trade Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    {/* Add more trade areas as needed */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-emerald-700 mt-auto hover:bg-emerald-400"
              onClick={applyFilter}
              disabled={loading}>
              {loading ? (
                <SewingPinFilledIcon className="animate-spin" />
              ) : (
                "Apply Filter"
              )}
            </Button>

            <Button
              className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
              onClick={clearFilter}
              disabled={loading}>
              Clear <Cross1Icon />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Training Center</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Local Government</TableHead>
                <TableHead>Senatorial District</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Trade Area</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((center, index) => (
                <TableRow key={center._id || index}>
                  <TableCell>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{center.trainingCentreName || ""}</TableCell>
                  <TableCell>{center.address || ""}</TableCell>
                  <TableCell>{center.state || ""}</TableCell>
                  <TableCell>{center.lga || ""}</TableCell>
                  <TableCell>{center.senatorialDistrict || ""}</TableCell>
                  <TableCell>{center.sector || ""}</TableCell>
                  <TableCell>{center.tradeArea || ""}</TableCell>
                  <TableCell>{center.phoneNumber || ""}</TableCell>
                  <TableCell>{center.email || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
      </PaginationItem>

      {/* First Page */}
      <PaginationItem>
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>

      {/* Ellipsis after first */}
      {currentPage > 3 && (
        <PaginationItem>
          <PaginationLink disabled>...</PaginationLink>
        </PaginationItem>
      )}

      {/* Middle Pages */}
      {Array.from({ length: 3 }, (_, i) => {
        const pageNumber = currentPage + i - 1;
        return pageNumber > 1 && pageNumber < totalPages ? (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ) : null;
      })}

      {/* Ellipsis before last */}
      {currentPage < (totalPages - 2) && (
        <PaginationItem>
          <PaginationLink disabled>...</PaginationLink>
        </PaginationItem>
      )}

      {/* Last Page */}
      {totalPages > 1 && (
        <PaginationItem>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )}

      <PaginationItem>
        <PaginationNext
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default TrainingCenterReport;
