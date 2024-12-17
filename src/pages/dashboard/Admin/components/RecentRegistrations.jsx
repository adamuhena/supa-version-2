import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define chart configuration with colors for profile completion
const chartConfig = {
  profileCompleted: {
    label: "Profile Completed",
    color: "hsl(170, 100%, 30%)", // Darker emerald
  },
  notCompleted: {
    label: "Not Completed",
    color: "hsl(120, 100%, 60%)", // Light green
  },
};

const genderColors = {
  male: "#4A90E2", // Blue
  female: "#E91E63", // Pink
  other: "#9E9E9E", // Grey
};

export default function RecentRegistrations() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [genderData, setGenderData] = useState({
    artisanUser: [],
    intendingArtisan: [],
  });
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          const gender = response.data.data?.[0]?.genderDistribution;

          console.log("gender: ", gender);

          // Process gender distribution data for Artisan Users
          const artisanUserGenderData = [
            { name: "Male", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "male")?.count || 0, fill: genderColors.male },
            { name: "Female", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "female")?.count || 0, fill: genderColors.female },
            { name: "Other", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "")?.count || 0, fill: genderColors.other },
          ];

          // Process gender distribution data for Intending Artisans
          const intendingArtisanGenderData = [
            { name: "Male", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "male")?.count || 0, fill: genderColors.male },
            { name: "Female", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "female")?.count || 0, fill: genderColors.female },
            { name: "Other", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "")?.count || 0, fill: genderColors.other },
          ];

          // Update state with both data sets
          setGenderData({
            artisanUser: artisanUserGenderData,
            intendingArtisan: intendingArtisanGenderData,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [accessToken, API_BASE_URL]);

  const totalVisitors = useMemo(() => {
    const totalArtisanUser = genderData.artisanUser.reduce((acc, curr) => acc + curr.value, 0);
    const totalIntendingArtisan = genderData.intendingArtisan.reduce((acc, curr) => acc + curr.value, 0);
    return totalArtisanUser + totalIntendingArtisan;
  }, [genderData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription className="text-xs">Gender distribution forArtisan & Intending Artisan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] mb-4"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}a
            />
            <Pie
              data={genderData.artisanUser}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {genderData.artisanUser.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
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

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={genderData.intendingArtisan}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {genderData.intendingArtisan.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Intending Artisan
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      
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
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [genderData, setGenderData] = useState({
//     artisanUser: [],
//     intendingArtisan: [],
//   });
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (response.data.success) {
//           const gender = response.data.data?.[0]?.genderDistribution;

//           console.log("gender: ", gender);

//           // Process gender distribution data for Artisan Users
//           const artisanUserGenderData = [
//             { name: "Male", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "male")?.count || 0, fill: genderColors.male },
//             { name: "Female", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "female")?.count || 0, fill: genderColors.female },
//             { name: "Other", value: gender.find(item => item._id.role === "artisan_user" && item._id.gender === "")?.count || 0, fill: genderColors.other },
//           ];

//           // Process gender distribution data for Intending Artisans
//           const intendingArtisanGenderData = [
//             { name: "Male", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "male")?.count || 0, fill: genderColors.male },
//             { name: "Female", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "female")?.count || 0, fill: genderColors.female },
//             { name: "Other", value: gender.find(item => item._id.role === "intending_artisan" && item._id.gender === "")?.count || 0, fill: genderColors.other },
//           ];

//           // Update state with both data sets
//           setGenderData({
//             artisanUser: artisanUserGenderData,
//             intendingArtisan: intendingArtisanGenderData,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [accessToken, API_BASE_URL]);

//   const totalVisitors = useMemo(() => {
//     const totalArtisanUser = genderData.artisanUser.reduce((acc, curr) => acc + curr.value, 0);
//     const totalIntendingArtisan = genderData.intendingArtisan.reduce((acc, curr) => acc + curr.value, 0);
//     return totalArtisanUser + totalIntendingArtisan;
//   }, [genderData]);

//   return (
//     <><div>
//       <Card className="flex flex-col">
//         <CardHeader className="items-center pb-0">
//           <CardTitle>Intending Artisan</CardTitle>
//           <CardDescription>Gender distribution for Intending Artisan</CardDescription>
//         </CardHeader>
//         <CardContent className="flex-1 pb-0">

//           <ChartContainer
//             config={chartConfig}
//             className="mx-auto aspect-square max-h-[250px]"
//           >
//             <CardTitle>Intending Artisan</CardTitle>
//             <PieChart>
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent hideLabel />} />
//               <Pie
//                 data={genderData.intendingArtisan}
//                 dataKey="value"
//                 nameKey="name"
//                 innerRadius={60}
//                 strokeWidth={5}
//               >
//                 <Label
//                   content={({ viewBox }) => {
//                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle"
//                         >
//                           <tspan
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             className="fill-foreground text-3xl font-bold"
//                           >
//                             {genderData.intendingArtisan.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 24}
//                             className="fill-muted-foreground"
//                           >
//                             Intending Artisan
//                           </tspan>
//                         </text>
//                       );
//                     }
//                   } } />
//               </Pie>
//             </PieChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//     </div>
//     <div>
//         <Card className="flex flex-col">
//           <CardHeader className="items-center pb-0">
//             <CardTitle>Artisan</CardTitle>
//             <CardDescription>Gender distribution for Artisan </CardDescription>
//           </CardHeader>
//           <CardContent className="flex-1 pb-0">
//             <ChartContainer
//               config={chartConfig}
//               className="mx-auto aspect-square max-h-[250px] mb-8"
//             >
//               <CardTitle>Artisan</CardTitle>
//               <PieChart>
//                 <ChartTooltip
//                   cursor={false}
//                   content={<ChartTooltipContent hideLabel />} a />
//                 <Pie
//                   data={genderData.artisanUser}
//                   dataKey="value"
//                   nameKey="name"
//                   innerRadius={60}
//                   strokeWidth={5}
//                 >
//                   <Label
//                     content={({ viewBox }) => {
//                       if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                         return (
//                           <text
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             textAnchor="middle"
//                             dominantBaseline="middle"
//                           >
//                             <tspan
//                               x={viewBox.cx}
//                               y={viewBox.cy}
//                               className="fill-foreground text-3xl font-bold"
//                             >
//                               {genderData.artisanUser.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
//                             </tspan>
//                             <tspan
//                               x={viewBox.cx}
//                               y={(viewBox.cy || 0) + 24}
//                               className="fill-muted-foreground"
//                             >
//                               Artisan
//                             </tspan>
//                           </text>
//                         );
//                       }
//                     } } />
//                 </Pie>
//               </PieChart>
//             </ChartContainer>
//           </CardContent>
//         </Card>

//       </div></>

//   );
// }
