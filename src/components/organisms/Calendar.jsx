import React, { useState, useMemo } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formatDate, formatCurrency } from "@/utils/formatters"
import { toast } from "react-toastify"

const Calendar = ({ schedules = [], onScheduleClick, onToggle, onGenerate, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month") // month, week

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    // Create calendar grid
    const days = []
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i)
      })
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day)
      })
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      })
    }
    
    return days
  }, [currentDate])

  const getSchedulesForDate = (date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.nextDate)
      return scheduleDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-6 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                icon="ChevronLeft"
                onClick={() => navigateMonth(-1)}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToToday}
              >
                Today
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                icon="ChevronRight"
                onClick={() => navigateMonth(1)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === "month" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button 
              variant={view === "week" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center">
              <span className="text-xs font-medium text-slate-500 uppercase">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => {
            const daySchedules = getSchedulesForDate(day.fullDate)
            const isToday = day.fullDate.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={index}
                className={`min-h-24 p-1 border border-slate-100 rounded transition-colors hover:bg-slate-50 ${
                  !day.isCurrentMonth ? 'bg-slate-50' : ''
                } ${isToday ? 'bg-primary-50 border-primary-200' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-slate-400' : 
                  isToday ? 'text-primary-600' : 'text-slate-700'
                }`}>
                  {day.date}
                </div>
                
                <div className="space-y-1">
                  {daySchedules.slice(0, 2).map(schedule => (
                    <div
                      key={schedule.Id}
                      onClick={() => onScheduleClick?.(schedule)}
                      className={`p-1 text-xs rounded cursor-pointer transition-colors ${
                        schedule.isActive 
                          ? 'bg-primary-100 text-primary-800 hover:bg-primary-200' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <div className="font-medium truncate">{schedule.name}</div>
                      <div className="truncate">{formatCurrency(schedule.amount)}</div>
                    </div>
                  ))}
                  
                  {daySchedules.length > 2 && (
                    <div className="text-xs text-slate-500 text-center">
                      +{daySchedules.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Schedule Detail Modal */}
      {onScheduleClick && (
        <ScheduleDetailModal 
          schedules={schedules}
          onToggle={onToggle}
          onGenerate={onGenerate}
        />
      )}
    </div>
  )
}

// Schedule Detail Modal (simplified)
const ScheduleDetailModal = ({ schedules, onToggle, onGenerate }) => {
  // This would be expanded to show schedule details
  return null
}

export default Calendar