import invoicesData from "@/services/mockData/invoices.json"

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData]
  }

  async getAll() {
    await this.delay(350)
    // Sort by date descending
    return [...this.invoices].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getById(id) {
    await this.delay(200)
    return this.invoices.find(invoice => invoice.Id === parseInt(id))
  }

  async getByStatus(status) {
    await this.delay(300)
    return this.invoices.filter(invoice => invoice.status === status)
  }

  async getOverdue() {
    await this.delay(300)
    const today = new Date()
    return this.invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate)
      return invoice.status !== "paid" && dueDate < today
    })
  }

  async create(invoiceData) {
    await this.delay(450)
    
    // Calculate totals
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (invoiceData.taxRate || 0)
    const total = subtotal + taxAmount
    
    const newInvoice = {
      ...invoiceData,
      Id: Math.max(...this.invoices.map(i => i.Id)) + 1,
      number: `INV-${new Date().getFullYear()}-${String(Math.max(...this.invoices.map(i => i.Id)) + 1).padStart(3, "0")}`,
      subtotal,
      taxAmount,
      total,
      status: "draft"
    }
    
    this.invoices.push(newInvoice)
    return newInvoice
  }

  async update(id, invoiceData) {
    await this.delay(400)
    const index = this.invoices.findIndex(invoice => invoice.Id === parseInt(id))
    if (index !== -1) {
      // Recalculate totals if line items changed
      if (invoiceData.lineItems) {
        const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
        const taxAmount = subtotal * (invoiceData.taxRate || 0)
        const total = subtotal + taxAmount
        
        invoiceData.subtotal = subtotal
        invoiceData.taxAmount = taxAmount
        invoiceData.total = total
      }
      
      this.invoices[index] = { ...this.invoices[index], ...invoiceData }
      return this.invoices[index]
    }
    throw new Error("Invoice not found")
  }

  async delete(id) {
    await this.delay(300)
    const index = this.invoices.findIndex(invoice => invoice.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.invoices.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Invoice not found")
  }

  async send(id) {
    await this.delay(400)
    return await this.update(id, { status: "sent" })
  }

  async markPaid(id) {
    await this.delay(350)
    return await this.update(id, { status: "paid" })
  }

async getAgingSummary() {
    await this.delay(300)
    const today = new Date()
    
    const aging = {
      current: 0,
      overdue1_30: 0,
      overdue31_60: 0,
      overdue61_90: 0,
      overdue90Plus: 0
    }
    
    this.invoices
      .filter(inv => inv.status !== "paid")
      .forEach(invoice => {
        const dueDate = new Date(invoice.dueDate)
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        
        if (daysOverdue <= 0) {
          aging.current += invoice.total
        } else if (daysOverdue <= 30) {
          aging.overdue1_30 += invoice.total
        } else if (daysOverdue <= 60) {
          aging.overdue31_60 += invoice.total
        } else if (daysOverdue <= 90) {
          aging.overdue61_90 += invoice.total
        } else {
          aging.overdue90Plus += invoice.total
        }
      })
    
    return aging
  }

  async getAgingWithDetails() {
    await this.delay(350)
    const today = new Date()
    
    const aging = {
      current: { amount: 0, invoices: [] },
      overdue1_30: { amount: 0, invoices: [] },
      overdue31_60: { amount: 0, invoices: [] },
      overdue61_90: { amount: 0, invoices: [] },
      overdue90Plus: { amount: 0, invoices: [] }
    }
    
    this.invoices
      .filter(inv => inv.status !== "paid")
      .forEach(invoice => {
        const dueDate = new Date(invoice.dueDate)
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        
        const invoiceWithAging = {
          ...invoice,
          daysOverdue: Math.max(0, daysOverdue),
          isOverdue: daysOverdue > 0
        }
        
        if (daysOverdue <= 0) {
          aging.current.amount += invoice.total
          aging.current.invoices.push(invoiceWithAging)
        } else if (daysOverdue <= 30) {
          aging.overdue1_30.amount += invoice.total
          aging.overdue1_30.invoices.push(invoiceWithAging)
        } else if (daysOverdue <= 60) {
          aging.overdue31_60.amount += invoice.total
          aging.overdue31_60.invoices.push(invoiceWithAging)
        } else if (daysOverdue <= 90) {
          aging.overdue61_90.amount += invoice.total
          aging.overdue61_90.invoices.push(invoiceWithAging)
        } else {
          aging.overdue90Plus.amount += invoice.total
          aging.overdue90Plus.invoices.push(invoiceWithAging)
        }
      })
    
    return aging
  }

// Template Management
  async getAllTemplates() {
    await this.delay(200)
    const templates = JSON.parse(localStorage.getItem('invoiceTemplates') || '[]')
    return templates.length ? templates : [
      {
        Id: 1,
        name: "Standard Service Invoice",
        description: "Default template for service invoices",
        isDefault: true,
        lineItems: [{ description: "Service Description", quantity: 1, rate: 0, amount: 0 }],
        taxRate: 0.1,
        paymentTerms: "Net 30",
        notes: "Thank you for your business!"
      }
    ]
  }

  async createTemplate(templateData) {
    await this.delay(300)
    const templates = await this.getAllTemplates()
    const newTemplate = {
      ...templateData,
      Id: Math.max(0, ...templates.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      isDefault: false
    }
    templates.push(newTemplate)
    localStorage.setItem('invoiceTemplates', JSON.stringify(templates))
    return newTemplate
  }

  async updateTemplate(id, templateData) {
    await this.delay(300)
    const templates = await this.getAllTemplates()
    const index = templates.findIndex(t => t.Id === parseInt(id))
    if (index !== -1) {
      templates[index] = { ...templates[index], ...templateData }
      localStorage.setItem('invoiceTemplates', JSON.stringify(templates))
      return templates[index]
    }
    throw new Error("Template not found")
  }

  async deleteTemplate(id) {
    await this.delay(300)
    const templates = await this.getAllTemplates()
    const filtered = templates.filter(t => t.Id !== parseInt(id))
    localStorage.setItem('invoiceTemplates', JSON.stringify(filtered))
    return true
  }

  // Recurring Invoice Management
  async createFromTemplate(templateId, invoiceData) {
    await this.delay(400)
    const templates = await this.getAllTemplates()
    const template = templates.find(t => t.Id === parseInt(templateId))
    if (!template) throw new Error("Template not found")
    
    const templateInvoice = {
      ...template,
      ...invoiceData,
      templateId: template.Id,
      lineItems: template.lineItems.map(item => ({...item}))
    }
    
    return await this.create(templateInvoice)
  }

  async generateRecurringInvoices(scheduleId) {
    await this.delay(500)
    // This would integrate with recurring service to generate invoices
    // For now, return a placeholder response
    return { generated: 0, message: "Recurring invoice generation complete" }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new InvoiceService()