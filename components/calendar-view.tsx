"use client"

import { useState } from "react"
import { MobileLayout } from "./mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  // Sample data for logged meals
  const mealData: Record<
  string,
  { calories: number; meals: { name: string; protein: number; carbs: number; fat: number }[] }
> = {
  "2023-05-14": {
    calories: 1850,
    meals: [
      { name: "Oatmeal with berries", protein: 8, carbs: 40, fat: 5 },
      { name: "Grilled chicken salad", protein: 30, carbs: 10, fat: 12 },
      { name: "Salmon with vegetables", protein: 35, carbs: 8, fat: 20 },
    ],
  },
  "2023-05-15": {
    calories: 1750,
    meals: [
      { name: "Protein smoothie", protein: 25, carbs: 15, fat: 5 },
      { name: "Turkey sandwich", protein: 20, carbs: 30, fat: 10 },
      { name: "Vegetable stir-fry", protein: 10, carbs: 20, fat: 8 },
    ],
  },
  "2023-05-16": {
    calories: 2100,
    meals: [
      { name: "Avocado toast", protein: 10, carbs: 25, fat: 15 },
      { name: "Quinoa bowl", protein: 15, carbs: 35, fat: 10 },
      { name: "Pasta with tomato sauce", protein: 12, carbs: 50, fat: 8 },
    ],
  },
};

  
  // Get month name and year
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  
  // Previous and next month handlers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Selected day state
  const [selectedDay, setSelectedDay] = useState<string | null>("2023-05-14");
  
  // Format date for lookup
  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Calendar days array
  const calendarDays = [];
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const dateKey = formatDateKey(year, currentMonth.getMonth(), dayNumber);
      const hasData = dateKey in mealData;
      
      calendarDays.push({
        day: dayNumber,
        isCurrentMonth: true,
        hasData,
        dateKey
      });
    } else {
      calendarDays.push({
        day: dayNumber <= 0 ? dayNumber + new Date(year, currentMonth.getMonth(), 0).getDate() : dayNumber - daysInMonth,
        isCurrentMonth: false,
        hasData: false,
        dateKey: ""
      });
    }
  }

  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View your meal history</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-medium">
                {monthName} {year}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center rounded-md text-sm ${
                    day.isCurrentMonth 
                      ? day.dateKey === selectedDay
                        ? "bg-primary text-primary-foreground"
                        : day.hasData
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                      : "text-muted-foreground opacity-50"
                  }`}
                  onClick={() => day.hasData && setSelectedDay(day.dateKey)}
                  disabled={!day.hasData}
                >
                  <span>{day.day}</span>
                  {day.hasData && (
                    <span className="w-1 h-1 rounded-full bg-current mt-1"></span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <span className="text-sm font-medium">Week Avg: 1800 kcal</span>
        </div>

        {selectedDay && mealData[selectedDay] && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Meals for {selectedDay}</h2>
              <span className="text-sm font-medium">{mealData[selectedDay].calories} kcal</span>
            </div>
            
            {mealData[selectedDay].meals.map((meal, index) => (
  <Card key={index} className="border-none shadow-sm">
    <CardContent className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{meal.name}</p>
          <p className="text-xs text-muted-foreground">
            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
))}

          </div>
        )}
      </div>
    </MobileLayout>
  );
}
