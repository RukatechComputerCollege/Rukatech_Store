const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RiHomeOfficeLine } from "react-icons/ri";
import { FaListUl } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits, MdOutlineMessage, MdOutlinePerson3  } from "react-icons/md";
import { FaRegFolder, FaRegStar, FaRegCircleQuestion   } from "react-icons/fa6";
import { HiOutlineUsers, HiOutlineXMark } from "react-icons/hi2";
import { BsBarChart } from "react-icons/bs";
import { LiaRibbonSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";

const Adminsidenav = ({ isSidenavOpen, onCloseSidenav }) => {
  const handleNavClick = useCallback(() => {
    if (onCloseSidenav) {
      onCloseSidenav();
    }
  }, [onCloseSidenav]);
  return (
    <>
      {/* Mobile Overlay */}
      {isSidenavOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={onCloseSidenav}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 left-0 z-50 md:z-0 h-full bg-[#1E2753] flex flex-col justify-start overflow-x-hidden overflow-y-auto transition-transform duration-300 ${
        isSidenavOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-64'
      }`} style={{padding: '20px 0'}}>
        {/* Close Button Mobile */}
        <button
          onClick={onCloseSidenav}
          className='md:hidden absolute top-4 right-4 p-2 text-white hover:bg-[#2d3864] rounded-lg transition'
          title='Close menu'
        >
          <HiOutlineXMark size={24} />
        </button>

        <div className='w-full text-white flex flex-col gap-3 sm:gap-4 h-full pt-8 md:pt-0'>
          <div className='w-full flex flex-col gap-2'>
          {/* for dashboard */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to={`/${ADMIN_ROUTE}/dashboard`} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${ isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]' }` }>
              <RiHomeOfficeLine size={20} />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* for orders */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to='orders' className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${ isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]' }` }>
              <FaListUl size={20} />
              <span>Orders</span>
            </NavLink>
          </div>

          {/* for products */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to='products' className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${ isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]' }`}>
              <MdOutlineProductionQuantityLimits size={20} />
              <span>Products</span>
            </NavLink>
          </div>

          {/* for flash sales */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to='flash-sales' className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${ isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]' }`}>
              <LiaRibbonSolid size={20} />
              <span>Flash Sales</span>
            </NavLink>
          </div>

          {/* for customers */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to='customer' className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]'}`}>
              <HiOutlineUsers size={20} />
              <span>Customers</span>
            </NavLink>
          </div>

          {/* for reviews */}
          <div className='w-full'>
            <NavLink onClick={handleNavClick} to='reviews' className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mx-2 transition-all duration-300 text-sm sm:text-base ${isActive ? 'bg-[#1E5EFF] text-white shadow-lg' : 'text-white hover:bg-[#2d3864]'}`}>
              <FaRegStar size={20} />
              <span>Reviews</span>
            </NavLink>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Adminsidenav);