import React, { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  placeholder,
  ...props 
}, ref) => {

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
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ApperIcon 
        icon="chevron-down" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;