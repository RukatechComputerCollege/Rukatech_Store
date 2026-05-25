import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/Cart";
import { getRecentlyViewed } from "./Recentlyview";
import { CategoryContext } from "../CategoryContext";
import { CardSkeletonLoader } from "./SkeletonLoader";

const BrowsingHistory = () => {
  const viewedIdsString = getRecentlyViewed().join(",");
  const { allProduct } = useContext(CategoryContext);
  const [recentViewedProducts, setRecentViewedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(() => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 4;
    return 5;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(5);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (viewedIdsString && allProduct?.length > 0) {
      const ids = viewedIdsString.split(",");
      const getProducts = allProduct?.filter((product) =>
        ids.includes(product._id),
      );
      setRecentViewedProducts(getProducts);
    } else {
      setRecentViewedProducts([]);
    }
  }, [viewedIdsString, allProduct]);

  useEffect(() => {
    const maxIndex = Math.max(0, recentViewedProducts.length - itemsPerView);
    setCurrentIndex((prevIndex) => Math.min(prevIndex, maxIndex));
  }, [itemsPerView, recentViewedProducts.length]);

  const handlePrev = () => {
    const maxIndex = Math.max(0, recentViewedProducts.length - itemsPerView);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : Math.max(0, prev - 1)));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, recentViewedProducts.length - itemsPerView);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const visibleProducts = recentViewedProducts.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  const gridColumnsClass =
    itemsPerView === 2
      ? "grid-cols-2"
      : itemsPerView === 4
        ? "grid-cols-4"
        : "grid-cols-5";

  const handleCardClick = (product) => {
    navigate(`/store/${encodeURIComponent(product.name)}`, {
      state: { id: product._id, product: product },
    });
  };

  const handleCartToggle = (e, product) => {
    e.stopPropagation();
    const isAddedToCart = cartItem.some((item) => item._id === product._id);
    if (isAddedToCart) {
      dispatch(removeFromCart(product));
    } else {
      dispatch(addToCart(product));
    }
  };

  return (
    <div className="">
      <h2 className="font-inter font-bold text-lg">
        Explore your recently viewed products
      </h2>
      <div className="relative w-full">
        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all"
          style={{ marginLeft: "-25px" }}
        >
          <span className="material-symbols-outlined text-xl">
            chevron_left
          </span>
        </button>

        {/* Carousel Container */}
        <div className="w-full overflow-hidden">
          <div className={`w-full grid ${gridColumnsClass} gap-md px-4`}>
            {recentViewedProducts.length > 0
              ? visibleProducts.map((product) => (
                  <div
                    key={product?._id}
                    className="bg-white rounded p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => handleCardClick(product)}
                  >
                    <div className="relative mb-3 overflow-hidden rounded">
                      <img
                        className="w-full h-32 object-contain group-hover:scale-110 transition-transform"
                        alt={product?.name}
                        src={product?.image?.[0] || ""}
                      />
                      {product?.discountPercentage > 0 && (
                        <span className="absolute top-1 right-1 bg-tertiary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{product?.discountPercentage}%
                        </span>
                      )}
                      <span className="absolute bottom-1 right-1 material-symbols-outlined text-sm text-primary-light">
                        favorite
                      </span>
                    </div>
                    <h3 className="text-xs font-medium line-clamp-2 h-8 mb-2">
                      {product?.name}
                    </h3>
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        {product?.discountprice && (
                          <p className="font-bold text-sm text-on-background">
                            ₦{product?.discountprice?.toLocaleString()}
                          </p>
                        )}
                        <p
                          className={`text-[10px] ${product?.discountprice ? "text-secondary line-through" : "font-bold text-sm text-on-background"}`}
                        >
                          ₦{product?.price?.toLocaleString()}
                        </p>
                      </div>
                      <span
                        onClick={(e) => handleCartToggle(e, product)}
                        className="text-blue-500 px-3 material-symbols-outlined cursor-pointer"
                      >
                        {cartItem.some((item) => item._id === product._id)
                          ? "remove_shopping_cart"
                          : "add_shopping_cart"}
                      </span>
                    </div>
                  </div>
                ))
              : Array.from({ length: itemsPerView }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-62.5 cursor-pointer flex flex-col gap-2 border border-[#E4E7E9]"
                    style={{ padding: "10px" }}
                  >
                    <CardSkeletonLoader />
                  </div>
                ))}
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all"
          style={{ marginRight: "-25px" }}
        >
          <span className="material-symbols-outlined text-xl">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default BrowsingHistory;
