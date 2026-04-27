import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import AdminTopNav from './admincomponents/AdminTopNav'
import AdminProvider from './admincomponents/AdminContext'
import Adminsidenav from './admincomponents/Adminsidenav'
import { Outlet, Route, Routes } from 'react-router-dom'
import HomeAdmin from '../admin/adminPages/HomeAdmin'
import Customer from './adminPages/Customer'



const AdminDashboard = () => {
  document.title = 'Dashboard - Fastcart Online Store'
  return (
    <div className="w-full h-screen bg-[#F5F6FA] overflow-hidden">
      <AdminProvider>
        <div className="flex flex-col w-full h-full">
          {/* Top Navigation */}
          <AdminTopNav />

          {/* Sidebar + Page Content */}
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Sticky Sidebar */}
            <div className="h-full">
              <Adminsidenav />
            </div>

            {/* Main Content Scrollable */}
            <div style={{padding: '30px'}} className="flex-1 overflow-y-auto p-[30px]">
              <Outlet />
            </div>
          </div>
        </div>
      </AdminProvider>
    </div>
  );
};


export default AdminDashboard