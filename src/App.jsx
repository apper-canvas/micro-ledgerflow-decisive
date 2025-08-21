import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Sidebar from "@/components/organisms/Sidebar"
import Dashboard from "@/components/pages/Dashboard"
import Transactions from "@/components/pages/Transactions"
import Banking from "@/components/pages/Banking"
import Invoicing from "@/components/pages/Invoicing"
import Bills from "@/components/pages/Bills"
import Reports from "@/components/pages/Reports"
import Settings from "@/components/pages/Settings"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="h-screen bg-slate-50 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <Transactions onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/banking" 
                element={
                  <Banking onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/invoicing" 
                element={
                  <Invoicing onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/bills" 
                element={
                  <Bills onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <Reports onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings onMenuClick={() => setSidebarOpen(true)} />
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
    </BrowserRouter>
  )
}

export default App