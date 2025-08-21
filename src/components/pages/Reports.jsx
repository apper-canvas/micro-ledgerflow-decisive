import React, { useState } from "react"
import Header from "@/components/organisms/Header"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Chart from "react-apexcharts"

const Reports = () => {
  const [dateRange, setDateRange] = useState("month")
  const [reportType, setReportType] = useState("all")

  const reportTemplates = [
    {
      name: "Profit & Loss",
      description: "Income statement showing revenues and expenses",
      icon: "TrendingUp",
      color: "primary"
    },
    {
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity snapshot",
      icon: "BarChart3",
      color: "secondary"
    },
    {
      name: "Cash Flow Statement",
      description: "Operating, investing, and financing activities",
      icon: "DollarSign",
      color: "accent"
    },
    {
      name: "Trial Balance",
      description: "All account balances to verify entries",
      icon: "Scale",
      color: "primary"
    },
    {
      name: "Accounts Receivable Aging",
      description: "Outstanding customer invoices by age",
      icon: "Clock",
      color: "warning"
    },
    {
      name: "Accounts Payable Aging",
      description: "Outstanding vendor bills by age",
      icon: "CreditCard",
      color: "error"
    },
    {
      name: "Sales Tax Report",
      description: "GST/VAT collected and paid summary",
      icon: "Receipt",
      color: "secondary"
    },
    {
      name: "Budget vs Actual",
      description: "Compare actual performance to budget",
      icon: "Target",
      color: "accent"
    }
  ]

  // Chart configurations for dashboard metrics
  const revenueChartOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#2563eb", "#10b981"],
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    },
    legend: {
      position: "top"
    }
  }

  const revenueChartSeries = [
    {
      name: "Revenue",
      data: [45000, 52000, 48000, 58000, 65000, 72000]
    },
    {
      name: "Expenses",
      data: [32000, 38000, 35000, 42000, 48000, 52000]
    }
  ]

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
          size: "60%"
        }
      }
    }
  }

  const expenseBreakdownSeries = [35, 25, 20, 15, 5]

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Financial Reports"
        subtitle="Generate comprehensive financial reports and analytics"
        breadcrumb={["Reporting", "Financial Reports"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="ai" className="flex items-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 mr-1" />
              AI Insights
            </Badge>
            <Button variant="outline" icon="Calendar">
              Schedule Reports
            </Button>
            <Button icon="Download">
              Export All
            </Button>
          </div>
        }
      />

      {/* Report Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Report Type" type="select">
            <Select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="financial">Financial Statements</option>
              <option value="tax">Tax Reports</option>
              <option value="management">Management Reports</option>
            </Select>
          </FormField>
          
          <FormField label="Date Range" type="select">
            <Select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </Select>
          </FormField>
          
          <FormField label="From Date">
            <Input type="date" />
          </FormField>
          
          <FormField label="To Date">
            <Input type="date" />
          </FormField>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Revenue vs Expenses</h3>
            <Button variant="ghost" size="sm" icon="Download">
              Export
            </Button>
          </div>
          <Chart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="line"
            height={300}
          />
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Expense Breakdown</h3>
            <Button variant="ghost" size="sm" icon="Download">
              Export
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

      {/* AI Financial Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ApperIcon name="Sparkles" className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900">AI Financial Insights</h3>
              <p className="text-sm text-purple-700">Automated analysis and recommendations</p>
            </div>
          </div>
          <Button variant="secondary" icon="Settings">
            Customize
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-slate-900">Growth Trend</span>
            </div>
            <p className="text-sm text-slate-700 mb-2">
              Revenue increased 15% compared to last quarter
            </p>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-medium text-slate-900">Cash Flow Alert</span>
            </div>
            <p className="text-sm text-slate-700 mb-2">
              Consider extending payment terms for Q2
            </p>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Target" className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-slate-900">Budget Analysis</span>
            </div>
            <p className="text-sm text-slate-700 mb-2">
              Operating expenses 8% under budget
            </p>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      </div>

      {/* Report Templates Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Financial Reports</h3>
          <Button variant="outline" icon="Plus">
            Custom Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((report) => (
            <div key={report.name} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 bg-${report.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                  <ApperIcon name={report.icon} className={`w-5 h-5 text-${report.color}-600`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 text-sm">{report.name}</h4>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 mb-4">{report.description}</p>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button size="sm" className="flex-1">
                  <ApperIcon name="Download" className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Reports</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: "Monthly P&L - January 2024", type: "PDF", date: "2024-01-31", size: "2.3 MB" },
            { name: "Cash Flow Statement - Q4 2023", type: "Excel", date: "2024-01-15", size: "1.8 MB" },
            { name: "Trial Balance - December 2023", type: "PDF", date: "2024-01-02", size: "945 KB" },
            { name: "Sales Tax Report - Q4 2023", type: "Excel", date: "2023-12-28", size: "1.2 MB" }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-3">
                  <ApperIcon name={report.type === "PDF" ? "FileText" : "Table"} className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.date} • {report.size}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Download" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Share" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports