import React, { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  // Filter children to ensure only valid select children are rendered
  const validChildren = React.Children.toArray(children).filter(child => {
    if (typeof child === 'string' || typeof child === 'number') return false;
    if (!React.isValidElement(child)) return false;
    const childType = child.type;
    return childType === 'option' || childType === 'optgroup' || 
           (typeof childType === 'string' && (childType === 'option' || childType === 'optgroup'));
  });

  return (
    <div className="relative">
<select
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all duration-200",
          error && "border-red-300 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {validChildren.length > 0 ? validChildren : children}
      </select>
      <ApperIcon 
        icon="chevron-down" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
};
Select.displayName = "Select"

export default Select