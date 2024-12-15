// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// export default function RecentRegistrations() {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [registrations, setRegistrations] = useState([]);
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (response.data.success) {
//           // Extract and transform relevant data
//           const profileCompleteness = response.data.data.profileCompleteness;

//           const transformedData = profileCompleteness.map((item, index) => ({
//             id: index + 1, // Provide a unique key for each item
//             role: item._id.role,
//             hasBankAccount: item._id.hasBankAccount,
//             hasEducation: item._id.hasEducation,
//             hasExperience: item._id.hasExperience,
//             hasProfileImage: item._id.hasProfileImage,
//             count: item.count,
//           }));

//           setRegistrations(transformedData.slice(0, 4)); // Limit to top 4 entries
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Registrations</h2>
//       <ul className="divide-y divide-gray-200">
//         {registrations.map((reg) => (
//           <li key={reg.id} className="py-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {`Role: ${reg.role}`}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Profile Completed: {reg.hasBankAccount && reg.hasEducation && reg.hasExperience && reg.hasProfileImage ? 'Yes' : 'No'}
//                 </p>
//               </div>
//               <div className="inline-flex items-center text-base font-semibold text-emerald-600">
//                 {`Count: ${reg.count}`}
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




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

export default function RecentRegistrations() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [chartData, setChartData] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          const profileCompleteness = response.data.data?.[0]?.profileCompleteness;

          // Aggregate the visitors based on profile completion status
          let completedCount = 0;
          let notCompletedCount = 0;

          profileCompleteness.forEach((item) => {
            const allFieldsCompleted =
              item._id.hasBankAccount &&
              item._id.hasEducation &&
              item._id.hasExperience &&
              item._id.hasProfileImage;

            if (allFieldsCompleted) {
              completedCount += item.count;
            } else {
              notCompletedCount += item.count;
            }
          });

          // Set the aggregated data for the pie chart
          setChartData([
            {
              name: chartConfig.profileCompleted.label,
              value: completedCount,
              fill: chartConfig.profileCompleted.color,
            },
            {
              name: chartConfig.notCompleted.label,
              value: notCompletedCount,
              fill: chartConfig.notCompleted.color,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [accessToken, API_BASE_URL]);

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Registrations</CardTitle>
        <CardDescription>Recent User Registrations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
              data={chartData}
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Registered
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      
      </CardFooter>
    </Card>
  );
}
