import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Header = ({ title, subtitle, onMenuClick, actions, breadcrumb }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-4"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>

          <div>
            {breadcrumb && (
              <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ApperIcon name="ChevronRight" className="w-4 h-4" />}
                    <span className={index === breadcrumb.length - 1 ? "text-slate-900 font-medium" : "hover:text-slate-700"}>
                      {item}
                    </span>
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header