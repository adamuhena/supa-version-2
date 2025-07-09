
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, UserIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Plus } from "lucide-react"
// import { toast } from "sonner"
// import axios from "axios"
// import { API_BASE_URL } from "@/config/env"
// import { Separator } from "@/components/ui/separator"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// export function VerificationStatusManager({ user, onVerificationUpdate, currentUser }) {
//   const [isAddingVerification, setIsAddingVerification] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [newVerification, setNewVerification] = useState({
//     year: new Date().getFullYear(),
//     status: "pending",
//     date: new Date().toISOString().split("T")[0],
//     notes: "",
//     expirationDate: "",
//   })
//   const [verifierNames, setVerifierNames] = useState({})
//   const [trainingCenters, setTrainingCenters] = useState([])
//   const [isAssigningTraining, setIsAssigningTraining] = useState(false)
//   const [currentAssignment, setCurrentAssignment] = useState(null)
//   const [assignmentHistory, setAssignmentHistory] = useState([])
//   const [showHistory, setShowHistory] = useState(false)
//   const [selectedTrainingCenter, setSelectedTrainingCenter] = useState(null);
//   const [sectorsList, setSectorsList] = useState([]);
//   const [sectorTradeAreas, setSectorTradeAreas] = useState([]);
// const [allSectors, setAllSectors] = useState([]);
//   const [centerSectors, setCenterSectors] = useState([]);
//   const [centerTradeAreas, setCenterTradeAreas] = useState([]);
//   const [selectedSector, setSelectedSector] = useState("");
//   const [selectedTradeArea, setSelectedTradeArea] = useState("");
//   // Suppose you have allSectors loaded from your API


  

// // When a training center is selected:
// const handleTrainingCenterChange = (id) => {
//   const center = trainingCenters.find(tc => tc._id === id);
//   setSelectedTrainingCenter(center);
//   setTrainingAssignment(prev => ({
//     ...prev,
//     trainingCenterId: id
//   }));

//   // Extract unique sector IDs from the center's tradeAreas
//   const sectorIds = Array.from(
//     new Set(
//       (center.legalInfo?.tradeAreas || [])
//         .map(ta => ta.sector?.toString() || ta.sector)
//         .filter(Boolean)
//     )
//   );

//   // Map sector IDs to sector objects (with names)
//   const sectors = allSectors.filter(sec => sectorIds.includes(sec._id));
//   setCenterSectors(sectors); // Now an array of sector objects

//   setSelectedSector("");
//   setSelectedTradeArea("");
//   setCenterTradeAreas([]);
// };

// // When a sector is selected, extract trade areas for that sector
// const handleSectorChange = (sectorName) => {
//   setSelectedSector(sectorName);
//   const tradeAreas = (selectedTrainingCenter.legalInfo?.tradeAreas || [])
//     .filter(ta => (ta.sector?.name || ta.sector) === sectorName)
//     .flatMap(ta => Array.isArray(ta.tradeArea) ? ta.tradeArea : [ta.tradeArea])
//     .map(ta => ta.name || ta)
//     .filter(Boolean);

//   setCenterTradeAreas(tradeAreas);
//   setSelectedTradeArea("");
// };



//   const [trainingAssignment, setTrainingAssignment] = useState({
//     trainingCenterId: "",
//     trainingType: "foundation",
//     year: new Date().getFullYear(),
//     sector: "",
//     tradeArea: "",
//     notes: "",
//     changeReason: ""
//   })

//   useEffect(() => {
//     // Fetch verifier names
//     const ids = Array.from(
//       new Set((user.verifications || [])
//         .map(v => v.verifiedBy)
//         .filter(Boolean))
//     )

//     const fetchNames = async () => {
//       const names = {}
//       for (const id of ids) {
//         if (!verifierNames[id]) {
//           const accessToken = localStorage.getItem("accessToken")
//           try {
//             const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
//               headers: { Authorization: `Bearer ${accessToken}` },
//             })
//             const user = res.data.data
//             const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
//             names[id] = fullName ? fullName : user.email
//           } catch (error) {
//             console.error(`Failed to fetch verifier info for ID ${id}:`, error)
//             names[id] = "Unknown User"
//           }
//         }
//       }
//       setVerifierNames(prev => ({ ...prev, ...names }))
//     }

//     if (ids.length) fetchNames()
//   }, [user.verifications])

//   useEffect(() => {
//     // Fetch training centers in user's state when needed
//     if (isAssigningTraining && user.stateOfResidence) {
//       fetchTrainingCenters()
//     }
//   }, [isAssigningTraining, user.stateOfResidence])

// const fetchTrainingCenters = async () => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.get(`${API_BASE_URL}/training-centers`, {
//       params: {
//         state: user.stateOfResidence, // Use stateOfResidence of the artisan
//         currentAssessmentStatus: "approved"
//       },
//       headers: { Authorization: `Bearer ${accessToken}` }
//     });
//     setTrainingCenters(response.data.data || []);
//   } catch (error) {
//     console.error("Error fetching training centers:", error);
//     toast.error("Failed to load training centers");
//   }
// };



// useEffect(() => {
//   axios.get(`${API_BASE_URL}/sectors`)
//     .then(res => setAllSectors(res.data.data || []));
// }, []);

// useEffect(() => {
//   if (isAssigningTraining) {
//     axios.get(`${API_BASE_URL}/sectors`)
//       .then(res => setSectorsList(res.data.data || []))
//       .catch(() => setSectorsList([]));
//   }
// }, [isAssigningTraining]);

// // Get unique sector IDs from the center's tradeAreas
// const centerSectorIds = Array.from(
//   new Set(
//     (selectedTrainingCenter?.legalInfo?.tradeAreas || [])
//       .map(ta => ta.sector?.toString() || ta.sector) // sector may be an ObjectId or string
//       .filter(Boolean)
//   )
// );


// const sectors = Array.from(
//   new Set(
//     trainingCenters.flatMap(center =>
//       (center.legalInfo?.tradeAreas || []).map(tr => tr.sector?.name || tr.sector)
//     ).filter(Boolean)
//   )
// );

// const tradeAreas = Array.from(
//   new Set(
//     trainingCenters.flatMap(center =>
//       (center.legalInfo?.tradeAreas || []).flatMap(tr =>
//         Array.isArray(tr.tradeArea) ? tr.tradeArea : [tr.tradeArea]
//       )
//     ).filter(Boolean)
//   )
// );

//   // const fetchAssignmentHistory = async (assignmentId) => {
//   //   try {
//   //     const accessToken = localStorage.getItem("accessToken")
//   //     const response = await axios.get(`${API_BASE_URL}/trianing/training-assignments/${assignmentId}/history`, {
//   //       headers: { Authorization: `Bearer ${accessToken}` }
//   //     })
//   //     setAssignmentHistory(response.data.data.history || [])
//   //   } catch (error) {
//   //     console.error("Error fetching assignment history:", error)
//   //     toast.error("Failed to load assignment history")
//   //   }
//   // }

//   const fetchAssignmentHistory = async (assignmentId) => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.get(
//       `${API_BASE_URL}/training/training-assignments/${assignmentId}/history`, 
//       {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       }
//     );
    
//     // Ensure we always have an array, even if empty
//     setAssignmentHistory(response.data?.data?.history || []);
    
//     // If no history but we have the current assignment, include it
//     if (response.data?.data?.history?.length === 0 && currentAssignment) {
//       setAssignmentHistory([currentAssignment]);
//     }
//   } catch (error) {
//     console.error("Error fetching assignment history:", error);
//     toast.error("Failed to load assignment history");
//     // Fallback to showing just the current assignment if available
//     if (currentAssignment) {
//       setAssignmentHistory([currentAssignment]);
//     } else {
//       setAssignmentHistory([]);
//     }
//   }
// };

//   const handleAddVerification = async () => {
//     if (!newVerification.year || !newVerification.status) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const verificationData = {
//         newVerification: {
//           ...newVerification,
//           verifiedBy: currentUser?.id || currentUser?._id,
//           verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
//           date: new Date().toISOString(),
//         },
//       }

//       const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       })

//       if (response.data?.success) {
//         toast.success("Verification record added successfully")
//         onVerificationUpdate(response.data.data)
//         setIsAddingVerification(false)
//         setNewVerification({
//           year: new Date().getFullYear(),
//           status: "pending",
//           date: new Date().toISOString().split("T")[0],
//           notes: "",
//           expirationDate: "",
//         })
//       }
//     } catch (error) {
//       console.error("Error adding verification:", error)
//       toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateVerification = async (verificationId, updatedData) => {
//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.patch(
//         `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}`,
//         {
//           ...updatedData,
//           verifiedBy: currentUser?.id || currentUser?._id,
//           verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
//         },
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       )

//       if (response.data?.success) {
//         toast.success("Verification updated successfully")
//         onVerificationUpdate(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error updating verification:", error)
//       toast.error("Failed to update verification: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   // const handleAssignTraining = async (verificationId) => {
//   //   if (!trainingAssignment.trainingCenterId || !trainingAssignment.sector || !trainingAssignment.tradeArea) {
//   //     toast.error("Please select a training center, sector, and trade area")
//   //     return
//   //   }

//   //   setLoading(true)
//   //   try {
//   //     const accessToken = localStorage.getItem("accessToken")
//   //     const response = await axios.post(
//   //       `${API_BASE_URL}/users/${user._id}/verifications/${verificationId}/assign`,
//   //       {
//   //         trainingCenterId: trainingAssignment.trainingCenterId,
//   //         trainingType: trainingAssignment.trainingType,
//   //         year: trainingAssignment.year,
//   //         sector: trainingAssignment.sector,
//   //         tradeArea: trainingAssignment.tradeArea,
//   //         notes: trainingAssignment.notes
//   //       },
//   //       { headers: { Authorization: `Bearer ${accessToken}` } }
//   //     )

