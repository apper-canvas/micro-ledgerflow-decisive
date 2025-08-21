import budgetsData from "@/services/mockData/budgets.json"

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.budgets]
  }

  async getById(id) {
    await this.delay(200)
    return this.budgets.find(budget => budget.Id === parseInt(id))
  }

  async getByPeriod(period) {
    await this.delay(250)
    return this.budgets.filter(budget => budget.period === period)
  }

  async getByCategory(category) {
    await this.delay(250)
    return this.budgets.filter(budget => budget.category === category)
  }

  async getBudgetComparison(period = "2024-Q1") {
    await this.delay(400)
    const budgets = await this.getByPeriod(period)
    
    const comparison = {
      period,
      totalBudget: 0,
      totalActual: 0,
      totalVariance: 0,
      categories: []
    }

    budgets.forEach(budget => {
      comparison.totalBudget += budget.budgetAmount
      comparison.totalActual += budget.actualAmount
      comparison.totalVariance += budget.variance
      
      comparison.categories.push({
        category: budget.category,
        budget: budget.budgetAmount,
        actual: budget.actualAmount,
        variance: budget.variance,
        variancePercent: budget.variancePercent,
        status: budget.status,
        subcategories: budget.subcategories || []
      })
    })

    comparison.totalVariancePercent = comparison.totalBudget > 0 
      ? (comparison.totalVariance / comparison.totalBudget) * 100 
      : 0

    return comparison
  }

  async getVarianceAnalysis(categoryId) {
    await this.delay(300)
    const budget = await this.getById(categoryId)
    
    if (!budget) return null

    return {
      category: budget.category,
      period: budget.period,
      budget: budget.budgetAmount,
      actual: budget.actualAmount,
      variance: budget.variance,
      variancePercent: budget.variancePercent,
      status: budget.status,
      subcategories: budget.subcategories || [],
      analysis: this.generateVarianceAnalysis(budget)
    }
  }

  generateVarianceAnalysis(budget) {
    const analysis = {
      type: budget.status,
      severity: this.getVarianceSeverity(budget.variancePercent),
      recommendations: []
    }

    if (Math.abs(budget.variancePercent) > 15) {
      analysis.severity = "high"
      if (budget.status === "unfavorable") {
        analysis.recommendations.push("Investigate significant overspending or revenue shortfall")
        analysis.recommendations.push("Review budget assumptions and market conditions")
      } else {
        analysis.recommendations.push("Analyze factors contributing to outperformance")
        analysis.recommendations.push("Consider adjusting future budget targets")
      }
    } else if (Math.abs(budget.variancePercent) > 5) {
      analysis.severity = "medium"
      analysis.recommendations.push("Monitor trend closely in upcoming periods")
    } else {
      analysis.severity = "low"
      analysis.recommendations.push("Performance is within acceptable variance range")
    }

    return analysis
  }

  getVarianceSeverity(variancePercent) {
    const absVariance = Math.abs(variancePercent)
    if (absVariance > 15) return "high"
    if (absVariance > 5) return "medium"
    return "low"
  }

  async create(budgetData) {
    await this.delay(500)
    const newBudget = {
      ...budgetData,
      Id: Math.max(...this.budgets.map(b => b.Id)) + 1,
      variance: (budgetData.actualAmount || 0) - budgetData.budgetAmount,
      variancePercent: budgetData.budgetAmount > 0 
        ? (((budgetData.actualAmount || 0) - budgetData.budgetAmount) / budgetData.budgetAmount) * 100 
        : 0,
      status: (budgetData.actualAmount || 0) >= budgetData.budgetAmount ? "favorable" : "unfavorable"
    }
    this.budgets.push(newBudget)
    return newBudget
  }

  async update(id, budgetData) {
    await this.delay(400)
    const index = this.budgets.findIndex(budget => budget.Id === parseInt(id))
    if (index !== -1) {
      const updated = { 
        ...this.budgets[index], 
        ...budgetData,
        variance: (budgetData.actualAmount || this.budgets[index].actualAmount) - (budgetData.budgetAmount || this.budgets[index].budgetAmount),
      }
      updated.variancePercent = updated.budgetAmount > 0 
        ? (updated.variance / updated.budgetAmount) * 100 
        : 0
      updated.status = updated.variance >= 0 ? "favorable" : "unfavorable"
      
      this.budgets[index] = updated
      return updated
    }
    throw new Error("Budget not found")
  }

  async delete(id) {
    await this.delay(350)
    const index = this.budgets.findIndex(budget => budget.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.budgets.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Budget not found")
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new BudgetService()