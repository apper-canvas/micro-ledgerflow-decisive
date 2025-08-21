import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import DashboardStats from "@/components/organisms/DashboardStats"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import { formatCurrency, formatDate } from "@/utils/formatters"
import Chart from "react-apexcharts"
import transactionService from "@/services/api/transactionService"
import invoiceService from "@/services/api/invoiceService"
import bankTransactionService from "@/services/api/bankTransactionService"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const [transactions, invoices, bankTransactions] = await Promise.all([
        transactionService.getRecentActivity(5),
        invoiceService.getAll(),
        bankTransactionService.getAll()
      ])

      // Calculate KPIs
      const cashPosition = 25000 // Mock cash balance
      const monthlyRevenue = invoices
        .filter(inv => new Date(inv.date).getMonth() === new Date().getMonth())
        .reduce((sum, inv) => sum + inv.total, 0)

      const accountsReceivable = invoices
        .filter(inv => inv.status !== "paid")
        .reduce((sum, inv) => sum + inv.total, 0)

      const accountsPayable = 8500 // Mock AP balance

      const stats = {
        cashPosition,
        monthlyRevenue,
        accountsReceivable,
        accountsPayable,
        cashTrend: "up",
        revenueTrend: "up",
        arTrend: "down",
        apTrend: "neutral",
        cashChange: "+5.2%",
        revenueChange: "+12.5%",
        arChange: "-8.3%",
        apChange: "0%"
      }

      setDashboardData(stats)
      setRecentActivity([...transactions, ...invoices.slice(0, 3)])
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Chart configurations
  const cashFlowChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ["#2563eb"],
    grid: {
      show: false
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    }
  }

  const cashFlowSeries = [{
    name: "Cash Flow",
    data: [20000, 22000, 25000, 23000, 27000, 25000]
  }]

  const expenseBreakdownOptions = {
    chart: {
      type: "donut",
      height: 300
    },
    colors: ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"],
    labels: ["Operations", "Marketing", "Equipment", "Rent", "Other"],
    legend: {
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    }
  }

  const expenseBreakdownSeries = [35, 25, 20, 15, 5]

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="shimmer h-8 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="shimmer h-4 bg-slate-200 rounded w-96"></div>
        </div>
        <Loading variant="cards" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your financial overview"
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="ai" className="flex items-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 mr-1" />
              AI Active
            </Badge>
            <Button icon="Download" variant="outline">
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <DashboardStats data={dashboardData} loading={false} />

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Cash Flow Trend</h3>
            <Button variant="ghost" size="sm" icon="TrendingUp">
              View Details
            </Button>
          </div>
          <Chart
            options={cashFlowChartOptions}
            series={cashFlowSeries}
            type="area"
            height={300}
          />
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Expense Breakdown</h3>
            <Button variant="ghost" size="sm" icon="PieChart">
              View All
            </Button>
          </div>
          <Chart
            options={expenseBreakdownOptions}
            series={expenseBreakdownSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>

      {/* Recent Activity and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-slate-200">
            {recentActivity.slice(0, 6).map((item, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={item.number ? "FileText" : "Receipt"} 
                        className="w-4 h-4 text-primary-600" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.description || `Invoice ${item.number}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(item.total || 0)}
                    </p>
                    {item.status && (
                      <Badge variant="default" className="text-xs mt-1">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center mb-4">
            <ApperIcon name="Sparkles" className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">AI Insights</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium text-slate-900">Revenue Growth</span>
              </div>
              <p className="text-sm text-slate-700">
                Your monthly revenue increased by 12.5% compared to last month.
              </p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-medium text-slate-900">Cash Flow Alert</span>
              </div>
              <p className="text-sm text-slate-700">
                3 invoices are overdue. Consider sending payment reminders.
              </p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ApperIcon name="Target" className="w-4 h-4 text-blue-600 mr-2" />
                <span className="font-medium text-slate-900">Categorization</span>
              </div>
              <p className="text-sm text-slate-700">
                95% of transactions auto-categorized this month with 92% accuracy.
              </p>
            </div>
            
            <Button variant="secondary" className="w-full mt-4">
              View All Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary-600" />
                <span className="font-medium">New Invoice</span>
              </div>
              <p className="text-xs text-slate-500">Create and send invoice</p>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="Receipt" className="w-5 h-5 mr-2 text-primary-600" />
                <span className="font-medium">Add Transaction</span>
              </div>
              <p className="text-xs text-slate-500">Record new transaction</p>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="Link" className="w-5 h-5 mr-2 text-primary-600" />
                <span className="font-medium">Bank Sync</span>
              </div>
              <p className="text-xs text-slate-500">Import bank transactions</p>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-primary-600" />
                <span className="font-medium">Generate Report</span>
              </div>
              <p className="text-xs text-slate-500">Financial reports</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard