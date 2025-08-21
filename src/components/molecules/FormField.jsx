import React from "react"
import { cn } from "@/utils/cn"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"

const FormField = ({
  label,
  error,
  required,
  type = "input",
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id} className={required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
          {label}
        </Label>
      )}
      
{type === "input" && <Input error={error} {...props} />}
      {type === "select" && <Select error={error} {...props}>{children}</Select>}
      {type === "textarea" && (
        <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" {...props} />
      )}
      {type === "custom" && children}
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField