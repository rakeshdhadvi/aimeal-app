import type React from "react"
import { cn } from "@/lib/utils"
import { MobileNav } from "./mobile-nav"

interface MobileLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div
        className={cn(
          "relative w-full max-w-md h-[812px] bg-background rounded-[40px] overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800",
          className,
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-6 flex justify-center items-center z-10">
          <div className="w-32 h-[18px] bg-gray-800 dark:bg-gray-300 rounded-b-xl"></div>
        </div>
        <div className="h-full pt-8 pb-20 overflow-y-auto">{children}</div>
        <MobileNav />
      </div>
    </div>
  )
}
