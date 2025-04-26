"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MobileLayout } from "./mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalorieRing } from "./calorie-ring"
import { Droplet, Footprints, Utensils, Edit, Plus, Trash2 } from "lucide-react"
import { useMeals, type Meal } from "@/context/meal-context"
import { Button } from "@/components/ui/button"
import { MealEditor } from "./meal-editor"

export function Dashboard() {
  const { recentMeals, totalCaloriesToday, removeMeal } = useMeals()
  const [currentDate, setCurrentDate] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("Good day")
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [isAddingMeal, setIsAddingMeal] = useState(false)

  // Set current date and greeting
  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }))

    const hour = now.getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  // Get today's meals
  const todaysMeals = recentMeals.filter((meal) => meal.date === new Date().toISOString().split("T")[0]).slice(0, 3) // Show only the 3 most recent meals

  // Handle edit meal
  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal)
  }

  // Handle delete meal
  const handleDeleteMeal = (id: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      removeMeal(id)
    }
  }

  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{greeting}, Alex ☀️</h1>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <CalorieRing consumed={totalCaloriesToday} goal={2000} className="w-52 h-52" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <QuickStatCard
            icon={<Footprints className="h-5 w-5 text-blue-500" />}
            label="Steps"
            value="7,842"
            goal="10,000"
            progress={78}
          />
          <QuickStatCard
            icon={<Utensils className="h-5 w-5 text-amber-500" />}
            label="Protein"
            value="65g"
            goal="120g"
            progress={54}
          />
          <QuickStatCard
            icon={<Droplet className="h-5 w-5 text-sky-500" />}
            label="Water"
            value="1.2L"
            goal="2.5L"
            progress={48}
          />
        </div>

        <Card className="bg-accent border-none">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="font-medium text-sm text-primary">AI Tip of the Day</h3>
                <p className="text-sm mt-1">
                  Adding more fiber to your breakfast can help you feel fuller longer and improve digestion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Recent Meals</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsAddingMeal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {todaysMeals.length === 0 ? (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No meals logged today</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsAddingMeal(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Your First Meal
              </Button>
            </div>
          ) : (
            todaysMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={() => handleEditMeal(meal)}
                onDelete={() => handleDeleteMeal(meal.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Meal Editor Modal */}
      {editingMeal && <MealEditor meal={editingMeal} isOpen={!!editingMeal} onClose={() => setEditingMeal(null)} />}

      {/* Add Meal Modal */}
      <MealEditor isOpen={isAddingMeal} onClose={() => setIsAddingMeal(false)} />
    </MobileLayout>
  )
}

interface QuickStatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  goal: string
  progress: number
}

function QuickStatCard({ icon, label, value, goal, progress }: QuickStatCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-secondary p-2 rounded-full">{icon}</div>
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="font-semibold">{value}</span>
          <Progress value={progress} className="h-1.5 w-full" />
          <span className="text-xs text-muted-foreground">Goal: {goal}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface MealCardProps {
  meal: Meal
  onEdit: () => void
  onDelete: () => void
}

function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">{meal.time}</span>
              <span className="text-sm font-medium">{meal.title}</span>
            </div>
            <p className="text-sm mt-1">{meal.description}</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-sm font-medium mr-2">{meal.calories} kcal</div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
