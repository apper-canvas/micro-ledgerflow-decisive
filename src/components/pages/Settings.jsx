import React, { useState } from "react"
import Header from "@/components/organisms/Header"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("company")
  const [settings, setSettings] = useState({
    companyName: "My Business Inc",
    email: "admin@mybusiness.com",
    currency: "USD",
    fiscalYearStart: "01-01",
    taxId: "123-456-789",
    defaultTaxRate: "10"
  })

  const tabs = [
    { id: "company", name: "Company Profile", icon: "Building2" },
    { id: "accounting", name: "Accounting", icon: "Calculator" },
    { id: "tax", name: "Tax Settings", icon: "Receipt" },
    { id: "integrations", name: "Integrations", icon: "Link" },
    { id: "ai", name: "AI Settings", icon: "Sparkles" },
    { id: "security", name: "Security", icon: "Shield" }
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <Header
        title="Settings"
        subtitle="Configure your accounting system and preferences"
        breadcrumb={["System", "Settings"]}
        actions={
          <div className="flex items-center space-x-3">
            <Badge variant="success" className="flex items-center">
              <ApperIcon name="Check" className="w-4 h-4 mr-1" />
              All Systems Active
            </Badge>
            <Button icon="Save">
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {activeTab === "company" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Company Name" required>
                      <Input 
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      />
                    </FormField>
                    
                    <FormField label="Email Address" required>
                      <Input 
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleSettingChange("email", e.target.value)}
                      />
                    </FormField>
                    
                    <FormField label="Phone Number">
                      <Input placeholder="+1 (555) 123-4567" />
                    </FormField>
                    
                    <FormField label="Tax ID Number">
                      <Input 
                        value={settings.taxId}
                        onChange={(e) => handleSettingChange("taxId", e.target.value)}
                      />
                    </FormField>
                  </div>
                  
                  <FormField label="Business Address" className="mt-4">
                    <textarea 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter your business address"
                    />
                  </FormField>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Business Logo</h4>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <Button variant="outline" icon="Upload">
                        Upload Logo
                      </Button>
                      <p className="text-xs text-slate-500 mt-1">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "accounting" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Accounting Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Base Currency" required type="select">
                      <Select 
                        value={settings.currency}
                        onChange={(e) => handleSettingChange("currency", e.target.value)}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </Select>
                    </FormField>
                    
                    <FormField label="Fiscal Year Start" required type="select">
                      <Select 
                        value={settings.fiscalYearStart}
                        onChange={(e) => handleSettingChange("fiscalYearStart", e.target.value)}
                      >
                        <option value="01-01">January 1st</option>
                        <option value="04-01">April 1st</option>
                        <option value="07-01">July 1st</option>
                        <option value="10-01">October 1st</option>
                      </Select>
                    </FormField>
                    
                    <FormField label="Date Format" type="select">
                      <Select>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </Select>
                    </FormField>
                    
                    <FormField label="Number Format" type="select">
                      <Select>
                        <option value="1,234.56">1,234.56</option>
                        <option value="1.234,56">1.234,56</option>
                        <option value="1 234.56">1 234.56</option>
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Chart of Accounts</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Account Numbering</p>
                        <p className="text-sm text-slate-600">Enable automatic account numbering</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Multi-Currency</p>
                        <p className="text-sm text-slate-600">Allow transactions in foreign currencies</p>
                      </div>
                      <input type="checkbox" className="rounded border-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tax" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Tax System" required type="select">
                      <Select>
                        <option value="GST">GST (Goods & Services Tax)</option>
                        <option value="VAT">VAT (Value Added Tax)</option>
                        <option value="Sales Tax">Sales Tax</option>
                        <option value="None">No Tax System</option>
                      </Select>
                    </FormField>
                    
                    <FormField label="Default Tax Rate (%)" required>
                      <Input 
                        type="number"
                        value={settings.defaultTaxRate}
                        onChange={(e) => handleSettingChange("defaultTaxRate", e.target.value)}
                        step="0.1"
                      />
                    </FormField>
                    
                    <FormField label="Tax Registration Number">
                      <Input placeholder="GST/VAT Registration Number" />
                    </FormField>
                    
                    <FormField label="Tax Filing Frequency" type="select">
                      <Select>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Tax Rates</h4>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Standard Rate", rate: "10.0%" },
                      { name: "Reduced Rate", rate: "5.0%" },
                      { name: "Zero Rate", rate: "0.0%" }
                    ].map((tax, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{tax.name}</p>
                          <p className="text-sm text-slate-600">{tax.rate}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button variant="outline" icon="Plus" className="w-full">
                      Add Tax Rate
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center mb-3">
                    <ApperIcon name="Sparkles" className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-purple-900">AI-Powered Features</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    Configure artificial intelligence settings to automate your accounting processes.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Transaction Processing</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto-Categorization</p>
                        <p className="text-sm text-slate-600">Automatically categorize transactions using AI</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">95% accuracy</span>
                        <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Smart Matching</p>
                        <p className="text-sm text-slate-600">Match bank transactions to invoices automatically</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">92% accuracy</span>
                        <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Anomaly Detection</p>
                        <p className="text-sm text-slate-600">Flag unusual transactions for review</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">OCR & Document Processing</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Receipt OCR</p>
                        <p className="text-sm text-slate-600">Extract data from receipt images</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">98% accuracy</span>
                        <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Invoice Processing</p>
                        <p className="text-sm text-slate-600">Auto-extract vendor invoice data</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">AI Learning</h4>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900">Model Training Data</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Allow AI to learn from your corrections to improve accuracy over time.
                    </p>
                    <Button variant="outline" size="sm" icon="Download">
                      Export Training Data
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Bank Connections</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name="Building2" className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Chase Business Banking</p>
                          <p className="text-sm text-slate-600">Connected • Last sync: 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="success">Connected</Badge>
                        <Button variant="outline" size="sm">Settings</Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" icon="Plus" className="w-full">
                      Connect Another Bank
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-medium text-slate-900 mb-4">Third-Party Integrations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Stripe", description: "Payment processing", connected: true },
                      { name: "PayPal", description: "Online payments", connected: false },
                      { name: "Square", description: "POS system", connected: false },
                      { name: "Shopify", description: "E-commerce platform", connected: true }
                    ].map((integration) => (
                      <div key={integration.name} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{integration.name}</h4>
                          <Badge variant={integration.connected ? "success" : "default"}>
                            {integration.connected ? "Connected" : "Available"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{integration.description}</p>
                        <Button 
                          variant={integration.connected ? "outline" : "default"} 
                          size="sm" 
                          className="w-full"
                        >
                          {integration.connected ? "Configure" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                      <input type="checkbox" className="rounded border-slate-300" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto-Logout</p>
                        <p className="text-sm text-slate-600">Automatically log out after inactivity</p>
                      </div>
                      <Select className="w-32">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>Never</option>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Data & Backup</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Automatic Backups</p>
                        <p className="text-sm text-slate-600">Daily encrypted backups to cloud</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="success">Active</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="font-medium text-slate-900 mb-2">Data Export</p>
                      <p className="text-sm text-slate-600 mb-3">
                        Export all your data in standard accounting formats.
                      </p>
                      <Button variant="outline" size="sm" icon="Download">
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Audit Trail</h4>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900">Activity Logging</span>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      All user actions and changes are automatically logged for compliance.
                    </p>
                    <Button variant="outline" size="sm" icon="Eye">
                      View Audit Log
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings