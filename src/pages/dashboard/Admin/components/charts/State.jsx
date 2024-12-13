import React, { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

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

import { fetchUserDist } from '../../../../../services/api'; // Assuming api.js is in the same directory
import { Label } from '@/components/ui/label';

const chartConfig = {
  desktop: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
};

function State() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const distribution = await fetchUserDist();
      const data = Object.entries(distribution).map(([state, count], index) => ({
        state,
        count: count.artisan_users + count.intending_artisans, // Combine artisans and intending artisans
        key: `${state}-${count.artisan_users + count.intending_artisans}`, // Use state and count for uniqueness
      }));
      setChartData(data);
    };
  
    fetchData();
  }, []);
  

  // Ensure chartData has at least one item before attempting to find mostUsersState
  const mostUsersState = chartData.length
    ? chartData.reduce((maxState, currentState) =>
        currentState.count > maxState.count ? currentState : maxState
      )
    : { state: "N/A", count: 0 }; // Default to a placeholder if chartData is empty

  return (
    // <div>
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Total Artisan | Intending Artisan Distribution by State</CardTitle>
    //       <CardDescription className="text-xs">Artisan & Intending Artisans</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <ChartContainer config={chartConfig}>
    //         <BarChart
    //           color
    //           accessibilityLayer
    //           data={chartData}
    //           layout="vertical"
    //           width={500}
    //           margin={{
    //             left: 0,
    //           }}
    //           barGap={0} // Reduce space between bars
    //           barCategoryGap="10%" // Reduce category gap
    //         >
    //           <XAxis type="number" dataKey="count" hide />
    //           <YAxis
    //             dataKey="state"
    //             type="category"
    //             tickLine={false}
    //             tickMargin={15}
    //             axisLine={false}
    //           />
    //           <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    //           <Bar dataKey="count" fill="#50C878" radius={10} barSize={30} >
    //             <LabelList
    //                 dataKey="state"
    //                 position="insideLeft"
    //                 offset={8}
    //                 className="fill-[--color-label]"
    //                 fontSize={12}

    //             />
    //             <LabelList
    //                 dataKey="count"
    //                 position="right"
    //                 offset={8}
    //                 className="fill-foreground"
    //                 fontSize={12}
    //             />
    //             </Bar>
    //         </BarChart>
    //       </ChartContainer>
    //     </CardContent>
    //     <CardFooter className="flex-col items-start gap-2 text-xs">
    //       <div className="flex gap-2 font-medium text-emerald-600 leading-none">
    //         <div className="flex gap-2 font-medium leading-none">
    //           <p>Most users are from: {mostUsersState.state}</p>
    //           <p>
    //             Total Users: {chartData.reduce((acc, curr) => acc + curr.count, 0) || 0}
    //           </p>
    //         </div>
    //       </div>
    //       <div className="leading-none text-xs text-slate-600 text-muted-foreground">
    //         Showing total Artisan / Intending Artisan by state
    //       </div>
    //     </CardFooter>
    //   </Card>
    // </div>
    <div className="flex flex-col">
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Total Artisan | Intending Artisan Distribution by State</CardTitle>
      <CardDescription className="text-xs">
        Artisan & Intending Artisans
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          width={700}
          height={Math.max(300, chartData.length * 80)}
          margin={{
            left: 15,
          }}
          barGap={0}
          barCategoryGap="10%"
        >
          <XAxis 
            type="number" 
            dataKey="count" 
            hide
            tick={{ fontSize: 8 }}/>

          <YAxis
            dataKey="state"
            type="category"
            tickLine={false}
            tickMargin={0}
            axisLine={false}
            tick={{ fontSize: 8 }} // Reduce font size for X-axis ticks
            
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="#50C878" radius={10} barSize={80}>
            {/* <LabelList
              dataKey="state"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label]"
              fontSize={12}
            />
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            /> */}
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-xs">
      <div className="flex gap-2 font-medium text-emerald-600 leading-none">
        <p>Most Trainnee are from: {mostUsersState.state}</p>
        <p>
          Total Trainnee: {chartData.reduce((acc, curr) => acc + curr.count, 0) || 0}
        </p>
      </div>
      <div className="leading-none text-xs text-slate-600 text-muted-foreground">
        Showing total Artisan / Intending Artisan by state
      </div>
    </CardFooter>
  </Card>
</div>

  );
}

export default State;
