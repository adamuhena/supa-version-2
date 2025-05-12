import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, MapPin, Building } from 'lucide-react';
import { API_BASE_URL } from "@/config/env";
import { states } from "@/data/nigeria";
import Spinner from "@/components/layout/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SmartAssignmentDialog from './SmartAssignmentDialog';

const SmartAssignmentDialog = ({ periodId, onAssign }) => {
  const [loading, setLoading] = useState(false);
  const [dialogTradeAreas, setDialogTradeAreas] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    state: "",
    lga: "",
    sectorId: "",
    tradeAreaId: "",
    startDate: new Date().toISOString().split('T')[0],
    maxAssignmentsPerCenter: 50
  });

  // Fetch sectors on mount
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
        if (response.data?.success) {
          setSectors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setError("Failed to load sectors");
      }
    };

    fetchSectors();
  }, []);

  // Fetch trade areas when sector changes
  useEffect(() => {
    const fetchTradeAreas = async () => {
      if (formData.sectorId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/sectors/${formData.sectorId}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            }
          );
          if (response.data?.success) {
            setDialogTradeAreas(response.data.data.tradeAreas || []);
          }
        } catch (error) {
          console.error("Error fetching trade areas:", error);
          setDialogTradeAreas([]);
          setError("Failed to load trade areas");
        }
      } else {
        setDialogTradeAreas([]);
      }
    };

    fetchTradeAreas();
  }, [formData.sectorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/training/assign/smart`,
        {
          periodId,
          stateOfResidence: formData.state,
          lgaOfResidence: formData.lga,
          sectorId: formData.sectorId,
          tradeAreaId: formData.tradeAreaId,
          startDate: formData.startDate,
          maxAssignmentsPerCenter: parseInt(formData.maxAssignmentsPerCenter)
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }
      );

      if (response.data.success) {
        onAssign();
        // Reset form
        setFormData({
          state: "",
          lga: "",
          sectorId: "",
          tradeAreaId: "",
          startDate: new Date().toISOString().split('T')[0],
          maxAssignmentsPerCenter: 50
        });
      }
    } catch (error) {
      console.error('Smart assignment error:', error);
      setError(error.response?.data?.message || 'Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Smart Assignment</DialogTitle>
        <DialogDescription>
          Automatically assign trainees to the closest training centers based on location and trade areas.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* State Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Select
              value={formData.state}
              onValueChange={(value) => setFormData({...formData, state: value, lga: ""})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* LGA Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">LGA</label>
            <Select 
              value={formData.lga}
              onValueChange={(value) => setFormData({...formData, lga: value})}
              disabled={!formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {states
                  .find((s) => s.value === formData.state)
                  ?.lgas.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sector</label>
            <Select
              value={formData.sectorId}
              onValueChange={(value) => setFormData({...formData, sectorId: value, tradeAreaId: ""})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector._id} value={sector._id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trade Area Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trade Area</label>
            <Select
              value={formData.tradeAreaId}
              onValueChange={(value) => setFormData({...formData, tradeAreaId: value})}
              disabled={!formData.sectorId || dialogTradeAreas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Trade Area" />
              </SelectTrigger>
              <SelectContent>
                {dialogTradeAreas.map((tradeArea) => (
                  <SelectItem key={tradeArea._id} value={tradeArea._id}>
                    {tradeArea.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />
        </div>

        {/* Max Assignments Per Center */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Maximum Assignments Per Center</label>
          <Input
            type="number"
            placeholder="Max assignments per center"
            value={formData.maxAssignmentsPerCenter}
            onChange={(e) => setFormData({
              ...formData,
              maxAssignmentsPerCenter: parseInt(e.target.value)
            })}
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500">
            Maximum number of trainees per center (1-100)
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Processing...
            </>
          ) : (
            "Start Assignment"
          )}
        </Button>
      </form>
    </DialogContent>
  );
};

export default SmartAssignmentDialog;