import { format, parseISO, isValid } from "date-fns"

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number)
}

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(1)}%`
}

export const formatDate = (date, formatString = "MMM dd, yyyy") => {
  if (!date) return ""
  
  const dateObj = typeof date === "string" ? parseISO(date) : date
  
  if (!isValid(dateObj)) return ""
  
  return format(dateObj, formatString)
}

export const formatDateTime = (date) => {
  return formatDate(date, "MMM dd, yyyy 'at' h:mm a")
}

export const formatRelativeDate = (date) => {
  if (!date) return ""
  
  const dateObj = typeof date === "string" ? parseISO(date) : date
  const now = new Date()
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  
  return formatDate(dateObj)
}

export const getStatusColor = (status) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    matched: "bg-green-100 text-green-700",
    unmatched: "bg-yellow-100 text-yellow-700",
  }
  
  return statusColors[status] || "bg-gray-100 text-gray-700"
}