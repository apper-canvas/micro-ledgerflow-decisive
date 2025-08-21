import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import TransactionTable from "@/components/organisms/TransactionTable"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import transactionService from "@/services/api/transactionService"
import { toast } from "react-toastify"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false)

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await transactionService.getAll()
      setTransactions(data)
      setFilteredTransactions(data)
    } catch (err) {
      setError(err.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    let filtered = [...transactions]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, statusFilter])

  const handleApprove = async (transactionId) => {
    try {
      await transactionService.approve(transactionId)
      toast.success("Transaction approved successfully")
      loadTransactions()
    } catch (err) {
      toast.error(err.message || "Failed to approve transaction")
    }
  }

  const handleView = (transaction) => {
    // Mock view functionality
    toast.info(`Viewing transaction: ${transaction.description}`)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  if (error) {
    return <Error message={error} onRetry={loadTransactions} />
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Transactions"
        subtitle="Manage your financial transactions and journal entries"
        breadcrumb={["Accounting", "Transactions"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="ai" className="flex items-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 mr-1" />
              95% Auto-categorized
            </Badge>
            <Button 
              icon="Upload"
              variant="outline"
            >
              Import CSV
            </Button>
            <Button 
              icon="Plus"
              onClick={() => setShowNewTransactionModal(true)}
            >
              New Transaction
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search transactions..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
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

      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Receipt" className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === "pending").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">AI Categorized</p>
              <p className="text-2xl font-bold text-purple-600">
                {transactions.filter(t => t.tags?.includes("ai-categorized")).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-2xl font-bold gradient-text">
                {transactions.filter(t => 
                  new Date(t.date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        loading={loading}
        onView={handleView}
        onApprove={handleApprove}
      />

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">New Transaction</h2>
              <button
                onClick={() => setShowNewTransactionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Date" required>
                  <Input type="date" />
                </FormField>
                <FormField label="Reference" required>
                  <Input placeholder="TXN-2024-001" />
                </FormField>
              </div>
              
              <FormField label="Description" required>
                <Input placeholder="Enter transaction description" />
              </FormField>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Journal Entries</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Account" type="select">
                      <Select>
                        <option>Select account...</option>
                        <option>Cash - Operating</option>
                        <option>Accounts Receivable</option>
                        <option>Revenue - Services</option>
                      </Select>
                    </FormField>
                    <FormField label="Debit">
                      <Input type="number" placeholder="0.00" />
                    </FormField>
                    <FormField label="Credit">
                      <Input type="number" placeholder="0.00" />
                    </FormField>
                  </div>
                  
                  <Button variant="outline" size="sm" icon="Plus">
                    Add Entry
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ai-assist" className="rounded border-slate-300" />
                <label htmlFor="ai-assist" className="text-sm text-slate-700 flex items-center">
                  <ApperIcon name="Sparkles" className="w-4 h-4 mr-1 text-purple-500" />
                  Enable AI categorization assistance
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <Button 
                variant="outline"
                onClick={() => setShowNewTransactionModal(false)}
              >
                Cancel
              </Button>
              <Button>
                Save as Draft
              </Button>
              <Button variant="success">
                Save & Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions