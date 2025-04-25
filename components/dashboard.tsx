import type React from "react"
import { MobileLayout } from "./mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalorieRing } from "./calorie-ring"
import { Droplet, Footprints, Utensils } from "lucide-react"

export function Dashboard() {
  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Good Morning, Alex ☀️</h1>
            <p className="text-muted-foreground">Tuesday, May 14</p>
          </div>
        </div>

        <div className="flex justify-center">
          <CalorieRing consumed={1250} goal={2000} className="w-52 h-52" />
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
          <h2 className="font-semibold">Recent Meals</h2>
          <MealCard time="8:30 AM" title="Breakfast" description="Oatmeal with berries and honey" calories={320} />
          <MealCard time="12:15 PM" title="Lunch" description="Grilled chicken salad with avocado" calories={450} />
        </div>
      </div>
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
  time: string
  title: string
  description: string
  calories: number
}

function MealCard({ time, title, description, calories }: MealCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">{time}</span>
              <span className="text-sm font-medium">{title}</span>
            </div>
            <p className="text-sm mt-1">{description}</p>
          </div>
          <div className="text-sm font-medium">{calories} kcal</div>
        </div>
      </CardContent>
    </Card>
  )
}
