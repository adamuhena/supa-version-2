"use client"

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ArtisanDistributionChart() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");
  const [chartData, setChartData] = useState([]);
  const [activeChart, setActiveChart] = useState("artisan_user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    async function fetchDistributionData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/artisan-distribution`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const distributionData = response.data.data;

        if (Array.isArray(distributionData)) {
          const formattedData = distributionData.map((item) => ({
            date: item.date,
            artisan_user: item.artisan_user,
            intending_artisan: item.intending_artisan,
          }));

          setChartData(formattedData);
        } else {
          console.error("Expected response data to be an array, but received:", distributionData);
        }
      } catch (error) {
        console.error("Error fetching distribution data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDistributionData();
  }, [accessToken]);

  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const total = useMemo(() => ({
    artisan_user: chartData.reduce((acc, curr) => acc + (curr.artisan_user || 0), 0),
    intending_artisan: chartData.reduce((acc, curr) => acc + (curr.intending_artisan || 0), 0),
  }), [chartData]);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (!Array.isArray(chartData) || !chartData.length) {
    return <div>No chart data available</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Artisan Distribution Chart</CardTitle>
          <CardDescription>
            Distribution of artisan users and intending artisans over time
          </CardDescription>
        </div>
        <div className="flex">
          {["artisan_user", "intending_artisan"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {key === "artisan_user" ? "Artisan Users" : "Intending Artisans"}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer className="aspect-auto h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <Tooltip
              content={<ChartTooltipContent nameKey={activeChart} labelFormatter={formatDate} />}
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
