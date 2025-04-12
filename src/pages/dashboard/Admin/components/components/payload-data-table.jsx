

// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ChevronDown, ChevronRight } from "lucide-react"

// export function PayloadDataTable({ analyticsData }) {
//   if (!analyticsData) {
//     return (
//       <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//         <CardContent className="p-6 flex justify-center items-center h-64">
//           <p className="text-muted-foreground">Loading data...</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Calculate total users
//   const totalUsers = analyticsData.overallCounts?.reduce((sum, item) => sum + item.count, 0) || 0

//   return (
//     <Tabs defaultValue="overall" className="space-y-4">
//       <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 gap-2 bg-gray-100 p-1 rounded-lg">
//         <TabsTrigger value="overall" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Overall Counts
//         </TabsTrigger>
//         <TabsTrigger value="gender" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Gender
//         </TabsTrigger>
//         <TabsTrigger value="residence" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Residence
//         </TabsTrigger>
//         <TabsTrigger value="origin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Origin
//         </TabsTrigger>
//         <TabsTrigger value="lga" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           LGA Data
//         </TabsTrigger>
//         <TabsTrigger value="centers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Training Centers
//         </TabsTrigger>
//         <TabsTrigger value="sectors" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Sectors
//         </TabsTrigger>
//         <TabsTrigger value="tradeareas" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//           Trade Areas
//         </TabsTrigger>
//       </TabsList>

//       <TabsContent value="overall">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>Overall Distribution Counts</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Role</TableHead>
//                   <TableHead className="text-right">Count</TableHead>
//                   <TableHead className="text-right">Percentage</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {analyticsData.overallCounts?.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
//                     <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
//                     <TableCell className="text-right">{((item.count / totalUsers) * 100).toFixed(2)}%</TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow className="bg-muted/50">
//                   <TableCell className="font-bold">Total</TableCell>
//                   <TableCell className="text-right font-bold">{totalUsers.toLocaleString()}</TableCell>
//                   <TableCell className="text-right font-bold">100%</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="gender">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>Gender Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Gender</TableHead>
//                   <TableHead className="text-right">Total</TableHead>
//                   <TableHead className="text-right">Artisan Users</TableHead>
//                   <TableHead className="text-right">Intending Artisans</TableHead>
//                   <TableHead className="text-right">Percentage</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {analyticsData.genderDistribution?.map((item, index) => {
//                   const artisanCount = item.roles?.find((r) => r.role === "artisan_user")?.count || 0
//                   const intendingCount = item.roles?.find((r) => r.role === "intending_artisan")?.count || 0

//                   return (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{item._id || "Unspecified"}</TableCell>
//                       <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{artisanCount.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{intendingCount.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{((item.total / totalUsers) * 100).toFixed(2)}%</TableCell>
//                     </TableRow>
//                   )
//                 })}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="residence">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>State of Residence Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="max-h-[600px] overflow-y-auto">
//               <Table>
//                 <TableHeader className="sticky top-0 bg-white">
//                   <TableRow>
//                     <TableHead>State</TableHead>
//                     <TableHead className="text-right">Total</TableHead>
//                     <TableHead className="text-right">Artisan Users</TableHead>
//                     <TableHead className="text-right">Intending Artisans</TableHead>
//                     <TableHead className="text-right">Percentage</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {analyticsData.stateOfResidenceDistribution?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
//                       <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{((item.total / totalUsers) * 100).toFixed(2)}%</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="origin">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>State of Origin Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="max-h-[600px] overflow-y-auto">
//               <Table>
//                 <TableHeader className="sticky top-0 bg-white">
//                   <TableRow>
//                     <TableHead>State</TableHead>
//                     <TableHead className="text-right">Total</TableHead>
//                     <TableHead className="text-right">Artisan Users</TableHead>
//                     <TableHead className="text-right">Intending Artisans</TableHead>
//                     <TableHead className="text-right">Percentage</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {analyticsData.stateOfOriginDistribution?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
//                       <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{((item.total / totalUsers) * 100).toFixed(2)}%</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="lga">
//         <GenderByStateTable data={analyticsData.genderByStateOfResidence} />
//         <div className="h-6"></div>
//         <LGADistributionTable data={analyticsData.lgaOfResidenceDistribution} title="LGA of Residence Distribution" />
//         <div className="h-6"></div>
//         <LGADistributionTable data={analyticsData.lgaDistribution} title="LGA Distribution" />
//         <div className="h-6"></div>
//         <CrossTabTable data={analyticsData.lgaCrossTab} />
//       </TabsContent>

