const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React from 'react'
import { FaPlus } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { CategoryContext } from '../../../CategoryContext'
import { useEffect, useContext, useState, useMemo} from 'react'
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
        console.log("editing:", values);
  axios.put(`${API_URL}/${ADMIN_ROUTE}/editCategory/${selectedCategory._id}`, {
          name: formik.values.name,
          description: formik.values.description,
          image: formik.values.image,
        })
        .then((res) =>{
          console.log(res);
          if(res.data.status){
            toast.success("Category Updated Successfully")
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          }
        })
        .catch((err) =>{
          console.log(err);
        })
      }else{
  let categoryURL = `${API_URL}/${ADMIN_ROUTE}/addCategory`
        axios.post(categoryURL, values)
        .then((res) =>{
          setIsOpen(false)
          window.location.reload()
        })
        .catch((err) =>{
          if(err.data.status ===false){
            console.log('Failed to Create Category');
          }
        })
      }
    },
  })

  useEffect(() => {
    if(allCategory){
      setallProductCategory(allCategory);
      const names = allCategory.map((c) => c.name.toLowerCase());
      setExistingCategory(names);
      console.log(existingCategory);
    }
    setCategoryLength(allCategory.length)    
  }, [allCategory])
  
  const checkCategory = (eachCategory) =>{
  navigate(`/${ADMIN_ROUTE}/categories/${eachCategory.name}`, {state: {eachCategory}})
  }
  const trashCategory = (id) =>{
    
    if(window.confirm("Are you sure you want to delete this category?")){
  axios.delete(`${API_URL}/${ADMIN_ROUTE}/category/${id}`)
      .then((res) =>{
        console.log(res);
        if(res.data.status){
          toast.success("Category Deleted Successfully")
          window.location.reload()
        }
      })
      .catch((err) =>{
        console.log(err);
        
      })
    }
    console.log(id);
  }
  const editCategory = (eachCategory)=>{
    setSelectedCategory(eachCategory)
    setIsOpen(true)
  }


return(
  <div className='w-full flex flex-col gap-5'>
    <div className='flex items-center justify-between w-full'>
      <div>
        <h1 className='text-[24px] font-bold text-[#131523]'>Category ({categoryLength})</h1>
      </div>
      <div>
        <div onClick={() => {setIsOpen(true); setSelectedCategory(null)}} style={{ padding: '10px 20px' }} className='cursor-pointer flex items-center rounded-[4px] text-white gap-2 bg-[#1E5EFF]'><FaPlus size={24} /><span>Add Category </span></div>
      </div>
    </div>

    {/* for category section */}
    <div className='w-full grid md:grid-cols-3 gap-x-[2em] gap-y-[1em]'>
      {allCategory ? 
        allProductCategory.map((eachCategory, index) => (
          <div onClick={() => checkCategory(eachCategory)} className='w-full h-[324px] bg-white rounded-[6px] flex flex-col gap-4' key={eachCategory._id}>
            <div className='w-full h-[240px] object-fit-cover rounded-t-[6px]'>
              <img src={eachCategory.image} className='w-full h-full object-fit-cover rounded-t-[6px]' alt="mens clothe" />
            </div>
            <div className='flex items-center justify-between' style={{padding: '0 20px'}}>
              <div> 
                <h1 className='text-[#131523] font-bold text-[16px]'>{eachCategory.name}</h1>
                <p>{eachCategory.products.length === 0 ? 'no items' : eachCategory.products.length === 1 ? `${eachCategory.products.length} item` : `${eachCategory.products.length} items`}</p>
              </div>
              <div className='flex gap-2'>
                <BiEditAlt onClick={(e) => {
                  e.stopPropagation();
                  editCategory(eachCategory);
                }} className='cursor-pointer text-[#979797]' size={18} />
                <FaRegTrashCan onClick={(e) =>{
                  e.stopPropagation();
                  trashCategory(eachCategory._id)}} className='cursor-pointer text-[#979797]' size={18} />
              </div>
            </div>
          </div>
        )

        ) : <p>Loading categories...</p>
      }
    </div>
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel transition className="w-2/4 space-y-4 bg-white shadow-lg flex flex-col gap-[1em]" style={{padding: '40px', borderRadius: '4px'}}>
            <DialogTitle className="font-bold text-[#131523] text-[16px">Category Info</DialogTitle>
            <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-3' action="">
              <div className='w-full flex flex-col gap-1'>
                <label htmlFor="name">Category Name</label>
                <input name='name' onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" style={{padding: '10px'}} placeholder='Women Clothes' className='border-1 border-[#D9E1EC] rounded-[4px] focus:outline-0'/>
                {formik.touched.name && formik.errors.name && (
                  <small className="text-red-500">{formik.errors.name}</small>
                )}

              </div>
              <div className='w-full flex flex-col gap-1'>
                <label htmlFor="description">Category Description</label>
                <input name='description' onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" style={{padding: '10px'}} placeholder='This is the Category for Women Clothes' className='border-1 border-[#D9E1EC] rounded-[4px] focus:outline-0'/>
              </div>
              <div className='w-full relative flex flex-col gap-1'>
                <label htmlFor="image">Image</label>
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
                    } catch (err) {
                      console.error('Cloudinary Upload Error:', err);
                      setUploading(false);
                      toast.error("Image upload failed");
                    }
                  }} style={{padding: '10px'}} className='border-1 border-[#A1A7C4] border-dashed h-[168px] flex flex-col items-center justify-center rounded-[4px]  focus:outline-0'
                />
                {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="w-32 absolute top-[50px] right-[20px] h-32 object-cover mt-2 rounded" />
                )}
              </div>
              <div className="flex gap-4">
                <button style={{ padding: '10px 20px' }} type='button' className='cursor-pointer flex items-center rounded-[4px] shadow-lg bg-white gap-2 text-[#1E5EFF]' onClick={() => setIsOpen(false)}>Close</button>
                <button style={{ padding: '10px 20px' }} type='submit' className='cursor-pointer flex items-center rounded-[4px] text-white gap-2 active:bg-[#4176fd] bg-[#1E5EFF]'>Save</button>
              </div>
            </form>
          </DialogPanel>
        </div>
    </Dialog>

    <ToastContainer />
  </div>
)
}

export default Categories