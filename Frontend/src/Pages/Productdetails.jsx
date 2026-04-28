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
  const id = useLocation().state?.id;
  const product = useLocation().state?.product;
  console.log("product from state: ", product);
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_ROUTE_NAME;
  const { allProduct } = useContext(CategoryContext);
  const dispatch = useDispatch();
  const [featureTab, setFeatureTab] = useState("Product Specification");
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
    // const foundProduct = allProduct.find((product) => product?._id === id.id);
    // setProduct(foundProduct);
    // console.log("Product found: ", foundProduct);
    document.title = `${product?.name || "Loading..."} | Fastcart Online Store`;
  }, [id, product]);

  useEffect(() => {
    if (product?._id) {
      console.log("Product.id from line 43: ", product._id);
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
            {product?.category || "-"}
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
              {product?.storage && (
                <span className="font-inter block mb-3">
                  Memory Capacity:
                  <span className="text-primary font-bold">{product?.storage}</span>
                </span>
              )}
              {product?.ram && (
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-outline-variant rounded-full text-sm hover:border-primary-light">
                    {product?.ram}
                  </button>
                </div>
              )}
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
                  className="px-6 py-3 flex items-center font-bold justify-center text-center w-16 border-t border-b border-outline-variant focus:outline-none"
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
              <button
                onClick={handleCartToggle}
                className="flex-1 bg-primary text-white font-bold py-3 rounded hover:bg-primary transition-all duration-200 Active:scale-95 flex items-center justify-center gap-2"
              >
                {isAddedToCart ? (
                  <span className="material-symbols-outlined">
                    remove_shopping_cart
                  </span>
                ) : (
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                )}
                {isAddedToCart ? "Remove from Cart" : "Add to Cart"}
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
                    <span className="material-symbols-outlined text-sm text-primary">
                      storefront
                    </span>
                  </div>
                  <span className="text-sm font-bold">Rukatech Store</span>
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
            <button
              onClick={() => setFeatureTab("Product Specification")}
              className={`px-8 py-4 font-label-lg tab-active transition-all ${featureTab === "Product Specification" ? "border-b-4 border-primary-light" : ""}`}
            >
              Product Specification
            </button>
            <button
              onClick={() => setFeatureTab("Full Description")}
              className={`px-8 py-4 font-label-lg transition-all ${featureTab === "Full Description" ? "border-b-4 border-primary-light" : "text-secondary hover:text-primary"}`}
            >
              Full Description
            </button>
            <button
              onClick={() => setFeatureTab("Customer's Review")}
              className={`px-8 py-4 font-label-lg transition-all ${featureTab === "Customer's Review" ? "border-b-4 border-primary-light" : "text-secondary hover:text-primary"}`}
            >
              Customer's Review ( {totalRating || 0} )
            </button>
          </div>
          {featureTab === "Product Specification" && (
            <div className="p-8">
              {/* <!-- Specifications Content --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                    General Specs
                  </h4>
                  {product?.brand && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Brand</span>
                      <span className="font-medium">{product?.brand}</span>
                    </div>
                  )}
                  {product?.displaySize && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Display Size</span>
                      <span className="font-medium">
                        {product?.displaySize}
                      </span>
                    </div>
                  )}
                  {product?.model && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Model</span>
                      <span className="font-medium">{product?.model}</span>
                    </div>
                  )}
                  {product?.processor && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Processor</span>
                      <span className="font-medium">{product?.processor}</span>
                    </div>
                  )}
                  {product?.operatingSystem && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Operating System</span>
                      <span className="font-medium">{product?.operatingSystem}</span>
                    </div>
                  )}
                  {product?.weight && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Weight</span>
                      <span className="font-medium">{product?.weight}</span>
                    </div>
                  )}
                  {product?.color && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary">Color</span>
                      <span className="font-medium">{product?.color}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                    Performance
                  </h4>
                  {product?.ram && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">ram</span>
                      <span className="font-medium uppercase">{product?.ram}</span>
                    </div>
                  )}
                  {product?.graphicsCardMemory && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">Graphics Card Memory</span>
                      <span className="font-medium">{product?.graphicsCardMemory}</span>
                    </div>
                  )}
                  {product?.battery && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">Battery</span>
                      <span className="font-medium">{product?.battery}</span>
                    </div>
                  )}
                  {product?.storage && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">storage</span>
                      <span className="font-medium uppercase">{product?.storage}</span>
                    </div>
                  )}
                  {product?.storageType && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">storageType</span>
                      <span className="font-medium uppercase">{product?.storageType}</span>
                    </div>
                  )}
                  {product?.operatingSystem && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">Operating System</span>
                      <span className="font-medium uppercase">{product?.operatingSystem}</span>
                    </div>
                  )}
                  {product?.numberOfCores && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">Number of Cores</span>
                      <span className="font-medium uppercase">{product?.numberOfCores}</span>
                    </div>
                  )}
                  {product?.numberOfCores && (
                    <div className="flex justify-between border-b border-surface-container pb-2">
                      <span className="text-secondary uppercase">Number of Cores</span>
                      <span className="font-medium uppercase">{product?.numberOfCores}</span>
                    </div>
                  )}
                  
                </div>
              </div>
              {/* Product Overview */}
              {/* <div className="mt-12">
                <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                  Product Overview
                </h4>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  The 2024 Zephyrus G14 is defined by its CNC-milled aluminum
                  chassis and the all-new Slash Lighting array on the lid. This
                  compact powerhouse brings elite performance to a portable
                  1.5kg frame. With the stunning 3K OLED ROG Nebula Display, you
                  get unmatched color accuracy and deep blacks for both gaming
                  and creative work.
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
              </div> */}
            </div>
          )}
          {featureTab === "Full Description" && (
            <div className="p-8">
              {/* <!-- Specifications Content --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                    Description
                  </h4>
                  <div className="flex justify-between border-b border-surface-container pb-2">
                    <p className="text-justify text-on-surface-variant">
                      {product?.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                    Features
                  </h4>
                  <div className="flex justify-between border-b border-surface-container pb-2">
                    <ul>
                      {product?.features?.split(",").map((feature, index) => (
                        <li key={index} className="list-disc ml-5 mb-2">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <h4 className="text-lg font-bold border-l-4 border-primary-light pl-3 mb-6">
                  What's in the box?
                </h4>
                <ul>
                  {product?.productBox?.split(",").map((item, index) => (
                    <li key={index} className="list-disc ml-5 mb-6">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {featureTab === "Customer's Review" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-primary">
                  Verified Customer Feedback
                </h2>
                <a
                  className="text-primary-light font-bold text-sm flex items-center gap-1 hover:underline"
                  href="#"
                >
                  SEE ALL
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* <!-- Rating Summary --> */}
                <div className="md:col-span-4 flex flex-col">
                  <div className="bg-surface-container-lowest border border-gray-100 p-6 rounded-xl mb-6">
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-4">
                      Product Rating
                    </span>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-5xl font-black text-primary-light">
                        {Math.abs(averageRating) || 0}/5
                      </span>
                    </div>
                    <div className="flex text-primary-light mb-2">
                      {[...Array(5)].map((_, i) =>
                        i < Math.round(averageRating || 0) ? (
                          <span
                            key={i}
                            className="material-symbols-outlined text-2xl fill"
                          >
                            star
                          </span>
                        ) : (
                          <span
                            key={i}
                            className="material-symbols-outlined text-2xl text-gray-200"
                          >
                            star
                          </span>
                        ),
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {totalRating || 0} verified ratings
                    </span>
                  </div>
                  {/* <!-- Star Distribution --> */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-4">5</span>
                      <span className="material-symbols-outlined text-sm text-primary-light fill">
                        star
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[70%]"></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        852
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-4">4</span>
                      <span className="material-symbols-outlined text-sm text-primary-light fill">
                        star
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[15%]"></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        180
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-4">3</span>
                      <span className="material-symbols-outlined text-sm text-primary-light fill">
                        star
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[8%]"></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        65
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-4">2</span>
                      <span className="material-symbols-outlined text-sm text-primary-light fill">
                        star
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[4%]"></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        24
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-4">1</span>
                      <span className="material-symbols-outlined text-sm text-primary-light fill">
                        star
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[2%]"></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        10
                      </span>
                    </div>
                  </div>
                </div>
                {/* <!-- Comments Section --> */}
                <div className="md:col-span-8">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="font-label-lg text-on-background uppercase text-xs tracking-widest">
                      Comments From Verified Purchases
                    </h3>
                  </div>
                  <div className="space-y-8">
                    {product?.rating && product.rating.length > 0 ? (
                      product.rating.map((rates, index) => (
                        <div
                          key={index}
                          className="pb-8 border-b border-gray-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex text-primary-light scale-75 -ml-2">
                              {[...Array(5)].map((_, i) =>
                                i < rates.ratingGrade ? (
                                  <span
                                    key={i}
                                    className="material-symbols-outlined fill"
                                  >
                                    star
                                  </span>
                                ) : (
                                  <span
                                    key={i}
                                    className="material-symbols-outlined"
                                  >
                                    star
                                  </span>
                                ),
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {rates.createdAt.split("T")[0]}
                            </span>
                          </div>
                          <h4 className="font-bold text-on-background mb-1">
                            Quality
                          </h4>
                          <p className="text-sm text-on-surface-variant mb-3">
                            {rates.feedback}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              by Chigozie
                            </span>
                            <div className="flex items-center gap-1 text-tertiary font-bold text-[10px]">
                              <span className="material-symbols-outlined text-xs">
                                verified
                              </span>
                              VERIFIED PURCHASE
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>no rating</div>
                    )}
                  </div>
                  <button className="w-full py-4 mt-8 bg-surface-container text-primary font-bold rounded-lg hover:bg-orange-50 transition-all text-sm">
                    LOAD MORE REVIEWS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* <!-- More Products Section --> */}
      <section className="mt-xl mb-xl">
        <BrowsingHistory />
      </section>
    </div>
  );
};

export default Productdetails;