//       <TabsContent value="centers">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>Training Centers</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4">
//               <p className="text-lg font-medium">
//                 Total Centers: {analyticsData.trainingCenterStats?.totalCenters || 0}
//               </p>
//             </div>
//             <div className="max-h-[600px] overflow-y-auto">
//               <Table>
//                 <TableHeader className="sticky top-0 bg-white">
//                   <TableRow>
//                     <TableHead>State</TableHead>
//                     <TableHead className="text-right">Number of Centers</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {analyticsData.trainingCenterStats?.centersByState?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item._id || "N/A"}</TableCell>
//                       <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       {/* Sectors Tab */}
//       <TabsContent value="sectors">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>User Sector Distribution by State</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="max-h-[600px] overflow-y-auto">
//               <Table>
//                 <TableHeader className="sticky top-0 bg-white">
//                   <TableRow>
//                     <TableHead>State</TableHead>
//                     <TableHead>Sector</TableHead>
//                     <TableHead className="text-right">Total</TableHead>
//                     <TableHead className="text-right">Artisan Users</TableHead>
//                     <TableHead className="text-right">Intending Artisans</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {analyticsData.sectorByStateOfResidence?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item._id.state || "N/A"}</TableCell>
//                       <TableCell>{item._id.sector || "N/A"}</TableCell>
//                       <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       {/* Trade Areas Tab */}
//       <TabsContent value="tradeareas">
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//           <CardHeader>
//             <CardTitle>User Trade Area Distribution by State</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="max-h-[600px] overflow-y-auto">
//               <Table>
//                 <TableHeader className="sticky top-0 bg-white">
//                   <TableRow>
//                     <TableHead>State</TableHead>
//                     <TableHead>Sector</TableHead>
//                     <TableHead>Trade Area</TableHead>
//                     <TableHead className="text-right">Total</TableHead>
//                     <TableHead className="text-right">Artisan Users</TableHead>
//                     <TableHead className="text-right">Intending Artisans</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {analyticsData.tradeAreaByStateOfResidence?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item._id.state || "N/A"}</TableCell>
//                       <TableCell>{item._id.sector || "N/A"}</TableCell>
//                       <TableCell>{item._id.tradeArea || "N/A"}</TableCell>
//                       <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                       <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   )
// }

// function GenderByStateTable({ data }) {
//   const [expandedStates, setExpandedStates] = useState({})

//   if (!data || data.length === 0) {
//     return <p>No gender by state data available</p>
//   }

//   // Group data by state
//   const groupedData = data.reduce((acc, item) => {
//     const state = item._id.stateOfResidence
//     if (!acc[state]) {
//       acc[state] = []
//     }
//     acc[state].push(item)
//     return acc
//   }, {})

//   const toggleState = (state) => {
//     setExpandedStates((prev) => ({
//       ...prev,
//       [state]: !prev[state],
//     }))
//   }

//   return (
//     <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//       <CardHeader>
//         <CardTitle>Gender Distribution by State of Residence</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="max-h-[600px] overflow-y-auto">
//           <Table>
//             <TableHeader className="sticky top-0 bg-white">
//               <TableRow>
//                 <TableHead>State</TableHead>
//                 <TableHead>Gender</TableHead>
//                 <TableHead className="text-right">Total</TableHead>
//                 <TableHead className="text-right">Artisan Users</TableHead>
//                 <TableHead className="text-right">Intending Artisans</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {Object.entries(groupedData).map(([state, items]) => (
//                 <>
//                   <TableRow
//                     key={state}
//                     className="bg-gray-50 cursor-pointer hover:bg-gray-100"
//                     onClick={() => toggleState(state)}
//                   >
//                     <TableCell colSpan={2} className="font-medium">
//                       <div className="flex items-center">
//                         {expandedStates[state] ? (
//                           <ChevronDown className="h-4 w-4 mr-2" />
//                         ) : (
//                           <ChevronRight className="h-4 w-4 mr-2" />
//                         )}
//                         {state}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {items.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {items.reduce((sum, item) => sum + (item.artisan_user || 0), 0).toLocaleString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {items.reduce((sum, item) => sum + (item.intending_artisan || 0), 0).toLocaleString()}
//                     </TableCell>
//                   </TableRow>
//                   {expandedStates[state] &&
//                     items.map((item, idx) => (
//                       <TableRow key={`${state}-${idx}`}>
//                         <TableCell></TableCell>
//                         <TableCell>{item._id.gender || "Unspecified"}</TableCell>
//                         <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                         <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                         <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                 </>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function LGADistributionTable({ data, title }) {
//   if (!data || data.length === 0) {
//     return <p>No LGA data available</p>
//   }

