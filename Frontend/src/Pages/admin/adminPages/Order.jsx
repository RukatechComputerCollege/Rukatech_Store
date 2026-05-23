const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${ADMIN_ROUTE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
    const delivered = orders.filter((order) => order.orderStatus === 'delivered').length;
    const pending = orders.filter((order) => ['received', 'packaging', 'on_the_road'].includes(order.orderStatus)).length;
    const cancelled = orders.filter((order) => order.orderStatus === 'cancelled').length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    return { totalOrders, totalRevenue, delivered, pending, cancelled, avgOrderValue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        order.transactionId?.toString().toLowerCase().includes(query) ||
        order.userEmail?.toLowerCase().includes(query) ||
        order.userName?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const statusBadge = (status) => {
    const styles = {
      received: 'bg-[#DBEAFE] text-[#1D4ED8]',
      packaging: 'bg-[#FEF3C7] text-[#B45309]',
      on_the_road: 'bg-[#FEE2E7] text-[#B91C1C]',
      delivered: 'bg-[#DCFCE7] text-[#047857]',
      cancelled: 'bg-[#E2E8F0] text-[#475569]'
    };
    return styles[status] || 'bg-[#E5E7EB] text-[#475569]';
  };

  const handleViewOrder = (order) => {
    sessionStorage.setItem('selectedOrder', JSON.stringify(order));
    navigate(`/${ADMIN_ROUTE}/orders/view`);
  };

  return (
    <div className='w-full min-h-screen flex flex-col gap-8'>
      <section className='rounded-[32px] border border-[#E5E7EB] bg-[#F8FDFF] p-8 shadow-xl'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
          <div className='space-y-3'>
            <p className='text-sm uppercase tracking-[0.35em] text-[#0F766E]'>Order management</p>
            <h1 className='text-4xl font-extrabold text-[#111827]'>Luxury order command center</h1>
            <p className='max-w-2xl text-sm text-[#475569]'>Monitor order performance, review fulfillment status, and access order details from a premium admin dashboard.</p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-3xl'>
            <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
              <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Total orders</p>
              <p className='mt-4 text-3xl font-bold text-[#111827]'>{summary.totalOrders}</p>
            </div>
            <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
              <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Pending</p>
              <p className='mt-4 text-3xl font-bold text-[#111827]'>{summary.pending}</p>
            </div>
            <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
              <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Delivered</p>
              <p className='mt-4 text-3xl font-bold text-[#111827]'>{summary.delivered}</p>
            </div>
            <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
              <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Revenue</p>
              <p className='mt-4 text-3xl font-bold text-[#111827]'>₦{Math.round(summary.totalRevenue).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-xl'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-[#111827]'>Search and filter</h2>
            <p className='mt-2 text-sm text-[#475569]'>Narrow results by order ID, customer email, or delivery status.</p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full max-w-3xl'>
            <div className='flex items-center gap-3 rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
              <FiSearch className='text-[#94A3B8]' size={20} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search order ID, customer, email'
                className='w-full border-none bg-transparent text-sm text-[#111827] focus:outline-none'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:outline-none'
            >
              <option value='all'>All statuses</option>
              <option value='received'>Received</option>
              <option value='packaging'>Packaging</option>
              <option value='on_the_road'>On the road</option>
              <option value='delivered'>Delivered</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      <section className='rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-xl'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-[#111827]'>Orders</h2>
            <p className='mt-2 text-sm text-[#475569]'>Showing {filteredOrders.length} of {summary.totalOrders} orders.</p>
          </div>
          <span className='inline-flex items-center rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#047857]'>{filteredOrders.length} results</span>
        </div>

        {loading ? (
          <div className='mt-8 rounded-[28px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-12 text-center text-[#475569]'>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className='mt-8 rounded-[28px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-12 text-center text-[#475569]'>No orders match your search or filter.</div>
        ) : (
          <div className='mt-8 grid gap-6'>
            {filteredOrders.map((order) => (
              <div key={order._id} className='rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFF] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'>
                <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
                  <div className='space-y-3'>
                    <p className='text-xs uppercase tracking-[0.3em] text-[#64748B]'>Order ID</p>
                    <p className='text-xl font-bold text-[#111827]'>#{order.transactionId}</p>
                    <div className='flex flex-wrap gap-2 items-center text-sm text-[#475569]'>
                      <span>{order.userName || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{order.userEmail}</span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 items-start sm:items-end'>
                    <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${statusBadge(order.orderStatus)}`}>
                      {order.orderStatus.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className='text-sm text-[#64748B]'>Order total</p>
                    <p className='text-2xl font-bold text-[#111827]'>₦{order.subtotal?.toLocaleString() || '0'}</p>
                  </div>
                </div>

                <div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 text-sm text-[#475569]'>
                  <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[#94A3B8]'>Items</p>
                    <p className='mt-2 text-lg font-semibold text-[#111827]'>{order.products?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</p>
                  </div>
                  <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[#94A3B8]'>Payment</p>
                    <p className='mt-2 text-lg font-semibold text-[#111827]'>{order.paymentMethod || 'N/A'}</p>
                  </div>
                  <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[#94A3B8]'>Customer</p>
                    <p className='mt-2 text-lg font-semibold text-[#111827]'>{order.userName || order.userEmail}</p>
                  </div>
                  <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[#94A3B8]'>Shipping</p>
                    <p className='mt-2 text-lg font-semibold text-[#111827]'>{order.shippingMethod || 'Standard'}</p>
                  </div>
                </div>

                <div className='mt-6 flex flex-wrap items-center gap-3'>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className='inline-flex items-center justify-center rounded-[18px] bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#115E52]'
                  >
                    View details
                  </button>
                  <button
                    onClick={fetchOrders}
                    className='inline-flex items-center justify-center rounded-[18px] border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFF]'
                  >
                    Refresh list
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ToastContainer />
    </div>
  );
};

export default Order;
