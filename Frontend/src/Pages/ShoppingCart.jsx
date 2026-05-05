import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCrossCircled } from "react-icons/rx";
import { removeFromCart, updateQuantity } from "../redux/Cart";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { CgArrowRight } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const cartItem = useSelector((state) => state.cart.cartItem);
  const dispatch = useDispatch();
  const subtotal = cartItem.reduce((acc, item) => {
    const price =
      typeof item.discountprice === "number" ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);
  const navigate = useNavigate();
  document.title = "Shopping Cart | RukatechStore";

  return (
    <>
      <div
        className={`w-full ${cartItem.length === 0 && "justify-center items-center"} font-inter flex flex-col`}
        style={{ padding: "30px 6%" }}
      >
        {cartItem?.length > 0 ? (
          <div>
            <h1 className="font-extrabold text-3xl mb-[32px] text-on-surface">
              Your Shopping Cart {cartItem.length > 0 && `(${cartItem.length})`}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
              {/* <!-- Left Column: Cart Items --> */}
              <div className="lg:col-span-8 space-y-[16px]">
                {/* <!-- Cart Item 1 --> */}
                {cartItem.map((cartProduct) => (
                  <div
                    key={cartProduct._id}
                    className="bg-surface-container-lowest rounded-lg p-[16px] shadow-[12px] border border-surface-variant flex flex-col sm:flex-row gap-[16px] items-center"
                  >
                    <div className="w-32 h-32 flex-shrink-0 bg-surface-container rounded overflow-hidden">
                      <img
                        alt={cartProduct?.name}
                        className="w-full h-full object-fill"
                        src={cartProduct?.image[0]}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-headline-[24px] text-on-surface">
                            {cartProduct?.name}
                          </h3>
                          <p className="text-[14px] font-inter text-secondary mt-1">
                            {cartProduct?.description.slice(0, 100)}...
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(cartProduct))}
                          className="text-error hover:bg-error-container p-[8px] rounded-full transition-colors active:scale-90"
                        >
                          <div
                            className="flex items-center justify-center text-[12px]"
                            data-icon="delete"
                          >
                            <span className="material-symbols-outlined">
                              remove_shopping_cart
                            </span>
                            <span>—</span>
                          </div>
                        </button>
                      </div>
                      <div className="flex flex-wrap justify-between items-end mt-[16px]">
                        <div className="flex items-center border border-outline-variant rounded-full overflow-hidden">
                          <button
                            type="button"
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
                            className="px-3 py-2 hover:bg-surface-container-high transition-colors flex"
                          >
                            <span
                              className="material-symbols-outlined text-[12px]"
                              data-icon="remove"
                            >
                              remove
                            </span>
                          </button>
                          <input
                            type="text"
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              dispatch(
                                updateQuantity({
                                  productId: cartProduct._id,
                                  quantity:
                                    isNaN(value) || value < 1 ? 1 : value,
                                }),
                              );
                            }}
                            className="px-4 py-2 text-[14px] border-x border-outline-variant"
                            value={cartProduct.quantity || 1}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(
                                updateQuantity({
                                  productId: cartProduct._id,
                                  quantity: (cartProduct.quantity || 1) + 1,
                                }),
                              );
                            }}
                            className="px-3 py-2 hover:bg-surface-container-high transition-colors flex"
                          >
                            <span
                              className="material-symbols-outlined text-[12px]"
                              data-icon="add"
                            >
                              add
                            </span>
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] font-inter text-secondary line-through block">
                            ₦
                            {(typeof cartProduct?.discountprice === "number"
                              ? cartProduct.discountprice
                              : cartProduct?.price
                            )?.toLocaleString()}
                          </span>
                          <span className="text-[24px] font-inter text-primary-light">
                            ₦
                            {(typeof cartProduct?.discountprice === "number"
                              ? cartProduct.discountprice
                              : cartProduct?.price
                            )?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  to="/store"
                  type="button"
                  className="flex items-center gap-[8px] group text-primary-light font-inter text-[14px] py-md"
                >
                  <span
                    className="material-symbols-outlined"
                    data-icon="arrow_back"
                  >
                    arrow_insert
                  </span>
                  <span className="group-hover:underline">
                    Continue Shopping
                  </span>
                </Link>
              </div>
              {/* <!-- Right Column: Sidebar --> */}
              <aside className="lg:col-span-4 space-y-[24px] sticky top-[100px]">
                {/* <!-- Order Summary --> */}
                <section className="bg-surface-container-lowest rounded-lg p-[24px] shadow-sm border border-surface-variant">
                  <h2 className="font-inter text-[24px] mb-[16px] border-b border-surface-variant pb-[16px]">
                    Order Summary
                  </h2>
                  <div className="space-y-[12px]">
                    <div className="flex justify-between font-inter text-[14px]">
                      <span className="text-secondary">Subtotal</span>
                      <span className="font-semibold text-on-surface">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-inter text-[14px]">
                      <span className="text-secondary">Shipping Estimate</span>
                      <span className="text-tertiary font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between font-inter text-[14px]">
                      <span className="text-secondary">Discount</span>
                      <span className="font-semibold text-on-surface">
                        -30%
                      </span>
                    </div>
                    <div className="pt-[16px] border-t border-surface-variant flex justify-between">
                      <span className="font-inter text-[24px]">Total</span>
                      <span className="font-inter text-[24px] text-primary-light">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </section>
                {/* <!-- Coupon Section --> */}
                <section className="bg-surface-container-lowest rounded-lg p-[24px] shadow-[12px] border border-surface-variant">
                  <label
                    className="block font-inter text-[14px] mb-[8px] text-on-surface"
                    for="coupon"
                  >
                    Coupon Code
                  </label>
                  <div className="flex gap-[8px]">
                    <input
                      className="flex-grow rounded-lg border-blue-600 focus:border-primary-light focus:ring-1 focus:ring-primary-light bg-primary-light/40 text-[14px]"
                      id="coupon"
                      placeholder="Enter code"
                      type="text"
                      style={{ padding: "10px" }}
                    />
                    <button className="bg-surface-container-high text-on-surface font-inter text-[14px] px-[16px] py-2 rounded-lg hover:bg-surface-variant transition-colors active:scale-95">
                      Apply
                    </button>
                  </div>
                </section>
                {/* <!-- Checkout Actions --> */}
                <div className="space-y-[12px]">
                  <Link
                    type="button"
                    to="/shopping-cart/checkout"
                    className="w-full bg-primary-light text-white font-inter text-[24px] py-4 rounded-full shadow-[16px] hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-[12px]"
                  >
                    Proceed to Checkout
                    <span
                      className="material-symbols-outlined"
                      data-icon="shopping_cart_checkout"
                    >
                      shopping_cart_checkout
                    </span>
                  </Link>
                  <button className="w-full bg-[#25D366] text-white font-inter text-[24px] py-4 rounded-full shadow-[16px] hover:brightness-95 transition-all active:scale-[0.98] flex items-center justify-center gap-[16px]">
                    <svg
                      className="w-6 h-6 fill-current"
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                    </svg>
                    Order via WhatsApp
                  </button>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div
            style={{ padding: "5% 1%" }}
            className="w-full md:w-2/4 text-black flex flex-col items-center justify-center text-center gap-4 border-b-1 border-[#E4E7E9]"
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
            <Link
              to="/store"
              className="w-full cursor-pointer hover:bg-[#fa8232cf] active:bg-[#fa8232d3] rounded-[4px] bg-[#FA8232] text-white"
              style={{ padding: "10px" }}
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
