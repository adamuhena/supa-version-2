import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/config/env";
import { CSVLink } from "react-csv";
import { Download, Edit, LogOut, Mail, PhoneCall, UserCircle, Eye, Save, Trash2, Plus, X } from "lucide-react";
import { states } from "@/data/nigeria";
import TrainingCenterForm from "./TrainingCenterForm";
// import { Plus, X, } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from "@/pages/loginPage/logout";
import { useNavigate } from "react-router-dom";

export default function TrainingCenterMgt() {
  const logout = useLogout();
  const navigate = useNavigate();
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    currentAssessmentStatus: "",
    fromDate: "",
    toDate: "",
    currentPage: 1,
    pageSize: 25 // default page size
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCenters: 0,
    pageSize: 25
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);

  const fetchTrainingCenters = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      
      // Build query parameters
      const params = {
        page: filter.currentPage,
        limit: filter.pageSize,
        ...(filter.search && { search: filter.search }),
        ...(filter.state && filter.state !== "all" && { state: filter.state }),
        ...(filter.lga && filter.lga !== "all" && { lga: filter.lga }),
        ...(filter.sector && filter.sector !== "all" && { sector: filter.sector }),
        ...(filter.tradeArea && filter.tradeArea !== "all" && { tradeArea: filter.tradeArea }),
        ...(filter.currentAssessmentStatus && filter.currentAssessmentStatus !== "all" && { 
          assessmentStatus: filter.currentAssessmentStatus 
        }),
        ...(filter.fromDate && { dateFrom: filter.fromDate }),
        ...(filter.toDate && { dateTo: filter.toDate })
      };

      // Log params for debugging
      console.log('Fetching with params:', params);

      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        params,
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.data?.success) {
        // Update training centers data
        setTrainingCenters(response.data.data || []);
        
        // Update pagination state
        setPagination({
          currentPage: parseInt(response.data.pagination.page) || 1,
          totalPages: parseInt(response.data.pagination.totalPages) || 1,
          totalCenters: parseInt(response.data.pagination.total) || 0,
          pageSize: parseInt(response.data.pagination.limit) || 25
        });

        // Log pagination info for debugging
        console.log('Pagination updated:', {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total,
          pageSize: response.data.pagination.limit
        });
      } else {
        toast.error("Failed to fetch training centers: No data received");
      }
    } catch (error) {
      console.error("Error fetching training centers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch training centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingCenters();
  }, [filter]);

  const handleFilterChange = (key, value) => {
    setFilter(prev => {
      const newFilter = { ...prev };
      
      switch (key) {
        case "state":
          newFilter.state = value;
          newFilter.lga = "";
          break;
          
        default:
          newFilter[key] = value;
      }
      
      newFilter.currentPage = 1;
      return newFilter;
    });
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/training-centers/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      toast.success("Training center deleted successfully");
      fetchTrainingCenters();
    } catch (error) {
      console.error("Error deleting training center:", error);
      toast.error("Failed to delete training center");
    }
  };

  const handleCreate = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(`${API_BASE_URL}/training-centers/register`, data, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      toast.success("Training center created successfully");
      fetchTrainingCenters();
    } catch (error) {
      console.error("Error creating training center:", error);
      toast.error("Failed to create training center");
    }
  };

  const handleEdit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch(`${API_BASE_URL}/training-centers/${editingCenter._id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      toast.success("Training center updated successfully");
      fetchTrainingCenters();
      setEditingCenter(null);
    } catch (error) {
      console.error("Error updating training center:", error);
      toast.error("Failed to update training center");
    }
  };

  const handlePasswordChange = async (centerId, { currentPassword, newPassword }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `${API_BASE_URL}/update-tc-u-password/${centerId}`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
      throw error;
    }
  };

  const handlePageChange = (page) => {
    setFilter(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handlePageSizeChange = (size) => {
    setFilter(prev => ({
      ...prev,
      pageSize: parseInt(size),
      currentPage: 1 // Reset to first page when changing page size
    }));
  };

  return (
    <ProtectedRoute>
    <div className="container mx-auto py-6">
      <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Training Center</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/biodata")}>
                    <UserCircle className="mr-2 h-4 w-4" /> Update Profile
                  </Button>
      
                  <Button variant="destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </header>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Search by name or email"
            value={filter.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-[200px]"
          />

          <Select
            value={filter.state}
            onValueChange={(value) => handleFilterChange("state", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.currentAssessmentStatus}
            onValueChange={(value) => handleFilterChange("currentAssessmentStatus", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Assessment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filter.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="w-[200px]"
          />

          <Input
            type="date"
            value={filter.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* <h1 className="text-2xl font-bold">Training Centers</h1> */}
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Center
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>State/LGA</TableHead>
            <TableHead>Assessment Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainingCenters.map((center, index) => (
            <TableRow key={center._id}>
              <TableCell>{index + 1 + (pagination.currentPage - 1) * pagination.pageSize}</TableCell>
              <TableCell>{center.trainingCentreName}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{center.contactPerson}</span>
                  <span>{center.email}</span>
                  <span>{center.phoneNumber}</span>
                </div>
              </TableCell>
              <TableCell>
                <span>{center.state} </span>
                <span>{center.lga}</span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  center.currentAssessmentStatus === "approved" 
                    ? "bg-green-100 text-green-800"
                    : center.currentAssessmentStatus === "denied"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}>
                  {center.currentAssessmentStatus}
                </span>
              </TableCell>
              <TableCell>
                {new Date(center.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingCenter(center);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(center._id)}
                    disabled= {true}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            value={filter.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            Showing {((pagination.currentPage - 1) * filter.pageSize) + 1} to{" "}
            {Math.min(pagination.currentPage * filter.pageSize, pagination.totalCenters)} of{" "}
            {pagination.totalCenters} entries
          </span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              />
            </PaginationItem>
            
            {/* First page */}
            {pagination.currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis */}
            {pagination.currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Current page and siblings */}
            {Array.from({ length: 3 }, (_, i) => pagination.currentPage + (i - 1))
              .filter(page => page > 0 && page <= pagination.totalPages)
              .map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === pagination.currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {/* Ellipsis */}
            {pagination.currentPage < pagination.totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {pagination.currentPage < pagination.totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(pagination.totalPages)}>
                  {pagination.totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <TrainingCenterForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCenter(null);
        }}
        initialData={editingCenter}
        onSubmit={editingCenter ? handleEdit : handleCreate}
        onPasswordChange={handlePasswordChange}
      />
    </div>
    </ProtectedRoute>
  );
}