//   //     if (response.data?.success) {
//   //       toast.success("Training center assigned successfully")
//   //       onVerificationUpdate(response.data.data)
//   //       setIsAssigningTraining(false)
//   //       setTrainingAssignment({
//   //         trainingCenterId: "",
//   //         trainingType: "foundation",
//   //         year: new Date().getFullYear(),
//   //         sector: "",
//   //         tradeArea: "",
//   //         notes: "",
//   //         changeReason: ""
//   //       })
//   //     }
//   //   } catch (error) {
//   //     console.error("Error assigning training:", error)
//   //     toast.error("Failed to assign training: " + (error.response?.data?.message || error.message))
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }
// // allSectors: [{ _id, name, tradeAreas: [{ _id, name }, ...] }, ...]

// const sectorObj = allSectors.find(sec => sec._id === trainingAssignment.sector);
// const tradeAreaObj = sectorObj?.tradeAreas.find(ta => ta._id === trainingAssignment.tradeArea);

// const payload = {
//   trainingCenterId: trainingAssignment.trainingCenterId,
//   trainingType: trainingAssignment.trainingType,
//   year: trainingAssignment.year,
//   // sector: sectorObj?.name || "",         // <-- send name, not ID
//   // tradeArea: tradeAreaObj?.name || "",   // <-- send name, not ID
//   sector: trainingAssignment.sector,         // <-- send name, not ID
//   tradeArea: trainingAssignment.tradeArea,   // <-- send name, not ID
//   notes: trainingAssignment.notes,
//   changeReason: trainingAssignment.changeReason
// };


//   // const handleAssignTraining = async (verificationId) => {
//   //   console.log("Assignment:", trainingAssignment);
//   //   if (!trainingAssignment.trainingCenterId || !trainingAssignment.sector || !trainingAssignment.tradeArea) {
//   //     toast.error("Please select a training center, sector, and trade area");
//   //     return;
//   //   }

//   //   setLoading(true);
//   // try {
//   //   const accessToken = localStorage.getItem("accessToken");

//   //   // Map sector and trade area IDs to names
//   //   const sectorObj = sectorsList.find(sec => sec._id === trainingAssignment.sector);
//   //   const tradeAreaObj = sectorObj?.tradeAreas.find(ta => ta._id === trainingAssignment.tradeArea);

//   //     // const response = await axios.post(
//   //     //   `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}/assign`,
//   //     //   payload,
//   //     //   // {
//   //     //   //   trainingCenterId: trainingAssignment.trainingCenterId,
//   //     //   //   trainingType: trainingAssignment.trainingType,
//   //     //   //   year: trainingAssignment.year,
//   //     //   //   sector: sectorObj?.name || "",
//   //     //   //   tradeArea: tradeAreaObj?.name || "",
//   //     //   //   notes: trainingAssignment.notes
//   //     //   // },
//   //     //   { headers: { Authorization: `Bearer ${accessToken}` } }
//   //     // );

//   //     // if (response.data?.success) {
//   //     //   toast.success("Training center assigned successfully");
//   //     //   onVerificationUpdate(response.data.data);
//   //     //   setIsAssigningTraining(false);
//   //     //   setTrainingAssignment({
//   //     //     trainingCenterId: "",
//   //     //     trainingType: "foundation",
//   //     //     year: new Date().getFullYear(),
//   //     //     sector: "",
//   //     //     tradeArea: "",
//   //     //     notes: "",
//   //     //     changeReason: ""
//   //     //   });
//   //     // }
//   //     try {
//   //     const response = await axios.post(
//   //       `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}/assign`,
//   //       payload,
//   //       { headers: { Authorization: `Bearer ${accessToken}` } }
//   //     );

//   //     if (response.data?.success) {
//   //       toast.success("Training center assigned successfully");
//   //       // Force refresh of user data
//   //       const updatedUser = await fetchUpdatedUser(user._id);
//   //       onVerificationUpdate(updatedUser);
//   //       setIsAssigningTraining(false);
//   //       // Reset form
//   //       setTrainingAssignment({
//   //         trainingCenterId: "",
//   //         trainingType: "foundation",
//   //         year: new Date().getFullYear(),
//   //         sector: "",
//   //         tradeArea: "",
//   //         notes: "",
//   //         changeReason: ""
//   //       });
//   //     }
  
//   //     } catch (error) {
//   //       console.error("Error assigning training:", error);
//   //       toast.error("Failed to assign training: " + (error.response?.data?.message || error.message));
//   //     } 
//   //   }finally {
//   //       setLoading(false);
//   //     }
//   // };


//   // Add this helper function
//   const handleAssignTraining = async (verificationId) => {
//   // Check if verification already has an assignment
//   const verification = user.verifications.find(v => v._id === verificationId);
//   if (verification?.trainingAssignment) {
//     toast.error("This verification already has a training assignment");
//     return;
//   }

//   if (!trainingAssignment.trainingCenterId || !trainingAssignment.sector || !trainingAssignment.tradeArea) {
//     toast.error("Please select a training center, sector, and trade area");
//     return;
//   }

