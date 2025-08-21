import React, { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import currencyService from "@/services/api/currencyService"
import { toast } from "react-toastify"

const CurrencyConverter = ({ isOpen, onClose }) => {
  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [amount, setAmount] = useState("")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [historicalRates, setHistoricalRates] = useState([])
  const [popularPairs, setPopularPairs] = useState([])
  const [loading, setLoading] = useState(false)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [error, setError] = useState("")
  const [conversionHistory, setConversionHistory] = useState([])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [currenciesData, pairsData] = await Promise.all([
        currencyService.getSupportedCurrencies(),
        currencyService.getPopularCurrencyPairs()
      ])
      
      setCurrencies(currenciesData)
      setPopularPairs(pairsData)
      
      // Load initial conversion if amount is present
      if (amount) {
        await performConversion()
      }
    } catch (err) {
      setError(err.message || "Failed to load currency data")
    } finally {
      setLoading(false)
    }
  }

  const loadHistoricalRates = async (currency) => {
    try {
      setRatesLoading(true)
      const rates = await currencyService.getHistoricalRates(currency, 30)
      setHistoricalRates(rates)
    } catch (err) {
      toast.error(`Failed to load historical rates for ${currency}`)
    } finally {
      setRatesLoading(false)
    }
  }

  const performConversion = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setConvertedAmount("")
      setExchangeRate(0)
      return
    }

    try {
      const result = await currencyService.convert(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      )
      
      setConvertedAmount(result.convertedAmount.toFixed(2))
      setExchangeRate(result.rate)
      
      // Add to conversion history
      const newConversion = {
        id: Date.now(),
        amount: parseFloat(amount),
        convertedAmount: result.convertedAmount,
        fromCurrency,
        toCurrency,
        rate: result.rate,
        timestamp: new Date().toISOString()
      }
      
      setConversionHistory(prev => [newConversion, ...prev.slice(0, 4)])
      
    } catch (err) {
      toast.error(err.message || "Conversion failed")
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    
    if (convertedAmount) {
      setAmount(convertedAmount)
      setConvertedAmount("")
    }
  }

  const selectPopularPair = (pair) => {
    setFromCurrency(pair.from)
    setToCurrency(pair.to)
    if (amount) {
      setTimeout(() => performConversion(), 100)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  useEffect(() => {
    if (toCurrency !== "USD") {
      loadHistoricalRates(toCurrency)
    }
  }, [toCurrency])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (amount && fromCurrency && toCurrency) {
        performConversion()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [amount, fromCurrency, toCurrency])

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <Loading variant="spinner" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <Error message={error} onRetry={loadInitialData} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Currency Converter</h2>
              <p className="text-sm text-slate-500">Real-time exchange rates and conversion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Currency Converter Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Convert Currency</h3>
              
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="From Currency">
                    <Select 
                      value={fromCurrency} 
                      onChange={(e) => setFromCurrency(e.target.value)}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  
                  <FormField label="To Currency">
                    <Select 
                      value={toCurrency} 
                      onChange={(e) => setToCurrency(e.target.value)}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon="ArrowLeftRight"
                    onClick={swapCurrencies}
                  >
                    Swap
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Amount">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </FormField>
                  
                  <FormField label="Converted Amount">
                    <Input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className="bg-slate-100 text-slate-600"
                      placeholder="0.00"
                    />
                  </FormField>
                </div>
                
                {exchangeRate > 0 && (
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-700">
                      1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Popular Currency Pairs */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">Popular Pairs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularPairs.map(pair => (
                    <Button
                      key={pair.name}
                      variant="outline"
                      size="sm"
                      onClick={() => selectPopularPair(pair)}
                      className="text-xs"
                    >
                      {pair.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rate History Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                30-Day Rate History ({toCurrency})
              </h3>
              
              <div className="bg-slate-50 rounded-lg p-4" style={{ height: '300px' }}>
                {ratesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loading variant="spinner" />
                  </div>
                ) : historicalRates.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalRates}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        domain={['dataMin - 0.01', 'dataMax + 0.01']}
                      />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value) => [value.toFixed(4), `Rate (${toCurrency})`]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', r: 2 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <ApperIcon name="TrendingUp" className="w-8 h-8 mx-auto mb-2" />
                      <p>No historical data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conversion History */}
          {conversionHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Conversions</h3>
              <div className="bg-slate-50 rounded-lg overflow-hidden">
                <div className="divide-y divide-slate-200">
                  {conversionHistory.map(conversion => (
                    <div key={conversion.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="ArrowRightLeft" className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {conversion.amount.toFixed(2)} {conversion.fromCurrency} → {conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}
                          </p>
                          <p className="text-xs text-slate-500">
                            Rate: {conversion.rate.toFixed(6)} • {new Date(conversion.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAmount(conversion.amount.toString())
                          setFromCurrency(conversion.fromCurrency)
                          setToCurrency(conversion.toCurrency)
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CurrencyConverter