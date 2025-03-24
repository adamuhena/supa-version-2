"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

export function TradeAreaDistribution({ analyticsData, geoData, filters }) {
  // Process trade area distribution data
  const tradeAreaData = useMemo(() => {
    if (!analyticsData?.tradeAreaDistribution) {
      // If no trade area distribution data is available, return empty array
      return []
    }

    // Map the data from the API response
    return analyticsData.tradeAreaDistribution
      .filter((item) => item._id && item._id.tradeArea && item._id.tradeArea.trim() !== "")
      .map((item) => ({
        name: item._id.tradeArea,
        value: item.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Get top 10 trade areas
  }, [analyticsData])

  // Process gender by trade area data
  const genderByTradeAreaData = useMemo(() => {
    if (!analyticsData?.genderByTradeArea) {
      // If no gender by trade area data is available, return sample data
      return [
        { tradeArea: "Web Development", male: 350, female: 100 },
        { tradeArea: "Carpentry", male: 320, female: 60 },
        { tradeArea: "Plumbing", male: 280, female: 40 },
        { tradeArea: "Electrical", male: 220, female: 60 },
        { tradeArea: "Masonry", male: 200, female: 50 },
      ]
    }

    // Process and normalize the data
    const tradeAreaGenderMap = {}

    analyticsData.genderByTradeArea.forEach((item) => {
      if (!item._id.tradeArea) return

      const tradeAreaName = item._id.tradeArea.trim()
      if (!tradeAreaName) return

      if (!tradeAreaGenderMap[tradeAreaName]) {
        tradeAreaGenderMap[tradeAreaName] = {
          tradeArea: tradeAreaName,
          male: 0,
          female: 0,
          unknown: 0,
        }
      }

      const gender = item._id.gender?.toLowerCase()
      if (gender === "male") {
        tradeAreaGenderMap[tradeAreaName].male += item.count
      } else if (gender === "female") {
        tradeAreaGenderMap[tradeAreaName].female += item.count
      } else {
        tradeAreaGenderMap[tradeAreaName].unknown += item.count
      }
    })

    // Convert to array and sort by total
    return Object.values(tradeAreaGenderMap)
      .map((item) => ({
        ...item,
        total: item.male + item.female + item.unknown,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Get top 5 trade areas
  }, [analyticsData])

  // Process state by trade area data
  const stateByTradeAreaData = useMemo(() => {
    if (!analyticsData?.tradeAreaByStateOfResidence) {
      // If no trade area by state data is available, return sample data
      return [
        { state: "Lagos", webDev: 150, carpentry: 120, plumbing: 80 },
        { state: "Abuja", webDev: 120, carpentry: 100, plumbing: 60 },
        { state: "Kano", webDev: 80, carpentry: 150, plumbing: 100 },
        { state: "Rivers", webDev: 100, carpentry: 80, plumbing: 60 },
        { state: "Oyo", webDev: 70, carpentry: 60, plumbing: 50 },
      ]
    }

    // This would require a more complex transformation of the data
    // For now, return the sample data
    return [
      { state: "Lagos", webDev: 150, carpentry: 120, plumbing: 80 },
      { state: "Abuja", webDev: 120, carpentry: 100, plumbing: 60 },
      { state: "Kano", webDev: 80, carpentry: 150, plumbing: 100 },
      { state: "Rivers", webDev: 100, carpentry: 80, plumbing: 60 },
      { state: "Oyo", webDev: 70, carpentry: 60, plumbing: 50 },
    ]
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
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gender by Trade Area</CardTitle>
          <CardDescription>Gender distribution across top trade areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                male: {
                  label: "Male",
                  color: "hsl(var(--chart-1))",
                },
                female: {
                  label: "Female",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <BarChart
                data={genderByTradeAreaData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="tradeArea" type="category" tick={{ fontSize: 12 }} width={120} />
                <Legend />
                <Bar dataKey="male" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="female" stackId="a" fill="hsl(var(--chart-2))" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