//   return (
//     <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="max-h-[600px] overflow-y-auto">
//           <Table>
//             <TableHeader className="sticky top-0 bg-white">
//               <TableRow>
//                 <TableHead>State</TableHead>
//                 <TableHead>LGA</TableHead>
//                 <TableHead className="text-right">Total</TableHead>
//                 <TableHead className="text-right">Artisan Users</TableHead>
//                 <TableHead className="text-right">Intending Artisans</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item._id.state || "N/A"}</TableCell>
//                   <TableCell>{item._id.lga || "N/A"}</TableCell>
//                   <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                   <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                   <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function CrossTabTable({ data }) {
//   if (!data || data.length === 0) {
//     return <p>No cross-tab data available</p>
//   }

//   return (
//     <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
//       <CardHeader>
//         <CardTitle>LGA Cross-Tab Distribution</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="max-h-[600px] overflow-y-auto">
//           <Table>
//             <TableHeader className="sticky top-0 bg-white">
//               <TableRow>
//                 <TableHead>Residence LGA</TableHead>
//                 <TableHead>Origin LGA</TableHead>
//                 <TableHead>Residence State</TableHead>
//                 <TableHead>Origin State</TableHead>
//                 <TableHead className="text-right">Total</TableHead>
//                 <TableHead className="text-right">Artisan Users</TableHead>
//                 <TableHead className="text-right">Intending Artisans</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item._id.residenceLga || "N/A"}</TableCell>
//                   <TableCell>{item._id.originLga || "N/A"}</TableCell>
//                   <TableCell>{item._id.residenceState || "N/A"}</TableCell>
//                   <TableCell>{item._id.originState || "N/A"}</TableCell>
//                   <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
//                   <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
//                   <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"

