const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CategoryContext } from '../../../CategoryContext';
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ProductPage = () => {
  const { allProduct, allCategory } = useContext(CategoryContext);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [selected, setSelected] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [isconfirmDelete, setIsConfirmDelete] = useState(false)
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (allProduct) {
      console.log("All Products in ProductPage", allProduct);
    }
  }, [allProduct]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const normalizeCategory = useCallback((category) => {
    if (!category) return '-';
    if (Array.isArray(category)) {
      const values = category
        .map((item) => (typeof item === 'object' ? item.name || item._id : item))
        .filter(Boolean);
      return values.length ? values.join(', ') : '-';
    }
    if (typeof category === 'object') return category.name || category._id || '-';
    return category || '-';
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(allProduct)) return [];
    const query = searchQuery.trim().toLowerCase();

    return allProduct.filter((product) => {
      const categoryLabel = normalizeCategory(product.category).toLowerCase();
      const textSearch = [product.name, product.brand, product.description, categoryLabel]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || textSearch.includes(query);
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allProduct, searchQuery, statusFilter, normalizeCategory]);

  const totalProducts = allProduct?.length || 0;
  const publishedCount = allProduct?.filter((item) => item.status === 'published').length || 0;
  const draftCount = allProduct?.filter((item) => item.status === 'draft').length || 0;
  const lowStockCount = allProduct?.filter((item) => Number(item.inventory) <= 5).length || 0;

  const addProduct = () => {
    navigate(`/${ADMIN_ROUTE}/products/add-product`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    const categoryValue = typeof product.category === 'object'
      ? product.category.name || product.category._id || ''
      : product.category || '';

    setSelected(categoryValue ? [categoryValue] : []);
    setExistingImages(Array.isArray(product.image) ? product.image : product.image ? [product.image] : []);
    setNewImages([]);

    formik.setValues({
      name: product.name || '',
      description: product.description || '',
      inventory: product.inventory || '',
      price: product.price || '',
      discountPrice: product.discountPrice || product.discountprice || '',
      category: categoryValue,
      weight: product.weight || '',
      size: product.size || '',
      region: product.region || '',
      condition: product.condition || '',
      processor: product.processor || '',
      ram: product.ram || '',
      storage: product.storage || '',
      storageType: product.storageType || '',
      displaySize: product.displaySize || '',
      graphicsCardMemory: product.graphicsCardMemory || '',
      numberOfCores: product.numberOfCores || '',
      operatingSystem: product.operatingSystem || '',
      brand: product.brand || '',
      model: product.model || '',
      battery: product.battery || '',
      openToNegotiation: product.openToNegotiation ? 'true' : 'false',
      color: product.color || '',
      productBox: product.productBox || '',
      features: product.features || '',
      status: product.status || 'draft'
    });
    setDeleteTargetId(null);
    setIsOpen(true);
  };

  const removeExistingImage = useCallback((index) => {
    setExistingImages((current) => current.filter((_, idx) => idx !== index));
  }, []);

  const removeNewImage = useCallback((index) => {
    setNewImages((current) => current.filter((_, idx) => idx !== index));
  }, []);

  const handleNewImages = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setNewImages((current) => [...current, ...files].slice(0, 10));
  }, []);

  const statusBadge = useCallback((status) => {
    const base = 'inline-flex rounded-full px-3 py-1 text-xs font-semibold';
    if (status === 'published') return <span className={`${base} bg-[#D1FAE5] text-[#047857]`}>Published</span>;
    if (status === 'draft') return <span className={`${base} bg-[#E5E7EB] text-[#475569]`}>Draft</span>;
    return <span className={`${base} bg-[#F8FAFF] text-[#0F766E]`}>{status || 'Unknown'}</span>;
  }, []);

  // Declare formik first before callbacks that depend on it
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      inventory: '',
      price: '',
      discountPrice: '',
      category: '',
      weight: '',
      size: '',
      region: '',
      condition: '',
      processor: '',
      ram: '',
      storage: '',
      storageType: '',
      displaySize: '',
      graphicsCardMemory: '',
      numberOfCores: '',
      operatingSystem: '',
      brand: '',
      model: '',
      battery: '',
      openToNegotiation: 'false',
      color: '',
      productBox: '',
      features: '',
      status: 'draft'
    },
    validationSchema: yup.object({
      name: yup.string().required('Product name is required'),
      description: yup.string().required('Product description is required'),
      price: yup.number().typeError('Price must be a number').required('Product price is required'),
      category: yup.string().required('Product category is required'),
      inventory: yup.number().typeError('Inventory must be a number').min(0, 'Inventory must be at least 0').required('Inventory is required'),
      status: yup.string().oneOf(['published', 'draft']).required('Product status is required')
    }),
    onSubmit: async (values) => {
      if (!token) {
        toast.error('Admin session expired. Please sign in again.');
        return;
      }

      if (existingImages.length + newImages.length === 0) {
        toast.error('Please keep at least one product image.');
        return;
      }

      try {
        setSavingProduct(true);
        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            payload.append(key, value);
          }
        });

        existingImages.forEach((imageUrl) => {
          payload.append('existingImages', imageUrl);
        });

        newImages.forEach((file) => {
          payload.append('images', file);
        });

        const res = await axios.put(`${API_URL}/${ADMIN_ROUTE}/editproduct/${selectedProduct?._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.status) {
          toast.success('Product updated successfully');
          setIsOpen(false);
          window.location.reload();
        } else {
          toast.error(res.data.message || 'Failed to update product');
        }
      } catch (err) {
        console.error('Update product error:', err);
        toast.error(err.response?.data?.message || 'Unable to update product. Please try again.');
      } finally {
        setSavingProduct(false);
      }
    }
  });

  // Callbacks that depend on formik, declared after formik
  const handleCheckboxChange = useCallback((event) => {
    const { value, checked } = event.target;
    setSelected((current) => {
      const next = checked ? [...current, value] : current.filter((item) => item !== value);
      formik.setFieldValue('category', next.length > 0 ? next[next.length - 1] : '');
      return next;
    });
  }, [formik]);

  const deleteProduct = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`${API_URL}/${ADMIN_ROUTE}/deleteproduct/${id}`)
        .then((res) => {
          if (res.data.status) {
            toast.success("Product Deleted Successfully");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete product");
        });
    }
  }, [API_URL, token]);

  const selectAllProduct = useCallback((event) => {
    const { checked } = event.target;
    if (checked) {
      const allIds = allProduct.map(product => product._id);
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds([]);
    }
  }, [allProduct]);

  const deleteAllProduct = useCallback(() => {
    axios.delete(`${API_URL}/${ADMIN_ROUTE}/deleteSelectedProduct`, { data: selectedProductIds })
      .then((res) => {
        if (res.status) {
          toast.success('Selected Product Deleted Successfully');
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error('selected product cannot be deleted', err);
        toast.error('Failed to delete selected products');
      });
  }, [selectedProductIds, API_URL, token]);

  const openDeleteOption = useCallback(() => {
    if (selectedProductIds.length > 0) {
      setDeleteOpen(true);
    } else {
      toast.warning('Select at least 1 item to delete');
    }
  }, [selectedProductIds]);

  return (
    <div className='w-full min-h-screen flex flex-col gap-8'>
      <section className='rounded-[32px] border border-[#E5E7EB] bg-gradient-to-br from-[#F8FDFF] via-[#F0FAFF] to-[#F8FAFF] p-8 shadow-xl'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
          <div className='space-y-3'>
            <p className='text-sm uppercase tracking-[0.35em] text-[#0F766E]'>Product catalog</p>
            <h1 className='text-4xl font-extrabold text-[#111827]'>Luxury admin product management</h1>
            <p className='max-w-2xl text-sm text-[#475569]'>Manage your product inventory, categories, stock, and publishing status from a premium control center built for high-value retail.</p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <button onClick={addProduct} className='inline-flex items-center justify-center rounded-[18px] bg-gradient-to-r from-[#0F766E] to-[#14B8A6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]'>
              Add product
            </button>
            <button onClick={openDeleteOption} className='inline-flex items-center justify-center rounded-[18px] border border-[#0F766E] bg-white px-6 py-3 text-sm font-semibold text-[#0F766E] shadow-sm transition hover:bg-[#F0FDFF]'>
              Delete selected
            </button>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
          <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
            <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Total products</p>
            <p className='mt-4 text-4xl font-bold text-[#111827]'>{totalProducts}</p>
          </div>
          <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
            <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Published</p>
            <p className='mt-4 text-4xl font-bold text-[#111827]'>{publishedCount}</p>
          </div>
          <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
            <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Drafts</p>
            <p className='mt-4 text-4xl font-bold text-[#111827]'>{draftCount}</p>
          </div>
          <div className='rounded-[24px] bg-white p-6 shadow-sm border border-[#E5E7EB]'>
            <p className='text-sm text-[#6B7280] uppercase tracking-[0.3em]'>Low stock</p>
            <p className='mt-4 text-4xl font-bold text-[#111827]'>{lowStockCount}</p>
          </div>
        </div>
      </section>

      <section className='rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-xl'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
          <div className='space-y-2'>
            <p className='text-sm uppercase tracking-[0.3em] text-[#6B7280]'>Search and filter</p>
            <h2 className='text-2xl font-bold text-[#111827]'>Find products faster</h2>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2'>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by name, brand, category'
              className='w-full rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
            >
              <option value='all'>All statuses</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
            </select>
          </div>
        </div>
      </section>

      <section className='rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-xl'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-[#111827]'>Product gallery</h2>
            <p className='mt-2 text-sm text-[#6B7280]'>Browse your catalog with elegant product cards and quick access actions.</p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#0F766E]'>Showing {filteredProducts.length} / {totalProducts}</span>
            <span className='rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]'>Selected {selectedProductIds.length}</span>
          </div>
        </div>

        <div className='mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className='rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFF] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg relative'>
                {product.inventory <= 0 && (
                  <div className='absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-[#FEE2E2] px-3 py-1.5'>
                    <FiAlertCircle size={16} className='text-[#B91C1C]' />
                    <span className='text-xs font-semibold text-[#B91C1C]'>Out of Stock</span>
                  </div>
                )}
                {product.inventory > 0 && product.inventory <= 5 && (
                  <div className='absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-[#FEF3C7] px-3 py-1.5'>
                    <FiAlertCircle size={16} className='text-[#C2410C]' />
                    <span className='text-xs font-semibold text-[#C2410C]'>Low Stock</span>
                  </div>
                )}
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      checked={selectedProductIds.includes(product._id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setSelectedProductIds((prev) => [...prev, product._id]);
                        } else {
                          setSelectedProductIds((prev) => prev.filter((id) => id !== product._id));
                        }
                      }}
                      className='h-5 w-5 rounded border-[#CBD5E1] text-[#0F766E] accent-[#0F766E]'
                    />
                    <div className='h-20 w-20 overflow-hidden rounded-[24px] bg-[#E2E8F0]'>
                      <img src={product.image?.[0]} alt={product.name} className='h-full w-full object-cover' />
                    </div>
                  </div>
                  <div>{statusBadge(product.status)}</div>
                </div>

                <div className='mt-6 space-y-3'>
                  <div>
                    <h3 className='text-xl font-semibold text-[#111827]'>{product.name || 'Untitled product'}</h3>
                    <p className='text-sm text-[#6B7280]'>{normalizeCategory(product.category)}</p>
                  </div>

                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                      <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Inventory</p>
                      <div className='mt-2 flex items-end justify-between'>
                        <p className='text-lg font-semibold text-[#111827]'>{product.inventory || 0}</p>
                        {product.inventory <= 0 && (
                          <span className='inline-flex gap-1 items-center rounded px-2 py-1 bg-[#FEE2E2] text-[#B91C1C]'>
                            <FiAlertCircle size={12} />
                            <span className='text-xs font-semibold'>Out</span>
                          </span>
                        )}
                        {product.inventory > 0 && product.inventory <= 5 && (
                          <span className='inline-flex gap-1 items-center rounded px-2 py-1 bg-[#FEF3C7] text-[#C2410C]'>
                            <FiAlertCircle size={12} />
                            <span className='text-xs font-semibold'>Low</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='rounded-[20px] bg-white p-4 border border-[#E5E7EB]'>
                      <p className='text-xs uppercase tracking-[0.25em] text-[#94A3B8]'>Price</p>
                      <p className='mt-2 text-lg font-semibold text-[#111827]'>₦{Number(product.price || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {product.color && <span className='rounded-full bg-[#E5F6FF] px-3 py-1 text-xs font-semibold text-[#0C4A6E]'>{product.color}</span>}
                    {product.brand && <span className='rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374151]'>{product.brand}</span>}
                    {product.condition && <span className='rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]'>{product.condition}</span>}
                  </div>
                </div>

                <div className='mt-6 flex flex-wrap gap-3'>
                  <button
                    onClick={() => handleEdit(product)}
                    className='rounded-[18px] bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115e52]'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className='rounded-[18px] border border-[#F87171] bg-white px-4 py-3 text-sm font-semibold text-[#B91C1C] transition hover:bg-[#FEE2E2]'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full rounded-[24px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-10 text-center text-[#475569]'>
              <p className='text-lg font-semibold'>No products match your search or filter.</p>
              <p className='mt-2 text-sm'>Try clearing the search or selecting a different status.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-[24px] bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden">
            {/* Header */}
            <div className="h-1 bg-gradient-to-r from-[#0F766E] via-[#14B8A6] to-[#06B6D4]"></div>
            <div className="p-8">
              <DialogTitle className="text-2xl font-bold text-[#111827] mb-2">Edit Product</DialogTitle>
              <p className="text-[#6B7280] text-sm">Update product details and settings</p>
            </div>

            {/* Form Content */}
            <form onSubmit={formik.handleSubmit} className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111827]">Product Name</label>
                <input
                  name='name'
                  type='text'
                  placeholder='Enter product name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                />
                {formik.touched.name && formik.errors.name && <p className="text-sm text-[#DC2626] mt-2">{formik.errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111827]">Description</label>
                <textarea
                  name='description'
                  placeholder='Enter product description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all resize-none'
                />
                {formik.touched.description && formik.errors.description && <p className="text-sm text-[#DC2626] mt-2">{formik.errors.description}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111827]">Price (Naira)</label>
                <input
                  name='price'
                  type='number'
                  placeholder='0.00'
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                />
                {formik.touched.price && formik.errors.price && <p className="text-sm text-[#DC2626] mt-2">{formik.errors.price}</p>}
              </div>

              {/* Discount Price */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111827]">Discount Price (Naira)</label>
                <input
                  name='discountPrice'
                  type='number'
                  placeholder='0.00'
                  value={formik.values.discountPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                />
              </div>

              {/* Categories and Product Status */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Categories</label>
                  <div className="space-y-3 p-4 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF]">
                    {allCategory && allCategory.length > 0 ? (
                      allCategory.map((option) => {
                        const optionId = typeof option === 'object' ? option._id : option;
                        const optionName = typeof option === 'object' ? option.name : option;
                        return (
                          <label key={optionId} className='flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-all'>
                            <div className='relative flex items-center'>
                              <input
                                type='checkbox'
                                value={optionId}
                                onChange={handleCheckboxChange}
                                checked={selected.includes(optionId)}
                                className='w-5 h-5 rounded border-2 border-[#0F766E] checked:bg-[#0F766E] cursor-pointer accent-[#0F766E]'
                              />
                            </div>
                            <span className='text-sm text-[#111827] font-medium'>{optionName}</span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No categories available</p>
                    )}
                  </div>
                  {formik.touched.category && formik.errors.category && <p className="text-sm text-[#DC2626] mt-2">{formik.errors.category}</p>}
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-[#111827]">Status</label>
                    <select
                      name='status'
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                    >
                      <option value='draft'>Draft</option>
                      <option value='published'>Published</option>
                    </select>
                    {formik.touched.status && formik.errors.status && <p className="text-sm text-[#DC2626] mt-2">{formik.errors.status}</p>}
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-[#111827]">Condition</label>
                    <select
                      name='condition'
                      value={formik.values.condition}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                    >
                      <option value=''>Select condition</option>
                      <option value='new'>New</option>
                      <option value='refurbished'>Refurbished</option>
                      <option value='used'>Used</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Region</label>
                  <input
                    name='region'
                    type='text'
                    placeholder='e.g. Lagos'
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Negotiable Price</label>
                  <select
                    name='openToNegotiation'
                    value={formik.values.openToNegotiation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  >
                    <option value='false'>No</option>
                    <option value='true'>Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Processor</label>
                  <input
                    name='processor'
                    type='text'
                    placeholder='e.g. Intel i7'
                    value={formik.values.processor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">RAM</label>
                  <input
                    name='ram'
                    type='text'
                    placeholder='e.g. 16GB'
                    value={formik.values.ram}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Storage</label>
                  <input
                    name='storage'
                    type='text'
                    placeholder='e.g. 512GB'
                    value={formik.values.storage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Storage Type</label>
                  <input
                    name='storageType'
                    type='text'
                    placeholder='e.g. SSD'
                    value={formik.values.storageType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Display Size</label>
                  <input
                    name='displaySize'
                    type='text'
                    placeholder='e.g. 15.6 inch'
                    value={formik.values.displaySize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Graphics Memory</label>
                  <input
                    name='graphicsCardMemory'
                    type='text'
                    placeholder='e.g. 4GB'
                    value={formik.values.graphicsCardMemory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Number of Cores</label>
                  <input
                    name='numberOfCores'
                    type='text'
                    placeholder='e.g. 8'
                    value={formik.values.numberOfCores}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Operating System</label>
                  <input
                    name='operatingSystem'
                    type='text'
                    placeholder='e.g. Windows 11'
                    value={formik.values.operatingSystem}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Brand</label>
                  <input
                    name='brand'
                    type='text'
                    placeholder='Brand name'
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Model</label>
                  <input
                    name='model'
                    type='text'
                    placeholder='Model name'
                    value={formik.values.model}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Battery</label>
                  <input
                    name='battery'
                    type='text'
                    placeholder='e.g. 4500mAh'
                    value={formik.values.battery}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Size</label>
                  <input
                    name='size'
                    type='text'
                    placeholder='e.g. 15-inch'
                    value={formik.values.size}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Color</label>
                  <input
                    name='color'
                    type='text'
                    placeholder='e.g. Midnight Black'
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Product Box</label>
                  <input
                    name='productBox'
                    type='text'
                    placeholder='e.g. Original box included'
                    value={formik.values.productBox}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111827]">Features</label>
                <textarea
                  name='features'
                  rows='3'
                  placeholder='Key product features'
                  value={formik.values.features}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                />
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='mb-3 block text-sm font-semibold text-[#111827]'>Existing Images</label>
                  {existingImages.length ? (
                    <div className='grid grid-cols-2 gap-3'>
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className='relative rounded-[16px] overflow-hidden border border-[#E5E7EB] bg-white'>
                          <img src={url} alt={`Existing ${index + 1}`} className='h-32 w-full object-cover' />
                          <button
                            type='button'
                            onClick={() => removeExistingImage(index)}
                            className='absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black'
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-sm text-[#6B7280]'>No existing images selected.</p>
                  )}
                </div>

                <div>
                  <label className='mb-3 block text-sm font-semibold text-[#111827]'>Add New Images</label>
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleNewImages}
                    className='w-full text-sm text-[#111827] file:mr-4 file:py-2 file:px-4 file:rounded-[16px] file:border-0 file:bg-[#0F766E] file:text-white file:font-semibold'
                  />
                  {newImages.length ? (
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                      {newImages.map((file, index) => (
                        <div key={`new-${index}`} className='relative rounded-[16px] overflow-hidden border border-[#E5E7EB] bg-white'>
                          <img src={URL.createObjectURL(file)} alt={file.name} className='h-32 w-full object-cover' />
                          <button
                            type='button'
                            onClick={() => removeNewImage(index)}
                            className='absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black'
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Inventory</label>
                  <input
                    name='inventory'
                    type='number'
                    placeholder='Stock amount'
                    value={formik.values.inventory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#111827]">Weight</label>
                  <input
                    name='weight'
                    type='text'
                    placeholder='e.g., 2.5kg'
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full px-4 py-3 rounded-[16px] border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all'
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='flex-1 px-6 py-3 rounded-[16px] font-semibold text-[#0F766E] bg-[#F0FDFF] border-2 border-[#0F766E] hover:bg-[#E0FCFF] transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={savingProduct}
                  className={`flex-1 px-6 py-3 rounded-[16px] font-semibold text-white bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:shadow-lg hover:scale-105 active:scale-95 transition-all ${savingProduct ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {savingProduct ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[24px] bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden">
            {/* Header */}
            <div className="h-1 bg-gradient-to-r from-[#DC2626] to-[#EF4444]"></div>
            <div className="p-8">
              <DialogTitle className="text-2xl font-bold text-[#111827] mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
                Delete Items
              </DialogTitle>
              <p className="text-[#6B7280] text-sm">This action cannot be undone</p>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 space-y-4">
              <p className="text-[#111827]">
                Are you sure you want to delete <span className="font-bold text-[#DC2626]">{selectedProductIds.length}</span> selected items?
              </p>
              <div className="bg-[#FEF2F2] rounded-lg p-4 border border-[#FECACA]">
                <p className="text-sm text-[#991B1B]">Once deleted, products cannot be recovered. Deleted products will no longer be visible to customers.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setDeleteOpen(false)} 
                  className='flex-1 px-6 py-3 rounded-[16px] font-semibold text-[#111827] bg-[#F3F4F6] border-2 border-[#E5E7EB] hover:bg-[#E5E7EB] transition-all'
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteAllProduct} 
                  className='flex-1 px-6 py-3 rounded-[16px] font-semibold text-white bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:shadow-lg hover:scale-105 active:scale-95 transition-all'
                >
                  Delete Items
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default React.memo(ProductPage);
