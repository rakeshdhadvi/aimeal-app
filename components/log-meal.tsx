"use client"
import { useRef, useState } from "react";


import { MobileLayout } from "./mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CameraModal } from "./camera-modal"
import { FoodSearch } from "./food-search"
import { MealCalendar } from "@/components/meal-calendar"

import type { FoodItem } from "@/lib/food-database"

export function LogMeal() {
  const [activeTab, setActiveTab] = useState("breakfast")
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      console.log("User selected a meal photo:", file);
      // You can pass this file to your AI food recognition later
    }
  };

  const mealTabs = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snacks", label: "Snacks" },
  ]

  const recentMeals = [
    {
      name: "Oatmeal with berries",
      calories: 320,
      time: "Yesterday",
      image: "/food/oatmeal.jpg",
    },
    {
      name: "Greek yogurt with honey",
      calories: 180,
      time: "2 days ago",
      image: "/food/yogurt.jpg",
    },
    {
      name: "Avocado toast",
      calories: 290,
      time: "3 days ago",
      image: "/food/avocado-toast.jpg",
    },
    {
      name: "Protein smoothie",
      calories: 210,
      time: "4 days ago",
      image: "/food/smoothie.jpg",
    },
  ]
  const aiInsights = [
    "Late dinner detected on Wednesday — may impact sleep quality.",
    "Your average protein intake this week is 12g below target.",
    "Great job staying consistent with breakfast timing!",
  ]
  

  

  const handleFoodSelected = (food: FoodItem) => {
    setSelectedFoods((prev) => [...prev, food])
    setError(null)
  }

  const handleOpenCameraModal = () => {
    try {
      setCameraModalOpen(true)
    } catch (error) {
      console.error("Error opening camera modal:", error)
      setError("Could not access camera. Please check permissions.")
    }
  }

  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Log Meal</h1>
          <p className="text-muted-foreground">Track your food intake</p>
        </div>

        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

        <Tabs defaultValue="breakfast" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            {mealTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {mealTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Type food or scan barcode"
                  className="pl-9 pr-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={handleOpenCameraModal}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span>Snap a Meal</span>
              </Button>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />

              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Meal"
                  className="mt-4 w-full rounded-lg"
                />
              )}

              <Card className="bg-accent border-none">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-primary">AI Suggestion</h3>
                      <p className="text-sm mt-1">Try grilled tofu + salad for a protein-rich, low-calorie option.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <FoodSearch onFoodSelected={handleFoodSelected} />

              {selectedFoods.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Selected Foods</h3>
                  {selectedFoods.map((food, index) => (
                    <Card key={`${food.id}-${index}`} className="border-none shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{food.name}</p>
                            <p className="text-xs text-muted-foreground">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                          </div>
                          <div className="text-sm">{food.calories} kcal</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Recent Meals</h3>
                {recentMeals.map((meal, index) => (
  <Card key={index} className="border-none shadow-sm">
    <CardContent className="p-3 flex items-center gap-3">
      <img
        src={meal.image}
        alt={meal.name}
        className="w-12 h-12 rounded-md object-cover border"
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{meal.name}</p>
        <p className="text-xs text-muted-foreground">{meal.time}</p>
      </div>
      <div className="text-sm">{meal.calories} kcal</div>
    </CardContent>
  </Card>
))}

<div className="mt-6">
  <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI Insights</h3>
  <ul className="space-y-2 text-sm text-muted-foreground">
    {aiInsights.map((insight, idx) => (
      <li key={idx} className="flex items-start gap-2">
        <span className="text-primary mt-0.5">•</span>
        <span>{insight}</span>
      </li>
    ))}
  </ul>
</div>


              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <CameraModal open={cameraModalOpen} onOpenChange={setCameraModalOpen} onFoodDetected={handleFoodSelected} />
    </MobileLayout>
  )
}
