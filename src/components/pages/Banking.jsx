import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import BankReconciliation from "@/components/organisms/BankReconciliation"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import KPICard from "@/components/molecules/KPICard"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import bankTransactionService from "@/services/api/bankTransactionService"
import { toast } from "react-toastify"

const Banking = () => {
  const [bankTransactions, setBankTransactions] = useState([])
  const [reconciliationStats, setReconciliationStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadBankingData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [transactions, stats] = await Promise.all([
        bankTransactionService.getAll(),
        bankTransactionService.getReconciliationSummary()
      ])
      
      setBankTransactions(transactions)
      setReconciliationStats(stats)
    } catch (err) {
      setError(err.message || "Failed to load banking data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBankingData()
  }, [])

  const handleMatch = async (transactionId) => {
    try {
      // Mock match functionality - in real app, would show match dialog
      await bankTransactionService.match(transactionId, "1")
      toast.success("Transaction matched successfully")
      loadBankingData()
    } catch (err) {
      toast.error(err.message || "Failed to match transaction")
    }
  }

  const handleUnmatch = async (transactionId) => {
    try {
      await bankTransactionService.unmatch(transactionId)
      toast.success("Transaction unmatched successfully")
      loadBankingData()
    } catch (err) {
      toast.error(err.message || "Failed to unmatch transaction")
    }
  }

  const handleCategorize = (transactionId) => {
    toast.info("Category selection modal would open here")
  }

  const handleFlag = (transactionId) => {
    toast.info("Transaction flagged for review")
  }

  if (error) {
    return <Error message={error} onRetry={loadBankingData} />
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Banking & Reconciliation"
        subtitle="Manage bank connections and reconcile transactions"
        breadcrumb={["Accounting", "Banking"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="success" className="flex items-center">
              <ApperIcon name="Check" className="w-4 h-4 mr-1" />
              Connected
            </Badge>
            <Button variant="outline" icon="Download">
              Import Bank File
            </Button>
            <Button icon="Link">
              Connect Bank
            </Button>
          </div>
        }
      />

      {/* Reconciliation Stats */}
      {reconciliationStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Total Transactions"
            value={reconciliationStats.total}
            type="number"
            icon="Building2"
            gradient
          />
          
          <KPICard
            title="Matched"
            value={reconciliationStats.matched}
            type="number"
            change={`${(reconciliationStats.matchRate * 100).toFixed(1)}%`}
            trend="up"
            icon="Check"
          />
          
          <KPICard
            title="Unmatched"
            value={reconciliationStats.unmatched}
            type="number"
            icon="AlertCircle"
          />
          
          <KPICard
            title="Flagged for Review"
            value={reconciliationStats.flagged}
            type="number"
            icon="Flag"
          />
        </div>
      )}

      {/* AI Reconciliation Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ApperIcon name="Sparkles" className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900">AI-Powered Reconciliation</h3>
              <p className="text-sm text-purple-700">Intelligent matching and anomaly detection</p>
            </div>
          </div>
          <Button variant="secondary" icon="Settings">
            Configure AI
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Target" className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-slate-900">Match Accuracy</span>
            </div>
            <p className="text-2xl font-bold gradient-text-success">95.2%</p>
            <p className="text-xs text-slate-600">Based on historical patterns</p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-slate-900">Auto-Processed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {reconciliationStats ? reconciliationStats.matched : 0}
            </p>
            <p className="text-xs text-slate-600">Transactions this month</p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Shield" className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-slate-900">Anomalies Detected</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {reconciliationStats ? reconciliationStats.flagged : 0}
            </p>
            <p className="text-xs text-slate-600">Requiring manual review</p>
          </div>
        </div>
      </div>

      {/* Bank Account Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Connected Accounts</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Building2" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Business Checking - ***4532</h4>
                <p className="text-sm text-slate-600">Last sync: 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="success">Active</Badge>
              <Button variant="outline" size="sm">
                Sync Now
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Business Credit Card - ***8901</h4>
                <p className="text-sm text-slate-600">Last sync: 1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="warning">Needs Sync</Badge>
              <Button variant="outline" size="sm">
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reconciliation Interface */}
      {loading ? (
        <Loading>Loading bank transactions...</Loading>
      ) : (
        <BankReconciliation
          bankTransactions={bankTransactions}
          loading={false}
          onMatch={handleMatch}
          onUnmatch={handleUnmatch}
          onCategorize={handleCategorize}
          onFlag={handleFlag}
        />
      )}
    </div>
  )
}

export default Banking