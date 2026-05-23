const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import axios from "axios";
import { useEffect, useState } from "react";
import { MdTrendingUp, MdShoppingCart, MdPeople, MdPercent } from "react-icons/md";

const DashboardChart = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all orders to calculate stats
        const ordersRes = await axios.get(`${API_URL}/${ADMIN_ROUTE}/orders`);
        
        if (ordersRes.status === 200 && ordersRes.data?.data) {
          const orders = ordersRes.data.data;
          
          // Calculate total revenue
          const totalRevenue = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
          
          // Count total orders
          const totalOrders = orders.length;
          
          // Count unique customers
          const uniqueCustomers = new Set(orders.map(order => (order.userId && order.userId._id) ? order.userId._id : order.userId)).size;
          
          // Calculate average order value
          const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          setStats({
            totalRevenue,
            totalOrders,
            totalCustomers: uniqueCustomers,
            averageOrderValue
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Set some default stats for demo
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          averageOrderValue: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, prefix = '', suffix = '' }) => (
    <div className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#0F766E]'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-[#6B7280] mb-2'>{label}</p>
          <h3 className='text-3xl font-bold text-[#111827]'>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </h3>
        </div>
        <div className='rounded-[16px] bg-gradient-to-br from-[#0F766E] to-[#14B8A6] p-3'>
          <Icon className='text-white text-2xl' />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='w-full h-96 rounded-[24px] bg-white border border-[#E2E8F0] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-[#E2E8F0] border-t-[#0F766E]'></div>
          <p className='text-[#6B7280]'>Loading overall statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-[#111827]'>Overall Performance</h2>
          <p className='text-[#6B7280] text-sm mt-1'>Key business metrics at a glance</p>
        </div>
        <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] border border-[#BBFBEE]'>
          <MdTrendingUp className='text-[#065F46] text-lg' />
          <span className='text-sm font-semibold text-[#065F46]'>Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          icon={MdTrendingUp}
          label='Total Revenue'
          value={stats.totalRevenue}
          prefix='₦'
        />
        <StatCard
          icon={MdShoppingCart}
          label='Total Orders'
          value={stats.totalOrders}
        />
        <StatCard
          icon={MdPeople}
          label='Total Customers'
          value={stats.totalCustomers}
        />
        <StatCard
          icon={MdPercent}
          label='Avg Order Value'
          value={Math.round(stats.averageOrderValue)}
          prefix='₦'
        />
      </div>

      {/* Premium Info Card */}
      <div className='rounded-[24px] border border-[#E2E8F0] bg-gradient-to-r from-[#F0FDFF] to-[#F8FAFF] p-6'>
        <div className='flex items-start gap-4'>
          <div className='rounded-[16px] bg-[#0F766E]/10 p-3'>
            <MdTrendingUp className='text-[#0F766E] text-2xl' />
          </div>
          <div className='flex-1'>
            <h3 className='font-semibold text-[#111827] mb-1'>Performance Insight</h3>
            <p className='text-sm text-[#6B7280]'>
              Your store is performing exceptionally with {stats.totalOrders} orders generating ₦{stats.totalRevenue.toLocaleString()} in total revenue from {stats.totalCustomers} valued customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
  