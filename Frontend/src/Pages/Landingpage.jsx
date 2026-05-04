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
import {
  CardSkeletonLoader,
  RowSkeletonLoader,
  ProductsSkeletonLoader,
} from "../components/SkeletonLoader";
import LandingPagePC from "../components/LandingPagePC";
import StoreProductCard from "../components/StoreProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/Cart";

const categoryImage = [
  {
    name: "laptops",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "accessories",
    image:
      "https://images.unsplash.com/photo-1678851836066-dc27614cc56b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdhZGdldHMlMjBhY2Nlc3Nvcmllc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "phones",
    image:
      "https://images.unsplash.com/photo-1742108273412-7e020daf956f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "monitors",
    image:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9uaXRvcnN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "tablets",
    image:
      "https://images.unsplash.com/photo-1622531636820-5d727319e45d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "processors",
    image:
      "https://plus.unsplash.com/premium_photo-1681426698212-53e47fec9a2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2Nlc3NvcnN8ZW58MHx8MHx8fDA%3D",
  },
];

const Landingpage = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { allCategory } = useContext(CategoryContext);
  const { allProduct } = useContext(CategoryContext);
  const [chunkSize, setChunkSize] = useState(6);
  const [bestDealsProduct, setbestDealsProduct] = useState([]);

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
  document.title = "RukatechStore | Online Store for Gadgets E-commerce";

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const slideCategory = chunkArray(allCategory, chunkSize);
  const navigate = useNavigate();
  const cartItem = useSelector((state) => state.cart.cartItem);
  const dispatch = useDispatch();

  const [promoProduct1, setPromoProduct1] = useState(null);
  const [promoProduct2, setPromoProduct2] = useState(null);
  const [promoProduct3, setPromoProduct3] = useState(null);
  const [promoProduct4, setPromoProduct4] = useState(null);
  const [promoProduct5, setPromoProduct5] = useState(null);
  const [productShowName, setProductShowName] = useState("Product");
  useEffect(() => {
    if (allProduct && allProduct.length > 0) {
      const promoProducts = allProduct.filter((prod) =>
        [prod.category]?.some((cat) => cat === "Promo"),
      );
      if (promoProducts.length > 0) {
        setPromoProduct1(promoProducts[0]);
        setPromoProduct2(promoProducts[1]);
        setPromoProduct3(promoProducts[2]);
        setPromoProduct4(promoProducts[3]);
        setPromoProduct5(promoProducts[4]);
      }
    }

    const eightBestDeals = allProduct
      .filter((product) => product.discountPercentage)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 8);
    setbestDealsProduct(eightBestDeals);
  }, [allProduct]);
  // console.log(promoProduct1);

  const appleProducts = allProduct
    .filter(
      (product) =>
        product.name.toLowerCase().includes("apple") ||
        product.name.toLowerCase().includes("iphone") ||
        product.name.toLowerCase().includes("macbook") ||
        product.name.toLowerCase().includes("ipad") ||
        product.name.toLowerCase().includes("airpods") ||
        product.name.toLowerCase().includes("ios") ||
        product.name.toLowerCase().includes("apple watch"),
    )
    .slice(0, 4);

  const productDetails = (product) => {
    navigate(`/store/${encodeURIComponent(product.name)}`, {
      state: { id: product._id, product: product },
    });
  };

  const filteredProducts =
    productShowName === "Product"
      ? allProduct
      : allProduct.filter((product) => product.category === productShowName);

  return (
    <div
      className="w-full mt-10 h-auto flex flex-col gap-y-[1em]"
      style={{ padding: "10px 6%" }}
    >
      {/* Hero Section & Sidebar */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar Categories */}
        <aside className="hidden lg:block col-span-3 bg-white rounded-2xl shadow-[12px] border border-gray-100 flex-col py-2 h-[50dvh] overflow-y-scroll">
          <h2 className="px-4 uppercase font-bold text-primary">Categories</h2>
          <a
            href={`/store`}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-primary-light transition-all text-xs text-gray-600"
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
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-primary-light transition-all text-xs text-gray-600"
                  >
                    <span className="material-symbols-outlined text-lg">
                      shopping_basket
                    </span>
                    {category.toUpperCase()}
                  </a>
                </div>
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <RowSkeletonLoader key={index} />
              ))}
        </aside>
        {/* Hero Slider */}
        <div className="col-span-12 lg:col-span-7 lg:h-[50dvh] bg-white rounded-2xl overflow-hidden shadow-[12px] relative">
          <ShowcaseProduct
            promoProduct1={promoProduct1}
            promoProduct2={promoProduct2}
            promoProduct3={promoProduct3}
          />
        </div>
        {/* Right Column Info */}
        <div className="hidden lg:flex col-span-2 flex-col gap-4">
          <div className="bg-white rounded-lg p-4 shadow-[12px] flex flex-col gap-3">
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
              <div className="w-10 h-9 rounded-full bg-orange-100 flex items-center justify-center">
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
          <div className="bg-primary-light rounded-lg p-2 text-white overflow-hidden shadow-[12px]">
            <img
              className="w-full h-32 object-cover rounded mb-2"
              alt="rukatech_store_location"
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
                            onClick={() =>
                              navigate(`/store?category=${category}`)
                            }
                            key={i}
                            className="relative bg-white cursor-pointer border border-[#E4E7E9] rounded-4xl flex flex-col items-center justify-start h-50"
                          >
                            <div className="absolute w-full h-full bg-black/60 rounded-4xl"></div>
                            {categoryImage.map(
                              (cat, index) =>
                                cat.name === category && (
                                  <img
                                    className="h-full w-full rounded-4xl"
                                    src={cat.image}
                                    alt={category}
                                  />
                                ),
                            )}
                            <h1 className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] text-center text-white text-[16px] font-bold">
                              {category.toUpperCase()}
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
                            className="w-full h-62.5 cursor-pointer flex flex-col gap-2 border border-[#E4E7E9]"
                            style={{ padding: "10px" }}
                          >
                            <CardSkeletonLoader />
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
              className="bg-[#FA8232] w-12 h-12 absolute top-[40%] -left-5 z-10 rounded-[50%] text-white flex flex-col items-center justify-center cursor-pointer"
            >
              <IoIosArrowRoundBack size={24} />
            </button>
            <button
              ref={nextRef}
              className="bg-[#FA8232] w-12 h-12 absolute top-[40%] -right-5 z-10 rounded-[50%] text-white flex flex-col items-center justify-center cursor-pointer"
            >
              <IoIosArrowRoundForward size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Flash Sales --> */}
      <section className="bg-white rounded-3xl shadow-[12px] overflow-hidden">
        <div className="bg-red-600 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <img src="/chatgptflash.png" className="w-15 -mt-1 h-full" />
            {/* <span className="material-symbols-outlined fill !text-[34px] text-primary-light font-bold">
              sell
            </span> */}
            {/* <h2 className="text-[32px] font-bold uppercase tracking-tight">
              Flash Sales
            </h2> */}
            <div className="flex items-center gap-2 text-[12px] ml-4">
              <span className="opacity-80">Time Left:</span>
              <div className="flex gap-1 font-mono flash-sale-timer">
                <span className="bg-white/20 px-1 rounded">08</span>:
                <span className="bg-white/20 px-1 rounded">42</span>:
                <span className="bg-white/20 px-1 rounded">19</span>
              </div>
            </div>
          </div>
          <a
            className="text-[12px] font-bold flex items-center gap-1 hover:underline"
            href="#"
          >
            SEE ALL
            <span className="material-symbols-outlined text-[12px]">
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
            <p className="text-[12px] font-bold">₦ 12,450</p>
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
            <p className="text-[12px] font-bold">₦ 45,900</p>
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
            <p className="text-[12px] font-bold">₦ 3,200</p>
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
            <p className="text-[12px] font-bold">₦ 15,800</p>
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
            <p className="text-[12px] font-bold">₦ 38,000</p>
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
            <p className="text-[12px] font-bold">₦ 7,500</p>
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
        <div className="bg-primary text-white px-4 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold">New Arrivals</h2>
          {/* <span className="text-[12px] font-bold cursor-pointer uppercase hover:underline" onClick={() => navigate("/store")}>
            See All
          </span> */}
        </div>
        <div className="bg-white p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-[12px]">
          {/* <!-- Phone Product Cards --> */}
          {allProduct && allProduct.length > 0
            ? allProduct
                .slice(0, 16)
                .map((product, index) => (
                  <LandingPagePC
                    key={index}
                    product={product}
                    onClick={() => productDetails(product)}
                  />
                ))
            : Array.from({ length: 16 }).map((_, index) => (
                <ProductsSkeletonLoader key={index} />
              ))}
        </div>
      </section>
      {/* <!-- Best Deals --> */}
      <section className="mt-8">
        <div className="bg-primary text-white px-4 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Best Deals</h2>
          {/* <span className="text-[12px] font-bold cursor-pointer uppercase hover:underline" onClick={() => navigate("/store")}>
            See All
          </span> */}
        </div>
        <div className="bg-white p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-[12px]">
          {/* <!-- Phone Product Cards --> */}
          {allProduct && allProduct.length > 0
            ? bestDealsProduct.length > 0
              ? bestDealsProduct.map((product, index) => (
                  <LandingPagePC
                    key={index}
                    product={product}
                    onClick={() => productDetails(product)}
                  />
                ))
              : null
            : Array.from({ length: 8 }).map((_, index) => (
                <ProductsSkeletonLoader key={index} />
              ))}
        </div>
      </section>
      {/* Apple Store Section */}
      <section className="mt-8 bg-white rounded-3xl shadow-[12px] overflow-hidden border border-gray-100">
        {/* <!-- Header --> */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center">
            {/* <img src="/apple_logo.png" className="w-8 -mt-1 h-full" /> */}
            {/* <span className="material-symbols-outlined fill !text-[34px] text-primary-light font-bold">
              ios
            </span> */}
            <h2 className="text-[18px] font-bold tracking-tight">
              Apple Store
            </h2>
          </div>
          <a
            className="text-[12px] font-bold flex items-center gap-1 hover:underline"
            href="#"
          >
            SEE ALL
            <span className="material-symbols-outlined text-[12px]">
              chevron_right
            </span>
          </a>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          {/* <!-- Side Promo Banner --> */}
          <div className="col-span-1 h-full">
            <img
              alt="Apple Store Promo"
              className="w-full h-full object-cover rounded-3xl"
              src="https://pcplaceng.com/laxgts/2025/08/apple-deal-1.jpg"
            />
          </div>
          {/* <!-- Product Grid --> */}
          <div className="col-span-2 grid grid-cols-5 grid-rows-2 gap-3">
            {allProduct && allProduct.length > 0
              ? appleProducts.length > 0
                ? appleProducts.map((product, index) => (
                    <div key={index}>
                      <StoreProductCard
                        product={product}
                        isInCart={cartItem.some(
                          (item) => item._id === product._id,
                        )}
                        onAddToCart={(product) => dispatch(addToCart(product))}
                        onRemoveFromCart={(product) =>
                          dispatch(removeFromCart(product))
                        }
                      />
                    </div>
                  ))
                : null
              : Array.from({ length: 4 }).map((_, index) => (
                  <ProductsSkeletonLoader key={index} />
                ))}
          </div>
        </div>
      </section>
      {/* <!-- Computing Deals Section --> */}
      <section className="mt-8 bg-white rounded-3xl shadow-[12px] overflow-hidden border border-gray-100">
        <div className="bg-white rounded-lg shadow-[12px] border border-gray-100 p-8">
          <h2 className="text-[32px] font-semibold text-center">
            Computing Deals
          </h2>
          <div className="grid grid-cols-6 gap-x-2 gap-y-4">
            {/* <!-- Row 1 --> */}
            <div
              onClick={() => navigate("/store?category=laptops")}
              className="group cursor-pointer"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Laptops"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-0-black-friday/2021/userneeds/computing-deals/laptops_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Laptops
              </p>
            </div>
            <div
              onClick={() => navigate("/store?category=tablets")}
              className="group cursor-pointer"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Tablets"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-0-black-friday/2021/cyber-monday/tablets_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Tablets
              </p>
            </div>
            <div
              onClick={() => navigate("/store?category=phones")}
              className="group cursor-pointer"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Phones"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-1-category-pages/phones-tablets/2025/300x400/Phones_Tablet/iphone-300X400.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Phones
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Scanners"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-0-black-friday/2021/userneeds/computing-deals/scanners_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Scanners
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Laptop Bags"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-0-black-friday/2021/userneeds/computing-deals/laptop-bags_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Laptop Bags
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Gaming"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/gaming_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Gaming
              </p>
            </div>
            {/* <!-- Row 2 --> */}
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Apple"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/apple_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Apple
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="HP"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/hp_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                HP
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Dell"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/dell_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Dell
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Intel"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/intel_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Intel
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <img
                  alt="Lenovo"
                  className="w-full h-20 object-contain"
                  src="https://ng.jumia.is/cms/0-5-TechWeek/2022/userneeds/work-from-anywhere/lenovo_260x144.png"
                />
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Lenovo
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 mb-2 flex flex-col shadow-sm items-center justify-center min-h-35 group-hover:shadow-lg group-hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-3xl text-gray-400">
                  arrow_forward
                </span>
              </div>
              <p className="text-[12px] group-hover:text-primary-light text-center font-medium text-gray-700">
                Work from Anywhere
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Information Text Section --> */}
      <section className="my-12 text-center text-gray-600 max-w-3xl mx-auto">
        <h1 className="text-[32px] font-bold mb-4">
          Rukatech Store - Nigeria's No. 1 Gadget Shopping Destination
        </h1>
        <p className="text-xs leading-relaxed">
          Shop for everything you need on Rukatech Store - from Laptops, Phones,
          Tablets, Office monitors and more. Experience fast delivery and easy
          returns on our official stores. Rukatech Store is your one-stop shop
          for all your daily essentials and luxury needs at the best prices in
          Nigeria.
        </p>
      </section>
    </div>
  );
};

export default Landingpage;
