import React, { useState } from "react"
import { toast } from 'react-toastify'
import Header from "@/components/organisms/Header"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import KPICard from "@/components/molecules/KPICard"
import SearchBar from "@/components/molecules/SearchBar"
import FormField from "@/components/molecules/FormField"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Empty from "@/components/ui/Empty"
import ReceiptScanner from "@/components/organisms/ReceiptScanner"
const Bills = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showScanner, setShowScanner] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleOpenScanner = () => {
    setShowScanner(true)
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
  }

  const handleSaveBill = (billData) => {
    // In a real app, this would save to the backend/service
    console.log('Saving bill data:', billData)
    toast.success(`Bill from ${billData.vendor} saved successfully!`)
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Bills & Payables"
        subtitle="Manage vendor bills and accounts payable"
        breadcrumb={["Purchases", "Bills"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="warning" className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              3 Due Soon
            </Badge>
            <Button variant="outline" icon="Upload">
              Import Bills
            </Button>
            <Button icon="Plus">
              New Bill
            </Button>
          </div>
        }
      />

      {/* Bills Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Payables"
          value={8500}
          type="currency"
          icon="CreditCard"
          gradient
        />
        
        <KPICard
          title="Due This Week"
          value={2200}
          type="currency"
          icon="Calendar"
          trend="up"
        />
        
        <KPICard
          title="Overdue Bills"
          value={0}
          type="currency"
          icon="AlertTriangle"
        />
        
        <KPICard
          title="This Month"
          value={12}
          type="number"
          icon="FileText"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary-600" />
                <span className="font-medium">Record Bill</span>
              </div>
              <p className="text-xs text-slate-500">Enter a new vendor bill</p>
            </div>
          </Button>
          
<Button variant="outline" className="justify-start p-4 h-auto" onClick={handleOpenScanner}>
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="Scan" className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-medium">OCR Scan</span>
              </div>
              <p className="text-xs text-slate-500">Scan bill with AI</p>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start p-4 h-auto">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <ApperIcon name="CreditCard" className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium">Pay Bills</span>
              </div>
              <p className="text-xs text-slate-500">Process payments</p>
            </div>
          </Button>
        </div>
      </div>

      {/* AI Bill Processing */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ApperIcon name="Sparkles" className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900">AI Bill Processing</h3>
              <p className="text-sm text-purple-700">Automated OCR and data extraction</p>
            </div>
          </div>
          <Button variant="secondary" icon="Settings">
            Configure
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="FileText" className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-slate-900">Bills Processed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">847</p>
            <p className="text-xs text-slate-600">This month</p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Target" className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-slate-900">OCR Accuracy</span>
            </div>
            <p className="text-2xl font-bold gradient-text-success">98.3%</p>
            <p className="text-xs text-slate-600">Field extraction rate</p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-slate-900">Time Saved</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">42hrs</p>
            <p className="text-xs text-slate-600">This month</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search bills..."
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
              <option value="paid">Paid</option>
            </Select>
          </FormField>
          
          <FormField label="Vendor" type="select">
            <Select>
              <option value="all">All Vendors</option>
              <option value="office-supplies">Office Supplies Inc</option>
              <option value="tech-vendor">Tech Solutions</option>
              <option value="utilities">City Utilities</option>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Empty State */}
      <Empty
        title="No bills found"
        message="You haven't recorded any bills yet. Start by adding your first vendor bill or use OCR to scan a receipt."
        icon="FileText"
        action={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button icon="Plus">
              Add Bill
            </Button>
<Button variant="outline" icon="Scan" onClick={handleOpenScanner}>
              Scan Receipt
            </Button>
          </div>
        }
/>

      {/* Receipt Scanner Modal */}
      <ReceiptScanner
        isOpen={showScanner}
        onClose={handleCloseScanner}
        onSave={handleSaveBill}
      />
    </div>
  )
}

export default Bills