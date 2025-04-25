"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { searchFoodByName, type FoodItem, commonFoods } from "@/lib/food-database"

interface FoodSearchProps {
  onFoodSelected: (food: FoodItem) => void
}

export function FoodSearch({ onFoodSelected }: FoodSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load common foods initially
  useEffect(() => {
    setResults(commonFoods)
  }, [])

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults(commonFoods)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchResult = await searchFoodByName(query)

      if (searchResult.items.length === 0) {
        // If no results from API, filter common foods
        const filteredCommonFoods = commonFoods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))

        setResults(filteredCommonFoods)

        if (filteredCommonFoods.length === 0) {
          setError("No foods found. Try a different search term.")
        }
      } else {
        setResults(searchResult.items)
      }
    } catch (error) {
      console.error("Error searching foods:", error)
      setError("Error searching foods. Please try again.")
      setResults(commonFoods)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)

    // Clear results if input is empty
    if (!e.target.value.trim()) {
      setResults(commonFoods)
      setError(null)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-9 pr-20"
        />
        <Button
          size="sm"
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {results.map((food) => (
          <Card
            key={food.id}
            className="border-none shadow-sm cursor-pointer hover:bg-accent"
            onClick={() => onFoodSelected(food)}
          >
            <CardContent className="p-3 flex items-center space-x-3">
              {food.image_url && (
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={food.image_url || "/placeholder.svg"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{food.name}</p>
                {food.brand && <p className="text-xs text-muted-foreground truncate">{food.brand}</p>}
                <p className="text-sm">
                  <span className="font-medium">{food.calories}</span> kcal
                  {food.serving_size && (
                    <span className="text-xs text-muted-foreground ml-1">per {food.serving_size}</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
