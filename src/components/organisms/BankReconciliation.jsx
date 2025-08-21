import React from "react"
import { formatCurrency, formatDate } from "@/utils/formatters"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"

const BankReconciliation = ({ 
  bankTransactions, 
  loading, 
  onMatch, 
  onUnmatch, 
  onCategorize,
  onFlag 
}) => {
  if (loading) {
    return <Loading variant="table" />
  }

  if (!bankTransactions?.length) {
    return (
      <Empty
        title="No bank transactions"
        message="No bank transactions found. Connect your bank account to import transactions."
        icon="Building2"
        action={
          <Button icon="Link">
            Connect Bank Account
          </Button>
        }
      />
    )
  }

  const getMatchStatusColor = (transaction) => {
    if (transaction.flagged) return "error"
    if (transaction.matchedTransactionId) return "success"
    return "warning"
  }

  const getMatchStatusText = (transaction) => {
    if (transaction.flagged) return "Flagged"
    if (transaction.matchedTransactionId) return "Matched"
    return "Unmatched"
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bank Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Building2" className="w-5 h-5 mr-2 text-primary-600" />
            Bank Transactions
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {bankTransactions.map((transaction) => (
            <div key={transaction.Id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                      {transaction.description}
                    </p>
                    <span className={`text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-slate-900"}`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(transaction.date)}</span>
                    <div className="flex items-center space-x-2">
                      {transaction.category && (
                        <Badge variant="default" className="text-xs">
                          {transaction.category}
                        </Badge>
                      )}
                      <Badge variant={getMatchStatusColor(transaction)} className="text-xs">
                        {getMatchStatusText(transaction)}
                      </Badge>
                    </div>
                  </div>
                  
                  {transaction.aiConfidence && (
                    <div className="flex items-center mt-2">
                      <ApperIcon name="Sparkles" className="w-3 h-3 text-purple-500 mr-1" />
                      <span className={`text-xs font-medium ${getConfidenceColor(transaction.aiConfidence)}`}>
                        AI Confidence: {transaction.aiConfidence}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  {!transaction.matchedTransactionId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onMatch?.(transaction.Id)}
                    >
                      Match
                    </Button>
                  )}
                  {transaction.matchedTransactionId && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUnmatch?.(transaction.Id)}
                    >
                      Unmatch
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    icon="Tag"
                    onClick={() => onCategorize?.(transaction.Id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    icon="Flag"
                    onClick={() => onFlag?.(transaction.Id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Matching Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Sparkles" className="w-5 h-5 mr-2 text-purple-600" />
            AI Suggestions
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-900">Potential Matches Found</h4>
                <Badge variant="ai">High Confidence</Badge>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                "STRIPE PAYMENT XYZ COMPANY" matches invoice INV-2024-002 (95% confidence)
              </p>
              <Button variant="secondary" size="sm">
                Accept Match
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-yellow-900">Anomaly Detected</h4>
                <Badge variant="warning">Review Needed</Badge>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Unusual transaction pattern detected for "UNKNOWN MERCHANT"
              </p>
              <Button variant="outline" size="sm">
                Review Transaction
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-900">Auto-Categorized</h4>
                <Badge variant="success">Processed</Badge>
              </div>
              <p className="text-sm text-green-700">
                8 transactions automatically categorized based on historical patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankReconciliation