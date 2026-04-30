import React, { useEffect, useState } from "react";
import Fastcart from "../assets/fastcartLogo.png";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { FaRegHeart, FaRegUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartCard from "./CartCard";
import { RxHamburgerMenu } from "react-icons/rx";
import Menubar from "./Menubar";

const Navbar = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const cartItem = useSelector((state) => state.cart.cartItem);
  const [cartShown, setCartShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => {
    setIsOpen(true);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen width is less than or equal to 768px (mobile breakpoint)
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize to handle dynamic screen size change
    window.addEventListener("resize", checkScreenSize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setCartShown(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setCartShown(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      navigate("/shopping-cart");
    }
  };

  return (
    <div className="shop-navbar">
      <div
        className="w-full bg-white text-black"
        style={{ padding: "10px 6%" }}
      >
        <div className="w-full flex items-center justify-between">
          {/* for logo */}
          <div className="flex items-center gap-2">
            <RxHamburgerMenu
              onClick={openMenu}
              className="md:hidden cursor-pointer"
              size={24}
            />
            <div
              onClick={goHome}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={Fastcart} className="max-[400px]:w-[30px]" alt="logo" />
              <h1 className="logoTxt max-[400px]:text-[20px] text-primary text-[25px]">
                Rukatech Store
              </h1>
            </div>
          </div>
          {isOpen && <Menubar closeMenu={closeMenu} />}
          {/* for discount */}
          <div className="w-2/4 hidden md:block text-black">
            <div className="p-1 flex-1 flex items-center bg-white border border-gray-300 rounded-full justify-center overflow-hidden group focus-within:border-primary">
              <div className="px-3 flex text-gray-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="w-full border-none focus:ring-0 text-body-md py-2"
                placeholder="Search products, brands and categories"
                type="text"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-3xl font-semibold hover:bg-primary-light transition-colors uppercase text-sm">
                Search
              </button>
            </div>
          </div>
          {/* for shop now */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location = "/dashboard/account")}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-light transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined" data-icon="person">
                person
              </span>
              <span className="hidden lg:block font-medium text-sm">
                Account
              </span>
            </button>
            {/* <FaRegHeart className="text-[18px] md:text-25px]" /> */}
            <div
              onClick={handleClick}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              className="relative cursor-pointer"
            >
              <div className="flex items-center gap-2 text-gray-700 hover:text-primary-light transition-colors cursor-pointer group">
                <span
                  className="material-symbols-outlined"
                  data-icon="shopping_cart"
                >
                  shopping_cart
                </span>
                <span className="hidden lg:block font-medium text-sm">
                  Cart
                </span>
              </div>
              {cartItem.length > 0 && (
                <div
                  style={{ padding: "8px" }}
                  className="absolute top-[-6px] right-[30px] w-[10px] h-[10px] bg-primary border border-white rounded-full flex items-center justify-center text-white text-[12px]"
                >
                  <span>{cartItem.length}</span>
                </div>
              )}
              {cartShown && (
                <div className="z-10 absolute w-auto md:w-[376px] top-[120%] shadow-md md:right-0">
                  <CartCard />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
