"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CrossTabDistribution({ geoData, filters }) {
  // Process state residence vs origin cross-tab data
  const stateResidenceOriginData = useMemo(() => {
    if (!geoData?.stateResidenceOriginCrossTab) return []

    // Filter and normalize state names
    return geoData.stateResidenceOriginCrossTab
      .filter(
        (item) =>
          item._id.stateOfResidence &&
          item._id.stateOfOrigin &&
          item._id.stateOfResidence.trim() !== "" &&
          item._id.stateOfOrigin.trim() !== "",
      )
      .map((item) => ({
        name: `${item._id.stateOfResidence.trim()} → ${item._id.stateOfOrigin.trim()}`,
        value: item.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15) // Get top 15 combinations
  }, [geoData])

  // Since the API doesn't provide sector by state data directly,
  // we'll need to adapt or create a placeholder for now
  const sectorByStateData = useMemo(() => {
    // Return sample data for now
    // You'll need to implement a separate API endpoint for this data
    return [
      { state: "Lagos", construction: 350, it: 280, agriculture: 150 },
      { state: "Abuja", construction: 280, it: 320, agriculture: 120 },
      { state: "Kano", construction: 220, it: 180, agriculture: 250 },
      { state: "Rivers", construction: 180, it: 150, agriculture: 120 },
      { state: "Oyo", construction: 150, it: 120, agriculture: 180 },
    ]
  }, [])

  // Since the API doesn't provide trade area by state data directly,
  // we'll need to adapt or create a placeholder for now
  const tradeAreaByStateData = useMemo(() => {
    // Return sample data for now
    // You'll need to implement a separate API endpoint for this data
    return [
      { state: "Lagos", webDev: 150, carpentry: 120, plumbing: 80 },
      { state: "Abuja", webDev: 120, carpentry: 100, plumbing: 60 },
      { state: "Kano", webDev: 80, carpentry: 150, plumbing: 100 },
      { state: "Rivers", webDev: 100, carpentry: 80, plumbing: 60 },
      { state: "Oyo", webDev: 70, carpentry: 60, plumbing: 50 },
    ]
  }, [])

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
      <Tabs defaultValue="state-mobility">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="state-mobility">State Mobility</TabsTrigger>
          <TabsTrigger value="sector-by-state">Sector by State</TabsTrigger>
          <TabsTrigger value="trade-by-state">Trade Area by State</TabsTrigger>
        </TabsList>

        <TabsContent value="state-mobility" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>State of Residence vs State of Origin</CardTitle>
              <CardDescription>Top 15 combinations of residence and origin states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ChartContainer>
                  <BarChart
                    data={stateResidenceOriginData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))">
                      {stateResidenceOriginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sector-by-state" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Distribution by State</CardTitle>
              <CardDescription>Distribution of sectors across top states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ChartContainer
                  config={{
                    construction: {
                      label: "Construction",
                      color: "hsl(var(--chart-1))",
                    },
                    it: {
                      label: "IT",
                      color: "hsl(var(--chart-2))",
                    },
                    agriculture: {
                      label: "Agriculture",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <BarChart
                    data={sectorByStateData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Legend />
                    <Bar dataKey="construction" stackId="a" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="it" stackId="a" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="agriculture" stackId="a" fill="hsl(var(--chart-3))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trade-by-state" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Area Distribution by State</CardTitle>
              <CardDescription>Distribution of trade areas across top states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ChartContainer
                  config={{
                    webDev: {
                      label: "Web Development",
                      color: "hsl(var(--chart-4))",
                    },
                    carpentry: {
                      label: "Carpentry",
                      color: "hsl(var(--chart-5))",
                    },
                    plumbing: {
                      label: "Plumbing",
                      color: "hsl(var(--chart-6))",
                    },
                  }}
                >
                  <BarChart
                    data={tradeAreaByStateData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Legend />
                    <Bar dataKey="webDev" stackId="a" fill="hsl(var(--chart-4))" />
                    <Bar dataKey="carpentry" stackId="a" fill="hsl(var(--chart-5))" />
                    <Bar dataKey="plumbing" stackId="a" fill="hsl(var(--chart-6))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
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

