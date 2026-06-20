const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useContext, useState, useMemo, useCallback } from 'react'
import { FaPlus } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { CategoryContext } from '../../../CategoryContext'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { FaRegTrashCan } from "react-icons/fa6"
import { BiEditAlt } from "react-icons/bi";
import { toast, ToastContainer } from 'react-toastify'

const Categories = () => {

  const { allCategory } = useContext(CategoryContext)
  const [allProductCategory, setallProductCategory] = useState([])
  const [existingCategory, setExistingCategory] = useState([])
  const [categoryLength, setCategoryLength] = useState(0)
  const navigate = useNavigate()
  let [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dimlar6iu/image/upload';
  const UPLOAD_PRESET = 'Fastcart';
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;


  const validationSchema = useMemo(() => Yup.object({
    name: selectedCategory ?
      Yup.string()
      .trim()
      :
      Yup.string()
        .trim()
        .required('Category name is required')
        .test('unique', 'Category already exists', function (value) {
          if (!value) return true;
          return !existingCategory.includes(value.toLowerCase());
        }),
    description: Yup.string(),
    image: Yup.mixed(),
  }), [existingCategory, selectedCategory]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedCategory ? selectedCategory.name : '',
      description: selectedCategory ? selectedCategory.description : '',
      image: selectedCategory ? selectedCategory.image : ''
    },
    validationSchema,
    onSubmit: (values) => {
      if(selectedCategory){
        axios.put(`${API_URL}/${ADMIN_ROUTE}/editCategory/${selectedCategory._id}`, {
          name: formik.values.name,
          description: formik.values.description,
          image: formik.values.image,
        })
        .then((res) =>{
          if(res.data.status){
            toast.success("Category Updated Successfully")
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          }
        })
        .catch((err) =>{
          console.error('Update error:', err);
          toast.error('Failed to update category');
        })
      }else{
        let categoryURL = `${API_URL}/${ADMIN_ROUTE}/addCategory`
        axios.post(categoryURL, values)
        .then((res) =>{
          setIsOpen(false)
          window.location.reload()
        })
        .catch((err) =>{
          console.error('Create error:', err);
          toast.error('Failed to create category');
        })
      }
    },
  })

  useEffect(() => {
    if(allCategory){
      setallProductCategory(allCategory);
      const names = allCategory.map((c) => c.name.toLowerCase());
      setExistingCategory(names);
    }
    setCategoryLength(allCategory.length)    
  }, [allCategory])
  
  const checkCategory = useCallback((eachCategory) => {
    navigate(`/${ADMIN_ROUTE}/categories/${eachCategory.name}`, {state: {eachCategory}})
  }, [navigate])

  const trashCategory = useCallback((id) => {
    if(window.confirm("Are you sure you want to delete this category?")){
      axios.delete(`${API_URL}/${ADMIN_ROUTE}/category/${id}`)
        .then((res) =>{
          if(res.data.status){
            toast.success("Category Deleted Successfully")
            window.location.reload()
          }
        })
        .catch((err) =>{
          console.error('Delete error:', err);
        })
    }
  }, [API_URL])

  const editCategory = useCallback((eachCategory) => {
    setSelectedCategory(eachCategory)
    setIsOpen(true)
  }, [])


return(
  <div className='w-full flex flex-col gap-4 sm:gap-6 md:gap-8'>
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4'>
      <div>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#131523]'>Categories ({categoryLength})</h1>
      </div>
      <button 
        onClick={() => {setIsOpen(true); setSelectedCategory(null)}}
        className='inline-flex items-center gap-2 rounded-lg px-4 py-2 sm:px-5 sm:py-3 cursor-pointer text-sm sm:text-base text-white bg-[#1E5EFF] hover:bg-[#1649D0] transition'
      >
        <FaPlus size={18} />
        <span>Add Category</span>
      </button>
    </div>

    {/* Category Grid */}
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
      {allCategory && allCategory.length > 0 ? 
        allProductCategory.map((eachCategory) => (
          <div 
            onClick={() => checkCategory(eachCategory)} 
            className='w-full bg-white rounded-lg sm:rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden'
            key={eachCategory._id}
          >
            <div className='w-full h-40 sm:h-48 md:h-56 overflow-hidden bg-[#F5F6FA]'>
              <img 
                src={eachCategory.image} 
                className='w-full h-full object-cover' 
                alt={eachCategory.name}
              />
            </div>
            <div className='flex items-start justify-between gap-3 px-4 sm:px-6 pb-4'>
              <div className='flex-1 min-w-0'> 
                <h2 className='text-[#131523] font-bold text-base sm:text-lg truncate'>{eachCategory.name}</h2>
                <p className='text-xs sm:text-sm text-[#5A607F]'>
                  {eachCategory.products.length === 0 
                    ? 'No items' 
                    : eachCategory.products.length === 1 
                      ? `${eachCategory.products.length} item` 
                      : `${eachCategory.products.length} items`
                  }
                </p>
              </div>
              <div className='flex gap-2 flex-shrink-0'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editCategory(eachCategory);
                  }} 
                  className='p-2 sm:p-2.5 rounded-lg hover:bg-[#F5F6FA] transition text-[#979797]'
                  title="Edit"
                >
                  <BiEditAlt size={18} />
                </button>
                <button
                  onClick={(e) =>{
                    e.stopPropagation();
                    trashCategory(eachCategory._id)
                  }} 
                  className='p-2 sm:p-2.5 rounded-lg hover:bg-[#FEE2E2] transition text-[#979797] hover:text-[#DC2626]'
                  title="Delete"
                >
                  <FaRegTrashCan size={18} />
                </button>
              </div>
            </div>
          </div>
        )
        ) : <p className='text-center text-sm sm:text-base text-[#5A607F]'>Loading categories...</p>
      }
    </div>

    {/* Modal Dialog */}
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel 
          transition 
          className="w-full max-w-2xl bg-white shadow-lg rounded-lg sm:rounded-2xl flex flex-col gap-6"
          style={{padding: '20px'}}
        >
          <DialogTitle className="font-bold text-[#131523] text-lg sm:text-xl">
            {selectedCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          
          <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4'>
            {/* Name Field */}
            <div className='w-full flex flex-col gap-2'>
              <label htmlFor="name" className='text-sm font-semibold text-[#131523]'>Category Name</label>
              <input 
                name='name' 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                type="text" 
                value={formik.values.name}
                placeholder='e.g., Women Clothes' 
                className='border border-[#D9E1EC] rounded-lg p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-[#1E5EFF] text-sm sm:text-base'
              />
              {formik.touched.name && formik.errors.name && (
                <small className="text-red-500 text-xs sm:text-sm">{formik.errors.name}</small>
              )}
            </div>

            {/* Description Field */}
            <div className='w-full flex flex-col gap-2'>
              <label htmlFor="description" className='text-sm font-semibold text-[#131523]'>Category Description</label>
              <textarea 
                name='description' 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.description}
                placeholder='Describe this category...' 
                rows="3"
                className='border border-[#D9E1EC] rounded-lg p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-[#1E5EFF] text-sm sm:text-base resize-none'
              />
            </div>

            {/* Image Upload Field */}
            <div className='w-full flex flex-col gap-2'>
              <label htmlFor="image" className='text-sm font-semibold text-[#131523]'>Category Image</label>
              <label className='border-2 border-dashed border-[#A1A7C4] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1E5EFF] transition'>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.currentTarget.files[0];
                    if (!file) return;
                    setUploading(true);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', UPLOAD_PRESET);

                    try {
                      const res = await axios.post(CLOUDINARY_URL, formData);
                      const imageUrl = res.data.secure_url;
                      formik.setFieldValue('image', imageUrl);
                      setPreviewImage(imageUrl);
                      setUploading(false);
                      toast.success('Image uploaded successfully');
                    } catch (err) {
                      console.error('Cloudinary Upload Error:', err);
                      setUploading(false);
                      toast.error("Image upload failed");
                    }
                  }}
                  className='hidden'
                />
                <div className='text-center'>
                  <p className='text-sm sm:text-base font-medium text-[#131523]'>Upload image</p>
                  <p className='text-xs sm:text-sm text-[#5A607F]'>or drag and drop</p>
                </div>
              </label>
              {uploading && <p className="text-xs sm:text-sm text-gray-500">Uploading image...</p>}
              {previewImage && (
                <div className='flex items-center gap-4'>
                  <img src={previewImage} alt="Preview" className="w-20 sm:w-32 h-20 sm:h-32 object-cover rounded-lg" />
                  <p className='text-xs sm:text-sm text-[#5A607F]'>Preview</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                type='button' 
                className='flex-1 sm:flex-none rounded-lg px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-sm sm:text-base shadow-sm bg-white text-[#1E5EFF] border border-[#D9E1EC] hover:bg-[#F8FAFF] transition'
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
              <button 
                type='submit' 
                className='flex-1 sm:flex-none rounded-lg px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-sm sm:text-base text-white bg-[#1E5EFF] hover:bg-[#1649D0] transition'
              >
                {selectedCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>

    <ToastContainer />
  </div>
)
}

export default React.memo(Categories)