import React, { useState, useRef, useEffect, useContext } from "react";
import { GoArrowRight } from "react-icons/go";
import Xbox from "../assets/xbox.png";
import GooglePixel from "../assets/googlePixel.png";
import Airpod from "../assets/airpod.png";
import { GoPackage, GoCreditCard } from "react-icons/go";
import { PiTrophyThin } from "react-icons/pi";
import { SlEarphonesAlt } from "react-icons/sl";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CategoryContext } from "../CategoryContext";
import BestDeals from "../components/BestDeals";
import FeaturedProducts from "../components/FeaturedProducts";
import FewProduct from "../components/FewProduct";
import { useNavigate } from "react-router-dom";
import ShowcaseProduct from "../components/ShowcaseProduct";
import SkelentonLoader from "../components/SkelentonLoader";

const Landingpage = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { allCategory } = useContext(CategoryContext);
  const { allProduct } = useContext(CategoryContext);
  const [chunkSize, setChunkSize] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChunkSize(2);
      } else if (window.innerWidth < 1024) {
        setChunkSize(4);
      } else {
        setChunkSize(6);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  document.title = "Fastcart | Online Store for Fastcart E-commerce";

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const slideCategory = chunkArray(allCategory, chunkSize);
  const navigate = useNavigate();

  const [promoProduct1, setPromoProduct1] = useState(null);
  const [promoProduct2, setPromoProduct2] = useState(null);
  const [promoProduct3, setPromoProduct3] = useState(null);
  const [promoProduct4, setPromoProduct4] = useState(null);
  const [promoProduct5, setPromoProduct5] = useState(null);
  const [productShowName, setProductShowName] = useState("Product");
  useEffect(() => {
    if (allProduct && allProduct.length > 0) {
      const promoProducts = allProduct.filter((prod) =>
        prod.category?.some((cat) => cat.name === "Promo"),
      );
      if (promoProducts.length > 0) {
        setPromoProduct1(promoProducts[0]);
        setPromoProduct2(promoProducts[1]);
        setPromoProduct3(promoProducts[2]);
        setPromoProduct4(promoProducts[3]);
        setPromoProduct5(promoProducts[4]);
      }
    }
  }, [allProduct]);
  console.log(promoProduct1);

  const productDetails = (product) => {
    navigate(`/product-page/${product._id}`);
  };

  const filteredProducts =
    productShowName === "Product"
      ? allProduct
      : allProduct.filter((product) =>
          product.category.some((cat) => cat.name === productShowName),
        );

  return (
    <div
      className="w-full h-auto flex flex-col gap-y-[1em]"
      style={{ padding: "10px 6%" }}
    >
      {/* Hero Section & Sidebar */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar Categories */}
        <aside className="hidden lg:block col-span-3 bg-white rounded-4xl shadow-sm border border-gray-100 flex-col py-2 max-h-[50dvh] overflow-y-scroll">
          <h2 className="px-4 uppercase font-bold text-primary">Categories</h2>
          <a
            href={`/store/`}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-primary-light transition-all text-xs text-gray-600"
          >
            <span className="material-symbols-outlined text-lg">
              shopping_basket
            </span>
            All Products
          </a>
          {allCategory &&
            allCategory.map((category, index) => (
              <div key={index}>
                <a
                  href={`/store/${category.name}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-primary-light transition-all text-xs text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">
                    shopping_basket
                  </span>
                  {category.name}
                </a>
              </div>
            ))}
        </aside>
        {/* Hero Slider */}
        <div className="col-span-12 lg:col-span-7 lg:h-[450px] bg-white rounded-4xl overflow-hidden shadow-sm relative">
          <ShowcaseProduct
            promoProduct1={promoProduct1}
            promoProduct2={promoProduct2}
            promoProduct3={promoProduct3}
          />
        </div>
        {/* Right Column Info */}
        <div className="hidden lg:block col-span-2 flex-col gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-light text-lg">
                  call
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase">Call to order</p>
                <p className="text-[10px] text-gray-500">
                  08133 333 333, 08133 333 334
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <FaWhatsapp className="text-primary-light text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold">CHAT US</p>
                <p className="text-[10px] text-gray-500">
                  You can also chat with us on WhatsApp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-light text-lg">
                  support_agent
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase">customer support</p>
                <p className="text-[10px] text-gray-500">
                  Millions of visitors
                </p>
              </div>
            </div>
          </div>
          <div className="bg-primary-light rounded-lg p-2 text-white overflow-hidden shadow-sm">
            <img
              className="w-full h-32 object-cover rounded mb-2"
              data-alt="Graphic advertising Jumia Pay services with mobile phones and digital payment icons on a vibrant orange background"
              src="src/assets/debash.webp"
            />
            <p className="text-[10px] font-bold text-center">
              VISIT OUR STORE FOR THE BEST DEALS AND DISCOUNTS
            </p>
          </div>
        </div>
      </div>
      {/* carousel banners */}
      <div
        className="w-full flex flex-col gap-4 relative"
        style={{ margin: "30px 0" }}
      >
        <div className="w-full">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
            className="w-full"
          >
            {slideCategory && slideCategory.length > 0
              ? slideCategory.map((allCategory, index) => (
                  <SwiperSlide key={index}>
                    {allCategory && (
                      <div
                        className={`w-full grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6`}
                      >
                        {allCategory.map((category, i) => (
                          <div
                            onClick={() => navigate(`/store/${category.name}`)}
                            key={i}
                            className="bg-white cursor-pointer border-1 border-[#E4E7E9] rounded-[4px] flex flex-col gap-4 items-center justify-center"
                            style={{ padding: "24px 12px" }}
                          >
                            <img src={category.image} alt="category-image" />
                            <h1 className="text-[#191C1F] text-[16px] font-bold">
                              {category.name}
                            </h1>
                          </div>
                        ))}
                      </div>
                    )}
                  </SwiperSlide>
                ))
              : Array.from({ length: Math.ceil(12 / chunkSize) }).map(
                  (_, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                      <div className="w-full grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                        {Array.from({ length: chunkSize }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full h-[250px] cursor-pointer flex flex-col gap-2 border border-[#E4E7E9]"
                            style={{ padding: "10px" }}
                          >
                            <SkelentonLoader />
                          </div>
                        ))}
                      </div>
                    </SwiperSlide>
                  ),
                )}
          </Swiper>
          <div className="w-full flex justify-between items-center">
            <button
              ref={prevRef}
              className="bg-[#FA8232] w-[48px] h-[48px] absolute top-[55%] left-[-20px] z-10 rounded-[50%] text-white flex flex-col items-center justify-center cursor-pointer"
            >
              <IoIosArrowRoundBack size={24} />
            </button>
            <button
              ref={nextRef}
              className="bg-[#FA8232] w-[48px] h-[48px] absolute top-[55%] right-[-20px] z-10 rounded-[50%] text-white flex flex-col items-center justify-center cursor-pointer"
            >
              <IoIosArrowRoundForward size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Flash Sales --> */}
      <section className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-red-600 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined fill !text-[34px] text-primary-light font-bold">
              sell
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Flash Sales
            </h2>
            <div className="flex items-center gap-2 text-sm ml-4">
              <span className="opacity-80">Time Left:</span>
              <div className="flex gap-1 font-mono flash-sale-timer">
                <span className="bg-white/20 px-1 rounded">08</span>:
                <span className="bg-white/20 px-1 rounded">42</span>:
                <span className="bg-white/20 px-1 rounded">19</span>
              </div>
            </div>
          </div>
          <a
            className="text-sm font-bold flex items-center gap-1 hover:underline"
            href="#"
          >
            SEE ALL
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </a>
        </div>
        <div className="p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* <!-- Product Card --> */}
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="Minimalist wrist watch with clean dial and white band on a grey studio background, high quality product photography"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB50FrVIlI11PJ0kHBEN-lsingbQAHu-InsU_cx4yo2Yq6L4o0_nEZlDi5BpW38RIIZYoLpbqAa2UPZ8eXOX4CqQapT4OhUxvoHFk5cJCgFLT3I-0Gu2zrgeh96A-epnlH-CvZGUwYoaYyuJ_z0dz9zdMX9WfZ_h9wcctq083hYt8Ue6Nt8JlNfsv1BliOEkvPi2AjxbIqkh_oW0Yosz5FtoVmjGrUkw9DO902NRbxEUeyUwRdkreaWag8K9hWV4D9hSos9mylCFT-0"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -45%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              Smart Watch Series 7 - Black Silicon Strap
            </p>
            <p className="text-sm font-bold">₦ 12,450</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 22,600</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-3/4"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">45 items left</p>
          </div>
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="High-end wireless headphones in black on a clean white surface, soft studio lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVHQ9ZOZ46036YVAR-se7I_kVbX_dSVDtJ9ZvAQ7Abl5ihwBa_eVnu-MElOJ3TbdjRq8KuAdBvTvadGFJTBl3ryrDYfPaq_IypeuFBgoRFfrdNbxHHm6k-NIavrAoGzqEIGKeJKg7OgcHd_C5dzc5exIdGZwxmcWCEN9KKglHnAVhPLBFWllgLsYNIoOUGoCKrb2r93lnVZs3MtKjR250-p48NFjdZ72hJNhi_BmlOwFuBH_-K-y7baapu2UTVQx5tW4NewQTPBG2F"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -20%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              Bluetooth Over-ear Stereo Headphones
            </p>
            <p className="text-sm font-bold">₦ 45,900</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 57,400</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-1/2"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">12 items left</p>
          </div>
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="classNameic aviator sunglasses with gold frames on a bright reflective surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqlu_nQQggsjy31K_KzNlBJ5xo81Cl_WLg7WcnF4bmxD7PrOZ8YvuGJK2o02AkLi2URwxkQiHhICTuc0zIDfxiX-b05BdWHyiZidbgLtgiLvWPG7zBouvCkN3JCfLmu1XZvkbeamcKM82FjtMV70Cr8KKnsueCf6xXyisF_6I3apbaHcdtRRLQZjZhirFNzwkJiidsk5qtRpKsF6O5mNl-oECWnbocZCl4WsziW4AL_oeOt5lzxk5wtaqzBdIgtthG9VrjxaMWTga"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -60%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              Premium Aviator Polarized Sunglasses
            </p>
            <p className="text-sm font-bold">₦ 3,200</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 8,000</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-5/6"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">5 items left</p>
          </div>
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="Red Nike running shoe in dynamic pose on white background, sharp focus"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkEP6DVVWHgGv82ffUJ8jAx2OGaVEq9nXw8LX-T2z3k-fP79d9o5m3OqO18mUVfAJo4D33qj1bfhwXkFiz_Hp8sIm9XSkeayWNNVK9Ysr1hWH2yGJxTUPXX2SCpO4FLbB-Vr5r7LJy-GqnZlcnBDm8L56cFGumTJfv91ZGUGaqGuSdg_gZufmFiKieDKVmg2U57j43Z09IRRWWXBMulSucnveeYXiXLbVypHM_Ed0XhM4slBN3CKRYqa8ofSayAv7iDvrxUY2Hq85p"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -30%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              Sports Running Shoes - Red/White Edition
            </p>
            <p className="text-sm font-bold">₦ 15,800</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 22,500</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-1/4"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">112 items left</p>
          </div>
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="Vintage style polaroid camera on yellow background with clean aesthetic"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4tzP01yrL11j8Sa0ntzpsySsPSiWa7PFgiFZG9h0DbpSr2rjocF4wx7l9vI3Z9NcdMAJVnyNStamLZgauTCbRMS1v6ZUWvkilT5wpkNR8MSasCVs1TjbAj69X9LUHXUk5XTn8T92PFleqyVkTkA6shjaeE4WNvrtttzSz0iB5Pz4Pu9F21wI9wdC3IUAbUR7IWvdoSi3Pui1fwIjEZV1IvGXIimyHUvvhvMjNeeRFbUweizziEW25AxNH8BD_JkmC4s7DSTCxccpR"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -15%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              Instant Film Camera - classNameic Blue
            </p>
            <p className="text-sm font-bold">₦ 38,000</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 45,000</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-2/3"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">21 items left</p>
          </div>
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                data-alt="High performance gaming mouse with RGB lighting on dark sleek pad"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGZHnjXgCmU66iVykh4qIeVQs_OAokj7rNN-Rttd0lXRElMZQre0iAVHW8hsRkJXYjfdcJ3i1Ghmjsr7ciWjrc7mGBuDpV2K3BKQ0qrwCtrXPMyyy2TROBUqnBTiy5w6cY4ATAjtnvv6dYOizuzZwZo2vdtzPWAmPgsns8SH-W9dlmLcy27fB8YjGExE9cT2PmEZ338H1jLy0t2Lu35TK189plIz1XjPvc752ozu6oBwH7a2dTjMK8XrMcdgnnZzj4_IhAow6OFo1E"
              />
              <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                -50%
              </span>
            </div>
            <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
              RGB Gaming Mouse 12000 DPI
            </p>
            <p className="text-sm font-bold">₦ 7,500</p>
            <p className="text-[10px] text-gray-400 line-through">₦ 15,000</p>
            <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-1/2"></div>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">40 items left</p>
          </div>
        </div>
      </section>
      {/* <!-- New Arrivals --> */}
      <section className="mt-8">
        <div className="bg-primary text-white px-4 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-bold">New Arrivals</h2>
          {/* <span className="text-sm font-bold cursor-pointer uppercase hover:underline" onClick={() => navigate("/store")}>
            See All
          </span> */}
        </div>
        <div className="bg-white p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-sm">
          {/* <!-- Phone Product Cards --> */}
          {allProduct.slice(0, 16).map((product) => (
            <div
              onClick={() => productDetails(product)}
              className="group cursor-pointer flex flex-col items-center relative"
              key={product._id}
            >
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                src={product.image[0]}
                alt={product.name}
              />
              {product.discountprice && (
                <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -
                  {Math.round(
                    (1 - product.discountprice / product.price) * 100,
                  )}
                  %
                </span>
              )}
              <p className="text-xs text-center line-clamp-2 mb-1 group-hover:text-primary-light">
                {product.name}
              </p>
              <p className="text-sm font-bold">
                ₦
                {product.discountprice
                  ? product.discountprice.toLocaleString()
                  : product.price.toLocaleString()}
              </p>
              {product.discountprice && (
                <p className="text-[10px] text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* <!-- Best Deals --> */}
      <section className="mt-8">
        <div className="bg-primary text-white px-4 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Best Deals</h2>
          {/* <span className="text-sm font-bold cursor-pointer uppercase hover:underline" onClick={() => navigate("/store")}>
            See All
          </span> */}
        </div>
        <div className="bg-white p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-sm">
          {/* <!-- Phone Product Cards --> */}
          {allProduct.slice(0, 16).map((product) => (
            <div
              onClick={() => productDetails(product)}
              className="group cursor-pointer flex flex-col items-center relative"
              key={product._id}
            >
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                src={product.image[0]}
                alt={product.name}
              />
              {product.discountprice && (
                <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -
                  {Math.round(
                    (1 - product.discountprice / product.price) * 100,
                  )}
                  %
                </span>
              )}
              <p className="text-xs text-center line-clamp-2 mb-1 group-hover:text-primary-light">
                {product.name}
              </p>
              <p className="text-sm font-bold">
                ₦
                {product.discountprice
                  ? product.discountprice.toLocaleString()
                  : product.price.toLocaleString()}
              </p>
              {product.discountprice && (
                <p className="text-[10px] text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* <!-- Categories --> */}
      <section className="mt-8">
        <div className="bg-primary text-white px-4 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Categories</h2>
          <div className="space-x-16">
            <span
              onClick={() => setProductShowName("Product")}
              className="text-sm font-bold cursor-pointer uppercase hover:underline"
            >
              All
            </span>
            {allCategory?.slice(0, 4).map((cat) => (
              <span
                key={cat._id}
                onClick={() => setProductShowName(cat.name)}
                className="text-sm cursor-pointer font-bold uppercase hover:underline"
                href="#"
              >
                {cat.name}
              </span>
            ))}
            <span
              onClick={() => navigate("/store")}
              className="text-sm font-bold cursor-pointer uppercase hover:underline"
            >
              See All
            </span>
          </div>
        </div>
        <div className="bg-white p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-sm">
          {/* <!-- Phone Product Cards --> */}
          {filteredProducts.slice(0, 6).map((product) => (
            <div
              onClick={() => productDetails(product)}
              className="group cursor-pointer flex flex-col items-center"
              key={product._id}
            >
              <img
                className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                src={product.image[0]}
                alt={product.name}
              />
              <p className="text-xs text-center line-clamp-2 mb-1 group-hover:text-primary-light">
                {product.name}
              </p>
              <p className="text-sm font-bold">
                ₦
                {product.discountprice
                  ? product.discountprice.toLocaleString()
                  : product.price.toLocaleString()}
              </p>
              {product.discountprice && (
                <p className="text-[10px] text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* <!-- Official Brand Stores Section --> */}
      <section className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="font-bold text-sm">Official Store: NIVEA</h3>
            <a className="text-xs font-bold text-primary-light" href="#">
              Shop Now
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Professional display of Nivea skin care products in a retail setting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz2V3OltgSUP0KjySIcr9qUnvOMHQlGiGpkWU1tJugsxqCXUqpCSSa7DGvbJLTpfts1kevCoBA0lDp9qSYC-nMmnBsd4ytOYqD3T5xmLAcDi41FKukWm_NrzJDTHZhIykXrp8wEFl1-ExXd7Cjz2-Yh1EYvJr2XzXYF-Oz9aA2TshzsD4D39izoHo9heHdOAVuhV83Z2SEG7oe-C0nilaMTucOQoXaCQsvIuYIxp8A-tYv0tl5a4uySlZloDHfsNzneptMluCO1wmR"
            />
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Nivea cream jars on a clean blue background with water splashes"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYjoREE3k4EsHwaUfIoeZJw-Rtqv9IvUdFPCHvNxx1yGgy70Tq6NNZ0fC8dml4TYpiAvFYTmXQJQ8XNwKlVUqCfocrZrvXRuDKXriw-7VQDCWdfKuCTjp8oOaSxpIqdcDU5cKCTaCzzuDwYttbNlUkGHVpFcKtabUmfdNSVGHa6wq2FVz9JQyIxyIhj6Xd0OJvfv1LD31S637FqsdwWeK7HgsTMpgPGtic-Loig-G785wN1fFvng4IovVyshBz5VF_20z_zl_LL5ME"
            />
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Close-up of Nivea lotion bottle with clear product detailing"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1mNBvVBXxp5fPcvAlJQaqSyZhBTeA71mcDwIAuuXfu6e-PwtuyAnQi3p9cbdw4ra1pPYv9sXWCCXY8siRfqCQtAmjyzNrdkPSyAO4i-dIFhpYxxZx8RimRayiAvJsCx0IwharXXbfGTwS1oxSp1S5nZm8B6tht8IMUOVQsNwaRPrAclsQq4uW1gIsdc053_mMJ1wCs_T8Da2TcEg_EDKocDfbgLY1vDgLgO-3-vrQqu9kdmXRwSnY3CZy79_EDSbx6yn1UN6eXfrg"
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="font-bold text-sm">Official Store: Oraimo</h3>
            <a className="text-xs font-bold text-primary-light" href="#">
              Shop Now
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Oraimo earbuds in their charging case on a green neon surface"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0HoqexyXWu4iheEv0WLTcEZkY4-_jB0YEAVgkiKNUYRazEjyGO0OjceyaXBBYSutgLMnZE_J-dmR8U71oWhg_ptVxLNReK0X-z0YWxZvITOo16eRuMLCxSwDX_vUbBvH47QZuWRzMst1R1FBKplvdRmiHNSeKySfo8FDOIu2eW9TpdY04nVayuKuzN8iABkpWeAj-8ST4WO7m4uskU9RyIt_qQmccasWcXKfhs7yEJ5wBNqsXUF0wkk1a6se9ZYYL1tcUKVc4oj35"
            />
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Oraimo power bank and charging cables in a high-tech setting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB602ou0sVFSlv1KI5-PyuqFKn4uCPNo0e6tmsxdfzH9x00F6rK_YCv2JROyN5xZ5GOxvJrMo7IkQMCi85XDlJ289AP_UPK6Y4uzHy69XbSAs820IK9PsczS0Qv-tn6-ETwbDoVOwcZzaD6aLTNIWYbo4SBXnkc8DBvR1_s6UvVQfaaLThCBYCVNUas85MBp51CgSsPb8jf_iCX8zxO5q0BkOX_a0E8yR1ZnayAOTFd2J32wsF5eCZBawmuZkQ9Gtqe70QgOlASHbyp"
            />
            <img
              className="w-full aspect-[4/3] object-cover rounded"
              data-alt="Oraimo smart watch on a wrist against a blurred fitness background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo_arJARGk7FVTMo7oYrSqMVGJM_z_aHmPRI4Nuy45vBJUtGHG-OOrZyYRR-Aows0YOoJJUHxCpiEezUWgJsNjQNeSzDw2o4q1e5PVzVPW8T2-fEM143TJz93KnAwS2SVZjAk9-Zq393DCN90kaiJqywNPzw1Awe3Nnd6Q2O4HlcNAN5D7vCjVwbvymwjvDTsCoWQFsj77I5AqSxYXsb4hROCM9mJvEvT8YXpqEGJyoHfAw8Z9UfhyVLysp2XJjkKwmU1WpYwrLjZz"
            />
          </div>
        </div>
      </section>
      {/* <!-- Information Text Section --> */}
      <section className="my-12 text-center text-gray-600 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">
          Jumia Nigeria - Nigeria's No. 1 Shopping Destination
        </h1>
        <p className="text-xs leading-relaxed">
          Shop for everything you need on Jumia Nigeria - from Groceries,
          Phones, Tablets, Health &amp; Beauty, Home &amp; Office items and
          more. Experience fast delivery and easy returns on our official
          stores. Jumia is your one-stop shop for all your daily essentials and
          luxury needs at the best prices in Nigeria.
        </p>
      </section>
    </div>
  );
};

export default Landingpage;
