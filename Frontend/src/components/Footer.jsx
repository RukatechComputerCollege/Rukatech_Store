import React, { useContext } from "react";
import Fastcart from "../assets/fastcartLogo.png";
import GetApple from "../assets/getAppStore.png";
import GetGoogle from "../assets/GetGoogle.png";
import { CategoryContext } from "../CategoryContext";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { allCategory } = useContext(CategoryContext);

  const navigate = useNavigate();
  return (
    <footer className="w-full mt-12 bg-[#313133] border-t border-gray-700">
      {/* <!-- Newsletter Bar --> */}
      <div className="bg-[#313133] border-b border-gray-700 py-8">
        <div className="max-w-[1184px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex-1">
            <p className="text-xl font-bold text-white uppercase">
              New to Rukatech Store?
            </p>
            <p className="text-xs text-gray-400">
              Subscribe to our newsletter to get updates on our latest offers!
            </p>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-white rounded border-none px-4 py-3 text-sm"
              placeholder="Enter E-mail Address"
              type="email"
            />
            <button className="bg-[#f68b1e] text-white px-8 py-3 rounded font-bold hover:bg-[#e07b1a] transition-colors uppercase text-sm">
              Subscribe
            </button>
            {/* <button className="bg-[#f68b1e] text-white px-8 py-3 rounded font-bold hover:bg-[#e07b1a] transition-colors uppercase text-sm">
              Female
            </button> */}
          </div>
        </div>
      </div>
      {/* <!-- Main Footer Links --> */}
      <div className="w-full py-10 px-4 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1184px] mx-auto">
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase">
            Let Us Help You
          </h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                How to shop on Rukatech Store?
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 text-xs hover:text-white transition-colors"
                href="#"
              >
                Returns &amp; Refunds Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase">
            Top categories
          </h4>
          <ul className="flex flex-col gap-2">
            {allCategory &&
              allCategory
                .slice(0, 6)
                .map((cat, index) => <li className="text-gray-400 text-xs hover:text-white transition-colors" key={index}>{cat.toUpperCase()}</li>)}
            <p
              onClick={() => navigate("/store")}
              className="font-semibold cursor-pointer text-[#EBC80C] text-[14px] flex gap-2 md:item-center md:justify-start"
            >
              {" "}
              <span>Browse All Product</span>
              <IoIosArrowRoundForward size={20} />
            </p>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase">
            quick links
          </h4>
          <ul className="flex flex-col gap-2">
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/store')}>Shop Product</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/shopping-cart')}>Shopping Cart</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/')}>Wishlist</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/')}>Compare</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/order-tracking')}>Track Order</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/customer-support')}>Customer Help</li>
            <li className='cursor-pointer text-gray-400 text-xs hover:text-white transition-colors' onClick={() => navigate('/who-we-are')}>About Us</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase">
            Rukatech International
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <ul className="flex flex-col gap-2">
              <li className="text-gray-400 text-xs hover:text-white transition-colors">
                  Nigeria
              </li>
            </ul>
            <ul className="flex flex-col gap-2">  
              <li className="text-gray-400 text-xs hover:text-white transition-colors">
                  United State of America
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- Social & App Download --> */}
      <div className="max-w-[1184px] mx-auto px-4 py-8 border-t border-gray-700 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <span className="text-white text-sm font-bold">JOIN US ON</span>
          <div className="flex gap-4">
            <a
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#f68b1e] transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">
                social_leaderboard
              </span>
            </a>
            <a
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#f68b1e] transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">
                play_arrow
              </span>
            </a>
            <a
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#f68b1e] transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">camera</span>
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-bold">PAYMENT METHODS</span>
          <div className="flex gap-2">
            <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-[8px] text-white">
              VISA
            </div>
            <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-[8px] text-white">
              MC
            </div>
            <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-[8px] text-white">
              PAY
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Copyright --> */}
      <div className="bg-[#313133] py-6 text-center border-t border-gray-700">
        <p className="text-[10px] text-gray-500">
          © {new Date().getFullYear()} Rukatech Store. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
