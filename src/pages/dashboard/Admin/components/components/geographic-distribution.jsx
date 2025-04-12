"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add these color constants at the top of your file
const ROLE_COLORS = {
  artisan_user: [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage Green
    "#FFA07A", // Light Salmon
  ],
  intending_artisan: [
    "#9B59B6", // Purple
    "#3498DB", // Blue
    "#2ECC71", // Emerald
    "#F1C40F", // Yellow
    "#E74C3C", // Red
  ],
};

export function GeographicDistribution({ geoData, filters }) {
  // Add data validation
  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  // Helper function to process data
  const processGeoData = (data, type) => {
    if (!data?.length) return []

    return data
      .filter((item) => {
        // Check if item._id exists
        if (!item._id) return false

        // Handle different _id structures
        if (type === "lga") {
          return item._id.state && item._id.lga
        } else if (type === "senatorial") {
          return item._id.state && item._id.district
        } else {
          // For state data, ensure _id is not empty
          return typeof item._id === "string" ? item._id.trim() !== "" : true
        }
      })
      .map((item) => {
        // Determine the name based on type and _id structure
        let name
        if (type === "lga" && item._id?.state && item._id?.lga) {
          name = `${item._id.lga} (${item._id.state})`
        } else if (type === "senatorial" && item._id?.state && item._id?.district) {
          name = `${item._id.district} (${item._id.state})`
        } else if (typeof item._id === "string") {
          name = item._id.trim()
        } else if (item._id?.stateOfResidence) {
          name = item._id.stateOfResidence.trim()
        } else {
          name = "Unknown"
        }

        return {
          name,
          value: item.total || 0,
          artisan_user: item.artisan_user || 0,
          intending_artisan: item.intending_artisan || 0,
          ...(type === "lga" || type === "senatorial"
            ? {
                state: item._id?.state,
                lga: item._id?.lga,
                district: item._id?.district
              }
            : {})
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 37)
  }

  // Process state of residence data with role-based counts
  const stateOfResidenceData = useMemo(() => {
    return processGeoData(geoData?.stateOfResidenceDistribution, "state")
  }, [geoData?.stateOfResidenceDistribution])

  // Process state of origin data with role-based counts
  const stateOfOriginData = useMemo(() => {
    return processGeoData(geoData?.stateOfOriginDistribution, "state")
  }, [geoData?.stateOfOriginDistribution])

  // Process LGA of residence data with role-based counts
  const lgaOfResidenceData = useMemo(() => {
    return processGeoData(geoData?.lgaOfResidenceDistribution, "lga")
  }, [geoData?.lgaOfResidenceDistribution])

  // Process LGA distribution data with role-based counts
  const lgaDistributionData = useMemo(() => {
    return processGeoData(geoData?.lgaDistribution, "lga")
  }, [geoData?.lgaDistribution])

  // Process senatorial district data with role-based counts
  const senatorialDistrictData = useMemo(() => {
    return processGeoData(geoData?.senatorialDistrictDistribution, "senatorial")
  }, [geoData?.senatorialDistrictDistribution])

  // Updated colors array with vibrant colors
  const COLORS = [
    "#2196F3", // Blue
    "#4CAF50", // Green
    "#F44336", // Red
    "#FF9800", // Orange
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#8BC34A", // Light Green
    "#3F51B5", // Indigo
    "#FFC107", // Amber
    "#673AB7", // Deep Purple
    "#009688", // Teal
    "#CDDC39", // Lime
    "#FF5722", // Deep Orange
    "#795548", // Brown
    "#607D8B", // Blue Grey
  ]

  // Define gradient colors for different chart types
  const CHART_GRADIENTS = {
    residence: {
      start: "#4CAF50",
      end: "#81C784",
    },
    origin: {
      start: "#2196F3",
      end: "#64B5F6",
    },
    lga: {
      start: "#F44336",
      end: "#EF5350",
    },
    senatorial: {
      start: "#FF9800",
      end: "#FFB74D",
    },
  }

  const chartStyle = {
    fill: "currentColor",
    fontSize: "12px",
  }

  const renderBarChart = (data, type) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      )
    }

    return (
      <ChartContainer
        config={{
          [type]: {
            label: type === "residence" ? "Residence" : "Origin",
            color: CHART_GRADIENTS[type].start,
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} style={{ fontSize: "12px" }} />
            <YAxis dataKey="name" type="category" width={80} style={{ fontSize: "10px" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                />
              ))}
            </Bar>
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-2 border rounded shadow-md">
                      <p className="font-medium">{data.name}</p>
                      <p>Total: {data.value.toLocaleString()}</p>
                      <p>Artisan Users: {data.artisan_user.toLocaleString()}</p>
                      <p>Intending Artisans: {data.intending_artisan.toLocaleString()}</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="states">
        <TabsList className="grid w-full grid-cols-4 gap-4">
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="lgas">LGAs</TabsTrigger>
          <TabsTrigger value="senatorial">Senatorial Districts</TabsTrigger>
          <TabsTrigger value="roles">Role Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="states" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>State of Residence Distribution</CardTitle>
                <CardDescription>Top states by number of Artisans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">{renderBarChart(stateOfResidenceData, "residence")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State of Origin Distribution</CardTitle>
                <CardDescription>Top states by number of Artisans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">{renderBarChart(stateOfOriginData, "origin")}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lgas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LGA of Residence</CardTitle>
                <CardDescription>Distribution by LGA of residence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">{renderBarChart(lgaOfResidenceData, "lga")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LGA of Origin</CardTitle>
                <CardDescription>Distribution by LGA of origin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">{renderBarChart(lgaDistributionData, "lga")}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="senatorial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Senatorial Districts</CardTitle>
              <CardDescription>Distribution by senatorial districts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">{renderBarChart(senatorialDistrictData, "senatorial")}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution by State</CardTitle>
              <CardDescription>Artisan vs Intending Artisan distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[700px] w-full">
                <ChartContainer
                  config={{
                    artisan_user: {
                      label: "Artisan Users",
                      color: ROLE_COLORS.artisan_user[0],
                    },
                    intending_artisan: {
                      label: "Intending Artisans",
                      color: ROLE_COLORS.intending_artisan[0],
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stateOfResidenceData.slice(0, 15)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <XAxis
                        type="number"
                        tickFormatter={(value) => value.toLocaleString()}
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120} 
                        style={{ fontSize: "12px" }} 
                      />
                      <Bar dataKey="artisan_user" stackId="a" radius={[4, 0, 0, 4]}>
                        {stateOfResidenceData.slice(0, 37).map((entry, index) => (
                          <Cell
                            key={`artisan-${index}`}
                            fill={ROLE_COLORS.artisan_user[index % ROLE_COLORS.artisan_user.length]}
                            style={{
                              filter: 'brightness(1.1)',
                              transition: 'filter 0.3s',
                            }}
                          />
                        ))}
                      </Bar>
                      <Bar dataKey="intending_artisan" stackId="a" radius={[0, 4, 4, 0]}>
                        {stateOfResidenceData.slice(0, 37).map((entry, index) => (
                          <Cell
                            key={`intending-${index}`}
                            fill={ROLE_COLORS.intending_artisan[index % ROLE_COLORS.intending_artisan.length]}
                            style={{
                              filter: 'brightness(1.1)',
                              transition: 'filter 0.3s',
                            }}
                          />
                        ))}
                      </Bar>
                      <ChartTooltip
                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white/90 backdrop-blur-sm p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold mb-2">{label}</p>
                                {payload.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 mb-1">
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: item.fill }}
                                    />
                                    <span>
                                      {item.name === "artisan_user" ? "Artisan Users" : "Intending Artisans"}: 
                                      {item.value.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                <p className="text-sm text-gray-500 mt-2 pt-2 border-t">
                                  Total: {payload.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

