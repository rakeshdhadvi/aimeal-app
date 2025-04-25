import type React from "react"

interface ChartProps {
  data: any[]
  dataKey: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showTooltip?: boolean
  children: React.ReactNode
}

export function Chart({
  data,
  dataKey,
  categories,
  colors,
  valueFormatter,
  startEndOnly,
  showXAxis,
  showYAxis,
  showTooltip,
  children,
}: ChartProps) {
  return <div className="relative">{children}</div>
}

interface ChartContainerProps {
  children: React.ReactNode
}

export function ChartContainer({ children }: ChartContainerProps) {
  return <>{children}</>
}

interface ChartTooltipProps {
  children: React.ReactNode
}

export function ChartTooltip({ children }: ChartTooltipProps) {
  return <>{children}</>
}

interface ChartTooltipContentProps {
  label?: string
  value?: number
}

export function ChartTooltipContent({ label, value }: ChartTooltipContentProps) {
  return (
    <div className="rounded-md border bg-popover p-2 text-sm shadow-sm">
      {label && <div className="font-medium">{label}</div>}
      {value && <div>{value}</div>}
    </div>
  )
}

type ChartAreaProps = {}

export function ChartArea({}: ChartAreaProps) {
  return null
}

type ChartLineProps = {}

export function ChartLine({}: ChartLineProps) {
  return null
}

interface ChartXAxisProps {
  dataKey?: string
}

export function ChartXAxis({ dataKey }: ChartXAxisProps) {
  return null
}

type ChartYAxisProps = {}

export function ChartYAxis({}: ChartYAxisProps) {
  return null
}

type ChartBarProps = {}

export function ChartBar({}: ChartBarProps) {
  return null
}
