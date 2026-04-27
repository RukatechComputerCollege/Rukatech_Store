import React, { useState } from 'react'
import { CiCircleInfo } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const OrderTrack = () => {
  const [orderId, setOrderId] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const navigate = useNavigate()
  const handleOrderIdChange = () => {
    if(orderId && billingEmail) {
      navigate(`/order-tracking/${orderId}`);
    }else{
      console.log('make sure both fields are provided');
      toast.warning('Make sure both fields are provided');
    }
  }
  document.title = 'Track Order | Fastcart Online Store'
  return (
    <div className='w-full flex flex-col gap-4' style={{padding: '5% 6%'}}>
      <h1 className='text-[32px] font-semibold text-[#191C1F]'>Track Order</h1>
      <p className='text-[#5F6C72]'>To track your order please enter your order ID in the input field below and press the “Track Order” <br className='hidden md:block'/>button. this was given to you on your receipt and in the confirmation email you should have received.</p>
      <div className='w-full md:w-3/4 grid md:grid-cols-2 gap-4'>
        {/* for order id */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="orderId">Order Id</label>
          <input type="text" onChange={(e) => setOrderId(e.target.value)} placeholder='ID...' className='border border-[#E4E7E9] rounded-[2px]' style={{padding: '8px'}}/>
        </div>
        {/* for billing email */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="billingEmail">Billing Email</label>
          <input type="email" id="billingEmail" onChange={(e) => setBillingEmail(e.target.value)} placeholder='Email address' className='border border-[#E4E7E9] rounded-[2px]' style={{padding: '8px'}}/>
        </div>
      </div>
      <div className='w-full flex items-center gap-4 text-[14px] text-[#5F6C72]'>
        <CiCircleInfo />
        <p>Order ID that we send to you in your email address.</p>
      </div>
      <button onClick={handleOrderIdChange} style={{padding: '12px'}} className='bg-[#FA8232] cursor-pointer text-white rounded-[3px] w-fit flex items-center gap-2'><span>TRACK ORDER</span><IoIosArrowRoundForward size={24}/></button>

      <ToastContainer />
    </div>
  )
}

export default OrderTrack