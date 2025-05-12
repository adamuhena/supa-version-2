// src/pages/training/TrainingAssignmentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Building,
  Calendar,
  PlusCircle,
  FileText,
  ChevronRight,
  Filter,
  Download,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Briefcase,
  Map
} from 'lucide-react';
import { API_BASE_URL } from "@/config/env"
// Components
import Spinner from "@/components/layout/spinner"
import {Pagination} from "@/components/ui/pagination"
import { states } from "@/data/nigeria";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Move this before the TrainingAssignmentDashboard component
const SmartAssignmentDialog = ({ periodId, onAssign }) => {
  const [loading, setLoading] = useState(false);
  const [dialogTradeAreas, setDialogTradeAreas] = useState([]);
  const [formData, setFormData] = useState({
    state: "",
    lga: "",
    sectorId: "",
    tradeAreaId: "",
    startDate: new Date().toISOString().split('T')[0],
    maxAssignmentsPerCenter: 50
  });

  // Add useEffect for trade areas
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
            const sectorData = response.data.data;
            setDialogTradeAreas(sectorData.tradeAreas || []);
          }
        } catch (error) {
          console.error("Error fetching sector details:", error);
          setDialogTradeAreas([]);
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
    setAssignmentStatus({
      inProgress: true,
      success: false,
      error: false,
      message: 'Starting smart assignment process...'
    });

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
        setAssignmentStatus({
          inProgress: false,
          success: true,
          error: false,
          message: `Successfully assigned ${response.data.results.successful} trainees`
        });
        onAssign();
      }
    } catch (error) {
      console.error('Smart assignment error:', error);
      setAssignmentStatus({
        inProgress: false,
        success: false,
        error: true,
        message: error.response?.data?.message || 'Assignment failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Users className="mr-2 h-4 w-4" />
          Smart Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Smart Assignment</DialogTitle>
          <DialogDescription>
            Automatically assign trainees to the closest training centers based on location and trade areas.
          </DialogDescription>
        </DialogHeader>
        
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
    </Dialog>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'assigned':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <Clock size={16} className="mr-1" />;
      break;
    case 'in-progress':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <AlertTriangle size={16} className="mr-1" />;
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircle size={16} className="mr-1" />;
      break;
    case 'dropped':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <XCircle size={16} className="mr-1" />;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      icon = null;
  }
  
  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TrainingAssignmentDashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  
  // 1. Group all useState hooks together at the top
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [tradeAreas, setTradeAreas] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState({
    inProgress: false,
    success: false,
    error: false,
    message: ''
  });
  const [isSmartAssignDialogOpen, setIsSmartAssignDialogOpen] = useState(false);
  
  // 2. Group pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  
  // 3. Group filter state
  const [filters, setFilters] = useState({
    status: "",
    state: "",
    lga: "",
    sectorId: "",
    tradeAreaId: "",
    trainingCenterId: "",
    search: "",
    currentPage: 1,
    pageSize: 25
  });

  // 4. Helper computations (before useEffect)
  const selectedStateLGAs = states.find(
    (state) => state.value === filters.state
  )?.lgas || [];

  // 5. All useEffect hooks grouped together
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [periodsResponse, centersResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/training/periods`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          }),
          axios.get(`${API_BASE_URL}/training/centers`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
        ]);

        setPeriods(periodsResponse.data.data);
        setTrainingCenters(centersResponse.data.data);
        
        if (periodsResponse.data.data.length > 0) {
          const latestPeriod = periodsResponse.data.data[0]._id;
          setSelectedPeriod(latestPeriod);
          await Promise.all([
            fetchStatistics(latestPeriod),
            fetchAssignments(latestPeriod)
          ]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [accessToken]);

  // Sectors fetch
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoadingSectors(true);
        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.data?.success) {
          setSectors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
      } finally {
        setLoadingSectors(false);
      }
    };

    fetchSectors();
  }, [accessToken]);

  // Trade areas fetch
  useEffect(() => {
    const fetchTradeAreas = async () => {
      if (filters.sectorId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/sectors/${filters.sectorId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (response.data?.success) {
            const sectorData = response.data.data;
            setTradeAreas(sectorData.tradeAreas || []);
          }
        } catch (error) {
          console.error("Error fetching sector details:", error);
          setTradeAreas([]);
        }
      } else {
        setTradeAreas([]);
      }
    };

    fetchTradeAreas();
  }, [filters.sectorId, accessToken]);

  // 6. Event handlers and other functions after all hooks
  const fetchStatistics = async (periodId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training/assignments/stats?periodId=${periodId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  
  // Fetch assignments based on selected period and filters
  const fetchAssignments = async (periodId, page = 1) => {
    setLoading(true);
    try {
      // Build query string from filters
      let queryParams = `periodId=${periodId}&page=${page}&limit=${pagination.limit}`;
      
      if (filters.status) queryParams += `&status=${filters.status}`;
      if (filters.state) queryParams += `&state=${filters.state}`;
      if (filters.lga) queryParams += `&lga=${filters.lga}`;
      if (filters.sectorId) queryParams += `&sectorId=${filters.sectorId}`;
      if (filters.trainingCenterId) queryParams += `&trainingCenterId=${filters.trainingCenterId}`;
      if (filters.search) queryParams += `&search=${filters.search}`;
      
      const response = await axios.get(`${API_BASE_URL}/training/assignments?${queryParams}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      setAssignments(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      });
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle period change
  const handlePeriodChange = (e) => {
    const periodId = e.target.value;
    setSelectedPeriod(periodId);
    
    if (periodId) {
      fetchStatistics(periodId);
      fetchAssignments(periodId, 1);
      // Reset to page 1 when changing period
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilter = { ...prev };
      
      // If the value is "all", set it to empty string
      const filterValue = value === "all" ? "" : value;
      
      switch (key) {
        case "state":
          newFilter.state = filterValue;
          newFilter.lga = ""; // Reset dependent field
          break;
          
        case "sectorId":
          newFilter.sectorId = filterValue;
          newFilter.tradeAreaId = ""; // Reset dependent field
          break;
          
        default:
          newFilter[key] = filterValue;
      }
      
      // Reset to first page when filter changes
      newFilter.currentPage = 1;
      return newFilter;
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    fetchAssignments(selectedPeriod, 1);
    // Reset to page 1 when applying filters
    setPagination(prev => ({ ...prev, page: 1 }));
    setIsFilterOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      state: '',
      lga: '',
      sectorId: '',
      trainingCenterId: '',
      search: ''
    });
    
    // Apply reset (fetch with empty filters)
    fetchAssignments(selectedPeriod, 1);
    setPagination(prev => ({ ...prev, page: 1 }));
    setIsFilterOpen(false);
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssignments(selectedPeriod, 1);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchAssignments(selectedPeriod, newPage);
  };
  
  // Navigate to create training period page
  const navigateToCreatePeriod = () => {
    navigate('/training/periods/create');
  };
  
  // Navigate to smart assignment page
  const navigateToSmartAssign = () => {
    navigate('/training/assign/smart', { state: { periodId: selectedPeriod } });
  };
  
  // Export assignments as CSV
  const exportAssignments = async () => {
    try {
      // This is a placeholder. In a real application, you would:
      // 1. Make an API call to get CSV data
      // 2. Create a download link and trigger it
      
      // Example (frontend CSV generation):
      if (assignments.length === 0) {
        alert('No data to export');
        return;
      }
      
      // Create CSV headers
      const headers = [
        'Trainee Name',
        'Training Center',
        'Sector',
        'Trade Area',
        'Status',
        'Start Date'
      ];
      
      // Map assignments to CSV rows
      const csvRows = assignments.map(assignment => [
        `${assignment.trainee.firstName} ${assignment.trainee.lastName}`,
        assignment.trainingCenter.trainingCentreName,
        assignment.sector.name,
        assignment.tradeArea.name,
        assignment.status,
        new Date(assignment.startDate).toLocaleDateString()
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assignments-${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting assignments:', error);
      alert('Failed to export assignments');
    }
  };
  
  // Update assignment status
  const updateAssignmentStatus = async (assignmentId, newStatus) => {
    try {
      // Determine if we need an end date for completed/dropped statuses
      let payload = { status: newStatus };
      
      if (['completed', 'dropped'].includes(newStatus)) {
        payload.endDate = new Date().toISOString();
      }
      
      await axios.patch(`${API_BASE_URL}/training/assignments/${assignmentId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Refresh assignments
      fetchAssignments(selectedPeriod, pagination.page);
      
      // Refresh statistics
      fetchStatistics(selectedPeriod);
    } catch (error) {
      console.error('Error updating assignment status:', error);
      alert('Failed to update assignment status');
    }
  };
  
  // Render loading spinner
  if (loading && !assignments.length) {
    return <Spinner />;
  }
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch (status) {
      case 'assigned':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        icon = <Clock size={16} className="mr-1" />;
        break;
      case 'in-progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <AlertTriangle size={16} className="mr-1" />;
        break;
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <CheckCircle size={16} className="mr-1" />;
        break;
      case 'dropped':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <XCircle size={16} className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        icon = null;
    }
    
    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  // Add this new component for the smart assignment dialog
//   const SmartAssignmentDialog = ({ periodId, onAssign }) => {
//     const [loading, setLoading] = useState(false);
//     const [dialogTradeAreas, setDialogTradeAreas] = useState([]);
//     const [selectedSector, setSelectedSector] = useState(null);
//     const [formData, setFormData] = useState({
//       state: "",
//       lga: "",
//       sectorId: "",
//       tradeAreaId: "",
//       maxAssignmentsPerCenter: 50
//     });
  
//     // Replace the existing useEffect with this one
//     useEffect(() => {
//       const fetchTradeAreas = async () => {
//         if (formData.sectorId) {
//           try {
//             const response = await axios.get(
//               `${API_BASE_URL}/sectors/${formData.sectorId}`,
//               {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//               }
//             );
//             if (response.data?.success) {
//               // Store the full sector data
//               setSelectedSector(response.data.data);
//               // Extract trade areas from the sector
//               const tradeAreas = response.data.data.tradeAreas || [];
//               setDialogTradeAreas(tradeAreas);
//             }
//           } catch (error) {
//             console.error("Error fetching sector details:", error);
//             setDialogTradeAreas([]);
//           }
//         } else {
//           setDialogTradeAreas([]);
//           setSelectedSector(null);
//         }
//       };
  
//       fetchTradeAreas();
//     }, [formData.sectorId]);
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${API_BASE_URL}/training/assign/smart`,
//           {
//             periodId,
//             stateOfResidence: formData.state,
//             lgaOfResidence: formData.lga,
//             sectorId: formData.sectorId,
//             tradeAreaId: formData.tradeAreaId,
//             maxAssignmentsPerCenter: formData.maxAssignmentsPerCenter,
//             startDate: new Date().toISOString()
//           },
//           {
//             headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//           }
//         );
  
//         if (response.data.success) {
//           onAssign();
//         }
//       } catch (error) {
//         console.error('Smart assignment error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  // Update the SmartAssignmentDialog component
const SmartAssignmentDialog = ({ periodId, onAssign }) => {
    const [loading, setLoading] = useState(false);
    const [dialogTradeAreas, setDialogTradeAreas] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [formData, setFormData] = useState({
      state: "",
      lga: "",
      sectorId: "",
      tradeAreaId: "",
      maxAssignmentsPerCenter: 50
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setAssignmentStatus({
        inProgress: true,
        success: false,
        error: false,
        message: 'Starting assignment process...'
      });
  
      try {
        const response = await axios.post(
          `${API_BASE_URL}/training/assign/smart`,
          {
            periodId,
            stateOfResidence: formData.state,
            lgaOfResidence: formData.lga,
            sectorId: formData.sectorId,
            tradeAreaId: formData.tradeAreaId,
            maxAssignmentsPerCenter: formData.maxAssignmentsPerCenter,
            startDate: new Date().toISOString()
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          }
        );
  
        if (response.data.success) {
          setAssignmentStatus({
            inProgress: false,
            success: true,
            error: false,
            message: `Successfully assigned ${response.data.results.successful} trainees`
          });
          onAssign();
          
          // Show assignment results
          if (response.data.results.centerUtilization) {
            console.log('Center Utilization:', response.data.results.centerUtilization);
            // You could display this in a toast or modal
          }
        }
      } catch (error) {
        console.error('Smart assignment error:', error);
        setAssignmentStatus({
          inProgress: false,
          success: false,
          error: true,
          message: error.response?.data?.message || 'Assignment failed'
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">
            <Users className="mr-2 h-4 w-4" />
            Smart Assign
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smart Assignment</DialogTitle>
            <DialogDescription>
              Automatically assign trainees to the closest training centers based on location and trade areas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
  
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Start Assignment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const StatisticCard = ({ title, value, icon, bgColor }) => (
    <Card className={`${bgColor} p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <ProtectedRoute>
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Training Assignment Dashboard</h1>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
          <button
            onClick={navigateToCreatePeriod}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={18} className="mr-2" />
            New Training Period
          </button>
          
          <SmartAssignmentDialog periodId={selectedPeriod} onAssign={() => fetchAssignments(selectedPeriod, 1)} />
        </div>
      </div>


        {assignmentStatus.inProgress && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center">
            <RefreshCw className="animate-spin mr-2 text-blue-600" />
            <span>{assignmentStatus.message}</span>
            </div>
        </div>
        )}

        {assignmentStatus.success && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
            <div className="flex items-center">
            <CheckCircle className="mr-2 text-green-600" />
            <span>{assignmentStatus.message}</span>
            </div>
        </div>
        )}

        {assignmentStatus.error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex items-center">
            <AlertTriangle className="mr-2 text-red-600" />
            <span>{assignmentStatus.message}</span>
            </div>
        </div>
        )}
      
      {/* Period Selection */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <label htmlFor="periodSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Training Period
            </label>
            <select
              id="periodSelect"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option value="">Select a period</option>
              {periods.map(period => (
                <option key={period._id} value={period._id}>
                  {period.name} ({period.year})
                </option>
              ))}
            </select>
          </div>
          
          {selectedPeriod && statistics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <StatisticCard
                title="Total Assigned"
                value={statistics.total}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                bgColor="bg-blue-50"
              />
              <StatisticCard
                title="In Progress"
                value={statistics.inProgress}
                icon={<Clock className="h-6 w-6 text-yellow-600" />}
                bgColor="bg-yellow-50"
              />
              <StatisticCard
                title="Completed"
                value={statistics.completed}
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                bgColor="bg-green-50"
              />
              <StatisticCard
                title="Dropped"
                value={statistics.dropped}
                icon={<XCircle className="h-6 w-6 text-red-600" />}
                bgColor="bg-red-50"
              />
              <StatisticCard
                title="Training Centers"
                value={statistics.centerCount}
                icon={<Building className="h-6 w-6 text-purple-600" />}
                bgColor="bg-purple-50"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Search and Filters */}
      {selectedPeriod && (
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <form onSubmit={handleSearchSubmit} className="w-full md:w-1/3 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search trainee name or center..."
                value={filters.search}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
          </form>
          
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                fetchAssignments(selectedPeriod, pagination.page);
                fetchStatistics(selectedPeriod);
              }}
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
            
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={exportAssignments}
              disabled={!assignments.length}
            >
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Assignments</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
            </Select>

            {/* State Filter */}
            <Select
              value={filters.state}
              onValueChange={(value) => handleFilterChange("state", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select State" />
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

            {/* LGA Filter */}
            <Select
              value={filters.lga}
              onValueChange={(value) => handleFilterChange("lga", value)}
              disabled={!filters.state}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All LGAs</SelectItem>
                {selectedStateLGAs.map((lga) => (
                  <SelectItem key={lga} value={lga}>
                    {lga}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sector Filter */}
            <Select
              value={filters.sectorId}
              onValueChange={(value) => handleFilterChange("sectorId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector._id} value={sector._id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Trade Area Filter */}
            <Select
              value={filters.tradeAreaId}
              onValueChange={(value) => handleFilterChange("tradeAreaId", value)}
              disabled={!filters.sectorId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Trade Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trade Areas</SelectItem>
                {tradeAreas.map((tradeArea) => (
                  <SelectItem key={tradeArea._id} value={tradeArea._id}>
                    {tradeArea.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Training Center Filter */}
            <Select
              value={filters.trainingCenterId}
              onValueChange={(value) => handleFilterChange("trainingCenterId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Training Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                {trainingCenters.map((center) => (
                  <SelectItem key={center._id} value={center._id}>
                    {center.trainingCentreName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Assignments Table */}
      {selectedPeriod && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Spinner />
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No assignments found for this period</p>
              <Dialog open={isSmartAssignDialogOpen} onOpenChange={setIsSmartAssignDialogOpen}>
  <DialogTrigger asChild>
    <button
      onClick={() => setIsSmartAssignDialogOpen(true)}
      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      <Users size={18} className="mr-2" />
      Assign Trainees
    </button>
  </DialogTrigger>
  <SmartAssignmentDialog 
    periodId={selectedPeriod} 
    onAssign={() => {
      fetchAssignments(selectedPeriod, 1);
      setIsSmartAssignDialogOpen(false);
    }} 
  />
</Dialog>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trainee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Training Center
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sector / Trade Area
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <AssignmentRow 
                        key={assignment._id} 
                        assignment={assignment} 
                        onStatusUpdate={updateAssignmentStatus} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

const AssignmentRow = ({ assignment, onStatusUpdate }) => {
    const getDistanceColor = (distance) => {
        if (distance < 10) return 'text-green-600';
        if (distance < 50) return 'text-yellow-600';
        return 'text-red-600';
      };

      return (
  <tr key={assignment._id} className="hover:bg-gray-50">
    <td className="px-6 py-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <Users className="h-10 w-10 text-gray-400" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {assignment.trainee.firstName} {assignment.trainee.lastName}
          </div>
          <div className="text-sm text-gray-500">{assignment.trainee.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {assignment.trainee.stateOfResidence === assignment.trainingCenter.state ? (
            <span className="text-green-600">Same state</span>
          ) : (
            <span className="text-yellow-600">Different state</span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {assignment.trainee.lgaOfResidence === assignment.trainingCenter.lga ? (
            <span className="text-green-600">Same LGA</span>
          ) : (
            <span className="text-yellow-600">Different LGA</span>
          )}
        </div>
      </td>
    <td className="px-6 py-4">
      <div className="flex items-center">
        <Building className="h-5 w-5 text-gray-400 mr-2" />
        <div>
          <div className="text-sm font-medium text-gray-900">
            {assignment.trainingCenter.trainingCentreName}
          </div>
          <div className="text-sm text-gray-500">
            {assignment.trainingCenter.address}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-gray-900">{assignment.sector.name}</div>
      <div className="text-sm text-gray-500">{assignment.tradeArea.name}</div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-gray-900">{assignment.trainingCenter.state}</div>
      <div className="text-sm text-gray-500">{assignment.trainingCenter.lga}</div>
    </td>
    <td className="px-6 py-4">
      <StatusBadge status={assignment.status} />
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      <div>Start: {new Date(assignment.startDate).toLocaleDateString()}</div>
      {assignment.endDate && (
        <div>End: {new Date(assignment.endDate).toLocaleDateString()}</div>
      )}
    </td>
    <td className="px-6 py-4 text-right">
      <AssignmentActions 
        assignment={assignment}
        onStatusUpdate={onStatusUpdate}
      />
    </td>
  </tr>
      
    );
}

const AssignmentActions = ({ assignment, onStatusUpdate }) => {
  const statusActions = {
    assigned: [
      { label: "Start", status: "in-progress", color: "text-yellow-600 hover:text-yellow-900" }
    ],
    "in-progress": [
      { label: "Complete", status: "completed", color: "text-green-600 hover:text-green-900" },
      { label: "Drop", status: "dropped", color: "text-red-600 hover:text-red-900" }
    ]
  };

  return (
    <div className="flex justify-end space-x-2">
      {statusActions[assignment.status]?.map(action => (
        <button
          key={action.status}
          onClick={() => onStatusUpdate(assignment._id, action.status)}
          className={`text-sm font-medium ${action.color}`}
        >
          {action.label}
        </button>
      ))}
      <Button variant="link" size="sm" asChild>
        <Link to={`/training/assignments/${assignment._id}`}>
          View
        </Link>
      </Button>
    </div>
  );
};

export default TrainingAssignmentDashboard;