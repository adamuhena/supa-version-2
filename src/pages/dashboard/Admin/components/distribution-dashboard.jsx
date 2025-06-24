

// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { API_BASE_URL } from "@/config/env"
// import { GenderDistribution } from "./components/gender-distribution"
// import { GeographicDistribution } from "./components/geographic-distribution"
// import { SectorDistribution } from "./components/sector-distribution"
// import { TradeAreaDistribution } from "./components/trade-area-distribution"
// import { DistributionFilters } from "./components/distribution-filters"
// import { CrossTabDistribution } from "./components/cross-tab-distribution"
// import { ErrorBoundary } from '@/components/ErrorBoundary';
// import Metrics from "./Metrics"
// import NigerianMap from "@/components/NigerianMap"
// import RecentRegistrations from "./RecentRegistrations"
// import { Button } from "@/components/ui/button" // Add this import
// import { ChevronDown, ChevronUp, ChevronRight, Filter } from 'lucide-react' // Add this import
// import NewRegistration from './NewRegistration';
// import { PayloadDataTable } from "./components/payload-data-table"
// import { CSVLink } from "react-csv"
// import jsPDF from "jspdf"
// import "jspdf-autotable"
// import { Download } from "lucide-react"

// export default function DistributionDashboard() {
//   const [analyticsData, setAnalyticsData] = useState(null)
//   const [geoData, setGeoData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filters, setFilters] = useState({
//     role: "all", // "all", "artisan_user", "intending_artisan"
//     gender: "all", // "all", "male", "female"
//     stateOfResidence: "all",
//     stateOfOrigin: "all",
//     sector: "all",
//     tradeArea: "all",
//   })
//   const [showFilters, setShowFilters] = useState(false) // Add this state

//   const formatDataForExport = (analyticsData) => {
//     if (!analyticsData) return []
  
//     const headers = [
//       { label: "Distribution Type", key: "type" },
//       { label: "Category", key: "category" },
//       { label: "Count", key: "count" },
//       { label: "Percentage", key: "percentage" }
//     ]
  
//     const data = []
  
//     // Gender Distribution
//     analyticsData.genderDistribution?.forEach(item => {
//       data.push({
//         type: "Gender",
//         category: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%"
//       })
//     })
  
//     // Geographic Distribution
//     analyticsData.geographicDistribution?.forEach(item => {
//       data.push({
//         type: "Geographic",
//         category: item._id || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%"
//       })
//     })
  
//     // Sector Distribution
//     analyticsData.sectorDistribution?.forEach(item => {
//       data.push({
//         type: "Sector",
//         category: item._id?.name || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%"
//       })
//     })
  
//     return { headers, data }
//   }
  
//   const generatePDF = (analyticsData) => {
//     const { headers, data } = formatDataForExport(analyticsData)
//     const doc = new jsPDF()
  
//     // Add title
//     doc.setFontSize(16)
//     doc.text("Distribution Dashboard Report", 14, 15)
//     doc.setFontSize(10)
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25)
  
//     // Create table
//     doc.autoTable({
//       startY: 35,
//       head: [headers.map(h => h.label)],
//       body: data.map(item => [
//         item.type,
//         item.category,
//         item.count,
//         item.percentage
//       ]),
//       theme: 'grid',
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] }
//     })
  
//     doc.save("distribution-report.pdf")
//   }

//   // Update the fetchAnalytics function to handle the new API structure
//   const fetchAnalytics = async () => {
//     const accessToken = localStorage.getItem("accessToken")
//     if (!accessToken) {
//       setError("Access token is missing. Please log in again.")
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)

//       // Build query parameters based on filters
//       const queryParams = new URLSearchParams()
//       if (filters.role !== "all") queryParams.append("role", filters.role)
//       if (filters.gender !== "all") queryParams.append("gender", filters.gender)
//       if (filters.stateOfResidence !== "all") queryParams.append("stateOfResidence", filters.stateOfResidence)
//       if (filters.stateOfOrigin !== "all") queryParams.append("stateOfOrigin", filters.stateOfOrigin)
//       if (filters.sector !== "all") queryParams.append("sector", filters.sector)
//       if (filters.tradeArea !== "all") queryParams.append("tradeArea", filters.tradeArea)

//       // Fetch all distribution data in one call
//       const response = await axios.get(`${API_BASE_URL}/distribution/all?${queryParams.toString()}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       })

//       if (response.data.success) {
//         // Set the analytics data from the response
//         setAnalyticsData(response.data.data || {})
//         // Also set the geo data from the same response since it contains all the geographic information
//         setGeoData(response.data.data || {})
//       } else {
//         throw new Error(response.data.message || "Failed to fetch analytics data")
//       }
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [])

//   const handleFilterChange = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }))
//   }


//   if (error) {
//     return (
//       <div className="container mx-auto px-6 py-10 max-w-7xl">
//         <Card className="border-2 border-red-300 bg-red-50 shadow-lg">
//           <CardHeader className="space-y-2">
//             <CardTitle className="text-2xl font-bold text-red-600">Error Loading Dashboard</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-red-600 text-lg">{error}</p>
//             <button
//               onClick={fetchAnalytics}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
//                        transition-colors duration-200 font-medium focus:outline-none 
//                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Retry
//             </button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="mx-auto  max-w-7xl">
//       <div className="mb-1">
//         <div className="flex items-center space-x-2 text-sm">
//           <Button
//             onClick={() => setShowFilters(!showFilters)}
//             variant="ghost"
//             size="sm"
//             className={`
//               inline-flex items-center px-3 py-1 rounded-md
//               ${showFilters
//                 ? 'bg-primary/10 text-primary hover:bg-primary/20'
//                 : 'hover:bg-gray-100'
//               }
//             `}
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             <span>Filters</span>
//           </Button>
//           <ChevronRight className="h-4 w-4 text-gray-400" />
//           <span className="text-gray-500">
//             {/* {Object.values(filters).filter(v => v !== 'all').length}  */}
//             click to filter from our range of data
//           </span>

//           <div className="flex justify-end gap-4 mb-4">
//             <CSVLink
//               data={formatDataForExport(analyticsData)?.data || []}
//               headers={formatDataForExport(analyticsData)?.headers || []}
//               filename="distribution-report.csv"
//               className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export CSV
//             </CSVLink>
            
//             <Button
//               onClick={() => generatePDF(analyticsData)}
//               variant="outline"
//               className="inline-flex items-center justify-center"
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export PDF
//             </Button>
//           </div>
//         </div>

//         <div className={`
//           mt-3 transition-all duration-300 ease-in-out
//           ${showFilters
//             ? 'opacity-100 max-h-[500px]'
//             : 'opacity-0 max-h-0 overflow-hidden'

            
//           }
//         `}>
//           <div className="p-4 border rounded-lg bg-white shadow-sm">
//             <DistributionFilters onFilterChange={handleFilterChange} />
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="main" className="space-y-8">
//         <TabsList className="grid w-full h-auto lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
//           <TabsTrigger
//             value="main"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Main Dashboard
//           </TabsTrigger>
//           <TabsTrigger
//             value="gender"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Gender Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="geographic"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Geographic Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="sector"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Sector Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="payload"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                        data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Distribution Count
//           </TabsTrigger>
//           {/* <TabsTrigger 
//             value="crosstab"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Cross-Tabulation
//           </TabsTrigger> */}
//         </TabsList>


//         <TabsContent value="main" className="mt-8">

//           <div className="w-full h-auto">
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-12">
//                 <Metrics analyticsData={analyticsData} />
//               </div>
//             </section>

//             {/* Map and New Registration side by side */}
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-8">
//                 <NigerianMap analyticsData={analyticsData} />
//               </div>
//               <div className="lg:col-span-4 flex flex-col gap-8">
//                 {/* <RecentRegistrations /> */}
//                 <RecentRegistrations analyticsData={analyticsData} />
//                 <NewRegistration />
//               </div>
//             </section>

//           </div>
//         </TabsContent>

//         <TabsContent value="gender" className="mt-0">
//           <div className="w-full h-[400px] min-h-[400px]"> {/* Added fixed height */}
//             <GenderDistribution
//               analyticsData={analyticsData}
//               geoData={geoData}
//               filters={filters}
//             />
//           </div>
//         </TabsContent>

//         <TabsContent value="geographic" className="mt-0">
//           <div className="w-full h-[500px] min-h-[500px]"> {/* Added fixed height */}
//             <GeographicDistribution
//               geoData={geoData}
//               filters={filters}
//             />
//           </div>
//         </TabsContent>

//         <TabsContent value="sector" className="mt-0">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 {/* <div className="w-full h-[300px] min-h-[300px]"> Added fixed height */}
//                 <ErrorBoundary>
//                   <SectorDistribution
//                     analyticsData={analyticsData}
//                     geoData={geoData}
//                     filters={filters}
//                   />
//                 </ErrorBoundary>
//                 {/* </div> */}
//               </CardContent>
//             </Card>
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 <div className="w-full h-[300px] min-h-[300px]"> {/* Added fixed height */}
//                   <TradeAreaDistribution
//                     analyticsData={analyticsData}
//                     geoData={geoData}
//                     filters={filters}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="payload" className="mt-0">
//           <div className="w-full">
//             <PayloadDataTable analyticsData={analyticsData} />
//           </div>
//         </TabsContent>

//         {/* <TabsContent value="crosstab" className="mt-0">
//             <div className="w-full h-[400px] min-h-[400px]"> 
//               <CrossTabDistribution 
//                 geoData={geoData} 
//                 filters={filters} 
//               />
//             </div>
//           </TabsContent> */}
//         {/* </div> */}
//       </Tabs>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { API_BASE_URL } from "@/config/env"
// import { GenderDistribution } from "./components/gender-distribution"
// import { GeographicDistribution } from "./components/geographic-distribution"
// import { SectorDistribution } from "./components/sector-distribution"
// import { TradeAreaDistribution } from "./components/trade-area-distribution"
// import { DistributionFilters } from "./components/distribution-filters"
// import { ErrorBoundary } from "@/components/ErrorBoundary"
// import Metrics from "./Metrics"
// import NigerianMap from "@/components/NigerianMap"
// import RecentRegistrations from "./RecentRegistrations"
// import { Button } from "@/components/ui/button"
// import { ChevronRight, Filter } from "lucide-react"
// import NewRegistration from "./NewRegistration"
// import { PayloadDataTable } from "./components/payload-data-table"
// import { ExportDropdown } from "./export-dropdown"

// export default function DistributionDashboard() {
//   const [analyticsData, setAnalyticsData] = useState(null)
//   const [geoData, setGeoData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filters, setFilters] = useState({
//     role: "all", // "all", "artisan_user", "intending_artisan"
//     gender: "all", // "all", "male", "female"
//     stateOfResidence: "all",
//     stateOfOrigin: "all",
//     sector: "all",
//     tradeArea: "all",
//   })
//   const [showFilters, setShowFilters] = useState(false)

//   const formatDataForExport = (analyticsData) => {
//     if (!analyticsData) return []

//     const headers = [
//       { label: "Distribution Type", key: "type" },
//       { label: "Category", key: "category" },
//       { label: "Count", key: "count" },
//       { label: "Percentage", key: "percentage" },
//     ]

//     const data = []

//     // Gender Distribution
//     analyticsData.genderDistribution?.forEach((item) => {
//       data.push({
//         type: "Gender",
//         category: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%",
//       })
//     })

//     // Geographic Distribution
//     analyticsData.geographicDistribution?.forEach((item) => {
//       data.push({
//         type: "Geographic",
//         category: item._id || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%",
//       })
//     })

//     // Sector Distribution
//     analyticsData.sectorDistribution?.forEach((item) => {
//       data.push({
//         type: "Sector",
//         category: item._id?.name || "Unknown",
//         count: item.count || 0,
//         percentage: ((item.count / analyticsData.totalUsers) * 100).toFixed(2) + "%",
//       })
//     })

//     return { headers, data }
//   }

//   // Update the fetchAnalytics function to handle the new API structure
//   const fetchAnalytics = async () => {
//     const accessToken = localStorage.getItem("accessToken")
//     if (!accessToken) {
//       setError("Access token is missing. Please log in again.")
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)

//       // Build query parameters based on filters
//       const queryParams = new URLSearchParams()
//       if (filters.role !== "all") queryParams.append("role", filters.role)
//       if (filters.gender !== "all") queryParams.append("gender", filters.gender)
//       if (filters.stateOfResidence !== "all") queryParams.append("stateOfResidence", filters.stateOfResidence)
//       if (filters.stateOfOrigin !== "all") queryParams.append("stateOfOrigin", filters.stateOfOrigin)
//       if (filters.sector !== "all") queryParams.append("sector", filters.sector)
//       if (filters.tradeArea !== "all") queryParams.append("tradeArea", filters.tradeArea)

//       // Fetch all distribution data in one call
//       const response = await axios.get(`${API_BASE_URL}/distribution/all?${queryParams.toString()}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       })

//       if (response.data.success) {
//         // Set the analytics data from the response
//         setAnalyticsData(response.data.data || {})
//         // Also set the geo data from the same response since it contains all the geographic information
//         setGeoData(response.data.data || {})
//       } else {
//         throw new Error(response.data.message || "Failed to fetch analytics data")
//       }
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [])

//   const handleFilterChange = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }))
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-6 py-10 max-w-7xl">
//         <Card className="border-2 border-red-300 bg-red-50 shadow-lg">
//           <CardHeader className="space-y-2">
//             <CardTitle className="text-2xl font-bold text-red-600">Error Loading Dashboard</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-red-600 text-lg">{error}</p>
//             <button
//               onClick={fetchAnalytics}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
//                        transition-colors duration-200 font-medium focus:outline-none 
//                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Retry
//             </button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="mb-1">
//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center space-x-2">
//             <Button
//               onClick={() => setShowFilters(!showFilters)}
//               variant="ghost"
//               size="sm"
//               className={`
//                 inline-flex items-center px-3 py-1 rounded-md
//                 ${showFilters ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-gray-100"}
//               `}
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               <span>Filters</span>
//             </Button>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <span className="text-gray-500">click to filter from our range of data</span>
//           </div>

//           <div className="flex items-center">
//             <ExportDropdown analyticsData={analyticsData} formatDataForExport={formatDataForExport} />
//           </div>
//         </div>

//         <div
//           className={`
//           mt-3 transition-all duration-300 ease-in-out
//           ${showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}
//         `}
//         >
//           <div className="p-4 border rounded-lg bg-white shadow-sm">
//             <DistributionFilters onFilterChange={handleFilterChange} />
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="main" className="space-y-8">
//         <TabsList className="grid w-full h-auto lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
//           <TabsTrigger
//             value="main"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Main Dashboard
//           </TabsTrigger>
//           <TabsTrigger
//             value="gender"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Gender Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="geographic"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Geographic Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="sector"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Sector Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="payload"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                        data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Distribution Count
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="main" className="mt-8">
//           <div className="w-full h-auto">
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-12">
//                 <Metrics analyticsData={analyticsData} />
//               </div>
//             </section>

//             {/* Map and New Registration side by side */}
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-8">
//                 <NigerianMap analyticsData={analyticsData} />
//               </div>
//               <div className="lg:col-span-4 flex flex-col gap-8">
//                 <RecentRegistrations analyticsData={analyticsData} />
//                 <NewRegistration />
//               </div>
//             </section>
//           </div>
//         </TabsContent>

//         <TabsContent value="gender" className="mt-0">
//           <div className="w-full h-[400px] min-h-[400px]">
//             <GenderDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//           </div>
//         </TabsContent>

//         <TabsContent value="geographic" className="mt-0">
//           <div className="w-full h-[500px] min-h-[500px]">
//             <GeographicDistribution geoData={geoData} filters={filters} />
//           </div>
//         </TabsContent>

//         <TabsContent value="sector" className="mt-0">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 <ErrorBoundary>
//                   <SectorDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//                 </ErrorBoundary>
//               </CardContent>
//             </Card>
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 <div className="w-full h-[300px] min-h-[300px]">
//                   <TradeAreaDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="payload" className="mt-0">
//           <div className="w-full">
//             <PayloadDataTable analyticsData={analyticsData} />
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { API_BASE_URL } from "@/config/env"
import { GenderDistribution } from "./components/gender-distribution"
import { GeographicDistribution } from "./components/geographic-distribution"
import { SectorDistribution } from "./components/sector-distribution"
import { TradeAreaDistribution } from "./components/trade-area-distribution"
import { DistributionFilters } from "./components/distribution-filters"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import Metrics from "./Metrics"
import NigerianMap from "@/components/NigerianMap"
import RecentRegistrations from "./RecentRegistrations"
import { Button } from "@/components/ui/button"
import { ChevronRight, Filter } from "lucide-react"
import NewRegistration from "./NewRegistration"
import { PayloadDataTable } from "./components/payload-data-table"
import { ExportDropdown } from "./export-dropdown"

export default function DistributionDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [geoData, setGeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    role: "all", // "all", "artisan_user", "intending_artisan"
    gender: "all", // "all", "male", "female"
    stateOfResidence: "all",
    stateOfOrigin: "all",
    sector: "all",
    tradeArea: "all",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage (adjust key as needed)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isEditable = user?.role === "superadmin";


  // Update the fetchAnalytics function to handle the new API structure
  const fetchAnalytics = async () => {
     setError(null);
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      setError("Access token is missing. Please log in again.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Build query parameters based on filters
      const queryParams = new URLSearchParams()
      if (filters.role !== "all") queryParams.append("role", filters.role)
      if (filters.gender !== "all") queryParams.append("gender", filters.gender)
      if (filters.stateOfResidence !== "all") queryParams.append("stateOfResidence", filters.stateOfResidence)
      if (filters.stateOfOrigin !== "all") queryParams.append("stateOfOrigin", filters.stateOfOrigin)
      if (filters.sector !== "all") queryParams.append("sector", filters.sector)
      if (filters.tradeArea !== "all") queryParams.append("tradeArea", filters.tradeArea)

      // Fetch all distribution data in one call
      const response = await axios.get(`${API_BASE_URL}/distribution/all?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.data.success) {
        // Set the analytics data from the response
        setAnalyticsData(response.data.data || {})
        // Also set the geo data from the same response since it contains all the geographic information
        setGeoData(response.data.data || {})
      } else {
        throw new Error(response.data.message || "Failed to fetch analytics data")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <Card className="border-2 border-red-300 bg-red-50 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                       transition-colors duration-200 font-medium focus:outline-none 
                       focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="sm"
              className={`
                inline-flex items-center px-3 py-1 rounded-md
                ${showFilters ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-gray-100"}
              `}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">click to filter from our range of data</span>
          </div>

          {isEditable && (
          <div className="flex items-center">
            <ExportDropdown analyticsData={analyticsData} />
          </div>
          )}
        </div>

        <div
          className={`
          mt-3 transition-all duration-300 ease-in-out
          ${showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}
        `}
        >
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <DistributionFilters onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="main" className="space-y-8">
        <TabsList className="grid w-full h-auto lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="main"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Main Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="gender"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Gender Distribution
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Geographic Distribution
          </TabsTrigger>
          <TabsTrigger
            value="sector"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Sector Distribution
          </TabsTrigger>
          <TabsTrigger
            value="payload"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                       data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Distribution Count
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="mt-8">
          <div className="w-full h-auto">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-12">
                <Metrics analyticsData={analyticsData} />
              </div>
            </section>

            {/* Map and New Registration side by side */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8">
                <NigerianMap analyticsData={analyticsData} />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-8">
                <RecentRegistrations analyticsData={analyticsData} />
                <NewRegistration />
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="gender" className="mt-0">
          <div className="w-full h-[400px] min-h-[400px]">
            <GenderDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="mt-0">
          <div className="w-full h-[500px] min-h-[500px]">
            <GeographicDistribution geoData={geoData} filters={filters} />
          </div>
        </TabsContent>

        <TabsContent value="sector" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <ErrorBoundary>
                  <SectorDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
                </ErrorBoundary>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-full h-[300px] min-h-[300px]">
                  <TradeAreaDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payload" className="mt-0">
          <div className="w-full">
            <PayloadDataTable analyticsData={analyticsData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}





// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { API_BASE_URL } from "@/config/env"
// import { GenderDistribution } from "./components/gender-distribution"
// import { GeographicDistribution } from "./components/geographic-distribution"
// import { SectorDistribution } from "./components/sector-distribution"
// import { TradeAreaDistribution } from "./components/trade-area-distribution"
// import { DistributionFilters } from "./components/distribution-filters"
// import { ErrorBoundary } from "@/components/ErrorBoundary"
// import Metrics from "./Metrics"
// import NigerianMap from "@/components/NigerianMap"
// import RecentRegistrations from "./RecentRegistrations"
// import { Button } from "@/components/ui/button" // Add this import
// import { ChevronRight, Filter } from "lucide-react" // Add this import
// import NewRegistration from "./NewRegistration"
// import { PayloadDataTable } from "./components/payload-data-table"
// import { CSVLink } from "react-csv"
// import jsPDF from "jspdf"
// import "jspdf-autotable"
// import { Download } from "lucide-react"

// export default function DistributionDashboard() {
//   const [analyticsData, setAnalyticsData] = useState(null)
//   const [geoData, setGeoData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filters, setFilters] = useState({
//     role: "all", // "all", "artisan_user", "intending_artisan"
//     gender: "all", // "all", "male", "female"
//     stateOfResidence: "all",
//     stateOfOrigin: "all",
//     sector: "all",
//     tradeArea: "all",
//   })
//   const [showFilters, setShowFilters] = useState(false) // Add this state

//   const formatDataForExport = (analyticsData) => {
//     if (!analyticsData) return { headers: [], data: [] }

//     // Create a flattened representation of all data
//     const data = []

//     // Process all arrays in the analytics data
//     Object.entries(analyticsData).forEach(([category, items]) => {
//       if (Array.isArray(items)) {
//         items.forEach((item) => {
//           if (typeof item === "object") {
//             // For nested objects, create a row with the category and all properties
//             data.push({
//               category,
//               ...item,
//             })
//           } else {
//             // For simple values
//             data.push({
//               category,
//               value: item,
//             })
//           }
//         })
//       }
//     })

//     // Determine all possible headers from the data
//     const allKeys = new Set()
//     data.forEach((item) => {
//       Object.keys(item).forEach((key) => allKeys.add(key))
//     })

//     const headers = Array.from(allKeys).map((key) => ({
//       label: key.charAt(0).toUpperCase() + key.slice(1),
//       key,
//     }))

//     return { headers, data }
//   }

//   const generatePDF = (analyticsData) => {
//     const { headers, data } = formatDataForExport(analyticsData)
//     const doc = new jsPDF()

//     // Add title
//     doc.setFontSize(16)
//     doc.text("Distribution Dashboard Report", 14, 15)
//     doc.setFontSize(10)
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25)

//     // Create table
//     doc.autoTable({
//       startY: 35,
//       head: [headers.map((h) => h.label)],
//       body: data.map((item) => [item.type, item.category, item.count, item.percentage]),
//       theme: "grid",
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] },
//     })

//     doc.save("distribution-report.pdf")
//   }

//   // Update the fetchAnalytics function to handle the new API structure
//   const fetchAnalytics = async () => {
//     const accessToken = localStorage.getItem("accessToken")
//     if (!accessToken) {
//       setError("Access token is missing. Please log in again.")
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)

//       // Build query parameters based on filters
//       const queryParams = new URLSearchParams()
//       if (filters.role !== "all") queryParams.append("role", filters.role)
//       if (filters.gender !== "all") queryParams.append("gender", filters.gender)
//       if (filters.stateOfResidence !== "all") queryParams.append("stateOfResidence", filters.stateOfResidence)
//       if (filters.stateOfOrigin !== "all") queryParams.append("stateOfOrigin", filters.stateOfOrigin)
//       if (filters.sector !== "all") queryParams.append("sector", filters.sector)
//       if (filters.tradeArea !== "all") queryParams.append("tradeArea", filters.tradeArea)

//       // Fetch all distribution data in one call
//       const response = await axios.get(`${API_BASE_URL}/distribution/all?${queryParams.toString()}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       })

//       if (response.data.success) {
//         // Set the analytics data from the response
//         setAnalyticsData(response.data.data || {})
//         // Also set the geo data from the same response since it contains all the geographic information
//         setGeoData(response.data.data || {})
//       } else {
//         throw new Error(response.data.message || "Failed to fetch analytics data")
//       }
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [])

//   const handleFilterChange = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }))
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-6 py-10 max-w-7xl">
//         <Card className="border-2 border-red-300 bg-red-50 shadow-lg">
//           <CardHeader className="space-y-2">
//             <CardTitle className="text-2xl font-bold text-red-600">Error Loading Dashboard</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-red-600 text-lg">{error}</p>
//             <button
//               onClick={fetchAnalytics}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
//                        transition-colors duration-200 font-medium focus:outline-none 
//                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Retry
//             </button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="mx-auto  max-w-7xl">
//       <div className="mb-1">
//         <div className="flex items-center space-x-2 text-sm">
//           <Button
//             onClick={() => setShowFilters(!showFilters)}
//             variant="ghost"
//             size="sm"
//             className={`
//               inline-flex items-center px-3 py-1 rounded-md
//               ${showFilters ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-gray-100"}
//             `}
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             <span>Filters</span>
//           </Button>
//           <ChevronRight className="h-4 w-4 text-gray-400" />
//           <span className="text-gray-500">
//             {/* {Object.values(filters).filter(v => v !== 'all').length}  */}
//             click to filter from our range of data
//           </span>

//           <div className="flex justify-end gap-2 mb-4">
//             <CSVLink
//               data={
//                 analyticsData
//                   ? Object.entries(analyticsData).flatMap(([key, value]) =>
//                       Array.isArray(value)
//                         ? value.map((item) => ({
//                             category: key,
//                             ...item,
//                           }))
//                         : [],
//                     )
//                   : []
//               }
//               filename="distribution-data-full.csv"
//               className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 py-1"
//             >
//               <Download className="mr-1 h-3 w-3" />
//               CSV
//             </CSVLink>

//             <Button
//               onClick={() => {
//                 if (analyticsData) {
//                   const doc = new jsPDF()
//                   doc.setFontSize(12)
//                   doc.text("Full Distribution Data Export", 14, 15)
//                   doc.setFontSize(8)

//                   let yPos = 25
//                   const pageHeight = doc.internal.pageSize.height

//                   Object.entries(analyticsData).forEach(([key, value]) => {
//                     if (Array.isArray(value) && value.length > 0) {
//                       // Add section header
//                       if (yPos > pageHeight - 20) {
//                         doc.addPage()
//                         yPos = 20
//                       }

//                       doc.setFontSize(10)
//                       doc.setTextColor(0, 0, 255)
//                       doc.text(`${key}`, 14, yPos)
//                       yPos += 8
//                       doc.setTextColor(0, 0, 0)
//                       doc.setFontSize(8)

//                       // Create table for this section
//                       const tableData = value.map((item) => {
//                         if (typeof item === "object") {
//                           return Object.values(item)
//                         }
//                         return [item]
//                       })

//                       const headers =
//                         value.length > 0 && typeof value[0] === "object" ? Object.keys(value[0]) : ["Value"]

//                       doc.autoTable({
//                         startY: yPos,
//                         head: [headers],
//                         body: tableData,
//                         theme: "grid",
//                         styles: { fontSize: 6 },
//                         headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//                         margin: { top: 10 },
//                       })

//                       yPos = doc.lastAutoTable.finalY + 10
//                     }
//                   })

//                   doc.save("distribution-data-full.pdf")
//                 }
//               }}
//               variant="outline"
//               size="sm"
//               className="h-7 px-2 py-1 text-xs"
//             >
//               <Download className="mr-1 h-3 w-3" />
//               PDF
//             </Button>
//           </div>
//         </div>

//         <div
//           className={`
//           mt-3 transition-all duration-300 ease-in-out
//           ${showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"}
//         `}
//         >
//           <div className="p-4 border rounded-lg bg-white shadow-sm">
//             <DistributionFilters onFilterChange={handleFilterChange} />
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="main" className="space-y-8">
//         <TabsList className="grid w-full h-auto lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
//           <TabsTrigger
//             value="main"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Main Dashboard
//           </TabsTrigger>
//           <TabsTrigger
//             value="gender"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Gender Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="geographic"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Geographic Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="sector"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Sector Distribution
//           </TabsTrigger>
//           <TabsTrigger
//             value="payload"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                        data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Distribution Count
//           </TabsTrigger>
//           {/* <TabsTrigger 
//             value="crosstab"
//             className="data-[state=active]:bg-white data-[state=active]:text-gray-900
//                      data-[state=active]:shadow-sm px-4 py-2 rounded-md"
//           >
//             Cross-Tabulation
//           </TabsTrigger> */}
//         </TabsList>

//         <TabsContent value="main" className="mt-8">
//           <div className="w-full h-auto">
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-12">
//                 <Metrics analyticsData={analyticsData} />
//               </div>
//             </section>

//             {/* Map and New Registration side by side */}
//             <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//               <div className="lg:col-span-8">
//                 <NigerianMap analyticsData={analyticsData} />
//               </div>
//               <div className="lg:col-span-4 flex flex-col gap-8">
//                 {/* <RecentRegistrations /> */}
//                 <RecentRegistrations analyticsData={analyticsData} />
//                 <NewRegistration />
//               </div>
//             </section>
//           </div>
//         </TabsContent>

//         <TabsContent value="gender" className="mt-0">
//           <div className="w-full h-[400px] min-h-[400px]">
//             {" "}
//             {/* Added fixed height */}
//             <GenderDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//           </div>
//         </TabsContent>

//         <TabsContent value="geographic" className="mt-0">
//           <div className="w-full h-[500px] min-h-[500px]">
//             {" "}
//             {/* Added fixed height */}
//             <GeographicDistribution geoData={geoData} filters={filters} />
//           </div>
//         </TabsContent>

//         <TabsContent value="sector" className="mt-0">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 {/* <div className="w-full h-[300px] min-h-[300px]"> Added fixed height */}
//                 <ErrorBoundary>
//                   <SectorDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//                 </ErrorBoundary>
//                 {/* </div> */}
//               </CardContent>
//             </Card>
//             <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 <div className="w-full h-[300px] min-h-[300px]">
//                   {" "}
//                   {/* Added fixed height */}
//                   <TradeAreaDistribution analyticsData={analyticsData} geoData={geoData} filters={filters} />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="payload" className="mt-0">
//           <div className="w-full">
//             <PayloadDataTable analyticsData={analyticsData} />
//           </div>
//         </TabsContent>

//         {/* <TabsContent value="crosstab" className="mt-0">
//             <div className="w-full h-[400px] min-h-[400px]"> 
//               <CrossTabDistribution 
//                 geoData={geoData} 
//                 filters={filters} 
//               />
//             </div>
//           </TabsContent> */}
//         {/* </div> */}
//       </Tabs>
//     </div>
//   )
// }

