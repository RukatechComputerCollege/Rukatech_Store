import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const ResetPassword = () => {
	const [isLogging, setIsLogging] = useState(false);
	const API_URL = import.meta.env.VITE_API_URL
  const [pwdType, setPwdType] = useState("password")
  const [pwdType2, setPwdType2] = useState("password")
  const { token } = useParams()
	const formik = useFormik({
			initialValues: {
				password: '',
        confirmPassword: '',
			},
			onSubmit: (values) => {
				setIsLogging(true);
				console.log(values);
				axios.post(`${API_URL}/user/account/reset-password/${token}`, values)
				.then((res) => {
          console.log(res);
          
					if(res.status){
						setIsLogging(false)
						toast.success('Password reset successful')
            setTimeout(() => {
              window.location.href='/account/login'
            }, 3000);
					}
				})
				.catch((err) => {
          console.log(err);
          if(err.response.status===400){
            toast.error('Reset link has expired')
            setIsLogging(false)
          }
				})
				.finally(() =>{
					setIsLogging(false)
				})
			},
			validationSchema: yup.object().shape({
				password: yup.string().required('This field is required').min(6, 'password must be at least 6 characters long'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required('Please confirm your password'),
      })
		});
  return (
    <div className='w-full shadow-md flex flex-col items-center justify-center' style={{padding: '40px'}}>
      <div className='w-full md:w-2/4 lg:w-1/4 flex flex-col gap-2 rounded-2 shadow-md' style={{padding: '20px'}}>
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center bg-white'>
					<div>
						<h1 className='text-[20px] text-[#191C1F] font-semibold text-center'>Reset Password</h1>
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
                    {/* for password 1 */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="password" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Password</span></label>
                      <div className='w-full border-1 border-[#D1D1D1] relative'>
                        <input type={pwdType} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='password' className='w-full' style={{padding: '10px'}}/>
                        <div className='absolute top-3 right-2 text-[20px] text-[#191C1F] cursor-pointer'>
                          {pwdType=='password' ? 
                            <FaRegEyeSlash onClick={()=>setPwdType('text')}/>
                            :
                            <FaRegEye onClick={()=>setPwdType('password')}/>
                          }
                        </div>
                      </div>
                      <small className='text-[red]'>{formik.touched.password && formik.errors.password}</small>
                    </div>

                    {/* for confirm password */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="confirmPassword" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Confirm Password</span></label>
                      <div className='w-full border-1 border-[#D1D1D1] relative'>
                        <input type={pwdType2} name='confirmPassword' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='password' className='w-full' style={{padding: '10px'}}/>
                        <div className='absolute top-3 right-2 text-[20px] text-[#191C1F] cursor-pointer'>
                          {pwdType2=='password' ? 
                            <FaRegEyeSlash onClick={()=>setPwdType2('text')}/>
                            :
                            <FaRegEye onClick={()=>setPwdType2('password')}/>
                          }
                        </div>
                      </div>
                      <small className='text-[red]'>{formik.touched.confirmPassword && formik.errors.confirmPassword}</small>
                    </div>
                    {/* for registration action */}
                    <div style={{ paddingBottom: '10px' }} className='w-full'>
											<div className='text-right flex flex-col'>
													<button style={{ padding: '10px 0px' }} className={`bg-[#FA8232] rounded-2 cursor-pointer text-white ${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} disabled={!formik.isValid || !formik.dirty} type='submit'>{isLogging ? 'PROCESSING...' : 'RESET PASSWORD'}</button>
											</div>
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

export default ResetPassword