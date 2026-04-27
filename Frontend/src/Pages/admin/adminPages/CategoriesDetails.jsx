const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useMemo } from 'react'
import { useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CategoryContext } from '../../../CategoryContext'
import { MdKeyboardBackspace } from "react-icons/md";
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi'
import { FaRegTrashCan } from "react-icons/fa6"
import { MdOpenInNew } from "react-icons/md";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoriesDetails = () => {
  const { name } = useParams();
  const { allCategory } = useContext(CategoryContext);
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [existingSubName, setExistingSubName] = useState([]);
  const [singleCategoryProducts, setSingleCategoryProducts] = useState([]);

  const stateCategory = location.state?.eachCategory;
  const [isOpen, setIsOpen] = useState(false)

  const singleCategory = stateCategory || allCategory?.find(cat =>
    decodeURIComponent(cat.name.toLowerCase()) === decodeURIComponent(name.toLowerCase())
  );

  useEffect(() => {
    if (singleCategory) {
      setSingleCategoryProducts(singleCategory.products || []);
    }

    if (allCategory) {
      const subNames = singleCategory?.subcategories
        ?.map(sub => sub.name.toLowerCase()) || [];

      setExistingSubName(subNames);
    }
  }, [allCategory, singleCategory]);

  const goBack = () => {
    window.history.back();
  };

  if (!singleCategory) {
    return <p>Loading category details...</p>;
  }
  const validationSchema = useMemo(() => Yup.object({
    subCategoryName: selectedCategory
      ? Yup.string().trim()
      : Yup.string()
          .trim()
          .required('Subcategory name is required')
          .test('unique', 'Subcategory already exists', function (value) {
            if (!value) return true;
            return !existingSubName.includes(value.toLowerCase());
          })
  }), [existingSubName, selectedCategory]);

  // Set up formik
  const formik = useFormik({
    initialValues: {
      subCategoryName: '',
    },
    onSubmit: (values) => {
      const trimmedName = values.subCategoryName.trim();

      if (existingSubName.includes(trimmedName.toLowerCase())) {
        formik.setFieldError('subCategoryName', 'Subcategory already exists');
        return;
      }

  axios.put(`${API_URL}/${ADMIN_ROUTE}/categories/${singleCategory._id}`, {
        name: trimmedName
      })
        .then((res) => {
          console.log(res);
          if(res.status){
            toast.success('Sub-category added successfully')
            const updatedCategory = res.data;
            setIsOpen(false);
            formik.resetForm();
            setExistingSubName(
              updatedCategory.subcategories.map(sub => sub.name.toLowerCase())
            );
            singleCategory.subcategories = updatedCategory.subcategories;
          }
        })
        .catch((err) => {
          if (err.response?.data?.status === false) {
            formik.setFieldError('subCategoryName', err.response.data.message || 'Failed to add subcategory');
          }
        });
    },
    enableReinitialize: true,
  });


  return (
    <div className='w-full h-full flex flex-col gap-[1em]'>
      <div className='w-full flex flex-col gap-0'>
        <div onClick={goBack} className='text-[#5A607F] cursor-pointer flex gap-2 items-center'>
          <MdKeyboardBackspace size={10} />
          <p>Back</p>
        </div>
        <div className='w-full flex items-center justify-between'>
          <div>
            <h1 className='text-black font-bold text-[24px]'>{singleCategory.name}</h1>
          </div>
          <div className='flex gap-4'>
            <div style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'>
              <span>Export</span>
            </div>
            <div onClick={() => {setIsOpen(true); setSelectedCategory(null); formik.resetForm()}} style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] bg-[#1E5EFF] gap-2 text-white'>
              <span>Add Sub-Category</span>
            </div>
          </div>
        </div>
      </div>

      {/* for category product */}
      <div className='w-full flex flex-col gap-4'>
        <div style={{padding: '20px'}} className='w-full bg-white rounded-[6px] flex flex-col gap-4'>
          {/* for top action btn */}
          <div>
            {/* search, filter and action btn */}
            <div className='w-full grid grid-cols-[4fr_1.5fr] items-center'>
              {/* for filter and search bar */}
              <div className='w-full flex gap-4'>
                {/* for filter */}
                <div className='w-2/4 flex flex-col items-start justify-center border-1 border-[#D9E1EC] rounded-[4px]'>
                  <select className='w-full' name="filter" id="filter">
                    <option value="">All Subcategories</option>
                    {singleCategory.subcategories?.map((sub, idx) => (
                      <option key={idx} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>

                </div>
                {/* for search bar */}
                <div style={{padding: '0 20px'}} className='flex w-full items-center gap-3 border-1 border-[#D9E1EC] rounded-[4px]'>
                  <FiSearch className='text-[#979797]' size={24} />
                  <input
                    style={{padding: '10px 0'}}
                    type="text"
                    className='border-0 focus:outline-0'
                    placeholder='Search'
                  />
                </div>
              </div>
              {/* for delete */}
              <div className='justify-self-end'>
                <div className='w-[40px] h-[40px] cursor-pointer hover:text-[#304169] flex flex-col justify-center items-center text-[#1E5EFF] rounded-[4px] shadow-sm'>
                  <FaRegTrashCan size={24}/>
                </div>
              </div>
            </div>
          </div>

          {/* for product details */}
          <div className='w-[100%]'>
            <table className="w-full">
              <thead className='w-full'>
                <tr className='font-bold border-b-1 border-[#D7DBEC]'>
                  <td style={{padding: '15px 0'}} className='text-left'>S/N</td>
                  <td>Product</td>
                  <td>Inventory</td>
                  <td>Color</td>
                  <td>Price</td>
                  <td>Rating</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className='productTbody w-full'>
                {singleCategoryProducts ? (
                  singleCategoryProducts
                    .map((eachProduct, index) => (
                      <tr className='border-b-1 border-[#D7DBEC]' key={eachProduct._id}>
                        <td>{index + 1}</td>
                        <td>{`${eachProduct?.name || 'N/A'}`}</td>
                        <td></td>
                        <td></td>
                        <td>{eachProduct?.price || 'N/A'}</td>
                        <td>ello</td>
                        <td className='dAndE opacity-0 flex gap-2'>
                          <MdOpenInNew size={24} />
                          <FaRegTrashCan size={24} />
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
      

      {/* for sub category section */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0" />
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel transition className="w-2/4 space-y-4 bg-white shadow-lg flex flex-col gap-[1em]" style={{padding: '40px', borderRadius: '4px'}}>
              <DialogTitle className="font-bold text-[#131523] text-[16px">Category Info</DialogTitle>
              <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-3' action="">
                <div className='w-full flex flex-col gap-1'>
                  <label htmlFor="subCategoryName">Sub-Category Name</label>
                  <input name='subCategoryName' onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" style={{padding: '10px'}} placeholder='Iphone' className='border-1 border-[#D9E1EC] rounded-[4px] focus:outline-0'/>
                  {formik.touched.subCategoryName && formik.errors.subCategoryName && (
                    <small className="text-red-500">{formik.errors.subCategoryName}</small>
                  )}
                </div>
                <div className="flex gap-4">
                  <button style={{ padding: '10px 20px' }} type='button' className='cursor-pointer flex items-center rounded-[4px] shadow-lg bg-white gap-2 text-[#1E5EFF]' onClick={() => setIsOpen(false)}>Close</button>
                  <button style={{ padding: '10px 20px' }} type='submit' className='cursor-pointer flex items-center rounded-[4px] text-white gap-2 bg-[#1E5EFF]'>Save</button>
                </div>
              </form>
              {/* Subcategories display */}
              {singleCategory.subcategories && singleCategory.subcategories.length > 0 && (
                <div className="w-full bg-white p-4 rounded-[6px]">
                  <h2 className="text-[18px] font-bold mb-2">Subcategories</h2>
                  <ul className="list-disc pl-6">
                    {singleCategory.subcategories.map((sub, index) => (
                      <li key={index} className="text-[14px]">{sub.name}</li>
                    ))}
                  </ul>
                </div>
              )}

            </DialogPanel>
          </div>
      </Dialog>
    </div>
  );
};

export default CategoriesDetails;
