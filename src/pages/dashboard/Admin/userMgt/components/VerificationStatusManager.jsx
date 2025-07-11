"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Plus,
  HouseIcon,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/*
// --- TrainingAssignment Status Update Controller ---
import { Request, Response, NextFunction } from "express";
import { TrainingAssignment } from "../models/TrainingAssignment";

// PATCH /training/training-assignments/:id/status
export const updateAssignmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.id;
    const { status, completionNotes, completionDate } = req.body;
    const allowedStatuses = ["active", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const assignment = await TrainingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Log the previous assignment in history before changing
    assignment.assignmentHistory.push({
      ...assignment.currentAssignment.toObject(),
      changedAt: new Date(),
      status: status, // log the new status in history
    });

    // Update the current assignment status (and completion fields if needed)
    assignment.currentAssignment.status = status;
    if (status === "completed") {
      assignment.currentAssignment.completionDate = completionDate
        ? new Date(completionDate)
        : new Date();
      if (completionNotes) {
        assignment.currentAssignment.completionNotes = completionNotes;
      }
    } else {
      // Clear completion fields if not completed
      assignment.currentAssignment.completionDate = undefined;
      assignment.currentAssignment.completionNotes = undefined;
    }
    await assignment.save();

    await assignment.populate("userId", "firstName lastName email phoneNumber");
    await assignment.populate("currentAssignment.trainingCenterId", "trainingCentreName email phoneNumber");
    await assignment.populate("currentAssignment.assignedBy", "firstName lastName email");

    return res.json({
      success: true,
      message: "Assignment status updated successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};
// --- End TrainingAssignment Status Update Controller ---
*/

