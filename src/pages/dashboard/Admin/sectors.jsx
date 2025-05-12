// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { toast } from "sonner";
// import axios from "axios";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import DashboardPage from "@/components/layout/DashboardLayout";
// import { UserCircle, Settings, LogOut } from "lucide-react";
// import useLogout from "@/pages/loginPage/logout";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import Spinner from "../../../components/layout/spinner";
// import { API_BASE_URL } from "@/config/env";

// export default function AdminSectors() {
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sectorName, setSectorName] = useState("");
//   const [sectorDescription, setSectorDescription] = useState("");
//   const [editingSector, setEditingSector] = useState(null);

//   const [tradeAreaName, setTradeAreaName] = useState("");
//   const [tradeAreaDescription, setTradeAreaDescription] = useState("");
//   const [editingTradeArea, setEditingTradeArea] = useState(null);
//   const [selectedSector, setSelectedSector] = useState(null);

//   const logout = useLogout();
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchSectors();
//   }, []);

//   const fetchSectors = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/sectors`);
//       setSectors(response.data.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to fetch sectors");
//       setLoading(false);
//     }
//   };

//   const handleSectorSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingSector) {
//         await axios.put(`${API_BASE_URL}/sectors/update/${editingSector._id}`, {
//           name: sectorName,
//           description: sectorDescription,
//         });
//         toast.success("Sector updated successfully");
//       } else {
//         await axios.post(`${API_BASE_URL}/sectors/register`, {
//           name: sectorName,
//           description: sectorDescription,
//           tradeAreas: [],
//           status: "unsuspend",
//         });
//         toast.success("Sector added successfully");
//       }
//       fetchSectors();
//       setSectorName("");
//       setSectorDescription("");
//       setEditingSector(null);
//     } catch (err) {
//       toast.error("Failed to save sector");
//     }
//   };

//   const handleTradeAreaSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedSector) return;

//     try {
//       if (editingTradeArea) {
//         await axios.put(
//           `${API_BASE_URL}/sectors/${selectedSector._id}/trade-areas/${editingTradeArea._id}`,
//           { name: tradeAreaName, description: tradeAreaDescription }
//         );
//         toast.success("Trade area updated successfully");
//       } else {
//         await axios.post(
//           `${API_BASE_URL}/sectors/${selectedSector._id}/trade-areas`,
//           { name: tradeAreaName, description: tradeAreaDescription }
//         );
//         toast.success("Trade area added successfully");
//       }
//       fetchSectors();
//       setTradeAreaName("");
//       setTradeAreaDescription("");
//       setEditingTradeArea(null);
//       setSelectedSector(null);
//     } catch (err) {
//       toast.error("Failed to save trade area");
//     }
//   };

//   const toggleSectorStatus = async (sector) => {
//     try {
//       await axios.patch(`${API_BASE_URL}/sectors/${sector._id}/status`);
//       fetchSectors();
//       toast.success(
//         `Sector ${
//           sector.status === "suspend" ? "unsuspended" : "suspended"
//         } successfully`
//       );
//     } catch (err) {
//       toast.error("Failed to update sector status");
//     }
//   };

//   const deleteSector = async (sector) => {
//     if (window.confirm("Are you sure you want to delete this sector?")) {
//       try {
//         await axios.delete(`${API_BASE_URL}/sectors/${sector._id}`);
//         fetchSectors();
//         toast.success("Sector deleted successfully");
//       } catch (err) {
//         toast.error("Failed to delete sector");
//       }
//     }
//   };

