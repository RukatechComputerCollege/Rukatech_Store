import axios from 'axios'
import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import AdminTopNav from './admincomponents/AdminTopNav'
import AdminProvider from './admincomponents/AdminContext'
import Adminsidenav from './admincomponents/Adminsidenav'
import { Outlet, Route, Routes } from 'react-router-dom'
import HomeAdmin from '../admin/adminPages/HomeAdmin'
import Customer from './adminPages/Customer'

const AdminDashboard = () => {
  document.title = 'Dashboard - RukatechStore'
  const [isSidenavOpen, setIsSidenavOpen] = useState(false)

  const handleMenuToggle = useCallback(() => {
    setIsSidenavOpen(prev => !prev)
  }, [])

  const handleCloseSidenav = useCallback(() => {
    setIsSidenavOpen(false)
  }, [])

  return (
    <div className="w-full h-screen bg-[#F5F6FA] overflow-hidden">
      <AdminProvider>
        <div className="flex flex-col w-full h-full">
          {/* Top Navigation */}
          <AdminTopNav onMenuToggle={handleMenuToggle} isSidenavOpen={isSidenavOpen} />

          {/* Sidebar + Page Content */}
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Sticky Sidebar - Desktop Only */}
            <div className="h-full hidden md:block">
              <Adminsidenav isSidenavOpen={true} onCloseSidenav={handleCloseSidenav} />
            </div>

            {/* Mobile Sidebar - Mobile Only */}
            <div className="md:hidden">
              <Adminsidenav isSidenavOpen={isSidenavOpen} onCloseSidenav={handleCloseSidenav} />
            </div>

            {/* Main Content Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8" style={{padding: '30px'}}>
              <Outlet />
            </div>
          </div>
        </div>
      </AdminProvider>
    </div>
  );
};

export default AdminDashboard