const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useState } from 'react';
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.transactionId?.toString().includes(searchTerm) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <div className='w-full h-full flex flex-col gap-4'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='text-black font-bold text-[24px]'>Orders</h1>
        <div style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white border border-[#1E5EFF]'>
          <span>Export</span>
        </div>
      </div>

      <div style={{ padding: '20px' }} className='w-full bg-white rounded-[6px] flex flex-col gap-4'>
        <div className='w-full flex gap-4 flex-wrap'>
          <div style={{ padding: '0 20px' }} className='flex-1 min-w-[250px] flex items-center gap-3 border-1 border-[#D9E1EC] rounded-[4px]'>
            <FiSearch className='text-[#979797]' size={20} />
            <input
              style={{ padding: '10px 0' }}
              type="text"
              className='border-0 focus:outline-0 flex-1'
              placeholder='Search by Order ID, Email, or Name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='border border-[#D9E1EC] rounded-[4px] px-4 py-2'
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="packaging">Packaging</option>
            <option value="on_the_road">On The Road</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className='text-center py-8'>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className='text-center py-8 text-[#999]'>No orders found</div>
        ) : (
          <div className='w-full overflow-x-auto'>
            <table className="w-full text-sm">
              <thead>
                <tr className='border-b border-[#E4E7E9] font-bold'>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className='border-b border-[#E4E7E9] hover:bg-[#f9f9f9]'>
                    <td style={{ padding: '12px' }} className='font-semibold text-[#2DA5F3]'>
                      #{order.transactionId}
                    </td>
                    <td style={{ padding: '12px' }}>{order.userName}</td>
                    <td style={{ padding: '12px' }}>{order.userEmail}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          backgroundColor: getStatusColor(order.orderStatus),
                          color: '#fff',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {order.orderStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }} className='font-semibold'>
                      ₦{order.subtotal?.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          sessionStorage.setItem('selectedOrder', JSON.stringify(order));
                          navigate(`/${ADMIN_ROUTE}/orders/view`);
                        }}
                        className='hover:text-[#1E5EFF] transition'
                        title='View details'
                      >
                        <MdOpenInNew size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Order;
