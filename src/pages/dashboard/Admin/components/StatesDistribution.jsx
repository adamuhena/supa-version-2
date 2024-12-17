"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { fetchUserDist } from "@/services/api"

const chartConfig = {
  artisan_users: {
    label: "Artisan Users",
    color: "hsl(var(--chart-1))", // Vibrant blue
  },
  intending_artisans: {
    label: "Intending Artisans",
    color: "hsl(var(--chart-2))", // Vibrant green
  },
}

const colorPalette = {
  artisan_users: [
    "hsl(210, 80%, 60%)",   // Bright Blue
    "hsl(210, 80%, 50%)",   // Slightly Darker Blue
    "hsl(210, 80%, 70%)",   // Lighter Blue
  ],
  intending_artisans: [
    "hsl(130, 70%, 60%)",   // Bright Green
    "hsl(130, 70%, 50%)",   // Slightly Darker Green
    "hsl(130, 70%, 70%)",   // Lighter Green
  ]
}

export function StateDistribution() {
  const [activeChart, setActiveChart] = React.useState("artisan_users")
  const [chartData, setChartData] = React.useState([])

  // Fetch user distribution data when component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dist = await fetchUserDist()
        const formattedData = Object.entries(dist).map(([state, counts], index) => ({
          state,
          artisan_users: counts.artisan_users,
          intending_artisans: counts.intending_artisans,
          fill: activeChart === 'artisan_users' 
            ? colorPalette.artisan_users[index % colorPalette.artisan_users.length]
            : colorPalette.intending_artisans[index % colorPalette.intending_artisans.length]
        }))
        setChartData(formattedData)
      } catch (error) {
        console.error("Error fetching user distribution:", error)
      }
    }

    fetchData()
  }, [activeChart])

  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        acc.artisan_users += curr.artisan_users
        acc.intending_artisans += curr.intending_artisans
        return acc
      },
      { artisan_users: 0, intending_artisans: 0 }
    )
  }, [chartData])

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl">State-wise Artisan Distribution</CardTitle>
          <CardDescription>Detailed breakdown of artisan and intending artisans by state</CardDescription>
        </div>
        <div className="flex">
          {["artisan_users", "intending_artisans"].map((key) => {
            const chart = key
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left 
                  even:border-l 
                  data-[active=true]:bg-muted/50 
                  hover:bg-accent/20 
                  transition-colors duration-200 
                  sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer 
          config={chartConfig} 
          className="aspect-[16/9] h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 20,
              right: 20,
              bottom: 10
            }}
          >
            <CartesianGrid 
              vertical={false} 
              stroke="hsl(var(--muted))" 
              strokeDasharray="3 3" 
            />
            <XAxis
              dataKey="state"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              className="text-sm"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${value}`} 
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white shadow-lg p-4 rounded-lg border">
                      <p className="font-bold text-lg mb-2">{payload[0].payload.state}</p>
                      <div className="flex justify-between">
                        <span>Artisan Users:</span>
                        <span className="font-semibold">{payload[0].payload.artisan_users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intending Artisans:</span>
                        <span className="font-semibold">{payload[0].payload.intending_artisans}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey={activeChart} 
              fill={`var(--color-${activeChart})`} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}