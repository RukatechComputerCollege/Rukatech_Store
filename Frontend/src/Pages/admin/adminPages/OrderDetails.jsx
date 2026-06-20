const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FiCheck, FiTruck, FiBox, FiAlertCircle } from 'react-icons/fi';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const OrderDetails = () => {
  const { orderId, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, id, location]);

  const fetchOrderDetails = useCallback(async () => {
    const storedOrder = sessionStorage.getItem('selectedOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
      setLoading(false);
      return;
    }

    const routeOrderId = orderId || id;
    if (!routeOrderId) {
      navigate(`/${ADMIN_ROUTE}/orders`);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${ADMIN_ROUTE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const foundOrder = response.data.data.find((o) => o._id === routeOrderId);
        if (foundOrder) {
          setOrder(foundOrder);
          sessionStorage.setItem('selectedOrder', JSON.stringify(foundOrder));
        } else {
          toast.error('Order not found');
          navigate(`/${ADMIN_ROUTE}/orders`);
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      navigate(`/${ADMIN_ROUTE}/orders`);
    } finally {
      setLoading(false);
    }
  }, [orderId, id, API_URL, token, navigate]);

  const updateOrderStatus = useCallback(async (newStatus) => {
    if (!order?._id) {
      toast.error('Order ID is missing');
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `${API_URL}/${ADMIN_ROUTE}/orders/${order._id}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        setOrder({ ...order, orderStatus: newStatus });
        sessionStorage.setItem('selectedOrder', JSON.stringify({ ...order, orderStatus: newStatus }));
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  }, [order, API_URL, token]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'delivered':
        return { bg: '#E8F5E9', text: '#047857', icon: FiCheck };
      case 'on_the_road':
        return { bg: '#E3F2FD', text: '#1D4ED8', icon: FiTruck };
      case 'packaging':
        return { bg: '#FEF3C7', text: '#C2410C', icon: FiBox };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#B91C1C', icon: MdCancel };
      default:
        return { bg: '#EDE9FE', text: '#7C3AED', icon: FiBox };
    }
  }, []);

  const statusFlow = useMemo(() => ['received', 'packaging', 'on_the_road', 'delivered', 'cancelled'], []);

  const hasOutOfStock = useMemo(() => {
    return order?.products?.some((product) => !product.inStock || product.inventory <= 0);
  }, [order?.products]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-[#5A607F]'>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <p className='text-[#5A607F]'>Order not found</p>
        <button
          onClick={() => navigate(-1)}
          className='px-4 py-2 bg-[#0F766E] text-white rounded-[8px] hover:bg-[#115E52]'
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusColor = getStatusColor(order.orderStatus);
  const StatusIcon = statusColor.icon;

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      <div className='w-full flex flex-col gap-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div className='space-y-2'>
            <p className='text-sm uppercase tracking-[0.35em] text-[#0F766E]'>Order details</p>
            <h1 className='text-3xl font-extrabold text-[#111827]'>Order #{order.transactionId}</h1>
            <p className='text-sm text-[#6B7280]'>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className='rounded-[18px] border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-[#F8FAFF]'
          >
            Back to orders
          </button>
        </div>

        <div className='grid gap-6 xl:grid-cols-[2fr_1fr]'>
          <div className='space-y-6'>
            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div>
                  <p className='text-2xl font-bold text-[#111827]'>₦{order.subtotal?.toLocaleString() || '0'}</p>
                  <p className='text-sm text-[#6B7280] mt-1'>Order total</p>
                </div>
                <div className='inline-flex items-center gap-3 rounded-full px-4 py-3' style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                  <StatusIcon size={20} />
                  <span className='text-sm font-semibold'>{order.orderStatus.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Order Status Update Section */}
            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <h3 className='text-lg font-bold text-[#111827] mb-4'>Update Order Status</h3>
              <div className='space-y-4'>
                <p className='text-sm text-[#6B7280]'>Current status: <span className='font-semibold text-[#111827]'>{order.orderStatus.replace('_', ' ').toUpperCase()}</span></p>
                
                <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3'>
                  {statusFlow.map((status) => {
                    const isCurrentStatus = order.orderStatus === status;
                    const colors = getStatusColor(status);
                    const Icon = colors.icon;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(status)}
                        disabled={updatingStatus || isCurrentStatus}
                        className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                          isCurrentStatus
                            ? `text-white cursor-default opacity-70`
                            : `text-white hover:shadow-md active:scale-95`
                        }`}
                        style={{
                          backgroundColor: isCurrentStatus ? colors.text : colors.bg,
                          color: isCurrentStatus ? 'white' : colors.text
                        }}
                      >
                        <Icon size={18} />
                        <span>{status.replace('_', ' ')}</span>
                      </button>
                    );
                  })}
                </div>

                {order.orderStatus === 'cancelled' && (
                  <div className='rounded-lg bg-[#FEE2E2] border border-[#FECACA] p-4 flex gap-3'>
                    <FiAlertCircle size={20} className='text-[#B91C1C] flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm font-semibold text-[#991B1B]'>Order Cancelled</p>
                      <p className='text-xs text-[#7C2D12] mt-1'>This order has been cancelled and cannot be reactivated.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h2 className='text-[18px] font-bold text-[#111827]'>Products</h2>
                  <p className='text-sm text-[#6B7280]'>{order.products?.length || 0} items in this order</p>
                </div>
                <div className='rounded-full bg-[#F8FAFF] px-4 py-2 text-sm font-semibold text-[#111827]'>Summary</div>
              </div>
              <div className='mt-6 space-y-4'>
                {order.products?.map((product, index) => {
                  const isOutOfStock = !product.inStock || product.inventory <= 0;
                  return (
                    <div key={index} className='grid gap-4 md:grid-cols-[auto_1fr_auto] items-center rounded-[20px] bg-[#F8FAFF] p-4 relative'>
                      {isOutOfStock && (
                        <div className='absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-[#FEE2E2] px-2 py-1'>
                          <FiAlertCircle size={14} className='text-[#B91C1C]' />
                          <span className='text-xs font-semibold text-[#B91C1C]'>Out of Stock</span>
                        </div>
                      )}
                      <div className={`h-20 w-20 rounded-[16px] overflow-hidden bg-[#E5E7EB] ${isOutOfStock ? 'opacity-50' : ''}`}>
                        {product.image ? <img src={product.image} alt={product.name} className='h-full w-full object-cover' /> : null}
                      </div>
                      <div className={isOutOfStock ? 'opacity-60' : ''}>
                        <p className='text-[15px] font-semibold text-[#111827]'>{product.name}</p>
                        <p className='text-sm text-[#6B7280] mt-1'>Qty: {product.quantity || 1}</p>
                        <p className='text-sm text-[#6B7280]'>Unit: ₦{product.price?.toLocaleString() || '0'}</p>
                      </div>
                      <p className={`text-right text-lg font-bold ${isOutOfStock ? 'text-[#94A3B8]' : 'text-[#111827]'}`}>₦{((product.price || 0) * (product.quantity || 1)).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <h2 className='text-[18px] font-bold text-[#111827] mb-4'>Billing & Shipping</h2>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <p className='text-[12px] text-[#5A607F] mb-1'>Name</p>
                  <p className='text-[14px] font-semibold text-[#111827]'>{order.billingDetails?.firstname || 'N/A'} {order.billingDetails?.lastname || ''}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#5A607F] mb-1'>Phone</p>
                  <p className='text-[14px] font-semibold text-[#111827]'>{order.billingDetails?.phone || 'N/A'}</p>
                </div>
                <div className='sm:col-span-2'>
                  <p className='text-[12px] text-[#5A607F] mb-1'>Address</p>
                  <p className='text-[14px] font-semibold text-[#111827]'>
                    {order.billingDetails?.address || 'N/A'}
                    {order.billingDetails?.city ? `, ${order.billingDetails.city}` : ''}
                    {order.billingDetails?.state ? `, ${order.billingDetails.state}` : ''}
                    {order.billingDetails?.country ? `, ${order.billingDetails.country}` : ''}
                  </p>
                </div>
                <div>
                  <p className='text-[12px] text-[#5A607F] mb-1'>Email</p>
                  <p className='text-[14px] font-semibold text-[#111827]'>{order.billingDetails?.email || order.userEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#5A607F] mb-1'>Zip Code</p>
                  <p className='text-[14px] font-semibold text-[#111827]'>{order.billingDetails?.zipcode || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className='space-y-4'>
            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <h2 className='text-[18px] font-bold text-[#111827] mb-4'>Order Summary</h2>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm text-[#6B7280]'>
                  <span>Subtotal</span>
                  <span>₦{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className='flex justify-between text-sm text-[#6B7280]'>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className='flex justify-between text-sm text-[#6B7280]'>
                  <span>Tax</span>
                  <span>₦0</span>
                </div>
              </div>
              <div className='mt-5 flex items-center justify-between border-t border-[#E5E7EB] pt-4'>
                <span className='text-sm text-[#6B7280]'>Total</span>
                <span className='text-2xl font-bold text-[#111827]'>₦{order.subtotal?.toLocaleString() || '0'}</span>
              </div>
            </div>

            <div className='rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm'>
              <h2 className='text-[18px] font-bold text-[#111827] mb-4'>Order Information</h2>
              <div className='space-y-4 text-sm text-[#475569]'>
                <div>
                  <p className='text-[12px] text-[#94A3B8] mb-1'>Order ID</p>
                  <p className='font-semibold text-[#111827] break-all'>{order.transactionId}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#94A3B8] mb-1'>Customer</p>
                  <p className='font-semibold text-[#111827]'>{order.userName || order.userEmail}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#94A3B8] mb-1'>Email</p>
                  <p className='font-semibold text-[#111827] break-all'>{order.userEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#94A3B8] mb-1'>Placed</p>
                  <p className='font-semibold text-[#111827]'>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p className='text-[12px] text-[#94A3B8] mb-1'>Items</p>
                  <p className='font-semibold text-[#111827]'>{order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0} items</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default React.memo(OrderDetails);
