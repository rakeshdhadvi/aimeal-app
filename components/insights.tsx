"use client"

import { MobileLayout } from "./mobile-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export function Insights() {
  // Weekly calorie data
  const calorieData = [
    { day: "Mon", calories: 1850 },
    { day: "Tue", calories: 1750 },
    { day: "Wed", calories: 2100 },
    { day: "Thu", calories: 1900 },
    { day: "Fri", calories: 2300 },
    { day: "Sat", calories: 2000 },
    { day: "Sun", calories: 1800 },
  ]

  // Macro data for pie chart
  const macroData = [
    { name: "Carbs", value: 50, color: "#10b981" },
    { name: "Protein", value: 30, color: "#3b82f6" },
    { name: "Fat", value: 20, color: "#f59e0b" },
  ]

  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Insights & Goals</h1>
          <p className="text-muted-foreground">Track your progress</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Calorie Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <Chart
                data={calorieData}
                dataKey="calories"
                categories={["calories"]}
                colors={["hsl(var(--primary))"]}
                valueFormatter={(value) => `${value} kcal`}
                startEndOnly
                showXAxis
                showYAxis
                showTooltip
              >
                <ChartContainer>
                  <ChartYAxis />
                  <ChartXAxis dataKey="day" />
                  <ChartArea />
                  <ChartBar />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                </ChartContainer>
              </Chart>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Macronutrient Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {macroData.map((macro, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-sm">
                      {macro.name}: {macro.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent border-none">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="text-xl">🔍</span>
              </div>
              <div>
                <h3 className="font-medium text-sm text-primary">AI Insight</h3>
                <p className="text-sm mt-1">
                  You tend to overeat on Fridays. Try planning your meals ahead for better control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Adjust Your Goals</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full justify-start">
              <span>Calorie Goal</span>
              <span className="ml-auto text-muted-foreground">2000</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>Protein Goal</span>
              <span className="ml-auto text-muted-foreground">120g</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>Carbs Goal</span>
              <span className="ml-auto text-muted-foreground">250g</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>Fat Goal</span>
              <span className="ml-auto text-muted-foreground">65g</span>
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
