import React from "react"
import Badge from "@/components/atoms/Badge"
import { getStatusColor } from "@/utils/formatters"

const StatusBadge = ({ status, ...props }) => {
  const getVariant = (status) => {
    switch (status) {
      case "approved":
      case "paid":
      case "matched":
        return "success"
      case "pending":
      case "sent":
      case "unmatched":
        return "warning"
      case "draft":
        return "default"
      case "overdue":
        return "error"
      default:
        return "default"
    }
  }

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Badge variant={getVariant(status)} {...props}>
      {formatStatus(status)}
    </Badge>
  )
}

export default StatusBadge