import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";

const ContactCard = ({firstcontact, contactaddress, btnText, bgColor, cardIcon}) => {
  return (
    <div className='w-full bg-white rounded-[4px] flex flex-col md:flex-row items-start gap-4' style={{padding: '32px'}}>
      <div className='w-[96px] h-[96px] rounded-[4px] bg-[#EAF6FE] flex flex-col items-center justify-center' style={{padding: '24px'}}>
        <span className={`text-[${bgColor}]`}>{cardIcon}</span>
      </div>
      <div className='flex flex-col gap-2'>
        <p className='text-[18px] text-[#191C1F] font-semibold'>{firstcontact}</p>
        <p className='text-[14px] text-[#5F6C72]'>we are available online from 9:00 AM to 5:00 PM (GMT95:45) Talk with use now</p>
        <p className='text-[24px] text-[#191C1F]'>{contactaddress}</p>
        <div>
            <button className={`flex items-center rounded-[2px] gap-2 cursor-pointer bg-[${bgColor}] text-white`} style={{padding: '15px 24px'}}><span>{btnText}</span><IoIosArrowRoundForward size={30}/></button>
        </div>
      </div>
    </div>
  )
}

export default ContactCard