//   setLoading(true);
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.post(
//       `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}/assign`,
//       payload,
//       { headers: { Authorization: `Bearer ${accessToken}` } }
//     );

//     if (response.data?.success) {
//       toast.success("Training center assigned successfully");
//       const updatedUser = await fetchUpdatedUser(user._id);
//       onVerificationUpdate(updatedUser);
//       setIsAssigningTraining(false);
//       setTrainingAssignment({
//         trainingCenterId: "",
//         trainingType: "foundation",
//         year: new Date().getFullYear(),
//         sector: "",
//         tradeArea: "",
//         notes: "",
//         changeReason: ""
//       });
//     }
//   } catch (error) {
//     console.error("Error assigning training:", error);
//     toast.error("Failed to assign training: " + (error.response?.data?.message || error.message));
//   } finally {
//     setLoading(false);
//   }
// };
  
//   const fetchUpdatedUser = async (userId) => {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     });
//     return response.data.data;
//   };

//   // const handleReassignTraining = async (assignmentId) => {
//   //   if (!trainingAssignment.trainingCenterId || !trainingAssignment.changeReason) {
//   //     toast.error("Please select a training center and provide a reason for reassignment")
//   //     return
//   //   }

//   //   setLoading(true)
//   //   try {
//   //     const accessToken = localStorage.getItem("accessToken")
//   //     const response = await axios.patch(
//   //       `${API_BASE_URL}/training/training-assignments/${assignmentId}/reassign`,
//   //       {
//   //         ...trainingAssignment,
//   //         assignedBy: currentUser?.id || currentUser?._id
//   //       },
//   //       { headers: { Authorization: `Bearer ${accessToken}` } }
//   //     )

//   //     if (response.data?.success) {
//   //       toast.success("Training reassigned successfully")
//   //       onVerificationUpdate(response.data.data)
//   //       setIsAssigningTraining(false)
//   //       setTrainingAssignment({
//   //         trainingCenterId: "",
//   //         trainingType: "foundation",
//   //         year: new Date().getFullYear(),
//   //         sector: "",
//   //         tradeArea: "",
//   //         notes: "",
//   //         changeReason: ""
//   //       })
//   //     }
//   //   } catch (error) {
//   //     console.error("Error reassigning training:", error)
//   //     toast.error("Failed to reassign training: " + (error.response?.data?.message || error.message))
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const handleReassignTraining = async (assignmentId) => {
//   if (!trainingAssignment.trainingCenterId || !trainingAssignment.changeReason) {
//     toast.error("Please select a training center and provide a reason for reassignment");
//     return;
//   }

//   setLoading(true);
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.patch(
//       `${API_BASE_URL}/training/training-assignments/${assignmentId}/reassign`,
//       {
//         ...trainingAssignment,
//         assignedBy: currentUser?.id || currentUser?._id
//       },
//       { headers: { Authorization: `Bearer ${accessToken}` } }
//     );

//     if (response.data?.success) {
//       toast.success("Training reassigned successfully");
//       const updatedUser = await fetchUpdatedUser(user._id);
//       onVerificationUpdate(updatedUser);
//       setIsAssigningTraining(false);
//       setTrainingAssignment({
//         trainingCenterId: "",
//         trainingType: "foundation",
//         year: new Date().getFullYear(),
//         sector: "",
//         tradeArea: "",
//         notes: "",
//         changeReason: ""
//       });
//     }
//   } catch (error) {
//     console.error("Error reassigning training:", error);
//     toast.error("Failed to reassign training: " + (error.response?.data?.message || error.message));
//   } finally {
//     setLoading(false);
//   }
// };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved": return <CheckCircleIcon className="h-4 w-4 text-green-600" />
//       case "denied": return <XCircleIcon className="h-4 w-4 text-red-600" />
//       default: return <ClockIcon className="h-4 w-4 text-yellow-600" />
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved": return "bg-green-100 text-green-800 border-green-200"
//       case "denied": return "bg-red-100 text-red-800 border-red-200"
//       default: return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     }
//   }

//   const sortedVerifications = (user.verifications || []).sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   )

//   return (
//     <div className="space-y-6">
//       {/* Current Status Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             {getStatusIcon(user.currentVerificationStatus)}
//             Current Verification Status
//           </CardTitle>
//           <CardDescription>
//             Latest verification status for {user.firstName} {user.lastName}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between">
//             <Badge className={getStatusColor(user.currentVerificationStatus)}>
//               {user.currentVerificationStatus?.toUpperCase() || "PENDING"}
//             </Badge>
//             <Button 
//               onClick={() => setIsAddingVerification(true)} 
//               size="sm" 
//               className="flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               Add Verification
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add New Verification Form */}
//       {isAddingVerification && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add New Verification Record</CardTitle>
//             <CardDescription>Create a new verification record for this user</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="verification-year">Verification Year *</Label>
//                 <Input
//                   id="verification-year"
//                   type="number"
//                   min="2020"
//                   max={new Date().getFullYear() + 1}
//                   value={newVerification.year || ""}
//                   onChange={(e) => setNewVerification(prev => ({
//                     ...prev,
//                     year: Number.parseInt(e.target.value),
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="verification-status">Status *</Label>
//                 <Select
//                   value={newVerification.status}
//                   onValueChange={(value) => setNewVerification(prev => ({ ...prev, status: value }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="denied">Denied</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="verification-expiry">Expiration Date (Optional)</Label>
//                 <Input
//                   id="verification-expiry"
//                   type="date"
//                   value={newVerification.expirationDate || ""}
//                   onChange={(e) => setNewVerification(prev => ({
//                     ...prev,
//                     expirationDate: e.target.value,
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Verified By</Label>
//                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
//                   <UserIcon className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">
//                     {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="verification-notes">Notes (Optional)</Label>
//               <Textarea
//                 id="verification-notes"
//                 placeholder="Add any additional notes about this verification..."
//                 value={newVerification.notes || ""}
//                 onChange={(e) => setNewVerification(prev => ({
//                   ...prev,
//                   notes: e.target.value,
//                 }))}
//                 rows={3}
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsAddingVerification(false)
//                   setNewVerification({
//                     year: new Date().getFullYear(),
//                     status: "pending",
//                     date: new Date().toISOString().split("T")[0],
//                     notes: "",
//                     expirationDate: "",
//                   })
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleAddVerification} disabled={loading}>
//                 {loading ? "Adding..." : "Add Verification"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Training Center Assignment Form */}
//       {isAssigningTraining && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assign Training Center</CardTitle>
//             <CardDescription>
//               Assign {user.firstName} {user.lastName} to a training center
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="training-center">Training Center *</Label>
//                 {/* <Select
//                   value={trainingAssignment.trainingCenterId}
//                   onValueChange={(value) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     trainingCenterId: value
//                   }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select training center" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {trainingCenters.map(center => (
//                       <SelectItem key={center._id} value={center._id}>
//                         {center.firstName} {center.lastName} - {center.stateOfResidence}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select> */}
//                 <Select
//                   value={selectedTrainingCenter?._id || ""}
//                   onValueChange={handleTrainingCenterChange}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Training Center" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {trainingCenters.map(center => (
//                       <SelectItem key={center._id} value={center._id}>
//                         {center.trainingCentreName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {/* <Select
//                   value={selectedTrainingCenter?._id || ""}
//                   onValueChange={id => {
//                     const center = trainingCenters.find(tc => tc._id === id);
//                     setSelectedTrainingCenter(center);
//                     setTrainingAssignment(prev => ({
//                       ...prev,
//                       trainingCenterId: id
//                     }));
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Training Center" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {trainingCenters.map(center => (
//                       <SelectItem key={center._id} value={center._id}>
//                         {center.trainingCentreName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select> */}
//                 {/* Display LGA and address if a center is selected */}
//                 {selectedTrainingCenter && (
//                   <div className="mt-2 text-sm text-gray-600">
//                     <div><strong>LGA:</strong> {selectedTrainingCenter.lga}</div>
//                     <div><strong>Address:</strong> {selectedTrainingCenter.address}</div>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="training-type">Training Type *</Label>
//                 <Select
//                   value={trainingAssignment.trainingType}
//                   onValueChange={(value) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     trainingType: value
//                   }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select training type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="foundation">Foundation Training</SelectItem>
//                     <SelectItem value="skillup">Skill Upgrade</SelectItem>
//                     <SelectItem value="intending_artisan">Intending Artisan Training</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="training-year">Year *</Label>
//                 <Input
//                   id="training-year"
//                   type="number"
//                   value={trainingAssignment.year}
//                   onChange={(e) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     year: Number(e.target.value)
//                   }))}
//                 />
//               </div>

//               {/* <div className="space-y-2">
//                 <Label htmlFor="training-sector">Sector *</Label>
//                 <Input
//                   id="training-sector"
//                   value={trainingAssignment.sector}
//                   onChange={(e) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     sector: e.target.value
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="trade-area">Trade Area *</Label>
//                 <Input
//                   id="trade-area"
//                   value={trainingAssignment.tradeArea}
//                   onChange={(e) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     tradeArea: e.target.value
//                   }))}
//                 />
//               </div> */}
//               <div className="space-y-2">
//                 <Label htmlFor="training-sector">Sector *</Label>
//                 {/* <Select
//                   value={trainingAssignment.sector}
//                   onValueChange={sectorId => {
//                     setTrainingAssignment(prev => ({
//                       ...prev,
//                       sector: sectorId,
//                       tradeArea: ""
//                     }));
//                     // Find the selected sector and set its trade areas
//                     const sector = sectorsList.find(sec => sec._id === sectorId);
//                     setSectorTradeAreas(sector ? sector.tradeAreas : []);
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select sector" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {sectorsList.map(sector => (
//                       <SelectItem key={sector._id} value={sector._id}>{sector.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select> */}
//                 <Select
//                   value={selectedSector}
//                   onValueChange={id => {
//                     setSelectedSector(id);
//                     setTrainingAssignment(prev => ({
//                       ...prev,
//                       sector: id
//                     }));
//                     setSelectedTradeArea("");
//                     // When a sector is selected, get trade areas for that sector
//                     const sectorObj = centerSectors.find(sec => sec._id === id);
//                     setCenterTradeAreas(sectorObj ? sectorObj.tradeAreas : []);
//                   }}
//                   disabled={!selectedTrainingCenter}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select sector" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {centerSectors.map(sec => (
//                       <SelectItem key={sec._id} value={sec._id}>{sec.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="trade-area">Trade Area *</Label>
//                 {/* <Select
//                   value={trainingAssignment.tradeArea}
//                   onValueChange={tradeAreaId =>
//                     setTrainingAssignment(prev => ({ ...prev, tradeArea: tradeAreaId }))
//                   }
//                   disabled={!trainingAssignment.sector}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select trade area" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {sectorTradeAreas.map(tradeArea => (
//                       <SelectItem key={tradeArea._id} value={tradeArea._id}>{tradeArea.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select> */}
//                 <Select
//   value={selectedTradeArea}
//   onValueChange={id => {
//     setSelectedTradeArea(id);
//     setTrainingAssignment(prev => ({
//       ...prev,
//       tradeArea: id
//     }));
//   }}
//   disabled={!selectedSector}
// >
//   <SelectTrigger>
//     <SelectValue placeholder="Select trade area" />
//   </SelectTrigger>
//   <SelectContent>
//     {centerTradeAreas.map(ta => (
//       <SelectItem key={ta._id} value={ta._id}>{ta.name}</SelectItem>
//     ))}
//   </SelectContent>
// </Select>
//               </div>

              

//               {currentAssignment && (
//                 <div className="space-y-2">
//                   <Label htmlFor="change-reason">Reason for Reassignment *</Label>
//                   <Input
//                     id="change-reason"
//                     value={trainingAssignment.changeReason}
//                     onChange={(e) => setTrainingAssignment(prev => ({
//                       ...prev,
//                       changeReason: e.target.value
//                     }))}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="training-notes">Notes</Label>
//               <Textarea
//                 id="training-notes"
//                 placeholder="Additional notes about this assignment..."
//                 value={trainingAssignment.notes}
//                 onChange={(e) => setTrainingAssignment(prev => ({
//                   ...prev,
//                   notes: e.target.value
//                 }))}
//                 rows={3}
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsAssigningTraining(false)
//                   setCurrentAssignment(null)
//                   setTrainingAssignment({
//                     trainingCenterId: "",
//                     trainingType: "foundation",
//                     year: new Date().getFullYear(),
//                     sector: "",
//                     tradeArea: "",
//                     notes: "",
//                     changeReason: ""
//                   })
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={() => currentAssignment ? 
//                   handleReassignTraining(currentAssignment._id) : 
//                   handleAssignTraining(user.verifications[0]?._id)
//                 } 
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : currentAssignment ? "Reassign" : "Assign"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Assignment History Modal */}
//       {showHistory && currentAssignment && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assignment History</CardTitle>
//             <CardDescription>
//               History of training assignments for {user.firstName} {user.lastName}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Training Center</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Sector</TableHead>
//                   <TableHead>Trade Area</TableHead>
//                   <TableHead>Year</TableHead>
//                   <TableHead>Assigned On</TableHead>
//                   <TableHead>Changed On</TableHead>
//                   <TableHead>Reason</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {assignmentHistory.map((assignment, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       {assignment.trainingCenterId?.firstName} {assignment.trainingCenterId?.lastName}
//                     </TableCell>
//                     <TableCell>{assignment.trainingType}</TableCell>
//                     <TableCell>{assignment.sector}</TableCell>
//                     <TableCell>{assignment.tradeArea}</TableCell>
//                     <TableCell>{assignment.year}</TableCell>
//                     <TableCell>{new Date(assignment.assignedAt).toLocaleDateString()}</TableCell>
//                     <TableCell>{new Date(assignment.changedAt).toLocaleDateString()}</TableCell>
//                     <TableCell>{assignment.changeReason || "N/A"}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <div className="flex justify-end mt-4">
//               <Button onClick={() => setShowHistory(false)}>Close</Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Verification History */}
//       {/* <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileTextIcon className="h-5 w-5" />
//             Verification History
//           </CardTitle>
//           <CardDescription>Complete history of verification records for this user</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {sortedVerifications.length > 0 ? (
//             <div className="space-y-4">
//               {sortedVerifications.map((verification, index) => (
                
//                 <div
//                   key={verification._id || index}
//                   className={`p-4 border rounded-lg ${index === 0 ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-3">
//                         {getStatusIcon(verification.status)}
//                         <Badge className={getStatusColor(verification.status)}>
//                           {verification.status.toUpperCase()}
//                         </Badge>
//                         <span className="text-sm font-medium">Year {verification.year}</span>
//                         {index === 0 && (
//                           <Badge variant="outline" className="text-xs">
//                             Current
//                           </Badge>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <CalendarIcon className="h-4 w-4" />
//                           <span>Verified on: {new Date(verification.date).toLocaleDateString()}</span>
//                         </div>

//                         {verification.verifierName || verifierNames[verification.verifiedBy] ? (
//                           <div className="flex items-center gap-2">
//                             <UserIcon className="h-4 w-4" />
//                             <span>
//                               By: {verification.verifierName || verifierNames[verification.verifiedBy]}
//                             </span>
//                           </div>
//                         ) : null}

//                         {verification.expirationDate && (
//                           <div className="flex items-center gap-2">
//                             <CalendarIcon className="h-4 w-4" />
//                             <span>Expires: {new Date(verification.expirationDate).toLocaleDateString()}</span>
//                           </div>
//                         )}
//                       </div>

//                       {verification.notes && (
//                         <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
//                           <strong>Notes:</strong> {verification.notes}
//                         </div>
//                       )}

//                       {verification.trainingAssignment && (
//                         <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-medium text-green-800">Training Assignment</h4>
//                             <div className="flex gap-2">
//                               <Button 
//                                 variant="outline" 
//                                 size="sm"
//                                 onClick={() => {
//                                   setCurrentAssignment(verification.trainingAssignment)
//                                   setIsAssigningTraining(true)
//                                 }}
//                               >
//                                 Reassign
//                               </Button>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm"
//                                 onClick={() => {
//                                   setCurrentAssignment(verification.trainingAssignment)
//                                   fetchAssignmentHistory(verification.trainingAssignment._id)
//                                   setShowHistory(true)
//                                 }}
//                               >
//                                 View History
//                               </Button>
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                             <div>
//                               <span className="text-gray-600">Center:</span>{" "}
//                               <span>{verification.trainingAssignment.trainingCenterId?.firstName} {verification.trainingAssignment.trainingCenterId?.lastName}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Type:</span>{" "}
//                               <span>{verification.trainingAssignment.trainingType}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Sector:</span>{" "}
//                               <span>{verification.trainingAssignment.sector}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Trade Area:</span>{" "}
//                               <span>{verification.trainingAssignment.tradeArea}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Year:</span>{" "}
//                               <span>{verification.trainingAssignment.year}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Status:</span>{" "}
//                               <Badge variant="outline" className={
//                                 verification.trainingAssignment.status === "active" ? "bg-blue-100 text-blue-800" :
//                                 verification.trainingAssignment.status === "completed" ? "bg-green-100 text-green-800" :
//                                 "bg-gray-100 text-gray-800"
//                               }>
//                                 {verification.trainingAssignment.status}
//                               </Badge>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-col gap-2">
//                       <Select
//                         value={verification.status}
//                         onValueChange={(value) => handleUpdateVerification(verification._id, { status: value })}
//                       >
//                         <SelectTrigger className="w-32">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="pending">Pending</SelectItem>
//                           <SelectItem value="approved">Approved</SelectItem>
//                           <SelectItem value="denied">Denied</SelectItem>
//                         </SelectContent>
//                       </Select>

//                       {verification.status === "approved" && !verification.trainingAssignment && (
//                         <Button 
//                           variant="outline" 
//                           size="sm"
//                           onClick={() => {
//                             setIsAssigningTraining(true)
//                             setCurrentAssignment(null)
//                           }}
//                         >
//                           Assign Training
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//               <p>No verification records found</p>
//               <p className="text-sm">Click "Add Verification" to create the first record</p>
//             </div>
//           )}
//         </CardContent>
//       </Card> */}
// <Card>
//   <CardHeader>
//     <CardTitle className="flex items-center gap-2">
//       <FileTextIcon className="h-5 w-5" />
//       Verification History
//     </CardTitle>
//     <CardDescription>Complete history of verification records for this user</CardDescription>
//   </CardHeader>
//   <CardContent>
//     {sortedVerifications.length > 0 ? (
//       <div className="space-y-4">
//         {sortedVerifications.map((verification, index) => {
//           const hasAssignment = verification.trainingAssignment && 
//                               (typeof verification.trainingAssignment === 'object' || 
//                                typeof verification.trainingAssignment === 'string');
          
//           return (
//             <div
//               key={verification._id || index}
//               className={`p-4 border rounded-lg ${index === 0 ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     {getStatusIcon(verification.status)}
//                     <Badge className={getStatusColor(verification.status)}>
//                       {verification.status.toUpperCase()}
//                     </Badge>
//                     <span className="text-sm font-medium">Year {verification.year}</span>
//                     {index === 0 && (
//                       <Badge variant="outline" className="text-xs">
//                         Current
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                     <div className="flex items-center gap-2">
//                       <CalendarIcon className="h-4 w-4" />
//                       <span>Verified on: {new Date(verification.date).toLocaleDateString()}</span>
//                     </div>

//                     {verification.verifierName || verifierNames[verification.verifiedBy] ? (
//                       <div className="flex items-center gap-2">
//                         <UserIcon className="h-4 w-4" />
//                         <span>
//                           By: {verification.verifierName || verifierNames[verification.verifiedBy]}
//                         </span>
//                       </div>
//                     ) : null}

//                     {verification.expirationDate && (
//                       <div className="flex items-center gap-2">
//                         <CalendarIcon className="h-4 w-4" />
//                         <span>Expires: {new Date(verification.expirationDate).toLocaleDateString()}</span>
//                       </div>
//                     )}
//                   </div>

//                   {verification.notes && (
//                     <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
//                       <strong>Notes:</strong> {verification.notes}
//                     </div>
//                   )}

//                   {hasAssignment && (
//                     <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-green-800">Training Assignment</h4>
//                         <div className="flex gap-2">
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => {
//                               const assignment = typeof verification.trainingAssignment === 'object' 
//                                 ? verification.trainingAssignment
//                                 : { _id: verification.trainingAssignment };
//                               setCurrentAssignment(assignment);
//                               setIsAssigningTraining(true);
//                             }}
//                           >
//                             Reassign
//                           </Button>
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => {
//                               const assignmentId = typeof verification.trainingAssignment === 'object'
//                                 ? verification.trainingAssignment._id
//                                 : verification.trainingAssignment;
//                               fetchAssignmentHistory(assignmentId);
//                               setShowHistory(true);
//                             }}
//                           >
//                             View History
//                           </Button>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                         {typeof verification.trainingAssignment === 'object' && (
//                           <>
//                             <div>
//                               <span className="text-gray-600">Center:</span>{" "}
//                               <span>{trainingCenterName}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Type:</span>{" "}
//                               <span>{verification.trainingAssignment.trainingType}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Sector:</span>{" "}
//                               <span>{verification.trainingAssignment.sector}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Trade Area:</span>{" "}
//                               <span>{verification.trainingAssignment.tradeArea}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Year:</span>{" "}
//                               <span>{verification.trainingAssignment.year}</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Status:</span>{" "}
//                               <Badge variant="outline" className={
//                                 verification.trainingAssignment.status === "active" ? "bg-blue-100 text-blue-800" :
//                                 verification.trainingAssignment.status === "completed" ? "bg-green-100 text-green-800" :
//                                 "bg-gray-100 text-gray-800"
//                               }>
//                                 {verification.trainingAssignment.status || 'active'}
//                               </Badge>
//                             </div>
//                           </>
//                         )}
//                         {typeof verification.trainingAssignment === 'string' && (
//                           <div className="col-span-2">
//                             <span className="text-gray-600">Assignment ID:</span>{" "}
//                             <span>{verification.trainingAssignment}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <Select
//                     value={verification.status}
//                     onValueChange={(value) => handleUpdateVerification(verification._id, { status: value })}
//                   >
//                     <SelectTrigger className="w-32">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="approved">Approved</SelectItem>
//                       <SelectItem value="denied">Denied</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   {/* Only show Assign Training button if status is approved and no assignment exists */}
//                   {verification.status === "approved" && !hasAssignment && (
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       onClick={() => {
//                         setIsAssigningTraining(true);
//                         setCurrentAssignment(null);
//                       }}
//                     >
//                       Assign Training
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//         <p>No verification records found</p>
//         <p className="text-sm">Click "Add Verification" to create the first record</p>
//       </div>
//     )}
//   </CardContent>
// </Card>
//     </div>
//   )
// }

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
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const [verifierNames, setVerifierNames] = useState({})
  const [trainingCenters, setTrainingCenters] = useState([])
  const [isAssigningTraining, setIsAssigningTraining] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState(null)
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState(null)
  const [sectorsList, setSectorsList] = useState([])
  const [sectorTradeAreas, setSectorTradeAreas] = useState([])
  const [allSectors, setAllSectors] = useState([])
  const [centerSectors, setCenterSectors] = useState([])
  const [centerTradeAreas, setCenterTradeAreas] = useState([])
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedTradeArea, setSelectedTradeArea] = useState("")
  const [currentVerificationId, setCurrentVerificationId] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)

  // Helper to reset form state
  const resetAssignForm = () => {
    setIsAssigningTraining(false)
    setCurrentAssignment(null)
    setCurrentVerificationId(null)
    setTrainingAssignment({
      trainingCenterId: "",
      trainingType: "foundation",
      year: new Date().getFullYear(),
      sector: "",
      tradeArea: "",
      notes: "",
      changeReason: ""
    })
    setSelectedTrainingCenter(null)
    setSelectedSector("")
    setSelectedTradeArea("")
    setCenterSectors([])
    setCenterTradeAreas([])
  }

  const [trainingAssignment, setTrainingAssignment] = useState({
    trainingCenterId: "",
    trainingType: "foundation",
    year: new Date().getFullYear(),
    sector: "",
    tradeArea: "",
    notes: "",
    changeReason: ""
  })

  // Helper to check if verification has a valid assignment
  const hasValidAssignment = (verification) => {
    if (!verification.trainingAssignment) return false
    
    // If it's a string, check if it's not empty
    if (typeof verification.trainingAssignment === 'string') {
      return verification.trainingAssignment.trim() !== ""
    }
    
    // If it's an object, check if it has required fields
    if (typeof verification.trainingAssignment === 'object') {
      return !!verification.trainingAssignment._id && 
             !!verification.trainingAssignment.trainingCenterId
    }
    
    return false
  }

  useEffect(() => {
    // Fetch verifier names
    const ids = Array.from(
      new Set((user.verifications || [])
        .map(v => v.verifiedBy)
        .filter(Boolean)) );
    
    const fetchNames = async () => {
      const names = {}
      for (const id of ids) {
        if (!verifierNames[id]) {
          const accessToken = localStorage.getItem("accessToken")
          try {
            const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            const user = res.data.data
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
            names[id] = fullName ? fullName : user.email
          } catch (error) {
            console.error(`Failed to fetch verifier info for ID ${id}:`, error)
            names[id] = "Unknown User"
          }
        }
      }
      setVerifierNames(prev => ({ ...prev, ...names }))
    }

    if (ids.length) fetchNames()
  }, [user.verifications])

  useEffect(() => {
    // Fetch training centers in user's state when needed
    if (isAssigningTraining && user.stateOfResidence) {
      fetchTrainingCenters()
    }
  }, [isAssigningTraining, user.stateOfResidence])

  const fetchTrainingCenters = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        params: {
          state: user.stateOfResidence,
          currentAssessmentStatus: "approved"
        },
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setTrainingCenters(response.data.data || [])
    } catch (error) {
      console.error("Error fetching training centers:", error)
      toast.error("Failed to load training centers")
    }
  }

  useEffect(() => {
    axios.get(`${API_BASE_URL}/sectors`)
      .then(res => setAllSectors(res.data.data || []))
  }, [])

  useEffect(() => {
    if (isAssigningTraining) {
      axios.get(`${API_BASE_URL}/sectors`)
        .then(res => setSectorsList(res.data.data || []))
        .catch(() => setSectorsList([]))
    }
  }, [isAssigningTraining])

  // When a training center is selected:
  const handleTrainingCenterChange = (id) => {
    const center = trainingCenters.find(tc => tc._id === id)
    setSelectedTrainingCenter(center)
    setTrainingAssignment(prev => ({
      ...prev,
      trainingCenterId: id
    }))

    // Extract unique sector IDs from the center's tradeAreas
    const sectorIds = Array.from(
      new Set(
        (center.legalInfo?.tradeAreas || [])
          .map(ta => ta.sector?.toString() || ta.sector)
          .filter(Boolean)
      )
    )

    // Map sector IDs to sector objects (with names)
    const sectors = allSectors.filter(sec => sectorIds.includes(sec._id))
    setCenterSectors(sectors) // Now an array of sector objects

    setSelectedSector("")
    setSelectedTradeArea("")
    setCenterTradeAreas([])
  }

  // When a sector is selected, extract trade areas for that sector
  const handleSectorChange = (sectorId) => {
    setSelectedSector(sectorId)
    const sectorObj = allSectors.find(sec => sec._id === sectorId)
    setTrainingAssignment(prev => ({
      ...prev,
      sector: sectorId
    }))
    setSelectedTradeArea("")
    setCenterTradeAreas(sectorObj?.tradeAreas || [])
  }

  const fetchAssignmentHistory = async (assignmentId) => {
    setHistoryLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/history`, 
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      
      // Ensure we have the current assignment in history
      const history = response.data?.data?.history || []
      
      // If we have a current assignment, make sure it's included
      if (currentAssignment && !history.some(a => a._id === currentAssignment._id)) {
        history.unshift(currentAssignment)
      }
      
      setAssignmentHistory(history)
      
    } catch (error) {
      console.error("Error fetching assignment history:", error)
      toast.error("Failed to load assignment history")
      
      // Fallback to showing just the current assignment if available
      if (currentAssignment) {
        setAssignmentHistory([currentAssignment])
      } else {
        setAssignmentHistory([])
      }
    } finally {
      setHistoryLoading(false)
    }
  }

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
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (response.data?.success) {
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
        `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}`,
        {
          ...updatedData,
          verifiedBy: currentUser?.id || currentUser?._id,
          verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (response.data?.success) {
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

  const handleAssignTraining = async () => {
    if (!currentVerificationId) {
      toast.error("No verification selected for assignment")
      return
    }
    if (!trainingAssignment.trainingCenterId || !trainingAssignment.sector || !trainingAssignment.tradeArea) {
      toast.error("Please select a training center, sector, and trade area")
      return
    }
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const sectorObj = allSectors.find(sec => sec._id === trainingAssignment.sector)
      const tradeAreaObj = sectorObj?.tradeAreas.find(ta => ta._id === trainingAssignment.tradeArea)
      const payload = {
        trainingCenterId: trainingAssignment.trainingCenterId,
        trainingType: trainingAssignment.trainingType,
        year: trainingAssignment.year,
        sector: sectorObj?.name || "",
        tradeArea: tradeAreaObj?.name || "",
        notes: trainingAssignment.notes,
        changeReason: trainingAssignment.changeReason
      }
      const response = await axios.post(
        `${API_BASE_URL}/training/users/${user._id}/verifications/${currentVerificationId}/assign`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data?.success) {
        toast.success("Training center assigned successfully")
        const updatedUser = await fetchUpdatedUser(user._id)
        onVerificationUpdate(updatedUser)
        resetAssignForm()
      }
    } catch (error) {
      toast.error("Failed to assign training: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleReassignTraining = async (assignmentId) => {
    if (!trainingAssignment.trainingCenterId || !trainingAssignment.changeReason) {
      toast.error("Please select a training center and provide a reason for reassignment")
      return
    }
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const sectorObj = allSectors.find(sec => sec._id === trainingAssignment.sector)
      const tradeAreaObj = sectorObj?.tradeAreas.find(ta => ta._id === trainingAssignment.tradeArea)
      const payload = {
        ...trainingAssignment,
        sector: sectorObj?.name || "",
        tradeArea: tradeAreaObj?.name || "",
        assignedBy: currentUser?.id || currentUser?._id
      }
      const response = await axios.patch(
        `${API_BASE_URL}/training/training-assignments/${assignmentId}/reassign`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data?.success) {
        toast.success("Training reassigned successfully")
        const updatedUser = await fetchUpdatedUser(user._id)
        onVerificationUpdate(updatedUser)
        resetAssignForm()
        
        // Refresh the assignment history if viewing history
        if (showHistory) {
          fetchAssignmentHistory(assignmentId)
        }
      }
    } catch (error) {
      toast.error("Failed to reassign training: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const fetchUpdatedUser = async (userId) => {
    const accessToken = localStorage.getItem("accessToken")
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return response.data.data
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case "denied": return <XCircleIcon className="h-4 w-4 text-red-600" />
      default: return <ClockIcon className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200"
      case "denied": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const fetchAssignmentById = async (assignmentId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(
      `${API_BASE_URL}/training/training-assignments/${assignmentId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.data?.data || null;
  } catch (error) {
    toast.error("Failed to fetch assignment details");
    return null;
  }
};

  // Normalize training assignments to objects
  const normalizedVerifications = (user.verifications || []).map(v => {
    if (v.trainingAssignment && typeof v.trainingAssignment === 'string') {
      return {
        ...v,
        trainingAssignment: v.trainingAssignment.trim() ? { _id: v.trainingAssignment } : null
      }
    }
    return v
  })

  const sortedVerifications = normalizedVerifications.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
                  onChange={(e) => setNewVerification(prev => ({
                    ...prev,
                    year: Number.parseInt(e.target.value),
                  }))}
                />
              </div>

              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
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
                onChange={(e) => setNewVerification(prev => ({
                  ...prev,
                  notes: e.target.value,
                }))}
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
                    {trainingCenters.map(center => (
                      <SelectItem key={center._id} value={center._id}>
                        {center.trainingCentreName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTrainingCenter && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div><strong>LGA:</strong> {selectedTrainingCenter.lga}</div>
                    <div><strong>Address:</strong> {selectedTrainingCenter.address}</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="training-type">Training Type *</Label>
                <Select
                  value={trainingAssignment.trainingType}
                  onValueChange={(value) => setTrainingAssignment(prev => ({
                    ...prev,
                    trainingType: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select training type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Foundation Training</SelectItem>
                    <SelectItem value="skillup">Skill Upgrade</SelectItem>
                    <SelectItem value="intending_artisan">Intending Artisan Training</SelectItem>
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
                  onChange={(e) => setTrainingAssignment(prev => ({
                    ...prev,
                    year: Number(e.target.value)
                  }))}
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
                    {centerSectors.map(sec => (
                      <SelectItem key={sec._id} value={sec._id}>{sec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trade-area">Trade Area *</Label>
                <Select
                  value={selectedTradeArea}
                  onValueChange={(id) => {
                    setSelectedTradeArea(id)
                    setTrainingAssignment(prev => ({
                      ...prev,
                      tradeArea: id
                    }))
                  }}
                  disabled={!selectedSector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade area" />
                  </SelectTrigger>
                  <SelectContent>
                    {centerTradeAreas.map(ta => (
                      <SelectItem key={ta._id} value={ta._id}>{ta.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentAssignment && (
                <div className="space-y-2">
                  <Label htmlFor="change-reason">Reason for Reassignment *</Label>
                  <Input
                    id="change-reason"
                    value={trainingAssignment.changeReason}
                    onChange={(e) => setTrainingAssignment(prev => ({
                      ...prev,
                      changeReason: e.target.value
                    }))}
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
                onChange={(e) => setTrainingAssignment(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={resetAssignForm}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => currentAssignment ? 
                  handleReassignTraining(currentAssignment._id) : 
                  handleAssignTraining()
                } 
                disabled={loading}
              >
                {loading ? "Processing..." : currentAssignment ? "Reassign" : "Assign"}
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
              History of training assignments for {user.firstName} {user.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Training Center</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Trade Area</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Assigned On</TableHead>
                      <TableHead>Changed On</TableHead>
                      <TableHead>Assigned By</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignmentHistory.map((assignment, index) => {
                      // Get training center name
                      const centerName = assignment.trainingCenterId?.trainingCentreName || 
                                        assignment.trainingCenterId?.name || 
                                        `${assignment.trainingCenterId?.firstName || ''} ${assignment.trainingCenterId?.lastName || ''}`.trim() || 
                                        "Unknown Center";
                      
                      // Get assigned by name
                      const assignedByName = verifierNames[assignment.assignedBy] || 
                                          assignment.assignedBy?.name || 
                                          "Unknown";

                      return (
                        <TableRow key={index}>
                          <TableCell>{centerName}</TableCell>
                          <TableCell>{assignment.trainingType}</TableCell>
                          <TableCell>{assignment.sector}</TableCell>
                          <TableCell>{assignment.tradeArea}</TableCell>
                          <TableCell>{assignment.year}</TableCell>
                          <TableCell>{new Date(assignment.assignedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(assignment.changedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{assignedByName}</TableCell>
                          <TableCell>{assignment.changeReason || "N/A"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
          <CardDescription>Complete history of verification records for this user</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedVerifications.length > 0 ? (
            <div className="space-y-4">
              {sortedVerifications.map((verification, index) => {
                const hasAssignment = hasValidAssignment(verification)
                
                const trainingCenterName = (() => {
                  if (!hasAssignment) return ""
                  const centerId = verification.trainingAssignment.trainingCenterId
                  if (typeof centerId === "object") {
                    return centerId.trainingCentreName || centerId.name || ""
                  }
                  const found = trainingCenters.find(tc => tc._id === centerId)
                  return found?.trainingCentreName || ""
                })()

                return (
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

                        {hasAssignment && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-green-800">Training Assignment</h4>
                              <div className="flex gap-2">
                                {/* <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const assignment = typeof verification.trainingAssignment === 'object' 
                                      ? verification.trainingAssignment
                                      : { _id: verification.trainingAssignment }
                                    setCurrentAssignment(assignment)
                                    setIsAssigningTraining(true)
                                    setCurrentVerificationId(verification._id)
                                    
                                    // Pre-fill form with existing assignment data
                                    setTrainingAssignment({
                                      trainingCenterId: assignment.trainingCenterId?._id || assignment.trainingCenterId || "",
                                      trainingType: assignment.trainingType || "foundation",
                                      year: assignment.year || new Date().getFullYear(),
                                      sector: assignment.sectorId || assignment.sector || "",
                                      tradeArea: assignment.tradeAreaId || assignment.tradeArea || "",
                                      notes: assignment.notes || "",
                                      changeReason: ""
                                    })
                                  }}
                                >
                                  Reassign
                                </Button> */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    let assignment = verification.trainingAssignment;
                                    // If it's just an ID, fetch the full object
                                    if (typeof assignment === "string") {
                                      assignment = await fetchAssignmentById(assignment);
                                      if (!assignment) return; // error already shown
                                    }
                                    setCurrentAssignment(assignment);
                                    setIsAssigningTraining(true);
                                    setCurrentVerificationId(verification._id);

                                    // Pre-fill form with assignment data
                                    setTrainingAssignment({
                                      trainingCenterId: assignment.trainingCenterId?._id || assignment.trainingCenterId || "",
                                      trainingType: assignment.trainingType || "foundation",
                                      year: assignment.year || new Date().getFullYear(),
                                      sector: assignment.sectorId || assignment.sector || "",
                                      tradeArea: assignment.tradeAreaId || assignment.tradeArea || "",
                                      notes: assignment.notes || "",
                                      changeReason: ""
                                    });

                                    // Pre-select center/sector/tradeArea in UI
                                    if (assignment.trainingCenterId) {
                                      const centerId = typeof assignment.trainingCenterId === "object"
                                        ? assignment.trainingCenterId._id
                                        : assignment.trainingCenterId;
                                      handleTrainingCenterChange(centerId);
                                    }
                                  }}
                                >
                                  Reassign
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const assignmentId = typeof verification.trainingAssignment === 'object'
                                      ? verification.trainingAssignment._id
                                      : verification.trainingAssignment
                                    setCurrentAssignment(verification.trainingAssignment)
                                    fetchAssignmentHistory(assignmentId)
                                    setShowHistory(true)
                                  }}
                                >
                                  View History
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              {typeof verification.trainingAssignment === 'object' && (
                                <>
                                  <div>
                                    <span className="text-gray-600">Center:</span>{" "}
                                    <span>{trainingCenterName}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Type:</span>{" "}
                                    <span>{verification.trainingAssignment.trainingType}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Sector:</span>{" "}
                                    <span>{verification.trainingAssignment.sector}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Trade Area:</span>{" "}
                                    <span>{verification.trainingAssignment.tradeArea}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Year:</span>{" "}
                                    <span>{verification.trainingAssignment.year}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Status:</span>{" "}
                                    <Badge variant="outline" className={
                                      verification.trainingAssignment.status === "active" ? "bg-blue-100 text-blue-800" :
                                      verification.trainingAssignment.status === "completed" ? "bg-green-100 text-green-800" :
                                      "bg-gray-100 text-gray-800"
                                    }>
                                      {verification.trainingAssignment.status || 'active'}
                                    </Badge>
                                  </div>
                                </>
                              )}
                              {typeof verification.trainingAssignment === 'string' && (
                                <div className="col-span-2">
                                  <span className="text-gray-600">Assignment ID:</span>{" "}
                                  <span>{verification.trainingAssignment}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
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

                        {/* {verification.status === "approved" && !hasAssignment && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsAssigningTraining(true)
                              setCurrentAssignment(null)
                              setCurrentVerificationId(verification._id)
                            }}
                          >
                            Assign Training
                          </Button>
                        )} */}
                        {verification.status === "approved" && !hasValidAssignment(verification) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsAssigningTraining(true);
                              setCurrentAssignment(null);
                              setCurrentVerificationId(verification._id);
                              // Reset form for new assignment
                              setTrainingAssignment({
                                trainingCenterId: "",
                                trainingType: "foundation",
                                year: verification.year || new Date().getFullYear(),
                                sector: "",
                                tradeArea: "",
                                notes: "",
                                changeReason: ""
                              });
                            }}
                          >
                            Assign Training
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
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

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, UserIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Plus } from "lucide-react"
// import { toast } from "sonner"
// import axios from "axios"
// import { API_BASE_URL } from "@/config/env"
// import { Separator } from "@/components/ui/separator"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// export function VerificationStatusManager({ user, onVerificationUpdate, currentUser }) {
//   const [isAddingVerification, setIsAddingVerification] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [newVerification, setNewVerification] = useState({
//     year: new Date().getFullYear(),
//     status: "pending",
//     date: new Date().toISOString().split("T")[0],
//     notes: "",
//     expirationDate: "",
//   })
//   const [verifierNames, setVerifierNames] = useState({})
//   const [trainingCenters, setTrainingCenters] = useState([])
//   const [isAssigningTraining, setIsAssigningTraining] = useState(false)
//   const [currentAssignment, setCurrentAssignment] = useState(null)
//   const [assignmentHistory, setAssignmentHistory] = useState([])
//   const [showHistory, setShowHistory] = useState(false)
//   const [selectedTrainingCenter, setSelectedTrainingCenter] = useState(null)
//   const [sectorsList, setSectorsList] = useState([])
//   const [sectorTradeAreas, setSectorTradeAreas] = useState([])
//   const [allSectors, setAllSectors] = useState([])
//   const [centerSectors, setCenterSectors] = useState([])
//   const [centerTradeAreas, setCenterTradeAreas] = useState([])
//   const [selectedSector, setSelectedSector] = useState("")
//   const [selectedTradeArea, setSelectedTradeArea] = useState("")
//   const [currentVerificationId, setCurrentVerificationId] = useState(null)

//   // Helper to reset form state
//   const resetAssignForm = () => {
//     setIsAssigningTraining(false)
//     setCurrentAssignment(null)
//     setCurrentVerificationId(null)
//     setTrainingAssignment({
//       trainingCenterId: "",
//       trainingType: "foundation",
//       year: new Date().getFullYear(),
//       sector: "",
//       tradeArea: "",
//       notes: "",
//       changeReason: ""
//     })
//     setSelectedTrainingCenter(null)
//     setSelectedSector("")
//     setSelectedTradeArea("")
//     setCenterSectors([])
//     setCenterTradeAreas([])
//   }

//   const [trainingAssignment, setTrainingAssignment] = useState({
//     trainingCenterId: "",
//     trainingType: "foundation",
//     year: new Date().getFullYear(),
//     sector: "",
//     tradeArea: "",
//     notes: "",
//     changeReason: ""
//   })

//   useEffect(() => {
//     // Fetch verifier names
//     const ids = Array.from(
//       new Set((user.verifications || [])
//         .map(v => v.verifiedBy)
//         .filter(Boolean))
//     );
    
//     const fetchNames = async () => {
//       const names = {}
//       for (const id of ids) {
//         if (!verifierNames[id]) {
//           const accessToken = localStorage.getItem("accessToken")
//           try {
//             const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
//               headers: { Authorization: `Bearer ${accessToken}` },
//             })
//             const user = res.data.data
//             const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
//             names[id] = fullName ? fullName : user.email
//           } catch (error) {
//             console.error(`Failed to fetch verifier info for ID ${id}:`, error)
//             names[id] = "Unknown User"
//           }
//         }
//       }
//       setVerifierNames(prev => ({ ...prev, ...names }))
//     }

//     if (ids.length) fetchNames()
//   }, [user.verifications])

//   useEffect(() => {
//     // Fetch training centers in user's state when needed
//     if (isAssigningTraining && user.stateOfResidence) {
//       fetchTrainingCenters()
//     }
//   }, [isAssigningTraining, user.stateOfResidence])

//   const fetchTrainingCenters = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.get(`${API_BASE_URL}/training-centers`, {
//         params: {
//           state: user.stateOfResidence,
//           currentAssessmentStatus: "approved"
//         },
//         headers: { Authorization: `Bearer ${accessToken}` }
//       })
//       setTrainingCenters(response.data.data || [])
//     } catch (error) {
//       console.error("Error fetching training centers:", error)
//       toast.error("Failed to load training centers")
//     }
//   }

//   useEffect(() => {
//     axios.get(`${API_BASE_URL}/sectors`)
//       .then(res => setAllSectors(res.data.data || []))
//   }, [])

//   useEffect(() => {
//     if (isAssigningTraining) {
//       axios.get(`${API_BASE_URL}/sectors`)
//         .then(res => setSectorsList(res.data.data || []))
//         .catch(() => setSectorsList([]))
//     }
//   }, [isAssigningTraining])

//   // When a training center is selected:
//   const handleTrainingCenterChange = (id) => {
//     const center = trainingCenters.find(tc => tc._id === id)
//     setSelectedTrainingCenter(center)
//     setTrainingAssignment(prev => ({
//       ...prev,
//       trainingCenterId: id
//     }))

//     // Extract unique sector IDs from the center's tradeAreas
//     const sectorIds = Array.from(
//       new Set(
//         (center.legalInfo?.tradeAreas || [])
//           .map(ta => ta.sector?.toString() || ta.sector)
//           .filter(Boolean)
//       )
//     )

//     // Map sector IDs to sector objects (with names)
//     const sectors = allSectors.filter(sec => sectorIds.includes(sec._id))
//     setCenterSectors(sectors) // Now an array of sector objects

//     setSelectedSector("")
//     setSelectedTradeArea("")
//     setCenterTradeAreas([])
//   }

//   // When a sector is selected, extract trade areas for that sector
//   const handleSectorChange = (sectorId) => {
//     setSelectedSector(sectorId)
//     const sectorObj = allSectors.find(sec => sec._id === sectorId)
//     setTrainingAssignment(prev => ({
//       ...prev,
//       sector: sectorId
//     }))
//     setSelectedTradeArea("")
//     setCenterTradeAreas(sectorObj?.tradeAreas || [])
//   }

//   const fetchAssignmentHistory = async (assignmentId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         `${API_BASE_URL}/training/training-assignments/${assignmentId}/history`, 
//         {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         }
//       );
      
//       // Ensure we have the current assignment in history
//       const history = response.data?.data?.history || [];
      
//       // If we have a current assignment, make sure it's included
//       if (currentAssignment && !history.some(a => a._id === currentAssignment._id)) {
//         history.unshift(currentAssignment);
//       }
      
//       setAssignmentHistory(history);
      
//     } catch (error) {
//       console.error("Error fetching assignment history:", error);
//       toast.error("Failed to load assignment history");
      
//       // Fallback to showing just the current assignment if available
//       if (currentAssignment) {
//         setAssignmentHistory([currentAssignment]);
//       } else {
//         setAssignmentHistory([]);
//       }
//     }
//   };

//   const handleAddVerification = async () => {
//     if (!newVerification.year || !newVerification.status) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const verificationData = {
//         newVerification: {
//           ...newVerification,
//           verifiedBy: currentUser?.id || currentUser?._id,
//           verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
//           date: new Date().toISOString(),
//         },
//       }

//       const response = await axios.patch(`${API_BASE_URL}/users/${user._id}`, verificationData, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       })

//       if (response.data?.success) {
//         toast.success("Verification record added successfully")
//         onVerificationUpdate(response.data.data)
//         setIsAddingVerification(false)
//         setNewVerification({
//           year: new Date().getFullYear(),
//           status: "pending",
//           date: new Date().toISOString().split("T")[0],
//           notes: "",
//           expirationDate: "",
//         })
//       }
//     } catch (error) {
//       console.error("Error adding verification:", error)
//       toast.error("Failed to add verification: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateVerification = async (verificationId, updatedData) => {
//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const response = await axios.patch(
//         `${API_BASE_URL}/training/users/${user._id}/verifications/${verificationId}`,
//         {
//           ...updatedData,
//           verifiedBy: currentUser?.id || currentUser?._id,
//           verifierName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email,
//         },
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       )

//       if (response.data?.success) {
//         toast.success("Verification updated successfully")
//         onVerificationUpdate(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error updating verification:", error)
//       toast.error("Failed to update verification: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAssignTraining = async () => {
//     if (!currentVerificationId) {
//       toast.error("No verification selected for assignment")
//       return
//     }
//     if (!trainingAssignment.trainingCenterId || !trainingAssignment.sector || !trainingAssignment.tradeArea) {
//       toast.error("Please select a training center, sector, and trade area")
//       return
//     }
//     setLoading(true)
//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       const sectorObj = allSectors.find(sec => sec._id === trainingAssignment.sector)
//       const tradeAreaObj = sectorObj?.tradeAreas.find(ta => ta._id === trainingAssignment.tradeArea)
//       const payload = {
//         trainingCenterId: trainingAssignment.trainingCenterId,
//         trainingType: trainingAssignment.trainingType,
//         year: trainingAssignment.year,
//         sector: sectorObj?.name || "",
//         tradeArea: tradeAreaObj?.name || "",
//         notes: trainingAssignment.notes,
//         changeReason: trainingAssignment.changeReason
//       }
//       const response = await axios.post(
//         `${API_BASE_URL}/training/users/${user._id}/verifications/${currentVerificationId}/assign`,
//         payload,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       )
//       if (response.data?.success) {
//         toast.success("Training center assigned successfully")
//         const updatedUser = await fetchUpdatedUser(user._id)
//         onVerificationUpdate(updatedUser)
//         resetAssignForm()
//       }
//     } catch (error) {
//       toast.error("Failed to assign training: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

// const handleReassignTraining = async (assignmentId) => {
//   if (!trainingAssignment.trainingCenterId || !trainingAssignment.changeReason) {
//     toast.error("Please select a training center and provide a reason for reassignment");
//     return;
//   }

//   setLoading(true);
//   try {
//     const accessToken = localStorage.getItem("accessToken");
    
//     // Get the sector and trade area names from their IDs
//     const sectorObj = allSectors.find(sec => sec._id === trainingAssignment.sector);
//     const tradeAreaObj = sectorObj?.tradeAreas?.find(ta => ta._id === trainingAssignment.tradeArea);

//     const payload = {
//       trainingCenterId: trainingAssignment.trainingCenterId,
//       trainingType: trainingAssignment.trainingType,
//       year: trainingAssignment.year,
//       sector: sectorObj?.name || trainingAssignment.sector,
//       tradeArea: tradeAreaObj?.name || trainingAssignment.tradeArea,
//       notes: trainingAssignment.notes,
//       changeReason: trainingAssignment.changeReason,
//       assignedBy: currentUser?.id || currentUser?._id
//     };

//     const response = await axios.patch(
//       `${API_BASE_URL}/training/training-assignments/${assignmentId}/reassign`,
//       payload,
//       { headers: { Authorization: `Bearer ${accessToken}` } }
//     );

//     if (response.data?.success) {
//       toast.success("Training reassigned successfully");
//       const updatedUser = await fetchUpdatedUser(user._id);
//       onVerificationUpdate(updatedUser);
//       resetAssignForm();
      
//       // Refresh the assignment history if viewing history
//       if (showHistory) {
//         fetchAssignmentHistory(assignmentId);
//       }
//     }
//   } catch (error) {
//     console.error("Error reassigning training:", error);
//     toast.error("Failed to reassign training: " + (error.response?.data?.message || error.message));
//   } finally {
//     setLoading(false);
//   }
// };

// const hasValidAssignment = (verification) => {
//   if (!verification.trainingAssignment) return false;
  
//   // If it's a string, check if it's not empty
//   if (typeof verification.trainingAssignment === 'string') {
//     return verification.trainingAssignment.trim() !== "";
//   }
  
//   // If it's an object, check if it has required fields
//   if (typeof verification.trainingAssignment === 'object') {
//     return !!verification.trainingAssignment._id && 
//            !!verification.trainingAssignment.trainingCenterId;
//   }
  
//   return false;
// };

//   const fetchUpdatedUser = async (userId) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     })
//     return response.data.data
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved": return <CheckCircleIcon className="h-4 w-4 text-green-600" />
//       case "denied": return <XCircleIcon className="h-4 w-4 text-red-600" />
//       default: return <ClockIcon className="h-4 w-4 text-yellow-600" />
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved": return "bg-green-100 text-green-800 border-green-200"
//       case "denied": return "bg-red-100 text-red-800 border-red-200"
//       default: return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     }
//   }

//   const sortedVerifications = (user.verifications || []).sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   )

//   return (
//     <div className="space-y-6">
//       {/* Current Status Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             {getStatusIcon(user.currentVerificationStatus)}
//             Current Verification Status
//           </CardTitle>
//           <CardDescription>
//             Latest verification status for {user.firstName} {user.lastName}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between">
//             <Badge className={getStatusColor(user.currentVerificationStatus)}>
//               {user.currentVerificationStatus?.toUpperCase() || "PENDING"}
//             </Badge>
//             <Button 
//               onClick={() => setIsAddingVerification(true)} 
//               size="sm" 
//               className="flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               Add Verification
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add New Verification Form */}
//       {isAddingVerification && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add New Verification Record</CardTitle>
//             <CardDescription>Create a new verification record for this user</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="verification-year">Verification Year *</Label>
//                 <Input
//                   id="verification-year"
//                   type="number"
//                   min="2020"
//                   max={new Date().getFullYear() + 1}
//                   value={newVerification.year || ""}
//                   onChange={(e) => setNewVerification(prev => ({
//                     ...prev,
//                     year: Number.parseInt(e.target.value),
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="verification-status">Status *</Label>
//                 <Select
//                   value={newVerification.status}
//                   onValueChange={(value) => setNewVerification(prev => ({ ...prev, status: value }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="denied">Denied</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="verification-expiry">Expiration Date (Optional)</Label>
//                 <Input
//                   id="verification-expiry"
//                   type="date"
//                   value={newVerification.expirationDate || ""}
//                   onChange={(e) => setNewVerification(prev => ({
//                     ...prev,
//                     expirationDate: e.target.value,
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Verified By</Label>
//                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
//                   <UserIcon className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">
//                     {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.email}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="verification-notes">Notes (Optional)</Label>
//               <Textarea
//                 id="verification-notes"
//                 placeholder="Add any additional notes about this verification..."
//                 value={newVerification.notes || ""}
//                 onChange={(e) => setNewVerification(prev => ({
//                   ...prev,
//                   notes: e.target.value,
//                 }))}
//                 rows={3}
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsAddingVerification(false)
//                   setNewVerification({
//                     year: new Date().getFullYear(),
//                     status: "pending",
//                     date: new Date().toISOString().split("T")[0],
//                     notes: "",
//                     expirationDate: "",
//                   })
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleAddVerification} disabled={loading}>
//                 {loading ? "Adding..." : "Add Verification"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Training Center Assignment Form */}
//       {isAssigningTraining && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assign Training Center</CardTitle>
//             <CardDescription>
//               Assign {user.firstName} {user.lastName} to a training center
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="training-center">Training Center *</Label>
//                 <Select
//                   value={selectedTrainingCenter?._id || ""}
//                   onValueChange={handleTrainingCenterChange}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Training Center" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {trainingCenters.map(center => (
//                       <SelectItem key={center._id} value={center._id}>
//                         {center.trainingCentreName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {selectedTrainingCenter && (
//                   <div className="mt-2 text-sm text-gray-600">
//                     <div><strong>LGA:</strong> {selectedTrainingCenter.lga}</div>
//                     <div><strong>Address:</strong> {selectedTrainingCenter.address}</div>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="training-type">Training Type *</Label>
//                 <Select
//                   value={trainingAssignment.trainingType}
//                   onValueChange={(value) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     trainingType: value
//                   }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select training type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="foundation">Foundation Training</SelectItem>
//                     <SelectItem value="skillup">Skill Upgrade</SelectItem>
//                     <SelectItem value="intending_artisan">Intending Artisan Training</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="training-year">Year *</Label>
//                 <Input
//                   id="training-year"
//                   type="number"
//                   value={trainingAssignment.year}
//                   onChange={(e) => setTrainingAssignment(prev => ({
//                     ...prev,
//                     year: Number(e.target.value)
//                   }))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="training-sector">Sector *</Label>
//                 <Select
//                   value={selectedSector}
//                   onValueChange={handleSectorChange}
//                   disabled={!selectedTrainingCenter}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select sector" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {centerSectors.map(sec => (
//                       <SelectItem key={sec._id} value={sec._id}>{sec.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="trade-area">Trade Area *</Label>
//                 <Select
//                   value={selectedTradeArea}
//                   onValueChange={(id) => {
//                     setSelectedTradeArea(id)
//                     setTrainingAssignment(prev => ({
//                       ...prev,
//                       tradeArea: id
//                     }))
//                   }}
//                   disabled={!selectedSector}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select trade area" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {centerTradeAreas.map(ta => (
//                       <SelectItem key={ta._id} value={ta._id}>{ta.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {currentAssignment && (
//                 <div className="space-y-2">
//                   <Label htmlFor="change-reason">Reason for Reassignment *</Label>
//                   <Input
//                     id="change-reason"
//                     value={trainingAssignment.changeReason}
//                     onChange={(e) => setTrainingAssignment(prev => ({
//                       ...prev,
//                       changeReason: e.target.value
//                     }))}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="training-notes">Notes</Label>
//               <Textarea
//                 id="training-notes"
//                 placeholder="Additional notes about this assignment..."
//                 value={trainingAssignment.notes}
//                 onChange={(e) => setTrainingAssignment(prev => ({
//                   ...prev,
//                   notes: e.target.value
//                 }))}
//                 rows={3}
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={resetAssignForm}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={() => currentAssignment ? 
//                   handleReassignTraining(currentAssignment._id) : 
//                   handleAssignTraining()
//                 } 
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : currentAssignment ? "Reassign" : "Assign"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Assignment History Modal */}
//       {showHistory && currentAssignment && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assignment History</CardTitle>
//             <CardDescription>
//               History of training assignments for {user.firstName} {user.lastName}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//               </div>
//             ) : (
//               <>
//                 <Table>
//                   {/* Table content as shown above */}
//                 </Table>
//                 <div className="flex justify-end mt-4">
//                   <Button onClick={() => setShowHistory(false)}>Close</Button>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Verification History */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileTextIcon className="h-5 w-5" />
//             Verification History
//           </CardTitle>
//           <CardDescription>Complete history of verification records for this user</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {sortedVerifications.length > 0 ? (
//             <div className="space-y-4">
//               {sortedVerifications.map((verification, index) => {
//                 const hasAssignment = hasValidAssignment(verification);
                
//                 const trainingCenterName = (() => {
//                   if (!hasAssignment) return "";
//                   const centerId = verification.trainingAssignment.trainingCenterId;
//                   if (typeof centerId === "object") {
//                     return centerId.trainingCentreName || centerId.name || "";
//                   }
//                   const found = trainingCenters.find(tc => tc._id === centerId);
//                   return found?.trainingCentreName || "";
//                 })();

//                 return (
//                   <div
//                     key={verification._id || index}
//                     className={`p-4 border rounded-lg ${index === 0 ? "border-blue-200 bg-blue-50" : "border-gray-200"}`}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-3">
//                           {getStatusIcon(verification.status)}
//                           <Badge className={getStatusColor(verification.status)}>
//                             {verification.status.toUpperCase()}
//                           </Badge>
//                           <span className="text-sm font-medium">Year {verification.year}</span>
//                           {index === 0 && (
//                             <Badge variant="outline" className="text-xs">
//                               Current
//                             </Badge>
//                           )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                           <div className="flex items-center gap-2">
//                             <CalendarIcon className="h-4 w-4" />
//                             <span>Verified on: {new Date(verification.date).toLocaleDateString()}</span>
//                           </div>

//                           {verification.verifierName || verifierNames[verification.verifiedBy] ? (
//                             <div className="flex items-center gap-2">
//                               <UserIcon className="h-4 w-4" />
//                               <span>
//                                 By: {verification.verifierName || verifierNames[verification.verifiedBy]}
//                               </span>
//                             </div>
//                           ) : null}

//                           {verification.expirationDate && (
//                             <div className="flex items-center gap-2">
//                               <CalendarIcon className="h-4 w-4" />
//                               <span>Expires: {new Date(verification.expirationDate).toLocaleDateString()}</span>
//                             </div>
//                           )}
//                         </div>

//                         {verification.notes && (
//                           <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
//                             <strong>Notes:</strong> {verification.notes}
//                           </div>
//                         )}

//                         {hasAssignment && (
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => {
//                               const assignment = typeof verification.trainingAssignment === 'object' 
//                                 ? verification.trainingAssignment
//                                 : { _id: verification.trainingAssignment };
                              
//                               setCurrentAssignment(assignment);
//                               setIsAssigningTraining(true);
//                               setCurrentVerificationId(verification._id);
                              
//                               // Pre-fill the form with current assignment values
//                               setTrainingAssignment({
//                                 trainingCenterId: assignment.trainingCenterId?._id || assignment.trainingCenterId || "",
//                                 trainingType: assignment.trainingType || "foundation",
//                                 year: assignment.year || new Date().getFullYear(),
//                                 sector: assignment.sectorId || assignment.sector || "",
//                                 tradeArea: assignment.tradeAreaId || assignment.tradeArea || "",
//                                 notes: assignment.notes || "",
//                                 changeReason: ""
//                               });
                              
//                               // If the assignment has a training center ID, select it
//                               if (assignment.trainingCenterId) {
//                                 const centerId = typeof assignment.trainingCenterId === 'object' 
//                                   ? assignment.trainingCenterId._id 
//                                   : assignment.trainingCenterId;
//                                 handleTrainingCenterChange(centerId);
//                               }
//                             }}
//                           >
//                             Reassign
//                           </Button>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-2">
//                         <Select
//                           value={verification.status}
//                           onValueChange={(value) => handleUpdateVerification(verification._id, { status: value })}
//                         >
//                           <SelectTrigger className="w-32">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="pending">Pending</SelectItem>
//                             <SelectItem value="approved">Approved</SelectItem>
//                             <SelectItem value="denied">Denied</SelectItem>
//                           </SelectContent>
//                         </Select>

//                         {/* Only show Assign Training if status is approved and no valid assignment exists */}
//                         {verification.status === "approved" && (
//                           <>
//                             {!hasValidAssignment(verification) ? (
//                               <Button 
//                                 variant="outline" 
//                                 size="sm"
//                                 onClick={() => {
//                                   setIsAssigningTraining(true);
//                                   setCurrentAssignment(null);
//                                   setCurrentVerificationId(verification._id);
//                                 }}
//                               >
//                                 Assign Training
//                               </Button>
//                             ) : (
//                               <div className="flex gap-2">
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm"
//                                   onClick={() => {
//                                     const assignment = typeof verification.trainingAssignment === 'object' 
//                                       ? verification.trainingAssignment
//                                       : { _id: verification.trainingAssignment };
//                                     setCurrentAssignment(assignment);
//                                     setIsAssigningTraining(true);
//                                     setCurrentVerificationId(verification._id);
                                    
//                                     // Pre-fill form with existing assignment data
//                                     setTrainingAssignment(prev => ({
//                                       ...prev,
//                                       trainingCenterId: assignment.trainingCenterId?._id || assignment.trainingCenterId || "",
//                                       trainingType: assignment.trainingType || "foundation",
//                                       year: assignment.year || new Date().getFullYear(),
//                                       sector: assignment.sectorId || assignment.sector || "",
//                                       tradeArea: assignment.tradeAreaId || assignment.tradeArea || "",
//                                       notes: assignment.notes || "",
//                                       changeReason: ""
//                                     }));
//                                   }}
//                                 >
//                                   Reassign
//                                 </Button>
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm"
//                                   onClick={() => {
//                                     const assignmentId = typeof verification.trainingAssignment === 'object'
//                                       ? verification.trainingAssignment._id
//                                       : verification.trainingAssignment;
//                                     setCurrentAssignment(verification.trainingAssignment);
//                                     fetchAssignmentHistory(assignmentId);
//                                     setShowHistory(true);
//                                   }}
//                                 >
//                                   View History
//                                 </Button>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//               <p>No verification records found</p>
//               <p className="text-sm">Click "Add Verification" to create the first record</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }