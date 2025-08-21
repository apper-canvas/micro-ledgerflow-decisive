import React from "react";
import { toast } from "react-toastify";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import { formatCurrency, formatDate } from "@/utils/formatters";

const InvoiceList = ({ invoices, loading, onView, onEdit, onSend, onMarkPaid }) => {
  if (loading) {
    return <Loading variant="table" />
  }

  if (!invoices?.length) {
    return (
      <Empty
        title="No invoices found"
        message="You haven't created any invoices yet. Create your first invoice to get started."
        icon="FileText"
        action={
          <Button icon="Plus">
            Create Invoice
          </Button>
        }
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
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {invoices.map((invoice) => (
              <tr key={invoice.Id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                  {invoice.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {invoice.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(invoice.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
icon="Eye"
                      onClick={() => onView?.(invoice)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="Copy"
                      onClick={() => toast.info(`Template created from ${invoice.number}`)}
                    >
                      Template
                    </Button>
                    {invoice.status === "draft" && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        icon="Send"
                        onClick={() => onSend?.(invoice.Id)}
                      >
                        Send
                      </Button>
                    )}
                    {invoice.status === "sent" && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        icon="Check"
                        onClick={() => onMarkPaid?.(invoice.Id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceList