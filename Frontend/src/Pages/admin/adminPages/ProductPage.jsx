const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useEffect, useState } from 'react';
import { CategoryContext } from '../../../CategoryContext';
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import { FiSearch } from 'react-icons/fi';
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [isconfirmDelete, setIsConfirmDelete] = useState(false)
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (allProduct) {
      console.log("All Products in ProductPage", allProduct);
    }
  }, [allProduct]);

  const addProduct = () => {
  navigate(`/${ADMIN_ROUTE}/product/add-product`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    const categoryArray = Array.isArray(product.category) ? product.category : [product.category];
    setSelected(categoryArray.map(cat => cat._id));
    formik.setValues({
      name: product.name || '',
      description: product.description || '',
      image: product.image || '',
      inventory: product.inventory || '',
      price: product.price || '',
      discountprice: product.discountprice || '',
      category: categoryArray.map(cat => cat._id),
      weight: product.weight || '',
      country: product.country || '',
      size: product.size || ''
    });
    setIsOpen(true);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((item) => item !== value));
    }
  };

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
      size: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('Product name is required'),
      description: yup.string().required('Product Description is required'),
      price: yup.number().required('Product price is required'),
      category: yup.array().min(1, 'Product category is required'),
      image: yup.array().min(1, 'At least one image is required')
    }),
    onSubmit: async (values) => {
      values.category = selected;
      try {
  const res = await axios.put(`${API_URL}/${ADMIN_ROUTE}/editproduct/${selectedProduct._id}`, values);
        if (res.data.status) {
          toast.success('Product updated successfully');
          setIsOpen(false);
          window.location.reload()
        }
      } catch (err) {
        console.error(err);
        alert('Failed to update product');
      }
    }
  });
  const deleteProduct = (id) =>{
    if(window.confirm("Are you sure you want to delete this category?")){
  axios.delete(`${API_URL}/${ADMIN_ROUTE}/deleteproduct/${id}`)
      .then((res) =>{
        console.log(res);
        if(res.data.status){
          toast.success("Product Deleted Successfully")
          window.location.reload()
        }
      })
      .catch((err) =>{
        console.log(err);
      })
    }
  }
  const selectAllProduct = (event) => {
    const { checked } = event.target;
    if (checked) {
      const allIds = allProduct.map(product => product._id);
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds([]);
    }
  };
  const deleteAllProduct = () =>{
    console.log(selectedProductIds);
  axios.delete(`${API_URL}/${ADMIN_ROUTE}/deleteSelectedProduct`, {data: selectedProductIds} )
    .then((res) =>{
      console.log(res);
      if(res.status){
        toast.success('Selected Product Deleted Successfully')
        window.location.reload()
      }
    }).catch((err) =>{
      console.log('selected product cannot be deleted', err);
    })
  }
  const openDeleteOption = () =>{
    if(selectedProductIds.length > 0){
      setDeleteOpen(true)
    }else{
      toast.warning('Select at least 1 item to delete')
    }
  }

  return (
    <div className='w-full h-full flex flex-col gap-[1em]'>
      <div className='w-full flex flex-col gap-0'>
        <div className='w-full flex items-center justify-between'>
          <div>
            <h1 className='text-black font-bold text-[24px]'>Products</h1>
          </div>
          <div className='flex gap-4'>
            <div style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'>
              <span>Export</span>
            </div>
            <div onClick={addProduct} style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] bg-[#1E5EFF] gap-2 text-white'>
              <span>Add Product</span>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full flex flex-col gap-4'>
        <div style={{ padding: '20px' }} className='w-full bg-white rounded-[6px] flex flex-col gap-4'>
          <div className='w-full grid grid-cols-[4fr_1.5fr] items-center'>
            <div className='w-full flex gap-4'>
              <div className='w-2/4 flex flex-col items-start justify-center border-1 border-[#D9E1EC] rounded-[4px]'>
                <select className='w-full' name="filter" id="filter">
                  <option value="">nothing yet</option>
                </select>
              </div>
              <div style={{ padding: '0 20px' }} className='flex w-full items-center gap-3 border-1 border-[#D9E1EC] rounded-[4px]'>
                <FiSearch className='text-[#979797]' size={24} />
                <input
                  style={{ padding: '10px 0' }}
                  type="text"
                  className='border-0 focus:outline-0'
                  placeholder='Search'
                />
              </div>
            </div>
            <div className='justify-self-end'>
              <div onClick={openDeleteOption} className='w-[40px] h-[40px] cursor-pointer hover:text-[#304169] flex flex-col justify-center items-center text-[#1E5EFF] rounded-[4px] shadow-sm'>
                <FaRegTrashCan size={24} />
              </div>
            </div>
          </div>

          <div className='w-[100%]'>
            <table className="w-full">
              <thead className='w-full'>
                <tr className='font-bold border-b-1 border-[#D7DBEC] w-full grid grid-cols-[0.4fr_3fr_1fr_1fr_1fr_1fr_1fr]'>
                  <td style={{ padding: '15px 0' }} className='text-left'>
                    <label className="container">
                      <input onChange={selectAllProduct} checked={selectedProductIds.length === allProduct.length && allProduct.length > 0} defaultValue="wedding-gift" className="peer cursor-pointer hidden after:opacity-100" type="checkbox" />
                      <span className="inline-block w-5 h-5 border-2 relative cursor-pointer after:content-[''] after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[10px] after:h-[10px] after:bg-[#333] after:rounded-[2px] after:opacity-0 peer-checked:after:opacity-100" />
                    </label>
                  </td>
                  <td>Product</td>
                  <td>Inventory</td>
                  <td>Color</td>
                  <td>Price</td>
                  <td>Discounted Price</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className='productTbody w-full'>
                {allProduct ? (
                  allProduct.map((product, index) => (
                    <tr className='border-b-1 border-[#D7DBEC] w-full grid grid-cols-[0.4fr_3fr_1fr_1fr_1fr_1fr_1fr]' key={product._id}>
                      <td>
                        <label>
                        <input
                          type="checkbox"
                          className="peer cursor-pointer hidden after:opacity-100"
                          checked={selectedProductIds.includes(product._id)}
                          onChange={(e) => {
                            const { checked } = e.target;
                            if (checked) {
                              setSelectedProductIds(prev => [...prev, product._id]);
                            } else {
                              setSelectedProductIds(prev => prev.filter(id => id !== product._id));
                            }
                          }}
                        />
                        <span className="inline-block w-5 h-5 border-2 relative cursor-pointer after:content-[''] after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[10px] after:h-[10px] after:bg-[#333] after:rounded-[2px] after:opacity-0 peer-checked:after:opacity-100" />
                        </label>
                      </td>
                      <td className='flex items-center w-10/12 gap-2'>
                        <div className='w-[48px] h-[48px] rounded-[4px] bg-[#979797]'><img src={product.image?.[0]} className='w-[100%] h-[100%] rounded-[4px] object-fit-cover' alt="product-img" /></div>
                        <div>
                          <h1 className='text-[14px] font-bold text-[#131523]'>{product?.name}</h1>
                          <p className='text-[#5A607F] text-[14px]'>{Array.isArray(product.category) ? product.category[0]?.name : product.category?.name}</p>
                        </div>
                      </td>
                      <td>{product?.inventory} in stock</td>
                      <td>{product?.color || '-'}</td>
                      <td>₦{product?.price.toLocaleString()}</td>
                      <td>₦{product?.discountprice?.toLocaleString()}</td>
                      <td className='dAndE text-[#1E5EFF] flex gap-2'>
                        <MdOpenInNew size={24} onClick={() => handleEdit(product)} className='cursor-pointer'/>
                        <FaRegTrashCan onClick={() => deleteProduct(product._id)} className='cursor-pointer' size={24} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="w-2/4 space-y-4 bg-white shadow-lg flex flex-col gap-[1em]" style={{ padding: '40px', borderRadius: '4px' }}>
            <DialogTitle className="font-bold text-[#131523] text-[16px]">Edit Product</DialogTitle>
            <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
              <input
                name='name'
                type='text'
                placeholder='Product Name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='border rounded'
                style={{padding: '8px'}}
                />
              {formik.touched.name && formik.errors.name && <small className="text-red-500">{formik.errors.name}</small>}
              <textarea
                name='description'
                placeholder='Description'
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='border rounded resize-none'
                style={{padding: '8px'}}
                />
              {formik.touched.description && formik.errors.description && <small className="text-red-500">{formik.errors.description}</small>}
              <input
                name='price'
                type='number'
                placeholder='Price'
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='border rounded'
                style={{padding: '8px'}}
              />
              {formik.touched.price && formik.errors.price && <small className="text-red-500">{formik.errors.price}</small>}
              <div className='flex flex-col gap-2'>
                <p className='font-semibold'>Categories</p>
                {allCategory.map((option) => (
                  <label key={option._id} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      value={option._id}
                      className=''
                      onChange={handleCheckboxChange}
                      checked={selected.includes(option._id)}
                    />
                    {option.name}
                  </label>
                ))}
                {formik.touched.category && formik.errors.category && <small className="text-red-500">{formik.errors.category}</small>}
              </div>
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded mt-2'>Save</button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="w-2/4 space-y-4 bg-white rounded-[4px] shadow-lg flex flex-col gap-[1em]" style={{ padding: '40px', borderRadius: '4px' }}>
            <DialogTitle className="font-bold text-[#131523] text-[16px]">Delete Items</DialogTitle>
            <div className='w-full flex flex-col gap-4'>
              <p>Are you sure you want to delete {selectedProductIds.length} selected items?</p>
              <div className='w-full justify-items-end'>
                <div className='flex gap-4 items-center'>
                  <button onClick={() => setDeleteOpen(false)} className='text-[16px] text-[#F0142F] cursor-pointer'>Cancel</button>
                  <button style={{padding: '10px 25px'}} onClick={deleteAllProduct} className='text-[16px] active:bg-[#f72b43] text-white cursor-pointer rounded-[4px] bg-[#F0142F]'>Delete</button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default ProductPage;
