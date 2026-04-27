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
import { IoMdArrowDropright, IoMdClose } from "react-icons/io";
import Fastcart from '../assets/fastcartLogo.png'

const Menubar = ({ closeMenu }) => {

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); 
  }
  const { allCategory } = useContext(CategoryContext);
  const [isOpen, setIsOpen] = useState(false)

  const closeBottomNav = () =>{
    setIsOpen(!isOpen)
  }

  return (
    <div className='w-3/4 fixed top-0 left-0 h-[100vh] overflow-auto z-1000 bg-white text-white border-b-1 border-[#adb7bc46]' style={{padding: '10px 6%'}}>
      <div className='w-full flex flex-col md:flex-row md:items-center justify-between'>
        {/* for All category */}
        <div className='w-auto flex flex-col md:flex-row relative md:items-center text-[#191C1F]'>
          <div className={`${isOpen ? 'block' : 'hidden' }md:hidden`}>
            <div className='w-full flex items-center gap-4 border-b border-[#E4E7E9]' style={{paddingBottom: '10px', marginBottom:'10px'}}>
              <IoMdClose className='cursor-pointer' onClick={closeMenu} size={24}/>
              <div className='flex items-center gap-2 cursor-pointer'>
                <img src={Fastcart} alt='logo' />
                <h1 className='logoTxt text-black text-[25px]'>fastcart</h1>
              </div>
            </div>
            <h1>All Category</h1>
            {
                allCategory && (
                  allCategory.map((category, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <IoMdArrowDropright />
                      <a href={`/store/${category.name}`} style={{padding: '10px 0'}} className='categoryText flex justify-between items-center gap-5 text-[#5F6C72] hover:bg-[#F2F4F5] text-[16px] hover:font-bold cursor-pointer'><span>{category.name}</span><RxCaretRight className='categoryCaret opacity-0' size={16}/></a>
                    </div>
                  ))
                )
              }
          </div>
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
          <div>
            <button className='text-[#191C1F] flex gap-[8px] rounded-[2px] items-center' style={{padding: '14px 24px'}}><span><SlEarphonesAlt size={18}/></span><span>Customer Support</span></button>
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

export default Menubar