export function VerificationStatusManager({
  user,
  onVerificationUpdate,
  currentUser,
}) {
  const [isAddingVerification, setIsAddingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newVerification, setNewVerification] = useState({
    year: new Date().getFullYear(),
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    expirationDate: "",
  });
  const [verifierNames, setVerifierNames] = useState({});
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [isAssigningTraining, setIsAssigningTraining] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState(null);
  const [sectorsList, setSectorsList] = useState([]);
  const [sectorTradeAreas, setSectorTradeAreas] = useState([]);
  const [allSectors, setAllSectors] = useState([]);
  const [centerSectors, setCenterSectors] = useState([]);
  const [centerTradeAreas, setCenterTradeAreas] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedTradeArea, setSelectedTradeArea] = useState("");
  const [currentVerificationId, setCurrentVerificationId] = useState(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [pendingAssignmentId, setPendingAssignmentId] = useState(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");

  // Helper to reset form state
  const resetAssignForm = () => {
    setIsAssigningTraining(false);
    setCurrentAssignment(null);
    setCurrentVerificationId(null);
    setTrainingAssignment({
      trainingCenterId: "",
      trainingType: "foundation",
      year: new Date().getFullYear(),
      sector: "",
      tradeArea: "",
      notes: "",
      changeReason: "",
    });
    setSelectedTrainingCenter(null);
    setSelectedSector("");
    setSelectedTradeArea("");
    setCenterSectors([]);
    setCenterTradeAreas([]);
  };

  const [trainingAssignment, setTrainingAssignment] = useState({
    trainingCenterId: "",
    trainingType: "foundation",
    year: new Date().getFullYear(),
    sector: "",
    tradeArea: "",
    notes: "",
    changeReason: "",
  });

  useEffect(() => {
    // Fetch verifier names
    const ids = Array.from(
      new Set(
        (user.verifications || []).map((v) => v.verifiedBy).filter(Boolean)
      )
    );

    const fetchNames = async () => {
      const names = {};
      for (const id of ids) {
        if (!verifierNames[id]) {
          const accessToken = localStorage.getItem("accessToken");
          try {
            const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = res.data.data;
            const fullName = `${user.firstName || ""} ${
              user.lastName || ""
            }`.trim();
            names[id] = fullName ? fullName : user.email;
          } catch (error) {
            console.error(`Failed to fetch verifier info for ID ${id}:`, error);
            names[id] = "Unknown User";
          }
        }
      }
      setVerifierNames((prev) => ({ ...prev, ...names }));
    };

    if (ids.length) fetchNames();
  }, [user.verifications]);

  useEffect(() => {
    // Fetch training centers in user's state when needed
    if (user.stateOfResidence) {
      fetchTrainingCenters();
    }
  }, [user.stateOfResidence]);

  const fetchTrainingCenters = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        params: {
          state: user.stateOfResidence,
          currentAssessmentStatus: "approved",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTrainingCenters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching training centers:", error);
      toast.error("Failed to load training centers");
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sectors`)
      .then((res) => setAllSectors(res.data.data || []));
  }, []);

  useEffect(() => {
    if (isAssigningTraining) {
      axios
        .get(`${API_BASE_URL}/sectors`)
        .then((res) => setSectorsList(res.data.data || []))
        .catch(() => setSectorsList([]));
    }
  }, [isAssigningTraining]);

  // When a training center is selected:
  const handleTrainingCenterChange = (id) => {
    const center = trainingCenters.find((tc) => tc._id === id);
    setSelectedTrainingCenter(center);
    setTrainingAssignment((prev) => ({
      ...prev,
      trainingCenterId: id,
    }));

    // Extract unique sector IDs from the center's tradeAreas
    const sectorIds = Array.from(
      new Set(
        (center.legalInfo?.tradeAreas || [])
          .map((ta) => ta.sector?.toString() || ta.sector)
          .filter(Boolean)
      )
    );

    // Map sector IDs to sector objects (with names)
    const sectors = allSectors.filter((sec) => sectorIds.includes(sec._id));
    setCenterSectors(sectors); // Now an array of sector objects

    setSelectedSector("");
    setSelectedTradeArea("");
    setCenterTradeAreas([]);
  };

  // When a sector is selected, extract trade areas for that sector
  const handleSectorChange = (sectorId) => {
    setSelectedSector(sectorId);
    const sectorObj = allSectors.find((sec) => sec._id === sectorId);
    setTrainingAssignment((prev) => ({
      ...prev,
      sector: sectorId,
    }));
    setSelectedTradeArea("");
    setCenterTradeAreas(sectorObj?.tradeAreas || []);
  };

  const fetchAssignmentHistory = async (assignmentId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/history`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Ensure we have the current assignment in history
      const history = response.data?.data?.history || [];

      // If we have a current assignment, make sure it's included
      if (
        currentAssignment &&
        !history.some((a) => a._id === currentAssignment._id)
      ) {
        history.unshift(currentAssignment);
      }

      setAssignmentHistory(history);
    } catch (error) {
      console.error("Error fetching assignment history:", error);
      toast.error("Failed to load assignment history");

      // Fallback to showing just the current assignment if available
      if (currentAssignment) {
        setAssignmentHistory([currentAssignment]);
      } else {
        setAssignmentHistory([]);
      }
    }
  };

  // const handleAddVerification = async () => {
  //   if (!newVerification.year || !newVerification.status) {
  //     toast.error("Please fill in all required fields")
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")
  //     const verificationData = {
  //       newVerification: {
  //         ...newVerification,
  //         verifiedBy: currentUser?.id || currentUser?._id,
  //         verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
  //         date: new Date().toISOString(),
  //       },
  //     }

  //     const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
  //       headers: { Authorization: `Bearer ${accessToken}` }
  //     })

  //     if (response.data?.success) {
  //       toast.success("Verification record added successfully")
  //       onVerificationUpdate(response.data.data)
  //       setIsAddingVerification(false)
  //       setNewVerification({
  //         year: new Date().getFullYear(),
  //         status: "pending",
  //         date: new Date().toISOString().split("T")[0],
  //         notes: "",
  //         expirationDate: "",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error adding verification:", error)
  //     toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  //   const handleAddVerification = async () => {
  //   if (!newVerification.year || !newVerification.status) {
  //     toast.error("Please fill in all required fields")
  //     return
  //   }

  //   let expirationDate = newVerification.expirationDate;
  //   if (
  //     newVerification.status === "approved" &&
  //     !expirationDate
  //   ) {
  //     const today = new Date();
  //     const nextYear = new Date(today);
  //     nextYear.setFullYear(today.getFullYear() + 1);
  //     expirationDate = nextYear.toISOString().split("T")[0];
  //   }

  //   setLoading(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")
  //     const verificationData = {
  //       newVerification: {
  //         ...newVerification,
  //         expirationDate, // always send a value if approved
  //         verifiedBy: currentUser?.id || currentUser?._id,
  //         verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
  //         date: new Date().toISOString(),
  //       },
  //     }

  //     const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
  //       headers: { Authorization: `Bearer ${accessToken}` }
  //     })

  //     if (response.data?.success) {
  //       toast.success("Verification record added successfully")
  //       onVerificationUpdate(response.data.data)
  //       setIsAddingVerification(false)
  //       setNewVerification({
  //         year: new Date().getFullYear(),
  //         status: "pending",
  //         date: new Date().toISOString().split("T")[0],
  //         notes: "",
  //         expirationDate: "",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error adding verification:", error)
  //     toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleAddVerification = async () => {
  //   if (!newVerification.year || !newVerification.status) {
  //     toast.error("Please fill in all required fields")
  //     return
  //   }

  //   // Check for previous approved verification with expirationDate in the future
  //   const previousActive = (user.verifications || []).find(v =>
  //     v.status === "approved" &&
  //     v.expirationDate &&
  //     new Date(v.expirationDate) > new Date()
  //   );
  //   if (previousActive) {
  //     toast.error("A previous approved verification has not yet expired. You cannot add a new one until it does.");
  //     return;
  //   }

  //   let expirationDate = newVerification.expirationDate;
  //   if (
  //     newVerification.status === "approved" &&
  //     !expirationDate
  //   ) {
  //     const today = new Date();
  //     const nextYear = new Date(today);
  //     nextYear.setFullYear(today.getFullYear() + 1);
  //     expirationDate = nextYear.toISOString().split("T")[0];
  //   }

  //   setLoading(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")
  //     const verificationData = {
  //       newVerification: {
  //         ...newVerification,
  //         expirationDate, // always send a value if approved
  //         verifiedBy: currentUser?.id || currentUser?._id,
  //         verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
  //         date: new Date().toISOString(),
  //       },
  //     }

  //     const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
  //       headers: { Authorization: `Bearer ${accessToken}` }
  //     })

  //     if (response.data?.success) {
  //       toast.success("Verification record added successfully")
  //       onVerificationUpdate(response.data.data)
  //       setIsAddingVerification(false)
  //       setNewVerification({
  //         year: new Date().getFullYear(),
  //         status: "pending",
  //         date: new Date().toISOString().split("T")[0],
  //         notes: "",
  //         expirationDate: "",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error adding verification:", error)
  //     toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleAddVerification = async () => {
    if (
      !newVerification.year ||
      !newVerification.status ||
      !newVerification.notes.trim()
    ) {
      toast.error("Please fill in all required fields, including notes");
      return;
    }

    // Only allow adding if status is pending, denied, or (approved and no active approved verification exists)
    if (newVerification.status === "approved") {
      // Check for previous approved verification with expirationDate in the future
      const previousActive = (user.verifications || []).find(
        (v) =>
          v.status === "approved" &&
          v.expirationDate &&
          new Date(v.expirationDate) > new Date()
      );
      if (previousActive) {
        toast.error(
          "A previous approved verification has not yet expired. You cannot add a new one until it does."
        );
        return;
      }
    } else if (
      newVerification.status !== "pending" &&
      newVerification.status !== "denied"
    ) {
      toast.error(
        "You can only add a verification with status 'pending', 'denied', or 'approved'."
      );
      return;
    }

    let expirationDate = newVerification.expirationDate;
    // if (newVerification.status === "approved" && !expirationDate) {
    //   const today = new Date();
    //   const nextYear = new Date(today);
    //   nextYear.setFullYear(today.getFullYear() + 1);
    //   expirationDate = nextYear.toISOString().split("T")[0];
    // }
    if (newVerification.status === "approved" && !expirationDate) {
      // Set expiration to December 31 of the selected year
      const year = newVerification.year || new Date().getFullYear();
      const dec31 = new Date(year, 11, 31); // Month is 0-indexed, so 11 = December
      expirationDate = dec31.toISOString().split("T")[0];
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const verificationData = {
        newVerification: {
          ...newVerification,
          expirationDate, // always send a value if approved
          verifiedBy: currentUser?.id || currentUser?._id,
          verifierName:
            `${currentUser?.firstName || ""} ${
              currentUser?.lastName || ""
            }`.trim() || currentUser?.email,
          date: new Date().toISOString(),
        },
      };

      const response = await axios.patch(
        `${API_BASE_URL}/users/${user._id}`,
        verificationData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data?.success) {
        toast.success("Verification record added successfully");
        onVerificationUpdate(response.data.data);
        setIsAddingVerification(false);
        setNewVerification({
          year: new Date().getFullYear(),
          status: "pending",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          expirationDate: "",
        });
      }
    } catch (error) {
      console.error("Error adding verification:", error);
      toast.error(
        "Failed to add verification: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateVerification = async (verificationId, updatedData) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}`,
        {
          ...updatedData,
          verifiedBy: currentUser?.id || currentUser?._id,
          verifierName:
            `${currentUser?.firstName || ""} ${
              currentUser?.lastName || ""
            }`.trim() || currentUser?.email,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data?.success) {
        toast.success("Verification updated successfully");
        onVerificationUpdate(response.data.data);
      }
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error(
        "Failed to update verification: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTraining = async () => {
    if (!currentVerificationId) {
      toast.error("No verification selected for assignment");
      return;
    }
    if (
      !trainingAssignment.trainingCenterId ||
      !trainingAssignment.sector ||
      !trainingAssignment.tradeArea
    ) {
      toast.error("Please select a training center, sector, and trade area");
      return;
    }
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const sectorObj = allSectors.find(
        (sec) => sec._id === trainingAssignment.sector
      );
      const tradeAreaObj = sectorObj?.tradeAreas.find(
        (ta) => ta._id === trainingAssignment.tradeArea
      );
      const payload = {
        trainingCenterId: trainingAssignment.trainingCenterId,
        trainingType: trainingAssignment.trainingType,
        year: trainingAssignment.year,
        sector: sectorObj?.name || "",
        tradeArea: tradeAreaObj?.name || "",
        notes: trainingAssignment.notes,
        changeReason: trainingAssignment.changeReason,
      };
      const response = await axios.post(
        `${API_BASE_URL}/training/users/${user._id}/verifications/${currentVerificationId}/assign`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data?.success) {
        toast.success("Training center assigned successfully");
        const updatedUser = await fetchUpdatedUser(user._id);
        onVerificationUpdate(updatedUser);
        resetAssignForm();
      }
    } catch (error) {
      toast.error(
        "Failed to assign training: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReassignTraining = async (assignmentId) => {
    if (
      !trainingAssignment.trainingCenterId ||
      !trainingAssignment.changeReason
    ) {
      toast.error(
        "Please select a training center and provide a reason for reassignment"
      );
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Get the sector and trade area names from their IDs
      const sectorObj = allSectors.find(
        (sec) => sec._id === trainingAssignment.sector
      );
      const tradeAreaObj = sectorObj?.tradeAreas?.find(
        (ta) => ta._id === trainingAssignment.tradeArea
      );

      const payload = {
        trainingCenterId: trainingAssignment.trainingCenterId,
        trainingType: trainingAssignment.trainingType,
        year: trainingAssignment.year,
        sector: sectorObj?.name || trainingAssignment.sector,
        tradeArea: tradeAreaObj?.name || trainingAssignment.tradeArea,
        notes: trainingAssignment.notes,
        changeReason: trainingAssignment.changeReason,
        assignedBy: currentUser?.id || currentUser?._id,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/reassign`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data?.success) {
        toast.success("Training reassigned successfully");
        const updatedUser = await fetchUpdatedUser(user._id);
        onVerificationUpdate(updatedUser);
        resetAssignForm();

        // Refresh the assignment history if viewing history
        if (showHistory) {
          fetchAssignmentHistory(assignmentId);
        }
      }
    } catch (error) {
      console.error("Error reassigning training:", error);
      toast.error(
        "Failed to reassign training: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const hasValidAssignment = (verification) => {
    if (!verification.trainingAssignment) return false;

    // If it's a string, check if it's not empty
    if (typeof verification.trainingAssignment === "string") {
      return verification.trainingAssignment.trim() !== "";
    }

    // If it's an object, check if it has required fields
    if (typeof verification.trainingAssignment === "object") {
      return (
        !!verification.trainingAssignment._id &&
        !!verification.trainingAssignment.trainingCenterId
      );
    }

    return false;
  };

  const fetchUpdatedUser = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case "denied":
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
    }
  };
  
  const handleUpdateAssignmentStatus = async (
    assignmentId,
    newStatus,
    completionNotes = "",
    completionDate = ""
  ) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const payload = { status: newStatus };
      if (newStatus === "completed") {
        payload.completionNotes = completionNotes;
        payload.completionDate = completionDate;
      }
      const response = await axios.patch(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data?.success) {
        toast.success("Assignment status updated successfully");
        const updatedUser = await fetchUpdatedUser(user._id);
        onVerificationUpdate(updatedUser);
      }
    } catch (error) {
      toast.error(
        "Failed to update assignment status: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "denied":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const sortedVerifications = (user.verifications || []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [showVerificationHistory, setShowVerificationHistory] = useState(false);
  const [historyVerification, setHistoryVerification] = useState(null);

  // Handler for Show History button
  const handleShowHistory = (verification) => {
    console.log("verification", verification);
    setHistoryVerification(verification);
    setShowVerificationHistory(true);
  };

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(user.currentVerificationStatus)}
            Current Verification Status
          </CardTitle>
          <CardDescription>
            Latest verification status for {user.firstName} {user.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(user.currentVerificationStatus)}>
              {user.currentVerificationStatus?.toUpperCase() || "PENDING"}
            </Badge>
            <Button
              onClick={() => setIsAddingVerification(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Verification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Verification Form */}
      {isAddingVerification && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Verification Record</CardTitle>
            <CardDescription>
              Create a new verification record for this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="verification-year">Verification Year *</Label>
                <Input
                  id="verification-year"
                  type="number"
                  min="2020"
                  max={new Date().getFullYear() + 1}
                  value={newVerification.year || ""}
                  onChange={(e) =>
                    setNewVerification((prev) => ({
                      ...prev,
                      year: Number.parseInt(e.target.value),
                    }))
                  }
                  disabled
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="verification-year">Verification Date *</Label>
                <Input
                  id="verification-year"
                  type="text"
                  value={new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                  readOnly
                  disabled
                />
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor="verification-status">Status *</Label>
                <Select
                  value={newVerification.status}
                  onValueChange={(value) => setNewVerification(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="verification-status">Status *</Label>
                <Select
                  value={newVerification.status}
                  onValueChange={(value) =>
                    setNewVerification((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newVerification.status === "approved" && (
                <div className="space-y-2">
                  <Label htmlFor="verification-expiry">Expiration Date *</Label>
                  {/* <Input
                    id="verification-expiry"
                    type="date"
                    value={newVerification.expirationDate || ""}
                    onFocus={() => {
                      if (!newVerification.expirationDate) {
                        const today = new Date();
                        const nextYear = new Date(today);
                        nextYear.setFullYear(today.getFullYear() + 1);
                        const formatted = nextYear.toISOString().split("T")[0];
                        setNewVerification(prev => ({
                          ...prev,
                          expirationDate: formatted,
                        }));
                      }
                    }}
                    onChange={(e) => setNewVerification(prev => ({
                      ...prev,
                      expirationDate: e.target.value,
                    }))}
                  /> */}
                  <Input
                    id="verification-expiry"
                    type="date"
                    value={newVerification.expirationDate || ""}
                    onFocus={() => {
                      if (!newVerification.expirationDate) {
                        // Set to December 31 of the current year
                        const year =
                          newVerification.year || new Date().getFullYear();
                        const dec31 = new Date(year, 11, 31); // Month is 0-indexed, so 11 = December
                        const formatted = dec31.toISOString().split("T")[0];
                        setNewVerification((prev) => ({
                          ...prev,
                          expirationDate: formatted,
                        }));
                      }
                    }}
                    onChange={(e) =>
                      setNewVerification((prev) => ({
                        ...prev,
                        expirationDate: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {/* <div className="space-y-2">
                <Label htmlFor="verification-expiry">Expiration Date (Optional)</Label>
                <Input
                  id="verification-expiry"
                  type="date"
                  value={newVerification.expirationDate || ""}
                  onChange={(e) => setNewVerification(prev => ({
                    ...prev,
                    expirationDate: e.target.value,
                  }))}
                />
              </div> */}
              {/* <div className="space-y-2">
                <Label htmlFor="verification-expiry">Expiration Date * </Label>
                <Input
                  id="verification-expiry"
                  type="date"
                  value={newVerification.expirationDate || ""}
                  onFocus={() => {
                    // If not already set, set to one year from today
                    if (!newVerification.expirationDate) {
                      const today = new Date();
                      const nextYear = new Date(today);
                      nextYear.setFullYear(today.getFullYear() + 1);
                      // Format as yyyy-mm-dd
                      const formatted = nextYear.toISOString().split("T")[0];
                      setNewVerification(prev => ({
                        ...prev,
                        expirationDate: formatted,
                      }));
                    }
                  }}
                  onChange={(e) => setNewVerification(prev => ({
                    ...prev,
                    expirationDate: e.target.value,
                  }))}
                />
              </div> */}

              <div className="space-y-2">
                <Label>Verified By</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {`${currentUser?.firstName || ""} ${
                      currentUser?.lastName || ""
                    }`.trim() || currentUser?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-notes"> Notes / Comments * </Label>
              <Textarea
                id="verification-notes"
                placeholder="Add any additional notes about this verification..."
                value={newVerification.notes || ""}
                onChange={(e) =>
                  setNewVerification((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingVerification(false);
                  setNewVerification({
                    year: new Date().getFullYear(),
                    status: "pending",
                    date: new Date().toISOString().split("T")[0],
                    notes: "",
                    expirationDate: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddVerification} disabled={loading}>
                {loading ? "Adding..." : "Add Verification"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Center Assignment Form */}
      {isAssigningTraining && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Training Center</CardTitle>
            <CardDescription>
              Assign {user.firstName} {user.lastName} to a training center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="training-center">Training Center *</Label>
                <Select
                  value={selectedTrainingCenter?._id || ""}
                  onValueChange={handleTrainingCenterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Training Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingCenters.map((center) => (
                      <SelectItem key={center._id} value={center._id}>
                        {center.trainingCentreName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTrainingCenter && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div>
                      <strong>LGA:</strong> {selectedTrainingCenter.lga}
                    </div>
                    <div>
                      <strong>Address:</strong> {selectedTrainingCenter.address}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="training-type">Training Type *</Label>
                <Select
                  value={trainingAssignment.trainingType}
                  onValueChange={(value) =>
                    setTrainingAssignment((prev) => ({
                      ...prev,
                      trainingType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select training type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">
                      Foundation Training
                    </SelectItem>
                    <SelectItem value="initial">Initial Training</SelectItem>
                    <SelectItem value="futher">
                      Further Training
                    </SelectItem>
                    <SelectItem value="up_skilling">Up Skilling Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="training-year">Year *</Label>
                <Input
                  id="training-year"
                  type="number"
                  value={trainingAssignment.year}
                  onChange={(e) =>
                    setTrainingAssignment((prev) => ({
                      ...prev,
                      year: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="training-sector">Sector *</Label>
                <Select
                  value={selectedSector}
                  onValueChange={handleSectorChange}
                  disabled={!selectedTrainingCenter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {centerSectors.map((sec) => (
                      <SelectItem key={sec._id} value={sec._id}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trade-area">Trade Area *</Label>
                <Select
                  value={selectedTradeArea}
                  onValueChange={(id) => {
                    setSelectedTradeArea(id);
                    setTrainingAssignment((prev) => ({
                      ...prev,
                      tradeArea: id,
                    }));
                  }}
                  disabled={!selectedSector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade area" />
                  </SelectTrigger>
                  <SelectContent>
                    {centerTradeAreas.map((ta) => (
                      <SelectItem key={ta._id} value={ta._id}>
                        {ta.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentAssignment && (
                <div className="space-y-2">
                  <Label htmlFor="change-reason">
                    Reason for Reassignment *
                  </Label>
                  <Input
                    id="change-reason"
                    value={trainingAssignment.changeReason}
                    onChange={(e) =>
                      setTrainingAssignment((prev) => ({
                        ...prev,
                        changeReason: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-notes">Notes</Label>
              <Textarea
                id="training-notes"
                placeholder="Additional notes about this assignment..."
                value={trainingAssignment.notes}
                onChange={(e) =>
                  setTrainingAssignment((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetAssignForm}>
                Cancel
              </Button>
              <Button
                // onClick={() => currentAssignment ?
                //   handleReassignTraining(currentAssignment._id) :
                //   handleAssignTraining()
                // }

                onClick={() => handleAssignTraining()}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : currentAssignment
                  ? "Reassign"
                  : "Assign"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment History Modal */}
      {showHistory && currentAssignment && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment History</CardTitle>
            <CardDescription>
              History of training assignments for {user.firstName}{" "}
              {user.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <Table>{/* Table content as shown above */}</Table>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowHistory(false)}>Close</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Verification History
          </CardTitle>
          <CardDescription>
            Complete history of verification records for this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedVerifications.length > 0 ? (
            <div className="space-y-4">
              {sortedVerifications.map((verification, index) => {
                const shouldReassignTraining = verification?.trainingAssignment
                  ?.length
                  ? true
                  : false;
                const activeAssignment = (
                  verification?.trainingAssignment || []
                )?.find(
                  (assignment) =>
                    assignment?.currentAssignment?.status === "active"
                )?.currentAssignment;
                // Get active training center name
                let assignedTo = "";

                if (typeof activeAssignment?.trainingCenterId === "object") {
                  assignedTo =
                    activeAssignment?.trainingCenterId?.trainingCentreName ||
                    activeAssignment?.trainingCenterId.name ||
                    "";
                } else {
                  const found = trainingCenters.find(
                    (tc) => tc?._id === activeAssignment?.trainingCenterId
                  );
                  assignedTo =
                    found?.trainingCentreName ||
                    activeAssignment?.trainingCenterId ||
                    "";
                }

                const hasAssignment = hasValidAssignment(verification);

                const trainingCenterName = (() => {
                  if (!hasAssignment) return "";
                  const centerId =
                    verification.trainingAssignment.trainingCenterId;
                  if (typeof centerId === "object") {
                    return centerId.trainingCentreName || centerId.name || "";
                  }
                  const found = trainingCenters.find(
                    (tc) => tc._id === centerId
                  );
                  return found?.trainingCentreName || "";
                })();

                return (
                  <div
                    key={verification._id || index}
                    className={`p-4 border rounded-lg ${
                      index === 0
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(verification.status)}
                          <Badge
                            className={getStatusColor(verification.status)}
                          >
                            {verification.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">
                            Year {verification.year}
                          </span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              Verified on:{" "}
                              {new Date(verification.date).toLocaleDateString()}
                            </span>
                          </div>

                          {!assignedTo ? null : (
                            <div className="flex items-center gap-2">
                              <HouseIcon className="h-4 w-4" />
                              <span>Assigned To: {assignedTo}</span>
                            </div>
                          )}

                          {verification.verifierName ||
                          verifierNames[verification.verifiedBy] ? (
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4" />
                              <span>
                                By:{" "}
                                {verification.verifierName ||
                                  verifierNames[verification.verifiedBy]}
                              </span>
                            </div>
                          ) : null}

                          {verification.expirationDate && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                Expires:{" "}
                                {new Date(
                                  verification.expirationDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {verification.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <strong>Notes:</strong> {verification.notes}
                          </div>
                        )}

                        {hasAssignment && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const assignment =
                                typeof verification.trainingAssignment ===
                                "object"
                                  ? verification.trainingAssignment
                                  : { _id: verification.trainingAssignment };

                              setCurrentAssignment(assignment);
                              setIsAssigningTraining(true);
                              setCurrentVerificationId(verification._id);

                              // Pre-fill the form with current assignment values
                              setTrainingAssignment({
                                trainingCenterId:
                                  assignment.trainingCenterId?._id ||
                                  assignment.trainingCenterId ||
                                  "",
                                trainingType:
                                  assignment.trainingType || "foundation",
                                year:
                                  assignment.year || new Date().getFullYear(),
                                sector:
                                  assignment.sectorId ||
                                  assignment.sector ||
                                  "",
                                tradeArea:
                                  assignment.tradeAreaId ||
                                  assignment.tradeArea ||
                                  "",
                                notes: assignment.notes || "",
                                changeReason: "",
                              });

                              // If the assignment has a training center ID, select it
                              if (assignment.trainingCenterId) {
                                const centerId =
                                  typeof assignment.trainingCenterId ===
                                  "object"
                                    ? assignment.trainingCenterId._id
                                    : assignment.trainingCenterId;
                                handleTrainingCenterChange(centerId);
                              }
                            }}
                          >
                            Reassign
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Select
                          value={verification.status}
                          onValueChange={(value) =>
                            handleUpdateVerification(verification._id, {
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="denied">Denied</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Only show Assign Training if status is approved and no valid assignment exists */}
                        {verification.status === "approved" && (
                          <>
                            {!hasValidAssignment(verification) ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (shouldReassignTraining) {
                                      setIsAssigningTraining(true);
                                      setCurrentAssignment(
                                        verification?.trainingAssignment
                                      );
                                      setCurrentVerificationId(
                                        verification._id
                                      );
                                    } else {
                                      setIsAssigningTraining(true);
                                      setCurrentAssignment(null);
                                      setCurrentVerificationId(
                                        verification._id
                                      );
                                    }
                                  }}
                                >
                                  {shouldReassignTraining
                                    ? "Reassign Training"
                                    : "Assign Training"}
                                  {/* Assign Training */}
                                </Button>

                                {shouldReassignTraining ? (
                                  <>
                                    <Dialog
                                      open={showVerificationHistory}
                                      onOpenChange={setShowVerificationHistory}
                                    >
                                      <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Verification History
                                          </DialogTitle>
                                          <DialogDescription>
                                            All verification records for{" "}
                                            {user.firstName} {user.lastName}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="overflow-x-auto">
                                          {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Training Assignment(s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Array.isArray(historyVerification) ? historyVerification : []).map((v, idx) => (
            <TableRow key={v._id || idx}>
              <TableCell>{v.year}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(v.status)}>{v.status?.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>
                {verifierNames[v.verifiedBy] || v.verifiedBy || "Unknown"}
              </TableCell>
              <TableCell>
                {v.date ? new Date(v.date).toLocaleDateString() : ""}
              </TableCell>
              <TableCell>{v.notes || ""}</TableCell>
              <TableCell>
                {v.expirationDate ? new Date(v.expirationDate).toLocaleDateString() : ""}
              </TableCell>
              <TableCell>
                {Array.isArray(v.trainingAssignment) && v.trainingAssignment.length > 0
                  ? v.trainingAssignment.join(", ")
                  : (typeof v.trainingAssignment === "string" && v.trainingAssignment)
                    ? v.trainingAssignment
                    : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}

                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>
                                                  Training Center
                                                </TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Sector</TableHead>
                                                <TableHead>
                                                  Trade Area
                                                </TableHead>
                                                <TableHead>Year</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>
                                                  Assigned By
                                                </TableHead>
                                                <TableHead>
                                                  Assigned At
                                                </TableHead>
                                                <TableHead>Notes</TableHead>
                                                <TableHead>Change Reason</TableHead>
                                                <TableHead>Completion Date</TableHead>
                                                <TableHead>Completion Notes</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {/* If assignmentHistory is an array of objects as described */}
                                              {(Array.isArray(
                                                historyVerification
                                              )
                                                ? historyVerification
                                                : []
                                              ).map((item, idx) => {
                                                // Use currentAssignment if assignmentHistory is empty
                                                const assignment =
                                                  item.currentAssignment ||
                                                  item;
                                                // assignment._id may be undefined if only item has _id
                                                console.log("assignment test:", assignment);
                                                // Get training center name
                                                let centerName = "";

                                                if (
                                                  typeof assignment.trainingCenterId ===
                                                  "object"
                                                ) {
                                                  centerName =
                                                    assignment.trainingCenterId
                                                      .trainingCentreName ||
                                                    assignment.trainingCenterId
                                                      .name ||
                                                    "";
                                                } else {
                                                  const found =
                                                    trainingCenters.find(
                                                      (tc) =>
                                                        tc._id ===
                                                        assignment.trainingCenterId
                                                    );
                                                  centerName =
                                                    found?.trainingCentreName ||
                                                    assignment.trainingCenterId ||
                                                    "";
                                                }

                                                // Get assigned by name
                                                const assignedByName =
                                                  verifierNames[
                                                    assignment.assignedBy
                                                  ] ||
                                                  assignment.assignedBy ||
                                                  "Unknown";
                                                return (
                                                  <TableRow
                                                    key={item._id || idx}
                                                  >
                                                    <TableCell>
                                                      {centerName}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.trainingType}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.sector}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.tradeArea}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.year}
                                                    </TableCell>
                                                    
                                                    <TableCell>
                                                      <div className="flex items-center gap-2">
                                                        <Badge
                                                          variant="outline"
                                                          className={
                                                            assignment?.status === "active"
                                                              ? "bg-blue-100 text-blue-800 border-blue-200"
                                                              : assignment?.status === "completed"
                                                              ? "bg-green-100 text-green-800 border-green-200"
                                                              : "bg-red-100 text-red-800 border-red-200"
                                                          }
                                                        >
                                                          {assignment?.status}
                                                        </Badge>
                                                        <Select
                                                          value={assignment.status}
                                                          onValueChange={(value) => {
                                                            const id = assignment._id || item._id;
                                                            if (value === "completed") {
                                                              setPendingAssignmentId(item._id);
                                                              setPendingStatus(value);
                                                              setShowCompletionDialog(true);
                                                            } else {
                                                              handleUpdateAssignmentStatus(id, value);
                                                            }
                                                          }}
                                                          disabled={assignment.status === "cancelled" || assignment.status === "completed"}
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
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignedByName}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.assignedAt
                                                        ? new Date(
                                                            assignment?.assignedAt
                                                          ).toLocaleDateString()
                                                        : ""}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.notes || "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.changeReason || "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.status === "completed" && assignment?.completionDate 
                                                        ? new Date(assignment.completionDate).toLocaleDateString() 
                                                        : "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                      {assignment?.status === "completed" 
                                                        ? (assignment?.completionNotes || "—") 
                                                        : "—"}
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                            </TableBody>
                                          </Table>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                          <Button
                                            onClick={() =>
                                              setShowVerificationHistory(false)
                                            }
                                          >
                                            Close
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      onClick={() =>
                                        handleShowHistory(
                                          verification?.trainingAssignment
                                        )
                                      }
                                      variant="outline"
                                      size="sm"
                                    >
                                      Show history
                                    </Button>
                                  </>
                                ) : null}
                              </>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const assignment =
                                      typeof verification.trainingAssignment ===
                                      "object"
                                        ? verification.trainingAssignment
                                        : {
                                            _id: verification.trainingAssignment,
                                          };
                                    setCurrentAssignment(assignment);
                                    setIsAssigningTraining(true);
                                    setCurrentVerificationId(verification._id);

                                    // Pre-fill form with existing assignment data
                                    setTrainingAssignment((prev) => ({
                                      ...prev,
                                      trainingCenterId:
                                        assignment.trainingCenterId?._id ||
                                        assignment.trainingCenterId ||
                                        "",
                                      trainingType:
                                        assignment.trainingType || "foundation",
                                      year:
                                        assignment.year ||
                                        new Date().getFullYear(),
                                      sector:
                                        assignment.sectorId ||
                                        assignment.sector ||
                                        "",
                                      tradeArea:
                                        assignment.tradeAreaId ||
                                        assignment.tradeArea ||
                                        "",
                                      notes: assignment.notes || "",
                                      changeReason: "",
                                    }));
                                  }}
                                >
                                  Reassign
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const assignmentId =
                                      typeof verification.trainingAssignment ===
                                      "object"
                                        ? verification.trainingAssignment._id
                                        : verification.trainingAssignment;
                                    setCurrentAssignment(
                                      verification.trainingAssignment
                                    );
                                    fetchAssignmentHistory(assignmentId);
                                    setShowHistory(true);
                                  }}
                                >
                                  View History
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No verification records found</p>
              <p className="text-sm">
                Click "Add Verification" to create the first record
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showCompletionDialog && (
        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Assignment</DialogTitle>
              <DialogDescription>
                Please provide completion notes and date.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="completion-date">Completion Date</Label>
              <Input
                id="completion-date"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
              <Label htmlFor="completion-notes">Completion Notes</Label>
              <Textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Enter completion notes"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCompletionDialog(false);
                  setCompletionNotes("");
                  setCompletionDate("");
                  setPendingAssignmentId(null);
                  setPendingStatus("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  // Validate that both fields are filled
                  if (!completionDate.trim()) {
                    toast.error("Please select a completion date");
                    return;
                  }
                  if (!completionNotes.trim()) {
                    toast.error("Please provide completion notes");
                    return;
                  }
                  
                  await handleUpdateAssignmentStatus(
                    pendingAssignmentId,
                    pendingStatus,
                    completionNotes,
                    completionDate
                  );
                  setShowCompletionDialog(false);
                  setCompletionNotes("");
                  setCompletionDate("");
                  setPendingAssignmentId(null);
                  setPendingStatus("");
                }}
              >
                Complete Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
