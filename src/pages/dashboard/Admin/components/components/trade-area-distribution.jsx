"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

// Add these color constants at the top of your file
const ROLE_COLORS = {
  artisan_user: "#4CAF50",     // Green
  intending_artisan: "#2196F3", // Blue
};

const TRADE_AREA_COLORS = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Sage Green
  "#FFA07A", // Light Salmon
];

export function TradeAreaDistribution({ analyticsData, geoData, filters }) {
  // Process trade area distribution data with role-based counts
  const tradeAreaData = useMemo(() => {
    if (!analyticsData?.tradeAreaByStateOfResidence) {
      return []
    }

    // Group by trade area and sum counts
    const tradeAreaCounts = {}

    analyticsData.tradeAreaByStateOfResidence.forEach((item) => {
      if (!item._id?.tradeArea) return

      const tradeArea = item._id.tradeArea.trim()
      if (!tradeArea) return

      if (!tradeAreaCounts[tradeArea]) {
        tradeAreaCounts[tradeArea] = {
          name: tradeArea,
          value: 0,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }

      tradeAreaCounts[tradeArea].value += item.total || 0
      tradeAreaCounts[tradeArea].artisan_user += item.artisan_user || 0
      tradeAreaCounts[tradeArea].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort
    return Object.values(tradeAreaCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Get top 10 trade areas
  }, [analyticsData])

  // Process role by trade area data
  const roleByTradeAreaData = useMemo(() => {
    if (!analyticsData?.tradeAreaByStateOfResidence) {
      return []
    }

    // Group by trade area and sum role counts
    const tradeAreaRoleMap = {}

    analyticsData.tradeAreaByStateOfResidence.forEach((item) => {
      if (!item._id?.tradeArea) return

      const tradeAreaName = item._id.tradeArea.trim()
      if (!tradeAreaName) return

      if (!tradeAreaRoleMap[tradeAreaName]) {
        tradeAreaRoleMap[tradeAreaName] = {
          tradeArea: tradeAreaName,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }

      tradeAreaRoleMap[tradeAreaName].artisan_user += item.artisan_user || 0
      tradeAreaRoleMap[tradeAreaName].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort by total
    return Object.values(tradeAreaRoleMap)
      .map((item) => ({
        ...item,
        total: item.artisan_user + item.intending_artisan,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25) // Get top 5 trade areas
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trade Area Distribution</CardTitle>
          <CardDescription>Distribution of users by trade area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer>
              <PieChart>
                <Pie
                  data={tradeAreaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tradeAreaData.map((entry, index) => (
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role by Trade Area</CardTitle>
          <CardDescription>Role distribution across top trade areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer>
              <BarChart
                data={roleByTradeAreaData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="tradeArea" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={120} 
                />
                <Legend />
                <Bar 
                  dataKey="artisan_user" 
                  stackId="a" 
                  fill={ROLE_COLORS.artisan_user}
                  radius={[4, 4, 0, 0]}
                >
                  {roleByTradeAreaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={TRADE_AREA_COLORS[index % TRADE_AREA_COLORS.length]}
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
                  {roleByTradeAreaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={TRADE_AREA_COLORS[index % TRADE_AREA_COLORS.length]}
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
                              <span>
                                {item.name === "artisan_user" ? "Artisan Users" : "Intending Artisans"}: 
                                {item.value.toLocaleString()}
                              </span>
                            </div>
                          ))}
                          <p className="text-sm text-gray-500 mt-1">
                            Total: {payload.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

