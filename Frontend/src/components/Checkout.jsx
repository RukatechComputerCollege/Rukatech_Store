import React, { useContext, useEffect, useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useDispatch, useSelector } from "react-redux";
import { CgArrowRight } from "react-icons/cg";
import { UserAccountContext } from "../Pages/user/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { IoWarningOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaCreditCard, FaHashtag } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

const Checkout = () => {
  const cartItem = useSelector((state) => state.cart.cartItem);
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const subtotal = cartItem.reduce((acc, item) => {
    const price =
      typeof item.discountprice === "number" ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);
  const { userData } = useContext(UserAccountContext);

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const public_key = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
  const config = {
    public_key: public_key,
    tx_ref: Date.now(),
    amount: subtotal,
    currency: "NGN",
    payment_options: paymentMethod,

    customer: {
      email: "holuwaconquer@gmail.com",
      phone_number: +2349025140981,
      name: "Fastcart",
    },

    customizations: {
      title: "Fastcart",
      description: "Payment for your product",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
  document.title = "Checkout | RukatechStore";

  const handleFlutterPayment = useFlutterwave(config);
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const deliveryDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ padding: "30px 6%" }} className="w-full flex flex-col">
      <main className="">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* <!-- Left Column: Checkout Details --> */}
          <div className="lg:col-span-8 space-y-4">
            {/* <!-- 1. CUSTOMER ADDRESS --> */}
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-container flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined fill text-primary-light">
                    check_circle
                  </span>
                  <h2 className="font-bold text-on-surface uppercase tracking-tight text-sm">
                    1. Customer Address
                  </h2>
                </div>
                <Link
                  to="/dashboard/setting"
                  className="text-primary-light font-[14px] uppercase text-xs hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors"
                >
                  Change
                </Link>
              </div>
              <div className="p-6">
                {userData ? (
                  <>
                    {[
                      userData?.shippingfirstname,
                      userData?.shippinglastname,
                      userData?.shippingemail,
                      userData?.shippingaddress,
                      userData?.shippingphonenumber,
                      userData?.shippingcountry,
                      userData?.shippingstate,
                      userData?.shippingcity,
                    ].some((field) => !field || field.trim() === "") ? (
                      <div className="text-primary-light flex flex-col md:flex-row md:items-center gap-2">
                        <IoWarningOutline size={20} />
                        <span>
                          Your shipping address details are empty or not fully
                          filled. Complete your 
                          <Link
                            className="underline cursor-pointer hover:no-underline hover:text-primary transition-all ml-1"
                            to="/dashboard/setting"
                          >
                            shipping details here
                          </Link>{" "}
                          to proceed with checkout.
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="font-[14px] text-on-surface">
                          {userData?.shippingfirstname}{" "}
                          {userData?.shippinglastname}
                        </p>
                        <p className="text-secondary mt-1">
                          {userData?.shippingaddress}, {userData?.shippingcity},{" "}
                          {userData?.shippingstate}, {userData?.shippingcountry}{" "}
                          | {userData?.shippingphonenumber}
                        </p>
                        <p className="text-secondary mt-1">
                          {userData?.shippingemail}
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-secondary">Loading user data...</p>
                )}
              </div>
            </section>
            {/* <!-- 2. DELIVERY DETAILS --> */}
            <section className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-container flex items-center gap-3 bg-white">
                <span className="material-symbols-outlined fill text-primary-light">
                  check_circle
                </span>
                <h2 className="font-bold text-on-surface uppercase tracking-tight text-sm">
                  2. Delivery Details
                </h2>
              </div>
              <div className="p-6 space-y-8">
                {/* <!-- Pick-up Station Info --> */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 border border-surface-container rounded-lg bg-surface">
                  <div>
                    <h3 className="font-bold text-on-surface flex items-center gap-2">
                      Standard Delivery
                      <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        FREE
                      </span>
                    </h3>
                    <div className="mt-2 text-secondary text-sm space-y-1">
                      <p>
                        Your order will be available at your shipping address
                      </p>
                      <p>Estimated delivery: {deliveryDate}</p>
                      <p className="font-medium text-on-surface">
                        Delivery within 3-5 business days
                      </p>
                    </div>
                  </div>
                </div>
                {/* <!-- Cart Items --> */}
                <div className="border-t border-surface-container pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-on-surface uppercase">
                      Order Items ({cartItem.length})
                    </h4>
                  </div>
                  {cartItem.map((product, index) => (
                    <div
                      key={product._id || index}
                      className="flex gap-4 mb-4 pb-4 border-b border-surface-container last:border-b-0 last:pb-0 last:mb-0"
                    >
                      <div className="w-20 h-20 bg-surface rounded shrink-0 overflow-hidden">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover"
                          src={product.image?.[0] || ""}
                        />
                      </div>
                      <div className="grow">
                        <p className="text-sm text-on-surface line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-primary mt-1">
                          ₦
                          {(
                            product.discountprice || product.price
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-secondary mt-2">
                          Quantity: {product.quantity || 1}
                        </p>
                        <span className="text-tertiary font-medium text-xs">
                          Fulfilled by Rukatech Store (Ijebu)
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <div
                      className="text-primary  flex group items-center justify-center gap-1 uppercase text-xs"
                      href="#"
                    >
                      <span className="material-symbols-outlined text-sm">
                        keyboard_arrow_left
                      </span>
                      <Link
                        to="/shopping-cart"
                        className="group-hover:underline"
                      >
                        Modify Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- 3. PAYMENT METHOD --> */}
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-container flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined fill text-primary-light">
                    check_circle
                  </span>
                  <h2 className="font-[34px] text-on-surface uppercase tracking-tight text-sm">
                    3. Payment Method
                  </h2>
                </div>
                <button className="text-primary font-[14px] uppercase text-xs hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors">
                  Change
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Pay on Delivery */}
                  <div className="flex flex-col items-center gap-2 p-4 border border-surface-container rounded-lg">
                    <label className="flex flex-col items-center justify-center cursor-pointer text-center">
                      <TbCurrencyNaira
                        size={32}
                        className="text-[#fa82326f] mb-2"
                      />
                      <span className="text-sm text-[#191c1f7b] font-semibold">
                        Pay on Delivery
                      </span>
                    </label>
                    <input
                      type="radio"
                      className="cursor-pointer"
                      id="cash-on-delivery"
                      onChange={() =>
                        alert("Pay on delivery is not available yet")
                      }
                      disabled
                      name="paymentmethod"
                    />
                  </div>
                  {/* Bank Transfer */}
                  <div className="flex flex-col items-center gap-2 p-4 border border-surface-container rounded-lg">
                    <label className="flex flex-col items-center justify-center cursor-pointer text-center">
                      <FaMoneyBills size={32} className="text-[#FA8232] mb-2" />
                      <span className="text-sm text-[#191C1F] font-semibold">
                        Bank Transfer
                      </span>
                    </label>
                    <input
                      type="radio"
                      id="bank-transfer"
                      className="cursor-pointer"
                      onChange={() => setPaymentMethod("mobilemoney")}
                      checked={paymentMethod === "mobilemoney"}
                      name="paymentmethod"
                    />
                  </div>
                  {/* Debit/Credit Card */}
                  <div className="flex flex-col items-center gap-2 p-4 border border-surface-container rounded-lg">
                    <label className="flex flex-col items-center justify-center cursor-pointer text-center">
                      <FaCreditCard size={32} className="text-[#FA8232] mb-2" />
                      <span className="text-sm text-[#191C1F] font-semibold">
                        Debit/Credit Card
                      </span>
                    </label>
                    <input
                      type="radio"
                      id="debit-credit-card"
                      className="cursor-pointer"
                      onChange={() => setPaymentMethod("card")}
                      checked={paymentMethod === "card"}
                      name="paymentmethod"
                    />
                  </div>
                  {/* USSD */}
                  <div className="flex flex-col items-center gap-2 p-4 border border-surface-container rounded-lg">
                    <label className="flex flex-col items-center justify-center cursor-pointer text-center">
                      <FaHashtag size={32} className="text-[#FA8232] mb-2" />
                      <span className="text-sm text-[#191C1F] font-semibold">
                        USSD
                      </span>
                    </label>
                    <input
                      type="radio"
                      id="ussd"
                      className="cursor-pointer"
                      onChange={() => setPaymentMethod("USSD")}
                      checked={paymentMethod === "USSD"}
                      name="paymentmethod"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* <!-- Right Column: Sidebar --> */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* <!-- Order Summary --> */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-container bg-white">
                  <h2 className="font-bold text-on-surface uppercase tracking-tight text-sm">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="pt-4 border-t border-surface-container space-y-2">
                    <div className="flex justify-between text-on-surface">
                      <span className="text-secondary">
                        Item's total ({cartItem.length})
                      </span>
                      <span className="font-[14px]">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface">
                      <span className="text-secondary">Shipping</span>
                      <span className="font-[14px]">Free</span>
                    </div>
                    <div className="pt-4 border-t border-surface-container flex justify-between items-center">
                      <span className="font-bold text-sm">Total</span>
                      <span className="font-headline-lg text-on-surface text-xl">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={
                      paymentMethod === "" ||
                      !userData ||
                      [
                        userData?.shippingfirstname,
                        userData?.shippinglastname,
                        userData?.shippingemail,
                        userData?.shippingaddress,
                        userData?.shippingphonenumber,
                        userData?.shippingcountry,
                        userData?.shippingstate,
                        userData?.shippingcity,
                      ].some((field) => !field || field.trim() === "")
                    }
                    onClick={() => {
                      setIsProcessing(true);
                      handleFlutterPayment({
                        callback: (response) => {
                          if (response) {
                            axios
                              .post(
                                `${API_URL}/user/orderDetails/${userData._id}`,
                                {
                                  flutterwaveResponse: response,
                                  cartItems: cartItem,
                                  shipping: {
                                    firstname: userData?.shippingfirstname,
                                    lastname: userData?.shippinglastname,
                                    address: userData?.shippingaddress,
                                    country: userData?.shippingcountry,
                                    state: userData?.shippingstate,
                                    city: userData?.shippingcity,
                                    zipcode: userData?.shippingzipcode,
                                    email: userData?.shippingemail,
                                    phone: userData?.shippingphonenumber,
                                  },
                                  subtotal,
                                },
                              )
                              .then((res) => {
                                console.log("order Completed", res);
                                if (res.status) {
                                  navigate(
                                    `/shopping-cart/checkout/payment-successful/${res.data.orderId}`,
                                  );
                                  setIsProcessing(false);
                                }
                              })
                              .catch((err) => {
                                console.log(err);
                                setIsProcessing(false);
                                toast.error(
                                  "There is an error with the payment gateway",
                                  err,
                                );
                              })
                              .finally(() => {
                                setIsProcessing(false);
                              });
                          }
                          closePaymentModal();
                        },
                        onClose: () => {
                          setIsProcessing(false);
                          console.log("payment was not made");
                        },
                      });
                    }}
                    className={`w-full py-4 rounded shadow-md uppercase text-sm font-bold transition-all ${
                      paymentMethod === "" ||
                      !userData ||
                      [
                        userData?.shippingfirstname,
                        userData?.shippinglastname,
                        userData?.shippingemail,
                        userData?.shippingaddress,
                        userData?.shippingphonenumber,
                        userData?.shippingcountry,
                        userData?.shippingstate,
                        userData?.shippingcity,
                      ].some((field) => !field || field.trim() === "")
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary-light text-white hover:bg-opacity-90"
                    }`}
                  >
                    {isProcessing ? "Processing..." : "Confirm Order"}
                  </button>

                  <p className="text-[10px] text-secondary text-center leading-relaxed">
                    By clicking 'Confirm Order', you agree to Marketplace's
                    <Link className="text-primary hover:underline" href="#">
                      Terms and Conditions
                    </Link>
                    and
                    <Link className="text-primary hover:underline" href="#">
                      Privacy Policy
                    </Link>
                    . <br />
                    <br />
                    Stay updated with order status via WhatsApp. You can opt-out
                    anytime.
                  </p>
                </div>
              </div>
              {/* <!-- Safety/Assurance --> */}
              <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3 border border-surface-container">
                <span className="material-symbols-outlined fill text-primary">
                  verified_user
                </span>
                <div>
                  <p className="font-[14px] text-xs uppercase text-on-surface">
                    Buyer Protection
                  </p>
                  <p className="text-[10px] text-secondary">
                    Get a full refund if the item is not as described.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
