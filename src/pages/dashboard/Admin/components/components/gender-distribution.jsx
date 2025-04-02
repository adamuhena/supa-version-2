"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

export function GenderDistribution({ analyticsData, geoData, filters }) {
  // Define custom colors for gender
  const GENDER_COLORS = {
    male: "#4A90E2",    // Blue
    female: "#E91E63",  // Pink
    unknown: "#9E9E9E"  // Grey
  };

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
                  color: GENDER_COLORS.male,
                },
                female: {
                  label: "Female",
                  color: GENDER_COLORS.female,
                },
                unknown: {
                  label: "Unknown",
                  color: GENDER_COLORS.unknown,
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
                  {genderData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={GENDER_COLORS[entry.name.toLowerCase()]}
                    />
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
                  color: GENDER_COLORS.male,
                },
                female: {
                  label: "Female",
                  color: GENDER_COLORS.female,
                },
                unknown: {
                  label: "Unknown",
                  color: GENDER_COLORS.unknown,
                },
              }}
            >
              <BarChart data={genderByStateData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={70} />
                <Legend />
                <Bar dataKey="male" stackId="a" fill={GENDER_COLORS.male} />
                <Bar dataKey="female" stackId="a" fill={GENDER_COLORS.female} />
                <Bar dataKey="unknown" stackId="a" fill={GENDER_COLORS.unknown} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

