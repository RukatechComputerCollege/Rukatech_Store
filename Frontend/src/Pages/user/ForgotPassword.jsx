import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
	const [isLogging, setIsLogging] = useState(false);
	const API_URL = import.meta.env.VITE_API_URL
	const formik = useFormik({
			initialValues: {
				email: '',
			},
			onSubmit: (values) => {
				setIsLogging(true);
				axios.post(`${API_URL}/user/account/forgot-password`, values)
				.then((res) => {
					if(res.status){
						toast.success('Password reset link has been sent to your email')
						setIsLogging(false)
					}
				})
				.catch((err) => {
					if(err.status===404){
						toast.error('Email is not registered')
						setIsLogging(false)
					}
				})
				.finally(() =>{
					setIsLogging(false)
				})
			},
			validationSchema: yup.object().shape({
				email: yup.string().required('This field is required').email('This is not a valid email address'),
			})
		});
  return (
    <div className='w-full shadow-md flex flex-col items-center justify-center' style={{padding: '40px'}}>
      <div className='w-full md:w-2/4 lg:w-1/4 flex flex-col gap-2 rounded-2 shadow-md' style={{padding: '20px'}}>
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center bg-white'>
					<div>
						<h1 className='text-[20px] text-[#191C1F] font-semibold text-center'>Forgot Password</h1>
						<p className='text-[12px] text-[#5F6C72] text-center'>
							Enter the email address associated with your Fastcart account.
						</p>
					</div>
          <div className='flex flex-col w-full h-full items-end gap-[2em]'>
            {/* for the form */}
            <div className='w-full h-full items-center justify-between'>
              <form onSubmit={formik.handleSubmit} action="">
                <div className='w-full flex flex-col gap-5'>
                    {/* for personal info */}
                  <div className='w-full grid border-b border-dashed border-black border-opacity-10 md:grid-cols-1 grid-rows-[auto] gap-2'>
                    {/* for email */}
                    <div className='flex flex-col gap-2'>
                      <small className='w-full flex items-center justify-between'>Email Address</small>
                      <input type="email" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='example@email.com' className='w-full border-1 border-[#D1D1D1] outline-0' style={{ padding: '10px' }} />
                      <p className='text-[red]'>{formik.touched.email && formik.errors.email}</p>
                    </div>
										<div>
											<small className='text-[#5F6C72]'>Already have account? <a className='text-[#2DA5F3]' href="/account/login">Sign In</a> </small>
											<small className='text-[#5F6C72]'>Don’t have account? <a className='text-[#2DA5F3]' href="/account/register">Sign Up</a> </small>
										</div>
                    {/* for registration action */}
                    <div style={{ paddingBottom: '10px' }} className='w-full'>
											<div className='text-right flex flex-col'>
													<button style={{ padding: '10px 0px' }} className={`bg-[#FA8232] rounded-2 cursor-pointer text-white ${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} disabled={!formik.isValid || !formik.dirty} type='submit'>{isLogging ? 'CODE PROCESSING...' : 'SEND CODE'}</button>
											</div>
										</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
					<small className='text-[#475156]'>You may contact <a className='text-[#FA8232]' href="/customer-support">Customer Service</a>  for help restoring access to your account.</small>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ForgotPassword