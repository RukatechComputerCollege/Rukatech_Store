import React from 'react'
import { FiPhoneCall } from "react-icons/fi";
import { RxCaretDown } from "react-icons/rx";
import { CiLocationOn, CiCircleInfo  } from "react-icons/ci";
import { SlEarphonesAlt } from "react-icons/sl";
import { CategoryContext } from '../CategoryContext';
import { useEffect } from 'react';
import { useContext } from 'react';
import { RxCaretRight } from "react-icons/rx";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Bottomnav = () => {

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true); 
  }
  const handleClick2 = () => {
    setIsClicked(false); 
  }
  const { allCategory } = useContext(CategoryContext);

  return (
    <div className='w-full hidden md:block bg-white text-white border-b-1 border-[#adb7bc46]' style={{padding: '10px 8%'}}>
      <div className='w-full flex items-center justify-between'>
        {/* for All category */}
        <div className='w-auto flex relative items-center text-[#191C1F]'>
          <div onMouseEnter={handleClick} onMouseLeave={handleClick2}>
            <div className='relative'>
              <button  className={`bg-[#F2F4F5] active:bg-[#FA8232] cursor-pointer text-[#191C1F] flex gap-[8px] rounded-[2px] items-center ${isClicked ? 'bg-[#FA8232] text-white' : ''}`} style={{padding: '14px 24px'}}><span>All Category</span><span><RxCaretDown className={isClicked ? 'rotateCaret' : ''} size={18}/></span></button>
            </div>
            <div style={{padding: '10px 0'}} className='absolute top-[130%] left-0 z-50 bg-white shadow-sm rounded-[3px]'>
              {
                allCategory && (
                  allCategory.map((category, index) => (
                    <div key={index} className={isClicked ? 'block' : 'hidden'}>
                      <a href={`/store/${category.name}`} style={{padding: '10px 25px'}} className='categoryText flex justify-between items-center gap-5 text-[#5F6C72] hover:bg-[#F2F4F5] text-[16px] hover:font-bold cursor-pointer'><span>{category.name}</span><RxCaretRight className='categoryCaret opacity-0' size={16}/></a>
                    </div>
                  ))
                )
              }
            </div>
          </div>
          {/* link for order tracking */}
          <div>
            <NavLink
              to="/order-tracking"
              className={({ isActive }) =>
                `cursor-pointer flex gap-[8px] items-center ${
                  isActive ? "text-[#FA8232] font-semibold" : "text-[#191C1F]"
                }`
              }
            >
              {({ isActive }) => (
                <button
                  className={`flex gap-[8px] items-center cursor-pointer ${
                    isActive ? "text-[#FA8232] font-semibold" : "text-[#191C1F]"
                  }`}
                  style={{ padding: "14px 24px" }}
                >
                  <span>
                    <CiLocationOn size={18} />
                  </span>
                  <span>Track Order</span>
                </button>
              )}
            </NavLink>
          </div>
          {/* link for customer support */}
          <div>
            <NavLink
              to="/customer-support"
              className={({ isActive }) =>
                `cursor-pointer flex gap-[8px] items-center ${
                  isActive ? "text-[#FA8232] font-semibold" : "text-[#191C1F]"
                }`
              }
            >
              {({ isActive }) => (
                <button
                  className={`flex gap-[8px] items-center cursor-pointer ${
                    isActive ? "text-[#FA8232] font-semibold" : "text-[#191C1F]"
                  }`}
                  style={{ padding: "14px 24px" }}
                >
                  <span>
                    <SlEarphonesAlt size={18} />
                  </span>
                  <span>Customer Support</span>
                </button>
              )}
            </NavLink>
          </div>
          <div>
            <button className='text-[#191C1F] flex gap-[8px] rounded-[2px] items-center' style={{padding: '14px 24px'}}><span><CiCircleInfo  size={18}/></span><span>Need Help</span></button>
          </div>
        </div>

        <div className='flex gap-4 items-center font-bold w-auto text-[#191C1F]'>
          <FiPhoneCall />
          <h1>+1-202-555-0104</h1>
        </div>
      </div>
    </div>
  )
}

export default Bottomnav