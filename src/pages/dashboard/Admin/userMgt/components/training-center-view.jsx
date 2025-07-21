"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  UserIcon,
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  GraduationCapIcon,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { API_BASE_URL } from "@/config/env"

export function TrainingCenterView({ currentUser }) {
  const [trainees, setTrainees] = useState([])
  const [filteredTrainees, setFilteredTrainees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTrainee, setSelectedTrainee] = useState(null)
  const [showTraineeDetails, setShowTraineeDetails] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const [completionDate, setCompletionDate] = useState("")
  const [pendingAssignmentId, setPendingAssignmentId] = useState("")
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignForm, setAssignForm] = useState({
    trainingCenterId: "",
    trainingType: "foundation",
    year: new Date().getFullYear(),
    sector: "",
    tradeArea: "",
    notes: "",
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableTradeAreas, setAvailableTradeAreas] = useState([]);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [reassignLoading, setReassignLoading] = useState(false);

  // Fetch centers on mount
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/training-centers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAvailableCenters(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load training centers");
      }
    };
    fetchCenters();
  }, []);

  // Fetch sectors when center changes
  useEffect(() => {
    if (!assignForm.trainingCenterId) return;
    const center = availableCenters.find(c => c._id === assignForm.trainingCenterId);
    if (!center) return;
    setAvailableSectors(center.legalInfo?.tradeAreas?.map(ta => ta.sector).filter(Boolean) || []);
    setAssignForm(f => ({ ...f, sector: "", tradeArea: "" }));
  }, [assignForm.trainingCenterId, availableCenters]);

  // Fetch trade areas when sector changes
  useEffect(() => {
    if (!assignForm.trainingCenterId || !assignForm.sector) return;
    const center = availableCenters.find(c => c._id === assignForm.trainingCenterId);
    if (!center) return;
    setAvailableTradeAreas(center.legalInfo?.tradeAreas?.filter(ta => ta.sector === assignForm.sector) || []);
    setAssignForm(f => ({ ...f, tradeArea: "" }));
  }, [assignForm.trainingCenterId, assignForm.sector, availableCenters]);

  useEffect(() => {
    fetchAssignedTrainees()
  }, [currentUser])

  useEffect(() => {
    filterTrainees()
  }, [trainees, searchTerm, statusFilter])

  const fetchAssignedTrainees = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/training/training-centers/${currentUser._id}/trainees`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      setTrainees(response.data.data || [])
    } catch (error) {
      console.error("Error fetching trainees:", error)
      toast.error("Failed to load trainees data")
    } finally {
      setLoading(false)
    }
  }

  const filterTrainees = () => {
    let filtered = trainees

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (trainee) =>
          `${trainee.firstName} ${trainee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trainee.phoneNumber.includes(searchTerm),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((trainee) => {
        const activeAssignment = trainee.trainingAssignments?.find(
          (assignment) => assignment.currentAssignment?.status === statusFilter,
        )
        return !!activeAssignment
      })
    }

    setFilteredTrainees(filtered)
  }

  const getTraineeStatus = (trainee) => {
    const activeAssignment = trainee.trainingAssignments?.find(
      (assignment) => assignment.currentAssignment?.status === "active",
    )

    if (activeAssignment) return "active"

    const completedAssignment = trainee.trainingAssignments?.find(
      (assignment) => assignment.currentAssignment?.status === "completed",
    )

    if (completedAssignment) return "completed"

    return "inactive"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <ClockIcon className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircleIcon className="h-4 w-4 text-red-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUpdateAssignmentStatus = async (assignmentId, newStatus, notes = "", date = "") => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const payload = { status: newStatus }

      if (newStatus === "completed") {
        payload.completionNotes = notes
        payload.completionDate = date
      }

      const response = await axios.patch(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      if (response.data?.success) {
        toast.success("Assignment status updated successfully")
        fetchAssignedTrainees() // Refresh the data
      }
    } catch (error) {
      console.error("Error updating assignment status:", error)
      toast.error("Failed to update assignment status")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (assignmentId, newStatus) => {
    if (newStatus === "completed") {
      setPendingAssignmentId(assignmentId)
      setShowCompletionDialog(true)
    } else {
      handleUpdateAssignmentStatus(assignmentId, newStatus)
    }
  }

  const handleCompletionSubmit = async () => {
    if (!completionDate.trim() || !completionNotes.trim()) {
      toast.error("Please provide both completion date and notes")
      return
    }

    await handleUpdateAssignmentStatus(pendingAssignmentId, "completed", completionNotes, completionDate)
    setShowCompletionDialog(false)
    setCompletionNotes("")
    setCompletionDate("")
    setPendingAssignmentId("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Training Center Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your assigned trainees and track their progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trainees</p>
                <p className="text-2xl font-bold">{trainees.length}</p>
              </div>
              <GraduationCapIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Training</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trainees.filter((t) => getTraineeStatus(t) === "active").length}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {trainees.filter((t) => getTraineeStatus(t) === "completed").length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {trainees.length > 0
                    ? Math.round(
                        (trainees.filter((t) => getTraineeStatus(t) === "completed").length / trainees.length) * 100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <GraduationCapIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filter Trainees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Training</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trainees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Trainees</CardTitle>
          <CardDescription>Manage and track progress of trainees assigned to your center</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTrainees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Training Status</TableHead>
                    <TableHead>Sector/Trade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainees.map((trainee) => {
                    const status = getTraineeStatus(trainee)
                    const activeAssignment = trainee.trainingAssignments?.find(
                      (assignment) =>
                        assignment.currentAssignment?.status === "active" ||
                        assignment.currentAssignment?.status === "completed",
                    )

                    return (
                      <TableRow key={trainee._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {trainee.firstName} {trainee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">ID: {trainee._id.slice(-6)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{trainee.email}</div>
                            <div className="text-gray-500">{trainee.phoneNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{trainee.lga}</div>
                            <div className="text-gray-500">{trainee.stateOfResidence}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <Badge className={getStatusColor(status)}>{status.toUpperCase()}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {activeAssignment ? (
                            <div className="text-sm">
                              <div>{activeAssignment.currentAssignment?.sector}</div>
                              <div className="text-gray-500">{activeAssignment.currentAssignment?.tradeArea}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTrainee(trainee)
                                setShowTraineeDetails(true)
                              }}
                            >
                              View Details
                            </Button>
                            {activeAssignment && (
                              <Select
                                value={activeAssignment.currentAssignment?.status || "active"}
                                onValueChange={(value) => handleStatusChange(activeAssignment._id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {!activeAssignment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTrainee(trainee);
                                  setShowAssignDialog(true);
                                }}
                              >
                                Assign Training
                              </Button>
                            )}
                            {activeAssignment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTrainee(trainee);
                                  setAssignForm({
                                    trainingCenterId: activeAssignment.currentAssignment.trainingCenterId?._id || activeAssignment.currentAssignment.trainingCenterId || "",
                                    trainingType: activeAssignment.currentAssignment.trainingType || "foundation",
                                    year: activeAssignment.currentAssignment.year || new Date().getFullYear(),
                                    sector: activeAssignment.currentAssignment.sector || "",
                                    tradeArea: activeAssignment.currentAssignment.tradeArea || "",
                                    notes: activeAssignment.currentAssignment.notes || "",
                                    changeReason: "",
                                  });
                                  setShowReassignDialog(true);
                                }}
                              >
                                Reassign
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <GraduationCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No trainees found</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Trainees will appear here once assigned to your center"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trainee Details Dialog */}
      {showTraineeDetails && selectedTrainee && (
        <Dialog open={showTraineeDetails} onOpenChange={setShowTraineeDetails}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Trainee Details - {selectedTrainee.firstName} {selectedTrainee.lastName}
              </DialogTitle>
              <DialogDescription>Complete information and training history</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Name:</strong> {selectedTrainee.firstName} {selectedTrainee.lastName}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedTrainee.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedTrainee.phoneNumber}
                    </div>
                    <div>
                      <strong>State:</strong> {selectedTrainee.stateOfResidence}
                    </div>
                    <div>
                      <strong>LGA:</strong> {selectedTrainee.lga}
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTrainee.verifications && selectedTrainee.verifications.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTrainee.verifications.slice(0, 3).map((verification, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge className={getStatusColor(verification.status)}>{verification.status}</Badge>
                            <span className="text-sm">Year {verification.year}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No verification records</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Training History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Training History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTrainee.trainingAssignments && selectedTrainee.trainingAssignments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Training Type</TableHead>
                            <TableHead>Sector</TableHead>
                            <TableHead>Trade Area</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Completion Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTrainee.trainingAssignments.map((assignment, index) => (
                            <TableRow key={index}>
                              <TableCell>{assignment.currentAssignment?.trainingType}</TableCell>
                              <TableCell>{assignment.currentAssignment?.sector}</TableCell>
                              <TableCell>{assignment.currentAssignment?.tradeArea}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(assignment.currentAssignment?.status)}>
                                  {assignment.currentAssignment?.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{assignment.currentAssignment?.year}</TableCell>
                              <TableCell>
                                {assignment.currentAssignment?.completionDate
                                  ? new Date(assignment.currentAssignment.completionDate).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No training assignments found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Completion Dialog */}
      {showCompletionDialog && (
        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Training</DialogTitle>
              <DialogDescription>Please provide completion details for this trainee.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="completion-date">Completion Date</Label>
                <Input
                  id="completion-date"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completion-notes">Completion Notes</Label>
                <Textarea
                  id="completion-notes"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Enter completion notes, achievements, or remarks..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCompletionDialog(false)
                  setCompletionNotes("")
                  setCompletionDate("")
                  setPendingAssignmentId("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCompletionSubmit}>Complete Training</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Training Center</DialogTitle>
            <DialogDescription>
              Assign a training center to {selectedTrainee?.firstName} {selectedTrainee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Training Center *</Label>
              <Select
                value={assignForm.trainingCenterId}
                onValueChange={val => setAssignForm(f => ({ ...f, trainingCenterId: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select Training Center" /></SelectTrigger>
                <SelectContent>
                  {availableCenters.map(center => (
                    <SelectItem key={center._id} value={center._id}>{center.trainingCentreName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Training Type *</Label>
              <Select
                value={assignForm.trainingType}
                onValueChange={val => setAssignForm(f => ({ ...f, trainingType: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select training type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation Training</SelectItem>
                  <SelectItem value="initial">Initial Training</SelectItem>
                  <SelectItem value="futher">Further Training</SelectItem>
                  <SelectItem value="up_skilling">Up Skilling Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year *</Label>
              <Input
                type="number"
                value={assignForm.year}
                onChange={e => setAssignForm(f => ({ ...f, year: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Sector *</Label>
              <Select
                value={assignForm.sector}
                onValueChange={val => setAssignForm(f => ({ ...f, sector: val }))}
                disabled={!assignForm.trainingCenterId}
              >
                <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                <SelectContent>
                  {availableSectors.map(sec => (
                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trade Area *</Label>
              <Select
                value={assignForm.tradeArea}
                onValueChange={val => setAssignForm(f => ({ ...f, tradeArea: val }))}
                disabled={!assignForm.sector}
              >
                <SelectTrigger><SelectValue placeholder="Select trade area" /></SelectTrigger>
                <SelectContent>
                  {availableTradeAreas.map(ta => (
                    <SelectItem key={ta._id} value={ta._id}>{ta.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Notes</Label>
            <Textarea
              value={assignForm.notes}
              onChange={e => setAssignForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setAssignLoading(true);
                try {
                  const accessToken = localStorage.getItem("accessToken");
                  await axios.post(
                    `${API_BASE_URL}/training/users/${selectedTrainee._id}/assign`,
                    assignForm,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                  );
                  toast.success("Training assigned successfully");
                  setShowAssignDialog(false);
                  fetchAssignedTrainees();
                } catch (error) {
                  toast.error("Failed to assign training");
                } finally {
                  setAssignLoading(false);
                }
              }}
              disabled={assignLoading}
            >
              {assignLoading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reassign Training Center</DialogTitle>
            <DialogDescription>
              Reassign a training center for {selectedTrainee?.firstName} {selectedTrainee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Training Center *</Label>
              <Select
                value={assignForm.trainingCenterId}
                onValueChange={val => setAssignForm(f => ({ ...f, trainingCenterId: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select Training Center" /></SelectTrigger>
                <SelectContent>
                  {availableCenters.map(center => (
                    <SelectItem key={center._id} value={center._id}>{center.trainingCentreName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Training Type *</Label>
              <Select
                value={assignForm.trainingType}
                onValueChange={val => setAssignForm(f => ({ ...f, trainingType: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select training type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation Training</SelectItem>
                  <SelectItem value="initial">Initial Training</SelectItem>
                  <SelectItem value="futher">Further Training</SelectItem>
                  <SelectItem value="up_skilling">Up Skilling Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year *</Label>
              <Input
                type="number"
                value={assignForm.year}
                onChange={e => setAssignForm(f => ({ ...f, year: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Sector *</Label>
              <Select
                value={assignForm.sector}
                onValueChange={val => setAssignForm(f => ({ ...f, sector: val }))}
                disabled={!assignForm.trainingCenterId}
              >
                <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                <SelectContent>
                  {availableSectors.map(sec => (
                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trade Area *</Label>
              <Select
                value={assignForm.tradeArea}
                onValueChange={val => setAssignForm(f => ({ ...f, tradeArea: val }))}
                disabled={!assignForm.sector}
              >
                <SelectTrigger><SelectValue placeholder="Select trade area" /></SelectTrigger>
                <SelectContent>
                  {availableTradeAreas.map(ta => (
                    <SelectItem key={ta._id} value={ta._id}>{ta.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Reassignment *</Label>
              <Input
                value={assignForm.changeReason}
                onChange={e => setAssignForm(f => ({ ...f, changeReason: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Notes</Label>
            <Textarea
              value={assignForm.notes}
              onChange={e => setAssignForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setReassignLoading(true);
                try {
                  const accessToken = localStorage.getItem("accessToken");
                  await axios.patch(
                    `${API_BASE_URL}/training/training-assignments/${activeAssignment._id}/reassign`,
                    assignForm,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                  );
                  toast.success("Training reassigned successfully");
                  setShowReassignDialog(false);
                  fetchAssignedTrainees();
                } catch (error) {
                  toast.error("Failed to reassign training");
                } finally {
                  setReassignLoading(false);
                }
              }}
              disabled={reassignLoading}
            >
              {reassignLoading ? "Reassigning..." : "Reassign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AssignmentHistoryModal({ open, onOpenChange, assignmentId }) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open && assignmentId) {
      setLoading(true);
      const fetchHistory = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await axios.get(`${API_BASE_URL}/training/training-assignments/${assignmentId}/history`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setHistory(response.data?.data?.history || []);
        } catch (error) {
          toast.error("Failed to load assignment history");
          setHistory([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, assignmentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assignment History</DialogTitle>
          <DialogDescription>Full history of training assignments</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No assignment history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training Center</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Trade Area</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Change Reason</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Completion Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((assignment, idx) => {
                  let centerName = "";
                  if (typeof assignment.trainingCenterId === "object") {
                    centerName = assignment.trainingCenterId.trainingCentreName || assignment.trainingCenterId.name || "";
                  } else {
                    centerName = assignment.trainingCenterId || "";
                  }
                  return (
                    <TableRow key={assignment._id || idx}>
                      <TableCell>{centerName}</TableCell>
                      <TableCell>{assignment.trainingType}</TableCell>
                      <TableCell>{assignment.sector}</TableCell>
                      <TableCell>{assignment.tradeArea}</TableCell>
                      <TableCell>{assignment.year}</TableCell>
                      <TableCell>{assignment.status}</TableCell>
                      <TableCell>{assignment.assignedByName || "—"}</TableCell>
                      <TableCell>{assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : ""}</TableCell>
                      <TableCell>{assignment.notes || "—"}</TableCell>
                      <TableCell>{assignment.changeReason || "—"}</TableCell>
                      <TableCell>{assignment.status === "completed" && assignment.completionDate ? new Date(assignment.completionDate).toLocaleDateString() : "—"}</TableCell>
                      <TableCell>{assignment.status === "completed" ? (assignment.completionNotes || "—") : "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
