const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiClock, FiShoppingBag, FiPlus, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const FlashSales = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newFlashSale, setNewFlashSale] = useState({
    title: '',
    productId: '',
    productName: '',
    productImage: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: ''
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadFlashSales();
    loadProducts();
  }, []);

  const loadFlashSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${ADMIN_ROUTE}/flashsales`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.status) {
        setFlashSales(response.data.data);
      } else {
        setFlashSales([]);
      }
    } catch (error) {
      console.warn('Flash sales endpoint not available yet.', error);
      setFlashSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await axios.get(`${API_URL}/${ADMIN_ROUTE}/getAllProducts`);
      if (res.data?.status) setProducts(res.data.data || []);
      else setProducts([]);
    } catch (err) {
      console.warn('Could not load products for flash sale modal', err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenModal = () => setShowCreateModal(true);
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewFlashSale({ title: '', productId: '', productName: '', productImage: '', description: '', discount: '', startDate: '', endDate: '' });
  };

  const handleNewFlashSaleChange = (field, value) => {
    setNewFlashSale((prev) => ({ ...prev, [field]: value }));
  };

  const submitFlashSale = async () => {
    const { title, productName, discount, startDate, endDate } = newFlashSale;
    if (!title || !productName || !discount || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN_ROUTE}/flashsales`,
        {
          ...newFlashSale,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.status) {
        toast.success('Flash sale created successfully');
        handleCloseModal();
        loadFlashSales();
      }
    } catch (error) {
      console.error('Failed to create flash sale:', error);
      toast.error(error.response?.data?.message || 'Could not create flash sale');
    }
  };

  const filteredSales = flashSales.filter((sale) => {
    const title = sale.title?.toLowerCase() || '';
    const product = sale.productName?.toLowerCase() || '';
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || product.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && sale.isActive) ||
      (statusFilter === 'upcoming' && sale.status === 'upcoming') ||
      (statusFilter === 'expired' && sale.status === 'expired');
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: flashSales.filter((sale) => sale.isActive).length,
    total: flashSales.length,
    upcoming: flashSales.filter((sale) => sale.status === 'upcoming').length,
  };

  return (
    <div className='w-full min-h-screen space-y-8'>
      <ToastContainer />

      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.35em] text-[#0F766E]'>Admin / Promotions</p>
          <h1 className='text-3xl font-extrabold text-[#111827]'>Flash Sales</h1>
          <p className='max-w-2xl text-sm text-[#6B7280] mt-2'>Create and manage time-limited promotions to drive urgency and boost conversions.</p>
        </div>

        <button
          onClick={handleOpenModal}
          className='inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#115E52]'
        >
          <FiPlus size={16} />
          New flash sale
        </button>
      </div>

      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]'>
              <div>
                <h2 className='text-xl font-bold text-[#111827]'>Create flash sale</h2>
                <p className='text-sm text-[#6B7280]'>Add a new limited-time campaign for a product.</p>
              </div>
              <button onClick={handleCloseModal} className='text-sm font-semibold text-[#6B7280] hover:text-[#111827]'>Close</button>
            </div>
              <div className='mt-6 grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-[#111827]'>Title</label>
                <input
                  value={newFlashSale.title}
                  onChange={(e) => handleNewFlashSaleChange('title', e.target.value)}
                  placeholder='Flash sale title'
                  className='w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none'
                />
              </div>
              <div className='md:col-span-2'>
                <p className='text-sm text-[#6B7280] mb-2'>Select a product (click to choose)</p>
                <div className='grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-auto py-1'>
                  {productsLoading ? (
                    <div className='text-sm text-[#94A3B8]'>Loading products...</div>
                  ) : products.length === 0 ? (
                    <div className='text-sm text-[#94A3B8]'>No products found</div>
                  ) : (
                    products.map((p) => (
                      <button
                        key={p._id}
                        type='button'
                        onClick={() => setNewFlashSale(prev => ({
                          ...prev,
                          productId: p._id,
                          productName: p.name,
                          productImage: Array.isArray(p.image) ? p.image[0] : p.image || ''
                        }))}
                        className={`flex flex-col items-center gap-1 p-1 rounded-lg border ${newFlashSale.productId === p._id ? 'border-[#0F766E] bg-[#ECFDF5]' : 'border-[#E5E7EB] hover:shadow-sm'} text-left`}
                      >
                        <div className='w-full h-14 bg-[#F8FAFF] rounded-lg overflow-hidden flex items-center justify-center'>
                          { (Array.isArray(p.image) ? p.image[0] : p.image) ? (
                            <img src={Array.isArray(p.image) ? p.image[0] : p.image} alt={p.name} className='h-full w-full object-cover' />
                          ) : (
                            <div className='text-xs text-[#94A3B8]'>No image</div>
                          )}
                        </div>
                        <div className='text-[12px] font-semibold text-[#111827] truncate mt-1'>{p.name}</div>
                        <div className='text-[11px] text-[#6B7280]'>₦ {p.price?.toLocaleString?.() || p.price}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-[#111827]'>Product name</label>
                <input
                  value={newFlashSale.productName}
                  readOnly
                  placeholder='Selected product'
                  className='w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none bg-[#F8FAFF]'
                />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <label className='text-sm font-semibold text-[#111827]'>Description</label>
                <textarea
                  value={newFlashSale.description}
                  onChange={(e) => handleNewFlashSaleChange('description', e.target.value)}
                  placeholder='Optional campaign details'
                  className='w-full min-h-25 rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-[#111827]'>Discount</label>
                <input
                  value={newFlashSale.discount}
                  onChange={(e) => handleNewFlashSaleChange('discount', e.target.value)}
                  placeholder='e.g. 20%'
                  className='w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-[#111827]'>Start date</label>
                <input
                  type='date'
                  value={newFlashSale.startDate}
                  onChange={(e) => handleNewFlashSaleChange('startDate', e.target.value)}
                  className='w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-[#111827]'>End date</label>
                <input
                  type='date'
                  value={newFlashSale.endDate}
                  onChange={(e) => handleNewFlashSaleChange('endDate', e.target.value)}
                  className='w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none'
                />
              </div>
            </div>
            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                onClick={handleCloseModal}
                className='rounded-full border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F8FAFF]'
              >
                Cancel
              </button>
              <button
                onClick={submitFlashSale}
                className='rounded-full bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#115E52]'
              >
                Create flash sale
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Active Sales</p>
          <p className='mt-4 text-4xl font-bold text-[#111827]'>{stats.active}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>Currently live promotions.</p>
        </div>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Upcoming</p>
          <p className='mt-4 text-4xl font-bold text-[#047857]'>{stats.upcoming}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>Scheduled sales starting soon.</p>
        </div>
        <div className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
          <p className='text-xs uppercase tracking-[0.3em] text-[#94A3B8]'>Total campaigns</p>
          <p className='mt-4 text-4xl font-bold text-[#111827]'>{stats.total}</p>
          <p className='mt-2 text-sm text-[#6B7280]'>All flash sale campaigns in the system.</p>
        </div>
      </div>

      <section className='rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-[#111827]'>Active campaigns</h2>
            <p className='text-sm text-[#6B7280]'>Manage flash sales and track key details in one place.</p>
          </div>

          <div className='grid w-full gap-3 sm:grid-cols-2 md:w-auto'>
            <div className='relative rounded-3xl border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
              <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]' size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search flash sales'
                className='w-full rounded-3xl border-0 bg-transparent pl-10 text-sm text-[#111827] outline-none'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none'
            >
              <option value='all'>All statuses</option>
              <option value='active'>Active</option>
              <option value='upcoming'>Upcoming</option>
              <option value='expired'>Expired</option>
            </select>
          </div>
        </div>

        <div className='mt-6 overflow-hidden rounded-3xl border border-[#E5E7EB]'>
          <table className='w-full min-w-185 border-collapse'>
            <thead className='bg-[#F8FAFF] text-left text-xs uppercase tracking-[0.2em] text-[#64748B]'>
              <tr>
                <th className='px-6 py-4'>Campaign</th>
                <th className='px-6 py-4'>Product</th>
                <th className='px-6 py-4'>Discount</th>
                <th className='px-6 py-4'>Schedule</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='6' className='px-6 py-8 text-center text-sm text-[#94A3B8]'>Loading flash sales...</td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan='6' className='px-6 py-8 text-center text-sm text-[#94A3B8]'>No flash sales available.</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale._id || sale.title} className='border-t border-[#E5E7EB] bg-white hover:bg-[#F8FAFF] transition'>
                    <td className='px-6 py-5'>
                      <div className='text-sm font-semibold text-[#111827]'>{sale.title}</div>
                      <div className='text-xs text-[#64748B]'>{sale.description || 'High-converting promotion'}</div>
                    </td>
                    <td className='px-6 py-5 text-sm text-[#475569]'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-lg bg-[#F8FAFF] overflow-hidden flex items-center justify-center'>
                          { (sale.productImage || (sale.product && (Array.isArray(sale.product.image) ? sale.product.image[0] : sale.product.image))) ? (
                            <img
                              src={sale.productImage || (sale.product && (Array.isArray(sale.product.image) ? sale.product.image[0] : sale.product.image))}
                              alt={sale.productName}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='text-xs text-[#94A3B8]'>No image</div>
                          )}
                        </div>
                        <div className='truncate'>
                          <div className='text-sm font-semibold text-[#111827]'>{sale.productName || 'Featured product'}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-sm font-semibold text-[#111827]'>{sale.discount || '20%'} off</td>
                    <td className='px-6 py-5 text-sm text-[#475569]'>{sale.startDate ? `${new Date(sale.startDate).toLocaleDateString()} → ${new Date(sale.endDate).toLocaleDateString()}` : 'TBD'}</td>
                    <td className='px-6 py-5'>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${sale.status === 'active' ? 'bg-[#ECFDF5] text-[#047857]' : sale.status === 'upcoming' ? 'bg-[#F8FAFF] text-[#1D4ED8]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>{sale.status || 'inactive'}</span>
                    </td>
                    <td className='px-6 py-5 text-right'>
                      <button className='rounded-full bg-[#EFF6FF] px-4 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] transition'>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default FlashSales;
