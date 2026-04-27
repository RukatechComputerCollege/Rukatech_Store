import React from 'react'

const SupportCard = ({ assistText, assistIcon}) => {
  return (
    <div style={{padding: '24px'}} className='w-full rounded-[4px] cursor-pointer transition-all border-2 border-[#FFE7D6] hover:border-[#FA8232] flex flex-col md:flex-row gap-4 items-center'>
        <span className='text-[#FA8232] text-[32px]'>{assistIcon}</span>
        <p className='text-[16px] text-center md:text-left font-medium text-[#191C1F]'>{assistText}</p>
    </div>
  )
}

export default SupportCard