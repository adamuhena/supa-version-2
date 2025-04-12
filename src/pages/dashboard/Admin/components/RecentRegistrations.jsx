import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const genderColors = {
  male: "#4A90E2",    // Blue
  female: "#E91E63",  // Pink
  unknown: "#9E9E9E", // Grey
};

export default function RecentRegistrations({ analyticsData }) {
  const genderData = useMemo(() => {
    if (!analyticsData?.genderDistribution) {
      return { artisanUser: [], intendingArtisan: [] };
    }

    return {
      artisanUser: analyticsData.genderDistribution
        .map(item => ({
          name: item._id === "" ? "Unknown" : 
               item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.artisan_user || 0,
          fill: item._id === "" ? genderColors.unknown :
                genderColors[item._id.toLowerCase()] || genderColors.unknown
        }))
        .filter(item => item.value > 0),

      intendingArtisan: analyticsData.genderDistribution
        .map(item => ({
          name: item._id === "" ? "Unknown" : 
               item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.intending_artisan || 0,
          fill: item._id === "" ? genderColors.unknown :
                genderColors[item._id.toLowerCase()] || genderColors.unknown
        }))
        .filter(item => item.value > 0)
    };
  }, [analyticsData]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!analyticsData?.genderDistribution) {
      return { artisanUser: 0, intendingArtisan: 0, total: 0 };
    }

    const artisanTotal = analyticsData.genderDistribution.reduce(
      (sum, item) => sum + (item.artisan_user || 0), 0
    );
    
    const intendingTotal = analyticsData.genderDistribution.reduce(
      (sum, item) => sum + (item.intending_artisan || 0), 0
    );

    return {
      artisanUser: artisanTotal,
      intendingArtisan: intendingTotal,
      total: artisanTotal + intendingTotal
    };
  }, [analyticsData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription className="text-xs">
          Gender distribution for Artisan & Intending Artisan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-4 justify-between pb-0">
        {/* Artisan User Chart */}
        <div className="flex-1">
          <ChartContainer className="mx-auto aspect-square max-h-[125px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={genderData.artisanUser}
                dataKey="value"
                nameKey="name"
                innerRadius={30}
                strokeWidth={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-sm font-bold"
                          >
                            {totals.artisanUser.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 12}
                            className="fill-muted-foreground text-xs"
                          >
                            Artisan
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Intending Artisan Chart */}
        <div className="flex-1">
          <ChartContainer className="mx-auto aspect-square max-h-[125px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={genderData.intendingArtisan}
                dataKey="value"
                nameKey="name"
                innerRadius={30}
                strokeWidth={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-sm font-bold"
                          >
                            {totals.intendingArtisan.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 12}
                            className="fill-muted-foreground text-xs"
                          >
                            Intending
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-sm">
        {Object.entries(genderColors).map(([gender, color]) => (
          <div key={gender} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{gender}</span>
          </div>
        ))}
      </div>

      {/* Total Count */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Total Users: {totals.total.toLocaleString()}
      </div>
    </Card>
  );
}

// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { API_BASE_URL } from "@/config/env";

// // Define chart configuration with colors for profile completion
// const chartConfig = {
//   profileCompleted: {
//     label: "Profile Completed",
//     color: "hsl(170, 100%, 30%)", // Darker emerald
//   },
//   notCompleted: {
//     label: "Not Completed",
//     color: "hsl(120, 100%, 60%)", // Light green
//   },
// };

// const genderColors = {
//   male: "#4A90E2", // Blue
//   female: "#E91E63", // Pink
//   other: "#9E9E9E", // Grey
// };

// export default function RecentRegistrations() {
//   const [genderData, setGenderData] = useState({
//     artisanUser: [],
//     intendingArtisan: [],
//   });
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const accessToken = localStorage.getItem("accessToken");

//   // Define fetchUsers function outside useEffect so we can reuse it
//   const fetchUsers = async () => {
//     setIsRefreshing(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/dashboard-analytics`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (response.data.success) {
//         const gender = response.data.data?.[0]?.genderDistribution;

//         // Process gender distribution data for Artisan Users
//         const artisanUserGenderData = [
//           {
//             name: "Male",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "artisan_user" &&
//                   item._id.gender === "male"
//               )?.count || 0,
//             fill: genderColors.male,
//           },
//           {
//             name: "Female",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "artisan_user" &&
//                   item._id.gender === "female"
//               )?.count || 0,
//             fill: genderColors.female,
//           },
//           {
//             name: "Other",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "artisan_user" && item._id.gender === ""
//               )?.count || 0,
//             fill: genderColors.other,
//           },
//         ];

//         // Process gender distribution data for Intending Artisans
//         const intendingArtisanGenderData = [
//           {
//             name: "Male",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "intending_artisan" &&
//                   item._id.gender === "male"
//               )?.count || 0,
//             fill: genderColors.male,
//           },
//           {
//             name: "Female",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "intending_artisan" &&
//                   item._id.gender === "female"
//               )?.count || 0,
//             fill: genderColors.female,
//           },
//           {
//             name: "Other",
//             value:
//               gender.find(
//                 (item) =>
//                   item._id.role === "intending_artisan" &&
//                   item._id.gender === ""
//               )?.count || 0,
//             fill: genderColors.other,
//           },
//         ];

//         // Update state with both data sets
//         setGenderData({
//           artisanUser: artisanUserGenderData,
//           intendingArtisan: intendingArtisanGenderData,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     // Initial fetch
//     fetchUsers();

//     // Set up interval for periodic refresh (every 60 seconds)
//     const intervalId = setInterval(fetchUsers, 60000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [accessToken]); // Dependencies array

//   const totalVisitors = useMemo(() => {
//     const totalArtisanUser = genderData.artisanUser.reduce(
//       (acc, curr) => acc + curr.value,
//       0
//     );
//     const totalIntendingArtisan = genderData.intendingArtisan.reduce(
//       (acc, curr) => acc + curr.value,
//       0
//     );
//     return totalArtisanUser + totalIntendingArtisan;
//   }, [genderData]);

//   return (
//     <Card className="flex flex-col relative">
//       {isRefreshing && (
//         <div className="absolute top-2 right-2">
//           <div className="animate-spin h-4 w-4 border-2 border-emerald-500 rounded-full border-t-transparent" />
//         </div>
//       )}
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Gender Distribution</CardTitle>
//         <CardDescription className="text-xs">
//           Gender distribution forArtisan & Intending Artisan
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-row gap-4 justify-between pb-0">
//         {/* Artisan User Chart */}
//         <div className="flex-1">
//           <ChartContainer
//             config={chartConfig}
//             className="mx-auto aspect-square max-h-[125px]">
//             <PieChart>
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />
//               <Pie
//                 data={genderData.artisanUser}
//                 dataKey="value"
//                 nameKey="name"
//                 innerRadius={30}
//                 strokeWidth={3}>
//                 <Label
//                   content={({ viewBox }) => {
//                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle">
//                           <tspan
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             className="fill-foreground text-sm font-bold">
//                             {genderData.artisanUser
//                               .reduce((acc, curr) => acc + curr.value, 0)
//                               .toLocaleString()}
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 12}
//                             className="fill-muted-foreground text-xs">
//                             Artisan
//                           </tspan>
//                         </text>
//                       );
//                     }
//                   }}
//                 />
//               </Pie>
//             </PieChart>
//           </ChartContainer>
//         </div>

//         {/* Intending Artisan Chart */}
//         <div className="flex-1">
//           <ChartContainer
//             config={chartConfig}
//             className="mx-auto aspect-square max-h-[125px]">
//             <PieChart>
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />}
//               />
//               <Pie
//                 data={genderData.intendingArtisan}
//                 dataKey="value"
//                 nameKey="name"
//                 innerRadius={30}
//                 strokeWidth={3}>
//                 <Label
//                   content={({ viewBox }) => {
//                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle">
//                           <tspan
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             className="fill-foreground text-sm font-bold">
//                             {genderData.intendingArtisan
//                               .reduce((acc, curr) => acc + curr.value, 0)
//                               .toLocaleString()}
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 12}
//                             className="fill-muted-foreground text-xs">
//                             Intending
//                           </tspan>
//                         </text>
//                       );
//                     }
//                   }}
//                 />
//               </Pie>
//             </PieChart>
//           </ChartContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }