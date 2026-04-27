import React from 'react'
import { MdFacebook } from "react-icons/md";
import { FaTwitter, FaPinterestP, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Tagnav = () => {
  return (
    <div className='w-full hidden md:block bg-[#1B6392] text-white border-b-1 border-[#adb7bc46]' style={{padding: '10px 6%'}}>
      <div className='w-full flex items-center justify-between'>
        {/* for black friday */}
        <div>
          <p className='text-[14px]'>Welcome to Fastcart Online Store</p>
        </div>

        <div className='flex gap-4 items-center'>
          <div className='flex gap-2 items-center'>
            <p>Follow us:</p>
            <FaTwitter size={16}/>
            <MdFacebook size={16}/>
            <FaPinterestP  size={16}/>
            <FaYoutube  size={16}/>
            <FaInstagram  size={16}/>
          </div>
          |
          <div className='flex gap-2 text-white'>
            <div><p>ENG</p></div>
            <div><p>NGN</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tagnav