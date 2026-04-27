import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Signin from './Signin'

const Account = () => {
  document.title = 'Account | Fastcart Online Store'
  return (
    <div className='w-full shadow-md flex flex-col items-center justify-center' style={{padding: '40px'}}>
        <div className='w-full md:w-2/4 lg:w-1/4 flex flex-col gap-2 rounded-2 shadow-md' style={{padding: '20px'}}>
            <div className='w-full grid grid-cols-2 items-center text-center justify-center'>
                <NavLink to='/account/login' style={{paddingBottom: '10px'}} className={({ isActive }) => isActive ? 'text-black border-b-2 border-[#FA8232] text-[20px] font-bold' : 'text-[#77878F] text-[20px]'}>Sign In</NavLink>
                <NavLink to='/account/register' style={{paddingBottom: '10px'}} className={({ isActive }) => isActive ? 'text-black border-b-2 border-[#FA8232] text-[20px] font-bold' : 'text-[#77878F] text-[20px]'}>Sign Up</NavLink>
            </div>
            {/* <Signin /> */}
            <Outlet />
        </div>
    </div>
  )
}

export default Account