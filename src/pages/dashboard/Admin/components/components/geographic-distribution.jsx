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
    if (!geoData?.stateOfResidenceDistribution?.length) return [];

    return geoData.stateOfResidenceDistribution
      .filter((item) => item._id && item._id.trim() !== "")
      .map((item) => ({
        name: item._id.trim(),
        value: item.count || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [geoData]);

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
    if (!geoData?.lgaOfResidenceDistribution?.length) return [];

    return geoData.lgaOfResidenceDistribution
      .filter(item => item._id?.state && item._id?.lga)
      .map(item => ({
        name: `${item._id.lga} (${item._id.state})`,
        value: item.count || 0,
        state: item._id.state,
        lga: item._id.lga
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [geoData]);

  // Process LGA distribution data
  const lgaDistributionData = useMemo(() => {
    if (!geoData?.lgaDistribution?.length) return [];

    return geoData.lgaDistribution
      .filter(item => item._id?.state && item._id?.lga)
      .map(item => ({
        name: `${item._id.lga} (${item._id.state})`,
        value: item.count || 0,
        state: item._id.state,
        lga: item._id.lga
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [geoData]);

  // Process senatorial district data
  const senatorialDistrictData = useMemo(() => {
    if (!geoData?.senatorialDistrictDistribution?.length) return [];

    return geoData.senatorialDistrictDistribution
      .filter(item => item._id?.state && item._id?.district)
      .map(item => ({
        name: `${item._id.district} (${item._id.state})`,
        value: item.count || 0,
        state: item._id.state,
        district: item._id.district
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [geoData]);

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
  ];

  // Define gradient colors for different chart types
  const CHART_GRADIENTS = {
    residence: {
      start: "#4CAF50",
      end: "#81C784"
    },
    origin: {
      start: "#2196F3",
      end: "#64B5F6"
    },
    lga: {
      start: "#F44336",
      end: "#EF5350"
    },
    senatorial: {
      start: "#FF9800",
      end: "#FFB74D"
    }
  };

  const chartStyle = {
    fill: 'currentColor',
    fontSize: '12px',
  };

  const renderBarChart = (data, type) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <ChartContainer
        config={{
          [type]: {
            label: type === "residence" ? "Residence" : "Origin",
            color: CHART_GRADIENTS[type].start,
          }
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis 
              type="number"
              tickFormatter={(value) => value.toLocaleString()}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              style={{ fontSize: '12px' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                />
              ))}
            </Bar>
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={
                <ChartTooltipContent
                  formatValue={(value, name) => 
                    name === "value" ? `${value.toLocaleString()} users` : value
                  }
                />
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="states">
        <TabsList className="grid w-full grid-cols-4 gap-4">
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
                  {renderBarChart(stateOfResidenceData, "residence")}
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
                  {renderBarChart(stateOfOriginData, "origin")}
                </div>
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
                <div className="h-[400px] w-full">
                  {renderBarChart(lgaOfResidenceData, "lga")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LGA of Origin</CardTitle>
                <CardDescription>Distribution by LGA of origin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {renderBarChart(lgaDistributionData, "lga")}
                </div>
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
              <div className="h-[500px] w-full">
                {renderBarChart(senatorialDistrictData, "senatorial")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

