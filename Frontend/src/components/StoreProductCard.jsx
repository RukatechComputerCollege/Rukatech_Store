import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

const StoreProductCard = ({
  product,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const navigate = useNavigate();

  const handleCartToggle = (e) => {
    e.stopPropagation();
    if (isInCart) {
      onRemoveFromCart(product);
    } else {
      onAddToCart(product);
    }
  };

  const handleProductClick = () => {
    navigate(`/store/${encodeURIComponent(product.name)}`, {
      state: { id: product._id, product: product },
    });
  };

  const calculateDiscount = () => {
    if (!product.discountprice) return 0;
    return Math.round((1 - product.discountprice / product.price) * 100);
  };

  const calculateAverageRating = () => {
    if (!product.rating || product.rating.length === 0) return 0;
    return (
      product.rating.reduce((acc, r) => acc + r.ratingGrade, 0) /
      product.rating.length
    ).toFixed(1);
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 relative cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {product.discountprice && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded">
            -{calculateDiscount()}%
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        <img
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          src={product.image?.[0] || ""}
        />
        <div className="absolute bottom-2 right-2 z-10">
          <FaRegHeart
            size={16}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-inter text-on-background mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined fill text-orange-400 text-xs">
              star
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              {calculateAverageRating()} ({product.rating?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <span className="text-lg font-black text-on-background">
              ₦
              {product.discountprice
                ? product.discountprice.toLocaleString()
                : product.price.toLocaleString()}
            </span>
            {product.discountprice && (
              <span className="text-xs text-gray-400 line-through">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add/Remove from Cart Button */}
          <button
            onClick={handleCartToggle}
            className="mt-4 w-full bg-white border-2 border-primary-light text-primary-light font-bold py-2 rounded-sm text-[8px] md:text-xs hover:bg-primary-light hover:text-white transition-colors uppercase"
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreProductCard;
