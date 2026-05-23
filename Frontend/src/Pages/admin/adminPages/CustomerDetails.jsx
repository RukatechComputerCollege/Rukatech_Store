const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdArrowBack, MdDelete, MdDownload } from 'react-icons/md';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { FiUser, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const storedCustomer = sessionStorage.getItem('selectedCustomer');
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
      setLoading(false);
    } else {
      navigate(`/${ADMIN_ROUTE}/customer`);
    }
  }, [navigate]);

  const handleDeleteUser = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN_ROUTE}/deleteCustomers`,
        { _id: customer._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success('Customer has been deleted successfully');
        setTimeout(() => {
          sessionStorage.removeItem('selectedCustomer');
          navigate(`/${ADMIN_ROUTE}/customer`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
    setDeleteConfirm(false);
  };

  const handleExport = () => {
    const data = JSON.stringify(customer, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `customer_${customer._id}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Customer data exported');
  };

  if (loading || !customer) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p className='text-[#5A607F] text-lg'>Loading customer details...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='w-full flex flex-col gap-4 pb-8'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-2'>
          <button
            onClick={() => {
              sessionStorage.removeItem('selectedCustomer');
              navigate(`/${ADMIN_ROUTE}/customer`);
            }}
            className='p-2 hover:bg-[#F5F6FA] rounded-lg transition-colors'
          >
            <MdArrowBack size={24} className='text-[#131523]' />
          </button>
          <div>
            <h1 className='text-[28px] font-bold text-[#131523]'>Customer Details</h1>
            <p className='text-[14px] text-[#5A607F]'>View and manage customer information</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 justify-end mb-4'>
          <button
            onClick={handleExport}
            className='px-4 py-2 bg-white border border-[#D7DBEC] rounded-lg text-[#1E5EFF] hover:bg-[#F5F6FA] transition-colors flex items-center gap-2'
          >
            <MdDownload size={18} />
            Export
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className='px-4 py-2 bg-[#FFE3E3] rounded-lg text-[#F0142F] hover:bg-[#FFCCCC] transition-colors flex items-center gap-2'
          >
            <MdDelete size={18} />
            Delete
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Main Content */}
          <div className='lg:col-span-2 flex flex-col gap-4'>
            {/* Personal Information Card */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-[18px] font-bold text-[#131523] mb-6 flex items-center gap-2'>
                <FiUser size={24} className='text-[#1E5EFF]' />
                Personal Information
              </h2>
              <div className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>FIRST NAME</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.firstname}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>LAST NAME</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.lastname}</p>
                </div>
                <div className='flex flex-col col-span-2'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2 flex items-center gap-2'>
                    <HiOutlineMail size={16} />
                    EMAIL ADDRESS
                  </label>
                  <p className='text-[16px] font-semibold text-[#1E5EFF] break-all'>{customer.email}</p>
                </div>
                <div className='flex flex-col col-span-2'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2 flex items-center gap-2'>
                    <HiOutlinePhone size={16} />
                    PHONE NUMBER
                  </label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.phonenumber1 || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Address Information Card */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h2 className='text-[18px] font-bold text-[#131523] mb-6 flex items-center gap-2'>
                <FiMapPin size={24} className='text-[#06A561]' />
                Address Information
              </h2>
              <div className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col col-span-2'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>ADDRESS</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.address || 'Not provided'}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>CITY</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.city || 'Not provided'}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>STATE</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.state || 'Not provided'}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>COUNTRY</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.country || 'Not provided'}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[12px] text-[#5A607F] font-semibold mb-2'>ZIP CODE</label>
                  <p className='text-[16px] font-semibold text-[#131523]'>{customer.zipcode || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='flex flex-col gap-4'>
            {/* Status Card */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h3 className='text-[14px] font-bold text-[#5A607F] mb-4'>ACCOUNT STATUS</h3>
              <div className='flex items-center gap-3 mb-4'>
                <div className={`w-3 h-3 rounded-full ${customer.isBanned ? 'bg-[#F0142F]' : 'bg-[#06A561]'}`}></div>
                <span className={`text-[16px] font-bold ${customer.isBanned ? 'text-[#F0142F]' : 'text-[#06A561]'}`}>
                  {customer.isBanned ? 'Banned' : 'Active'}
                </span>
              </div>
              <p className='text-[12px] text-[#5A607F]'>
                {customer.isBanned ? 'This account is currently banned and cannot access the platform.' : 'This account is active and can access all platform features.'}
              </p>
            </div>

            {/* Join Date Card */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h3 className='text-[14px] font-bold text-[#5A607F] mb-4 flex items-center gap-2'>
                <HiOutlineCalendar size={16} />
                MEMBER SINCE
              </h3>
              <p className='text-[16px] font-bold text-[#131523]'>
                {new Date(customer.registrationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className='text-[12px] text-[#5A607F] mt-2'>
                {Math.floor((new Date() - new Date(customer.registrationDate)) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </div>

            {/* ID Card */}
            <div className='bg-gradient-to-br from-[#1E5EFF] to-[#0940B8] rounded-xl shadow-sm p-6 text-white'>
              <h3 className='text-[12px] font-bold text-white opacity-90 mb-2'>CUSTOMER ID</h3>
              <p className='text-[12px] font-mono break-all opacity-75'>{customer._id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 max-w-sm w-full shadow-lg'>
            <h2 className='text-[20px] font-bold text-[#131523] mb-2'>Delete Customer?</h2>
            <p className='text-[14px] text-[#5A607F] mb-6'>
              Are you sure you want to delete <span className='font-bold'>{customer.firstname} {customer.lastname}</span>? This action cannot be undone.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setDeleteConfirm(false)}
                className='px-4 py-2 bg-[#F5F6FA] text-[#131523] rounded-lg hover:bg-[#E8ECFF] transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className='px-4 py-2 bg-[#F0142F] text-white rounded-lg hover:bg-[#D90000] transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDetails;
