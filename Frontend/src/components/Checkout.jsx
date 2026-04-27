import React, { useContext, useEffect, useState } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useDispatch, useSelector } from 'react-redux'
import { CgArrowRight } from "react-icons/cg";
import { UserAccountContext } from '../Pages/user/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import { IoWarningOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaCreditCard, FaHashtag } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify'

const Checkout = () => {
  const cartItem = useSelector(state => state.cart.cartItem)
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)
  const subtotal = cartItem.reduce((acc, item) => {
    const price = typeof item.discountprice === 'number' ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + (price * qty);
  }, 0);
  const { userData } = useContext(UserAccountContext)

  useEffect(() => {
    console.log(userData);
    
  }, [userData])
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('')
  const public_key = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
  const config = {
    public_key: public_key,
    tx_ref: Date.now(),
    amount: subtotal,
    currency: 'NGN',
    payment_options: paymentMethod,

    customer: {
      email: 'holuwaconquer@gmail.com',
      phone_number: +2349025140981,
      name: "Fastcart",
    },

    customizations: {
      title: 'Fastcart',
      description: 'Payment for your product',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };
  document.title = 'Checkout | Fastcart Online Store'

  const handleFlutterPayment = useFlutterwave(config);
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const deliveryDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div style={{ padding: "30px 6%" }} className='w-full flex flex-col'>
      {userData ? 
        <div className='w-full grid md:grid-cols-[2fr_1fr] gap-7 items-start'>
          {/* for shipping information and and payment option */}
          <div className='w-full flex flex-col gap-4'>
            {/* for shipping address */}
            <div className='flex flex-col gap-4'>
              <div style={{padding: '10px 0'}}>
                <h1 className='w-full font-bold border-[#E4E7E9] text-[18px] text-[#191C1F]'>SHIPPING ADDRESS</h1>
                <p className={`${
                  [
                    userData?.shippingfirstname,
                    userData?.shippinglastname,
                    userData?.shippingemail,
                    userData?.shippingaddress,
                    userData?.shippingphonenumber,
                    userData?.shippingcountry,
                    userData?.shippingstate,
                    userData?.shippingcity
                  ].some(field => !field || field.trim() === '') 
                    ? 'block' 
                    : 'hidden'
                } text-[#EBC80C] flex flex-col md:flex-row md:items-center`}><span><IoWarningOutline /></span>Your shipping address details is empty or not fully filled,<span className='underline cursor-pointer hover:no-underline transition-all' onClick={() =>navigate('/dashboard/setting')}>edit your shipping address here</span> </p>
              </div>
              {userData ?
                <div className='w-full flex flex-col gap-5'>
                    <div className='w-full'>
                      {/* for personal information details */}
                      <div className='w-full flex flex-col gap-5'>
                        <div className='w-full grid md:grid-cols-1 grid-rows-auto gap-3'>
                          {/* for firstname and lastname in shipping details */}
                          <div className='w-full grid md:grid-cols-2 gap-4'>
                            {/* for first name */}
                            <div className='w-full flex flex-col gap-1'>
                              <small className='text-[14px] text-[#191C1F] font-bold'>Firstname</small>
                              <input readOnly name='shippingfirstname' value={userData?.shippingfirstname} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                            </div>
                            {/* for last name */}
                            <div className='w-full flex flex-col gap-1'>
                              <small className='text-[14px] text-[#191C1F] font-bold'>Lastname</small>
                              <input readOnly name='shippinglastname' value={userData?.shippinglastname} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                            </div>
                          </div>
                          {/* for shipping */}
                          <div className='w-full flex flex-col gap-1'>
                            <small className='text-[14px] text-[#191C1F] font-bold'>Company Name</small>
                            <input readOnly name='shippingcompanyname'  value={userData?.shippingcompanyname} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                          </div>
                          {/* for shipping */}
                          <div className='w-full flex flex-col gap-1'>
                            <small className='text-[14px] text-[#191C1F] font-bold'>Address</small>
                            <input readOnly name='shippingaddress' value={userData?.shippingaddress} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                          </div>
                          {/* for city and zipcode */}
                          <div className='w-full grid md:grid-cols-4 gap-4'>
                          {/* for country */}
                          <div className='w-full flex flex-col gap-1'>
                            <small className='text-[14px] text-[#191C1F] font-bold'>Country</small>
                            <input readOnly type="text" value={userData?.shippingcountry} className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                          </div>
                          {/* for state */}
                          <div className='w-full flex flex-col gap-1'>
                            <small className='text-[14px] text-[#191C1F] font-bold'>State</small>
                            <input readOnly type="text" value={userData?.shippingstate} className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                          </div>
                              {/* for shipping */}
                              <div className='w-full flex flex-col gap-1'>    
                                <div className='w-full flex flex-col gap-1'>
                                  <small className='text-[14px] text-[#191C1F] font-bold'>City</small>
                                  <input readOnly name='shipping' value={userData?.shippingcity} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                                </div>
                              </div>
                              {/* for shipping */}
                              <div className='w-full flex flex-col gap-1'>    
                                <div className='w-full flex flex-col gap-1'>
                                  <small className='text-[14px] text-[#191C1F] font-bold'>Zip Code</small>
                                  <input readOnly name='shipping' value={userData?.shippingzipcode} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                                </div>
                              </div>
                          </div>
                          <div className='w-full grid md:grid-cols-2 gap-4'>
                            {/* for email */}
                            <div className='w-full flex flex-col gap-1'>
                              <small className='text-[14px] text-[#191C1F] font-bold'>Email</small>
                              <input readOnly name='shipping' value={userData?.shippingemail} type="email" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                            </div>
                            {/* for phone number */}
                            <div className='w-full flex flex-col gap-1'>
                              <small className='text-[14px] text-[#191C1F] font-bold'>Phone number</small>
                              <input readOnly name='shipping' value={userData?.shippingphonenumber} type="text" className='border-1 border-[#E4E7E9] text-[#475156] text-[14px] rounded-[2px] focus:outline-0' style={{padding: '8px'}}/>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                        {/* end of personal information details */}
                    </div>
                </div>
                : 
                <p>Loading</p>
              }
            </div>
            {/* for delivery details */}
            <div className='w-full border-1 border-[#E4E7E9] rounded-[4px]'>
              <h1 style={{padding: '10px 15px 10px'}} className='w-full font-bold border-b border-[#E4E7E9] text-[14px] text-[#191C1F]'>DELIVERY DETAILS</h1>
              <div style={{padding: '10px 15px 10px'}} className='w-full flex flex-col gap-2'>
                <h1>Delivery Date</h1>
                <p>Your Order will be delivered to your shipping address at most 5 days from order date, which will be 
                  <strong> { deliveryDate}</strong>
                </p>
              </div>
            </div>
            {/* for payment method*/}
            <div className='w-full border-1 border-[#E4E7E9] rounded-[4px]'>
              <h1 style={{padding: '10px 15px 10px'}} className='w-full font-bold border-b border-[#E4E7E9] text-[14px] text-[#191C1F]'>PAYMENT METHOD</h1>
              <div style={{padding: '10px 15px 10px'}} className='w-full grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-2'>
                {/* for pay on delivery */}
                <div className='w-full flex flex-col gap-2 items-center border-r border-[#E4E7E9]'>
                  <label className='flex cursor-pointer flex-col items-center justify-center' htmlFor='cash on delivery'>
                    <TbCurrencyNaira size={52} className='text-[#fa82326f]'/>
                    <span className='text-[14px] text-[#191c1f7b] font-semibold'>Pay on Delivery</span>
                  </label>
                  <input type="radio" className='cursor-pointer' id='cash on delivery' onChange={() => alert('pay on delivery is not available yet')} disabled name='paymentmethod'/>
                </div>
                {/* for Bank transfer */}
                <div className='w-full flex flex-col gap-2 items-center border-r border-[#E4E7E9]'>
                  <label className='cursor-pointer flex flex-col items-center justify-center' htmlFor='Bank Transfer'>
                    <FaMoneyBills size={52} className='text-[#FA8232]'/>
                    <span className='text-[14px] text-[#191C1F] font-semibold'>Bank Transfer</span>
                  </label>
                  <input type="radio" id='Bank Transfer' className='cursor-pointer' onChange={()=>setPaymentMethod('mobilemoney')} checked={paymentMethod === 'mobilemoney'} name='paymentmethod'/>
                </div>
                {/* for credit or debit card */}
                <div className='w-full flex flex-col gap-2 items-center border-r border-[#E4E7E9]'>
                  <label className='flex cursor-pointer flex-col items-center justify-center' htmlFor='Debit/Credit Card'>
                    <FaCreditCard size={52} className='text-[#FA8232]'/>
                    <span className='text-[14px] text-[#191C1F] font-semibold'>Debit/Credit Card</span>
                  </label>
                  <input type="radio" id='Debit/Credit Card' className='cursor-pointer' onChange={()=>setPaymentMethod('card')} checked={paymentMethod === 'card'} name='paymentmethod'/>
                </div>
                {/* for USSD */}
                <div className='w-full flex flex-col gap-2 items-center border-r border-[#E4E7E9]'>
                  <label className='flex flex-col cursor-pointer items-center justify-center' htmlFor='USSD'>
                    <FaHashtag size={52} className='text-[#FA8232]'/>
                    <span className='text-[14px] text-[#191C1F] font-semibold'>USSD</span>
                  </label>
                  <input type="radio" id='USSD' className='cursor-pointer' onChange={()=>setPaymentMethod('USSD')} checked={paymentMethod === 'USSD'} name='paymentmethod'/>
                </div>
              </div>
            </div>
          </div>
          {/* for order summary */}
          <div className='w-full flex flex-col gap-4'>
            {/* for chekout */}
            <div style={{padding: '20px'}} className='w-full bg-white border border-[#E4E7E9] rounded-[4px] flex flex-col gap-4'>
              <p className='text-[#191C1F] text-[18px] font-bold'>Order Summary</p>
              {/* for cart product */}
              <div style={{padding: '20px'}} className='w-full flex flex-col gap-4'>
                {cartItem.map((cartProduct) => (
                  <div key={cartProduct._id} className='w-full grid grid-cols-[1fr_3fr] grid-rows-auto gap-2 items-center'>
                    <div className='w-[64px] h-[64px] border border-[#E4E7E9]'>
                      <img className='w-full h-full object-contain' src={cartProduct?.image[0]} alt="" />
                    </div>
                    <div className='w-full'>
                      <p className='font-bold text-[#191C1F] text-[14px]'>{cartProduct?.name.split(' ').splice(0, 5).join(' ')}...</p>
                      <div className='w-full flex items-center gap-2 text-[#5F6C72]'>
                        <p>{cartProduct.quantity || 1}</p>
                        <p>x</p>
                        <p className='text-[#2DA5F3] text-[14px] font-bold'>
                          ₦{(typeof cartProduct?.discountprice === 'number' ? cartProduct.discountprice : cartProduct?.price)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='w-full flex flex-col gap-2 border-b border-[#E4E7E9]' style={{paddingBottom: '20px'}}>
                <p className='w-full flex items-center justify-between'><span className='text-[#5F6C72] text-[14px]'>Sub-total</span><span className='text-[#191C1F] text-[14px] font-bold'>₦{subtotal.toLocaleString()}</span></p>
                <p className='w-full flex items-center justify-between'><span className='text-[#5F6C72] text-[14px]'>Shipping</span><span className='text-[#191C1F] text-[14px] font-bold'>Free</span></p>
                <p className='w-full flex items-center justify-between'><span className='text-[#5F6C72] text-[14px]'>Discount</span><span className='text-[#191C1F] text-[14px] font-bold'>-</span></p>
              </div>
              <p className='w-full flex items-center justify-between'><span className='text-[#5F6C72] text-[16px]'>Total</span><span className='text-[#191C1F] text-[16px] font-bold'>₦{subtotal.toLocaleString()}</span></p>
              <button
                disabled={paymentMethod === ''}
                onClick={() => {
                  setIsProcessing(true)
                  handleFlutterPayment({
                    callback: (response) => {
                      if(response){
                        axios.post(`${API_URL}/user/orderDetails/${userData._id}`, {
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
                          subtotal
                        })
                        .then((res) =>{
                          console.log('order Completed', res);
                          if(res.status){
                            navigate(`/shopping-cart/checkout/payment-successful/${res.data.orderId}`)
                            setIsProcessing(false)
                          }
                        }).catch((err) =>{
                          console.log(err);
                          setIsProcessing(false)
                          toast.error('there is an error with the payment gateway', err)
                        }).finally(() =>{setIsProcessing(false)})
                      }
                        closePaymentModal()
                    },
                    onClose: () => {
                      setIsProcessing(false)
                      console.log('payment was not made');
                      
                    },
                  });
                }}
              style={{padding: '15px 0'}} className={`rounded-[2px] transition-all ${paymentMethod=='' ? 'bg-[#f7be98] cursor-not-allowed' : "bg-[#FA8232]  cursor-pointer hover:bg-[#f76f14] active:bg-[#fd9752]"} font-bold  text-white w-full flex items-center justify-center gap-4`}><span>{isProcessing ? 'Processing...' : "PLACE ORDER"}</span><CgArrowRight className={`${isProcessing ? 'hidden' : 'flex'} text-white`} size={24} /></button>
            </div>
          </div>
        </div>
      :
      <Loader />
      }
      <ToastContainer/>
    </div>
  )
}

export default Checkout