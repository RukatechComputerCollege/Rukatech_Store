const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'
import Fastcart from '../AdminAsset/fastcartLogo.png'
import { MdOutlineMessage } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AdminContext } from './AdminContext';
import { FaCaretDown } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { toast, ToastContainer } from 'react-toastify';

const AdminTopNav = ({ onMenuToggle, isSidenavOpen }) => {
  const [adminImg, setAdminImg] = useState(false)
  const { adminDetails } = useContext(AdminContext)
  const [menuShow, setMenuShow] = useState(false)

  const logAdminOut = useCallback(() => {
    const adminToken = localStorage.getItem('adminToken')
    const userToken = localStorage.getItem('userToken')

    localStorage.removeItem('adminToken')
    localStorage.removeItem('userToken')
    if(adminToken || userToken){
      setMenuShow(false)
      toast.success('Admin has Successfully Logged Out!')
      setTimeout(() => {
        window.location.href = `/${ADMIN_ROUTE}/login`
      }, 3000)
    }
  }, [])

  const handleMenuToggle = useCallback(() => {
    if (onMenuToggle) {
      onMenuToggle()
    }
  }, [onMenuToggle])

  return (
    <>
      <div className='w-full bg-[#070B1D] sticky top-0 left-0 z-40 shadow-md'>
        <div className='w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between'>
          {/* Left Section */}
          <div className='flex items-center gap-2 sm:gap-3 md:gap-6'>
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={handleMenuToggle}
              className='md:hidden p-2 text-white hover:bg-[#1E2753] rounded-lg transition'
              title='Toggle Menu'
            >
              <HiOutlineBars3 size={24} />
            </button>

            {/* Logo */}
            <div className='flex items-center gap-1 sm:gap-2 flex-shrink-0'>
              <img src={Fastcart} alt='logo' className='w-6 h-6 sm:w-8 sm:h-8' />
              <h1 className='logoTxt text-white text-lg sm:text-xl md:text-2xl font-bold'>Rukatech</h1>
            </div>

            {/* Search Bar - Hidden on Mobile */}
            <div className='hidden md:flex items-center gap-2 bg-[#1E2753] rounded-lg px-4 py-2 flex-1 max-w-sm'>
              <FiSearch size={20} className='text-[#7E84A3]' />
              <input
                type="text"
                placeholder='Search...'
                className='bg-transparent border-0 focus:outline-none text-white placeholder-[#7E84A3] text-sm'
              />
            </div>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-2 sm:gap-4 text-white'>
            {/* Message Icon */}
            <button
              className='p-2 hover:bg-[#1E2753] rounded-lg transition hidden sm:block'
              title='Messages'
            >
              <MdOutlineMessage size={20} />
            </button>

            {/* Notification Icon */}
            <button
              className='p-2 hover:bg-[#1E2753] rounded-lg transition hidden sm:block'
              title='Notifications'
            >
              <IoMdNotificationsOutline size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className='relative'>
              <button
                onClick={() => setMenuShow(!menuShow)}
                className='flex items-center gap-2 p-2 hover:bg-[#1E2753] rounded-lg transition'
              >
                <div className='w-8 h-8 rounded-full bg-[#1FD286] text-white font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0'>
                  A
                </div>
                <span className='hidden sm:inline text-sm font-medium truncate max-w-24'>
                  {!adminDetails ? '...' : adminDetails.username}
                </span>
                <FaCaretDown size={16} className={`hidden sm:block transition ${menuShow ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu - Click outside to close */}
              {menuShow && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setMenuShow(false)}
                  />
                  {/* Dropdown */}
                  <div className='absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl overflow-hidden min-w-48 z-50'>
                    <button
                      onClick={() => {
                        logAdminOut()
                        setMenuShow(false)
                      }}
                      className='w-full flex items-center gap-3 px-4 py-3 text-[#070B1D] hover:bg-[#F5F6FA] transition text-sm font-medium'
                    >
                      <IoIosLogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default React.memo(AdminTopNav);