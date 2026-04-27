import React, { useEffect, useContext, useState } from 'react'
import { UserAccountContext } from './UserContext';
import { PiRocket, PiReceiptLight, PiPackageLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundForward } from "react-icons/io";

const HomeDashboard = () => {
  const { userData } = useContext(UserAccountContext)
  const [userOrder, setUserOrder] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    if(userData){
      setUserOrder(userData.productOrder)
    }
  }, [userData])
  

  return (
    <>
      {userData ? 
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full md:w-2/4 flex flex-col gap-4'>
            <h1 className='font-bold text-[20px] text-[#191C1F]'>Hello, {userData.firstname}</h1>
            <p className='text-[#475156] text-[14px]'>From your account dashboard. you can easily check & view your <span className='coloredTxt'>Recent Orders,</span>manage your <span className='coloredTxt'>Shipping and Billing Addresses</span> and edit your <span className='coloredTxt'>Password</span> and <span className='coloredTxt'>Account Details.</span> </p>
          </div>
          {/* for account info and billing details */}
          <div className='w-full grid md:grid-cols-3 gap-4'>
            {/* for account info */}
            <div style={{padding: '10px 0'}} className='w-full border-1 border-[#E4E7E9] rounded-[4px] flex flex-col gap-2'>
              <h1 style={{padding: '0 15px 10px'}} className='w-full border-b-1 font-bold border-[#E4E7E9] text-[14px] text-[#191C1F]'>ACCOUNT INFO</h1>
              <div style={{padding: '10px 15px'}} className='w-full flex flex-col gap-3'>
                {/* for name and profile picture */}
                <div className='w-full flex gap-3 items-center'>
                  <img src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png" className='w-[48px] h-[48px] rounded-[50%] object-cover' alt="profile-image" />
                  <div>
                    <h1 className='text-[16px] text-[#191C1F] font-bold'>{userData.firstname} {userData.lastname}</h1>
                    <p className='text-[#5F6C72] text-[14px]'>Address</p>
                  </div>
                </div>
                <div>
                  <p className='text-[#5F6C72] text-[14px] w-full flex gap-2'><span className='font-bold text-[#191C1F]'>Email:</span>{userData.email}</p>
                  <p>{userData.phonenNumber ? <p className='text-[#5F6C72] text-[14px] flex gap-2 break-all'><span className='font-bold text-[#191C1F]'>Email:</span>{userData.email}</p> : <p className='text-[#5F6C72] text-[14px] w-full'><span className='font-bold text-[#191C1F]'>Phone Number:</span>Nil</p>}</p>
                  <button onClick={() => navigate('/dashboard/setting')} className='border-2 border-[#D5EDFD] rounded-[2px] cursor-pointer text-[#2DA5F3] hover:bg-[#2DA5F3] hover:text-white active:bg-[#2da4f3ad] transition-all' style={{padding: '15px 18px', marginTop: '20px'}}>EDIT ACCOUNT</button>
                </div>
              </div>
            </div>
            {/* for billing address */}
            <div style={{padding: '10px 0'}} className='w-full border-1 border-[#E4E7E9] rounded-[4px] flex flex-col gap-2'>
              <h1 style={{padding: '0 15px 10px'}} className='w-full border-b-1 font-bold border-[#E4E7E9] text-[14px] text-[#191C1F]'>BILLING ADDRESS</h1>
              <div style={{padding: '10px 15px'}} className='w-full flex flex-col gap-3'>
                {/* for name and billing address */}
                {userData 
                  ? 
                  <div className='flex flex-col gap-2 w-full'>
                    <p className='text-[#5F6C72] text-[14px] w-full flex gap-2'><span className='font-bold text-[#191C1F]'>{userData.billingfirstname + ' ' + userData.billinglastname}</span></p>
                    <p className='text-[#333333]'>{userData?.billingaddress && userData.billingaddress + ' ' + userData?.billingcity + ' ' + userData?.billingstate + ' ' + userData?.billingzipcode + ' ' + userData?.billingcountry}</p>
                    <button className='border-2 border-[#D5EDFD] rounded-[2px] cursor-pointer text-[#2DA5F3] hover:bg-[#2DA5F3] hover:text-white active:bg-[#2da4f3ad] transition-all' style={{padding: '15px 0'}}>EDIT ACCOUNT</button>
                  </div>
                
                :
                <div>
                  <p>No billing address yet, click the button to add</p>
                  <button onClick={() => navigate('/dashboard/setting')} className='border-2 border-[#D5EDFD] rounded-[2px] cursor-pointer text-[#2DA5F3] hover:bg-[#2DA5F3] hover:text-white active:bg-[#2da4f3ad] transition-all' style={{padding: '15px 18px'}}>EDIT ADDRESS</button>
                </div>
                }
              </div>
            </div>

            {/* for order count */}
            <div className='w-full flex flex-col gap-4'>
              {/* for total order */}
              <div className='w-full flex gap-4 items-center bg-[#EAF6FE] rounded-[4px]' style={{padding: '16px'}}>
                <div className='w-[56] h-[56] bg-white rounded-[2px] flex flex-col items-center justify-center' style={{padding: '10px'}}><PiRocket className='text-[#2DA5F3]' size={32}/></div>
                <p><span className='text-[20px] text-[#191C1F] font-semibold'>{userData?.productOrder?.length}</span>  <br /> Total Orders</p>
              </div>
              {/* for pending order */}
              <div className='w-full flex gap-4 items-center bg-[#FFF3EB] rounded-[4px]' style={{padding: '16px'}}>
                <div className='w-[56] h-[56] bg-white rounded-[2px] flex flex-col items-center justify-center' style={{padding: '10px'}}><PiReceiptLight className='text-[#FA8232]' size={32}/></div>
                <p>
                  <span className='text-[20px] text-[#191C1F] font-semibold'>
                    {userData?.productOrder?.filter((order) => order.orderStatus==='received' || order.orderStatus==='packaging' || order.orderStatus==='on_the_road').length || 0}
                  </span>
                  <br /> Pending Orders
                </p>
              </div>
              {/* for pending order */}
              <div className='w-full flex gap-4 items-center bg-[#EAF7E9] rounded-[4px]' style={{padding: '16px'}}>
                <div className='w-[56] h-[56] bg-white rounded-[2px] flex flex-col items-center justify-center' style={{padding: '10px'}}><PiPackageLight className='text-[#2DB224]'  size={32}/></div>
                <p>
                  <span className='text-[20px] text-[#191C1F] font-semibold'>
                  {
                    userData?.productOrder?.filter((order) => order.orderStatus==='delivered').length || 0
                  }
                  </span>
                  <br /> Completed Orders
                </p>
              </div>
            </div>
          </div>
          {/* for recent order */}
            <div className='w-full rounded-[4px] border border-[#E4E7E9]'>
              <div className='w-full flex flex-col gap-2'>
                <h1 style={{padding: '10px 15px'}} className='w-full border-b-1 font-bold border-[#E4E7E9] text-[14px] text-[#191C1F]'>RECENT ORDERS</h1>
                <div style={{padding:"10px 20px"}} className='w-full hidden md:grid md:grid-cols-5 text-[12px] text-[#475156] bg-[#F2F4F5] border border-[#E4E7E9]'>
                  <p>ORDER ID</p>
                  <p>STATUS</p>
                  <p>DATE</p>
                  <p>TOTAL</p>
                  <p>ACTION</p>
                </div>
                {userData && (
                  userOrder?.sort((a,b) => new Date(b.flutterwaveResponse.created_at) - new Date(a.flutterwaveResponse.created_at))
                  .slice(0,7)
                  .map((order, index) => (
                    <div key={index} style={{padding:"10px 20px"}} className='w-full md:grid md:grid-cols-5 gap-10 text-[14px] text-[#475156]'>
                      <div className="flex md:block">
                        <span className="font-medium text-gray-500 w-28 md:hidden">Order ID:</span>
                        <p className="text-[#191C1F]">#{order.flutterwaveResponse.transaction_id}</p>
                      </div>
                      <div className="flex md:block">
                        <span className="font-medium text-gray-500 w-28 md:hidden">Order Status:</span>
                        <p className={`${order.orderStatus === "delivered" ? "text-[#2DB224] font-bold" : "text-[#EE5858] font-bold"}`}>{order.orderStatus==='delivered' ? 'COMPLETED' : order.orderStatus==='on_the_road' ? 'ON THE ROAD' : order.orderStatus==='packaging' ? 'PACKAGING' : 'RECEIVED'}</p>
                      </div>
                      <div className="flex md:block">
                        <span className="font-medium text-gray-500 w-28 md:hidden">Order Date:</span>
                        <p className='text-[#5F6C72]'>
                          {new Date(order.flutterwaveResponse.created_at)
                            .toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                            .replace(',', '')}
                        </p>
                      </div>
                      <div className="flex md:block">
                        <span className="font-medium text-gray-500 w-28 md:hidden">Total:</span>
                        <p className='text-[#475156]'>₦{order.subtotal.toLocaleString()} ({order.products.length} Products)</p>
                      </div>
                      <p onClick={() => navigate(`/dashboard/order-history/${order.flutterwaveResponse.transaction_id}`)} className='text-[#2DA5F3] flex items-center gap-2 cursor-pointer'><span>View Details</span><IoIosArrowRoundForward size={16}/></p>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      :
        <p>Loading details</p>
      }
    </>
  )
}

export default HomeDashboard