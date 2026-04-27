import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";

const Newsletter = () => {
  return (
    <div className='w-full bg-[#1B6392] flex flex-col gap-4 items-center justify-center' style={{padding: '72px 6%'}}>
        <h1 className='text-[32px] text-white font-semibold'>Subscribe to our newsletter</h1>
        <p className='text-[16px] text-white md:w-2/4 text-center'>Subscribe today and enjoy insider access to discounts, shopping tips, and first looks at our newest arrivals.</p>
        <div className='bg-white w-full md:w-2/4 flex flex-col md:flex-row gap-4 items-center rounded-[4px]' style={{padding: '12px 24px'}}>
            <input type="text" className='outline-0 w-full' placeholder='Email address'/>
            <button className='bg-[#FA8232] rounded-[2px] text-white cursor-pointer flex gap-4 items-center' style={{padding: '10px 24px'}}>SUBSCRIBE<IoIosArrowRoundForward size={30}/></button>
        </div>
        <div className='md:w-1/3 border-t border-[#5aa5d7]'></div>
    </div>
  )
}

export default Newsletter