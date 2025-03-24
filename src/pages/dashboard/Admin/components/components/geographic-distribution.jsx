"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GeographicDistribution({ geoData, filters }) {
  // Add data validation
  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Process state of residence data
  const stateOfResidenceData = useMemo(() => {
    if (!geoData?.stateOfResidenceDistribution?.length) return []

    return geoData.stateOfResidenceDistribution
      .filter((item) => item._id && item._id.trim() !== "")
      .map((item) => ({
        name: item._id.trim(),
        value: item.count || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15)
  }, [geoData])

  // Process state of origin data
  const stateOfOriginData = useMemo(() => {
    if (!geoData?.stateOfOriginDistribution?.length) return []

    return geoData.stateOfOriginDistribution
      .filter((item) => item._id && item._id.trim() !== "")
      .map((item) => ({
        name: item._id.trim(),
        value: item.count || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15)
  }, [geoData])

  // Process LGA of residence data
  const lgaOfResidenceData = useMemo(() => {
    // For now, return empty array as the API doesn't provide this data in the expected format
    // You'll need to implement a separate API endpoint for LGA data
    return []
  }, [geoData])

  // Process LGA of origin data
  const lgaOfOriginData = useMemo(() => {
    // For now, return empty array as the API doesn't provide this data in the expected format
    // You'll need to implement a separate API endpoint for LGA data
    return []
  }, [geoData])

  // Process senatorial district data
  const senatorialDistrictData = useMemo(() => {
    // For now, return empty array as the API doesn't provide this data in the expected format
    // You'll need to implement a separate API endpoint for senatorial district data
    return []
  }, [geoData])

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
    "#83a6ed",
    "#8884d8",
    "#ffc658",
    "#ff8c00",
    "#ff0000",
  ]

  const chartStyle = {
    fill: 'currentColor',
    fontSize: '12px',
  };

  const renderBarChart = (data, color) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer style={chartStyle}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis 
              type="number"
              style={chartStyle}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              style={chartStyle}
            />
            <Bar 
              dataKey="value" 
              fill={`hsl(var(--chart-${color}))`}
              style={chartStyle}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={
                <ChartTooltipContent
                  style={chartStyle}
                  formatValue={(value, name) => 
                    name === "value" ? `${value.toLocaleString()} users` : value
                  }
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="states">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="lgas">LGAs</TabsTrigger>
          <TabsTrigger value="senatorial">Senatorial Districts</TabsTrigger>
        </TabsList>

        <TabsContent value="states" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>State of Residence Distribution</CardTitle>
                <CardDescription>Top 15 states by number of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {renderBarChart(stateOfResidenceData, "1")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State of Origin Distribution</CardTitle>
                <CardDescription>Top 15 states by number of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {renderBarChart(stateOfOriginData, "2")}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lgas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LGA of Residence Distribution</CardTitle>
                <CardDescription>Top 15 LGAs by number of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <BarChart
                      data={lgaOfResidenceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Bar dataKey="value" fill="hsl(var(--chart-3))">
                        {lgaOfResidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatValue={(value, name, props) => {
                              if (name === "value") {
                                return `${value} users`
                              }
                              return value
                            }}
                          />
                        }
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LGA of Origin Distribution</CardTitle>
                <CardDescription>Top 15 LGAs by number of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <BarChart
                      data={lgaOfOriginData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Bar dataKey="value" fill="hsl(var(--chart-4))">
                        {lgaOfOriginData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatValue={(value, name, props) => {
                              if (name === "value") {
                                return `${value} users`
                              }
                              return value
                            }}
                          />
                        }
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="senatorial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Senatorial District Distribution</CardTitle>
              <CardDescription>Distribution of users by senatorial district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <ChartContainer>
                  <BarChart
                    data={senatorialDistrictData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                    <Bar dataKey="value" fill="hsl(var(--chart-5))">
                      {senatorialDistrictData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatValue={(value, name, props) => {
                            if (name === "value") {
                              return `${value} users`
                            }
                            return value
                          }}
                        />
                      }
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

