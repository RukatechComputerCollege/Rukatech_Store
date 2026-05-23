const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState, useEffect } from 'react'
import { FaRegTrashCan } from "react-icons/fa6"
import { FiSearch } from 'react-icons/fi'
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiUserX, FiUserCheck } from 'react-icons/fi';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';

const Customer = () => {
  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchItem, setSearchItem] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 })
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');
  const limit = 10;

  useEffect(() => {
    fetchCustomers(page);
    fetchAllCustomersForStats();
  }, [page]);

  const fetchAllCustomersForStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN_ROUTE}/customer/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setAllCustomers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customers for stats:', error);
    }
  };

  const fetchCustomers = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/${ADMIN_ROUTE}/allCustomers?page=${pageNum}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setCustomers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, currentBanStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/${ADMIN_ROUTE}/user/${userId}/ban`,
        { isBanned: !currentBanStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success(
          currentBanStatus ? 'User has been unbanned' : 'User has been banned'
        );
        fetchCustomers(page);
      }
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN_ROUTE}/deleteCustomers`,
        { _id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success('Customer has been deleted');
        fetchCustomers(page);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const viewUser = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
      navigate(`/${ADMIN_ROUTE}/customer/view`);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullname = `${customer.firstname} ${customer.lastname}`.toLowerCase();
    const email = customer.email.toLowerCase();
    const matchesSearch = fullname.includes(searchItem) || email.includes(searchItem);
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !customer.isBanned) ||
      (statusFilter === 'banned' && customer.isBanned);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='w-full min-h-screen space-y-8'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-[#0F766E]'>Customer Management</p>
          <h1 className='text-3xl font-bold text-[#111827]'>Customer Dashboard</h1>
          <p className='max-w-2xl text-sm text-[#6B7280] mt-2'>Review active users, manage banned accounts, and export customer data with confidence.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            onClick={() => fetchAllCustomersForStats()}
            className='rounded-full bg-white border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8FAFF] transition'
          >
            Refresh
          </button>
          <button
            className='rounded-full bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#115E52] transition'
          >
            Export Customers
          </button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Total Customers</p>
          <p className='mt-4 text-4xl font-bold text-[#111827]'>{allCustomers.length}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>All registered customers in your store.</p>
        </div>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Active Customers</p>
          <p className='mt-4 text-4xl font-bold text-[#047857]'>{allCustomers.filter(c => !c.isBanned).length}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>Customers who can currently access your storefront.</p>
        </div>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Banned Customers</p>
          <p className='mt-4 text-4xl font-bold text-[#B91C1C]'>{allCustomers.filter(c => c.isBanned).length}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>Suspended accounts pending review.</p>
        </div>
      </div>

      <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-[#111827]'>Customer list</h2>
            <p className='text-sm text-[#6B7280]'>Search, filter, and manage your customer base.</p>
          </div>
          <div className='grid w-full gap-3 sm:grid-cols-2 md:w-auto'>
            <div className='relative rounded-3xl border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
              <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]' size={18} />
              <input
                type='text'
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value.toLowerCase())}
                placeholder='Search by customer or email'
                className='w-full rounded-3xl border-0 bg-transparent pl-10 text-sm text-[#111827] outline-none'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none'
            >
              <option value='all'>All customers</option>
              <option value='active'>Active</option>
              <option value='banned'>Banned</option>
            </select>
          </div>
        </div>

        <div className='mt-6 overflow-hidden rounded-3xl border border-[#E5E7EB]'>
          <table className='w-full min-w-185 border-collapse'>
            <thead className='bg-[#F8FAFF] text-left text-xs uppercase tracking-[0.2em] text-[#64748B]'>
              <tr>
                <th className='px-6 py-4'>#</th>
                <th className='px-6 py-4'>Customer</th>
                <th className='px-6 py-4'>Email</th>
                <th className='px-6 py-4'>Joined</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className='bg-white'>
                  <td colSpan='6' className='px-6 py-8 text-center text-sm text-[#94A3B8]'>Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr className='bg-white'>
                  <td colSpan='6' className='px-6 py-8 text-center text-sm text-[#94A3B8]'>No customers match your criteria.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id} className='border-t border-[#E5E7EB] bg-white hover:bg-[#F8FAFF] transition'>
                    <td className='px-6 py-5 text-sm text-[#475569]'>{(page - 1) * limit + index + 1}</td>
                    <td className='px-6 py-5'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-[#111827]'>{`${customer.firstname} ${customer.lastname}`}</span>
                        <span className='text-xs text-[#64748B]'>Customer ID: {customer._id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-sm text-[#475569]'>{customer.email}</td>
                    <td className='px-6 py-5 text-sm text-[#475569]'>{new Date(customer.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className='px-6 py-5'>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${customer.isBanned ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#ECFDF5] text-[#047857]'}`}>{customer.isBanned ? 'Banned' : 'Active'}</span>
                    </td>
                    <td className='px-6 py-5 text-center'>
                      <div className='inline-flex flex-wrap items-center justify-center gap-2'>
                        <button
                          onClick={() => viewUser(customer._id)}
                          className='rounded-full bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] transition'
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBanUser(customer._id, customer.isBanned)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition ${customer.isBanned ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]' : 'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A]'}`}
                        >
                          {customer.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(customer._id)}
                          className='rounded-full bg-[#FEF2F2] px-3 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FECACA] transition'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className='flex flex-wrap items-center justify-end gap-3 rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFF] p-4'>
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              className='rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-[#F3F4F6] transition'
            >
              Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === i + 1 ? 'bg-[#0F766E] text-white' : 'bg-white text-[#475569] hover:bg-[#E2E8F0]'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => page < pagination.totalPages && setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className='rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-[#F3F4F6] transition'
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Customer;
