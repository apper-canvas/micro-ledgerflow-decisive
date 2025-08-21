import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";
import invoiceService from "@/services/api/invoiceService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { formatCurrency, formatDate } from "@/utils/formatters";

const Reports = () => {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("all");
const [reportType, setReportType] = useState("all");
  const [agingData, setAgingData] = useState(null);
  const [showAgingModal, setShowAgingModal] = useState(false);
const [showAgingModal, setShowAgingModal] = useState(false);
  const [selectedAgingBucket, setSelectedAgingBucket] = useState(null);
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
      name: "AR/AP Aging Chart",
      description: "Interactive aging with drill-down details",
      icon: "Clock",
      color: "warning",
      isInteractive: true
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
  ];

  // Load aging data on mount
  useEffect(() => {
useEffect(() => {
    loadAgingData();
  }, []);

  const loadAgingData = async () => {
try {
      const data = await invoiceService.getAgingWithDetails();
      setAgingData(data);
    } catch (error) {
      toast.error("Failed to load aging data");
toast.error("Failed to load aging data");
    }
  };

  const handleAgingBucketClick = (bucketName) => {
if (agingData && agingData[bucketName]?.invoices?.length > 0) {
      setSelectedAgingBucket({
        name: bucketName,
        data: agingData[bucketName]
      });
});
      setShowAgingModal(true);
    }
  };
const AgingChart = () => {
    if (!agingData) return null;
    const agingChartOptions = {
      chart: {
        type: "bar",
        height: 400,
        toolbar: { show: true },
        events: {
          dataPointSelection: (event, chartContext, config) => {
const buckets = ['current', 'overdue1_30', 'overdue31_60', 'overdue61_90', 'overdue90Plus'];
            const selectedBucket = buckets[config.dataPointIndex];
            handleAgingBucketClick(selectedBucket);
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 4
        }
      },
      colors: ["#10b981", "#f59e0b", "#ef4444", "#dc2626", "#7f1d1d"],
      xaxis: {
        categories: ["Current", "1-30 Days", "31-60 Days", "61-90 Days", "90+ Days"],
        title: {
          text: "Aging Periods"
        }
      },
      yaxis: {
        title: {
          text: "Amount"
        },
        labels: {
          formatter: (value) => formatCurrency(value)
        }
      },
      tooltip: {
        y: {
          formatter: (value) => formatCurrency(value)
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 3
}
    };

    const agingChartSeries = [{
      name: "Outstanding Amount",
      data: [
        agingData.current.amount,
        agingData.overdue1_30.amount,
        agingData.overdue31_60.amount,
        agingData.overdue61_90.amount,
        agingData.overdue90Plus.amount
]
    }];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AR/AP Aging Analysis</h3>
            <p className="text-sm text-slate-600">Click on bars to drill down into individual invoices</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="flex items-center">
              <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
            <Button variant="ghost" size="sm" icon="Refresh" onClick={loadAgingData}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { key: 'current', label: 'Current', color: 'bg-green-100 text-green-800' },
            { key: 'overdue1_30', label: '1-30 Days', color: 'bg-yellow-100 text-yellow-800' },
            { key: 'overdue31_60', label: '31-60 Days', color: 'bg-orange-100 text-orange-800' },
            { key: 'overdue61_90', label: '61-90 Days', color: 'bg-red-100 text-red-800' },
            { key: 'overdue90Plus', label: '90+ Days', color: 'bg-red-200 text-red-900' }
          ].map(bucket => (
            <div 
              key={bucket.key}
              className="p-3 rounded-lg border border-slate-200 cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleAgingBucketClick(bucket.key)}
            >
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${bucket.color} mb-2`}>
                {bucket.label}
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(agingData[bucket.key].amount)}
              </p>
              <p className="text-xs text-slate-600">
                {agingData[bucket.key].invoices.length} invoice{agingData[bucket.key].invoices.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>

        <Chart
          options={agingChartOptions}
          series={agingChartSeries}
          type="bar"
          height={400}
        />
</div>
    );
  };

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
  };

  const revenueChartSeries = [
    {
      name: "Revenue",
      data: [45000, 52000, 48000, 58000, 65000, 72000]
    },
    {
      name: "Expenses",
      data: [32000, 38000, 35000, 42000, 48000, 52000]
}
  ];

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
  };

  const expenseBreakdownSeries = [35, 25, 20, 15, 5];
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

      {/* AR/AP Aging Chart */}
      <AgingChart />
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
                  {report.isInteractive && (
                    <Badge variant="accent" className="text-xs mt-1">Interactive</Badge>
                  )}
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
      {/* Aging Details Modal */}
      {showAgingModal && selectedAgingBucket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedAgingBucket.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Invoices
                </h3>
                <p className="text-sm text-slate-600">
                  {selectedAgingBucket.data.invoices.length} invoice{selectedAgingBucket.data.invoices.length !== 1 ? 's' : ''} • 
                  Total: {formatCurrency(selectedAgingBucket.data.amount)}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAgingModal(false)}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-auto max-h-[60vh] p-6">
              <div className="space-y-3">
                {selectedAgingBucket.data.invoices.map((invoice) => (
                  <div key={invoice.Id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        !invoice.isOverdue ? 'bg-green-500' : 
                        invoice.daysOverdue <= 30 ? 'bg-yellow-500' :
                        invoice.daysOverdue <= 60 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-slate-900">{invoice.number}</p>
                        <p className="text-sm text-slate-600">{invoice.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium text-slate-900">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-slate-600">
                        Due: {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        !invoice.isOverdue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {invoice.isOverdue ? `${invoice.daysOverdue} days overdue` : 'Current'}
                      </p>
                      <Badge variant={invoice.status === 'sent' ? 'warning' : 'default'} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Send" className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => setShowAgingModal(false)}>
                Close
              </Button>
              <Button icon="Download">
                Export List
              </Button>
            </div>
          </div>
        </div>
      )}
</div>
  );
};

export default Reports;