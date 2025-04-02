"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const COLORS = {
  geographic: ["#2196F3", "#4CAF50", "#F44336", "#FF9800", "#9C27B0"],
  skills: ["#00BCD4", "#8BC34A", "#3F51B5", "#FFC107", "#673AB7"],
  gender: ["#E91E63", "#4A90E2", "#9E9E9E"]
};

export function CrossTabDistribution({ crossTabData, filters, isLoading }) {
  // Process geographic cross-tab data
  const geographicData = useMemo(() => {
    if (!crossTabData?.geographicCrossTabs?.length) return [];

    return crossTabData.geographicCrossTabs
      .filter(item => (
        item._id.stateOfResidence && 
        item._id.lgaOfResidence && 
        item._id.senatorialDistrict
      ))
      .map(item => ({
        name: `${item._id.stateOfResidence} - ${item._id.lgaOfResidence}`,
        value: item.count,
        senatorial: item._id.senatorialDistrict,
        origin: `${item._id.stateOfOrigin || 'Unknown'} - ${item._id.lga || 'Unknown'}`
      }))
      .slice(0, 15);
  }, [crossTabData]);

  // Process skills cross-tab data
  const skillsData = useMemo(() => {
    if (!crossTabData?.skillsCrossTabs?.length) return [];

    return crossTabData.skillsCrossTabs
      .filter(item => item._id.sector && item._id.tradeArea)
      .map(item => ({
        name: `${item._id.stateOfResidence} - ${item._id.lgaOfResidence}`,
        sector: item._id.sector,
        tradeArea: item._id.tradeArea,
        certified: item._id.hasCertificate ? "Yes" : "No",
        value: item.count
      }))
      .slice(0, 15);
  }, [crossTabData]);

  // Process gender cross-tab data
  const genderData = useMemo(() => {
    if (!crossTabData?.genderCrossTabs?.length) return [];

    return crossTabData.genderCrossTabs
      .filter(item => item._id.gender && item._id.sector)
      .map(item => ({
        name: `${item._id.stateOfResidence} - ${item._id.lgaOfResidence}`,
        gender: item._id.gender,
        sector: item._id.sector,
        tradeArea: item._id.tradeArea,
        value: item.count
      }))
      .slice(0, 15);
  }, [crossTabData]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="geographic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="gender">Gender</TabsTrigger>
        </TabsList>

        <TabsContent value="geographic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Cross-tabulation of residence and origin locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ChartContainer>
                  <BarChart
                    data={geographicData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
                    <Bar dataKey="value">
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.geographic[index % COLORS.geographic.length]} />
                      ))}
                    </Bar>
                    <ChartTooltip 
                      content={({ payload }) => {
                        if (!payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p>Senatorial: {data.senatorial}</p>
                            <p>Origin: {data.origin}</p>
                            <p>Count: {data.value}</p>
                          </div>
                        );
                      }}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar structure for Skills and Gender tabs */}
        {/* ...add TabsContent for "skills" and "gender" values... */}
      </Tabs>
    </div>
  );
}

