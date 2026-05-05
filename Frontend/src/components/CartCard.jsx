import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { removeFromCart, updateQuantity } from "../redux/Cart";
import { CgArrowRight } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";

const CartCard = () => {
  const cartItem = useSelector((state) => state.cart.cartItem);
  const dispatch = useDispatch();

  const subtotal = cartItem.reduce((acc, item) => {
    const price =
      typeof item.discountprice === "number" ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const navigate = useNavigate();
  return (
    <div className="">
      <div className="bg-surface-container-lowest rounded-xl shadow-[32px] border border-surface-variant overflow-hidden">
        <div className="flex p-[16px] border-b border-surface-variant justify-between">
          <h4 className="font-inter text-[14px] text-on-surface">
            Cart Preview ({cartItem.length > 0 && `${cartItem.length}`} items)
          </h4>
          <button
            onClick={() => navigate("/shopping-cart")}
            className="flex justify-center text-[10px] text-on-surface hover:text-primary-light"
          >
            Go to Cart{" "}
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>
        {cartItem.length > 0 ? (
          <div className="max-h-64 overflow-y-auto">
            {cartItem.map((cartProduct) => (
              <div
                key={cartProduct._id}
                className="p-[16px] flex gap-[12px] items-center hover:bg-surface-container-low transition-colors"
              >
                <img
                  alt={cartProduct?.name}
                  className="w-12 h-12 rounded object-fill border border-surface-variant"
                  src={cartProduct?.image[0]}
                />
                <div className="flex-grow min-w-0">
                  <p className="text-[14px] text-on-surface truncate">
                    {cartProduct?.name.split(" ").slice(0, 5).join(" ")}...
                  </p>
                  <p className="text-[12px] text-primary-container font-bold">
                    ₦
                    {(typeof cartProduct?.discountprice === "number"
                      ? cartProduct.discountprice
                      : cartProduct?.price
                    )?.toLocaleString()}{" "}
                    <div className="flex items-center gap-4 justify-center border border-primary rounded-[3px] w-25">
                      <FaMinus
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(
                            updateQuantity({
                              productId: cartProduct._id,
                              quantity: Math.max(
                                1,
                                (cartProduct.quantity || 1) - 1,
                              ),
                            }),
                          );
                        }}
                        size={16}
                      />
                      <input
                        type="text"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          dispatch(
                            updateQuantity({
                              productId: cartProduct._id,
                              quantity: isNaN(value) || value < 1 ? 1 : value,
                            }),
                          );
                        }}
                        className="border-0 focus:outline-0 w-2"
                        value={cartProduct.quantity || 1}
                      />
                      <FaPlus
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(
                            updateQuantity({
                              productId: cartProduct._id,
                              quantity: (cartProduct.quantity || 1) + 1,
                            }),
                          );
                        }}
                        size={16}
                      />
                    </div>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(cartProduct))}
                  className="material-symbols-outlined !text-[18px] cursor-pointer hover:text-red-600"
                >
                  remove_shopping_cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{ padding: "40px 20px" }}
            className="w-full text-black flex flex-col items-center justify-center text-center gap-4 border-b-1 border-[#E4E7E9]"
          >
            <div className="w-[80px] h-[80px] rounded-[50%] flex flex-col items-center justify-center bg-[#f9d7c0a9]">
              <FiShoppingCart className="text-[#FA8232]" size={45} />
            </div>
            <div>
              <h1>Your Cart is Empty!</h1>
              <p className="text-[14px]">
                Browse our categories and discover our best deals!
              </p>
            </div>
            <button
              onClick={() => navigate("/store")}
              className="w-full cursor-pointer hover:bg-[#fa8232cf] active:bg-[#fa8232d3] rounded-[4px] bg-[#FA8232] text-white"
              style={{ padding: "10px" }}
            >
              Start Shopping
            </button>
          </div>
        )}
        {cartItem.length > 0 && (
          <div className="p-[16px] bg-surface-container-low space-y-[8px]">
            <span className="font-bold">
              Total: <span>₦{subtotal.toLocaleString()}</span>
            </span>
            <button
              type="button"
              onClick={() => navigate("/shopping-cart/checkout")}
              className="w-full bg-primary-light text-white font-inter text-[14px] py-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-[8px]"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-sm">
                shopping_cart_checkout
              </span>
            </button>
            <button className="w-full bg-[#25D366] text-white font-inter text-[14px] py-2 rounded-lg hover:brightness-95 transition-all flex items-center justify-center gap-[8px]">
              <svg
                className="w-4 h-4 fill-current"
                viewbox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
              </svg>
              Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartCard;
