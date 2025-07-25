import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import TrainingDashboardPage from "./TrainingDashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useLogout from "@/pages/loginPage/logout";
import { 
  LogOut,
  UserCircle, 
  Users, 
  GraduationCap, 
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CenterAssignments() {
  const centerId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const logout = useLogout();
  const [assignments, setAssignments] = useState([]);
  const [center, setCenter] = useState({});
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // --- Hierarchy Path State ---
  const [hierarchyPath, setHierarchyPath] = useState([]); // Tracks current hierarchy path
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, hierarchyPath]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [periodRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/periods`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get(`${API_BASE_URL}/training/center/${centerId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);
      setPeriods(periodRes.data);
      setAssignments(assignmentsRes.data.assignments);
      setFilteredAssignments(assignmentsRes.data.assignments);
      setCenter(assignmentsRes.data.trainingCenter);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Hierarchy Drilldown Logic ---
  const getNextHierarchyLevel = () => {
    if (hierarchyPath.length === 0) {
      return {
        level: 'year',
        label: 'Years',
        items: [...new Set(assignments.map(a => a.currentAssignment?.year).filter(Boolean))]
          .map(year => ({ value: year, name: `Year ${year}` }))
      };
    }
    const lastLevel = hierarchyPath[hierarchyPath.length - 1];
    switch (lastLevel.level) {
      case 'year':
        return {
          level: 'period',
          label: 'Periods',
          items: [...new Set(
            assignments
              .filter(a => a.currentAssignment?.year === lastLevel.value)
              .map(a => a.currentAssignment?.periodId)
              .filter(Boolean)
          )].map(period => ({ 
            value: period._id, 
            name: period.name 
          }))
        };
      case 'period':
        return {
          level: 'trainingType',
          label: 'Training Types',
          items: [...new Set(
            assignments
              .filter(a => a.currentAssignment?.periodId?._id === lastLevel.value)
              .map(a => a.currentAssignment?.trainingType)
              .filter(Boolean)
          )].map(type => ({ 
            value: type, 
            name: type 
          }))
        };
      case 'trainingType':
        return {
          level: 'sector',
          label: 'Sectors',
          items: [...new Set(
            assignments
              .filter(a => a.currentAssignment?.trainingType === lastLevel.value)
              .map(a => a.currentAssignment?.sector)
              .filter(Boolean)
          )].map(sector => ({ 
            value: sector, 
            name: sector 
          }))
        };
      case 'sector':
        return {
          level: 'tradeArea',
          label: 'Trade Areas',
          items: [...new Set(
            assignments
              .filter(a => a.currentAssignment?.sector === lastLevel.value)
              .map(a => a.currentAssignment?.tradeArea)
              .filter(Boolean)
          )].map(area => ({ 
            value: area, 
            name: area 
          }))
        };
      default:
        return null;
    }
  };

  // --- Filter assignments based on hierarchyPath ---
  const filterAssignments = () => {
    if (hierarchyPath.length === 0) {
      setFilteredAssignments(assignments);
      return;
    }
    setFilteredAssignments(assignments.filter(assignment => {
      const current = assignment.currentAssignment;
      if (!current) return false;
      return hierarchyPath.every(level => {
        switch (level.level) {
          case 'year': return current.year === level.value;
          case 'period': return current.periodId?._id === level.value;
          case 'trainingType': return current.trainingType === level.value;
          case 'sector': return current.sector === level.value;
          case 'tradeArea': return current.tradeArea === level.value;
          default: return true;
        }
      });
    }));
  };

  const getUniqueValues = (property) => {
    const values = new Set();
    filteredAssignments.forEach(assignment => {
      const value = assignment.currentAssignment?.[property];
      if (value) values.add(value);
    });
    return Array.from(values);
  };

  const getPeriodName = (periodId) => {
    const period = periods.find(p => p._id === periodId);
    return period?.name || periodId;
  };

  const getAvailableFilters = () => {
    const lastCrumb = hierarchyPath[hierarchyPath.length - 1];
    
    switch (lastCrumb.level) {
      case 'year':
        return {
          label: "Periods",
          property: "periodId._id",
          items: getUniqueValues("periodId._id").map(id => ({
            value: id,
            name: getPeriodName(id)
          }))
        };
      case 'period':
        return {
          label: "Training Types",
          property: "trainingType",
          items: getUniqueValues("trainingType").map(type => ({
            value: type,
            name: type
          }))
        };
      case 'trainingType':
        return {
          label: "Sectors",
          property: "sector",
          items: getUniqueValues("sector").map(sector => ({
            value: sector,
            name: sector
          }))
        };
      case 'sector':
        return {
          label: "Trade Areas",
          property: "tradeArea",
          items: getUniqueValues("tradeArea").map(area => ({
            value: area,
            name: area
          }))
        };
      default:
        return {
          label: "Years",
          property: "year",
          items: getUniqueValues("year").map(year => ({
            value: year,
            name: `Year ${year}`
          }))
        };
    }
  };

  const addFilter = (level, value, name) => {
    const newHierarchyPath = [
      ...hierarchyPath,
      { name, level, value }
    ];
    setHierarchyPath(newHierarchyPath);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRefresh = () => {
    fetchInitialData();
    setHierarchyPath([]);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log("Filter functionality to be implemented");
  };

  // --- UI ---
  const nextLevel = getNextHierarchyLevel();

  return (
    <ProtectedRoute href="/training-center/dashboard">
      {/* <TrainingDashboardPage>    */}
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    {/* <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                    </div> */}
                    {/* <div> */}
                      <h1 className="text-2xl font-bold text-gray-900">
                        Trainee Management
                      </h1>
                      {/* <p className="text-sm text-gray-600 mt-1">
                        {center?.trainingCentreName || "Training Center"}
                      </p>
                    </div> */}
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    
                      
                        {/* <Users className="w-4 h-4 text-blue-600" /> */}
                        {/* <span className="text-sm font-medium text-blue-900">
                          {assignments.length} Total Trainees
                        </span> */}
                        <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-6 py-2 shadow" onClick={() => navigate("/training-center/biodata")}> 
                          <UserCircle className="mr-2 h-4 w-4" /> Update Profile
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={logout}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-0"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    {/* <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search trainees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                      />
                    </div>
                    <button 
                      onClick={handleFilter}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filter</span>
                    </button> */}
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {assignments.length} Total Trainees
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span className="text-sm">Refresh</span>
                    </button>
                    <button 
                      onClick={handleExport}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild
                      className={!hierarchyPath.length ? "text-xs  text-blue-600" : ""}
                    >
                      <button 
                        onClick={() => setHierarchyPath([])}
                        className="text-xs hover:underline"
                      >
                        All Years
                      </button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {hierarchyPath.map((level, index) => (
                    <Fragment key={index}>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink 
                          asChild
                          className={index === hierarchyPath.length - 1 ? "text-xs text-blue-600" : ""}
                        >
                          <button 
                            onClick={() => setHierarchyPath(hierarchyPath.slice(0, index + 1))}
                            className="text-xs hover:underline"
                          >
                            {level.name}
                          </button>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Available Filters (Hierarchy Chips) */}
            {nextLevel && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-600 mb-2">
                  Clck on any {nextLevel.label}'s below to filter the trainees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nextLevel.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setHierarchyPath([
                        ...hierarchyPath,
                        { level: nextLevel.level, value: item.value, name: item.name }
                      ])}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-800 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Card */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Loading trainee data...</p>
                  </div>
                </div>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No trainees found
                  </h3>
                  <p className="text-gray-600">
                    {hierarchyPath.length > 1 
                      ? "No trainees match the current filters"
                      : "No trainees have been assigned to your center yet"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {hierarchyPath.length > 1 
                        ? `${filteredAssignments.length} Trainees`
                        : "All Trainees"}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {hierarchyPath.length > 1 
                        ? hierarchyPath.slice(1).map(c => c.name).join(" → ")
                        : "Showing all trainees"}
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trainee Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>PhoneNumber</TableHead>
                          <TableHead>Training Status</TableHead> 
                          <TableHead>Year</TableHead>
                          <TableHead>Training Period</TableHead>
                          <TableHead>Type of Training</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssignments.map((assignment) => (
                          <TableRow key={assignment._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {assignment.userId?.firstName?.charAt(0)}{assignment.userId?.lastName?.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {assignment.userId?.firstName} {assignment.userId?.lastName}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {assignment.userId?.email}
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {assignment.userId?.phoneNumber}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(assignment.currentAssignment?.status)}`}>
                                {assignment.currentAssignment?.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {assignment.currentAssignment?.year}
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {getPeriodName(assignment.currentAssignment?.periodId?._id)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {assignment.currentAssignment?.trainingType}
                            </TableCell>
                            <TableCell>
                              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">View</span>
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </TrainingDashboardPage> */}
    </ProtectedRoute>
  );
}

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/env";
// import TrainingDashboardPage from "./TrainingDashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { 
//   ChevronDown, 
//   ChevronRight, 
//   Users, 
//   GraduationCap, 
//   Building2, 
//   Calendar,
//   Search,
//   Filter,
//   Eye,
//   Download,
//   RefreshCw
// } from "lucide-react";

// export default function CenterAssignments() {
//   const centerId = localStorage.getItem("userId");
//   const accessToken = localStorage.getItem("accessToken");
  
//   const [assignments, setAssignments] = useState([]);
//   const [center, setCenter] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [periods, setPeriods] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedItems, setExpandedItems] = useState({
//     years: {},
//     periods: {},
//     trainingTypes: {},
//     sectors: {},
//     tradeAreas: {}
//   });

//   // Group assignments by year → period → training type → sector → trade area
//   const groupedAssignments = assignments.reduce((acc, assignment) => {
//     const year = assignment.currentAssignment?.year;
//     const periodId = assignment.currentAssignment?.periodId?._id;
//     const periodName = assignment.currentAssignment?.periodId?.name;
//     const trainingType = assignment.currentAssignment?.trainingType;
//     const sector = assignment.currentAssignment?.sector;
//     const tradeArea = assignment.currentAssignment?.tradeArea;
    
//     if (!year || !periodId || !trainingType || !sector || !tradeArea) return acc;
    
//     // Year level
//     if (!acc[year]) {
//       acc[year] = { periods: {} };
//     }
    
//     // Period level
//     if (!acc[year].periods[periodId]) {
//       acc[year].periods[periodId] = { name: periodName, trainingTypes: {} };
//     }
    
//     // Training Type level
//     if (!acc[year].periods[periodId].trainingTypes[trainingType]) {
//       acc[year].periods[periodId].trainingTypes[trainingType] = { sectors: {} };
//     }
    
//     // Sector level
//     if (!acc[year].periods[periodId].trainingTypes[trainingType].sectors[sector]) {
//       acc[year].periods[periodId].trainingTypes[trainingType].sectors[sector] = { tradeAreas: {} };
//     }
    
//     // Trade Area level
//     if (!acc[year].periods[periodId].trainingTypes[trainingType].sectors[sector].tradeAreas[tradeArea]) {
//       acc[year].periods[periodId].trainingTypes[trainingType].sectors[sector].tradeAreas[tradeArea] = [];
//     }
    
//     acc[year].periods[periodId].trainingTypes[trainingType].sectors[sector].tradeAreas[tradeArea].push(assignment);
    
//     return acc;
//   }, {});

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     try {
//       setLoading(true);
//       const [periodRes, assignmentsRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/periods`, {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         }),
//         axios.get(`${API_BASE_URL}/training/center/${centerId}`, {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         })
//       ]);
      
//       setPeriods(periodRes.data);
//       setAssignments(assignmentsRes.data.assignments);
//       setCenter(assignmentsRes.data.trainingCenter);
//     } catch (err) {
//       console.error("Failed to fetch data", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = (type, id) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [id]: !prev[type][id]
//       }
//     }));
//   };

//   const isExpanded = (type, id) => {
//     return expandedItems[type]?.[id];
//   };

//   // Count trainees functions
//   const countTraineesInYear = (yearData) => {
//     return Object.values(yearData.periods).reduce((sum, period) => {
//       return sum + Object.values(period.trainingTypes).reduce((s, type) => {
//         return s + Object.values(type.sectors).reduce((secSum, sector) => {
//           return secSum + Object.values(sector.tradeAreas).reduce(
//             (tradeSum, trainees) => tradeSum + trainees.length, 0
//           );
//         }, 0);
//       }, 0);
//     }, 0);
//   };

//   const countTraineesInPeriod = (periodData) => {
//     return Object.values(periodData.trainingTypes).reduce((sum, type) => {
//       return sum + Object.values(type.sectors).reduce((s, sector) => {
//         return s + Object.values(sector.tradeAreas).reduce(
//           (tradeSum, trainees) => tradeSum + trainees.length, 0
//         );
//       }, 0);
//     }, 0);
//   };

//   const countTraineesInTrainingType = (typeData) => {
//     return Object.values(typeData.sectors).reduce((sum, sector) => {
//       return sum + Object.values(sector.tradeAreas).reduce(
//         (tradeSum, trainees) => tradeSum + trainees.length, 0
//       );
//     }, 0);
//   };

//   const countTraineesInSector = (sectorData) => {
//     return Object.values(sectorData.tradeAreas).reduce(
//       (sum, trainees) => sum + trainees.length, 0
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active':
//         return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       case 'pending':
//         return 'bg-amber-100 text-amber-800 border-amber-200';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'suspended':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const handleRefresh = () => {
//     fetchInitialData();
//   };

//   const handleExport = () => {
//     // TODO: Implement export functionality
//     console.log("Export functionality to be implemented");
//   };

//   const handleFilter = () => {
//     // TODO: Implement filter functionality
//     console.log("Filter functionality to be implemented");
//   };

//   return (
//     <ProtectedRoute href="/training-center/dashboard">
//       <TrainingDashboardPage>
//         <div className="min-h-screen bg-gray-50">
//           {/* Header Section */}
//           <div className="bg-white border-b border-gray-200 shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="py-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                         <GraduationCap className="w-6 h-6 text-white" />
//                       </div>
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold text-gray-900">
//                         Trainee Management
//                       </h1>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {center?.trainingCentreName || "Training Center"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-4 sm:mt-0 flex items-center space-x-3">
//                     <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
//                       <div className="flex items-center space-x-2">
//                         <Users className="w-4 h-4 text-blue-600" />
//                         <span className="text-sm font-medium text-blue-900">
//                           {assignments.length} Total Trainees
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {/* Action Bar */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//               <div className="p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
//                   <div className="flex items-center space-x-3">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         placeholder="Search trainees..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//                       />
//                     </div>
//                     <button 
//                       onClick={handleFilter}
//                       className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <Filter className="w-4 h-4" />
//                       <span className="text-sm">Filter</span>
//                     </button>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <button 
//                       onClick={handleRefresh}
//                       disabled={loading}
//                       className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//                     >
//                       <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                       <span className="text-sm">Refresh</span>
//                     </button>
//                     <button 
//                       onClick={handleExport}
//                       className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <Download className="w-4 h-4" />
//                       <span className="text-sm">Export</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content Card */}
//             {loading ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                 <div className="flex justify-center items-center h-64">
//                   <div className="text-center">
//                     <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
//                     <p className="text-gray-600">Loading trainee data...</p>
//                   </div>
//                 </div>
//               </div>
//             ) : assignments.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                 <div className="p-12 text-center">
//                   <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No trainees assigned</h3>
//                   <p className="text-gray-600">No trainees have been assigned to your center yet.</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900">Trainee Hierarchy</h2>
//                     <div className="text-sm text-gray-500">
//                       Organized by Year → Period → Training Type → Sector → Trade Area
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {Object.entries(groupedAssignments).map(([year, yearData]) => (
//                       <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
//                         <button
//                           onClick={() => toggleExpand('years', year)}
//                           className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
//                         >
//                           <div className="flex items-center space-x-3">
//                             {isExpanded('years', year) ? (
//                               <ChevronDown className="h-5 w-5 text-blue-600" />
//                             ) : (
//                               <ChevronRight className="h-5 w-5 text-blue-600" />
//                             )}
//                             <div className="flex items-center space-x-2">
//                               <Calendar className="h-5 w-5 text-blue-600" />
//                               <h3 className="font-semibold text-gray-900">Year {year}</h3>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                               {countTraineesInYear(yearData)} trainees
//                             </div>
//                           </div>
//                         </button>

//                         {isExpanded('years', year) && (
//                           <div className="bg-gray-50 p-4">
//                             <div className="space-y-3">
//                               {Object.entries(yearData.periods).map(([periodId, periodData]) => (
//                                 <div key={periodId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                   <button
//                                     onClick={() => toggleExpand('periods', `${year}-${periodId}`)}
//                                     className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
//                                   >
//                                     <div className="flex items-center space-x-3">
//                                       {isExpanded('periods', `${year}-${periodId}`) ? (
//                                         <ChevronDown className="h-4 w-4 text-gray-600" />
//                                       ) : (
//                                         <ChevronRight className="h-4 w-4 text-gray-600" />
//                                       )}
//                                       <h4 className="font-medium text-gray-900">{periodData.name}</h4>
//                                     </div>
//                                     <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                                       {countTraineesInPeriod(periodData)} trainees
//                                     </div>
//                                   </button>

//                                   {isExpanded('periods', `${year}-${periodId}`) && (
//                                     <div className="bg-gray-50 p-3">
//                                       <div className="space-y-3">
//                                         {Object.entries(periodData.trainingTypes).map(([trainingType, typeData]) => (
//                                           <div key={trainingType} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                             <button
//                                               onClick={() => toggleExpand('trainingTypes', `${year}-${periodId}-${trainingType}`)}
//                                               className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
//                                             >
//                                               <div className="flex items-center space-x-3">
//                                                 {isExpanded('trainingTypes', `${year}-${periodId}-${trainingType}`) ? (
//                                                   <ChevronDown className="h-4 w-4 text-gray-600" />
//                                                 ) : (
//                                                   <ChevronRight className="h-4 w-4 text-gray-600" />
//                                                 )}
//                                                 <div className="flex items-center space-x-2">
//                                                   <GraduationCap className="h-4 w-4 text-purple-600" />
//                                                   <h5 className="font-medium text-gray-900">{trainingType}</h5>
//                                                 </div>
//                                               </div>
//                                               <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
//                                                 {countTraineesInTrainingType(typeData)} trainees
//                                               </div>
//                                             </button>

//                                             {isExpanded('trainingTypes', `${year}-${periodId}-${trainingType}`) && (
//                                               <div className="bg-gray-50 p-3">
//                                                 <div className="space-y-3">
//                                                   {Object.entries(typeData.sectors).map(([sector, sectorData]) => (
//                                                     <div key={sector} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                                       <button
//                                                         onClick={() => toggleExpand('sectors', `${year}-${periodId}-${trainingType}-${sector}`)}
//                                                         className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
//                                                       >
//                                                         <div className="flex items-center space-x-3">
//                                                           {isExpanded('sectors', `${year}-${periodId}-${trainingType}-${sector}`) ? (
//                                                             <ChevronDown className="h-4 w-4 text-gray-600" />
//                                                           ) : (
//                                                             <ChevronRight className="h-4 w-4 text-gray-600" />
//                                                           )}
//                                                           <div className="flex items-center space-x-2">
//                                                             <Building2 className="h-4 w-4 text-orange-600" />
//                                                             <h6 className="font-medium text-gray-900">{sector}</h6>
//                                                           </div>
//                                                         </div>
//                                                         <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
//                                                           {countTraineesInSector(sectorData)} trainees
//                                                         </div>
//                                                       </button>

//                                                       {isExpanded('sectors', `${year}-${periodId}-${trainingType}-${sector}`) && (
//                                                         <div className="bg-gray-50 p-3">
//                                                           <div className="space-y-3">
//                                                             {Object.entries(sectorData.tradeAreas).map(([tradeArea, trainees]) => (
//                                                               <div key={tradeArea} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                                                 <button
//                                                                   onClick={() => toggleExpand('tradeAreas', `${year}-${periodId}-${trainingType}-${sector}-${tradeArea}`)}
//                                                                   className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
//                                                                 >
//                                                                   <div className="flex items-center space-x-3">
//                                                                     {isExpanded('tradeAreas', `${year}-${periodId}-${trainingType}-${sector}-${tradeArea}`) ? (
//                                                                       <ChevronDown className="h-4 w-4 text-gray-600" />
//                                                                     ) : (
//                                                                       <ChevronRight className="h-4 w-4 text-gray-600" />
//                                                                     )}
//                                                                     <h6 className="font-medium text-gray-900">{tradeArea}</h6>
//                                                                   </div>
//                                                                   <div className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
//                                                                     {trainees.length} trainees
//                                                                   </div>
//                                                                 </button>

//                                                                 {isExpanded('tradeAreas', `${year}-${periodId}-${trainingType}-${sector}-${tradeArea}`) && (
//                                                                   <div className="p-4 bg-white">
//                                                                     <div className="overflow-x-auto">
//                                                                       <table className="min-w-full divide-y divide-gray-200">
//                                                                         <thead className="bg-gray-50">
//                                                                           <tr>
//                                                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                               Name
//                                                                             </th>
//                                                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                               Email
//                                                                             </th>
//                                                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                               Phone
//                                                                             </th>
//                                                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                               Status
//                                                                             </th>
//                                                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                               Actions
//                                                                             </th>
//                                                                           </tr>
//                                                                         </thead>
//                                                                         <tbody className="bg-white divide-y divide-gray-200">
//                                                                           {trainees.map((assignment) => (
//                                                                             <tr key={assignment._id} className="hover:bg-gray-50 transition-colors">
//                                                                               <td className="px-6 py-4 whitespace-nowrap">
//                                                                                 <div className="flex items-center">
//                                                                                   <div className="flex-shrink-0 h-8 w-8">
//                                                                                     <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
//                                                                                       <span className="text-sm font-medium text-gray-700">
//                                                                                         {assignment.userId?.firstName?.charAt(0)}{assignment.userId?.lastName?.charAt(0)}
//                                                                                       </span>
//                                                                                     </div>
//                                                                                   </div>
//                                                                                   <div className="ml-4">
//                                                                                     <div className="text-sm font-medium text-gray-900">
//                                                                                       {assignment.userId?.firstName} {assignment.userId?.lastName}
//                                                                                     </div>
//                                                                                   </div>
//                                                                                 </div>
//                                                                               </td>
//                                                                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                                                 {assignment.userId?.email}
//                                                                               </td>
//                                                                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                                                 {assignment.userId?.phoneNumber}
//                                                                               </td>
//                                                                               <td className="px-6 py-4 whitespace-nowrap">
//                                                                                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(assignment.currentAssignment?.status)}`}>
//                                                                                   {assignment.currentAssignment?.status}
//                                                                                 </span>
//                                                                               </td>
//                                                                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                                                 <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors">
//                                                                                   <Eye className="w-4 h-4" />
//                                                                                   <span>View Details</span>
//                                                                                 </button>
//                                                                               </td>
//                                                                             </tr>
//                                                                           ))}
//                                                                         </tbody>
//                                                                       </table>
//                                                                     </div>
//                                                                   </div>
//                                                                 )}
//                                                               </div>
//                                                             ))}
//                                                           </div>
//                                                         </div>
//                                                       )}
//                                                     </div>
//                                                   ))}
//                                                 </div>
//                                               </div>
//                                             )}
//                                           </div>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </TrainingDashboardPage>
//     </ProtectedRoute>
//   );
// }


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "@/config/env";
// import TrainingDashboardPage from "./TrainingDashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Button } from "@/components/ui/button";

// export default function CenterAssignments() {
//   const centerId = localStorage.getItem("userId");

//   const [filters, setFilters] = useState({
//     periodId: "",
//     year: "",
//     trainingType: "",
//     sector: "",
//     tradeArea: "",
//   });

//   const [assignments, setAssignments] = useState([]);
//   const [totals, setTotals] = useState({});
//   const [center, setCenter] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [periods, setPeriods] = useState([]);
//   const [trainingTypes] = useState(["Short-term", "Long-term"]);
//   const [sectors] = useState(["Agriculture", "Technology", "Construction"]);
//   const [tradeAreas, setTradeAreas] = useState(["Tailoring", "Welding", "Coding"]);

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     try {
     
//       const accessToken = localStorage.getItem("accessToken");
//       const [periodRes, yearRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/periods`, {
//           headers: { Authorization: `Bearer ${accessToken}` }
//         })
//       ]);   

//       setPeriods(periodRes.data);
      
//     } catch (err) {
//       console.error("Failed to fetch filter options", err);
//     }
//   };

//   useEffect(() => {
//     if (centerId) fetchAssignments();
//   }, [centerId, filters]);

//   const fetchAssignments = async () => {
//     setLoading(true);
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const res = await axios.get(`${API_BASE_URL}/training/center/${centerId}`, {
//         params: filters,
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });

//       setAssignments(res.data.assignments);
//       setTotals(res.data.totals);
//       setCenter(res.data.trainingCenter);
//     } catch (err) {
//       console.error("Failed to fetch assignments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   return (
//     <ProtectedRoute href="/training-center/dashboard">
//       <TrainingDashboardPage>
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">
//         Assignments for {center?.name || "Training Center"}
//       </h2>

//       {/* Filter Dropdowns */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <select name="periodId" onChange={handleFilterChange} className="p-2 border rounded">
//           <option value="">Select Period</option>
//           {periods.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>
//         <select name="trainingType" onChange={handleFilterChange} className="p-2 border rounded">
//           <option value="">Training Type</option>
//           {trainingTypes.map((t) => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>

//         <select name="sector" onChange={handleFilterChange} className="p-2 border rounded">
//           <option value="">Select Sector</option>
//           {sectors.map((s) => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>

//         <select name="tradeArea" onChange={handleFilterChange} className="p-2 border rounded">
//           <option value="">Select Trade Area</option>
//           {tradeAreas.map((t) => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>
//       </div>

//       {/* Loader */}
//       {loading && <p className="text-blue-500">Loading...</p>}

//       {/* Totals Summary */}
//       {!loading && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Summary Totals</h3>
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             <li>Total Assignments: {assignments.length}</li>
//             <li>By Period: {Object.keys(totals.byPeriod || {}).length}</li>
//             <li>By Year: {Object.keys(totals.byYear || {}).length}</li>
//             <li>By Sector: {Object.keys(totals.bySector || {}).length}</li>
//             <li>By Trade Area: {Object.keys(totals.byTradeArea || {}).length}</li>
//             <li>By Training Type: {Object.keys(totals.byTrainingType || {}).length}</li>
//           </ul>
//         </div>
//       )}

//       {/* Assignments Table */}
//       {!loading && (
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">Phone</th>
//                 <th className="p-2 border">Period</th>
//                 <th className="p-2 border">Year</th>
//                 <th className="p-2 border">Type</th>
//                 <th className="p-2 border">Sector</th>
//                 <th className="p-2 border">Trade Area</th>
//                 <th className="p-2 border">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assignments.map((a, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="p-2 border">{a.userId?.firstName} {a.userId?.lastName}</td>
//                   <td className="p-2 border">{a.userId?.email}</td>
//                   <td className="p-2 border">{a.userId?.phoneNumber}</td>
//                   <td className="p-2 border">{a.currentAssignment?.periodId?.name}</td>
//                   <td className="p-2 border">{a.currentAssignment?.year}</td>
//                   <td className="p-2 border">{a.currentAssignment?.trainingType}</td>
//                   <td className="p-2 border">{a.currentAssignment?.sector}</td>
//                   <td className="p-2 border">{a.currentAssignment?.tradeArea}</td>
//                   <td className="p-2 border">{a.currentAssignment?.status || a.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>

//   </TrainingDashboardPage>
// </ProtectedRoute>
//   );
// }
