import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const Register = () => {

  const navigate = useNavigate()
  const [isLogging, setisLogging] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;
  const [pwdType, setPwdType] = useState("password")
  const [pwdType2, setPwdType2] = useState("password")

  

  let formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false
    },
    onSubmit: (values) =>{
      setisLogging(true)
      const url = `${API_URL}/user/register`
      axios.post(url, values)
      .then((res) =>{
        setisLogging(false)
        console.log(res);
        toast.success('User Account has Successfully Registered!');
        setTimeout(() => {
          navigate('/account/login')
        }, 3000);
      }).catch((err) =>{
        setisLogging(false)
        console.log(err.response.data.valid);
        if(err.response.data.valid===false){
          toast.error('The email you provided is not available')
        }
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
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required('Please confirm your password'),
      agree: yup.boolean('Must be accepted').oneOf([true], "you must accept the terms and conditions")
    })
    
  })
  return (
    <div className='registerPage w-full'>
      <div className='w-full'>
        <div className='w-full h-full flex flex-col justify-center items-center bg-white'>
          <div className='flex flex-col w-full h-full items-end gap-[2em]'>
            {/* for the form */}
            <div className='w-full'>
              <form onSubmit={formik.handleSubmit} action="">
                <div className='w-full flex flex-col'>
                  {/* for personal info */}
                  <div className='w-full'>
                    {/* for firstname */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="firstname" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>First name</span><BsFillQuestionOctagonFill className={formik.touched.firstname && formik.errors.firstname ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="text" name='firstname' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='John' className='w-full border-1 border-[#D1D1D1]' style={{padding: '10px'}}/>
                      <small className='text-[red]'>{formik.touched.firstname && formik.errors.firstname}</small>
                    </div>
                    {/* for lastname */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="lastname" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Last name</span><BsFillQuestionOctagonFill className={formik.touched.lastname && formik.errors.lastname ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="text" name='lastname' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Doe' className='w-full border-1 border-[#D1D1D1]' style={{padding: '10px'}}/>
                      <small className='text-[red]'>{formik.touched.lastname && formik.errors.lastname}</small>
                    </div>
                    {/* for email */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="email" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Email</span><BsFillQuestionOctagonFill className={formik.touched.email && formik.errors.email ? 'text-[red]' : 'text-zinc-400'} /></label>
                      <input type="email" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='example@email.com' className='w-full border-1 border-[#D1D1D1]' style={{padding: '10px'}}/>
                      <small className='text-[red]'>{formik.touched.email && formik.errors.email}</small>
                    </div>
                  </div>
                  {/* for password */}
                  <div className='w-full'>
                    {/* for password 1 */}
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="password" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Password</span><BsFillQuestionOctagonFill className={formik.touched.password && formik.errors.password ? 'text-[red]' : 'text-zinc-400'} /></label>
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
                      <label htmlFor="confirmPassword" className='w-full flex items-center justify-between text-[12px] text-[#333333]'><span>Confirm Password</span><BsFillQuestionOctagonFill className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'text-[red]' : 'text-zinc-400'} /></label>
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
                  </div>

                  {/* for registration action */}
                  <div style={{paddingBottom: '10px'}} className='w-full'>
                    {/* for checkbox */}
                    <div>
                      <div className='flex gap-2 items-start w-full'>
                        <input type='checkbox' name="agree" id='agree' onChange={formik.handleChange} onBlur={formik.handleBlur} checked={formik.values.agree} className='border-1 border-[#D1D1D1]'/>
                        <label htmlFor="agree" className='text-[12px]'><span>I agree to Fastcart <span className='coloredTxt'>terms of conditions.</span>and <span className='coloredTxt'>Privacy Policy</span> </span></label>
                      </div>
                      {formik.touched.agree && formik.errors.agree && (
                        <small className="text-red-500 text-sm">{formik.errors.agree}</small>
                      )}
                    </div>
                    <div style={{paddingTop: '20px'}} className='w-full'>
                      <div className='flex flex-col'>
                          <button style={{ padding: '10px 0px' }} className={`bg-[#FA8232] rounded-[2px] cursor-pointer text-white ${(!formik.isValid || !formik.dirty) ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} disabled={!formik.isValid || !formik.dirty} type='submit'>{isLogging ? 'SIGNUP IS IN PROGRESS...' : 'SIGN UP'}</button>
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

export default Register