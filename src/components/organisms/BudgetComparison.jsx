import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { formatCurrency, formatVariance, formatVariancePercent } from "@/utils/formatters"
import Chart from "react-apexcharts"
import budgetService from "@/services/api/budgetService"
import { toast } from "react-toastify"

const BudgetComparison = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [budgetData, setBudgetData] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q1")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [varianceAnalysis, setVarianceAnalysis] = useState(null)

  useEffect(() => {
    loadBudgetData()
  }, [selectedPeriod])

  const loadBudgetData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await budgetService.getBudgetComparison(selectedPeriod)
      setBudgetData(data)
    } catch (err) {
      setError("Failed to load budget comparison data")
      toast.error("Failed to load budget data")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryDrillDown = async (category) => {
    try {
      const categoryBudget = budgetData.categories.find(c => c.category === category.category)
      if (categoryBudget) {
        const budgetItem = await budgetService.getByCategory(category.category)
        const analysis = await budgetService.getVarianceAnalysis(budgetItem[0]?.Id)
        setVarianceAnalysis(analysis)
        setSelectedCategory(category)
        setShowDrillDown(true)
      }
    } catch (err) {
      toast.error("Failed to load category details")
    }
  }

  const getVarianceColor = (status, severity = "medium") => {
    if (status === "favorable") {
      return severity === "high" ? "text-green-700 bg-green-100" : "text-green-600 bg-green-50"
    }
    return severity === "high" ? "text-red-700 bg-red-100" : "text-red-600 bg-red-50"
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high": return "AlertTriangle"
      case "medium": return "AlertCircle"  
      default: return "CheckCircle"
    }
  }

  // Chart configurations
  const budgetVsActualOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const category = budgetData?.categories[config.dataPointIndex]
          if (category) {
            handleCategoryDrillDown(category)
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        grouped: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"]
    },
    colors: ["#3b82f6", "#10b981"],
    xaxis: {
      categories: budgetData?.categories.map(c => c.category) || []
    },
    yaxis: {
      title: {
        text: "Amount ($)"
      },
      labels: {
        formatter: (value) => formatCurrency(value)
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val)
      }
    },
    legend: {
      position: "top"
    }
  }

  const budgetVsActualSeries = [
    {
      name: "Budget",
      data: budgetData?.categories.map(c => c.budget) || []
    },
    {
      name: "Actual", 
      data: budgetData?.categories.map(c => c.actual) || []
    }
  ]

  const varianceChartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: "center"
        }
      }
    },
    colors: budgetData?.categories.map(c => c.status === "favorable" ? "#10b981" : "#ef4444") || [],
    dataLabels: {
      enabled: true,
      formatter: (val) => formatVariancePercent(val / 100),
      style: {
        colors: ["#fff"]
      }
    },
    xaxis: {
      categories: budgetData?.categories.map(c => c.category) || [],
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(1)}%`
      }
    },
    legend: {
      show: false
    }
  }

  const varianceChartSeries = [{
    name: "Variance %",
    data: budgetData?.categories.map(c => c.variancePercent) || []
  }]

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Budget vs Actual Analysis</h2>
          <p className="text-sm text-slate-600 mt-1">Compare budgeted amounts with actual performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="2024-Q1">Q1 2024</option>
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
          </Select>
          <Button variant="outline" icon="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {budgetData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Budget</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(budgetData.totalBudget)}
                </p>
              </div>
              <ApperIcon name="Target" className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Actual Amount</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(budgetData.totalActual)}
                </p>
              </div>
              <ApperIcon name="BarChart3" className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Variance</p>
                <p className={`text-2xl font-semibold ${budgetData.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatVariance(budgetData.totalVariance)}
                </p>
              </div>
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-slate-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Variance %</p>
                <p className={`text-2xl font-semibold ${budgetData.totalVariancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatVariancePercent(budgetData.totalVariancePercent / 100)}
                </p>
              </div>
              <ApperIcon name="Percent" className="w-8 h-8 text-slate-600" />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Budget vs Actual</h3>
            <Badge variant="outline" className="text-xs">
              Click bars to drill down
            </Badge>
          </div>
          {budgetData && (
            <Chart
              options={budgetVsActualOptions}
              series={budgetVsActualSeries}
              type="bar"
              height={400}
            />
          )}
        </div>

        {/* Variance Analysis Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Variance Analysis</h3>
            <div className="flex space-x-2">
              <Badge variant="success" className="text-xs">Favorable</Badge>
              <Badge variant="error" className="text-xs">Unfavorable</Badge>
            </div>
          </div>
          {budgetData && (
            <Chart
              options={varianceChartOptions}
              series={varianceChartSeries}
              type="bar"
              height={300}
            />
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      {budgetData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-700">Category</th>
                  <th className="text-right p-3 font-medium text-slate-700">Budget</th>
                  <th className="text-right p-3 font-medium text-slate-700">Actual</th>
                  <th className="text-right p-3 font-medium text-slate-700">Variance</th>
                  <th className="text-right p-3 font-medium text-slate-700">Variance %</th>
                  <th className="text-center p-3 font-medium text-slate-700">Status</th>
                  <th className="text-center p-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {budgetData.categories.map((category, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-medium text-slate-900">{category.category}</div>
                    </td>
                    <td className="p-3 text-right">{formatCurrency(category.budget)}</td>
                    <td className="p-3 text-right">{formatCurrency(category.actual)}</td>
                    <td className={`p-3 text-right font-medium ${category.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatVariance(category.variance)}
                    </td>
                    <td className={`p-3 text-right font-medium ${category.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatVariancePercent(category.variancePercent / 100)}
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={category.status === "favorable" ? "success" : "error"}
                        className="text-xs"
                      >
                        {category.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCategoryDrillDown(category)}
                      >
                        <ApperIcon name="Search" className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drill-down Modal */}
      {showDrillDown && varianceAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {varianceAnalysis.category} - Variance Analysis
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{varianceAnalysis.period}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDrillDown(false)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Variance Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Budget Amount</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatCurrency(varianceAnalysis.budget)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Actual Amount</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatCurrency(varianceAnalysis.actual)}
                  </p>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${getVarianceColor(varianceAnalysis.status, varianceAnalysis.analysis?.severity)}`}>
                <div className="flex items-center mb-2">
                  <ApperIcon 
                    name={getSeverityIcon(varianceAnalysis.analysis?.severity)} 
                    className="w-5 h-5 mr-2" 
                  />
                  <span className="font-medium">
                    {formatVariance(varianceAnalysis.variance)} 
                    ({formatVariancePercent(varianceAnalysis.variancePercent / 100)})
                  </span>
                </div>
                <p className="text-sm">
                  {varianceAnalysis.status === "favorable" 
                    ? "Performance exceeded budget expectations"
                    : "Performance fell short of budget expectations"
                  }
                </p>
              </div>

              {/* Subcategory Breakdown */}
              {varianceAnalysis.subcategories && varianceAnalysis.subcategories.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Subcategory Breakdown</h4>
                  <div className="space-y-2">
                    {varianceAnalysis.subcategories.map((sub, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700">{sub.name}</span>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">
                            {formatCurrency(sub.budget)} → {formatCurrency(sub.actual)}
                          </div>
                          <div className={`text-sm font-medium ${sub.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatVariance(sub.variance)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {varianceAnalysis.analysis?.recommendations && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {varianceAnalysis.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="ArrowRight" className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDrillDown(false)}>
                Close
              </Button>
              <Button icon="Download">
                Export Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetComparison