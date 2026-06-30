const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const OrderInfo = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchOrderDetails();
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // The id is the AdminOrder._id
      const response = await axios.get(`${API_URL}/${ADMIN_ROUTE}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setOrder(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `${API_URL}/${ADMIN_ROUTE}/orders/${id}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setOrder(response.data.data || response.data);
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className='w-full flex flex-col border border-[#E4E7E9] rounded-[4px]'>
        <div style={{ padding: "15px 20px" }} className='w-full flex justify-between items-center border-b border-[#E4E7E9]'>
          <p onClick={() => window.history.back()} className='flex cursor-pointer gap-1 items-center text-[14px] text-[#191C1F]'><IoIosArrowRoundBack size={24} /><span>ORDER</span></p>
        </div>
        <div style={{ padding: '20px' }} className='text-center'>Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='w-full flex flex-col border border-[#E4E7E9] rounded-[4px]'>
        <div style={{ padding: "15px 20px" }} className='w-full flex justify-between items-center border-b border-[#E4E7E9]'>
          <p onClick={() => window.history.back()} className='flex cursor-pointer gap-1 items-center text-[14px] text-[#191C1F]'><IoIosArrowRoundBack size={24} /><span>ORDER</span></p>
        </div>
        <div style={{ padding: '20px' }} className='text-center text-red-500'>Order not found</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      received: '#2DA5F3',
      packaging: '#FFA500',
      on_the_road: '#FF6B6B',
      delivered: '#4CAF50',
      cancelled: '#999999'
    };
    return colors[status] || '#333';
  };

  return (
    <div className='w-full flex flex-col border border-[#E4E7E9] rounded-[4px]'>
      <div style={{ padding: "15px 20px" }} className='w-full flex justify-between items-center border-b border-[#E4E7E9]'>
        <p onClick={() => window.history.back()} className='flex cursor-pointer gap-1 items-center text-[14px] text-[#191C1F]'><IoIosArrowRoundBack size={24} /><span>ORDER DETAILS</span></p>
      </div>

      <div className='w-full flex flex-col gap-4'>
        {/* Order Header */}
        <div style={{ padding: '20px' }}>
          <div className='w-full flex items-center justify-between border border-[#F7E99E] bg-[#FDFAE7] rounded-[4px]' style={{ padding: '20px' }}>
            <div className='flex flex-col gap-2'>
              <h1 className='text-[20px] text-[#191C1F] font-bold'>Order #{order.transactionId}</h1>
              <p>
                {order.products?.length || 0} Products • Ordered on{' '}
                <span>
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>
            </div>
            <p className='text-[#2DA5F3] text-[28px] font-bold'>₦{order.subtotal?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Order Status Update */}
        <div className='w-full flex flex-col gap-4' style={{ padding: '0px 20px' }}>
          <h1 className='text-[18px] font-bold'>Update Order Status</h1>
          <select
            value={order.orderStatus}
            disabled={updatingStatus || order.orderStatus === "delivered"}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="border border-[#D9E1EC] p-3 rounded-[4px] font-semibold"
            style={{
              cursor: order.orderStatus === "delivered" ? "not-allowed" : "pointer",
              opacity: order.orderStatus === "delivered" ? 0.6 : 1
            }}
          >
            <option value="received">Received</option>
            <option value="packaging">Packaging</option>
            <option value="on_the_road">On The Road</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div style={{
            backgroundColor: getStatusColor(order.orderStatus),
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'inline-block',
            width: 'fit-content'
          }}>
            Current Status: {order.orderStatus?.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Products */}
        <div className='w-full flex flex-col'>
          <h1 className='text-[18px] border-t border-[#E4E7E9] border-b font-bold' style={{ padding: '20px' }}>
            <span className='text-[#191C1F]'>Products</span>
            <span className='text-[#5F6C72]'> ({order.products?.length || 0})</span>
          </h1>
          <div style={{ padding: "10px 20px" }} className='w-full grid grid-cols-[3fr_1fr_1fr_1fr] text-[12px] text-[#475156] bg-[#F2F4F5] border-b border-[#E4E7E9]'>
            <p>PRODUCT NAME</p>
            <p>PRICE</p>
            <p>QUANTITY</p>
            <p>SUBTOTAL</p>
          </div>
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <div key={index} style={{ padding: "20px" }} className='w-full border-b border-[#E4E7E9] grid grid-cols-[3fr_1fr_1fr_1fr] text-[12px] text-[#475156]'>
                <div className='w-full flex items-center gap-2'>
                  {product.image && (
                    <div className='w-[80px] h-[80px] bg-[#f0f0f0] rounded overflow-hidden'>
                      <img src={product.image} alt={product.name} className='w-full h-full object-cover' />
                    </div>
                  )}
                  <div>
                    <p className='text-[14px] text-[#191C1F] font-semibold'>{product.name}</p>
                  </div>
                </div>
                <p className='text-[#475156] text-[14px]'>₦{product.price?.toLocaleString() || 0}</p>
                <p className='text-[#475156] text-[14px]'>{product.quantity || 1}</p>
                <p className='text-[#191C1F] text-[14px] font-semibold'>₦{((product.price || 0) * (product.quantity || 1)).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px" }} className='text-center text-gray-500'>No products in this order</div>
          )}
        </div>

        {/* Billing Details */}
        <div style={{ padding: "20px" }} className='w-full flex flex-col gap-4 border-t border-[#E4E7E9]'>
          <h1 className='text-[18px] font-bold text-[#191C1F]'>Billing Address</h1>
          {order.billingDetails ? (
            <div className='flex flex-col gap-2 text-[14px]'>
              <p className='font-semibold text-[#191C1F]'>
                {order.billingDetails.firstname} {order.billingDetails.lastname}
              </p>
              <p className='text-[#5F6C72]'>
                {order.billingDetails.address}
                {order.billingDetails.city && `, ${order.billingDetails.city}`}
                {order.billingDetails.state && `, ${order.billingDetails.state}`}
                {order.billingDetails.country && `, ${order.billingDetails.country}`}
              </p>
              {order.billingDetails.phone && (
                <p className='text-[#5F6C72]'>
                  <span className='font-semibold'>Phone:</span> {order.billingDetails.phone}
                </p>
              )}
              {order.billingDetails.email && (
                <p className='text-[#5F6C72]'>
                  <span className='font-semibold'>Email:</span> {order.billingDetails.email}
                </p>
              )}
            </div>
          ) : (
            <p className='text-gray-500'>No billing details available</p>
          )}
        </div>

        {/* Customer Info */}
        <div style={{ padding: "20px" }} className='w-full flex flex-col gap-4 border-t border-[#E4E7E9]'>
          <h1 className='text-[18px] font-bold text-[#191C1F]'>Customer Information</h1>
          <div className='flex flex-col gap-2 text-[14px]'>
            <p className='text-[#5F6C72]'>
              <span className='font-semibold'>Name:</span> {order.userName}
            </p>
            <p className='text-[#5F6C72]'>
              <span className='font-semibold'>Email:</span> {order.userEmail}
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default OrderInfo;