import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PiNotebookDuotone, PiPackage, PiTruckLight, PiChecks, PiHandshakeLight, PiMapPinLineLight, PiNotepadLight, PiCheckCircleLight } from "react-icons/pi";
import { RxCheck } from "react-icons/rx";
import Loader from '../components/Loader';

const OrderTrackDetails = () => {
  const { id } = useParams();
  console.log(id);
  const [order, setOrder] = useState(null);
  const expectedDate = order ? new Date(new Date(order.createdAt).getTime() + 7*24*60*60*1000) : null;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/orders/track/${id}`)
    .then(response => {
      console.log(response.data);
      setOrder(response.data.order);
    })
    .catch(error => {
      console.error(error);
    });
    document.title = `Order Detais: ${id} | Fastcart Online Store`
    
  }, [id])
  

  return (
    <div style={{padding: '3% 6%'}} className='w-full flex flex-col gap-4 items-center justify-center'>
      {order ? 
        <div className='w-full md:w-3/4 border border-[#E4E7E9] flex flex-col items-center justify-center gap-4'>
          {order ? (
            <div className='w-full flex flex-col gap-4'>
              <div style={{padding: '20px'}}>
                <div className='w-full flex items-center justify-between border border-[#F7E99E] bg-[#FDFAE7] rounded-[4px]' style={{padding: '20px'}}>
                  <div className='flex flex-col gap-2'>
                    <h1 className='text-[20px] text-[#191C1F] font-bold'>#{id}</h1>
                    <p>
                      {order?.products?.length} Products • Order Placed in <span>
                      {new Date(order?.flutterwaveResponse?.created_at)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(',', '')
                      }
                      </span>
                    </p>
                  </div>
                  <p className='text-[#2DA5F3] text-[28px] font-bold'>₦{order?.subtotal?.toLocaleString()}</p>
                </div>
              </div>
              {/* for order tracker */}
              <div className='w-full flex flex-col gap-4 items-center justify-center' style={{padding: '0px 20px'}}>
                <p>Order expected arrival <strong>{expectedDate?.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</strong></p>
                <div className='w-3/4 grid grid-cols-4'>
                  {/* for order placed tracker */}
                  <div className='flex flex-col gap-6'>
                    <div className='w-full h-[8px] bg-[#FA8232] relative'>
                      <div className='absolute text-white top-[-100%] left-[-10px] w-[24px] h-[24px] bg-[#FA8232] rounded-full flex flex-col items-center justify-center'>
                        <RxCheck />
                      </div>
                    </div>
                    <div>
                      <PiNotebookDuotone size={32} className='text-[#2DB224]'/>
                      <p className='text-[14px] text-[#191C1F]'>Order Placed</p>
                    </div>
                  </div>
                  {/* for packaging tracker */}
                  <div className='flex flex-col gap-6'>
                    <div className={`w-full h-[8px] relative ${order?.orderStatus === 'packaging' || order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'bg-[#FA8232]' : 'bg-[#FFE7D6]'}`}>
                      <div className={`absolute text-white top-[-100%] left-[-10px] w-[24px] h-[24px] ${order?.orderStatus === 'packaging' || order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'bg-[#FA8232]' : 'bg-[#FFE7D6] border border-[#FA8232]'} rounded-full flex flex-col items-center justify-center`}>
                        <RxCheck className={`${order?.orderStatus === 'packaging' || order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'block' : 'hidden'}`} />
                      </div>
                    </div>
                    <div>
                      <PiPackage size={32} className={`${order?.orderStatus === 'packaging' || order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'text-[#FA8232]' : 'text-[#FFE7D6]'}`} />
                      <p className={`text-[14px] ${order?.orderStatus === 'packaging' || order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'text-[#191C1F]' : 'opacity-20'}`}>Packaging</p>
                    </div>
                  </div>
                  {/* for on the road */}
                  <div className='flex flex-col gap-6'>
                    <div className={`w-full h-[8px] relative ${order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'bg-[#FA8232]' : 'bg-[#FFE7D6]'}`}>
                      <div className={`absolute text-white top-[-100%] left-[-10px] w-[24px] h-[24px] ${order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'bg-[#FA8232]' : 'bg-[#FFE7D6] border border-[#FA8232]'} rounded-full flex flex-col items-center justify-center`}>
                        <RxCheck className={`${order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'block' : 'hidden'}`} />
                      </div>
                    </div>
                    <div>
                      <PiTruckLight size={32} className={`${order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'text-[#FA8232]' : 'text-[#FFE7D6]'}`} />
                      <p className={`text-[14px] ${order?.orderStatus === 'on_the_road' || order?.orderStatus === 'delivered' ? 'text-[#191C1F]' : 'opacity-20'}`}>On The Road</p>
                    </div>
                  </div>
                  {/* for handshake tracker */}
                  <div className='flex flex-col gap-6'>
                    <div className='h-[8px] relative'>
                      <div className={`absolute text-white top-[-100%] left-[-10px] w-[24px] h-[24px] ${order?.orderStatus === 'delivered' ? 'bg-[#FA8232]' : 'bg-[#FFE7D6] border border-[#FA8232]'} rounded-full flex flex-col items-center justify-center`}>
                        <RxCheck className={`${order?.orderStatus === 'delivered' ? 'block' : 'hidden'}`} />
                      </div>
                    </div>
                    <div>
                      <PiHandshakeLight size={32} className={`${order?.orderStatus === 'delivered' ? 'text-[#FA8232]' : 'text-[#FFE7D6]'}`} />
                      <p className={`text-[14px] ${order?.orderStatus === 'delivered' ? 'text-[#191C1F]' : 'opacity-20'}`}>Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* order product */}
              <div className='w-full flex flex-col gap-4 border-t border-[#E4E7E9]' style={{padding: '20px'}}>
                <h1 className='text-[18px] text-[#191C1F] font-medium'><span className='text-[#191C1F]'>Order Activity</span></h1>
                {/* for delivered */}
                {order.orderStatus === 'delivered' && (
                  <div className='flex items-center gap-4'>
                    <div className='w-[48px] h-[48px] bg-[#EAF6FE] border border-[#D5EDFD] text-[#2DA5F3] flex items-center justify-center rounded-[2px]'>
                      <PiChecks className='text-[#2DB224]' size={24}/>
                    </div>
                    <div>
                      <p className='text-[14px] text-[#191C1F]'>{(order.orderStatus==='delivered') && 'Your order has been delivered. Thank you for shopping at Clicon!'}</p>
                      <p className='text-[14px] text-[#77878F]'>
                        {(() => {
                          const deliveredDate = new Date(order.flutterwaveResponse.created_at);
                          deliveredDate.setDate(deliveredDate.getDate() + 5); // add 5 days
                          return deliveredDate.toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).replace(',', '');
                        })()}
                      </p>
                    </div>
                  </div>
                )}
                {/* for on the road */}
                {(order.orderStatus==='on_the_road' || order.orderStatus==='delivered') && (
                  <div className='flex items-center gap-4'>
                    <div className='w-[48px] h-[48px] bg-[#EAF6FE] border border-[#D5EDFD] text-[#2DA5F3] flex items-center justify-center rounded-[2px]'>
                      <PiMapPinLineLight className='text-[#2DA5F3]' size={24}/>
                    </div>
                    <div>
                      <p className='text-[14px] text-[#191C1F]'>{(order.orderStatus==='on_the_road' || order.orderStatus==='delivered') && 'Your order is on the way to the pick up station.'}</p>
                      <p className='text-[14px] text-[#77878F]'>
                        {new Date(order.flutterwaveResponse.created_at)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(',', '')
                        }
                      </p>
                    </div>
                  </div>
                )}
                {/* for packaging */}
                {(order.orderStatus==='packaging' || order.orderStatus==='on_the_road' || order.orderStatus==='delivered') && (
                  <div className='flex items-center gap-4'>
                    <div className='w-[48px] h-[48px] bg-[#EAF6FE] border border-[#D5EDFD] text-[#2DA5F3] flex items-center justify-center rounded-[2px]'>
                      <PiCheckCircleLight className='text-[#2DB224]' size={24}/>
                    </div>
                    <div>
                      <p className='text-[14px] text-[#191C1F]'>{(order.orderStatus==='packaging' || order.orderStatus==='on_the_road' || order.orderStatus==='delivered') && 'Your order is successfully verified.'}</p>
                      <p className='text-[14px] text-[#77878F]'>
                        {new Date(order.flutterwaveResponse.created_at)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(',', '')
                        }
                      </p>
                    </div>
                  </div>
                )}
                {/* for received */}
                <div className='flex items-center gap-4'>
                  <div className='w-[48px] h-[48px] bg-[#EAF6FE] border border-[#D5EDFD] text-[#2DA5F3] flex items-center justify-center rounded-[2px]'>
                    <PiNotepadLight className='text-[#2DA5F3]' size={24}/>
                  </div>
                  <div>
                    <p className='text-[14px] text-[#191C1F]'>{(order.orderStatus==='received' || order.orderStatus==='packaging' || order.orderStatus==='on_the_road' || order.orderStatus==='delivered') && 'Your order has been confirmed.'}</p>
                    <p className='text-[14px] text-[#77878F]'>
                      {new Date(order.flutterwaveResponse.created_at)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(',', '')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{padding: '20px'}}>Loading Order details...</div>
          )}
        </div>
      :
      <Loader />
      }
    </div>
  )
}

export default OrderTrackDetails