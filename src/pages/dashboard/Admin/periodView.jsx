"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"; // or 'next/navigation'
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardPage from "@/components/layout/DashboardLayout"
import useLogout from "@/pages/loginPage/logout";
import { LogOut, UserCircle, PlusCircle, RefreshCw, Edit, Trash2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Switch } from "@/components/ui/switch"; // or your UI lib

export default function PeriodView() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    status: "pending"
  });
  const [suspensionReason, setSuspensionReason] = useState("");
  const [resumeStatus, setResumeStatus] = useState("approved");

  useEffect(() => {
    fetchPeriods();
    fetchCurrentPeriod();
  }, []);

  // Get access token from localStorage
  const accessToken = localStorage.getItem("accessToken");

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/periods`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPeriods(response.data);
    } catch (error) {
      toast.error("Failed to fetch periods");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPeriod = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/periods/current`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setCurrentPeriod(response.data);
    } catch (error) {
      console.error("Error fetching current period:", error);
    }
  };

//   const handleCreatePeriod = async () => {
//     try {
//       await axios.post(`${API_BASE_URL}/periods`, formData, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });
//       toast({
//         title: "Success",
//         description: "Period created successfully",
//       });
//       setIsCreateDialogOpen(false);
//       await Promise.allSettled([fetchPeriods(), fetchCurrentPeriod()]);
//       setFormData({
//         name: "",
//         year: new Date().getFullYear(),
//         status: "pending"
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to create period",
//         variant: "destructive",
//       });
//     }
//   };

const handleCreatePeriod = async () => {
    try {
      console.log("Creating period with:", formData);
      const response = await axios.post(`${API_BASE_URL}/periods`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log("Creation response:", response.data);
      
      toast.success("Period created successfully");
      
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        year: new Date().getFullYear(),
        status: "pending"
      });
      
      // Refresh data
      await Promise.all([fetchPeriods(), fetchCurrentPeriod()]);
      
    } catch (error) {
      console.error("Create period error:", error);
      toast.error(error.response?.data?.message || "Failed to create period");
    }
  };

  const handleUpdatePeriod = async () => {
    try {
      await axios.put(`${API_BASE_URL}/periods/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Period updated successfully");
      setIsEditDialogOpen(false);
      fetchPeriods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update period");
    }
  };

  const handleSuspendPeriod = async (periodId) => {
    try {
      await axios.post(`${API_BASE_URL}/periods/${periodId}/suspend`, { 
        reason: suspensionReason 
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Period suspended successfully");
      setIsSuspendDialogOpen(false);
      setSuspensionReason("");
      fetchPeriods();
      fetchCurrentPeriod();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to suspend period");
    }
  };

  const handleResumePeriod = async (periodId) => {
    try {
      await axios.post(`${API_BASE_URL}/periods/${periodId}/resume`, { 
        targetStatus: resumeStatus 
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Period resumed successfully");
      setIsResumeDialogOpen(false);
      setResumeStatus("approved");
      fetchPeriods();
      fetchCurrentPeriod();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resume period");
    }
  };

  const handleDeletePeriod = async (periodId) => {
    try {
      await axios.delete(`${API_BASE_URL}/periods/${periodId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Period deleted successfully");
      fetchPeriods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete period");
    }
  };

  const handleAdmissionLetterToggle = async (periodId, enabled) => {
    await axios.patch(`${API_BASE_URL}/periods/${periodId}/admission-letter`, { enabled }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    // Optionally refetch periods or update state
  };

  const openEditDialog = (period) => {
    setFormData(period);
    setIsEditDialogOpen(true);
  };

  const openSuspendDialog = (period) => {
    setFormData(period);
    setIsSuspendDialogOpen(true);
  };

  const openResumeDialog = (period) => {
    setFormData(period);
    setIsResumeDialogOpen(true);
  };

  const statusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      started: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      ended: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <ErrorBoundary>
      <ProtectedRoute href="/admin/dashboard">  
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Period Management</h1>
              {/* <p className="text-gray-600 mt-2">
                {currentPeriod && (
                  <>Current Period: <strong>{currentPeriod.name}</strong> ({currentPeriod.year}) - {statusBadge(currentPeriod.status)}</>
                )}
              </p> */}
              <p className="text-gray-600 mt-2">
                  {currentPeriod ? (
                      <>Current Period: <strong>{currentPeriod.name}</strong> ({currentPeriod.year}) - {statusBadge(currentPeriod.status)}</>
                  ) : (
                      "No current period set"
                  )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Account
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Periods</h2>
            <div className="flex gap-2">
              <Button onClick={() => fetchPeriods()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Period
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Period</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="year" className="text-right">
                        Year
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreatePeriod}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all periods in the system.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(periods) && periods.length > 0 ? (
                  [...periods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((period) => (
                    <TableRow key={period._id}>
                      <TableCell>{period.name}</TableCell>
                      <TableCell>{period.year}</TableCell>
                      <TableCell>{statusBadge(period.status)}</TableCell>
                      <TableCell>{period.createdAt ? new Date(period.createdAt).toLocaleString() : "-"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(period)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {period.status === "suspended" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openResumeDialog(period)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          period.status !== "ended" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openSuspendDialog(period)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePeriod(period._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={period.admissionLetterEnabled}
                          onCheckedChange={enabled => handleAdmissionLetterToggle(period._id, enabled)}
                        />
                        {period.admissionLetterEnabledBy && (
                          <span className="text-xs text-gray-500 ml-2">
                            by {period.admissionLetterEnabledBy.firstName} {period.admissionLetterEnabledBy.lastName} at {new Date(period.admissionLetterEnabledAt).toLocaleString()}
                          </span>
                        )}
                        {period.admissionLetterChangeHistory && period.admissionLetterChangeHistory.length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-gray-600">Admission Letter Switch History</summary>
                            <ul className="pl-4 text-xs text-gray-500">
                              {period.admissionLetterChangeHistory
                                .slice() // copy array
                                .reverse() // show most recent first
                                .map((entry, idx) => (
                                <li key={idx}>
                                  <span className={entry.enabled ? 'text-green-600' : 'text-red-600'}>
                                    {entry.enabled ? "Enabled" : "Disabled"}
                                  </span>
                                  {" by "}
                                  {entry.changedBy
                                    ? `${entry.changedBy.firstName} ${entry.changedBy.lastName}`
                                    : "Unknown"}
                                  {" at "}
                                  {new Date(entry.changedAt).toLocaleString()}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No periods found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Period</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-year" className="text-right">
                    Year
                  </Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="started">Started</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdatePeriod}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Suspend Dialog */}
          <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend Period</DialogTitle>
                <DialogDescription>
                  Are you sure you want to suspend {formData.name} ({formData.year})?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Input
                    id="reason"
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter reason for suspension"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={() => handleSuspendPeriod(formData._id)}>
                  Confirm Suspend
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Resume Dialog */}
          <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resume Period</DialogTitle>
                <DialogDescription>
                  Resume {formData.name} ({formData.year})?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resume-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={resumeStatus}
                    onValueChange={(value) => setResumeStatus(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="started">Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleResumePeriod(formData._id)}>
                  Confirm Resume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  )
}