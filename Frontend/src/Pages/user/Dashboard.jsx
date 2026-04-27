import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserAccountContext } from './UserContext';
import DashboardSidenav from './UserComponents/DashboardSidenav';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosClose } from "react-icons/io";

const Dashboard = () => {
  const { userData } = useContext(UserAccountContext);
  const [isOpen, setIsOpen] = useState(false);
  document.title = 'Dashboard | Fastcart Online Store'
  return (
    <div style={{ padding: "40px 6%" }} className="w-full h-auto items-start flex flex-col lg:flex-row gap-5 overflow-x-hidden relative">
      
      {/* Hamburger button (only on small screens) */}
      <button 
        className="lg:hidden z-50 text-[#FA8232]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && <GiHamburgerMenu size={28}/>}
      </button>

      {/* Sidebar as a drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[264px] bg-white shadow-lg z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:static lg:translate-x-0`}
      >
        <DashboardSidenav />
      </div>

      {/* Dark overlay when sidebar is open (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0000004b] bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 h-auto overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
