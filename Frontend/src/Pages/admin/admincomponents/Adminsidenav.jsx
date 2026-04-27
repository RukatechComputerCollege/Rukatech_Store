const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RiHomeOfficeLine } from "react-icons/ri";
import { FaListUl } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits, MdOutlineMessage, MdOutlinePerson3  } from "react-icons/md";
import { FaRegFolder, FaRegStar, FaRegCircleQuestion   } from "react-icons/fa6";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsBarChart } from "react-icons/bs";
import { LiaRibbonSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";

const Adminsidenav = () => {
  return (
    <div style={{padding: '40px 0px 100px 40px'}} className='w-[250px] h-full sticky top-0 bg-[#1E2753] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto'>
      <div className='w-full text-white flex flex-col gap-[1.3em] h-full'>
        <div className='w-full flex flex-col'>
          {/* for dashboard */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to={`/${ADMIN_ROUTE}/dashboard`} className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${ isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]' }` }>
             <RiHomeOfficeLine size={24} />
             <span className='text-[14px]'>Dashboard</span>
            </NavLink>
          </div>
          {/* for orders */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='orders' className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${ isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]' }` }>
             <FaListUl size={24} />
             <span className='text-[14px]'>Orders</span>
            </NavLink>
          </div>
          {/* for products */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='products' className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${ isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]' }`}>
             <MdOutlineProductionQuantityLimits size={24} />
             <span className='text-[14px]'>Products</span>
            </NavLink>
          </div>
          {/* for categories */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='categories' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
             <FaRegFolder  size={24} />
             <span className='text-[14px]'>Categories</span>
            </NavLink>
          </div>
          {/* for customers */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='customer' className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
             <HiOutlineUsers   size={24} />
             <span className='text-[14px]'>Customers</span>
            </NavLink>
          </div>
          {/* for reports */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='reports' className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
             <BsBarChart size={24} />
             <span className='text-[14px]'>Reports</span>
            </NavLink>
          </div>
          {/* for coupons */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='coupons' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
             <FaRegStar size={24} />
             <span className='text-[14px]'>Coupons</span>
            </NavLink>
          </div>
          {/* for inbox */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='coupons' className={({ isActive }) => `w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${ isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
             <MdOutlineMessage size={24} />
             <span className='text-[14px]'>Inbox</span>
            </NavLink>
          </div>
        </div>

        {/* for other information */}
        <div>
          <p className='text-[12px]'>Other Information</p>
          <div className='w-full flex flex-col'>
            {/* for knowledge base */}
            <div className='w-full '>
              <NavLink style={{padding: '10px'}} to='knowledge-base' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
              <FaRegCircleQuestion  size={24} />
              <span className='text-[14px]'>Knowledge Base</span>
              </NavLink>
            </div>
            {/* for knowledge base */}
            <div className='w-full '>
              <NavLink style={{padding: '10px'}} to='products-update' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
              <LiaRibbonSolid   size={24} />
              <span className='text-[14px]'>Products Updates</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* for settings */}
        <div>
          <p className='text-[12px]'>Other Information</p>
          <div className='w-full flex flex-col'>
            {/* for knowledge base */}
            <div className='w-full '>
              <NavLink style={{padding: '10px'}} to='personal-setting' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
              <MdOutlinePerson3   size={24} />
              <span className='text-[14px]'>Personal Settings</span>
              </NavLink>
            </div>
            {/* for knowledge base */}
            <div className='w-full '>
              <NavLink style={{padding: '10px'}} to='setting' className={({ isActive }) =>`w-full flex items-center gap-2 px-4 py-2 rounded-l-md transition-all duration-300 ${isActive ? 'bg-[#F5F6FA] text-[#7E84A3] shadow-md scale-[1.03]' : 'text-white hover:bg-[#2d3864]'}`}>
              <IoSettingsOutline size={24} />
              <span className='text-[14px]'>Global Settings</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Adminsidenav