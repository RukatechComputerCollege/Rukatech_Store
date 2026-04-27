import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import { ButtonProvider } from '../../../buttonContext';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

const AddNewCustomer = () => {

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;

  let formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: '',
      email: '',
      password: '',
      phonenumber1: '',
      phonenumber2: '',
      company: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    onSubmit: (values) =>{
      const url = `${API_URL}/user/register`
      axios.post(url, values)
      .then((res) =>{
        console.log(res.data.message);
        toast.success('New Customer has been added successfully');
        setTimeout(() => {
          window.history.back();
        }, 3000);
      }).catch((err) =>{
        const dataErr = err.response.data
        if(dataErr.error === 'Duplicate field: email already exists'){
          console.log('The email is already registered');
          toast.error('This email is already registered!');
        }
        
      })
    },
    validationSchema: yup.object().shape({
      firstname: yup.string().required('This field is required'),
      lastname: yup.string().required('This field is required'),
      email: yup.string().required('This field is required').email('This is not a valid email address'),
      password: yup.string().required('This field is required').min(6, 'password must be at least 6 characters long'),
      phonenumber1: yup.string().required('This field is required').matches(/^\d{9,}$/, "number must be at leat 9 digits"),
      phonenumber2: yup.string().matches(/^\d{9,}$/, "number must be at leat 9 digits").nullable(),
      company: yup.string(),
      address: yup.string(),
      city: yup.string(),
      state: yup.string(),
      country: yup.string(),
    })
  })
  const goBack = () =>{
    window.history.back()
  }
  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex flex-col gap-4'>
        <div className='w-full flex justify-between items-center'>
          {/* for back and add customer text */}
          <div className='flex flex-col'>
            <div onClick={goBack} className='text-[#5A607F] cursor-pointer flex gap-2 items-center'>
              <MdKeyboardBackspace size={10} />
              <p>Back</p>
            </div>
            <h1 className='font-bold text-black text-[24px]'>Add Customer</h1>
          </div>
          {/* for add customer action button */}
          <div className='flex gap-4'>
            <div onClick={goBack} style={{padding: '10px 30px'}} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'><span>Cancel </span></div>
            <div style={{padding: '10px 30px'}} className='cursor-pointer flex items-center rounded-[4px] bg-[#1E5EFF] gap-2 text-white'><span>Save </span></div>
          </div>
        </div>
        
        {/* for add customer form */}
        <div style={{padding: '2%'}} className='w-full flex flex-col bg-white'>
          <div className='flex flex-col w-full  gap-[2em]'>
            <div className='w-full flex items-center justify-between'>
              <div>
                <h1 className='text-black font-bold text-[16px]'>Customer Information</h1>
                <p className='text-[#5A607F]'>Most important information about the customer</p>
              </div>
            </div>
            {/* for the form */}
            <div className='w-full'>
              <form onSubmit={formik.handleSubmit} action="">
                <div className='w-full flex flex-col gap-5'>
                  {/* for personal info */}
                  <div style={{paddingBottom: '30px'}} className='w-full grid border-b border-dashed border-black border-opacity-10 md:grid-cols-2 gap-y-[1em] gap-x-[2em] grid-rows-[auto]'>
                    {/* for firstname */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="firstname" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>First name</span><BsFillQuestionOctagonFill className={formik.touched.firstname && formik.errors.firstname ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="text" name='firstname' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='John' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.firstname && formik.errors.firstname}</p>
                    </div>

                    {/* for lastname */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="lastname" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Last name</span><BsFillQuestionOctagonFill className={formik.touched.lastname && formik.errors.lastname ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="text" name='lastname' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Doe' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.lastname && formik.errors.lastname}</p>
                    </div>

                    {/* for company name */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="company" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span> <span>Company <small className='text-[#333333]'>(optional)</small></span></span><BsFillQuestionOctagonFill className={formik.touched.company && formik.errors.company ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="text" name='company' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='John Ltd' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.company && formik.errors.company}</p>
                    </div>

                    {/* for email */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="email" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Email</span><BsFillQuestionOctagonFill className={formik.touched.email && formik.errors.email ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="email" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='example@email.com' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.email && formik.errors.email}</p>
                    </div>

                    {/* for phone number 1 */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="phonenumber1" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Phone number</span><BsFillQuestionOctagonFill className={formik.touched.phonenumber1 && formik.errors.phonenumber1 ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="tel" name='phonenumber1' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='+234909984723' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.phonenumber1 && formik.errors.phonenumber1}</p>
                    </div>

                    {/* for phone number 2 */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="phonenumber2" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span> <span>Phone number 2 <small className='text-[#333333]'>(optional)</small></span></span><BsFillQuestionOctagonFill className={formik.touched.phonenumber2 && formik.errors.phonenumber2 ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="tel" name='phonenumber2' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='+234909984723' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.phonenumber2 && formik.errors.phonenumber2}</p>
                    </div>

                    {/* for password 1 */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="password" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Password</span><BsFillQuestionOctagonFill className={formik.touched.password && formik.errors.password ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="password" name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='passord' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                      <p className='text-[red]'>{formik.touched.password && formik.errors.password}</p>
                    </div>
                  </div>
                  {/* for contact address */}
                  <div style={{paddingBottom: '30px'}} className='w-full grid border-b border-dashed border-black border-opacity-10 md:grid-cols-2 gap-y-[1em] gap-x-[2em] grid-rows-[auto]'>
                    {/* for address */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="address" className='w-full flex items-center justify-between text-[12px] text-[#333333]'>Address</label>
                      <input type="text" name='address' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='address' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                    </div>

                    {/* for city */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="city" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>City</span></label>
                      <input type="text" name='city' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='city' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                    </div>
                    {/* for state */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="state" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>State</span></label>
                      <input type="text" name='state' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='state' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                    </div>
                    {/* for country */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="country" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Country</span></label>
                      <input type="text" name='country' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='country' className='w-full border-1 border-[#D1D1D1]' style={{padding: '5px'}}/>
                    </div>
                  </div>

                  {/* for registration action */}
                  <div style={{paddingBottom: '10px'}} className='w-full flex justify-end'>
                    <div className='text-right flex flex-col items-end'>
                      <ButtonProvider initialValue='Save'>
                        <Button className={`${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} disabled={!formik.isValid || !formik.dirty} type='submit' />
                      </ButtonProvider>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddNewCustomer
