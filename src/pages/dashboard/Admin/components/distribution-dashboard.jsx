"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { API_BASE_URL } from "@/config/env"
import { GenderDistribution } from "./components/gender-distribution"
import { GeographicDistribution } from "./components/geographic-distribution"
import { SectorDistribution } from "./components/sector-distribution"
import { TradeAreaDistribution } from "./components/trade-area-distribution"
import { DistributionFilters } from "./components/distribution-filters"
import { CrossTabDistribution } from "./components/cross-tab-distribution"
import {ErrorBoundary} from '@/components/ErrorBoundary';
import Metrics from "./Metrics"
import NigerianMap from "@/components/NigerianMap"
import RecentRegistrations from "./RecentRegistrations"
import { Button } from "@/components/ui/button" // Add this import
import { ChevronDown, ChevronUp, ChevronRight, Filter } from "lucide-react" // Add this import

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
  const [showFilters, setShowFilters] = useState(false) // Add this state

  // Update the fetchAnalytics function to handle the new API structure
  const fetchAnalytics = async () => {
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

  // if (loading) {
  //   return (
  //     <div className="container mx-auto px-6 py-10 max-w-7xl">
  //       <h1 className="text-3xl font-bold mb-8 text-gray-900">User Distribution Dashboard</h1>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  //         {[...Array(6)].map((_, i) => (
  //           <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
  //             <CardHeader className="space-y-2">
  //               <Skeleton className="h-8 w-3/4 bg-gray-200" />
  //               <Skeleton className="h-4 w-1/2 bg-gray-100" />
  //             </CardHeader>
  //             <CardContent>
  //               <Skeleton className="h-[200px] w-full bg-gray-100 rounded-lg" />
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

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
    <div className="mx-auto  max-w-7xl">
      <div className="mb-1">
        <div className="flex items-center space-x-2 text-sm">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="sm"
            className={`
              inline-flex items-center px-3 py-1 rounded-md
              ${showFilters 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">
            {/* {Object.values(filters).filter(v => v !== 'all').length}  */}
            click to filter from our range of data
          </span>
        </div>
        
        <div className={`
          mt-3 transition-all duration-300 ease-in-out
          ${showFilters 
            ? 'opacity-100 max-h-[500px]' 
            : 'opacity-0 max-h-0 overflow-hidden'
          }
        `}>
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
            value="crosstab"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900
                     data-[state=active]:shadow-sm px-4 py-2 rounded-md"
          >
            Cross-Tabulation
          </TabsTrigger>
        </TabsList>

        {/* <div className="bg-white rounded-lg shadow-md p-6"> */}
        {/* <TabsContent value="main" className="mt-8">
            <div className="w-full h-[400px] min-h-[400px]"> 
                <section className="mb-8">
                  <Metrics />

                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  <div className="lg:col-span-8 pt-4">
                    <NigerianMap />
                  </div>
                  <div className="lg:col-span-4  ">
                    <RecentRegistrations />
                  </div>
                </section>
            </div>
          </TabsContent> */}
          <TabsContent value="main" className="mt-8">
  <div className="w-full h-auto"> {/* Removed fixed height for flexibility */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* Left Column: Metrics + NigerianMap */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Metrics Section */}
        <div>
          <Metrics />
        </div>

        {/* Nigerian Map Section */}
        <div className="pt-4">
          <NigerianMap />
        </div>

      </div>

      {/* Right Column: Recent Registrations */}
      <div className="lg:col-span-4">
        <RecentRegistrations />
      </div>

    </section>
  </div>
</TabsContent>

          <TabsContent value="gender" className="mt-0">
            <div className="w-full h-[400px] min-h-[400px]"> {/* Added fixed height */}
              <GenderDistribution 
                analyticsData={analyticsData} 
                geoData={geoData} 
                filters={filters} 
              />
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="mt-0">
            <div className="w-full h-[500px] min-h-[500px]"> {/* Added fixed height */}
              <GeographicDistribution 
                geoData={geoData} 
                filters={filters} 
              />
            </div>
          </TabsContent>

          <TabsContent value="sector" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  {/* <div className="w-full h-[300px] min-h-[300px]"> Added fixed height */}
                    <ErrorBoundary>
                      <SectorDistribution 
                        analyticsData={analyticsData} 
                        geoData={geoData} 
                        filters={filters} 
                      />
                    </ErrorBoundary>
                  {/* </div> */}
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="w-full h-[300px] min-h-[300px]"> {/* Added fixed height */}
                    <TradeAreaDistribution 
                      analyticsData={analyticsData} 
                      geoData={geoData} 
                      filters={filters} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crosstab" className="mt-0">
            <div className="w-full h-[400px] min-h-[400px]"> {/* Added fixed height */}
              <CrossTabDistribution 
                geoData={geoData} 
                filters={filters} 
              />
            </div>
          </TabsContent>
        {/* </div> */}
      </Tabs>
    </div>
  )
}

