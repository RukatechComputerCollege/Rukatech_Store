import React from 'react'
import { PiChecksBold } from "react-icons/pi";
import WhoWeAre from '../assets/who-we-are.png'

const AboutUs = () => {
  return (
    <div className='w-full flex flex-col gap-4' style={{padding: '50px 0'}}>
			{/* for who we are */}
			<div className='w-full grid md:grid-cols-2 border-b border-[#E4E7E9] items-center gap-4' style={{ padding: "30px 6%" }}>
				<div className='w-full flex flex-col items-start gap-4'>
					<p className='bg-[#2DA5F3] rounded-[2px] text-white font-semibold text-[14px]' style={{padding: '8px 10px'}}>WHO WE ARE</p>
					<p className='text-[32px] text-[#191C1F] font-semibold'>Fastcart - Larges e-commerce platform in the world.</p>
					<p className='text-[14px] text-[#475156]'>
						At Fastcart, we believe shopping should be fast, easy, and enjoyable. Our platform connects you to a wide range of quality products — from everyday essentials to the latest trends — all at competitive prices.
						We’re more than just an online store; we’re a team committed to delivering convenience, reliability, and value. With secure payment options, swift delivery, and responsive customer support, we’re here to make your shopping experience seamless.
						Whether you’re looking for the best deals or the newest arrivals, Fastcart is your trusted partner for smarter shopping.
					</p>
					<div className='w-full flex flex-col gap-4'>
						<div className='flex gap-2 items-center'>
							<PiChecksBold size={24} className='text-[#2DB224]'/>
							<p className='text-[#191C1F] text-[16px]'>Great 24/7 customer services.</p>
						</div>
						<div className='flex gap-2 items-center'>
							<PiChecksBold size={24} className='text-[#2DB224]'/>
							<p className='text-[#191C1F] text-[16px]'>600+ Dedicated employe.</p>
						</div>
						<div className='flex gap-2 items-center'>
							<PiChecksBold size={24} className='text-[#2DB224]'/>
							<p className='text-[#191C1F] text-[16px]'>50+ Branches all over the world.</p>
						</div>
						<div className='flex gap-2 items-center'>
							<PiChecksBold size={24} className='text-[#2DB224]'/>
							<p className='text-[#191C1F] text-[16px]'>Over 1 Million Electronics Products.</p>
						</div>

					</div>
				</div>
				<div className='w-full justify-self-end'>
					<img className='lg:w-3/4 justify-self-end' src={WhoWeAre} alt='who we are' />
				</div>
			</div>
    </div>
  )
}

export default AboutUs