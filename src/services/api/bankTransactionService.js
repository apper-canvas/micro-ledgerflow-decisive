import bankTransactionsData from "@/services/mockData/bankTransactions.json"

class BankTransactionService {
  constructor() {
    this.bankTransactions = [...bankTransactionsData]
  }

  async getAll() {
    await this.delay(350)
    // Sort by date descending
    return [...this.bankTransactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getById(id) {
    await this.delay(200)
    return this.bankTransactions.find(transaction => transaction.Id === parseInt(id))
  }

  async getUnmatched() {
    await this.delay(300)
    return this.bankTransactions.filter(transaction => !transaction.matchedTransactionId)
  }

  async getFlagged() {
    await this.delay(300)
    return this.bankTransactions.filter(transaction => transaction.flagged)
  }

  async getByAccount(bankAccountId) {
    await this.delay(350)
    return this.bankTransactions.filter(transaction => transaction.bankAccountId === bankAccountId)
  }

  async match(id, transactionId) {
    await this.delay(400)
    const index = this.bankTransactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index !== -1) {
      this.bankTransactions[index].matchedTransactionId = transactionId
      return this.bankTransactions[index]
    }
    throw new Error("Bank transaction not found")
  }

  async unmatch(id) {
    await this.delay(300)
    const index = this.bankTransactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index !== -1) {
      this.bankTransactions[index].matchedTransactionId = null
      return this.bankTransactions[index]
    }
    throw new Error("Bank transaction not found")
  }

  async categorize(id, category) {
    await this.delay(350)
    const index = this.bankTransactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index !== -1) {
      this.bankTransactions[index].category = category
      return this.bankTransactions[index]
    }
    throw new Error("Bank transaction not found")
  }

  async getSuggestedMatches(id) {
    await this.delay(400)
    // Mock AI-suggested matches based on amount and description
    const transaction = await this.getById(id)
    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Simulate AI matching suggestions
    const suggestions = [
      {
        transactionId: "1",
        confidence: 95,
        reason: "Amount and date match",
        transaction: {
          Id: 1,
          description: "Invoice payment from ABC Corp",
          amount: transaction.amount
        }
      },
      {
        transactionId: "2",
        confidence: 78,
        reason: "Similar description pattern",
        transaction: {
          Id: 2,
          description: "Office supplies purchase",
          amount: transaction.amount * 0.8
        }
      }
    ]

    return suggestions
  }

  async getReconciliationSummary() {
    await this.delay(300)
    const matched = this.bankTransactions.filter(t => t.matchedTransactionId).length
    const unmatched = this.bankTransactions.filter(t => !t.matchedTransactionId).length
    const flagged = this.bankTransactions.filter(t => t.flagged).length
    
    return {
      total: this.bankTransactions.length,
      matched,
      unmatched,
      flagged,
      matchRate: matched / this.bankTransactions.length
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new BankTransactionService()