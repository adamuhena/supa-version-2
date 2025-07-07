"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Plus } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { API_BASE_URL } from "@/config/env"

export function VerificationStatusManager({ user, onVerificationUpdate, currentUser }) {
  const [isAddingVerification, setIsAddingVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newVerification, setNewVerification] = useState({
    year: new Date().getFullYear(),
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    expirationDate: "",
  })
  const [verifierNames, setVerifierNames] = useState({});

useEffect(() => {
  // Collect all unique verifier IDs from verifications
  const ids = Array.from(
    new Set((user.verifications || [])
      .map(v => v.verifiedBy)
      .filter(Boolean))
  );

  // Fetch names for all IDs (if not already present)
  // const fetchNames = async () => {
  //   const names = {};
  //   for (const id of ids) {
  //     if (!verifierNames[id]) {
  //       const accessToken = localStorage.getItem("accessToken")
  //       try {
  //         // Replace with your actual API endpoint for user info
  //         const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         });
  //         console.log("Fetched user data:", res.data);
  //       const fullName = `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim();
  //       names[id] = fullName ? fullName : res.data.email;
  //       } catch (error) {
  //         console.error(`Failed to fetch verifier info for ID ${id}:`, error);
  //         names[id] = "Unknown User";
  //       }
  //     }
  //   }
  //   setVerifierNames(prev => ({ ...prev, ...names }));
  // };

  const fetchNames = async () => {
  const names = {};
  for (const id of ids) {
    if (!verifierNames[id]) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = res.data.data;
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        names[id] = fullName ? fullName : user.email;
      } catch (error) {
        console.error(`Failed to fetch verifier info for ID ${id}:`, error);
        names[id] = "Unknown User";
      }
    }
  }
  setVerifierNames(prev => ({ ...prev, ...names }));
};

  if (ids.length) fetchNames();
  // eslint-disable-next-line
}, [user.verifications]);

  const handleAddVerification = async () => {
    if (!newVerification.year || !newVerification.status) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      const verificationData = {
        newVerification: {
          ...newVerification,
          verifiedBy: currentUser?.id || currentUser?._id,
          verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
          date: new Date().toISOString(),
        },
      }

      const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data && response.data.success) {
        toast.success("Verification record added successfully")
        onVerificationUpdate(response.data.data)
        setIsAddingVerification(false)
        setNewVerification({
          year: new Date().getFullYear(),
          status: "pending",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          expirationDate: "",
        })
      }
    } catch (error) {
      console.error("Error adding verification:", error)
      toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateVerification = async (verificationId, updatedData) => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      const response = await axios.patch(
        `${API_BASE_URL}/users/${user._id}/verifications/${verificationId}`,
        {
          ...updatedData,
          verifiedBy: currentUser?.id || currentUser?._id,
          verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.data && response.data.success) {
        toast.success("Verification updated successfully")
        onVerificationUpdate(response.data.data)
      }
    } catch (error) {
      console.error("Error updating verification:", error)
      toast.error("Failed to update verification: " + (error.response?.data?.message || error.message))
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

  const sortedVerifications = (user.verifications || []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

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
            <Button onClick={() => setIsAddingVerification(true)} size="sm" className="flex items-center gap-2">
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
            <CardDescription>Create a new verification record for this user</CardDescription>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-status">Status *</Label>
                <Select
                  value={newVerification.status}
                  onValueChange={(value) => setNewVerification((prev) => ({ ...prev, status: value }))}
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

              <div className="space-y-2">
                <Label htmlFor="verification-expiry">Expiration Date (Optional)</Label>
                <Input
                  id="verification-expiry"
                  type="date"
                  value={newVerification.expirationDate || ""}
                  onChange={(e) =>
                    setNewVerification((prev) => ({
                      ...prev,
                      expirationDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Verified By</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-notes">Notes (Optional)</Label>
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
                  setIsAddingVerification(false)
                  setNewVerification({
                    year: new Date().getFullYear(),
                    status: "pending",
                    date: new Date().toISOString().split("T")[0],
                    notes: "",
                    expirationDate: "",
                  })
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

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Verification History
          </CardTitle>
          <CardDescription>Complete history of verification records for this user</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedVerifications.length > 0 ? (
            <div className="space-y-4">
              {sortedVerifications.map((verification, index) => (
                <div
                  key={verification._id || index}
                  className={`p-4 border rounded-lg ${index === 0 ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(verification.status)}
                        <Badge className={getStatusColor(verification.status)}>
                          {verification.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">Year {verification.year}</span>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Verified on: {new Date(verification.date).toLocaleDateString()}</span>
                        </div>

                        {/* {verification.verifierName && (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>By: {verification.verifierName}</span>
                          </div>
                        )} */}

                        {verification.verifierName || verifierNames[verification.verifiedBy] ? (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>
                              By: {verification.verifierName || verifierNames[verification.verifiedBy]}
                            </span>
                          </div>
                        ) : null}

                        {verification.expirationDate && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Expires: {new Date(verification.expirationDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {verification.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {verification.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Select
                        value={verification.status}
                        onValueChange={(value) => handleUpdateVerification(verification._id, { status: value })}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No verification records found</p>
              <p className="text-sm">Click "Add Verification" to create the first record</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
