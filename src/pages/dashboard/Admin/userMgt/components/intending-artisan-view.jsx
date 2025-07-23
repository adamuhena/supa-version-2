"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BookOpenIcon,
  AlertCircleIcon,
  HomeIcon as HouseIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import axios from "axios"
import { API_BASE_URL } from "@/config/env"
import { useNavigate } from "react-router-dom";
import { downloadAdmissionLetterPDF } from "@/components/AdmissionLetterPDF";

export function IntendingArtisanView({ currentUser }) {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [verifierNames, setVerifierNames] = useState({})
  const [applicationProgress, setApplicationProgress] = useState(0)
  const [applicationProgressLabel, setApplicationProgressLabel] = useState("")
  const [applicationProgressColor, setApplicationProgressColor] = useState("bg-gray-300");
  const [trainingCenters, setTrainingCenters] = useState([])
  const [showAssignmentHistory, setShowAssignmentHistory] = useState(false)
  const [assignmentForHistory, setAssignmentForHistory] = useState(null)
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const [admissionEnabled, setAdmissionEnabled] = useState(false);
  const [periodStatus, setPeriodStatus] = useState("");
  const [periodName, setPeriodName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserVerifications()
  }, [currentUser])

  useEffect(() => {
    const fetchTrainingCenters = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.get(`${API_BASE_URL}/training-centers`, {
          params: {
            state: currentUser.stateOfResidence,
            currentAssessmentStatus: "approved",
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setTrainingCenters(response.data.data || [])
      } catch (error) {
        console.error("Error fetching training centers:", error)
      }
    }
    if (currentUser?.stateOfResidence) fetchTrainingCenters()
  }, [currentUser])

  useEffect(() => {
    async function fetchAdmissionStatus() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/periods/current`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setAdmissionEnabled(res.data.admissionLetterEnabled);
        setPeriodStatus(res.data.status);
        setPeriodName(res.data.name);
      } catch (err) {
        setAdmissionEnabled(false);
        setPeriodStatus("");
        setPeriodName("");
      }
    }
    fetchAdmissionStatus();
  }, []);

  const fetchUserVerifications = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/users/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const userData = response.data.data
      setVerifications(userData.verifications || [])

      // Calculate application progress
      const sortedVerifications = [...(userData.verifications || [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      const latestVerification = sortedVerifications[0];

      let progress = 25; // Default: Application Submitted
      let progressLabel = "Application Submitted";
      let progressColor = "bg-gray-300"; // Default color

      if (latestVerification) {
        if (latestVerification.status === "pending") {
          progress = 50;
          progressLabel = "Under Review";
          progressColor = "bg-yellow-400";
        } else if (latestVerification.status === "denied") {
          progress = 0; // Or 10, or any value you want
          progressLabel = "Application Denied";
          progressColor = "bg-red-500";
        } else if (latestVerification.status === "approved") {
          const ta = latestVerification.trainingAssignment;
          if (
            (Array.isArray(ta) && ta.length > 0) ||
            (ta && typeof ta === "object" && ta._id)
          ) {
            progress = 100;
            progressLabel = "Current";
            progressColor = "bg-green-500";
          } else {
            progress = 75;
            progressLabel = "Current";
            progressColor = "bg-green-400";
          }
        }
      }
      setApplicationProgress(progress);
      setApplicationProgressLabel(progressLabel);
      setApplicationProgressColor(progressColor);

      // Fetch verifier names
      const verifierIds = Array.from(
        new Set((userData.verifications || []).map((v) => v.verifiedBy).filter(Boolean))
      )

      const names = {}
      for (const id of verifierIds) {
        try {
          const verifierRes = await axios.get(`${API_BASE_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          const verifier = verifierRes.data.data
          names[id] = `${verifier.firstName || ""} ${verifier.lastName || ""}`.trim() || verifier.email
        } catch (error) {
          console.error(`Error fetching verifier ${id}:`, error)
          names[id] = "Unknown Verifier"
        }
      }
      setVerifierNames(names)
    } catch (error) {
      console.error("Error fetching verifications:", error)
      toast.error("Failed to load verification data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case "denied":
        return <XCircleIcon className="h-4 w-4 text-red-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "denied":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const handleShowAssignmentHistory = async (assignment) => {
    try {
      setAssignmentLoading(true)
      setAssignmentForHistory(assignment)

      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(
        `${API_BASE_URL}/training/${assignment._id}/history`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      console.log("History :", response)
      const history = response.data?.data?.history || []
      setAssignmentHistory(history)

      setShowAssignmentHistory(true)
    } catch (error) {
      console.error("Error fetching assignment history:", error)
      toast.error("Failed to load assignment history")
    } finally {
      setAssignmentLoading(false)
    }
  }

  const hasTrainingAssignment = (verification) => {
    const ta = verification.trainingAssignment
    if (!ta) return false
    if (Array.isArray(ta)) return ta.length > 0
    return !!ta._id
  }

  const renderAssignmentSection = (verification) => {
    if (!hasTrainingAssignment(verification)) return null

    const assignment = Array.isArray(verification.trainingAssignment)
      ? verification.trainingAssignment[0]
      : verification.trainingAssignment

    // Get training center details
    let center = null;
    if (
      assignment.currentAssignment &&
      assignment.currentAssignment.trainingCenterId &&
      typeof assignment.currentAssignment.trainingCenterId === "object"
    ) {
      center = assignment.currentAssignment.trainingCenterId;
    } else if (typeof assignment.trainingCenterId === "object" && assignment.trainingCenterId !== null) {
      center = assignment.trainingCenterId;
    } else if (typeof assignment.trainingCenterId === "string") {
      center = trainingCenters.find(tc => tc._id === assignment.trainingCenterId) || null;
    }

    // Determine assignment status
    const assignmentStatus = assignment.currentAssignment?.status || assignment.status;
    const hasCenter = !!center;

    return (
      <>
        <div className="flex items-center gap-2">
          <HouseIcon className="h-4 w-4" />
          <span className="text-green-600 font-medium">Training Center Assigned</span>
        </div>
        {center && (
          <div className="p-2 mb-2 rounded bg-gray-50 border text-xs text-gray-700">
            <div><strong>Name:</strong> {center.trainingCentreName || center.name || "—"}</div>
            <div><strong>Email:</strong> {center.email || "—"}</div>
            <div><strong>Phone:</strong> {center.phoneNumber || "—"}</div>
            <div><strong>State:</strong> {center.state || "—"}</div>
            <div><strong>LGA:</strong> {center.lga || "—"}</div>
            <div><strong>Address:</strong> {center.address || "—"}</div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShowAssignmentHistory(assignment)}
        >
          View Assignment History
        </Button>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Assignment Status:</span>
            <Badge className={(() => {
              if (assignmentStatus === "completed") return "bg-green-100 text-green-800 border-green-200";
              if (assignmentStatus === "active") return "bg-blue-100 text-blue-800 border-blue-200";
              if (assignmentStatus === "cancelled") return "bg-red-100 text-red-800 border-red-200";
              return "bg-yellow-100 text-yellow-800 border-yellow-200";
            })()}>
              {assignmentStatus ? assignmentStatus.charAt(0).toUpperCase() + assignmentStatus.slice(1) : "Unknown"}
            </Badge>
            {/* Admission Letter Button and Debug */}
            <div>
              Debug: hasCenter={String(hasCenter)}, admissionEnabled={String(admissionEnabled)}, periodStatus={periodStatus}, assignmentStatus={assignmentStatus}
            </div>
            {hasCenter && admissionEnabled && periodStatus !== "suspended" && assignmentStatus !== "cancelled" && (
              <Button
                size="sm"
                onClick={() => {
                  const pdfAssignment = assignment.currentAssignment || assignment;
                  const assignmentId = assignment._id; // always from the parent
                  console.log("PDF payload:", {
                    user: currentUser,
                    assignment: pdfAssignment,
                    assignmentId, // for debug
                    period: { status: periodStatus, name: periodName, year: new Date().getFullYear() },
                    verificationId: verification._id
                  });
                  downloadAdmissionLetterPDF({
                    user: currentUser,
                    assignment: { ...pdfAssignment, _id: assignmentId }, // merge _id into the subdoc
                    period: { name: periodName, status: periodStatus, year: new Date().getFullYear() },
                    verificationId: verification._id
                  });
                }}
              >
                Print Admission Letter
              </Button>
            )}
          </div>
          {assignment.status === "completed" && (
            <>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Completion Date:</span>{" "}
                {assignment.completionDate 
                  ? new Date(assignment.completionDate).toLocaleDateString() 
                  : "—"}
              </div>
              {assignment.completionNotes && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Completion Notes:</span>{" "}
                  {assignment.completionNotes}
                </div>
              )}
            </>
          )}
        </div>
      </>
    )
  }

  const sortedVerifications = [...verifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const currentStatus = sortedVerifications[0]?.status || "pending";
  const hasApprovedVerification = verifications.some((v) => v.status === "approved");
  // Use a different variable name to avoid redeclaration error
  const hasAnyTrainingAssignment = verifications.some((v) => v.trainingAssignment);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-2 ">
      {/* <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artisan Application Progress</h1>
        <p className="text-gray-600 mt-2">Track your journey to becoming a certified artisan</p>
      </div> */}

      {/* Application Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            Application Progress
          </CardTitle>
          <CardDescription>Your progress towards artisan certification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Overall Progress
                {applicationProgressLabel && (
                  <Badge className="ml-2" variant="outline">
                    {applicationProgressLabel}
                  </Badge>
                )}
              </span>
              <span className="text-sm text-gray-600">{applicationProgress}%</span>
            </div>
            <Progress value={applicationProgress} className={`h-2 ${applicationProgressColor}`} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Application Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${verifications.length > 0 ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs">Under Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${hasApprovedVerification ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs">Verification Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasTrainingAssignment ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="text-xs">Training Assigned</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(currentStatus)}
            Current Application Status
          </CardTitle>
          <CardDescription>Your latest verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(currentStatus)}>{currentStatus.toUpperCase()}</Badge>
            {currentStatus === "approved" && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Congratulations! Your application has been approved
              </div>
            )}
            {currentStatus === "pending" && (
              <div className="text-sm text-yellow-600 font-medium">⏳ Your application is being reviewed</div>
            )}
            {currentStatus === "denied" && (
              <div className="text-sm text-red-600 font-medium">❌ Application needs attention</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {!hasTrainingAssignment && hasApprovedVerification && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircleIcon className="h-5 w-5" />
              Next Steps
            </CardTitle>
            <CardDescription className="text-green-700">
              Your verification has been approved! Here's what happens next:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-700">
              <p>• You will be assigned to a training center soon</p>
              <p>• Training center assignment is based on your location and trade area</p>
              <p>• You will receive notification once assigned</p>
              <p>• Training will begin according to the center's schedule</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Application History
          </CardTitle>
          <CardDescription>Complete history of your application process</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto">
          {sortedVerifications.length > 0 ? (
            <div className="space-y-4">
              {sortedVerifications.map((verification, index) => (
                <div
                  key={verification._id || index}
                  className={`p-4 border rounded-lg ${
                    index === 0 ? "border-blue-200 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(verification.status)}
                      <Badge className={getStatusColor(verification.status)}>
                        {verification.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">Year {verification.year}</span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Processed on: {new Date(verification.date).toLocaleDateString()}</span>
                      </div>

                      {verification.verifierName || verifierNames[verification.verifiedBy] ? (
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>
                            Reviewed by: {verification.verifierName || verifierNames[verification.verifiedBy]}
                          </span>
                        </div>
                      ) : null}

                      {verification.expirationDate && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Valid until: {new Date(verification.expirationDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {hasTrainingAssignment(verification) && renderAssignmentSection(verification)}
                    </div>

                    {verification.notes && (
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        <strong>Review Notes:</strong> {verification.notes}
                      </div>
                    )}

                    {verification.status === "denied" && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-start gap-2">
                          <AlertCircleIcon className="h-4 w-4 text-red-600 mt-0.5" />
                          <div className="text-sm text-red-700">
                            <strong>Action Required:</strong> Your application was not approved. Please review the
                            feedback and resubmit with the necessary corrections.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No application records found</p>
              <p className="text-sm">Your application history will appear here once submitted</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Assistance?</CardTitle>
          <CardDescription>Get help with your application process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • <strong>Application Pending:</strong> Your application is being reviewed.
            </p>
            <p>
              • <strong>Application Denied:</strong> Review the feedback provided.
            </p>
            <p>
              • <strong>Training Assignment:</strong> You'll be notified via email once a training center is assigned.
            </p>
          </div>
          {/* <div className="flex gap-2 mt-4">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">View FAQ</Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Assignment History Dialog */}
      <Dialog open={showAssignmentHistory} onOpenChange={setShowAssignmentHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assignment History</DialogTitle>
            <DialogDescription>
              Training assignment history for {currentUser.firstName} {currentUser.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            {assignmentLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (assignmentHistory.length > 0 || assignmentForHistory?.currentAssignment) ? (
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
                  {(assignmentHistory.length > 0
                    ? assignmentHistory
                    : [assignmentForHistory.currentAssignment]
                  ).map((item, idx) => {
                    const assignment = item.currentAssignment || item
                    let centerName = "—"
                    if (typeof assignment.trainingCenterId === "object" && assignment.trainingCenterId !== null) {
                      centerName = assignment.trainingCenterId.trainingCentreName || assignment.trainingCenterId.name || "—"
                    } else if (typeof assignment.trainingCenterId === "string") {
                      const found = trainingCenters.find(tc => tc._id === assignment.trainingCenterId)
                      centerName = found?.trainingCentreName || "—"
                    }

                    let assignedByName = "—"
                    if (assignment.assignedBy) {
                      if (typeof assignment.assignedBy === "object" && assignment.assignedBy !== null) {
                        assignedByName =
                          (assignment.assignedBy.firstName || "") +
                          (assignment.assignedBy.lastName ? " " + assignment.assignedBy.lastName : "") ||
                          assignment.assignedBy.email ||
                          "—"
                      } else {
                        assignedByName = verifierNames[assignment.assignedBy] || assignment.assignedBy || "—"
                      }
                    }

                    return (
                      <TableRow key={assignment._id || idx}>
                        <TableCell>{centerName}</TableCell>
                        <TableCell>{assignment?.trainingType}</TableCell>
                        <TableCell>{assignment?.sector}</TableCell>
                        <TableCell>{assignment?.tradeArea}</TableCell>
                        <TableCell>{assignment?.year}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{assignedByName}</TableCell>
                        <TableCell>
                          {assignment?.assignedAt
                            ? new Date(assignment?.assignedAt).toLocaleDateString()
                            : ""}
                        </TableCell>
                        <TableCell>{assignment?.notes || "—"}</TableCell>
                        <TableCell>{assignment?.changeReason || "—"}</TableCell>
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
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">No assignment history found</div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowAssignmentHistory(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}