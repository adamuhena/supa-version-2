"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

export function SectorDistribution({ analyticsData, geoData, filters }) {
  // Add data validation
  if (!analyticsData || !geoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Update the sectorData processing to handle the new data structure
  const sectorData = useMemo(() => {
    if (!analyticsData?.sectorDistribution) {
      // If no sector distribution data is available, return empty array
      return []
    }

    // Map the data from the API response
    return analyticsData.sectorDistribution
      .filter((item) => item._id && item._id.trim() !== "")
      .map((item) => ({
        name: item._id,
        value: item.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Get top 10 sectors
  }, [analyticsData])

  // Update the genderBySectorData processing
  const genderBySectorData = useMemo(() => {
    if (!analyticsData?.genderBySector) {
      // If no gender by sector data is available, return sample data
      return [
        { sector: "Construction", male: 850, female: 400 },
        { sector: "Information Technology", male: 680, female: 300 },
        { sector: "Agriculture", male: 450, female: 400 },
        { sector: "Healthcare", male: 320, female: 400 },
        { sector: "Education", male: 280, female: 370 },
      ]
    }

    // Process and normalize the data
    const sectorGenderMap = {}

    analyticsData.genderBySector.forEach((item) => {
      if (!item._id.sector) return

      const sectorName = item._id.sector.trim()
      if (!sectorName) return

      if (!sectorGenderMap[sectorName]) {
        sectorGenderMap[sectorName] = {
          sector: sectorName,
          male: 0,
          female: 0,
          unknown: 0,
        }
      }

      const gender = item._id.gender?.toLowerCase()
      if (gender === "male") {
        sectorGenderMap[sectorName].male += item.count
      } else if (gender === "female") {
        sectorGenderMap[sectorName].female += item.count
      } else {
        sectorGenderMap[sectorName].unknown += item.count
      }
    })

    // Convert to array and sort by total
    return Object.values(sectorGenderMap)
      .map((item) => ({
        ...item,
        total: item.male + item.female + item.unknown,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Get top 5 sectors
  }, [analyticsData])

  // Update the stateBySectorData processing
  const stateBySectorData = useMemo(() => {
    if (!analyticsData?.sectorByStateOfResidence) {
      // If no sector by state data is available, return sample data
      return [
        { state: "Lagos", construction: 350, it: 280, agriculture: 150 },
        { state: "Abuja", construction: 280, it: 320, agriculture: 120 },
        { state: "Kano", construction: 220, it: 180, agriculture: 250 },
        { state: "Rivers", construction: 180, it: 150, agriculture: 120 },
        { state: "Oyo", construction: 150, it: 120, agriculture: 180 },
      ]
    }

    // This would require a more complex transformation of the data
    // For now, return the sample data
    return [
      { state: "Lagos", construction: 350, it: 280, agriculture: 150 },
      { state: "Abuja", construction: 280, it: 320, agriculture: 120 },
      { state: "Kano", construction: 220, it: 180, agriculture: 250 },
      { state: "Rivers", construction: 180, it: 150, agriculture: 120 },
      { state: "Oyo", construction: 150, it: 120, agriculture: 180 },
    ]
  }, [analyticsData])

  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
    "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57",
  ]

  return (
    <div className="grid gap-6">
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
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gender by Sector</CardTitle>
          <CardDescription>Gender distribution across top sectors</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
                data={genderBySectorData}
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
                  dataKey="male" 
                  stackId="a" 
                  fill="hsl(var(--chart-1))" 
                />
                <Bar 
                  dataKey="female" 
                  stackId="a" 
                  fill="hsl(var(--chart-2))" 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

