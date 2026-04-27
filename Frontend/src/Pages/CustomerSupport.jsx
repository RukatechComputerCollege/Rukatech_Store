import React from 'react'
import SupportCard from '../components/SupportCard'
import { BsTruck } from "react-icons/bs";
import DisclosureComponent from '../components/Disclosure';
import ContactCard from '../components/ContactCard';
import { PiPhoneCall, PiChatCircleDotsDuotone } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const CustomerSupport = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
      {/* first component */}
      <div className="w-full flex flex-col-reverse md:flex-row items-center border-b border-[#E4E7E9]" style={{ padding: "30px 6%" }}>
        <div className='w-full md:w-3/4 flex flex-col items-start gap-4'>
          <p className='bg-[#EFD33D] rounded-[2px] text-[#191C1F] font-semibold text-[14px]' style={{padding: '8px 10px'}}>HELP CENTER</p>
          <p className='text-[20px] md:text-[32px] text-[#191C1F] font-semibold'>How we can help you!</p>
          <div className='w-full flex gap-4 items-center rounded-[4px] border border-[#E4E7E9]' style={{padding: '12px'}}>
            <IoSearchOutline size={34} className='text-[#FA8232]'/>
            <input type="text" className='outline-0 w-full' placeholder='Enter your question or keyword'/>
            <button className='bg-[#FA8232] rounded-[2px] text-white cursor-pointer' style={{padding: '10px 24px'}}>SEARCH</button>
          </div>
        </div>
        <DotLottieReact
          src="https://lottie.host/d9962168-be88-47e6-81c5-dad5ea2c6e29/LagtQuIhlb.lottie"
          loop
          autoplay
        />
      </div>
      {/* second component */}
      <div className='w-full flex flex-col gap-4' style={{ padding: "30px 6%" }}>
          <h1 className='text-[20px] md:text-[32px] text-[#191C1F] text-left md:text-center font-semibold'>Popular Topics</h1>
          <div>
              <DisclosureComponent />
          </div>
      </div>
      {/* third component*/}
      <div className='w-full flex flex-col items-center justify-center gap-4' style={{ padding: "30px 6%" }}>
          <h1 className='text-[20px] md:text-[32px] text-[#191C1F] font-semibold'>What can we assist you with today?</h1>
          <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-4'>
              <SupportCard assistText={'Track Order'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Reset Password'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Payment Option'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'User Account'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Wishlist & Compare'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Shipping & Billing'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Shopping Cart & Wallet'} assistIcon={<BsTruck />}/>
              <SupportCard assistText={'Sell on Clicon'} assistIcon={<BsTruck />}/>
          </div>
      </div>
      {/* fourth component */}
      <div className='w-full flex flex-col gap-4 md:items-center md:justify-center bg-[#F2F4F5]' style={{padding: '72px 6%'}}>
          <div>
              <button className='text-white rounded-[2px] bg-[#2DA5F3]' style={{padding: '8px 16px'}}>CONTACT US</button>
          </div>
          <p className='md:text-center text-[20px] md:text-[32px] font-semibold text-[#191C1F]'>Don’t find your answer. <br /> Contact with us</p>
          <div className='w-3/4 grid md:grid-cols-2 md:justify-center md:items-center gap-8'>
              <ContactCard firstcontact={'Call us now'} contactaddress={'+1-202-555-0126'} btnText={'CALL NOW'} bgColor={'#2DA5F3'} cardIcon={<PiPhoneCall size={48}/>}/>
              <ContactCard firstcontact={'Chat with us'} contactaddress={'Support@clicon.com'} btnText={'Contact Us'} bgColor={'#2DB224'} cardIcon={<PiChatCircleDotsDuotone size={48}/>}/>
          </div>
      </div>
    </div>
  )
}

export default CustomerSupport