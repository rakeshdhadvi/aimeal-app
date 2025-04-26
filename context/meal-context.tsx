"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { FoodItem } from "@/lib/food-database"

export interface Meal {
  id: string
  time: string
  title: string
  description: string
  calories: number
  foods: FoodItem[]
  date: string
}

interface MealContextType {
  recentMeals: Meal[]
  addMeal: (meal: Omit<Meal, "id">) => void
  removeMeal: (id: string) => void
  updateMeal: (id: string, meal: Partial<Meal>) => void
  totalCaloriesToday: number
  loading: boolean
  error: string | null
}

const MealContext = createContext<MealContextType | undefined>(undefined)

export function useMeals() {
  const context = useContext(MealContext)
  if (context === undefined) {
    throw new Error("useMeals must be used within a MealProvider")
  }
  return context
}

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [recentMeals, setRecentMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load meals from localStorage on mount
  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem("aimeal-meals")
      if (storedMeals) {
        setRecentMeals(JSON.parse(storedMeals))
      } else {
        // Sample data for first-time users
        const sampleMeals: Meal[] = [
          {
            id: "1",
            time: "8:30 AM",
            title: "Breakfast",
            description: "Oatmeal with berries and honey",
            calories: 320,
            foods: [
              {
                id: "oatmeal-1",
                name: "Oatmeal with berries",
                calories: 320,
                protein: 8,
                carbs: 54,
                fat: 6,
                serving_size: "1 bowl (250g)",
              },
            ],
            date: new Date().toISOString().split("T")[0],
          },
          {
            id: "2",
            time: "12:15 PM",
            title: "Lunch",
            description: "Grilled chicken salad with avocado",
            calories: 450,
            foods: [
              {
                id: "chicken-salad-1",
                name: "Grilled chicken salad",
                calories: 350,
                protein: 30,
                carbs: 10,
                fat: 20,
                serving_size: "1 plate (300g)",
              },
              {
                id: "avocado-1",
                name: "Avocado",
                calories: 100,
                protein: 1,
                carbs: 5,
                fat: 10,
                serving_size: "1/2 medium (70g)",
              },
            ],
            date: new Date().toISOString().split("T")[0],
          },
        ]
        setRecentMeals(sampleMeals)
        localStorage.setItem("aimeal-meals", JSON.stringify(sampleMeals))
      }
    } catch (err) {
      console.error("Error loading meals from localStorage:", err)
      setError("Failed to load meal data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Save meals to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("aimeal-meals", JSON.stringify(recentMeals))
    }
  }, [recentMeals, loading])

  // Add a new meal
  const addMeal = (meal: Omit<Meal, "id">) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
    }
    setRecentMeals((prev) => [newMeal, ...prev])
  }

  // Remove a meal
  const removeMeal = (id: string) => {
    setRecentMeals((prev) => prev.filter((meal) => meal.id !== id))
  }

  // Update a meal
  const updateMeal = (id: string, updatedMeal: Partial<Meal>) => {
    setRecentMeals((prev) => prev.map((meal) => (meal.id === id ? { ...meal, ...updatedMeal } : meal)))
  }

  // Calculate total calories consumed today
  const totalCaloriesToday = recentMeals
    .filter((meal) => meal.date === new Date().toISOString().split("T")[0])
    .reduce((total, meal) => total + meal.calories, 0)

  const value = {
    recentMeals,
    addMeal,
    removeMeal,
    updateMeal,
    totalCaloriesToday,
    loading,
    error,
  }

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>
}
