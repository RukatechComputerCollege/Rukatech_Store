const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FaRegTrashCan } from "react-icons/fa6"
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
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

  const handleBanUser = useCallback(async (userId, currentBanStatus) => {
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
  }, [API_URL, token, page]);

  const handleDeleteUser = useCallback(async (userId) => {
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
  }, [API_URL, token, page]);

  const viewUser = useCallback((customerId) => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
      navigate(`/${ADMIN_ROUTE}/customer/view`);
    }
  }, [customers, navigate]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullname = `${customer.firstname} ${customer.lastname}`.toLowerCase();
      const email = customer.email.toLowerCase();
      const searchLower = searchItem.toLowerCase();
      const matchesSearch = fullname.includes(searchLower) || email.includes(searchLower);
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && !customer.isBanned) ||
        (statusFilter === 'banned' && customer.isBanned);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchItem, statusFilter]);

  const stats = useMemo(() => ({
    total: allCustomers.length,
    active: allCustomers.filter(c => !c.isBanned).length,
    banned: allCustomers.filter(c => c.isBanned).length
  }), [allCustomers]);

  return (
    <div className='w-full min-h-screen space-y-4 sm:space-y-6 md:space-y-8'>
      <div className='flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-xs sm:text-sm uppercase tracking-[0.3em] text-[#0F766E]'>Customer Management</p>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]'>Customer Dashboard</h1>
          <p className='max-w-2xl text-xs sm:text-sm text-[#6B7280] mt-1 sm:mt-2'>Review active users, manage banned accounts, and export customer data.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
          <button
            onClick={() => fetchAllCustomersForStats()}
            className='rounded-full bg-white border border-[#D1D5DB] px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8FAFF] transition'
          >
            Refresh
          </button>
          <button
            className='rounded-full bg-[#0F766E] px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-[#115E52] transition'
          >
            Export
          </button>
        </div>
      </div>

      <div className='grid gap-3 sm:gap-4 md:grid-cols-3'>
        <div className='rounded-lg sm:rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Total Customers</p>
          <p className='mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827]'>{stats.total}</p>
          <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-[#6B7280]'>All registered customers.</p>
        </div>
        <div className='rounded-lg sm:rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Active Customers</p>
          <p className='mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#047857]'>{stats.active}</p>
          <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-[#6B7280]'>Currently active users.</p>
        </div>
        <div className='rounded-lg sm:rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Banned Customers</p>
          <p className='mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#B91C1C]'>{stats.banned}</p>
          <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-[#6B7280]'>Suspended accounts.</p>
        </div>
      </div>

      <div className='rounded-lg sm:rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm'>
        <div className='flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6'>
          <div>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-[#111827]'>Customer list</h2>
            <p className='text-xs sm:text-sm text-[#6B7280]'>Search, filter, and manage your customer base.</p>
          </div>
          <div className='grid w-full gap-2 sm:gap-3 sm:grid-cols-2 md:w-auto'>
            <div className='relative rounded-lg sm:rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-3 sm:px-4 py-2 sm:py-3'>
              <FiSearch className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] flex-shrink-0' size={16} />
              <input
                type='text'
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value.toLowerCase())}
                placeholder='Search customer...'
                className='w-full rounded-lg sm:rounded-[18px] border-0 bg-transparent pl-8 sm:pl-10 text-xs sm:text-sm text-[#111827] outline-none'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='rounded-lg sm:rounded-[18px] border border-[#E5E7EB] bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#111827] outline-none'
            >
              <option value='all'>All customers</option>
              <option value='active'>Active</option>
              <option value='banned'>Banned</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className='hidden md:block overflow-x-auto rounded-lg p-4 sm:rounded-2xl md:rounded-3xl border border-[#E5E7EB]'>
          <table className='w-full border-collapse text-sm'>
            <thead className='bg-[#F8FAFF] text-left text-xs uppercase tracking-[0.2em] text-[#64748B]'>
              <tr>
                <th className='px-4 sm:px-6 py-3 sm:py-4'>#</th>
                <th className='px-4 sm:px-6 py-3 sm:py-4'>Customer</th>
                <th className='px-4 sm:px-6 py-3 sm:py-4'>Email</th>
                <th className='px-4 sm:px-6 py-3 sm:py-4'>Joined</th>
                <th className='px-4 sm:px-6 py-3 sm:py-4'>Status</th>
                <th className='px-4 sm:px-6 py-3 sm:py-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody >
              {loading ? (
                <tr className='bg-white'>
                  <td colSpan='6' className='px-4 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-[#94A3B8]'>Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr className='bg-white'>
                  <td colSpan='6' className='px-4 sm:px-6 py-4 sm:py-8 text-center text-xs sm:text-sm text-[#94A3B8]'>No customers match your criteria.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id} className='border-t border-[#E5E7EB] bg-white hover:bg-[#F8FAFF] transition'>
                    <td className='p-4 text-xs sm:text-sm text-[#475569]'>{(page - 1) * limit + index + 1}</td>
                    <td className='p-4'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-xs sm:text-sm text-[#111827]'>{`${customer.firstname} ${customer.lastname}`}</span>
                        <span className='text-xs text-[#64748B]'>ID: {customer._id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className='p-4 text-xs sm:text-sm text-[#475569]'>{customer.email}</td>
                    <td className='p-4 text-xs sm:text-sm text-[#475569]'>{new Date(customer.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className='p-4'>
                      <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${customer.isBanned ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#ECFDF5] text-[#047857]'}`}>{customer.isBanned ? 'Banned' : 'Active'}</span>
                    </td>
                    <td className='p-4 text-center'>
                      <div className='inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2'>
                        <button
                          onClick={() => viewUser(customer._id)}
                          className='rounded-full bg-[#EFF6FF] px-2 sm:px-3 py-1 sm:py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] transition'
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBanUser(customer._id, customer.isBanned)}
                          className={`rounded-full px-2 sm:px-3 py-1 sm:py-2 text-xs font-semibold transition ${customer.isBanned ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]' : 'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A]'}`}
                        >
                          {customer.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(customer._id)}
                          className='rounded-full bg-[#FEF2F2] px-2 sm:px-3 py-1 sm:py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FECACA] transition'
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

        {/* Mobile Card View */}
        <div className='md:hidden space-y-3 sm:space-y-4'>
          {loading ? (
            <div className='text-center text-xs sm:text-sm text-[#94A3B8] py-8'>Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className='text-center text-xs sm:text-sm text-[#94A3B8] py-8'>No customers match your criteria.</div>
          ) : (
            filteredCustomers.map((customer, index) => (
              <div key={customer._id} className='rounded-lg border border-[#E5E7EB] bg-[#F8FAFF] p-4'>
                <div className='flex justify-between items-start gap-2'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-[#64748B]'>#{(page - 1) * limit + index + 1}</p>
                    <h3 className='font-semibold text-sm text-[#111827] truncate'>{`${customer.firstname} ${customer.lastname}`}</h3>
                    <p className='text-xs text-[#475569] truncate'>{customer.email}</p>
                    <p className='text-xs text-[#64748B] mt-1'>Joined: {new Date(customer.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${customer.isBanned ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#ECFDF5] text-[#047857]'}`}>{customer.isBanned ? 'Banned' : 'Active'}</span>
                </div>
                <div className='flex flex-wrap gap-2 mt-3'>
                  <button
                    onClick={() => viewUser(customer._id)}
                    className='flex-1 rounded-lg bg-[#EFF6FF] px-2 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] transition'
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleBanUser(customer._id, customer.isBanned)}
                    className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${customer.isBanned ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]' : 'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A]'}`}
                  >
                    {customer.isBanned ? 'Unban' : 'Ban'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(customer._id)}
                    className='rounded-lg bg-[#FEF2F2] px-2 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FECACA] transition'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className='flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 rounded-lg sm:rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFF] p-3 sm:p-4 mt-4 sm:mt-6'>
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              className='rounded-full border border-[#D1D5DB] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold disabled:opacity-50 hover:bg-[#F3F4F6] transition'
            >
              Prev
            </button>
            <div className='flex flex-wrap gap-1 sm:gap-2'>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-full px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition ${page === pageNum ? 'bg-[#0F766E] text-white' : 'bg-white text-[#475569] hover:bg-[#E2E8F0]'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => page < pagination.totalPages && setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className='rounded-full border border-[#D1D5DB] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold disabled:opacity-50 hover:bg-[#F3F4F6] transition'
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

export default React.memo(Customer);
