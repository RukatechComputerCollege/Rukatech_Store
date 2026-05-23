import React, { useState, useRef, useEffect, useContext } from "react";
import { GoArrowRight } from "react-icons/go";
import Xbox from "../assets/xbox.png";
import GooglePixel from "../assets/googlePixel.png";
import Airpod from "../assets/airpod.png";
import { GoPackage, GoCreditCard } from "react-icons/go";
import { PiTrophyThin } from "react-icons/pi";
import { SlEarphonesAlt } from "react-icons/sl";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaWhatsapp, FaTabletAlt } from "react-icons/fa";
import { MdMonitor, MdHeadphonesBattery } from "react-icons/md";
import { GiProcessor, GiLaptop } from "react-icons/gi";
import { FcMultipleSmartphones } from "react-icons/fc";
import { TiThSmallOutline } from "react-icons/ti";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CategoryContext } from "../CategoryContext";
import BestDeals from "../components/BestDeals";
import FeaturedProducts from "../components/FeaturedProducts";
import FewProduct from "../components/FewProduct";
import axios from "axios";
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
  const [flashSales, setFlashSales] = useState([]);
  const [flashSalesLoading, setFlashSalesLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_ROUTE_NAME;
  const [productPrices, setProductPrices] = useState({});

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

  useEffect(() => {
    const loadFlashSales = async () => {
      try {
        setFlashSalesLoading(true);
        const response = await axios.get(`${API_URL}/user/flashsales`);
        if (response.data?.status) {
          setFlashSales(response.data.data || []);
        } else {
          setFlashSales([]);
        }
      } catch (err) {
        console.warn('Failed to load flash sales', err);
        setFlashSales([]);
      } finally {
        setFlashSalesLoading(false);
      }
    };

    loadFlashSales();
  }, [API_URL]);

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

  const flashSaleItems = flashSales.flatMap((sale) =>
    (sale.products || []).map((product) => ({
      ...product,
      discount: sale.discount,
      saleStartDate: sale.startDate,
      saleEndDate: sale.endDate,
    })),
  );

  const parseDiscountRate = (d) => {
    if (d == null) return 0;
    const n = typeof d === 'string' ? (d.includes('%') ? parseFloat(d.replace('%', '')) / 100 : parseFloat(d)) : Number(d);
    if (Number.isNaN(n)) return 0;
    return n > 1 ? n / 100 : n;
  };

  const formatPrice = (v) => (v == null ? '—' : Number(v).toLocaleString());

  useEffect(() => {
    const fetchPrices = async () => {
      const ids = Array.from(new Set(flashSaleItems.map((p) => p.productId).filter(Boolean)));
      for (const id of ids) {
        if (productPrices[id]) continue;
        try {
          const res = await axios.get(`${API_URL}/${ADMIN_URL}/product/${id}`);
          if (res.data?.status && res.data.data) {
            setProductPrices((prev) => ({ ...prev, [id]: res.data.data.price }));
          }
        } catch (e) {
          // ignore
        }
      }
    };
    if (flashSaleItems.length > 0) fetchPrices();
  }, [flashSaleItems]);

  const goToFlashProduct = async (product) => {
    // try find in allProduct first
    const found = allProduct?.find((p) => p._id === product.productId || p.name === product.productName);
    if (found) return productDetails(found);
    // otherwise fetch by id and navigate
    try {
      const res = await axios.get(`${API_URL}/${ADMIN_URL}/product/${product.productId}`);
      if (res.data?.status && res.data.data) {
        productDetails(res.data.data);
      } else {
        productDetails({ _id: product.productId, name: product.productName });
      }
    } catch (err) {
      productDetails({ _id: product.productId, name: product.productName });
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const ends = flashSales
        .map((sale) => sale.endDate)
        .filter(Boolean)
        .map((date) => new Date(date).getTime())
        .filter((time) => !Number.isNaN(time) && time > Date.now());
      const target = ends.length > 0 ? Math.min(...ends) : null;
      if (!target) {
        setCountdown({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [flashSales]);

  const categoryIconMap = {
    monitors: MdMonitor,
    processors: GiProcessor,
    phones: FcMultipleSmartphones,
    accessories: MdHeadphonesBattery,
    laptops: GiLaptop,
    tablets: FaTabletAlt,
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
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-primary-light transition-all text-l text-gray-600"
          >
            <TiThSmallOutline className="text-xl" />
            ALL PRODUCTS
          </a>
          {allCategory && allCategory.length > 0
            ? allCategory.map((category, index) => {
                const IconComponent =
                  categoryIconMap[category.toLowerCase()] || TiThSmallOutline;

                return (
                  <div key={index}>
                    <a
                      href={`/store?category=${encodeURIComponent(category)}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-primary-light transition-all text-l text-gray-600"
                    >
                      <span className="text-xl">
                        <IconComponent />
                      </span>
                      {category.toUpperCase()}
                    </a>
                  </div>
                );
              })
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
              src="./src/assets/debash.webp"
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
        <div className="bg-red-600 px-4 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-white">
          <div className="flex flex-wrap items-center gap-4">
            <img src="/chatgptflash.png" className="w-15 -mt-1 h-full" />
            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] font-bold">Flash Sales</h2>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="opacity-80">Time Left:</span>
                <div className="flex gap-1 font-mono flash-sale-timer">
                  <span className="bg-white/20 px-1 rounded">{countdown.hours}</span>:
                  <span className="bg-white/20 px-1 rounded">{countdown.minutes}</span>:
                  <span className="bg-white/20 px-1 rounded">{countdown.seconds}</span>
                </div>
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
        <div className="p-4">
          {flashSalesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-gray-100 p-4 bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : flashSaleItems.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 p-8 text-center text-sm text-[#475569]">
              No active flash sale products right now. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {flashSaleItems.map((product) => (
                <div key={`${product.productId}-${product.saleEndDate}-${product.productName}`} className="group cursor-pointer" onClick={() => goToFlashProduct(product)}>
                  <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow">
                    <img
                      className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
                      src={product.productImage || ''}
                      alt={product.productName}
                    />
                    <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discount ? `-${product.discount}` : 'Sale'}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">
                    {product.productName}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {(() => {
                      const orig = product.price || productPrices[product.productId] || null;
                      const rate = parseDiscountRate(product.discount);
                      if (!orig) return <span className="text-sm font-semibold">—</span>;
                      const discounted = Math.round(orig * (1 - rate));
                      return (
                        <>
                          <span className="text-[12px] text-gray-500 line-through">₦ {formatPrice(orig)}</span>
                          <span className="text-sm font-semibold text-[#111827]">₦ {formatPrice(discounted)}</span>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-[12px] font-semibold text-[#111827]">Flash deal</p>
                  <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-3/4"></div>
                  </div>
                  {product.saleEndDate && (
                    <p className="text-[9px] text-gray-500 mt-1">Ends {new Date(product.saleEndDate).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
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
        <div className="bg-white p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-[12px]">
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
        <div className="bg-white p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 rounded-b-3xl shadow-[12px]">
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
          <div className="hidden md:block col-span-1 h-full">
            <img
              alt="Apple Store Promo"
              className="w-full h-full object-cover rounded-3xl"
              src="https://pcplaceng.com/laxgts/2025/08/apple-deal-1.jpg"
            />
          </div>
          {/* <!-- Product Grid --> */}
          <div className="col-span-3 md:col-span-2 grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-3">
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
          <div className="grid grid-cols-3 md:grid-cols-6 gap-x-2 gap-y-4">
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
