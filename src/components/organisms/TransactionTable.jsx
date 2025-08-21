import React from "react"
import { formatCurrency, formatDate } from "@/utils/formatters"
import StatusBadge from "@/components/molecules/StatusBadge"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"

const TransactionTable = ({ transactions, loading, onView, onEdit, onApprove }) => {
  if (loading) {
    return <Loading variant="table" />
  }

  if (!transactions?.length) {
    return (
      <Empty
        title="No transactions found"
        message="No transactions match your current filters. Try adjusting your search criteria."
        icon="Receipt"
      />
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reference
              </th>
<th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {transactions.map((transaction) => {
              const totalAmount = transaction.entries?.reduce((sum, entry) => {
                return sum + (entry.debit || 0)
              }, 0) || 0

              return (
                <tr key={transaction.Id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {transaction.reference}
                  </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                    {formatCurrency(totalAmount, transaction.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {transaction.currency || 'USD'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {transaction.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant={tag === "ai-categorized" ? "ai" : "default"}>
                          {tag === "ai-categorized" && <ApperIcon name="Sparkles" className="w-3 h-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                      {transaction.tags?.length > 2 && (
                        <Badge variant="default">+{transaction.tags.length - 2}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="Eye"
                        onClick={() => onView?.(transaction)}
                      >
                        View
                      </Button>
                      {transaction.status === "pending" && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          icon="Check"
                          onClick={() => onApprove?.(transaction.Id)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionTable