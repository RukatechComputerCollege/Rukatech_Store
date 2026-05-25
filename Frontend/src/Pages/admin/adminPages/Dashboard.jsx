const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { RxCaretUp } from "react-icons/rx";
import { PiShoppingCartSimple } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { MdInventory2 } from "react-icons/md";
import { TiStar } from "react-icons/ti";
import { CategoryContext } from '../../../CategoryContext';
import { AdminContext } from '../admincomponents/AdminContext';
import DashboardChart from '../admincomponents/DashboardChart';
import axios from 'axios';

const Dashboard = () => {
  const { allOrders, allProduct } = useContext(CategoryContext);
  const { allCustomers, ordersMontly, customersMonthly } = useContext(AdminContext)
  const [dailyTotals, setDailyTotals] = useState({});
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    totalReviews: 0
  });

  useEffect(() => {
    if (allOrders && allCustomers && allProduct) {
      console.log("All Orders in Dashboard", allOrders);
      console.log("All Customers in Dashboard", allCustomers);
      console.log("Monthly Orders in Dashboard", ordersMontly);
      console.log("Monthly Customers in Dashboard", customersMonthly);
      console.log("All Products in Dashboard", allProduct);
    }
  }, [allOrders, allCustomers, ordersMontly, customersMonthly, allProduct]);

  // Calculate comprehensive statistics
  useEffect(() => {
    if (allOrders && allCustomers && allProduct) {
      const totalRev = allOrders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
      const totalOrd = allOrders.length;
      const avgOrderVal = totalOrd > 0 ? totalRev / totalOrd : 0;
      const pendingOrd = allOrders.filter(order => order.orderStatus === 'received' || order.orderStatus === 'packaging').length;
      
      // Calculate total reviews from all products
      const totalReviewsCount = allProduct.reduce((sum, product) => {
        return sum + (product.rating && Array.isArray(product.rating) ? product.rating.length : 0);
      }, 0);

      setStats({
        totalRevenue: totalRev,
        totalOrders: totalOrd,
        totalCustomers: allCustomers.length,
        totalProducts: allProduct.length,
        averageOrderValue: avgOrderVal,
        pendingOrders: pendingOrd,
        totalReviews: totalReviewsCount
      });
    }
  }, [allOrders, allCustomers, allProduct]);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (d) => d.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);
    const API_URL = import.meta.env.VITE_API_URL;

  const dailyURL = `${API_URL}/${ADMIN_ROUTE}/orders/hourly?dates=${yesterdayStr},${todayStr}`;

    axios.get(dailyURL).then((res) => {
      if (res.status === 200 && res.data?.data) {
        const rawData = res.data.data;

        // Extract labels
        const keys = Object.keys(rawData[0] || {});
        const orderKeys = keys.filter(k => k.includes("Orders"));

        // Compute totals per date
        const totals = orderKeys.reduce((acc, key) => {
          const total = rawData.reduce((sum, row) => sum + (row[key] || 0), 0);
          acc[key.replace(" Orders", "")] = total;
          return acc;
        }, {});

        console.log("Totals:", totals);
        setDailyTotals(totals);
      }
    }).catch(err => console.error("Error fetching daily totals:", err));
  }, []);


  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 100;
    return (((current - previous) / previous) * 100).toFixed(2);
  };
  let ordersPercentage = 0;
  let customersPercentage = 0;
  let revenuePercentage = 0;

  if (ordersMontly && ordersMontly.length > 1) {
    const sorted = [...ordersMontly].sort((a, b) =>
      a._id.localeCompare(b._id)
    );
    const lastMonth = sorted[sorted.length - 2]?.totalOrders || 0;
    const thisMonth = sorted[sorted.length - 1]?.totalOrders || 0;
    ordersPercentage = calculatePercentageChange(thisMonth, lastMonth);
  }
  if (customersMonthly && customersMonthly.length > 1) {
    const sorted = [...customersMonthly].sort((a, b) =>
      a._id.localeCompare(b._id)
    );
    const lastMonth = sorted[sorted.length - 2]?.totalCustomers  || 0;
    const thisMonth = sorted[sorted.length - 1]?.totalCustomers || 0;
    customersPercentage = calculatePercentageChange(thisMonth, lastMonth);
  }
  if (ordersMontly && ordersMontly.length > 1) {
    const sorted = [...ordersMontly].sort((a, b) =>
      a._id.localeCompare(b._id)
    );
    const lastMonthRevenue = sorted[sorted.length - 2]?.totalRevenue || 0;
    const thisMonthRevenue = sorted[sorted.length - 1]?.totalRevenue || 0;
    revenuePercentage = calculatePercentageChange(thisMonthRevenue, lastMonthRevenue);
  }
  return (
    <>
      <div className='w-full flex flex-col gap-8'>
        {/* Header hero */}
        <div className='relative overflow-hidden rounded-[32px] bg-[#111827] px-8 py-10 shadow-2xl text-white'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_25%)]'></div>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_30%)]'></div>
          <div className='relative z-10 grid gap-8 lg:grid-cols-[3fr_2fr]'>
            <div className='space-y-4'>
              <p className='text-sm uppercase tracking-[0.3em] text-[#67e8f9]'>Executive Intelligence</p>
              <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>Rukatech Store Dashboard</h1>
              <p className='max-w-2xl text-sm text-[#cbd5e1]'>Premium insights for revenue, customer growth, inventory velocity, and retail performance.</p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl'>
                <p className='text-sm text-[#cbd5e1]'>Lifetime revenue</p>
                <p className='mt-3 text-3xl font-bold'>₦{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className='rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl'>
                <p className='text-sm text-[#cbd5e1]'>Customer base</p>
                <p className='mt-3 text-3xl font-bold'>{stats.totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary metrics */}
        <div className='grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='rounded-[28px] bg-gradient-to-br from-white to-[#F8FAFF] p-8 shadow-xl border border-[#E2E8F0]'>
              <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em] mb-4'>Revenue</p>
              <h2 className='text-4xl font-bold text-[#111827]'>₦{stats.totalRevenue.toLocaleString()}</h2>
              <p className='mt-4 text-sm text-[#475569]'>Revenue generated from all completed orders.</p>
              <div className='mt-8 grid grid-cols-2 gap-4'>
                <div className='rounded-[20px] bg-[#F8FDFF] p-4'>
                  <p className='text-xs uppercase tracking-[0.2em] text-[#0F766E]'>Orders</p>
                  <p className='mt-2 text-2xl font-semibold text-[#111827]'>{stats.totalOrders}</p>
                </div>
                <div className='rounded-[20px] bg-[#F8FDFF] p-4'>
                  <p className='text-xs uppercase tracking-[0.2em] text-[#0F766E]'>AOV</p>
                  <p className='mt-2 text-2xl font-semibold text-[#111827]'>₦{Math.round(stats.averageOrderValue).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className='rounded-[28px] bg-[#111827] p-8 shadow-2xl text-white'>
              <p className='text-sm uppercase tracking-[0.3em] text-[#60a5fa]'>Performance</p>
              <div className='mt-5 space-y-6'>
                <div className='rounded-[24px] bg-white/10 p-5'>
                  <p className='text-sm text-[#cbd5e1]'>Product catalog</p>
                  <p className='mt-2 text-3xl font-bold'>{stats.totalProducts}</p>
                </div>
                <div className='rounded-[24px] bg-white/10 p-5'>
                  <p className='text-sm text-[#cbd5e1]'>Pending orders</p>
                  <p className='mt-2 text-3xl font-bold'>{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[28px] bg-white p-8 shadow-xl border border-[#E2E8F0]'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Customer & Ratings</p>
                <h2 className='mt-2 text-3xl font-bold text-[#111827]'>{stats.totalCustomers} customers</h2>
              </div>
              <div className='rounded-full bg-[#E0F2F1] p-4 text-[#047857]'>
                <FiUsers size={28} />
              </div>
            </div>
            <div className='mt-8 grid grid-cols-2 gap-4'>
              <div className='rounded-[20px] bg-[#F8FAFF] p-5'>
                <p className='text-xs uppercase tracking-[0.2em] text-[#6B7280]'>Reviews</p>
                <p className='mt-2 text-2xl font-semibold text-[#111827]'>{stats.totalReviews}</p>
              </div>
              <div className='rounded-[20px] bg-[#F8FAFF] p-5'>
                <p className='text-xs uppercase tracking-[0.2em] text-[#6B7280]'>Inventory</p>
                <p className='mt-2 text-2xl font-semibold text-[#111827]'>{stats.totalProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and activity */}
        <div className='grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-6'>
          <div className='rounded-[28px] bg-white border border-[#E2E8F0] shadow-xl p-8'>
            <div className='flex items-center justify-between gap-4 mb-8'>
              <div>
                <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Revenue Over Time</p>
                <h3 className='text-2xl font-bold text-[#111827]'>Overall performance</h3>
              </div>
              <p className='text-sm text-[#475569]'>Last 30 days</p>
            </div>
            <DashboardChart />
          </div>

          <div className='rounded-[28px] bg-white border border-[#E2E8F0] shadow-xl p-8'>
            <div className='flex items-center justify-between gap-4 mb-6'>
              <div>
                <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Recent orders</p>
                <h3 className='text-2xl font-bold text-[#111827]'>Latest activity</h3>
              </div>
            </div>
            <div className='space-y-4 max-h-[520px] overflow-y-auto pr-2'>
              {allOrders && allOrders.slice(-6).reverse().map((order, index) => (
                <div key={index} className='rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFF] p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm font-semibold text-[#111827]'>Order #{order.transactionId}</p>
                      <p className='text-xs text-[#6B7280]'>{order.userEmail || (order.userId?.email)}</p>
                    </div>
                    <p className='text-sm font-semibold text-[#0F766E]'>₦{order.subtotal?.toLocaleString() || '0'}</p>
                  </div>
                  <div className='mt-3 flex items-center justify-between gap-3 text-sm'>
                    <span className='text-[#475569]'>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.orderStatus === 'delivered' ? 'bg-[#D1FAE5] text-[#047857]' :
                      order.orderStatus === 'on_the_road' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                      order.orderStatus === 'packaging' ? 'bg-[#FEF3C7] text-[#B45309]' :
                      'bg-[#EDE9FE] text-[#7C3AED]'
                    }`}>
                      {order.orderStatus?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard