"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

export function GenderDistribution({ analyticsData, geoData, filters }) {
  // Update the color constants to include 'other'
  const GENDER_COLORS = {
    male: "#4A90E2", // Blue
    female: "#E91E63", // Pink
    unknown: "#9E9E9E", // Grey
    other: "#FF9800", // Orange
  }

  // First, update the color constants at the top of the file
  const ROLE_COLORS = {
    artisan_user: "#2563eb",     // Blue
    intending_artisan: "#16a34a" // Green
  }

  // Update the genderData processing
  const genderData = useMemo(() => {
    if (!analyticsData?.genderDistribution) return []

    return analyticsData.genderDistribution.map((item) => ({
      name: item._id === "" ? "Unknown" : item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.total,
      artisan_user: item.artisan_user,
      intending_artisan: item.intending_artisan,
    }))
  }, [analyticsData])

  // Update the roleByGenderData processing
  const roleByGenderData = useMemo(() => {
    if (!analyticsData?.genderDistribution) return []

    return analyticsData.genderDistribution
      .map((item) => ({
        gender: item._id === "" ? "Unknown" : item._id.charAt(0).toUpperCase() + item._id.slice(1),
        artisan_user: item.artisan_user,
        intending_artisan: item.intending_artisan,
        total: item.total,
      }))
      .sort((a, b) => b.total - a.total) // Sort by total count
  }, [analyticsData])

  // Update the genderByStateData processing
  const genderByStateData = useMemo(() => {
    if (!geoData?.genderByStateOfResidence) return []

    const normalizedStateData = {}

    geoData.genderByStateOfResidence.forEach((item) => {
      if (!item._id.stateOfResidence) return

      const stateName = item._id.stateOfResidence.trim()
      if (!stateName) return
      if (item.total < 100) return

      if (!normalizedStateData[stateName]) {
        normalizedStateData[stateName] = {
          state: stateName,
          male: 0,
          female: 0,
          unknown: 0,
          male_artisan: 0,
          male_intending: 0,
          female_artisan: 0,
          female_intending: 0,
          unknown_artisan: 0,
          unknown_intending: 0,
        }
      }

      const gender = item._id.gender?.toLowerCase()
      if (gender === "male") {
        normalizedStateData[stateName].male += item.total || 0
        normalizedStateData[stateName].male_artisan += item.artisan_user || 0
        normalizedStateData[stateName].male_intending += item.intending_artisan || 0
      } else if (gender === "female") {
        normalizedStateData[stateName].female += item.total || 0
        normalizedStateData[stateName].female_artisan += item.artisan_user || 0
        normalizedStateData[stateName].female_intending += item.intending_artisan || 0
      } else {
        normalizedStateData[stateName].unknown += item.total || 0
        normalizedStateData[stateName].unknown_artisan += item.artisan_user || 0
        normalizedStateData[stateName].unknown_intending += item.intending_artisan || 0
      }
    })

    return Object.values(normalizedStateData)
      .map((item) => ({
        ...item,
        total: item.male + item.female + item.unknown,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
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
                      fill={GENDER_COLORS[entry.name.toLowerCase()] || GENDER_COLORS.unknown}
                    />
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
          <CardTitle>Role by Gender</CardTitle>
          <CardDescription>Distribution of roles across genders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                artisan_user: {
                  label: "Artisan Users",
                  color: ROLE_COLORS.artisan_user,
                },
                intending_artisan: {
                  label: "Intending Artisans", 
                  color: ROLE_COLORS.intending_artisan,
                },
              }}
            >
              <BarChart 
                data={roleByGenderData} 
                layout="vertical" 
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="gender" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={70} 
                />
                <Legend />
                <Bar 
                  dataKey="artisan_user" 
                  stackId="a" 
                  fill={ROLE_COLORS.artisan_user}
                  name="Artisan Users"
                />
                <Bar 
                  dataKey="intending_artisan" 
                  stackId="a" 
                  fill={ROLE_COLORS.intending_artisan}
                  name="Intending Artisans"
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const artisanValue = payload[0]?.value || 0;
                      const intendingValue = payload[1]?.value || 0;
                      const total = artisanValue + intendingValue;
                      
                      return (
                        <div className="bg-white p-2 border rounded shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-[#2563eb]">
                            Artisan Users: {artisanValue.toLocaleString()} 
                            ({((artisanValue/total) * 100).toFixed(1)}%)
                          </p>
                          <p className="text-[#16a34a]">
                            Intending Artisans: {intendingValue.toLocaleString()}
                            ({((intendingValue/total) * 100).toFixed(1)}%)
                          </p>
                          <p className="mt-1 pt-1 border-t">
                            Total: {total.toLocaleString()}
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

      <Card className="lg:col-span-2">
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
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const state = label
                      const maleCount = payload.find((p) => p.dataKey === "male")?.value || 0
                      const femaleCount = payload.find((p) => p.dataKey === "female")?.value || 0
                      const unknownCount = payload.find((p) => p.dataKey === "unknown")?.value || 0
                      const total = maleCount + femaleCount + unknownCount

                      const data = genderByStateData.find((item) => item.state === state)

                      return (
                        <div className="bg-white p-2 border rounded shadow-md">
                          <p className="font-medium">{state}</p>
                          <p>Total: {total.toLocaleString()}</p>
                          <p>
                            Male: {maleCount.toLocaleString()} ({((maleCount / total) * 100).toFixed(1)}%)
                          </p>
                          <p>
                            Female: {femaleCount.toLocaleString()} ({((femaleCount / total) * 100).toFixed(1)}%)
                          </p>
                          {unknownCount > 0 && (
                            <p>
                              Unknown: {unknownCount.toLocaleString()} ({((unknownCount / total) * 100).toFixed(1)}%)
                            </p>
                          )}
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium">Artisan Users</p>
                            <p>Male: {data.male_artisan.toLocaleString()}</p>
                            <p>Female: {data.female_artisan.toLocaleString()}</p>
                          </div>
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium">Intending Artisans</p>
                            <p>Male: {data.male_intending.toLocaleString()}</p>
                            <p>Female: {data.female_intending.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    }
                    return null
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




// "use client"

// import { useMemo } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { Bar, BarChart, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

// export function GenderDistribution({ analyticsData, geoData, filters }) {
//   // Define custom colors for gender
//   const GENDER_COLORS = {
//     male: "#4A90E2",    // Blue
//     female: "#E91E63",  // Pink
//     unknown: "#9E9E9E"  // Grey
//   };

//   // Process gender distribution data
//   const genderData = useMemo(() => {
//     if (!analyticsData?.genderDistribution) return []

//     // Map the data directly from the API response
//     return analyticsData.genderDistribution.map((item) => ({
//       name: item._id === "" ? "Unknown" : item._id.charAt(0).toUpperCase() + item._id.slice(1),
//       value: item.count,
//     }))
//   }, [analyticsData])

//   // Update the genderByStateData processing to handle the new data structure
//   const genderByStateData = useMemo(() => {
//     if (!geoData?.genderByStateOfResidence) return []

//     // Filter and normalize state names (remove trailing spaces, standardize case)
//     const normalizedStateData = {}

//     // Process data from genderByStateOfResidence
//     geoData.genderByStateOfResidence.forEach((item) => {
//       if (!item._id.stateOfResidence) return

//       // Normalize state name by trimming and converting to title case
//       const stateName = item._id.stateOfResidence.trim()
//       if (!stateName) return

//       // Skip entries with very low counts to focus on significant data
//       if (item.count < 100) return

//       // Initialize state entry if it doesn't exist
//       if (!normalizedStateData[stateName]) {
//         normalizedStateData[stateName] = {
//           state: stateName,
//           male: 0,
//           female: 0,
//           unknown: 0,
//         }
//       }

//       // Add counts based on gender
//       const gender = item._id.gender?.toLowerCase()
//       if (gender === "male") {
//         normalizedStateData[stateName].male += item.count
//       } else if (gender === "female") {
//         normalizedStateData[stateName].female += item.count
//       } else {
//         normalizedStateData[stateName].unknown += item.count
//       }
//     })

//     // Convert to array and sort by total population
//     return Object.values(normalizedStateData)
//       .map((item) => ({
//         ...item,
//         total: item.male + item.female + item.unknown,
//       }))
//       .sort((a, b) => b.total - a.total)
//       .slice(0, 10) // Get top 10 states
//   }, [geoData])

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Gender Distribution</CardTitle>
//           <CardDescription>Distribution of users by gender</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] w-full">
//             <ChartContainer
//               config={{
//                 male: {
//                   label: "Male",
//                   color: GENDER_COLORS.male,
//                 },
//                 female: {
//                   label: "Female",
//                   color: GENDER_COLORS.female,
//                 },
//                 unknown: {
//                   label: "Unknown",
//                   color: GENDER_COLORS.unknown,
//                 },
//               }}
//             >
//               <PieChart>
//                 <Pie
//                   data={genderData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {genderData.map((entry) => (
//                     <Cell 
//                       key={`cell-${entry.name}`} 
//                       fill={GENDER_COLORS[entry.name.toLowerCase()]}
//                     />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//               </PieChart>
//             </ChartContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Gender by State</CardTitle>
//           <CardDescription>Gender distribution across top 10 states</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] w-full">
//             <ChartContainer
//               config={{
//                 male: {
//                   label: "Male",
//                   color: GENDER_COLORS.male,
//                 },
//                 female: {
//                   label: "Female",
//                   color: GENDER_COLORS.female,
//                 },
//                 unknown: {
//                   label: "Unknown",
//                   color: GENDER_COLORS.unknown,
//                 },
//               }}
//             >
//               <BarChart data={genderByStateData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
//                 <XAxis type="number" />
//                 <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={70} />
//                 <Legend />
//                 <Bar dataKey="male" stackId="a" fill={GENDER_COLORS.male} />
//                 <Bar dataKey="female" stackId="a" fill={GENDER_COLORS.female} />
//                 <Bar dataKey="unknown" stackId="a" fill={GENDER_COLORS.unknown} />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//               </BarChart>
//             </ChartContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

