const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Fastcart from '../AdminAsset/fastcartLogo.png'
import { MdOutlineMessage } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AdminContext } from './AdminContext';
import { FaCaretDown } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';


const AdminTopNav = () => {

  const [adminImg, setAdminImg] = useState(false)
  const { adminDetails } = useContext(AdminContext)
  const [menuShow, setMenuShow] = useState(false)

  const logAdminOut = () =>{

    let adminToken = localStorage.getItem('adminToken')
    let userToken = localStorage.getItem('userToken')

    let removeAdminToken = localStorage.removeItem('adminToken')
    let removeUserToken = localStorage.removeItem('userToken')
    if(adminToken || userToken){
      setMenuShow(false)
      toast.success('Admin has Successfully Logged Out!');
      setTimeout(() =>{
  window.location.href = `/${ADMIN_ROUTE}/login`
      }, 3000)
    }
    
  }

  return (
    <div className='w-full bg-[#070B1D] sticky top-0 left-0'>
      <div style={{padding: '10px 20px'}} className='w-full relative grid grid-cols-2 justify-between items-center'>
        {/* for the left part of the top nav bar */}
        <div className='w-full flex gap-[3em] items-center'>
          {/* for the logo */}
          <div className='flex items-center gap-2'>
            <img src={Fastcart} alt='logo' />
            <h1 className='logoTxt text-white text-[25px]'>fastcart</h1>
          </div>
          {/* for the search bar */}
          <div className='flex items-center gap-1 text-white'>
            <FiSearch size={24} />
            <input type="text" placeholder='search...' className='border-0 focus:outline-0' style={{padding: '10px'}}/>
          </div>
        </div>
        {/* for the right part of the top navbar */}
        <div className='justify-self-end relative'>
          <div className='w-full flex items-center gap-3 text-white'>
            {/* for the message icon */}
            <div>
              <MdOutlineMessage size={24} />
            </div>
            {/* for the notification icon */}
            <div>
              <IoMdNotificationsOutline size={24}/>
            </div>
            <div onMouseLeave={() => setMenuShow(false)} onMouseEnter={() => setMenuShow(true)} className='cursor-pointer flex items-center gap-2'>
              <div>
                {adminImg ? <img src='' /> : 
                  <div className='w-[36px] h-[36px] rounded-[50%] bg-[#1FD286] text-white font-bold flex items-center justify-center'>A</div>
                }
              </div>
              <div>
                {!adminDetails ? 'loading...' : adminDetails.username}
              </div>
              <div>
                <FaCaretDown size={24}/>
              </div>
              <div style={{padding: '20px'}} className={ menuShow ? `absolute top-[130%] shadow-sm right-0 bg-[#f5f6fa] rounded-[4px` : 'hidden'}>
                <div onClick={logAdminOut} style={{padding: '15px 20px'}} className='cursor-pointer flex items-center rounded-[4px] text-white gap-2 bg-[#070B1D]'><IoIosLogOut size={24} /><span>Log Out</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <ToastContainer />
    </div>
  )
}

export default AdminTopNav