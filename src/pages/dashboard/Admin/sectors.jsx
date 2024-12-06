import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast} from 'sonner'
import axios from 'axios'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardPage from '@/components/layout/DashboardLayout'
import { UserCircle, Settings, LogOut } from "lucide-react";
import useLogout from '@/pages/loginPage/logout';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


export default function AdminSectors() {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sectorName, setSectorName] = useState('')
  const [sectorDescription, setSectorDescription] = useState('')
  const [editingSector, setEditingSector] = useState(null)

  const [tradeAreaName, setTradeAreaName] = useState('')
  const [tradeAreaDescription, setTradeAreaDescription] = useState('')
  const [editingTradeArea, setEditingTradeArea] = useState(null)
  const [selectedSector, setSelectedSector] = useState(null)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const logout = useLogout();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sectors`)
      setSectors(response.data.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch sectors')
      setLoading(false)
    }
  }

  const handleSectorSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSector) {
        await axios.put(`${API_BASE_URL}/sectors/update/${editingSector._id}`, { name: sectorName, description: sectorDescription })
        toast.success('Sector updated successfully')
      } else {
        await axios.post(`${API_BASE_URL}/sectors/register`, { name: sectorName, description: sectorDescription, tradeAreas: [], status: 'unsuspend' })
        toast.success('Sector added successfully')
      }
      fetchSectors()
      setSectorName('')
      setSectorDescription('')
      setEditingSector(null)
    } catch (err) {
      toast.error('Failed to save sector')
    }
  }

  const handleTradeAreaSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSector) return

    try {
      if (editingTradeArea) {
        await axios.put(`${API_BASE_URL}/sectors/${selectedSector._id}/trade-areas/${editingTradeArea._id}`, { name: tradeAreaName, description: tradeAreaDescription })
        toast.success('Trade area updated successfully')
      } else {
        await axios.post(`${API_BASE_URL}/sectors/${selectedSector._id}/trade-areas`, { name: tradeAreaName, description: tradeAreaDescription })
        toast.success('Trade area added successfully')
      }
      fetchSectors()
      setTradeAreaName('')
      setTradeAreaDescription('')
      setEditingTradeArea(null)
      setSelectedSector(null)
    } catch (err) {
      toast.error('Failed to save trade area')
    }
  }

  const toggleSectorStatus = async (sector) => {
    try {
      await axios.patch(`${API_BASE_URL}/sectors/${sector._id}/status`)
      fetchSectors()
      toast.success(`Sector ${sector.status === 'suspend' ? 'unsuspended' : 'suspended'} successfully`)
    } catch (err) {
      toast.error('Failed to update sector status')
    }
  }

  const deleteSector = async (sector) => {
    if (window.confirm('Are you sure you want to delete this sector?')) {
      try {
        await axios.delete(`${API_BASE_URL}/sectors/${sector._id}`)
        fetchSectors()
        toast.success('Sector deleted successfully')
      } catch (err) {
        toast.error('Failed to delete sector')
      }
    }
  }

  const deleteTradeArea = async (sector, tradeArea) => {
    if (window.confirm('Are you sure you want to delete this trade area?')) {
      try {
        await axios.delete(`${API_BASE_URL}/sectors/${sector._id}/trade-areas/${tradeArea._id}`)
        fetchSectors()
        toast.success('Trade area deleted successfully')
      } catch (err) {
        toast.error('Failed to delete trade area')
      }
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sectors.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(sectors.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <ProtectedRoute>
        <DashboardPage>

        
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Sector Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingSector ? 'Edit Sector' : 'Add Sector'}</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button className="bg-emerald-700" type="submit">{editingSector ? 'Update Sector' : 'Add Sector'}</Button>
              {editingSector && (
                <Button className="bg-red-500 text-white" type="button" variant="outline" onClick={() => {
                  setEditingSector(null)
                  setSectorName('')
                  setSectorDescription('')
                }}>
                  Cancel Edit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingTradeArea ? 'Edit Trade Area' : 'Add Trade Area'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTradeAreaSubmit} className="space-y-4">
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
              <Button className="bg-emerald-700"  type="submit" disabled={!selectedSector}>
                {editingTradeArea ? 'Update Trade Area' : 'Add Trade Area'}
              </Button>
              {editingTradeArea && (
                <Button  className="bg-red-500 text-white"  type="button" variant="outline" onClick={() => {
                  setEditingTradeArea(null)
                  setTradeAreaName('')
                  setTradeAreaDescription('')
                  setSelectedSector(null)
                }}>
                  Cancel Edit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sectors and Trade Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trade Areas</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((sector) => (
                <TableRow key={sector._id}>
                  <TableCell>{sector.name}</TableCell>
                  <TableCell>{sector.description}</TableCell>
                  <TableCell>{sector.status}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Trade Areas</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Trade Areas for {sector.name}</DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sector.tradeAreas.map((tradeArea) => (
                              <TableRow key={tradeArea._id}>
                                <TableCell>{tradeArea.name}</TableCell>
                                <TableCell>{tradeArea.description}</TableCell>
                                <TableCell>
                                  <Button variant="outline" className="mr-2" onClick={() => {
                                    setEditingTradeArea(tradeArea)
                                    setTradeAreaName(tradeArea.name)
                                    setTradeAreaDescription(tradeArea.description || '')
                                    setSelectedSector(sector)
                                  }}>
                                    Edit
                                  </Button>
                                  <Button variant="destructive" onClick={() => deleteTradeArea(sector, tradeArea)}>
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button onClick={() => setSelectedSector(sector)}>Add Trade Area</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => {
                      setEditingSector(sector)
                      setSectorName(sector.name)
                      setSectorDescription(sector.description || '')
                    }}>
                      Edit
                    </Button>
                    <Button variant="outline" className="mr-2" onClick={() => toggleSectorStatus(sector)}>
                      {sector.status === 'suspend' ? 'Unsuspend' : 'Suspend'}
                    </Button>
                    <Button variant="destructive" onClick={() => deleteSector(sector)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
                {/* Pagination */}
              <Pagination>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </PaginationPrevious>
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index} onClick={() => handlePageChange(index + 1)} active={currentPage === index + 1}>
                      <PaginationLink>{index + 1}</PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </PaginationNext>
              </Pagination>
            </div>
        </CardContent>
      </Card>
    </div>
    </DashboardPage>
    </ProtectedRoute>
  )
}

