const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState, useContext } from 'react';
import { MdKeyboardBackspace } from "react-icons/md";
import { CategoryContext } from '../../../CategoryContext';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup'

const AddProduct = () => {
  const { allCategory, allProduct } = useContext(CategoryContext)
  const [selected, setSelected] = useState([]);
  const names = allCategory.map((c) => c.name.toLowerCase());
  const [hasOptions, setHasOptions] = useState(false)
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dimlar6iu/image/upload';
  const UPLOAD_PRESET = 'Fastcart';
  const [uploading, setUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  // const [previewImage, setPreviewImage] = useState(null);
  const [imgeURLS, setImgeURLS] = useState([])

  useEffect(() => {
    if(allProduct){
      console.log(allProduct);
    }
    if(allCategory){
      console.log(allCategory);
      
    }
  }, [allProduct])
  
  
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let updated = [];

    if (checked) {
      updated = [...selected, value];
    } else {
      updated = selected.filter((item) => item !== value);
    }

    setSelected(updated);
    formik.setFieldValue('category', updated);
  };

  const goBack = () => {
    window.history.back();
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      inventory: '',
      price: '',
      discountprice: '',
      category: [],
      weight: '',
      country: '',
      size: '',
      productBox: '',
      keyFeatures: '',
      discountPercentage: 0
    },
    onSubmit: (values) =>{
      values.category = selected;
  axios.post(`${API_URL}/${ADMIN_ROUTE}/createProduct`, values)
      .then((res) =>{
        console.log(res);
        if(res.data.status){
          toast.success("Product Added Successfully")
          setTimeout(() => {
            window.history.back()
          }, 1000);
        }
      })
      .catch((err) =>{
        console.log(err);
        if(err){
          toast.error("Product Cannot be added! please try again")
        }
      })
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Product name is required'),
      description: yup.string().required('Product Description is required'),
      image: '',
      inventory: '',
      price: yup.number().required('Product price is required').typeError('Price must be a number'),
      discountprice: yup.number().typeError('Discount must be a number').max(yup.ref('price'), 'Discount must be less than the price').nullable(),
      category: yup.array().min(1, "At least one category is required").required('Product category is required'),
      weight: '',
      country: '',
      size: ''
    })
  })
  useEffect(() => {
    const { price, discountprice } = formik.values;
    if (price && discountprice && price > 0 && discountprice > 0) {
      const discount = price - discountprice;
      const discountPercentage = ((discount / price) * 100).toFixed(2);
      formik.setFieldValue('discountPercentage', discountPercentage);
      console.log(discountPercentage);
    } else {
      formik.setFieldValue('discountPercentage', 0);
    }
  }, [formik.values.price, formik.values.discountprice]);


  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='w-full flex flex-col gap-0'>
        <div onClick={goBack} className='text-[#5A607F] cursor-pointer flex gap-2 items-center'>
          <MdKeyboardBackspace size={10} />
          <p>Back</p>
        </div>
        <div className='w-full flex items-center justify-between'>
          <div>
            <h1 className='text-black font-bold text-[24px]'>Add Product</h1>
          </div>
          <div className='flex gap-4'>
            <div style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'>
              <span>Cancel</span>
            </div>
            <div style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] bg-[#1E5EFF] gap-2 text-white'>
              <button type='submit' className={`${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} disabled={!formik.isValid || !formik.dirty}>Save</button>
            </div>
          </div>
        </div>
      </div>
      {/* for add product section */}
      <div>
        <div>
          <form onSubmit={formik.handleSubmit} action="" className='flex flex-col gap-4'>
            <div className='w-full grid grid-cols-[3fr_1fr] items-start gap-[2em]'>
              {/* for product information */}
              <div style={{padding: '20px'}} className='w-full bg-white rounded-[6px]'>
                <div className='w-full flex flex-col gap-4'>
                  {/* for product information */}
                  <div style={{paddingBottom: '20px'}} className='w-full flex flex-col gap-2 border-b-1 border-[#D9E1EC]'>
                    <p className='text-[16px] text-[#131523] font-bold'>Information</p>
                    <div className=''>
                      <label className='block mb-2 text-[#5A607F]'>Product Name</label>
                      <input name='name' onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" style={{padding: '10px'}} className='w-full focus:outline-0 border border-[#D9E4FF] rounded' placeholder='Summer T-Shirt' />
                      {formik.touched.name && formik.errors.name && (
                        <small className="text-red-500">{formik.errors.name}</small>
                      )}
                    </div>
                    <div className='p-4'>
                      <label className='block mb-2 text-[#5A607F]'>Description</label>
                      <textarea name='description' onChange={formik.handleChange} onBlur={formik.handleBlur}  style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0 rounded resize-none' rows={5} placeholder='Product description'></textarea>
                      {formik.touched.description && formik.errors.description && (
                        <small className="text-red-500">{formik.errors.description}</small>
                      )}
                    </div>
                    <div className='p-4'>
                      <label className='block mb-2 text-[#5A607F]'>Inventory</label>
                      <input name='inventory' onChange={formik.handleChange} onBlur={formik.handleBlur}  style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0 rounded resize-none' placeholder='number of items in available' />
                    </div>
                  </div>
                  <div className='w-full relative flex flex-col gap-1'>
                    <label htmlFor="image">Image</label>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (event) => {
                        const files = event.currentTarget.files;
                        if (!files || files.length === 0) return;
                        setUploading(true);
                        const urls = [];
                        for (let file of files) {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', UPLOAD_PRESET);
                          try {
                            const res = await axios.post(CLOUDINARY_URL, formData);
                            urls.push(res.data.secure_url);
                          } catch (err) {
                            console.error('Cloudinary Upload Error:', err);
                            toast.error("One or more image uploads failed");
                          }
                        }
                        setUploading(false);
                        setImgeURLS(urls);
                        formik.setFieldValue('image', urls);
                      }}
                      style={{padding: '10px'}} className='border-1 border-[#A1A7C4] border-dashed h-[168px] flex flex-col items-center justify-center rounded-[4px]  focus:outline-0'
                    />
                    {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                    {imgeURLS.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {imgeURLS.map((url, index) => (
                          <img key={index} src={url} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}

                  </div>
                  {/* for product price */}
                  <div style={{paddingBottom: '20px'}} className='border-b-1 border-[#D9E1EC]'>
                    <p className='text-[16px] text-[#131523] font-bold'>Price</p>
                    <div className='w-full grid grid-cols-2 gap-2'>
                      {/* for main price */}
                      <div>
                        <label className='block mb-2'>Price</label>
                        <input name='price' onChange={formik.handleChange} onBlur={formik.handleBlur}  type="number" style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0' placeholder='Enter product price' />
                        {formik.touched.price && formik.errors.price && (
                          <small className="text-red-500">{formik.errors.price}</small>
                        )}
                      </div>
                      {/* for discount price */}
                      <div>
                        <label className='block mb-2'>Discount Price</label>
                        <input name='discountprice' onChange={formik.handleChange} onBlur={formik.handleBlur}  type="number" style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0' placeholder='Enter product price' />
                      </div>
                      {formik.values.price && formik.values.discountprice && (
                        <div className='text-green-600 font-medium'>
                          You save: ₦{(formik.values.price - formik.values.discountprice).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* for different options */}
                  <div style={{paddingBottom: '15px'}} className='w-full flex flex-col gap-4'>
                    <p className='text-[16px] text-[#131523] font-bold'>Different Options</p>
                    {/* for switch */}
                    <div className='w-full flex gap-4'>
                      <label className="relative inline items-center cursor-pointer">
                        <input className="sr-only peer" checked={hasOptions} onChange={(e) => setHasOptions(e.target.checked)}  type="checkbox" />
                          <div className="peer ring-2 ring-gray-500 bg-gradient-to-r from-rose-400 to-red-900 rounded-full outline-none duration-500 after:duration-300 w-12 h-4  shadow-inner peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900 shadow-gray-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500  after:content-[''] after:rounded-full after:absolute after:outline-none after:h-8 after:w-8 after:bg-gray-900 after:-top-2 after:-left-2 after:flex after:justify-center after:items-center after:border-4 after:border-gray-500  peer-checked:after:translate-x-10">
                        </div>
                      </label>
                      <small>This product has multiple options</small>
                    </div>

                    {/* for size */}
                    <div className={`w-full flex flex-col gap-4' ${hasOptions ? 'block' : 'hidden'}`}>
                    <div>
                      <p className='text-[16px] text-[#131523] font-bold'>Option 1</p>
                      <div className='w-full grid grid-cols-2 gap-2'>
                        <div className='w-full'>
                          <p>Size</p>
                          <select name="size" onChange={formik.handleChange} onBlur={formik.handleBlur}  className='border-1 border-[#D9E1EC] w-full rounded-[4px] focus:outline-0' style={{padding: '5px'}} id="size">
                            <option value="small">S</option>
                            <option value="medium">M</option>
                            <option value="large">L</option>
                            <option value="extra-large">XL</option>
                            <option value="extra-large-x2">XXL</option>
                          </select>
                        </div>
                        {/* for size value */}
                        <div></div>
                      </div>
                    </div>
                    {/* for shipping */}
                    <div>
                      <p className='text-[16px] text-[#131523] font-bold'>Shipping</p>
                      <div className='w-full grid grid-cols-2 gap-2'>
                        <div>
                          <label htmlFor="weight">Weight</label>
                          <input name='weight' onChange={formik.handleChange} onBlur={formik.handleBlur}  type="text" style={{padding: '5px'}} className='w-full rounded-[4px] border border-[#D9E4FF] focus:outline-0' placeholder='Enter product price' />
                        </div>
                        <div>
                          <p>Country</p>
                          <select name='country' onChange={formik.handleChange} onBlur={formik.handleBlur} className='border-1 border-[#D9E1EC] w-full rounded-[4px] focus:outline-0' style={{padding: '5px'}}>
                            <option value="no-option">Country</option>
                            <option value="small">Nigeria</option>
                            <option value="medium">Morocco</option>
                            <option value="large">Canada</option>
                          </select>
                        </div>

                      </div>
                    </div>
                    {/* end of shipping */}
                    </div>
                  </div>
                </div>
              </div>
              {/* for select area */}
              <div className='w-full flex flex-col gap-4'>
                {/* for key features */}
                <div style={{padding: '20px'}} className="w-full flex flex-col gap-4 bg-white rounded-[6px]">
                  <p className='text-[16px] text-[#131523] font-bold'>Key features</p>
                  <textarea name='keyFeatures' onChange={formik.handleChange} onBlur={formik.handleBlur}  style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0 rounded resize-none' rows={5} placeholder='Enter the key features of this product'></textarea>
                </div>
                {/* for What's in the box */}
                <div style={{padding: '20px'}} className="w-full flex flex-col gap-4 bg-white rounded-[6px]">
                  <p className='text-[16px] text-[#131523] font-bold'>What's in the Box</p>
                  <textarea name='productBox' onChange={formik.handleChange} onBlur={formik.handleBlur}  style={{padding: '10px'}} className='w-full p-2 border border-[#D9E4FF] focus:outline-0 rounded resize-none' rows={5} placeholder='Enter details of what is in the product box'></textarea>
                </div>
                {/* for select category */}
                <div style={{padding: '20px'}} className="w-full flex flex-col gap-4 bg-white rounded-[6px]">
                  <p className='text-[16px] text-[#131523] font-bold'>Categories</p>
                  <div className="flex flex-col gap-2">
                    {allCategory.map((option) => {
                      const isParentChecked = selected.includes(option._id);
                      return (
                        <div key={option._id} className="flex flex-col gap-1">
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={option._id}
                              onChange={handleCheckboxChange}
                              name="category"
                              onBlur={formik.handleBlur}
                              checked={isParentChecked}
                            />
                            <strong>{option.name}</strong>
                          </label>   
                          {isParentChecked && option.subcategories && option.subcategories.length > 0 && (
                            <div className="ml-6 mt-1 flex flex-col gap-1">
                              {option.subcategories.map((sub, i) => {
                                const subValue = `${sub._id}`;
                                return (
                                  <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                      type="checkbox"
                                      value={subValue}
                                      checked={selected.includes(subValue)}
                                      onChange={handleCheckboxChange}
                                    />
                                    {sub.name}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {formik.touched.category && formik.errors.category && (
                      <small className="text-red-500">{formik.errors.category}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* for submission button */}
            <div style={{paddingTop: '20px'}} className='w-full justify-end border-t border-[#D9E1EC]'>
              <button className={`cursor-pointer rounded-[4px] bg-[#1E5EFF] gap-2 text-white ${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : '' }`} disabled={!formik.isValid || !formik.dirty} style={{ padding: '10px 20px' }} type='submit'>Save</button>
            </div>
          </form>
          
        </div>
      </div>
      {/* end of add product section */}
      <ToastContainer />
    </div>
  )
}

export default AddProduct