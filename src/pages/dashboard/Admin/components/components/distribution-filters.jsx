"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { states } from "../../../../../data/nigeria" // Import from your nigeria.ts file
import axios from "axios"
import { API_BASE_URL } from "@/config/env"

export function DistributionFilters({ onFilterChange }) {
  const [sectors, setSectors] = useState([])
  const [tradeAreas, setTradeAreas] = useState([])
  const [selectedState, setSelectedState] = useState("all")
  const [selectedStateOfOrigin, setSelectedStateOfOrigin] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [loading, setLoading] = useState(false)

  // Fetch sectors and trade areas
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true)
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (response.data.success) {
          setSectors(response.data.data || [])
        }
      } catch (error) {
        console.error("Error fetching sectors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSectors()
  }, [])

  // Update trade areas when sector changes
  useEffect(() => {
    if (selectedSector === "all") {
      setTradeAreas([])
      return
    }

    const sector = sectors.find((s) => s.name === selectedSector)
    if (sector) {
      setTradeAreas(sector.tradeAreas || [])
    } else {
      setTradeAreas([])
    }
  }, [selectedSector, sectors])

  const handleApplyFilters = () => {
    onFilterChange({
      role: selectedRole,
      gender: selectedGender,
      stateOfResidence: selectedState,
      stateOfOrigin: selectedStateOfOrigin,
      sector: selectedSector,
      tradeArea: "all", // You can add trade area selection if needed
    })
  }

  const handleResetFilters = () => {
    setSelectedState("all")
    setSelectedStateOfOrigin("all")
    setSelectedSector("all")
    setSelectedRole("all")
    setSelectedGender("all")

    onFilterChange({
      role: "all",
      gender: "all",
      stateOfResidence: "all",
      stateOfOrigin: "all",
      sector: "all",
      tradeArea: "all",
    })
  }

  return (
    <div className="bg-white rounded-lg ">
      <div className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="artisan_user">Artisan</SelectItem>
                <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateOfResidence">State of Residence</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="stateOfResidence">
                <SelectValue placeholder="Select state" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateOfOrigin">State of Origin</Label>
            <Select value={selectedStateOfOrigin} onValueChange={setSelectedStateOfOrigin}>
              <SelectTrigger id="stateOfOrigin">
                <SelectValue placeholder="Select state" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger id="sector">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector._id} value={sector.name}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleResetFilters} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

