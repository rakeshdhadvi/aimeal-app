"use client"

import { useState } from "react"
import { MobileLayout } from "./mobile-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const calorieData = [
    { day: "Mon", calories: 1850 },
    { day: "Tue", calories: 1750 },
    { day: "Wed", calories: 2100 },
    { day: "Thu", calories: 1900 },
    { day: "Fri", calories: 2300 },
    { day: "Sat", calories: 2000 },
    { day: "Sun", calories: 1800 },
  ]

  const macroData = [
    { name: "Carbs", value: 50, color: "#10b981" },
    { name: "Protein", value: 30, color: "#3b82f6" },
    { name: "Fat", value: 20, color: "#f59e0b" },
  ]

  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65,
  })

  const [editingGoal, setEditingGoal] = useState<keyof typeof goals | null>(null)
  const [tempValue, setTempValue] = useState("")

  const goalLimits: Record<keyof typeof goals, { min: number; max: number; unit: string }> = {
    calories: { min: 1000, max: 6000, unit: "" },
    protein: { min: 20, max: 500, unit: "g" },
    carbs: { min: 50, max: 800, unit: "g" },
    fat: { min: 10, max: 200, unit: "g" },
  }

  const startEditing = (goalType: keyof typeof goals) => {
    setEditingGoal(goalType)
    setTempValue(goals[goalType].toString())
  }

  const saveGoal = () => {
    if (editingGoal) {
      const { min, max } = goalLimits[editingGoal]
      const value = parseInt(tempValue)
      if (!isNaN(value) && value >= min && value <= max) {
        setGoals(prev => ({
          ...prev,
          [editingGoal]: value,
        }))
        setEditingGoal(null)
      } else {
        alert(`Please enter a value between ${min} and ${max}`)
      }
    }
  }

  const cancelEdit = () => {
    setEditingGoal(null)
    setTempValue("")
  }

  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Insights & Goals</h1>
          <p className="text-muted-foreground">Track your progress</p>
        </div>

        {/* Weekly Calories */}
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

        {/* Macros Pie Chart */}
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

        {/* AI Insight */}
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

        {/* Adjustable Goals */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Adjust Your Goals</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(goals).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => startEditing(key as keyof typeof goals)}
                >
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)} Goal</span>
                  <span className="ml-auto text-muted-foreground">
                    {value}
                    {goalLimits[key as keyof typeof goals].unit}
                  </span>
                </Button>

                {editingGoal === key && (
                  <div className="space-y-2">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      type="number"
                      className="w-full text-lg p-3 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter your goal"
                    />
                    <div className="text-xs text-muted-foreground">
                      Allowed range: {goalLimits[key as keyof typeof goals].min} - {goalLimits[key as keyof typeof goals].max}{goalLimits[key as keyof typeof goals].unit}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={saveGoal}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
