import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import InvoiceList from "@/components/organisms/InvoiceList"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import invoiceService from "@/services/api/invoiceService"
import { formatCurrency } from "@/utils/formatters"
import { toast } from "react-toastify"

const Invoicing = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [agingSummary, setAgingSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)

  const loadInvoicesData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [invoicesData, aging] = await Promise.all([
        invoiceService.getAll(),
        invoiceService.getAgingSummary()
      ])
      
      setInvoices(invoicesData)
      setFilteredInvoices(invoicesData)
      setAgingSummary(aging)
    } catch (err) {
      setError(err.message || "Failed to load invoices")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoicesData()
  }, [])

  useEffect(() => {
    let filtered = [...invoices]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchQuery, statusFilter])

  const handleSend = async (invoiceId) => {
    try {
      await invoiceService.send(invoiceId)
      toast.success("Invoice sent successfully")
      loadInvoicesData()
    } catch (err) {
      toast.error(err.message || "Failed to send invoice")
    }
  }

  const handleMarkPaid = async (invoiceId) => {
    try {
      await invoiceService.markPaid(invoiceId)
      toast.success("Invoice marked as paid")
      loadInvoicesData()
    } catch (err) {
      toast.error(err.message || "Failed to mark invoice as paid")
    }
  }

  const handleView = (invoice) => {
    toast.info(`Viewing invoice: ${invoice.number}`)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  if (error) {
    return <Error message={error} onRetry={loadInvoicesData} />
  }

  const totalOutstanding = invoices
    .filter(inv => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.total, 0)

  const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Invoicing"
        subtitle="Create, send, and manage customer invoices"
        breadcrumb={["Sales", "Invoicing"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="error" className="flex items-center">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
              {overdueInvoices} Overdue
            </Badge>
            <Button variant="outline" icon="Download">
              Export
            </Button>
            <Button 
              icon="Plus"
              onClick={() => setShowNewInvoiceModal(true)}
            >
              New Invoice
            </Button>
          </div>
        }
      />

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Outstanding</p>
              <p className="text-2xl font-bold gradient-text">{formatCurrency(totalOutstanding)}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                {invoices.filter(inv => 
                  new Date(inv.date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Value</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(invoices.length > 0 ? 
                  invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length : 0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Aging Summary */}
      {agingSummary && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Accounts Receivable Aging</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">Current</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(agingSummary.current)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">1-30 Days</p>
              <p className="text-xl font-bold text-yellow-600">{formatCurrency(agingSummary.overdue1_30)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">31-60 Days</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(agingSummary.overdue31_60)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">61-90 Days</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(agingSummary.overdue61_90)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">90+ Days</p>
              <p className="text-xl font-bold text-red-800">{formatCurrency(agingSummary.overdue90Plus)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search invoices..."
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
          </div>
          
          <FormField label="Status" type="select">
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </Select>
          </FormField>
          
          <FormField label="Date Range" type="select">
            <Select>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Invoice List */}
      <InvoiceList
        invoices={filteredInvoices}
        loading={loading}
        onView={handleView}
        onSend={handleSend}
        onMarkPaid={handleMarkPaid}
      />

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Create New Invoice</h2>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer & Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Customer Information</h3>
                  <FormField label="Customer" required type="select">
                    <Select>
                      <option>Select customer...</option>
                      <option>ABC Corporation</option>
                      <option>XYZ Company</option>
                      <option>Global Solutions Ltd</option>
                    </Select>
                  </FormField>
                  <FormField label="Customer Email">
                    <Input placeholder="customer@company.com" />
                  </FormField>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Invoice Details</h3>
                  <FormField label="Invoice Date" required>
                    <Input type="date" />
                  </FormField>
                  <FormField label="Due Date" required>
                    <Input type="date" />
                  </FormField>
                  <FormField label="Tax Rate (%)">
                    <Input type="number" placeholder="10" step="0.1" />
                  </FormField>
                </div>
              </div>
              
              {/* Line Items */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Line Items</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-3 mb-3">
                    <div className="col-span-5">
                      <FormField label="Description">
                        <Input placeholder="Service or product description" />
                      </FormField>
                    </div>
                    <div className="col-span-2">
                      <FormField label="Quantity">
                        <Input type="number" placeholder="1" />
                      </FormField>
                    </div>
                    <div className="col-span-2">
                      <FormField label="Rate">
                        <Input type="number" placeholder="0.00" step="0.01" />
                      </FormField>
                    </div>
                    <div className="col-span-2">
                      <FormField label="Amount">
                        <Input type="number" placeholder="0.00" step="0.01" disabled />
                      </FormField>
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" icon="Plus">
                    Add Line Item
                  </Button>
                </div>
              </div>
              
              {/* Totals Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="max-w-sm ml-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">$0.00</span>
                  </div>
                </div>
              </div>
              
              <FormField label="Notes">
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Additional notes or payment terms..."
                />
              </FormField>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <Button 
                variant="outline"
                onClick={() => setShowNewInvoiceModal(false)}
              >
                Cancel
              </Button>
              <Button variant="outline">
                Save Draft
              </Button>
              <Button>
                Save & Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoicing