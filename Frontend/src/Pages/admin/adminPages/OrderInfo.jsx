const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserAccountContext } from '../../user/UserContext'
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { CategoryContext } from '../../../CategoryContext';
import { toast, ToastContainer } from 'react-toastify';

const OrderInfo = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const { allProduct, allOrders } = useContext(CategoryContext)
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if(allOrders && allOrders.length > 0) {
      const foundOrder = allOrders.find(
        (order) => order.transactionId.toString() === id
      )
      setOrder(foundOrder)
    }
    console.log(order);
  }, [allOrders, id])
  
  return (
    <div className='w-full flex flex-col border border-[#E4E7E9] rounded-[4px]'>
      <div style={{padding:"15px 20px"}} className='w-full flex justify-between items-center border-b border-[#E4E7E9]'>
        <p onClick={() => window.history.back()} className='flex cursor-pointer gap-1 items-center text-[14px] text-[#191C1F]'><IoIosArrowRoundBack size={24}/><span>ORDER</span></p>
        <p className='flex gap-1 items-center text-[14px] text-[#FA8232]'><span>View Ratings</span><LuPlus size={24}/></p>
      </div>
      {order ? (
        <div className='w-full flex flex-col gap-4'>
          <div style={{padding: '20px'}}>
            <div className='w-full flex items-center justify-between border border-[#F7E99E] bg-[#FDFAE7] rounded-[4px]' style={{padding: '20px'}}>
              <div className='flex flex-col gap-2'>
                <h1 className='text-[20px] text-[#191C1F] font-bold'>#{id}</h1>
                <p>
                  {order.products.length} Products • Order Placed in <span>
                  {new Date(order.createdAt)
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
              <p className='text-[#2DA5F3] text-[28px] font-bold'>₦{order.subtotal.toLocaleString()}</p>
            </div>
          </div>
          {/* order status */}
          <div className='w-full flex flex-col gap-4' style={{padding: '0px 20px'}}>
            <h1 className='text-[18px] font-bold'>Order Status</h1>
            <select
              value={order.orderStatus}
              disabled={order.orderStatus === "delivered"}
              onChange={async (e) => {
                const newStatus = e.target.value;
                setLoading(true);
                try {
                  const res = await fetch(`${API_URL}/${ADMIN_ROUTE}/orders/${order._id}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setOrder(data.data);
                    toast.success("Order status updated successfully");
                  } else {
                    toast.error(data.message);
                  }
                } catch (error) {
                  console.error(error);
                } finally {
                  setLoading(false);
                }
              }}
              className="border p-2 rounded"
              style={{ padding: '10px', cursor: order.orderStatus === "delivered" ? "not-allowed" : "pointer" }}
            >
              <option value="received">Received</option>
              <option value="packaging">Packaging</option>
              <option value="on_the_road">On The Road</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {/* order product */}
          <div className='w-full flex flex-col'>
            <h1 className='text-[18px] border-t border-[#E4E7E9] border-b font-bold' style={{padding: '20px'}}><span className='text-[#191C1F]'>Product</span><span className='text-[#5F6C72]'> ({order.products.length})</span></h1>
            <div style={{padding:"10px 20px"}} className='w-full grid grid-cols-[3fr_1fr_1fr_1fr] text-[12px] text-[#475156] bg-[#F2F4F5] border-b border-[#E4E7E9]'>
              <p>PRODUCTS</p>
              <p>PRICE</p>
              <p>QUANTITY</p>
              <p>SUB-TOTAL</p>
            </div>
            {order.products.map((product, index) => (
            <div key={index} style={{padding:"20px"}} className='w-full border-b border-[#E4E7E9] grid grid-cols-[3fr_1fr_1fr_1fr] text-[12px] text-[#475156]'>
                <div className='w-full flex items-center gap-2'>
                  <div className='w-[80px] h-[80px]'>
                    <img src={product.image} alt="" />
                  </div>
                  <div>
                    <p className='font-semibold text-[12px] text-[#2DA5F3]'>{allProduct.find(item => item.id === product.id)?.category.map(cat => cat.name).join(', ').toUpperCase()}</p>
                    <p className='text-[14px] text-[#191C1F]'>{product.name}</p>

                  </div>
                </div>
                <p className='text-[#475156] text-[14px]'>{product.price.toLocaleString()}</p>
                <p className='text-[#475156] text-[14px]'>{product.quantity || 1}</p>
                <p className='text-[#191C1F] text-[14px]'>₦{(product.price * (product.quantity || 1)).toLocaleString()}</p>
            </div>
            ))}
            <div style={{padding:"20px"}} className='w-full grid md:grid-cols-[1fr_1fr_1fr] text-[12px] text-[#475156]'>
              <div className='w-full flex flex-col gap-4 border-r border-[#E4E7E9]'>
                <h1 className='text-[18px] font-bold text-[#191C1F]'>Billing Address</h1>
                <p className='text-[14px] font-medium text-[#191C1F]'>{order?.billingDetails?.firstname} {order?.billingDetails?.lastname}</p>
                <p className='text-[14px] text-[#5F6C72]'>{order?.billingDetails?.address}, {order?.billingDetails?.city}, {order?.billingDetails?.state}, {order?.billingDetails?.country}</p>
                <p className='text-[14px] text-[#5F6C72]'><span className='font-semibold'>Phone number:</span> {order?.billingDetails?.phone}</p>
                <p className='text-[14px] text-[#5F6C72]'><span className='font-semibold'>Email:</span> {order?.billingDetails?.email}</p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div style={{padding: '20px'}}>Loading Order details...</div>
      )}
      <ToastContainer />
    </div>
  )
}

export default OrderInfo