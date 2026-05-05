import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/Cart";

export default function LandingPagePC({ product, onClick }) {

    const cartItem = useSelector((state) => state.cart.cartItem);
    const dispatch = useDispatch()
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
    <div
      onClick={onClick}
      className="group shadow-primary/15 shadow-lg cursor-pointer flex flex-col items-center relative"
    >
      <img
        className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform"
        src={product.image[0]}
        alt={product.name}
      />
      {product.discountPercentage && (
        <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
          -{product.discountPercentage}%
        </span>
      )}
      <div className="p-4">
        <p className="text-xs text-left line-clamp-2 mb-1 group-hover:text-primary-light">
            {product.name}
        </p>
        <div className="w-full flex justify-between items-center">
            <div>
                <p className="text-sm font-bold">
                    ₦
                    {product.discountPrice
                    ? product.discountPrice.toLocaleString()
                    : product.price.toLocaleString()}
                </p>
                {product.discountPrice && (
                    <p className="text-[10px] text-gray-400 line-through">
                    ₦{product.price.toLocaleString()}
                    </p>
                )}
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
    </div>
  );
}