export function PayloadDataTable({ analyticsData }) {
  if (!analyticsData) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6 flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate total users
  const totalUsers = analyticsData.overallCounts?.reduce((sum, item) => sum + item.count, 0) || 0

  return (
    <Tabs defaultValue="overall" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 gap-2 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger value="overall" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Overall
        </TabsTrigger>
        <TabsTrigger value="gender" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Gender
        </TabsTrigger>
        <TabsTrigger value="residence" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Residence
        </TabsTrigger>
        <TabsTrigger value="origin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Origin
        </TabsTrigger>
        <TabsTrigger value="lga" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          LGA Data
        </TabsTrigger>
        <TabsTrigger value="centers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Centers
        </TabsTrigger>
        <TabsTrigger value="sectors" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Sectors
        </TabsTrigger>
        <TabsTrigger value="tradeareas" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Trade Areas
        </TabsTrigger>
      </TabsList>

      {/* Overall Counts Tab */}
      {/* <TabsContent value="overall">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Overall Distribution Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium text-blue-900">
                Total Training Centers: {analyticsData.trainingCenterStats?.totalCenters?.toLocaleString() || 0}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.overallCounts?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
                    <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{((item.count / totalUsers) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total Users</TableCell>
                  <TableCell className="text-right font-bold">{totalUsers.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent> */}
      <TabsContent value="overall">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Overall Distribution Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Training Centers</TableCell>
                  <TableCell className="text-right">{analyticsData.trainingCenterStats?.totalCenters?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                {analyticsData.overallCounts?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
                    <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{((item.count / totalUsers) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total Users</TableCell>
                  <TableCell className="text-right font-bold">{totalUsers.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Gender Tab */}
      <TabsContent value="gender">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Artisan Users</TableHead>
                  <TableHead className="text-right">Intending Artisans</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.genderDistribution?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item._id === "" ? "Unknown" : 
                      item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                    </TableCell>
                    <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {((item.total / totalUsers) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Residence Tab */}
      <TabsContent value="residence">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>State of Residence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.stateOfResidenceDistribution?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{((item.total / totalUsers) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Origin Tab */}
      <TabsContent value="origin">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>State of Origin Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.stateOfOriginDistribution?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item._id || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{((item.total / totalUsers) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* LGA Tab */}
      <TabsContent value="lga">
        <GenderByStateTable data={analyticsData.genderByStateOfResidence} />
        <div className="h-6"></div>
        <LGADistributionTable data={analyticsData.lgaOfResidenceDistribution} title="LGA of Residence Distribution" />
        <div className="h-6"></div>
        <LGADistributionTable data={analyticsData.lgaDistribution} title="LGA Distribution" />
        <div className="h-6"></div>
        <CrossTabTable data={analyticsData.lgaCrossTab} />
      </TabsContent>

      {/* Training Centers Tab */}
      <TabsContent value="centers">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Training Centers Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-lg font-medium">
                Total Centers: {analyticsData.trainingCenterStats?.totalCenters || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Centers by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersByState?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Centers by LGA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersByLga?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.lga || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Sectors Tab */}
      <TabsContent value="sectors">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>User Sector Distribution by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.sectorByStateOfResidence?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.sector || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>User Sector Distribution by LGA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.sectorByLgaOfResidence?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.lga || "N/A"}</TableCell>
                      <TableCell>{item._id.sector || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Training Center Sector Distribution by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersBySector?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.sectorName || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Training Center Sector Distribution by LGA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersBySectorAndLga?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.lga || "N/A"}</TableCell>
                      <TableCell>{item._id.sectorName || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Trade Areas Tab */}
      <TabsContent value="tradeareas">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>User Trade Area Distribution by State of Residence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Trade Area</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.tradeAreaByStateOfResidence?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.sector || "N/A"}</TableCell>
                      <TableCell>{item._id.tradeArea || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>User Trade Area Distribution by LGA of Residence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Trade Area</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Artisan Users</TableHead>
                    <TableHead className="text-right">Intending Artisans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.tradeAreaByLgaOfResidence?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.lga || "N/A"}</TableCell>
                      <TableCell>{item._id.sector || "N/A"}</TableCell>
                      <TableCell>{item._id.tradeArea || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Training Center Trade Area Distribution by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Trade Area</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersByTradeArea?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.sectorName || "N/A"}</TableCell>
                      <TableCell>{item._id.tradeAreaName || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="h-6"></div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Training Center Trade Area Distribution by LGA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Trade Area</TableHead>
                    <TableHead className="text-right">Number of Centers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.trainingCenterStats?.centersByTradeAreaAndLga?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item._id.state || "N/A"}</TableCell>
                      <TableCell>{item._id.lga || "N/A"}</TableCell>
                      <TableCell>{item._id.sectorName || "N/A"}</TableCell>
                      <TableCell>{item._id.tradeAreaName || "N/A"}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function GenderByStateTable({ data }) {
  const [expandedStates, setExpandedStates] = useState({})

  if (!data || data.length === 0) {
    return <p>No gender by state data available</p>
  }

  // Group data by state
  const groupedData = data.reduce((acc, item) => {
    const state = item._id.stateOfResidence
    if (!acc[state]) {
      acc[state] = []
    }
    acc[state].push(item)
    return acc
  }, {})

  const toggleState = (state) => {
    setExpandedStates((prev) => ({
      ...prev,
      [state]: !prev[state],
    }))
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Gender Distribution by State of Residence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Artisan Users</TableHead>
                <TableHead className="text-right">Intending Artisans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedData).map(([state, items]) => (
                <>
                  <TableRow
                    key={state}
                    className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleState(state)}
                  >
                    <TableCell colSpan={2} className="font-medium">
                      <div className="flex items-center">
                        {expandedStates[state] ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        {state}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {items.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {items.reduce((sum, item) => sum + (item.artisan_user || 0), 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {items.reduce((sum, item) => sum + (item.intending_artisan || 0), 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  {expandedStates[state] &&
                    items.map((item, idx) => (
                      <TableRow key={`${state}-${idx}`}>
                        <TableCell></TableCell>
                        <TableCell>{item._id.gender || "Unspecified"}</TableCell>
                        <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function LGADistributionTable({ data, title }) {
  if (!data || data.length === 0) {
    return <p>No LGA data available</p>
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>LGA</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Artisan Users</TableHead>
                <TableHead className="text-right">Intending Artisans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item._id.state || "N/A"}</TableCell>
                  <TableCell>{item._id.lga || "N/A"}</TableCell>
                  <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function CrossTabTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No cross-tab data available</p>
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>LGA Cross-Tab Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>Residence LGA</TableHead>
                <TableHead>Origin LGA</TableHead>
                <TableHead>Residence State</TableHead>
                <TableHead>Origin State</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Artisan Users</TableHead>
                <TableHead className="text-right">Intending Artisans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item._id.residenceLga || "N/A"}</TableCell>
                  <TableCell>{item._id.originLga || "N/A"}</TableCell>
                  <TableCell>{item._id.residenceState || "N/A"}</TableCell>
                  <TableCell>{item._id.originState || "N/A"}</TableCell>
                  <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.artisan_user.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.intending_artisan.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}