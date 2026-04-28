import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CategoryContext } from "../CategoryContext";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar, FaMinus, FaPlus, FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../redux/Cart";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Loader from "../components/Loader";
import Gallery from "../components/Gallery";
import FlutterwaveLogo from "../assets/Flutterwave_Logo.png";
import FewProduct from "../components/FewProduct";
import { addToRecentlyViewed } from "../components/Recentlyview";
import BrowsingHistory from "../components/BrowsingHistory";

const Productdetails = () => {
  const id = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_ROUTE_NAME;
  const { allProduct } = useContext(CategoryContext);
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);
  const cartProduct = cartItem.find((item) => item._id === product?._id);
  const [localQuantity, setLocalQuantity] = useState(
    cartProduct ? cartProduct.quantity : 1,
  );
  const quantity = cartProduct ? cartProduct.quantity : 1;
  const [isReading, setIsReading] = useState("description");
  const [averageRating, setAverageRating] = useState("");
  const [totalRating, setTotalRating] = useState("");
  useEffect(() => {
    const foundProduct = allProduct.find((product) => product._id === id.id);
    setProduct(foundProduct);
    console.log(product);
    document.title = `${foundProduct?.name || "Loading..."} | Fastcart Online Store`;
  }, [id, allProduct]);

  useEffect(() => {
    if (product?._id) {
      console.log(product._id);
      addToRecentlyViewed(product._id);

      axios
        .get(`${API_URL}/${ADMIN_URL}/${product._id}/average-rating`)
        .then((res) => {
          console.log("Average Rating:", res.data);
          setAverageRating(res.data.averageRating);
          setTotalRating(res.data.totalrating);
        })
        .catch((err) => console.error(err));
    }
  }, [product]);

  const isAddedToCart =
    product && cartItem.some((item) => item._id === product._id);

  const handleCartToggle = () => {
    if (isAddedToCart) {
      dispatch(removeFromCart(product));
    } else {
      dispatch(addToCart(product));
    }
  };
  useEffect(() => {
    if (cartProduct) {
      setLocalQuantity(cartProduct.quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [cartProduct]);
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setLocalQuantity("");
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setLocalQuantity(parsed);
    }
  };
  const commitQuantity = () => {
    const finalQuantity =
      localQuantity === "" ? 1 : Math.max(1, parseInt(localQuantity, 10));
    setLocalQuantity(finalQuantity);

    dispatch(
      updateQuantity({
        productId: product._id,
        quantity: finalQuantity,
      }),
    );
  };
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const deliveryDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="w-full flex flex-col gap-4" style={{ padding: "3% 6%" }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-xl">
        {/* <!-- Left: Image Gallery (4 columns) --> */}
        <Gallery images={product?.image || []} />
        {/* <!-- Middle: Product Info (5 columns) --> */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary font-inter uppercase tracking-wider">
              {product?.name}
            </span>
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-red-500 transition-colors">
              favorite
            </span>
          </div>
          <h1 className="font-headline-lg text-on-background mb-2">
            <span className="font-bold text-primary">Category: </span>
            {product?.category ? product.category.map((cat) => cat.name) : "-"}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-primary">
              <span className="material-symbols-outlined fill">star</span>
              <span className="material-symbols-outlined fill">star</span>
              <span className="material-symbols-outlined fill">star</span>
              <span className="material-symbols-outlined fill">star</span>
              <span className="material-symbols-outlined">star_half</span>
              <span className="ml-2 text-sm text-secondary">(154 Ratings)</span>
            </div>
            <div className="h-4 w-px bg-surface-container-highest"></div>
            <span className="text-sm text-tertiary font-medium">
              {product?.inventory > 0
                ? `In Stock (${product?.inventory} units)`
                : "Out of Stock"}
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg mb-8">
            <div className="flex items-baseline gap-3">
              {product?.discountprice && (
                <span className="font-inter text-on-background">
                  ₦{product?.discountprice?.toLocaleString()}
                </span>
              )}
              <span
                className={`text-lg  ${product?.discountprice ? "line-through text-secondary" : "text-[#2DA5F3] md:text-[34px] font-bold"}`}
              >
                ₦{product?.price?.toLocaleString()}
              </span>
              {product?.discountPercentage && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                  -{product?.discountPercentage}%
                </span>
              )}
            </div>
            <p className="text-xs text-secondary mt-1">
              Inclusive of all taxes and shipping insurance.
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <span className="font-inter block mb-3">
                Memory Capacity:
                <span className="text-primary font-bold"> 32GB</span>
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-outline-variant rounded-full text-sm hover:border-primary-light">
                  16GB
                </button>
                <button className="px-4 py-2 border-2 border-primary-light rounded-full text-sm text-primary font-bold bg-primary-fixed">
                  32GB
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex border border-outline-variant rounded overflow-hidden">
                <button
                  onClick={() => {
                    const newQty = Math.max(
                      1,
                      (parseInt(localQuantity) || 1) - 1,
                    );
                    setLocalQuantity(newQty);
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        quantity: newQty,
                      }),
                    );
                  }}
                  className="px-4 py-3 cursor-pointer bg-surface-container-high hover:bg-primary-light transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    remove
                  </span>
                </button>
                <input
                  type="number"
                  min="1"
                  value={localQuantity}
                  onChange={(e) => {
                    const newQty = Math.max(1, parseInt(e.target.value) || 1);
                    setLocalQuantity(newQty);
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        quantity: newQty,
                      }),
                    );
                  }}
                  className="px-6 py-3 flex items-center font-bold"
                />
                <button
                  onClick={() => {
                    const newQty = Math.max(
                      1,
                      (parseInt(localQuantity) || 1) + 1,
                    );
                    setLocalQuantity(newQty);
                    dispatch(
                      updateQuantity({
                        productId: product._id,
                        quantity: newQty,
                      }),
                    );
                  }}
                  className="px-4 py-3 bg-surface-container-high hover:bg-primary-light transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <button className="flex-1 bg-primary text-white font-bold py-3 rounded hover:bg-primary transition-all duration-200 Active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Right: Delivery & Returns (3 columns) --> */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-surface-container-high rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-surface-container">
              <h3 className="font-inter mb-4">DELIVERY &amp; RETURNS</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">New York, NY 10001</p>
                    <button className="text-xs text-primary font-bold hover:underline">
                      Change Location
                    </button>
                  </div>
                </div>
                <hr className="border-surface-container" />
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">
                    local_shipping
                  </span>
                  <div>
                    <p className="text-sm font-bold">Free Express Delivery</p>
                    <p className="text-xs text-secondary mt-1">
                      Delivery by tomorrow if ordered in the next 3 hrs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">
                    assignment_return
                  </span>
                  <div>
                    <p className="text-sm font-bold">Easy Returns</p>
                    <p className="text-xs text-secondary mt-1">
                      Free 15-day return policy for peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low">
              <h4 className="text-xs font-bold text-secondary mb-3">
                SELLER INFORMATION
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">
                      storefront
                    </span>
                  </div>
                  <span className="text-sm font-bold">ROG Flagship Store</span>
                </div>
                <span className="text-xs bg-tertiary-container text-white px-2 py-0.5 rounded">
                  Top Seller
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Product Details Section (Tabs) --> */}
      <section className="mt-xl">
        <div className="bg-white border border-surface-container-high rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-surface-container overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button className="px-8 py-4 font-label-lg tab-active transition-all">
              Product Specification
            </button>
            <button className="px-8 py-4 font-label-lg text-secondary hover:text-primary transition-all">
              Full Description
            </button>
            <button className="px-8 py-4 font-label-lg text-secondary hover:text-primary transition-all">
              Customer's Review (154)
            </button>
          </div>
          <div className="p-8">
            {/* <!-- Specifications Content --> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              <div className="space-y-4">
                <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                  General Specs
                </h4>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Brand</span>
                  <span className="font-medium">ASUS ROG</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Model</span>
                  <span className="font-medium">Zephyrus G14 (2024)</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Display</span>
                  <span className="font-medium">14" 3K OLED 120Hz</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Processor</span>
                  <span className="font-medium">AMD Ryzen 9 8945HS</span>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                  Performance
                </h4>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">RAM</span>
                  <span className="font-medium">32GB LPDDR5X</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">GPU</span>
                  <span className="font-medium">
                    NVIDIA GeForce RTX 4070 (8GB)
                  </span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Storage</span>
                  <span className="font-medium">1TB M.2 NVMe SSD</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-secondary">Battery</span>
                  <span className="font-medium">73Whrs, 4-cell Li-ion</span>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                Product Overview
              </h4>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                The 2024 Zephyrus G14 is defined by its CNC-milled aluminum
                chassis and the all-new Slash Lighting array on the lid. This
                compact powerhouse brings elite performance to a portable 1.5kg
                frame. With the stunning 3K OLED ROG Nebula Display, you get
                unmatched color accuracy and deep blacks for both gaming and
                creative work.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container rounded-lg p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-primary-light mb-2">
                    speed
                  </span>
                  <h5 className="font-bold">Extreme Speed</h5>
                  <p className="text-xs text-secondary mt-1">
                    Powered by AMD Ryzen™ 8000 Series processors.
                  </p>
                </div>
                <div className="bg-surface-container rounded-lg p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-primary-light mb-2">
                    display_settings
                  </span>
                  <h5 className="font-bold">OLED Nebula</h5>
                  <p className="text-xs text-secondary mt-1">
                    Vibrant 3K resolution with 120Hz refresh rate.
                  </p>
                </div>
                <div className="bg-surface-container rounded-lg p-6 text-center">
                  <span className="material-symbols-outlined text-4xl text-primary-light mb-2">
                    bolt
                  </span>
                  <h5 className="font-bold">RTX 4070</h5>
                  <p className="text-xs text-secondary mt-1">
                    AI-powered graphics for next-gen gaming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- More Products Section --> */}
      <section className="mt-xl mb-xl">
        <h2 className="font-inter font-bold text-lg">
          Explore your recently viewed products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
          {/* <!-- Product Card 1 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="close-up of a high-end computer mouse with rgb lighting on a gaming mousepad"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjPpQbYUKCKnekMGf0S1dNQwV2t_LT5U5jYwTAk2_w3JwAGOz1tsNcK_tFTmf7eQ8-wywUM5GbArNvAZlrOGg35X4xeu8LRBfh9AZtGnP-105meg89eNWzPSeXxEOqCHyPUWBGtWIzfPwzBLltLQyHgkK_lZh0wsOsX3sUInRcL0octRJB78-BNGVVhI1f8cPHPHxoCYw_b9-pwjeialKSf-3XEzWggdxZOZ8yERD_J4UUGxG4xBkM43Cn3Y4kFHxB5ZSITbgP38gg"
              />
              <span className="absolute top-1 right-1 bg-tertiary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -15%
              </span>
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Gladius III Wireless AimPoint Gaming Mouse
            </h3>
            <p className="font-bold text-sm text-on-background">$89.00</p>
            <p className="text-[10px] text-secondary line-through">$105.00</p>
          </div>
          {/* <!-- Product Card 2 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="professional gaming headset with large earcups and retractable microphone"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVnaXineQ6kxtNHoODpJqvmqTGTdmeNjNeyp5zo0wGLu7TOjF5I5cvHVrlYQmEPQ6jv1mdQDydp-rpSei_F86Lt-y6WiffTcKJaoorSZrMhO1TiP8SioZXMHAhJpndF9sqT2LwLK93lQKSqXSJqSWjzGvKVQxxfDvTiLicFxSv-UlyvUGJBCX1RVrXe3AzHjNDkToTwJ_HR6tityF1cL6NVh8OwAoFK9uiV1a8S_8P5nS4OKF73C6rQs4svU4bVV83p4JzPIIYJPTd"
              />
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Delta S Core Gaming Headset
            </h3>
            <p className="font-bold text-sm text-on-background">$129.99</p>
            <p className="text-[10px] text-secondary">Free Shipping</p>
          </div>
          {/* <!-- Card 3 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="slim mechanical gaming keyboard with customizable rgb lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDriHoUPHf-CDari4HKKBvMDBEP6i8cQxm_jwU5j9aVl3JRWIbeYr2bjWVOo-cgSpqlo7xVvaubJOcw6lmpg-lVoKz8TSqlvzlnf8AIa7w8BugrfwUBWl2W7k2AJsSfX5X7n0L0W2del51Kl--bOptM6JvO-bcVpaVRRMoAoLju48DITbtRQXBbfNfwqeIsPHgrz9oVQNEREonZq1cx67KqlS-K5JncF1cZ1DA5VQ3Vv8JBAeDdum8A_RzIKGfRSrgqb1cYZ0WT3a0"
              />
              <span className="absolute top-1 right-1 bg-primary-light text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Falchion RX Low Profile Keyboard
            </h3>
            <p className="font-bold text-sm text-on-background">$169.00</p>
          </div>
          {/* <!-- Card 4 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="curved gaming monitor displaying a vibrant colorful landscape"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnt6HNCsbjON4hCUjniIIIgKCLPwebaHjnbNdg0bUkGjSloJ_KlyuULWeYzd6i6DqoGSOAc2mTqeayGfIosp9bWOOCZtnVISvXCDybHZz-sGesShPEcfFxborAst3NAUzE0Axx0hGgwae9EzjLO8XcifiujToXk_XoTzvIyU07mZMrvUpGYnTdirEzGnMmSDfCdSU6zTk26Oqt6mgvqrtvPLOiFLtNfqTgyxvExAwo0Bzg4B1TYdazCru-DXX0KklRV95lz40Aol5F"
              />
              <span className="absolute top-1 right-1 bg-tertiary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -20%
              </span>
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Swift OLED PG27AQDM 27" Gaming Monitor
            </h3>
            <p className="font-bold text-sm text-on-background">$899.00</p>
            <p className="text-[10px] text-secondary line-through">$1,100.00</p>
          </div>
          {/* <!-- Card 5 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="sleek black gaming laptop bag with padded straps and multiple compartments"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg7Og4HSgBpjumQspAV4MlRJ2q_8H3V-2gqiJguzJ1RB5B6ahISn073h0GmbAWntUK6OMaf-SV4YNHFNMF-txcSlHqKnNCDa2-DFlxkUhZxg2IfumZWL_Eu27mFsjBienfOGsNwqXSQ_wEldVzLWAaeYzep_TwiVne9QVRNST2Vz0yCR5lUWxFrbN2tRzRi3oewfJagaWGJSSvN-pYzXJUJ-cGCHR4Mf48TwdzeS2cvQ12qo2Mk9k546q9kRMNNU2VQRtc1UsKAhwN"
              />
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Ranger BP2701 Gaming Backpack
            </h3>
            <p className="font-bold text-sm text-on-background">$79.99</p>
          </div>
          {/* <!-- Card 6 --> */}
          <div className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                data-alt="external ssd drive with glowing led indicator on a metal surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMgD6-pdop_uxoi9ZrNiK266ruhO0YnCFMEDvOMZkPKVi_-Q6o6VMRqQY7EAEE6wCykdvDVzJfm0dXIDptrHYiMDoYGqOZZjbN8-yMcGWKFP5eqfc0ySc7waOWtGIKCWtv06KcWp6IwAiEiL57aKTZkwli6vUyjU2maBFHJluH7si3dkQhYUOfQ5nMOSOUvg--jFOS2HFARIBxbqpovwCwCLs3tJiE82Kh-2B1DIztRE4IXIpWqPqM5hn9R-3m6ktTvApxkhLl1Oyr"
              />
            </div>
            <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
              ROG Strix Arion S500 Portable SSD 500GB
            </h3>
            <p className="font-bold text-sm text-on-background">$109.99</p>
          </div>
        </div>
      </section>
      <div className="w-full flex flex-col gap-8">
        {product ? (
          <div className="w-full grid md:grid-cols-2 gap-8">
            {/* this is for product image */}
            <div className="w-[100%] flex flex-col gap-4 max-w-full">
              <Gallery images={product.image} />
            </div>
            {/* this is for products name */}
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-[24px] text-[#191C1F] font-bold">
                {product?.name}
              </h1>
              <div className="w-full flex items-center gap-4">
                <p className="text-[14px]">
                  Category:{" "}
                  <span className="text-[#191C1F] font-semibold">
                    {product?.category
                      ? product.category.map((cat) => cat.name)
                      : "-"}
                  </span>
                </p>
                <p className="text-[14px]">
                  Availability:{" "}
                  <span className="text-[#2DB224] font-semibold">
                    {product?.inventory > 0
                      ? `${product?.inventory} in stock`
                      : "out of stock"}
                  </span>
                </p>
              </div>
              {/* for price and percentage */}
              <div
                className="w-full flex flex-row gap-4 items-center md:items-center border-b border-[#E4E7E9]"
                style={{ padding: "20px 0" }}
              >
                <p className="text-[#2DA5F3] text-[14px] flex flex-col md:flex-row md:items-center md:gap-2">
                  {product?.discountprice && (
                    <span className="text-[#2DA5F3] text-[18px] md:text-[34px] font-bold">
                      ₦{product?.discountprice?.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`md:text-[20px] ${product?.discountprice ? "line-through text-[#77878F]" : "text-[#2DA5F3] md:text-[34px] font-bold"}`}
                  >
                    ₦{product?.price?.toLocaleString()}
                  </span>
                </p>
                {product?.discountPercentage && (
                  <span
                    className="rounded-[2px] bg-[#EFD33D] text-black text-[12px]"
                    style={{ padding: "3px 5px" }}
                  >
                    {product?.discountPercentage}% OFF
                  </span>
                )}
              </div>
              {/* for additional information */}
              <div className="w-full grid md:grid-cols-2 gap-4">
                {/* for color */}
                <div className="w-full flex flex-col gap-2">
                  <h1 className="text-[16px] font-medium">Color</h1>
                  <p
                    className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.color ? "text-[#aeaeae]" : ""}`}
                    style={{ padding: "5px" }}
                  >
                    {product?.color || "N/A"}
                  </p>
                </div>
                {/* for weight */}
                <div className="w-full flex flex-col gap-2">
                  <h1 className="text-[16px] font-medium">Weight</h1>
                  <p
                    className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.weight ? "text-[#E4E7E9]" : ""}`}
                    style={{ padding: "5px" }}
                  >
                    {product?.weight || "N/A"}
                  </p>
                </div>
                {/* for country */}
                <div className="w-full flex flex-col gap-2">
                  <h1 className="text-[16px] font-medium">Country</h1>
                  <p
                    className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.country ? "text-[#E4E7E9]" : ""}`}
                    style={{ padding: "5px" }}
                  >
                    {product?.country || "N/A"}
                  </p>
                </div>
                {/* for weight */}
                <div className="w-full flex flex-col gap-2">
                  <h1 className="text-[16px] font-medium">Size</h1>
                  <p
                    className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.size ? "text-[#E4E7E9]" : ""}`}
                    style={{ padding: "5px" }}
                  >
                    {product?.size || "N/A"}
                  </p>
                </div>
              </div>
              {/* action button */}
              <div
                className="w-full grid md:grid-cols-[1fr_3fr_1fr] gap-4"
                style={{ padding: "20px 0" }}
              >
                {/* <button className="rounded-[3px] border-2 border-[#FA8232] text-[#FA8232] flex items-center justify-center gap-[8px] cursor-pointer transition-all hover:bg-[#f3dccd] active:bg-[#f1c8ae]" style={{ padding: "12px" }}>
                  <FaRegHeart size={24} />
                </button> */}
                <div className="w-full h-full">
                  <div className="w-full h-full">
                    <div
                      className="w-25 h-full text-[#191C1F] flex items-center gap-4 justify-center border border-[#E4E7E9] rounded-[3px]"
                      style={{ padding: "5px 10px" }}
                    >
                      <FaMinus
                        className="cursor-pointer"
                        onClick={() => {
                          const newQty = Math.max(
                            1,
                            (parseInt(localQuantity) || 1) - 1,
                          );
                          setLocalQuantity(newQty);
                          dispatch(
                            updateQuantity({
                              productId: product._id,
                              quantity: newQty,
                            }),
                          );
                        }}
                        size={16}
                      />
                      <input
                        type="number"
                        min="1"
                        onChange={handleQuantityChange}
                        onBlur={commitQuantity}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            commitQuantity();
                          }
                        }}
                        className="border-0 focus:outline-0 w-8 text-center"
                        value={localQuantity}
                      />
                      <FaPlus
                        className="cursor-pointer"
                        onClick={() => {
                          const newQty = (parseInt(localQuantity) || 1) + 1;
                          setLocalQuantity(newQty);
                          dispatch(
                            updateQuantity({
                              productId: product._id,
                              quantity: newQty,
                            }),
                          );
                        }}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCartToggle}
                  className="rounded-[3px] bg-[#FA8232] text-white flex items-center justify-center gap-[8px] cursor-pointer transition-all hover:bg-[#f7751f] active:bg-[#f89e62]"
                  style={{ padding: "15px" }}
                >
                  {isAddedToCart ? (
                    <FaMinus size={20} />
                  ) : (
                    <FiShoppingCart size={20} />
                  )}
                  <span className="font-bold text-[14px]">
                    {isAddedToCart ? "REMOVE FROM CART" : "ADD TO CART"}
                  </span>
                </button>

                <button
                  className="rounded-[3px] border-2 border-[#FA8232] text-[#FA8232] justify-center flex items-center gap-[8px] cursor-pointer transition-all hover:bg-[#f3dccd] active:bg-[#f1c8ae]"
                  style={{ padding: "12px" }}
                >
                  <MdOutlineRemoveRedEye size={24} />
                </button>
              </div>
              <div
                className="w-full rounded-[3px] border border-[#E4E7E9] flex flex-col"
                style={{ padding: "10px 20px" }}
              >
                <p>100% Guarantee Safe Checkout By</p>
                <img src={FlutterwaveLogo} className="w-[200px]" alt="" />
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}

        <div className="w-full rounded-[3px] border border-[#E4E7E9] flex flex-col gap-4">
          <div
            className="w-full text-[#191C1F] overflow-x-auto whitespace-nowrap font-medium flex items-center md:justify-center border-b border-[#E4E7E9]"
            style={{ padding: "15px" }}
          >
            <button
              style={{ padding: "0 15px" }}
              onClick={() => setIsReading("description")}
              className={`cursor-pointer ${isReading == "description" ? "border-b-3 border-[#FA8232]" : ""}`}
            >
              DESCRIPTION
            </button>
            <button
              style={{ padding: "0 15px" }}
              onClick={() => setIsReading("additional-information")}
              className={`cursor-pointer ${isReading == "additional-information" ? "border-b-3 border-[#FA8232]" : ""}`}
            >
              ADDITONAL INFORMATION
            </button>
            <button
              style={{ padding: "0 15px" }}
              onClick={() => setIsReading("specification")}
              className={`cursor-pointer ${isReading == "specification" ? "border-b-3 border-[#FA8232]" : ""}`}
            >
              SPECIFICATION
            </button>
            <button
              style={{ padding: "0 15px" }}
              onClick={() => setIsReading("review")}
              className={`cursor-pointer ${isReading == "review" ? "border-b-3 border-[#FA8232]" : ""}`}
            >
              REVIEW
            </button>
          </div>
          <div style={{ padding: "20px" }}>
            {isReading == "description" ? (
              // for description
              <div className="w-full grid md:grid-cols-[1fr_1fr_1fr] gap-4">
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-[#191C1F] font-semibold text-[16px]">
                    Description
                  </h1>
                  <p className="text-[14px]">{product?.description}</p>
                </div>
                {/* for feature */}
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-[#191C1F] font-semibold text-[16px]">
                    Feature
                  </h1>
                  <p>{product?.keyFeatures}</p>
                </div>
                {/* for what's in the box */}
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-[#191C1F] font-semibold text-[16px]">
                    What is in the box/package
                  </h1>
                  <p>{product?.productBox || "-"}</p>
                </div>
              </div>
            ) : isReading == "additional-information" ? (
              <div>
                <h1 className="text-[#191C1F] font-semibold text-[16px]">
                  Shipping Information
                </h1>
                <p>
                  Your Order will be delivered to your shipping address at most
                  5 days from order date, which will be
                  <strong> {deliveryDate}</strong>
                </p>
              </div>
            ) : isReading == "specification" ? (
              <div>
                <p>N/A</p>
              </div>
            ) : isReading == "review" ? (
              <div className="w-full flex flex-col gap-4">
                {product?.rating && product.rating.length > 0 ? (
                  <div className="w-full items-start flex flex-col gap-4">
                    <div
                      className="bg-[#FBF4CE] rounded-[4px] items-center justify-center flex flex-col gap-4"
                      style={{ padding: "32px" }}
                    >
                      <h1 className="text-[#191C1F] text-[56px] font-semibold">
                        {averageRating}
                      </h1>
                      <div className="flex">
                        {[...Array(5)].map((_, i) =>
                          i < averageRating ? (
                            <FaStar
                              key={i}
                              size={18}
                              className="text-[#FA8232]"
                            />
                          ) : (
                            <FaRegStar
                              key={i}
                              size={18}
                              className="text-[#ADB7BC]"
                            />
                          ),
                        )}
                      </div>
                      <p>
                        <span className="text-[#191C1F] text-[16px] font-medium">
                          Customer Rating
                        </span>
                        <span className="text-[#475156] text-[16px]">
                          {" "}
                          ({totalRating})
                        </span>
                      </p>
                    </div>
                    <h1 className="text-[#191C1F] text-[16px] font-semibold">
                      Customer Feedback
                    </h1>
                    {product?.rating.map((rates, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 border-b border-[#E4E7E9]"
                        style={{ paddingBottom: "10px" }}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-[48px] h-[48px] rounded-[50%] border border-[#191C1F]"></div>
                          <div className="flex flex-col gap-2">
                            <p>
                              <span className="text-[#191C1F] text-[14px] font-medium">
                                Dianne Russell
                              </span>{" "}
                              • <br className="md:hidden" />
                              <span className="text-[#5F6C72] text-[12px]">
                                {rates.createdAt.split("T")[0]}
                              </span>
                            </p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) =>
                                i < rates.ratingGrade ? (
                                  <FaStar
                                    key={i}
                                    size={18}
                                    className="text-[#FA8232]"
                                  />
                                ) : (
                                  <FaRegStar
                                    key={i}
                                    size={18}
                                    className="text-[#ADB7BC]"
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-[14px] text-[#475156]">
                          {rates.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>no rating</div>
                )}
              </div>
            ) : (
              "nothing here"
            )}
          </div>
        </div>
      </div>
      <BrowsingHistory />
      <FewProduct />
    </div>
  );
};

export default Productdetails;
