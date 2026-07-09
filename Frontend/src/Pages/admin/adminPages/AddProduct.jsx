const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { MdKeyboardBackspace, MdDelete } from 'react-icons/md';
import { CategoryContext } from '../../../CategoryContext';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup';

const AddProduct = () => {
  const { allCategory = [] } = useContext(CategoryContext);
  const categories = useMemo(() => (Array.isArray(allCategory) ? allCategory : []), [allCategory]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  const categoryOptions = useMemo(() => {
    const baseOptions = ['Job', 'Electronics', 'Property',"Processors","Laptops", 'Phones', "Tablets", 'Accessories',"Monitors"  ];
    const contextCategories = Array.isArray(categories)
      ? categories
          .map((category) => (typeof category === 'string' ? category : category?.name || category))
          .filter(Boolean)
      : [];

    return [...new Set([...baseOptions, ...contextCategories])];
  }, [categories]);

  const optionFieldChoices = {
    category: [...categoryOptions, 'other'],
    brand: ['Dell', 'Apple', 'HP', 'Lenovo', 'Asus', 'LG', 'Acer', 'Fujitsu', 'Gateway', 'Google', 'Huawei', 'Microsoft', 'MSI', 'Samsung', 'Sony', 'Toshiba', 'Yoga', 'other'],
    processor: ['intel Core i9', 'intel Core i7', 'intel Core i5', 'intel Core i3', 'intel Core ultra 7', 'intel pentium', 'intel Core ultra 9', 'intel Core ultra 5', 'intel Core m5', 'intel Core m3', 'intel Core m2', 'intel Core m', 'intel Core 2 duo', 'intel', 'Amd', 'Amd Ryzen 9', 'Amd Ryzen 8', 'Amd Ryzen 7', 'Amd Ryzen 6', 'Amd Ryzen 5', 'Amd Ryzen 4', 'Amd Ryzen 3', 'Amd A8', 'Amd A6', 'Amd A4', 'Amd A10', 'other'],
    condition: ['Brand new', 'Refurbished', 'Used', 'other'],
    region: ['Lagos State', 'Ogun State', 'Oyo State', 'Osun State', 'other'],
    ram: ['128GB', '64GB', '32GB', '24GB', '20GB', '18GB', '16GB', '12GB', '8GB', '6GB', '4GB', '3GB', '2GB', '1GB', 'other'],
    storageType: ['HDD + SSD', 'HDD', 'SSD', 'SSHD + SSD', 'other'],
    storage: ['3TB', '2TB', '750GB', '700GB', '640GB', '500GB', '512GB', '320GB', '256GB', '250GB', '200GB', '180GB', '160GB', '128GB', '64GB', '32GB', 'other'],
    displaySize: ['21"', '19"', '17"/17.3"', '15.6"', '14"', '13"/13.3"', '12"/12.3"', '11"/11.6"', '10.1"', 'other'],
    graphicsCardMemory: ['512mb', '1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', 'other'],
    operatingSystem: ['windows 11', 'windows 10', 'windows 8.1', 'windows 8', 'windows 7', 'mac OS', 'other'],
    color: ['Black', 'Blue', 'Gold', 'Gray', 'Green', 'Pink', 'Red', 'Silver', 'White', 'Yellow', 'other']
  };

  const handleOptionFieldChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    if (value !== 'other') {
      formik.setFieldTouched(fieldName, true, false);
    }
  };

  const handleCustomOptionChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    formik.setFieldTouched(fieldName, true, false);
  };

  const renderOptionField = (fieldName, label) => {
    const options = optionFieldChoices[fieldName] || [];
    const currentValue = formik.values[fieldName] || '';
    const isCustomValue = currentValue === 'other' || (typeof currentValue === 'string' && currentValue.trim() !== '' && !options.includes(currentValue));
    const selectValue = isCustomValue ? 'other' : currentValue;

    return (
      <div key={fieldName}>
        <label className='mb-2 block text-sm font-medium text-[#111827]'>{label}</label>
        <select
          name={fieldName}
          value={selectValue}
          onChange={(event) => handleOptionFieldChange(fieldName, event.target.value)}
          onBlur={formik.handleBlur}
          className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
        >
          <option value=''>Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option === 'other' ? 'Other' : option}
            </option>
          ))}
        </select>
        {isCustomValue && (
          <input
            type='text'
            value={currentValue === 'other' ? '' : currentValue}
            onChange={(event) => handleCustomOptionChange(fieldName, event.target.value)}
            onBlur={formik.handleBlur}
            placeholder={`Enter custom ${label.toLowerCase()}`}
            className='mt-2 w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
          />
        )}
      </div>
    );
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      inventory: '',
      price: '',
      discountPrice: '',
      category: '',
      weight: '',
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
      size: '',
      color: '',
      productBox: '',
      features: '',
      status: 'draft'
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Product name is required'),
      description: yup.string().required('Product description is required'),
      inventory: yup.number().typeError('Inventory must be a number').min(0, 'Inventory must be at least 0').required('Inventory is required'),
      price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Product price is required'),
      discountPrice: yup.number().typeError('Discount must be a number').nullable().max(yup.ref('price'), 'Discount must be less than the price'),
      category: yup.string().required('Product category is required'),
      condition: yup.string().required('Condition is required'),
      status: yup.string().oneOf(['published', 'draft']).required('Select publish status')
    }),
    onSubmit: async (values) => {
      if (!selectedImages.length) {
        toast.error('Please add at least one product image.');
        return;
      }

      if (!token) {
        toast.error('Admin login is required to add products.');
        return;
      }

      try {
        setUploading(true);
        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          payload.append(key, value);
        });
        selectedImages.forEach((file) => {
          payload.append('images', file);
        });

        const response = await axios.post(`${API_URL}/${ADMIN_ROUTE}/createProduct`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data?.status) {
          toast.success('Product added successfully.');
          setTimeout(() => window.history.back(), 1000);
        } else {
          toast.error(response.data?.message || 'Unable to add product.');
        }
      } catch (error) {
        console.error('Add product error:', error);
        toast.error('Unable to add product. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  });

  useEffect(() => {
    if (formik.values.price && formik.values.discountPrice) {
      const discount = Number(formik.values.price) - Number(formik.values.discountPrice);
      const percentage = Number(formik.values.price) > 0 ? Math.round((discount / Number(formik.values.price)) * 100) : 0;
      formik.setFieldValue('discountPercentage', percentage, false);
    }
  }, [formik, formik.values.price, formik.values.discountPrice]);

  const handleFileSelection = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const combined = [...selectedImages, ...files].slice(0, 10);
    setSelectedImages(combined);
  }, [selectedImages]);

  const removeImage = useCallback((index) => {
    setSelectedImages((current) => current.filter((_, i) => i !== index));
  }, []);

  const activePreview = useMemo(() => {
    return selectedImages.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
  }, [selectedImages]);

  return (
    <div className='w-full min-h-screen bg-[#F8FAFF] py-8'>
      <div className='mx-auto max-w-[1300px] px-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <button onClick={() => window.history.back()} className='inline-flex items-center gap-2 text-[#475569] hover:text-[#0F766E]'>
              <MdKeyboardBackspace size={20} /> Back
            </button>
            <h1 className='mt-4 text-3xl font-semibold text-[#111827]'>Add New Product</h1>
            <p className='mt-2 max-w-2xl text-sm text-[#6B7280]'>Create a premium product listing with elegant media workflow and draft publishing control.</p>
          </div>
          <div className='rounded-[18px] border border-[#E2E8F0] bg-white px-6 py-4 shadow-sm'>
            <p className='text-sm text-[#6B7280]'>Current status</p>
            <p className='mt-1 text-2xl font-semibold text-[#0F766E]'>{formik.values.status === 'published' ? 'Published' : 'Draft'}</p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className='mt-8 grid gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]'>
          <div className='space-y-6 w-full'>
            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-3 border-b border-[#E5E7EB] pb-5'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Basics</span>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#111827]'>Product name</label>
                    <input
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type='text'
                      placeholder='Ultra glass notebook'
                      className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                    />
                    {formik.touched.name && formik.errors.name && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.name}</p>}
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#111827]'>Description</label>
                    <textarea
                      name='description'
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={5}
                      placeholder='Describe the product in one elegant paragraph.'
                      className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none resize-none'
                    />
                    {formik.touched.description && formik.errors.description && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.description}</p>}
                  </div>
                </div>
              </div>

              <div className='grid gap-4 py-5 grid-cols-1 md:grid-cols-2'>
                <div className='w-full'>
                  {renderOptionField('category', 'Category')}
                  {formik.touched.category && formik.errors.category && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.category}</p>}
                </div>
                <div>
                  {renderOptionField('condition', 'Condition')}
                  {formik.touched.condition && formik.errors.condition && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.condition}</p>}
                </div>
              </div>
            </section>

            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-3 border-b border-[#E5E7EB] pb-5'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Pricing</span>
                <div className='grid gap-4 md:grid-cols-3'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#111827]'>Price</label>
                    <input
                      name='price'
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type='number'
                      placeholder='0.00'
                      className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                    />
                    {formik.touched.price && formik.errors.price && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.price}</p>}
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#111827]'>Discount Price</label>
                    <input
                      name='discountPrice'
                      value={formik.values.discountPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type='number'
                      placeholder='0.00'
                      className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                    />
                    {formik.touched.discountPrice && formik.errors.discountPrice && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.discountPrice}</p>}
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#111827]'>Inventory</label>
                    <input
                      name='inventory'
                      value={formik.values.inventory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type='number'
                      placeholder='Stock amount'
                      className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                    />
                    {formik.touched.inventory && formik.errors.inventory && <p className='mt-2 text-sm text-[#DC2626]'>{formik.errors.inventory}</p>}
                  </div>
                </div>
                <div className='rounded-[18px] border border-[#D1D5DB] bg-[#F1F5F9] px-4 py-4 text-sm text-[#0F766E]'>
                  Discount saves: <span className='font-semibold'>₦{formik.values.price && formik.values.discountPrice ? Number(formik.values.price - formik.values.discountPrice).toLocaleString() : '0'}</span>
                </div>
              </div>
            </section>

            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-3 border-b border-[#E5E7EB] pb-5'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Imagery</span>
                <p className='text-sm text-[#6B7280]'>Upload multiple images and manage the gallery before publishing.</p>
              </div>
              <div className='mt-5 grid gap-4'>
                <label className='block text-sm font-medium text-[#111827]'>Product media</label>
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFileSelection}
                  className='w-full rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-4  text-sm text-[#475569] file:mr-4 file:rounded-full file:border-0 file:bg-[#0F766E] file:px-4 file:py-2 file:text-white'
                />
                {uploading ? (
                  <p className='text-sm text-[#475569]'>Processing images…</p>
                ) : selectedImages.length > 0 ? (
                  <div className='grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
                    {activePreview.map((preview, index) => (
                      <div key={index} className='relative overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFF]'>
                        <img src={preview.url} alt={`Product preview ${index + 1}`} className='h-32 w-full object-cover' />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-2 right-2 rounded-full bg-white p-2 text-[#EA4C46] shadow-sm hover:bg-[#F8F2F2]'
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-[#9CA3AF]'>No images selected yet.</p>
                )}
              </div>
            </section>

            {/* <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-3 border-b border-[#E5E7EB] pb-5'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Product story</span>
              </div>
              <div className='mt-5 grid gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[#111827]'>Features</label>
                  <textarea
                    name='features'
                    value={formik.values.features}
                    onChange={formik.handleChange}
                    rows={4}
                    placeholder='List the features that make this product luxurious.'
                    className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none resize-none'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[#111827]'>What&apos;s in the box</label>
                  <textarea
                    name='productBox'
                    value={formik.values.productBox}
                    onChange={formik.handleChange}
                    rows={4}
                    placeholder='Describe what the customer receives upon purchase.'
                    className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none resize-none'
                  />
                </div>
              </div>
            </section> */}
          </div>

          <aside className='space-y-6 w-full'>
            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Specs</span>
                <span className='rounded-full bg-[#ECFDF5] px-3 py-1 text-sm text-[#166534]'>Optional</span>
              </div>
              <div className='mt-5 space-y-4'>
                {[
                  { name: 'brand', label: 'Brand' },
                  { name: 'model', label: 'Model' },
                  { name: 'weight', label: 'Weight' },
                  { name: 'color', label: 'Color' },
                  { name: 'region', label: 'Region' },
                  { name: 'size', label: 'Size' },
                  { name: 'processor', label: 'Processor' },
                  { name: 'ram', label: 'RAM' },
                  { name: 'storage', label: 'Storage' },
                  { name: 'storageType', label: 'Storage type' },
                  { name: 'displaySize', label: 'Display size' },
                  { name: 'graphicsCardMemory', label: 'Graphics card memory' },
                  { name: 'numberOfCores', label: 'Number of cores' },
                  { name: 'operatingSystem', label: 'Operating system' },
                  { name: 'battery', label: 'Battery' }
                ].map((field) => {
                  if (['brand', 'region', 'processor', 'ram', 'storage', 'storageType', 'displaySize', 'graphicsCardMemory', 'operatingSystem', 'color'].includes(field.name)) {
                    return renderOptionField(field.name, field.label);
                  }

                  return (
                    <div key={field.name}>
                      <label className='mb-2 block text-sm font-medium text-[#111827]'>{field.label}</label>
                      <input
                        name={field.name}
                        value={formik.values[field.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type='text'
                        placeholder={field.label}
                        className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                      />
                    </div>
                  );
                })}
                <div>
                  <label className='mb-2 block text-sm font-medium text-[#111827]'>Open to negotiation</label>
                  <select
                    name='openToNegotiation'
                    value={formik.values.openToNegotiation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                  >
                    <option value='false'>No</option>
                    <option value='true'>Yes</option>
                  </select>
                </div>
              </div>
            </section>

            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[#111827]'>Publish status</label>
                  <select
                    name='status'
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    className='w-full rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-3 text-sm text-[#111827] focus:border-[#0F766E] focus:outline-none'
                  >
                    <option value='draft'>Save as draft</option>
                    <option value='published'>Publish now</option>
                  </select>
                </div>
                <div className='rounded-[18px] border border-[#D1D5DB] bg-[#F8FAFF] px-4 py-4 text-sm text-[#475569]'>
                  Published items are visible to shoppers. Drafts remain private until published.
                </div>
              </div>
            </section>

            <section className='rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4'>
                <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#0F766E]'>Summary</span>
                <span className='rounded-full bg-[#ECF2F8] px-3 py-1 text-sm text-[#0F766E]'>Live</span>
              </div>
              <div className='mt-5 space-y-3 text-sm text-[#475569]'>
                <div className='flex items-center justify-between rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
                  <span>Revenue potential</span>
                  <strong>₦{formik.values.price ? Number(formik.values.price).toLocaleString() : '0'}</strong>
                </div>
                <div className='flex items-center justify-between rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
                  <span>Inventory</span>
                  <strong>{formik.values.inventory || '0'}</strong>
                </div>
                <div className='flex items-center justify-between rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3'>
                  <span>Discount</span>
                  <strong>{formik.values.discountPrice && formik.values.price ? Math.round(((Number(formik.values.price) - Number(formik.values.discountPrice)) / Number(formik.values.price)) * 100) : 0}%</strong>
                </div>
              </div>
            </section>
          </aside>
        </form>

        <div className='mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4'>
          <button
            type='button'
            onClick={() => window.history.back()}
            className='w-full sm:w-auto rounded-[20px] px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-[#111827] border border-[#D1D5DB] hover:bg-[#F8FAFF] transition'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={formik.submitForm}
            disabled={!formik.isValid || !formik.dirty || uploading}
            className={`w-full sm:w-auto rounded-[20px] px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-white transition ${!formik.isValid || !formik.dirty || uploading ? 'bg-[#94A3B8] cursor-not-allowed' : 'bg-[#0F766E] hover:bg-[#0e5f53]'}`}
          >
            {uploading ? 'Uploading images…' : 'Publish Product'}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default React.memo(AddProduct);
