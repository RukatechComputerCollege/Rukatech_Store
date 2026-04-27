import React, { useEffect } from 'react'
import Styles from './PaymetSuccess.module.css'
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { GoStack, GoArrowRight } from "react-icons/go";

const PaymentSuccess = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    document.title = `${orderId} Payment Successful | Fastcart Online Store`

  }, [orderId])
  

  return (
    <div style={{padding: '5% 1%'}} className='w-full flex flex-col items-center justify-center'>
      <div className='w-3/4 flex flex-col gap-10 items-center justify-center'>
        <div className={Styles.loader}>
          <div className={Styles.box}>
            <div className={Styles.logo}>
              <IoCheckmarkDoneOutline className='text-white' size={44} />
            </div>
          </div>
          <div className={Styles.box}></div>
          <div className={Styles.box}></div>
          <div className={Styles.box}></div>
          <div className={Styles.box}></div>
        </div>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-[24px] text-center font-bold text-[#191C1F]'>Your order is successfully placed</h1>
          <p className='md:w-3/4 text-center text-[#5F6C72] text-[14px]'>Your order <span className='font-bold'>{orderId}</span> has been placed successfully, visit your dashboard to track your order progress and also check your email for confirmation</p>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center w-full'>
            <button onClick={() => navigate('/dashboard/account')} className='flex cursor-pointer active:bg-[#FA8232] gap-2 items-center justify-center rounded-[3px] border-2 border-[#FA8232] text-[#FA8232]' style={{padding: '15px'}}><GoStack /><span>GO TO DASHBOARD</span></button>
            <button onClick={() => navigate('/dashboard/order-history')} className='flex cursor-pointer active:bg-[#f8a36a] gap-2 items-center justify-center rounded-[3px] border-2 bg-[#FA8232] text-white' style={{padding: '15px'}}><span>VIEW ORDER</span><GoArrowRight  /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess