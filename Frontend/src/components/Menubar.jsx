import React, { useContext, useEffect } from 'react';
import { FiPhoneCall } from "react-icons/fi";
import { CiLocationOn, CiCircleInfo } from "react-icons/ci";
import { SlEarphonesAlt } from "react-icons/sl";
import { CategoryContext } from '../CategoryContext';
import { NavLink } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import Fastcart from '../assets/fastcartLogo.png';
import Debash from "../assets/debash.webp";
import { RowSkeletonLoader } from "./SkeletonLoader";

const Menubar = ({ closeMenu }) => {
  const { allCategory } = useContext(CategoryContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-[999] cursor-pointer"
        onClick={closeMenu}
      />
      
      {/* Drawer content */}
      <div className='w-4/5 sm:w-2/3 fixed top-0 left-0 h-[100vh] overflow-y-auto z-[1000] bg-white text-[#191C1F] shadow-2xl border-r border-gray-200 flex flex-col' style={{ padding: '20px 24px' }}>
        
        {/* Header section with Logo & Close button */}
        <div className='w-full flex items-center justify-between border-b border-gray-100 pb-4 mb-4 shrink-0'>
          <div className='flex items-center gap-2 cursor-pointer'>
            <img src={Fastcart} alt='logo' className="w-6 h-6 object-contain" />
            <h1 className='logoTxt text-primary text-[18px] font-bold'>RukatechStore</h1>
          </div>
          <IoMdClose className='cursor-pointer text-[#191C1F] hover:text-red-500 transition-colors' onClick={closeMenu} size={24}/>
        </div>

        {/* Categories Aside Section */}
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="px-2 uppercase font-bold text-xs text-primary mb-2 tracking-wider">Categories</h2>
          <a
            href="/store"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-primary-light transition-all text-xs font-semibold text-gray-600 no-underline"
          >
            <span className="material-symbols-outlined text-lg">
              shopping_basket
            </span>
            ALL PRODUCTS
          </a>
          {allCategory && allCategory.length > 0
            ? allCategory.map((category, index) => (
                <div key={index}>
                  <a
                    href={`/store?category=${encodeURIComponent(category)}`}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-primary-light transition-all text-xs font-semibold text-gray-600 no-underline uppercase"
                  >
                    <span className="material-symbols-outlined text-lg">
                      shopping_basket
                    </span>
                    {category}
                  </a>
                </div>
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <RowSkeletonLoader key={index} />
              ))}
        </div>

        {/* Quick Navigation Links */}
        <h2 className="px-2 uppercase font-bold text-xs text-primary mb-2 tracking-wider">Navigation</h2>
        
        {/* Contact Info & WhatsApp Section */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-light text-sm">
                call
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-800">Call to order</p>
              <p className="text-[9px] text-gray-500 font-medium">
                08133 333 333, 08133 333 334
              </p>
            </div>
          </div>

          <a 
            href="https://wa.me/2348133333333" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 no-underline cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <FaWhatsapp className="text-primary-light text-lg" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-800 group-hover:text-primary-light transition-colors">CHAT US</p>
              <p className="text-[9px] text-gray-500 font-medium">
                Chat with us on WhatsApp
              </p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-light text-sm">
                support_agent
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-800">customer support</p>
              <p className="text-[9px] text-gray-500 font-medium">
                Millions of visitors
              </p>
            </div>
          </div>
        </div>

        {/* Debash Location Image Card */}
        <div className="bg-primary-light rounded-xl p-3 text-white overflow-hidden shadow-md mb-6">
          <img
            className="w-full h-auto rounded-lg mb-2"
            alt="rukatech_store_location"
            src={Debash}
          />
          <p className="text-[9px] font-bold text-center leading-tight">
            VISIT OUR STORE FOR THE BEST DEALS AND DISCOUNTS
          </p>
        </div>
      </div>
    </>
  );
};

export default Menubar;