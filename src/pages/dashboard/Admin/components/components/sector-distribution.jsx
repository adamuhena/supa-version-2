"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Add these color constants at the top of your file
const ROLE_COLORS = {
  artisan_user: "#4CAF50",     // Green
  intending_artisan: "#2196F3" // Blue
};

const SECTOR_COLORS = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Sage Green
  "#FFA07A", // Light Salmon
  "#9B59B6", // Purple
  "#3498DB", // Blue
  "#2ECC71", // Emerald
  "#F1C40F", // Yellow
  "#E74C3C"  // Red
];

export function SectorDistribution({ analyticsData, geoData, filters }) {
  // Add data validation
  if (!analyticsData || !geoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  const emptySectorData = []
  const emptyRoleBySectorData = []
  const emptyStateBySectorData = []

  // Update the sectorData processing to handle the new data structure with role-based counts
  const sectorData = useMemo(() => {
    if (!analyticsData?.sectorByStateOfResidence) {
      return emptySectorData
    }

    // Group by sector and sum counts
    const sectorCounts = {}
    analyticsData.sectorByStateOfResidence.forEach((item) => {
      const sector = item._id?.sector || "Unknown"
      if (!sectorCounts[sector]) {
        sectorCounts[sector] = {
          name: sector,
          value: 0,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }
      sectorCounts[sector].value += item.total || 0
      sectorCounts[sector].artisan_user += item.artisan_user || 0
      sectorCounts[sector].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort
    return Object.values(sectorCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Get top 10 sectors
  }, [analyticsData])

  // Update the genderBySectorData processing for role-based counts
  const roleBySectorData = useMemo(() => {
    if (!analyticsData?.sectorByStateOfResidence) {
      return emptyRoleBySectorData
    }

    // Group by sector and sum role counts
    const sectorRoleMap = {}

    analyticsData.sectorByStateOfResidence.forEach((item) => {
      if (!item._id?.sector) return

      const sectorName = item._id.sector.trim()
      if (!sectorName) return

      if (!sectorRoleMap[sectorName]) {
        sectorRoleMap[sectorName] = {
          sector: sectorName,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }

      sectorRoleMap[sectorName].artisan_user += item.artisan_user || 0
      sectorRoleMap[sectorName].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort by total
    return Object.values(sectorRoleMap)
      .map((item) => ({
        ...item,
        total: item.artisan_user + item.intending_artisan,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Get top 5 sectors
  }, [analyticsData])

  // Update the stateBySectorData processing
  const stateBySectorData = useMemo(() => {
    if (!analyticsData?.sectorByStateOfResidence) {
      return emptyStateBySectorData
    }

    // Group by state and get top sectors for each state
    const stateMap = {}

    analyticsData.sectorByStateOfResidence.forEach((item) => {
      if (!item._id?.state || !item._id?.sector) return

      const state = item._id.state.trim()
      const sector = item._id.sector.trim()

      if (!state || !sector) return

      if (!stateMap[state]) {
        stateMap[state] = {
          state: state,
          sectors: {},
        }
      }

      if (!stateMap[state].sectors[sector]) {
        stateMap[state].sectors[sector] = 0
      }

      stateMap[state].sectors[sector] += item.total || 0
    })

    // Get top 5 states with their top 3 sectors
    return Object.values(stateMap)
      .map((stateData) => {
        // Convert sectors object to array and sort
        const topSectors = Object.entries(stateData.sectors)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 3)
          .reduce((acc, [sector, count]) => {
            acc[sector.toLowerCase().replace(/[^a-z0-9]/g, "_")] = count
            return acc
          }, {})

        return {
          state: stateData.state,
          ...topSectors,
        }
      })
      .sort((a, b) => {
        // Sort by total sector count
        const totalA = Object.values(a)
          .filter((v) => typeof v === "number")
          .reduce((sum, v) => sum + v, 0)
        const totalB = Object.values(b)
          .filter((v) => typeof v === "number")
          .reduce((sum, v) => sum + v, 0)
        return totalB - totalA
      })
      .slice(0, 5)
  }, [analyticsData])

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Role by Sector</CardTitle>
          <CardDescription>Distribution of roles across top sectors</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={{
                artisan_user: {
                  label: "Artisan Users",
                  color: ROLE_COLORS.artisan_user,
                },
                intending_artisan: {
                  label: "Intending Artisans",
                  color: ROLE_COLORS.intending_artisan,
                },
              }}
            >
              <BarChart 
                data={roleBySectorData} 
                layout="vertical" 
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="sector" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={100} 
                />
                <Legend />
                <Bar 
                  dataKey="artisan_user" 
                  stackId="a" 
                  fill={ROLE_COLORS.artisan_user}
                  radius={[4, 4, 0, 0]}
                >
                  {roleBySectorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
                <Bar 
                  dataKey="intending_artisan" 
                  stackId="a" 
                  fill={ROLE_COLORS.intending_artisan}
                  radius={[4, 4, 0, 0]}
                >
                  {roleBySectorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                      opacity={0.6}
                    />
                  ))}
                </Bar>
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
                          <p className="font-semibold">{label}</p>
                          {payload.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: item.fill }}
                              />
                              <span>{item.name}: {item.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sector Distribution</CardTitle>
          <CardDescription>Distribution of users by sector</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip
                  content={({ active, payload }) => {
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
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

