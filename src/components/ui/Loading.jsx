import { cn } from "@/utils/cn"

const Loading = ({ className, variant = "default", children, ...props }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)} {...props}>
        <div className="shimmer h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="shimmer h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="shimmer h-4 bg-slate-200 rounded w-2/3"></div>
        {children}
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)} {...props}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4 py-3">
            <div className="shimmer h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="shimmer h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="shimmer h-4 bg-slate-200 rounded w-1/5"></div>
            <div className="shimmer h-4 bg-slate-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)} {...props}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg p-6 shadow-sm border">
            <div className="shimmer h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="shimmer h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="shimmer h-8 bg-slate-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)} {...props}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-slate-600 text-sm font-medium">
          {children || "Loading..."}
        </div>
      </div>
    </div>
  )
}

export default Loading