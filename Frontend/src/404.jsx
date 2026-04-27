import React from 'react'
import { DotLottieReact  } from '@lottiefiles/dotlottie-react'
import { GoHome } from "react-icons/go";
import { IoIosArrowRoundBack } from "react-icons/io";


const NotFound = () => {
  const goBack = () =>{
    window.history.back()
  }
  const goHome = () =>{
    window.location.href = "/"
  }
  return (
    <div style={{padding: '3%'}} className='w-full flex flex-col gap-4 items-center justify-center'>
      <DotLottieReact
        src="https://lottie.host/547cad08-6ba0-4116-a067-e69fb1630c44/M5qVGY3ZHU.lottie"
        loop
        autoplay
        className='md:w-2/4'
      />
      <h1 className='font-bold text-[#191C1F] text-center text-[26px] md:text-[36px]'>404, Page not found</h1>
      <p className='text-[16px] text-center text-[#475156] md:w-2/4'>Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the page is removed.</p>
      <div className='w-full md:w-3/4 flex md:flex-row flex-col items-center justify-center gap-4'>
        <button onClick={goBack} style={{padding: '10px 24px'}} className='flex items-center gap-2 cursor-pointer hover:bg-[#e46009] transition-all justify-center bg-[#FA8232] text-white rounded-[2px]'><IoIosArrowRoundBack size={24} /><span className='font-bold'>GO BACK</span></button>
        <button onClick={goHome} style={{padding: '10px 24px'}} className='flex items-center gap-2 cursor-pointer hover:bg-[#e46009] transition-all hover:text-white justify-center border-1 border-[#FA8232] text-[#FA8232] bg-white rounded-[2px]'><GoHome size={24}/><span className='font-bold'>GO TO HOME</span></button>
      </div>
    </div>
  )
}

export default NotFound