//   const deleteTradeArea = async (sector, tradeArea) => {
//     if (window.confirm("Are you sure you want to delete this trade area?")) {
//       try {
//         await axios.delete(
//           `${API_BASE_URL}/sectors/${sector._id}/trade-areas/${tradeArea._id}`
//         );
//         fetchSectors();
//         toast.success("Trade area deleted successfully");
//       } catch (err) {
//         toast.error("Failed to delete trade area");
//       }
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = sectors.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(sectors.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (loading)
//     return (
//           <div className="flex justify-center items-center h-screen">
//             <Spinner />
//           </div>
//         );
//   if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

//   return (
//     <ProtectedRoute>
//       {/* <DashboardPage> */}
//         <div className="container mx-auto p-4">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">Sector Management</h1>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate("/biodata")}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>

//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>

//           <div className="grid md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {editingSector ? "Edit Sector" : "Add Sector"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSectorSubmit} className="space-y-4">
//                   <Input
//                     placeholder="Sector Name"
//                     value={sectorName}
//                     onChange={(e) => setSectorName(e.target.value)}
//                     required
//                   />
//                   <Textarea
//                     placeholder="Sector Description"
//                     value={sectorDescription}
//                     onChange={(e) => setSectorDescription(e.target.value)}
//                   />
//                   <Button className="bg-emerald-700" type="submit">
//                     {editingSector ? "Update Sector" : "Add Sector"}
//                   </Button>
//                   {editingSector && (
//                     <Button
//                       className="bg-red-500 text-white"
//                       type="button"
//                       variant="outline"
//                       onClick={() => {
//                         setEditingSector(null);
//                         setSectorName("");
//                         setSectorDescription("");
//                       }}>
//                       Cancel Edit
//                     </Button>
//                   )}
//                 </form>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {editingTradeArea ? "Edit Trade Area" : "Add Trade Area"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleTradeAreaSubmit} className="space-y-4">
//                   <Input
//                     placeholder="Trade Area Name"
//                     value={tradeAreaName}
//                     onChange={(e) => setTradeAreaName(e.target.value)}
//                     required
//                   />
//                   <Textarea
//                     placeholder="Trade Area Description"
//                     value={tradeAreaDescription}
//                     onChange={(e) => setTradeAreaDescription(e.target.value)}
//                   />
//                   <Button
//                     className="bg-emerald-700"
//                     type="submit"
//                     disabled={!selectedSector}>
//                     {editingTradeArea ? "Update Trade Area" : "Add Trade Area"}
//                   </Button>
//                   {editingTradeArea && (
//                     <Button
//                       className="bg-red-500 text-white"
//                       type="button"
//                       variant="outline"
//                       onClick={() => {
//                         setEditingTradeArea(null);
//                         setTradeAreaName("");
//                         setTradeAreaDescription("");
//                         setSelectedSector(null);
//                       }}>
//                       Cancel Edit
//                     </Button>
//                   )}
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle>Sectors and Trade Areas</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Sector Name</TableHead>
//                     <TableHead>Description</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Trade Areas</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentItems.map((sector) => (
//                     <TableRow key={sector._id}>
//                       <TableCell>{sector.name}</TableCell>
//                       <TableCell>{sector.description}</TableCell>
//                       <TableCell>{sector.status}</TableCell>
//                       <TableCell>
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="outline">View Trade Areas</Button>
//                           </DialogTrigger>
//                           <DialogContent>
//                             <DialogHeader>
//                               <DialogTitle>
//                                 Trade Areas for {sector.name}
//                               </DialogTitle>
//                             </DialogHeader>
//                             <Table>
//                               <TableHeader>
//                                 <TableRow>
//                                   <TableHead>Name</TableHead>
//                                   <TableHead>Description</TableHead>
//                                   <TableHead>Actions</TableHead>
//                                 </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                 {sector.tradeAreas.map((tradeArea) => (
//                                   <TableRow key={tradeArea._id}>
//                                     <TableCell>{tradeArea.name}</TableCell>
//                                     <TableCell>
//                                       {tradeArea.description}
//                                     </TableCell>
//                                     <TableCell>
//                                       <Button
//                                         variant="outline"
//                                         className="mr-2"
//                                         onClick={() => {
//                                           setEditingTradeArea(tradeArea);
//                                           setTradeAreaName(tradeArea.name);
//                                           setTradeAreaDescription(
//                                             tradeArea.description || ""
//                                           );
//                                           setSelectedSector(sector);
//                                         }}>
//                                         Edit
//                                       </Button>
//                                       <Button
//                                         variant="destructive"
//                                         onClick={() =>
//                                           deleteTradeArea(sector, tradeArea)
//                                         }>
//                                         Delete
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </TableBody>
//                             </Table>
//                             <Button onClick={() => setSelectedSector(sector)}>
//                               Add Trade Area
//                             </Button>
//                           </DialogContent>
//                         </Dialog>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="outline"
//                           className="mr-2"
//                           onClick={() => {
//                             setEditingSector(sector);
//                             setSectorName(sector.name);
//                             setSectorDescription(sector.description || "");
//                           }}>
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="mr-2"
//                           onClick={() => toggleSectorStatus(sector)}>
//                           {sector.status === "suspend"
//                             ? "Unsuspend"
//                             : "Suspend"}
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           onClick={() => deleteSector(sector)}
//                           disabled={true}>
//                           Delete
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <div className="mt-4">
//                 {/* Pagination */}
//                 <Pagination>
//                   <PaginationPrevious
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}>
//                     Previous
//                   </PaginationPrevious>
//                   <PaginationContent>
//                     {Array.from({ length: totalPages }, (_, index) => (
//                       <PaginationItem
//                         key={index}
//                         onClick={() => handlePageChange(index + 1)}
//                         active={currentPage === index + 1}>
//                         <PaginationLink>{index + 1}</PaginationLink>
//                       </PaginationItem>
//                     ))}
//                   </PaginationContent>
//                   <PaginationNext
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}>
//                     Next
//                   </PaginationNext>
//                 </Pagination>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       {/* </DashboardPage> */}
//     </ProtectedRoute>
//   );
// }

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardPage from "@/components/layout/DashboardLayout";
import { UserCircle, LogOut, Plus, Edit, Trash, AlertTriangle } from "lucide-react";
import useLogout from "@/pages/loginPage/logout";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Spinner from "../../../components/layout/spinner";
import { API_BASE_URL } from "@/config/env";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminSectors() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sector form state
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [sectorFormOpen, setSectorFormOpen] = useState(false);
  const [sectorName, setSectorName] = useState("");
  const [sectorDescription, setSectorDescription] = useState("");
  const [editingSector, setEditingSector] = useState(null);

  // Trade Area form state
  const [tradeAreaFormOpen, setTradeAreaFormOpen] = useState(false);
  const [tradeAreaName, setTradeAreaName] = useState("");
  const [tradeAreaDescription, setTradeAreaDescription] = useState("");
  const [editingTradeArea, setEditingTradeArea] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedSectorId, setSelectedSectorId] = useState("");

  // Dialog states
  const [isTradeAreaDialogOpen, setIsTradeAreaDialogOpen] = useState(false);
  const [currentTradeAreaSector, setCurrentTradeAreaSector] = useState(null);
  
  // Delete confirmation dialogs
  const [sectorToDelete, setSectorToDelete] = useState(null);
  const [tradeAreaToDelete, setTradeAreaToDelete] = useState(null);

  const navigate = useNavigate();
  const logout = useLogout();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sectors`);
      setSectors(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch sectors");
      setLoading(false);
    }
  };

  const resetSectorForm = () => {
    setEditingSector(null);
    setSectorName("");
    setSectorDescription("");
    setSectorFormOpen(false);
  };

  const resetTradeAreaForm = () => {
    setEditingTradeArea(null);
    setTradeAreaName("");
    setTradeAreaDescription("");
    setSelectedSector(null);
    setSelectedSectorId("");
    setTradeAreaFormOpen(false);
  };

  const openSectorForm = (sector = null) => {
    if (sector) {
      setEditingSector(sector);
      setSectorName(sector.name);
      setSectorDescription(sector.description || "");
      setIsAddingSector(false);
    } else {
      setIsAddingSector(true);
      setSectorName("");
      setSectorDescription("");
    }
    setSectorFormOpen(true);
  };

  const openTradeAreaForm = (sector = null, tradeArea = null) => {
    if (tradeArea) {
      setEditingTradeArea(tradeArea);
      setTradeAreaName(tradeArea.name);
      setTradeAreaDescription(tradeArea.description || "");
      setSelectedSector(sector);
      setSelectedSectorId(sector._id);
    } else {
      setEditingTradeArea(null);
      setTradeAreaName("");
      setTradeAreaDescription("");
      if (sector) {
        setSelectedSector(sector);
        setSelectedSectorId(sector._id);
      } else {
        setSelectedSector(null);
        setSelectedSectorId("");
      }
    }
    setTradeAreaFormOpen(true);
  };

  const handleSectorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSector) {
        await axios.put(`${API_BASE_URL}/sectors/update/${editingSector._id}`, {
          name: sectorName,
          description: sectorDescription,
        });
        toast.success("Sector updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/sectors/register`, {
          name: sectorName,
          description: sectorDescription,
          tradeAreas: [],
          status: "unsuspend",
        });
        toast.success("Sector added successfully");
      }
      fetchSectors();
      resetSectorForm();
    } catch (err) {
      toast.error("Failed to save sector");
    }
  };

  const handleTradeAreaSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSector && !selectedSectorId) {
      toast.error("Please select a sector first");
      return;
    }

    const sectorId = selectedSector?._id || selectedSectorId;
    try {
      if (editingTradeArea) {
        await axios.put(
          `${API_BASE_URL}/sectors/${sectorId}/trade-areas/${editingTradeArea._id}`,
          { name: tradeAreaName, description: tradeAreaDescription }
        );
        toast.success("Trade area updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/sectors/${sectorId}/trade-areas`,
          { name: tradeAreaName, description: tradeAreaDescription }
        );
        toast.success("Trade area added successfully");
      }
      fetchSectors();
      resetTradeAreaForm();
      // Refresh the current trade area dialog if it's open
      if (isTradeAreaDialogOpen && currentTradeAreaSector) {
        const updatedSector = currentTradeAreaSector._id === sectorId ? true : false;
        if (updatedSector) {
          const refreshedSector = (await axios.get(`${API_BASE_URL}/sectors/${sectorId}`)).data.data;
          setCurrentTradeAreaSector(refreshedSector);
        }
      }
    } catch (err) {
      toast.error("Failed to save trade area");
    }
  };

  const toggleSectorStatus = async (sector) => {
    try {
      await axios.patch(`${API_BASE_URL}/sectors/${sector._id}/status`);
      fetchSectors();
      toast.success(
        `Sector ${
          sector.status === "suspend" ? "unsuspended" : "suspended"
        } successfully`
      );
    } catch (err) {
      toast.error("Failed to update sector status");
    }
  };

  const deleteSector = async (sector) => {
    try {
      await axios.delete(`${API_BASE_URL}/sectors/${sector._id}`);
      fetchSectors();
      toast.success("Sector deleted successfully");
      setSectorToDelete(null);
    } catch (err) {
      toast.error("Failed to delete sector");
    }
  };

  const deleteTradeArea = async (sector, tradeArea) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/sectors/${sector._id}/trade-areas/${tradeArea._id}`
      );
      fetchSectors();
      // Update the current dialog if it's open
      if (currentTradeAreaSector && currentTradeAreaSector._id === sector._id) {
        const refreshedSector = (await axios.get(`${API_BASE_URL}/sectors/${sector._id}`)).data.data;
        setCurrentTradeAreaSector(refreshedSector);
      }
      toast.success("Trade area deleted successfully");
      setTradeAreaToDelete(null);
    } catch (err) {
      toast.error("Failed to delete trade area");
    }
  };

  const openTradeAreaDialog = async (sector) => {
    setCurrentTradeAreaSector(sector);
    setIsTradeAreaDialogOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sectors.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sectors.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <ProtectedRoute>
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Sector Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button 
              className="bg-emerald-700" 
              onClick={() => openSectorForm()}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Sector
            </Button>
            <Button 
              onClick={() => setTradeAreaFormOpen(true)}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Trade Area
            </Button>
          </div>

          {/* Sector Form Dialog */}
          <Dialog open={sectorFormOpen} onOpenChange={setSectorFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSector ? "Edit Sector" : "Add New Sector"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSectorSubmit} className="space-y-4">
                <Input
                  placeholder="Sector Name"
                  value={sectorName}
                  onChange={(e) => setSectorName(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Sector Description"
                  value={sectorDescription}
                  onChange={(e) => setSectorDescription(e.target.value)}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetSectorForm}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-emerald-700" type="submit">
                    {editingSector ? "Update Sector" : "Add Sector"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trade Area Form Dialog */}
          <Dialog open={tradeAreaFormOpen} onOpenChange={setTradeAreaFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTradeArea ? "Edit Trade Area" : "Add New Trade Area"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTradeAreaSubmit} className="space-y-4">
                {!editingTradeArea && (
                  <Select 
                    value={selectedSectorId} 
                    onValueChange={setSelectedSectorId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector._id} value={sector._id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Input
                  placeholder="Trade Area Name"
                  value={tradeAreaName}
                  onChange={(e) => setTradeAreaName(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Trade Area Description"
                  value={tradeAreaDescription}
                  onChange={(e) => setTradeAreaDescription(e.target.value)}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetTradeAreaForm}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-emerald-700" 
                    type="submit"
                  >
                    {editingTradeArea ? "Update Trade Area" : "Add Trade Area"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trade Areas View Dialog */}
          <Dialog 
            open={isTradeAreaDialogOpen} 
            onOpenChange={setIsTradeAreaDialogOpen}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  Trade Areas for {currentTradeAreaSector?.name}
                </DialogTitle>
              </DialogHeader>
              {currentTradeAreaSector && (
                <>
                  <div className="mb-4">
                    <Button 
                      onClick={() => openTradeAreaForm(currentTradeAreaSector)}
                      className="bg-emerald-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Trade Area
                    </Button>
                  </div>

                  {currentTradeAreaSector.tradeAreas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTradeAreaSector.tradeAreas.map((tradeArea) => (
                          <TableRow key={tradeArea._id}>
                            <TableCell>{tradeArea.name}</TableCell>
                            <TableCell>{tradeArea.description}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openTradeAreaForm(currentTradeAreaSector, tradeArea)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setTradeAreaToDelete({ sector: currentTradeAreaSector, tradeArea })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No trade areas found for this sector
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Sectors List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sector Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Trade Areas</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((sector) => (
                      <TableRow key={sector._id}>
                        <TableCell className="font-medium">{sector.name}</TableCell>
                        <TableCell>{sector.description}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sector.status === 'suspend' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {sector.status === 'suspend' ? 'Suspended' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="outline"
                            onClick={() => openTradeAreaDialog(sector)}
                          >
                            View ({sector.tradeAreas.length})
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSectorForm(sector)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={sector.status === "suspend" ? "default" : "outline"}
                              size="sm"
                              className={sector.status === "suspend" ? "bg-amber-500 hover:bg-amber-600" : ""}
                              onClick={() => toggleSectorStatus(sector)}
                            >
                              {sector.status === "suspend" ? "Activate" : "Suspend"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSectorToDelete(sector)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No sectors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {sectors.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            onClick={() => handlePageChange(index + 1)}
                            isActive={currentPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Sector Confirmation Dialog */}
          <AlertDialog open={!!sectorToDelete} onOpenChange={() => setSectorToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Sector</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex items-center mb-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>This action cannot be undone.</span>
                  </div>
                  Are you sure you want to delete the sector "{sectorToDelete?.name}"? 
                  This will also delete all associated trade areas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => deleteSector(sectorToDelete)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Trade Area Confirmation Dialog */}
          <AlertDialog 
            open={!!tradeAreaToDelete} 
            onOpenChange={() => setTradeAreaToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Trade Area</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex items-center mb-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>This action cannot be undone.</span>
                  </div>
                  Are you sure you want to delete the trade area "{tradeAreaToDelete?.tradeArea?.name}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => deleteTradeArea(tradeAreaToDelete.sector, tradeAreaToDelete.tradeArea)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </ProtectedRoute>
  );
}