"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Meal, useMeals } from "@/context/meal-context"
import type { FoodItem } from "@/lib/food-database"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"

interface MealEditorProps {
  meal?: Meal
  isOpen: boolean
  onClose: () => void
  initialFoods?: FoodItem[]
  initialTitle?: string
}

export function MealEditor({ meal, isOpen, onClose, initialFoods = [], initialTitle = "" }: MealEditorProps) {
  const { addMeal, updateMeal } = useMeals()
  const isEditing = !!meal

  const [title, setTitle] = useState(meal?.title || initialTitle)
  const [foods, setFoods] = useState<FoodItem[]>(meal?.foods || initialFoods)
  const [error, setError] = useState<string | null>(null)

  // Update foods when initialFoods changes
  useEffect(() => {
    if (!isEditing && initialFoods.length > 0) {
      setFoods(initialFoods)
    }
  }, [initialFoods, isEditing])

  // Update title when initialTitle changes
  useEffect(() => {
    if (!isEditing && initialTitle) {
      setTitle(initialTitle)
    }
  }, [initialTitle, isEditing])

  // Calculate total calories
  const totalCalories = foods.reduce((sum, food) => {
    const quantity = food.quantity || 1
    return sum + food.calories * quantity
  }, 0)

  // Generate description from foods
  const generateDescription = () => {
    if (foods.length === 0) return ""
    if (foods.length === 1) return foods[0].name
    if (foods.length === 2) return `${foods[0].name} and ${foods[1].name}`
    return `${foods[0].name}, ${foods[1].name}, and ${foods.length - 2} more`
  }

  // Handle food quantity change
  const handleQuantityChange = (index: number, change: number) => {
    const updatedFoods = [...foods]
    const currentQuantity = updatedFoods[index].quantity || 1
    const newQuantity = Math.max(0.25, currentQuantity + change)

    updatedFoods[index] = {
      ...updatedFoods[index],
      quantity: newQuantity,
    }

    setFoods(updatedFoods)
  }

  // Handle food removal
  const handleRemoveFood = (index: number) => {
    setFoods(foods.filter((_, i) => i !== index))
  }

  // Handle save
  const handleSave = () => {
    if (!title.trim()) {
      setError("Please enter a meal title")
      return
    }

    if (foods.length === 0) {
      setError("Please add at least one food item")
      return
    }

    const currentDate = new Date()
    const time = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (isEditing && meal) {
      updateMeal(meal.id, {
        title,
        foods,
        description: generateDescription(),
        calories: Math.round(totalCalories),
        time,
      })
    } else {
      addMeal({
        title,
        foods,
        description: generateDescription(),
        calories: Math.round(totalCalories),
        time,
        date: currentDate.toISOString().split("T")[0],
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Meal" : "Add Meal"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="title">Meal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Breakfast, Lunch, Dinner"
            />
          </div>

          <div className="space-y-2">
            <Label>Foods</Label>
            {foods.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center border rounded-md">
                No foods added yet. Add foods from the meal logging screen.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {foods.map((food, index) => (
                  <Card key={`${food.id}-${index}`} className="border-none shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">
                            P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, -0.25)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{food.quantity || 1}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, 0.25)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm w-16 text-right">
                            {Math.round((food.quantity || 1) * food.calories)} kcal
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveFood(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium">Total Calories:</span>
            <span className="text-lg font-bold">{Math.round(totalCalories)} kcal</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
