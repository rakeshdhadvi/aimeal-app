"use client"

import { Home, Calendar, BarChart2, User, Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BarChart2, label: "Insights", path: "/insights" },
    { icon: Plus, label: "", path: "/log-meal", primary: true },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-background border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-4">
      {navItems.map((item) => (
        <div key={item.path} className="flex flex-col items-center">
          {item.primary ? (
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => router.push(item.path)}>
              <item.icon className="h-6 w-6" />
            </Button>
          ) : (
            <button onClick={() => router.push(item.path)} className="flex flex-col items-center space-y-1">
              <item.icon className={cn("h-6 w-6", pathname === item.path ? "text-primary" : "text-muted-foreground")} />
              <span
                className={cn("text-xs", pathname === item.path ? "text-primary font-medium" : "text-muted-foreground")}
              >
                {item.label}
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
