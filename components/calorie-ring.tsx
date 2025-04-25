import { cn } from "@/lib/utils"

interface CalorieRingProps {
  consumed: number
  goal: number
  className?: string
}

export function CalorieRing({ consumed, goal, className }: CalorieRingProps) {
  const percentage = Math.min(Math.round((consumed / goal) * 100), 100)
  const circumference = 2 * Math.PI * 70 // 70 is the radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-full h-full" viewBox="0 0 160 160">
        {/* Background circle */}
        <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" />

        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold">{consumed}</span>
        <span className="text-sm text-muted-foreground">of {goal} kcal</span>
        <span className="text-xs mt-1 font-medium text-primary">{percentage}%</span>
      </div>
    </div>
  )
}
