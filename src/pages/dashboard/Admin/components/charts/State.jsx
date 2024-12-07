import React, { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

import { fetchUserDistribution } from '../../../../../services/api'; // Assuming api.js is in the same directory

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
      const distribution = await fetchUserDistribution();
      const data = Object.entries(distribution).map(([state, count]) => ({
        state,
        count: count.artisan_users + count.intending_artisans, // Combine artisans and intending artisans
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Artisan | Intending Artisan Distribution by State</CardTitle>
          <CardDescription className="text-xs">Artisan & Intending Artisans</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              color
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <XAxis type="number" dataKey="count" hide />
              <YAxis
                dataKey="state"
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#50C878" radius={10} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-xs">
          <div className="flex gap-2 font-medium text-emerald-600 leading-none">
            <div className="flex gap-2 font-medium leading-none">
              <p>Most users are from: {mostUsersState.state}</p>
              <p>
                Total Users: {chartData.reduce((acc, curr) => acc + curr.count, 0) || 0}
              </p>
            </div>
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
