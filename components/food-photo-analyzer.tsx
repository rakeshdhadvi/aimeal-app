"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { type FoodItem } from "@/lib/food-database";

// Fallback: Mock AI food detection
const mockAnalyzePhoto = async (file: File): Promise<FoodItem[]> => {
  console.log("Analyzing photo:", file.name);

  // Mock delay
  await new Promise((res) => setTimeout(res, 1500));

  return [
    {
      id: "1",
      name: "Grilled Chicken",
      brand: "",
      calories: 250,
      protein: 30,
      carbs: 0,
      fat: 10,
      image_url: "/mock/chicken.jpg",
      serving_size: "1 piece",
    },
    {
      id: "2",
      name: "Brown Rice",
      brand: "",
      calories: 215,
      protein: 5,
      carbs: 45,
      fat: 2,
      image_url: "/mock/rice.jpg",
      serving_size: "1 cup",
    },
  ]
  
};

export function FoodPhotoAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetectedFoods([]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const results = await mockAnalyzePhoto(selectedFile);
    setDetectedFoods(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Camera className="w-4 h-4" />
            Upload Meal Photo
          </label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />

          <Button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze Photo"}
          </Button>
        </CardContent>
      </Card>

      {detectedFoods.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Detected Foods</h3>
          {detectedFoods.map((food, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-3 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={food.image_url || "/placeholder.svg"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{food.name}</p>
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
      )}
    </div>
  );
}
