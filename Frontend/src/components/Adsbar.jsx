import React from 'react'
import { useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const Adsbar = () => {

  const [isAdsOpen, setIsAdsOpen] = useState(true);
  const closeAds = () => {
    setIsAdsOpen(false);
  }

  return (
    <div className='w-full bg-[#191C1F] relative' style={{padding: '10px 6%', ...(isAdsOpen ? {} : {display: 'none'}) }}>
      <div className='w-full flex items-center justify-between'>
        {/* for black friday */}
        <div>
          <p className='text-[14px] flex gap-2 items-center'><span className='bg-[#F3DE6D] text-[#191C1F]' style={{padding: '5px 10px', transform: 'rotate(-2deg)'}}>Black</span><span className='text-white'>Friday</span></p>
        </div>
        {/* for discount */}
        <div>
          <p className='text-[14px] text-white flex items-center gap-1'>Up to <span className='text-[#EBC80C] text-[20px]'> 59% </span> OFF</p>
        </div>
        {/* for shop now */}
        <div className='hidden md:flex'>
          <p className='flex gap-2 bg-[#EBC80C] text-[#191C1F] items-center rounded-[2px]' style={{padding: '5px'}}><span>SHOP Now</span><FaArrowRightLong  className='hidden md:flex'/></p>
        </div>
        <div className='absolute right-[10px]'>
          <p onClick={closeAds} className='flex gap-2 bg-[#303639] text-white items-center rounded-[2px] cursor-pointer' style={{padding: '5px'}}><IoClose /></p>
        </div>
      </div>
    </div>
  )
}

export default Adsbar