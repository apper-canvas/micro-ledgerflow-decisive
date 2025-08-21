import transactionsData from "@/services/mockData/transactions.json"

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

  async getAll() {
    await this.delay(400)
    // Sort by date descending
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getById(id) {
    await this.delay(200)
    return this.transactions.find(transaction => transaction.Id === parseInt(id))
  }

  async getByStatus(status) {
    await this.delay(300)
    return this.transactions.filter(transaction => transaction.status === status)
  }

  async getByDateRange(startDate, endDate) {
    await this.delay(350)
    return this.transactions.filter(transaction => {
      const date = new Date(transaction.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
  }

  async create(transactionData) {
    await this.delay(500)
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      attachments: transactionData.attachments || [],
      tags: transactionData.tags || []
    }
    this.transactions.push(newTransaction)
    return newTransaction
  }

  async update(id, transactionData) {
    await this.delay(400)
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...transactionData }
      return this.transactions[index]
    }
    throw new Error("Transaction not found")
  }

  async delete(id) {
    await this.delay(350)
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.transactions.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Transaction not found")
  }

  async approve(id) {
    await this.delay(300)
    const transaction = await this.getById(id)
    if (transaction) {
      return await this.update(id, { status: "approved" })
    }
    throw new Error("Transaction not found")
  }

  async getRecentActivity(limit = 10) {
    await this.delay(250)
    return [...this.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TransactionService()