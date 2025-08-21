import { format, subDays } from "date-fns"

class CurrencyService {
  constructor() {
    // Mock exchange rates with realistic fluctuations
    this.baseCurrency = "USD"
    this.supportedCurrencies = [
      { code: "USD", name: "US Dollar", symbol: "$" },
      { code: "EUR", name: "Euro", symbol: "€" },
      { code: "GBP", name: "British Pound", symbol: "£" },
      { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
      { code: "AUD", name: "Australian Dollar", symbol: "A$" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥" },
      { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
      { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
      { code: "INR", name: "Indian Rupee", symbol: "₹" },
      { code: "SEK", name: "Swedish Krona", symbol: "kr" }
    ]
    
    // Base rates (1 USD = X currency)
    this.baseRates = {
      USD: 1.0000,
      EUR: 0.8450,
      GBP: 0.7350,
      CAD: 1.2800,
      AUD: 1.4200,
      JPY: 110.50,
      CHF: 0.9200,
      CNY: 6.4500,
      INR: 74.8000,
      SEK: 8.7500
    }
    
    this.rateHistory = this.generateHistoricalRates()
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  generateHistoricalRates() {
    const history = {}
    const days = 30
    
    Object.keys(this.baseRates).forEach(currency => {
      history[currency] = []
      const baseRate = this.baseRates[currency]
      
      for (let i = days; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
        // Add realistic fluctuation (±2% daily)
        const fluctuation = (Math.random() - 0.5) * 0.04 // ±2%
        const rate = baseRate * (1 + fluctuation)
        
        history[currency].push({
          date,
          rate: Number(rate.toFixed(currency === 'JPY' ? 2 : 4))
        })
      }
    })
    
    return history
  }

  async getSupportedCurrencies() {
    await this.delay(200)
    return [...this.supportedCurrencies]
  }

  async getCurrentRates() {
    await this.delay(300)
    const rates = {}
    
    // Simulate real-time rate fluctuations
    Object.entries(this.baseRates).forEach(([currency, baseRate]) => {
      const fluctuation = (Math.random() - 0.5) * 0.02 // ±1%
      rates[currency] = Number((baseRate * (1 + fluctuation)).toFixed(currency === 'JPY' ? 2 : 4))
    })
    
    return {
      base: this.baseCurrency,
      date: new Date().toISOString(),
      rates
    }
  }

  async getHistoricalRates(currency, days = 30) {
    await this.delay(250)
    
    if (!this.rateHistory[currency]) {
      throw new Error(`Unsupported currency: ${currency}`)
    }
    
    return this.rateHistory[currency].slice(-days)
  }

  async convert(amount, fromCurrency, toCurrency) {
    await this.delay(150)
    
    if (fromCurrency === toCurrency) {
      return {
        amount,
        convertedAmount: amount,
        rate: 1,
        fromCurrency,
        toCurrency
      }
    }
    
    const currentRates = await this.getCurrentRates()
    
    // Convert to USD first, then to target currency
    const amountInUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / currentRates.rates[fromCurrency]
    
    const convertedAmount = toCurrency === 'USD'
      ? amountInUSD
      : amountInUSD * currentRates.rates[toCurrency]
    
    const rate = convertedAmount / amount
    
    return {
      amount,
      convertedAmount: Number(convertedAmount.toFixed(2)),
      rate: Number(rate.toFixed(6)),
      fromCurrency,
      toCurrency,
      timestamp: new Date().toISOString()
    }
  }

  async getMultiCurrencyRates(baseCurrency = 'USD') {
    await this.delay(200)
    const currentRates = await this.getCurrentRates()
    
    if (baseCurrency === 'USD') {
      return currentRates.rates
    }
    
    // Convert all rates to the specified base currency
    const baseRate = currentRates.rates[baseCurrency]
    const convertedRates = {}
    
    Object.entries(currentRates.rates).forEach(([currency, rate]) => {
      if (currency === baseCurrency) {
        convertedRates[currency] = 1.0000
      } else {
        convertedRates[currency] = Number((rate / baseRate).toFixed(6))
      }
    })
    
    return convertedRates
  }

  async getCurrencyInfo(currencyCode) {
    await this.delay(100)
    return this.supportedCurrencies.find(curr => curr.code === currencyCode)
  }

  async convertTransaction(transaction, targetCurrency) {
    await this.delay(200)
    
    if (!transaction.currency || transaction.currency === targetCurrency) {
      return { ...transaction, convertedEntries: transaction.entries }
    }
    
    const convertedEntries = await Promise.all(
      transaction.entries.map(async (entry) => {
        const debitConversion = entry.debit 
          ? await this.convert(entry.debit, transaction.currency, targetCurrency)
          : null
        
        const creditConversion = entry.credit
          ? await this.convert(entry.credit, transaction.currency, targetCurrency)
          : null
        
        return {
          ...entry,
          originalDebit: entry.debit,
          originalCredit: entry.credit,
          originalCurrency: transaction.currency,
          debit: debitConversion?.convertedAmount || null,
          credit: creditConversion?.convertedAmount || null,
          conversionRate: debitConversion?.rate || creditConversion?.rate || 1
        }
      })
    )
    
    return {
      ...transaction,
      originalCurrency: transaction.currency,
      currency: targetCurrency,
      convertedEntries
    }
  }

  async getPopularCurrencyPairs() {
    await this.delay(150)
    return [
      { from: 'USD', to: 'EUR', name: 'USD/EUR' },
      { from: 'USD', to: 'GBP', name: 'USD/GBP' },
      { from: 'EUR', to: 'GBP', name: 'EUR/GBP' },
      { from: 'USD', to: 'CAD', name: 'USD/CAD' },
      { from: 'USD', to: 'AUD', name: 'USD/AUD' },
      { from: 'USD', to: 'JPY', name: 'USD/JPY' }
    ]
  }

  formatCurrencyAmount(amount, currency) {
    const currencyInfo = this.supportedCurrencies.find(c => c.code === currency)
    if (!currencyInfo) return `${amount} ${currency}`
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    })
    
    return formatter.format(amount)
  }
}

export default new CurrencyService()