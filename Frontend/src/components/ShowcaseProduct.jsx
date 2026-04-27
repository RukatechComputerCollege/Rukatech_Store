import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { GoArrowRight } from "react-icons/go";
import Xbox from "../assets/xbox.png";
import GooglePixel from "../assets/googlePixel.png";
import Airpod from "../assets/airpod.png";
import { GoPackage, GoCreditCard } from "react-icons/go";
import { PiTrophyThin } from "react-icons/pi";
import { SlEarphonesAlt } from "react-icons/sl";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
// Import Swiper React components
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';

const ShowcaseProduct = ({ promoProduct1, promoProduct2, promoProduct3 }) => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const navigate = useNavigate()
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        <SwiperSlide className='className="w-full h-auto bg-[#F2F4F5] rounded-[6px]' style={{ padding: "40px" }}>
          {!promoProduct1 ? 
            <div className="w-full flex items-center justify-center gap-[2em]">
              {/* for the xbox content */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                  <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                  <span>THE BEST PLACE TO PLAY</span>
                </p>
                <h1 className="text-[48px] text-[#191C1F] leading-[1em]">
                  Xbox Consoles
                </h1>
                <p className="text-[18px] text-[#475156]">
                  Save up to 50% on select Xbox games. Get 3 months of PC Game
                  Pass for $2 USD.
                </p>
                <div>
                  <button
                    className="flex gap-4 text-white bg-[#FA8232] rounded-[3px]"
                    style={{ padding: "20px 32px" }}
                  >
                    <span>SHOP NOW</span> <GoArrowRight size={24} />
                  </button>
                </div>
              </div>
              {/* for the xbox image */}
              <div className="w-full relative">
                <div>
                  <img src={Xbox} alt="" />
                </div>
                <div className="w-[100px] h-[100px] flex flex-col items-center justify-center font-bold absolute top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                  <h1 className="text-[22px]">$299</h1>
                </div>
              </div>
              {/* xbox image end */}
            </div>
          :
            <div className="w-full flex flex-col-reverse md:flex-row md:items-center justify-center gap-[2em]">
                {/* for the xbox content */}
                <div className="w-full flex flex-col gap-4">
                  <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                    <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                    <span>PROMO PRODUCT</span>
                  </p>
                  <h1 className="text-[28px] md:text-[48px] text-[#191C1F] leading-[1em]">
                    {promoProduct1?.name.slice(0,20)}
                  </h1>
                  <p className="text-[18px] text-[#475156]">
                    This is one of our promo product, take advantage of it now before it is sold out
                  </p>
                  <div>
                    <button
                      onClick={()=>navigate(`/product-page/${promoProduct1._id}`)}
                      className="flex gap-4 cursor-pointer text-white bg-[#FA8232] rounded-[3px]"
                      style={{ padding: "20px 32px" }}
                    >
                      <span>SHOP NOW</span> <GoArrowRight size={24} />
                    </button>
                  </div>
                </div>
                {/* for the xbox image */}
                <div className="w-full relative">
                  <div>
                    <img src={promoProduct1?.image[0]} alt="" />
                  </div>
                  <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex flex-col items-center justify-center font-bold absolute top-[0px] md:top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                    <h1 className="md:text-[22px]">₦{promoProduct1.discountprice.toLocaleString()}</h1>
                  </div>
                </div>
                {/* xbox image end */}
            </div>
          }
        </SwiperSlide>
        {/* for second promo product */}
        <SwiperSlide className='className="w-full h-auto bg-[#F2F4F5] rounded-[6px]' style={{ padding: "40px" }}>
          {!promoProduct2 ? 
            <div className="w-full flex items-center justify-center gap-[2em]">
              {/* for the xbox content */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                  <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                  <span>THE BEST PLACE TO PLAY</span>
                </p>
                <h1 className="text-[48px] text-[#191C1F] leading-[1em]">
                  Xbox Consoles
                </h1>
                <p className="text-[18px] text-[#475156]">
                  Save up to 50% on select Xbox games. Get 3 months of PC Game
                  Pass for $2 USD.
                </p>
                <div>
                  <button
                    className="flex gap-4 text-white bg-[#FA8232] rounded-[3px]"
                    style={{ padding: "20px 32px" }}
                  >
                    <span>SHOP NOW</span> <GoArrowRight size={24} />
                  </button>
                </div>
              </div>
              {/* for the xbox image */}
              <div className="w-full relative">
                <div>
                  <img src={Xbox} alt="" />
                </div>
                <div className="w-[100px] h-[100px] flex flex-col items-center justify-center font-bold absolute top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                  <h1 className="text-[22px]">$299</h1>
                </div>
              </div>
              {/* xbox image end */}
            </div>
          :
            <div className="w-full flex flex-col-reverse md:flex-row md:items-center justify-center gap-[2em]">
                {/* for the xbox content */}
                <div className="w-full flex flex-col gap-4">
                  <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                    <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                    <span>PROMO PRODUCT</span>
                  </p>
                  <h1 className="text-[28px] md:text-[48px] text-[#191C1F] leading-[1em]">
                    {promoProduct2?.name.slice(0,20)}
                  </h1>
                  <p className="text-[18px] text-[#475156]">
                    This is one of our promo product, take advantage of it now before it is sold out
                  </p>
                  <div>
                    <button
                      onClick={()=>navigate(`/product-page/${promoProduct2._id}`)}
                      className="flex gap-4 cursor-pointer text-white bg-[#FA8232] rounded-[3px]"
                      style={{ padding: "20px 32px" }}
                    >
                      <span>SHOP NOW</span> <GoArrowRight size={24} />
                    </button>
                  </div>
                </div>
                {/* for the xbox image */}
                <div className="w-full relative">
                  <div>
                    <img src={promoProduct2?.image[0]} alt="" />
                  </div>
                  <div className="w-[100px] h-[100px] flex flex-col items-center justify-center font-bold absolute top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                    <h1 className="md:text-[22px]">₦{promoProduct2.discountprice.toLocaleString()}</h1>
                  </div>
                </div>
                {/* xbox image end */}
            </div>
          }
        </SwiperSlide>
        {/* for third promo product */}
        <SwiperSlide className='className="w-full h-auto bg-[#F2F4F5] rounded-[6px]' style={{ padding: "40px" }}>
          {!promoProduct3 ? 
            <div className="w-full flex items-center justify-center gap-[2em]">
              {/* for the xbox content */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                  <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                  <span>THE BEST PLACE TO PLAY</span>
                </p>
                <h1 className="text-[48px] text-[#191C1F] leading-[1em]">
                  Xbox Consoles
                </h1>
                <p className="text-[18px] text-[#475156]">
                  Save up to 50% on select Xbox games. Get 3 months of PC Game
                  Pass for $2 USD.
                </p>
                <div>
                  <button
                    className="flex gap-4 text-white bg-[#FA8232] rounded-[3px]"
                    style={{ padding: "20px 32px" }}
                  >
                    <span>SHOP NOW</span> <GoArrowRight size={24} />
                  </button>
                </div>
              </div>
              {/* for the xbox image */}
              <div className="w-full relative">
                <div>
                  <img src={Xbox} alt="" />
                </div>
                <div className="w-[100px] h-[100px] flex flex-col items-center justify-center font-bold absolute top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                  <h1 className="text-[22px]">$299</h1>
                </div>
              </div>
              {/* xbox image end */}
            </div>
          :
            <div className="w-full flex flex-col-reverse md:flex-row md:items-center justify-center gap-[2em]">
                {/* for the xbox content */}
                <div className="w-full flex flex-col gap-4">
                  <p className="text-[#2484C2] text-[14px] flex gap-2 items-center font-bold">
                    <span className="w-[24px] bg-[#2484C2] h-[2px]"></span>
                    <span>PROMO PRODUCT</span>
                  </p>
                  <h1 className="text-[28px] md:text-[48px] text-[#191C1F] leading-[1em]">
                    {promoProduct3?.name.slice(0,20)}
                  </h1>
                  <p className="text-[18px] text-[#475156]">
                    This is one of our promo product, take advantage of it now before it is sold out
                  </p>
                  <div>
                    <button
                      onClick={()=>navigate(`/product-page/${promoProduct3._id}`)}
                      className="flex gap-4 cursor-pointer text-white bg-[#FA8232] rounded-[3px]"
                      style={{ padding: "20px 32px" }}
                    >
                      <span>SHOP NOW</span> <GoArrowRight size={24} />
                    </button>
                  </div>
                </div>
                {/* for the xbox image */}
                <div className="w-full relative">
                  <div>
                    <img src={promoProduct3?.image[0]} alt="" />
                  </div>
                  <div className="w-[100px] h-[100px] flex flex-col items-center justify-center font-bold absolute top-0 right-0 rounded-[50%] bg-[#2DA5F3] text-black">
                    <h1 className="md:text-[22px]">₦{promoProduct3.discountprice.toLocaleString()}</h1>
                  </div>
                </div>
                {/* xbox image end */}
            </div>
          }
        </SwiperSlide>
        
        
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  )
}

export default ShowcaseProduct
