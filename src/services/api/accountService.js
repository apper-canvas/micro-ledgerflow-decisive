import accountsData from "@/services/mockData/accounts.json"

class AccountService {
  constructor() {
    this.accounts = [...accountsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.accounts]
  }

  async getById(id) {
    await this.delay(200)
    return this.accounts.find(account => account.Id === parseInt(id))
  }

  async getByType(type) {
    await this.delay(250)
    return this.accounts.filter(account => account.type === type)
  }

  async create(accountData) {
    await this.delay(400)
    const newAccount = {
      ...accountData,
      Id: Math.max(...this.accounts.map(a => a.Id)) + 1,
      balance: accountData.balance || 0,
      currency: accountData.currency || "USD"
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  async update(id, accountData) {
    await this.delay(350)
    const index = this.accounts.findIndex(account => account.Id === parseInt(id))
    if (index !== -1) {
      this.accounts[index] = { ...this.accounts[index], ...accountData }
      return this.accounts[index]
    }
    throw new Error("Account not found")
  }

  async delete(id) {
    await this.delay(300)
    const index = this.accounts.findIndex(account => account.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.accounts.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Account not found")
  }

  async getChartOfAccounts() {
    await this.delay(350)
    const accounts = [...this.accounts]
    
    // Group accounts by type
    const grouped = {
      asset: accounts.filter(a => a.type === "asset"),
      liability: accounts.filter(a => a.type === "liability"),
      equity: accounts.filter(a => a.type === "equity"),
      income: accounts.filter(a => a.type === "income"),
      expense: accounts.filter(a => a.type === "expense")
    }
    
    return grouped
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new AccountService()