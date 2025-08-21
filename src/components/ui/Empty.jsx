import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className, 
  icon = "Inbox", 
  title = "No data found", 
  message = "There's nothing here yet. Get started by adding some data.", 
  action, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-slate-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {message}
      </p>
      
      {action}
      {children}
    </div>
  )
}

export default Empty