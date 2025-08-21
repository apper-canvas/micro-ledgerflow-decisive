import React from "react"
import KPICard from "@/components/molecules/KPICard"
import { formatCurrency } from "@/utils/formatters"

const DashboardStats = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm border">
            <div className="shimmer h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="shimmer h-8 bg-slate-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Cash Position"
        value={data?.cashPosition || 0}
        type="currency"
        change={data?.cashChange}
        trend={data?.cashTrend}
        icon="Wallet"
        gradient
      />
      
      <KPICard
        title="Monthly Revenue"
        value={data?.monthlyRevenue || 0}
        type="currency"
        change={data?.revenueChange}
        trend={data?.revenueTrend}
        icon="TrendingUp"
        gradient
      />
      
      <KPICard
        title="Outstanding AR"
        value={data?.accountsReceivable || 0}
        type="currency"
        change={data?.arChange}
        trend={data?.arTrend}
        icon="FileText"
      />
      
      <KPICard
        title="Pending AP"
        value={data?.accountsPayable || 0}
        type="currency"
        change={data?.apChange}
        trend={data?.apTrend}
        icon="CreditCard"
      />
    </div>
  )
}

export default DashboardStats