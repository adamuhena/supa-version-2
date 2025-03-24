"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

export function GenderDistribution({ analyticsData, geoData, filters }) {
  // Process gender distribution data
  const genderData = useMemo(() => {
    if (!analyticsData?.genderDistribution) return []

    // Map the data directly from the API response
    return analyticsData.genderDistribution.map((item) => ({
      name: item._id === "" ? "Unknown" : item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }))
  }, [analyticsData])

  // Update the genderByStateData processing to handle the new data structure
  const genderByStateData = useMemo(() => {
    if (!geoData?.genderByStateOfResidence) return []

    // Filter and normalize state names (remove trailing spaces, standardize case)
    const normalizedStateData = {}

    // Process data from genderByStateOfResidence
    geoData.genderByStateOfResidence.forEach((item) => {
      if (!item._id.stateOfResidence) return

      // Normalize state name by trimming and converting to title case
      const stateName = item._id.stateOfResidence.trim()
      if (!stateName) return

      // Skip entries with very low counts to focus on significant data
      if (item.count < 100) return

      // Initialize state entry if it doesn't exist
      if (!normalizedStateData[stateName]) {
        normalizedStateData[stateName] = {
          state: stateName,
          male: 0,
          female: 0,
          unknown: 0,
        }
      }

      // Add counts based on gender
      const gender = item._id.gender?.toLowerCase()
      if (gender === "male") {
        normalizedStateData[stateName].male += item.count
      } else if (gender === "female") {
        normalizedStateData[stateName].female += item.count
      } else {
        normalizedStateData[stateName].unknown += item.count
      }
    })

    // Convert to array and sort by total population
    return Object.values(normalizedStateData)
      .map((item) => ({
        ...item,
        total: item.male + item.female + item.unknown,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10) // Get top 10 states
  }, [geoData])

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Distribution of users by gender</CardDescription>
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
                unknown: {
                  label: "Unknown",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
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
          <CardTitle>Gender by State</CardTitle>
          <CardDescription>Gender distribution across top 10 states</CardDescription>
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
                unknown: {
                  label: "Unknown",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <BarChart data={genderByStateData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={70} />
                <Legend />
                <Bar dataKey="male" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="female" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="unknown" stackId="a" fill="hsl(var(--chart-3))" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

