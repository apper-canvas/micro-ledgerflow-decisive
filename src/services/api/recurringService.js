import recurringSchedulesData from "@/services/mockData/recurringSchedules.json"

class RecurringService {
  constructor() {
    this.schedules = [...recurringSchedulesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.schedules].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
  }

  async getById(id) {
    await this.delay(200)
    return this.schedules.find(schedule => schedule.Id === parseInt(id))
  }

  async getActive() {
    await this.delay(250)
    return this.schedules.filter(schedule => schedule.isActive)
  }

  async getUpcoming(days = 30) {
    await this.delay(250)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    
    return this.schedules.filter(schedule => {
      const nextDate = new Date(schedule.nextDate)
      return schedule.isActive && nextDate <= futureDate
    })
  }

  async create(scheduleData) {
    await this.delay(400)
    
    const nextDate = this.calculateNextDate(scheduleData.startDate, scheduleData.frequency)
    
    const newSchedule = {
      ...scheduleData,
      Id: Math.max(...this.schedules.map(s => s.Id)) + 1,
      nextDate: nextDate.toISOString(),
      lastGenerated: null,
      totalGenerated: 0,
      createdAt: new Date().toISOString(),
      isActive: scheduleData.isActive !== false
    }
    
    this.schedules.push(newSchedule)
    return newSchedule
  }

  async update(id, scheduleData) {
    await this.delay(300)
    const index = this.schedules.findIndex(schedule => schedule.Id === parseInt(id))
    if (index !== -1) {
      // Recalculate next date if frequency or start date changed
      if (scheduleData.frequency || scheduleData.startDate) {
        const currentSchedule = this.schedules[index]
        const baseDate = scheduleData.startDate || currentSchedule.startDate
        const frequency = scheduleData.frequency || currentSchedule.frequency
        scheduleData.nextDate = this.calculateNextDate(baseDate, frequency).toISOString()
      }
      
      this.schedules[index] = { ...this.schedules[index], ...scheduleData }
      return this.schedules[index]
    }
    throw new Error("Schedule not found")
  }

  async delete(id) {
    await this.delay(200)
    const index = this.schedules.findIndex(schedule => schedule.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.schedules.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Schedule not found")
  }

  async generateNow(id) {
    await this.delay(500)
    const schedule = this.schedules.find(s => s.Id === parseInt(id))
    if (!schedule) throw new Error("Schedule not found")
    
    // Update schedule with generation info
    await this.update(id, {
      lastGenerated: new Date().toISOString(),
      totalGenerated: schedule.totalGenerated + 1,
      nextDate: this.calculateNextDate(schedule.nextDate, schedule.frequency).toISOString()
    })
    
    return {
      success: true,
      invoiceId: Math.floor(Math.random() * 1000) + 1000,
      message: "Invoice generated successfully"
    }
  }

  async processScheduledInvoices() {
    await this.delay(800)
    const today = new Date()
    const dueSchedules = this.schedules.filter(schedule => {
      return schedule.isActive && new Date(schedule.nextDate) <= today
    })
    
    let processed = 0
    for (const schedule of dueSchedules) {
      await this.generateNow(schedule.Id)
      processed++
    }
    
    return { processed, total: dueSchedules.length }
  }

  calculateNextDate(baseDate, frequency) {
    const date = new Date(baseDate)
    
    switch (frequency) {
      case "weekly":
        date.setDate(date.getDate() + 7)
        break
      case "monthly":
        date.setMonth(date.getMonth() + 1)
        break
      case "quarterly":
        date.setMonth(date.getMonth() + 3)
        break
      case "yearly":
        date.setFullYear(date.getFullYear() + 1)
        break
      default:
        date.setMonth(date.getMonth() + 1) // Default to monthly
    }
    
    return date
  }

  async getSchedulesByDateRange(startDate, endDate) {
    await this.delay(250)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return this.schedules.filter(schedule => {
      const nextDate = new Date(schedule.nextDate)
      return schedule.isActive && nextDate >= start && nextDate <= end
    })
  }

  async getStatistics() {
    await this.delay(200)
    const active = this.schedules.filter(s => s.isActive).length
    const total = this.schedules.length
    const monthlyRevenue = this.schedules
      .filter(s => s.isActive)
      .reduce((sum, s) => sum + (s.amount || 0), 0)
    
    return {
      totalSchedules: total,
      activeSchedules: active,
      pausedSchedules: total - active,
      estimatedMonthlyRevenue: monthlyRevenue
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new RecurringService()