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
//               onClick={() => {
//                 setLoading(true); // Show spinner immediately
//                 setError(null);   // (Optional) Clear error
//                 fetchAnalytics();
//               }}
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
//             <ExportDropdown analyticsData={analyticsData} />
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

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GenderDistribution } from "./components/gender-distribution";
import { GeographicDistribution } from "./components/geographic-distribution";
import { SectorDistribution } from "./components/sector-distribution";
import { TradeAreaDistribution } from "./components/trade-area-distribution";
import { DistributionFilters } from "./components/distribution-filters";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Metrics from "./Metrics";
import NigerianMap from "@/components/NigerianMap";
import RecentRegistrations from "./RecentRegistrations";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter } from "lucide-react";
import NewRegistration from "./NewRegistration";
import { PayloadDataTable } from "./components/payload-data-table";
import { ExportDropdown } from "./export-dropdown";
import { useDistributionData } from "./hooks/distribution-data";

export default function DistributionDashboardOptimized() {
  const [activeTab, setActiveTab] = useState("main");
  const [filters, setFilters] = useState({
    role: "all",
    gender: "all",
    stateOfResidence: "all",
    stateOfOrigin: "all",
    sector: "all",
    tradeArea: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Separate data fetching for each tab
  // const mainData = useDistributionData({
  //   endpoint: "/distribution/main-dashboard",
  //   enabled: true, // Always load main dashboard data
  // });

  // const genderData = useDistributionData({
  //   endpoint: "/distribution/gender",
  //   enabled: activeTab === "gender",
  // })

  // const geographicData = useDistributionData({
  //   endpoint: "/distribution/geographic",
  //   enabled: activeTab === "geographic",
  // })

  // const sectorData = useDistributionData({
  //   endpoint: "/distribution/sector",
  //   enabled: activeTab === "sector",
  // })

  // // For payload tab, we can use the main data or create a separate endpoint
  // const payloadData = useDistributionData({
  //   endpoint: "/distribution/all", // Keep using the full data for payload table
  //   enabled: activeTab === "payload",
  // });

  // const mainData = {};
  // const genderData = {};
  // const geographicData = {};
  // const sectorData = {};
  const payloadData = {};

  // const mainData = useDistributionData({
  //   endpoint: "/distribution/main-dashboard",
  //   enabled: true, // Always load main dashboard data
  // });

  const userRolesData = useDistributionData({
    endpoint: "/distribution/count/users-by-role",
    enabled: true, // Always load main dashboard data
  });

  const mainData = useDistributionData({
    endpoint: "/distribution/count/users-by-state",
    enabled: true, // Always load main dashboard data
  });

  //distribution/gender
  const genderData = useDistributionData({
    endpoint: "/distribution/gender",
    enabled: activeTab === "gender",
});
//distribution/geographic
  const geographicData = useDistributionData({
    endpoint: "/distribution/geographic",
    enabled: activeTab === "geographic",
  });

  ///distribution/sector
  const sectorData = useDistributionData({  
    endpoint: "/distribution/sector",
    enabled: activeTab === "sector",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Loading component for individual tabs
  const TabLoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );

  // Error component for individual tabs
  const TabErrorState = ({ error, onRetry }) => (
    <Card className="border-2 border-red-300 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-600">Error Loading Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="text-red-600 border-red-300 bg-transparent">
          Retry
        </Button>
      </CardContent>
    </Card>
  );

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
                ${
                  showFilters
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-gray-100"
                }
              `}>
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">
              click to filter from our range of data
            </span>
          </div>

          <div className="flex items-center">
            <ExportDropdown analyticsData={mainData.data} />
          </div>
        </div>

        <div
          className={`
          mt-3 transition-all duration-300 ease-in-out
          ${
            showFilters
              ? "opacity-100 max-h-[500px]"
              : "opacity-0 max-h-0 overflow-hidden"
          }
        `}>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <DistributionFilters onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-8">
        <TabsList className="grid w-full h-auto lg:grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="main"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md">
            Main Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="gender"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md">
            Gender Distribution
            {genderData.loading && <span className="ml-2 animate-spin">⟳</span>}
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md">
            Geographic Distribution
            {geographicData.loading && (
              <span className="ml-2 animate-spin">⟳</span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="sector"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md">
            Sector Distribution
            {sectorData.loading && <span className="ml-2 animate-spin">⟳</span>}
          </TabsTrigger>
          {/* <TabsTrigger
            value="payload"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                       data-[state=active]:shadow-sm px-4 py-2 rounded-md">
            Distribution Count
            {payloadData.loading && (
              <span className="ml-2 animate-spin">⟳</span>
            )}
          </TabsTrigger> */}
        </TabsList>

        {/* <TabsContent value="main" className="mt-8">
          {mainData.loading ? (
            <TabLoadingState />
          ) : mainData.error ? (
            <TabErrorState error={mainData.error} onRetry={mainData.refetch} />
          ) : (
            <div className="w-full h-auto">
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-12">
                  <Metrics analyticsData={mainData.data} />
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-8">
                  <NigerianMap analyticsData={mainData.data} />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-8">
                  <RecentRegistrations analyticsData={mainData.data} />
                  <NewRegistration />
                </div>
              </section>
            </div>
          )}
        </TabsContent> */}

        <TabsContent value="main" className="mt-8">
          <div className="w-full h-auto">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-12">
                <Metrics
                  analyticsData={userRolesData.data}
                  loading={userRolesData?.loading}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8">
                <NigerianMap analyticsData={mainData.data} />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-8">
                <RecentRegistrations 
                  analyticsData={userRolesData.data} 
                  loading={userRolesData?.loading}
                />
                <NewRegistration />
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="gender" className="mt-0">
          {genderData.loading ? (
            <TabLoadingState />
          ) : genderData.error ? (
            <TabErrorState
              error={genderData.error}
              onRetry={genderData.refetch}
            />
          ) : (
            <div className="w-full h-[400px] min-h-[400px]">
              <GenderDistribution
                analyticsData={genderData.data}
                geoData={genderData.data}
                filters={filters}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="geographic" className="mt-0">
          {geographicData.loading ? (
            <TabLoadingState />
          ) : geographicData.error ? (
            <TabErrorState
              error={geographicData.error}
              onRetry={geographicData.refetch}
            />
          ) : (
            <div className="w-full h-[500px] min-h-[500px]">
              <GeographicDistribution
                geoData={geographicData.data}
                filters={filters}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="sector" className="mt-0">
          {sectorData.loading ? (
            <TabLoadingState />
          ) : sectorData.error ? (
            <TabErrorState
              error={sectorData.error}
              onRetry={sectorData.refetch}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <ErrorBoundary>
                    <SectorDistribution
                      analyticsData={sectorData.data?.userSectorData}
                      geoData={sectorData.data?.trainingCenterSectorData}
                      filters={filters}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="w-full h-[300px] min-h-[300px]">
                    <TradeAreaDistribution
                      analyticsData={sectorData.data?.userSectorData}
                      geoData={sectorData.data?.trainingCenterSectorData}
                      filters={filters}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* <TabsContent value="payload" className="mt-0">
          {payloadData.loading ? (
            <TabLoadingState />
          ) : payloadData.error ? (
            <TabErrorState
              error={payloadData.error}
              onRetry={payloadData.refetch}
            />
          ) : (
            <div className="w-full">
              <PayloadDataTable analyticsData={payloadData.data} />
            </div>
          )}
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
