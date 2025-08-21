import React, { useState, useEffect } from "react"
import Header from "@/components/organisms/Header"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Calendar from "@/components/organisms/Calendar"
import recurringService from "@/services/api/recurringService"
import invoiceService from "@/services/api/invoiceService"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { toast } from "react-toastify"

const RecurringScheduler = ({ onMenuClick }) => {
  const [schedules, setSchedules] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewScheduleModal, setShowNewScheduleModal] = useState(false)
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [viewMode, setViewMode] = useState("calendar") // calendar, list, templates
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [schedulesData, templatesData] = await Promise.all([
        recurringService.getAll(),
        invoiceService.getAllTemplates()
      ])
      
      setSchedules(schedulesData)
      setTemplates(templatesData)
    } catch (err) {
      setError(err.message || "Failed to load recurring data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateSchedule = async (scheduleData) => {
    try {
      await recurringService.create(scheduleData)
      toast.success("Recurring schedule created successfully")
      setShowNewScheduleModal(false)
      loadData()
    } catch (err) {
      toast.error(err.message || "Failed to create schedule")
    }
  }

  const handleCreateTemplate = async (templateData) => {
    try {
      await invoiceService.createTemplate(templateData)
      toast.success("Invoice template created successfully")
      setShowNewTemplateModal(false)
      loadData()
    } catch (err) {
      toast.error(err.message || "Failed to create template")
    }
  }

  const handleToggleSchedule = async (scheduleId) => {
    try {
      const schedule = schedules.find(s => s.Id === scheduleId)
      await recurringService.update(scheduleId, { isActive: !schedule.isActive })
      toast.success(schedule.isActive ? "Schedule paused" : "Schedule activated")
      loadData()
    } catch (err) {
      toast.error(err.message || "Failed to update schedule")
    }
  }

  const handleGenerateNow = async (scheduleId) => {
    try {
      await recurringService.generateNow(scheduleId)
      toast.success("Invoice generated successfully")
      loadData()
    } catch (err) {
      toast.error(err.message || "Failed to generate invoice")
    }
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const activeSchedules = schedules.filter(s => s.isActive).length
  const upcomingThisMonth = schedules.filter(s => {
    const nextDate = new Date(s.nextDate)
    const now = new Date()
    return nextDate.getMonth() === now.getMonth() && nextDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Recurring Scheduler"
        subtitle="Automate your recurring invoices and transactions"
        breadcrumb={["Finance", "Recurring Scheduler"]}
        onMenuClick={onMenuClick}
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex bg-white rounded-lg border border-slate-200">
              <Button 
                variant={viewMode === "calendar" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button 
                variant={viewMode === "templates" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("templates")}
              >
                Templates
              </Button>
            </div>
            <Button variant="outline" icon="Plus" onClick={() => setShowNewTemplateModal(true)}>
              New Template
            </Button>
            <Button icon="Plus" onClick={() => setShowNewScheduleModal(true)}>
              New Schedule
            </Button>
          </div>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Schedules</p>
              <p className="text-2xl font-bold gradient-text">{activeSchedules}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">{upcomingThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Templates</p>
              <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileTemplate" className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Est. Monthly</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(schedules.reduce((sum, s) => sum + (s.amount || 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "calendar" && (
        <Calendar 
          schedules={schedules}
          onScheduleClick={setSelectedSchedule}
          onToggle={handleToggleSchedule}
          onGenerate={handleGenerateNow}
          loading={loading}
        />
      )}

      {viewMode === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <SearchBar
              placeholder="Search schedules..."
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {loading ? (
            <Loading variant="table" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Next Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {schedules
                    .filter(schedule => 
                      !searchQuery || 
                      schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      schedule.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((schedule) => (
                    <tr key={schedule.Id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{schedule.name}</div>
                          <div className="text-sm text-slate-500">{schedule.customerName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {schedule.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {formatCurrency(schedule.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatDate(schedule.nextDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {schedule.isActive ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={schedule.isActive ? "Pause" : "Play"}
                            onClick={() => handleToggleSchedule(schedule.Id)}
                          >
                            {schedule.isActive ? 'Pause' : 'Activate'}
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            icon="Zap"
                            onClick={() => handleGenerateNow(schedule.Id)}
                          >
                            Generate Now
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.Id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">{template.name}</h3>
                {template.isDefault && (
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-4">{template.description}</p>
              <div className="text-sm text-slate-500 mb-4">
                <p>Line Items: {template.lineItems?.length || 0}</p>
                <p>Tax Rate: {((template.taxRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" icon="Edit2">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" icon="Copy">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Schedule Modal */}
      {showNewScheduleModal && (
        <NewScheduleModal 
          templates={templates}
          onClose={() => setShowNewScheduleModal(false)}
          onSave={handleCreateSchedule}
        />
      )}

      {/* New Template Modal */}
      {showNewTemplateModal && (
        <NewTemplateModal 
          onClose={() => setShowNewTemplateModal(false)}
          onSave={handleCreateTemplate}
        />
      )}
    </div>
  )
}

// New Schedule Modal Component
const NewScheduleModal = ({ templates, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    templateId: "",
    customerName: "",
    frequency: "monthly",
    amount: 0,
    startDate: new Date().toISOString().split('T')[0],
    isActive: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Create Recurring Schedule</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Schedule Name" required>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Monthly Service Invoice"
              />
            </FormField>
            
            <FormField label="Template" type="select">
              <Select 
                value={formData.templateId}
                onChange={(e) => setFormData(prev => ({...prev, templateId: e.target.value}))}
              >
                <option value="">Select template...</option>
                {templates.map(template => (
                  <option key={template.Id} value={template.Id}>{template.name}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Customer Name" required>
            <Input 
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({...prev, customerName: e.target.value}))}
              placeholder="Customer or Company Name"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Frequency" required type="select">
              <Select 
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({...prev, frequency: e.target.value}))}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </FormField>
            
            <FormField label="Amount">
              <Input 
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({...prev, amount: parseFloat(e.target.value)}))}
                placeholder="0.00"
              />
            </FormField>
            
            <FormField label="Start Date" required>
              <Input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Schedule</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// New Template Modal Component
const NewTemplateModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0.1,
    paymentTerms: "Net 30",
    notes: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Create Invoice Template</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Template Name" required>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Standard Service Template"
              />
            </FormField>
            
            <FormField label="Tax Rate (%)">
              <Input 
                type="number"
                step="0.1"
                value={formData.taxRate * 100}
                onChange={(e) => setFormData(prev => ({...prev, taxRate: parseFloat(e.target.value) / 100}))}
                placeholder="10"
              />
            </FormField>
          </div>

          <FormField label="Description" type="textarea">
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Template description..."
              rows="3"
            />
          </FormField>

          <FormField label="Payment Terms">
            <Input 
              value={formData.paymentTerms}
              onChange={(e) => setFormData(prev => ({...prev, paymentTerms: e.target.value}))}
              placeholder="Net 30"
            />
          </FormField>

          <FormField label="Default Notes" type="textarea">
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Thank you for your business!"
              rows="3"
            />
          </FormField>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Template</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecurringScheduler