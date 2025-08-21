import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Banking", href: "/banking", icon: "Building2" },
    { name: "Invoicing", href: "/invoicing", icon: "FileText" },
    { name: "Bills", href: "/bills", icon: "CreditCard" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ]

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.href

    return (
      <NavLink
        to={item.href}
        onClick={isMobile ? onClose : undefined}
        className={({ isActive }) => cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "mr-3 h-5 w-5 transition-colors",
            isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
          )} 
        />
        {item.name}
      </NavLink>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bot" className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-text">LedgerFlow AI</h1>
                <p className="text-xs text-slate-500">Smart Accounting</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              {navigationItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
            
            {/* AI Assistant Panel */}
            <div className="px-4 py-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <ApperIcon name="Sparkles" className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">AI Assistant</span>
                </div>
                <p className="text-xs text-purple-700">
                  95% transactions auto-categorized this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-600 bg-opacity-75 transition-opacity" onClick={onClose} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Bot" className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold gradient-text">LedgerFlow AI</h1>
                    <p className="text-xs text-slate-500">Smart Accounting</p>
                  </div>
                </div>
              </div>
              
              <nav className="mt-8 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <NavItem key={item.name} item={item} isMobile />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar