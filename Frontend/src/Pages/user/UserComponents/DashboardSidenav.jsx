import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PiStorefrontLight, PiMapPinLineLight, PiShoppingCartSimple, PiArrowsCounterClockwise, PiNotebookLight, PiClockClockwise, PiSignOutLight } from "react-icons/pi";
import { CiHeart } from "react-icons/ci";
import { RiStackLine } from "react-icons/ri";
import { GoGear } from "react-icons/go";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'


const DashboardSidenav = () => {

  let [isOpen, setIsOpen] = useState(false)
  const logOut = () =>{
    localStorage.removeItem("userToken")
    window.location.href = '/dashboard/account'
  }

  return (
    <div style={{padding: '16px 0px'}} className='md:w-[264px] bg-white flex flex-col
     overflow-x-hidden shadow-md'>
      <div className='w-full text-white flex flex-col gap-[1.3em] h-full'>
        <div className='w-full flex flex-col'>
          {/* for dashboard */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/account' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }` }>
             <RiStackLine  size={24} />
             <span className='text-[14px]'>Dashboard</span>
            </NavLink>
          </div>
          {/* for orders */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/order-history' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }`}>
             <PiStorefrontLight  size={24} />
             <span className='text-[14px]'>Order History</span>
            </NavLink>
          </div>
          {/* for products */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/order-tracking' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }` }>
             <PiMapPinLineLight  size={24} />
             <span className='text-[14px]'>Track Order</span>
            </NavLink>
          </div>
          {/* for categories */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/shopping-cart' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }` }>
             <PiShoppingCartSimple   size={24} />
             <span className='text-[14px]'>Shopping Cart</span>
            </NavLink>
          </div>
          {/* for customers */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/wishlist' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }` }>
             <CiHeart size={24} />
             <span className='text-[14px]'>Wishlist</span>
            </NavLink>
          </div>
          {/* for reports */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/compare' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }` }>
             <PiArrowsCounterClockwise  size={24} />
             <span className='text-[14px]'>Compare</span>
            </NavLink>
          </div>
          {/* for coupons */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/card-and-address' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }`}>
             <PiNotebookLight  size={24} />
             <span className='text-[14px]'>Cards & Address</span>
            </NavLink>
          </div>
          {/* for inbox */}
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/browsing-history' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }`}>
             <PiClockClockwise  size={24} />
             <span className='text-[14px]'>Browsing History</span>
            </NavLink>
          </div>
          <div className='w-full '>
            <NavLink style={{padding: '10px'}} to='/dashboard/setting' className={({ isActive }) => `w-full flex items-center gap-2 transition-all duration-300 ${ isActive ? 'bg-[#FA8232] text-[#white] shadow-md scale-[1.03]' : 'text-[#5F6C72] hover:bg-[#FFF3EB]' }`}>
              <GoGear   size={24} />
              <span className='text-[14px]'>Settings</span>
            </NavLink>
          </div>
        {/* for knowledge base */}
          <div className='w-full'>
           <button style={{padding: '10px'}} onClick={() => setIsOpen(true)} className={ `w-full flex items-center gap-2 transition-all duration-300 text-[#5F6C72] cursor-pointer scale-[1.03] hover:bg-[#FFF3EB]`}>
           <PiSignOutLight  size={24} />
           <span className='text-[14px]'>Log Out</span>
          </button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0" />
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel transition className="w-[90%] md:w-2/4 lg:w-[40%] space-y-4 bg-white shadow-lg flex flex-col gap-[1em]" style={{padding: '20px', borderRadius: '4px'}}>
              <DialogTitle className="font-bold text-[#131523] text-[16px">Log Out</DialogTitle>
              <div className='w-full flex flex-col gap-4 items-center justify-center'>
                <h1 className='text-[#191C1F] text-[25px]'>Are you logging out?</h1>
                <p>You can always log in at anytime, click the log out button to confirm or cancel if you're not sure.</p>
                <div className='flex gap-4 items-center'>
                  <button style={{padding: '10px 30px'}} className='cursor-pointer rounded-[30px] text-[#191C1F] border border-[#191C1F] active:bg-[#45494d]' onClick={() => setIsOpen(false)}>Cancel</button>
                  <button style={{padding: '10px 30px'}} className='cursor-pointer rounded-[30px] text-white bg-[#191C1F] active:bg-[#45494d]' onClick={logOut}>Log out</button>
                </div>
              </div>
            </DialogPanel>
          </div>
    </Dialog>
    </div>
  )
}

export default DashboardSidenav