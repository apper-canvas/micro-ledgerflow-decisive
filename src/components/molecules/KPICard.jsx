import React from "react"
import { cn } from "@/utils/cn"
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters"
import ApperIcon from "@/components/ApperIcon"

const KPICard = ({
  title,
  value,
  type = "currency", // currency, number, percentage
  change,
  trend, // up, down, neutral
  icon,
  className,
  gradient = false,
  ...props
}) => {
  const formatValue = (val) => {
    switch (type) {
      case "currency":
        return formatCurrency(val)
      case "number":
        return formatNumber(val)
      case "percentage":
        return formatPercentage(val)
      default:
        return val
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "TrendingUp"
      case "down":
        return "TrendingDown"
      default:
        return "Minus"
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-accent-600"
      case "down":
        return "text-red-600"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]",
        gradient && "bg-gradient-to-br from-white to-slate-50",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className={cn(
              "text-2xl font-bold",
              gradient ? "gradient-text" : "text-slate-900"
            )}>
              {formatValue(value)}
            </span>
            {change !== undefined && (
              <div className={cn("flex items-center text-sm font-medium", getTrendColor())}>
                <ApperIcon name={getTrendIcon()} className="w-4 h-4 mr-1" />
                {type === "percentage" ? `${change}%` : change}
              </div>
            )}
          </div>
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard