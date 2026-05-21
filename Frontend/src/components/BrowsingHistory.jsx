import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/Cart";
import { getRecentlyViewed } from "./Recentlyview";
import { CategoryContext } from "../CategoryContext";
import {CardSkeletonLoader} from "./SkeletonLoader";

const BrowsingHistory = () => {
  const viewedIds = getRecentlyViewed();
  const { allProduct } = useContext(CategoryContext);
  const [recentViewedProducts, setRecentViewedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);

  useEffect(() => {
    if (viewedIds.length > 0 && allProduct?.length > 0) {
      const getProducts = allProduct?.filter((product) =>
        viewedIds.includes(product._id),
      );
      // console.log(getProducts);
      setRecentViewedProducts(getProducts);
    }
  }, [viewedIds, allProduct]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? recentViewedProducts.length - itemsPerView : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= recentViewedProducts.length - itemsPerView ? 0 : prev + 1,
    );
  };

  const visibleProducts = recentViewedProducts.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  const handleCardClick = (product) => {
    navigate(`/store/${encodeURIComponent(product.name)}`, { state: { id: product._id, product: product } });
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
          <div className="w-full grid grid-cols-5 gap-md px-4">
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
