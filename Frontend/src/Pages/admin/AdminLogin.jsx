const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import * as yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { MdLock, MdPerson } from 'react-icons/md'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [isLogging, setIsLogging] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) => {
      setIsLogging(true)
      const url = `${API_URL}/${ADMIN_ROUTE}/login`
      axios.post(url, values)
        .then((res) => {
          setIsLogging(false)
          console.log(res);
          if (res.data.status) {
            localStorage.adminToken = res.data.token
            toast.success('Admin has Successfully Logged In!');
            setTimeout(() => {
              window.location.href = `/${ADMIN_ROUTE}/dashboard`
            }, 3000);
          }
        }).catch((err) => {
          setIsLogging(false)
          console.log(err);
          if (err.response && err.response.status === 401) {
            toast.error('Invalid username or password');
          } else if (err.response && err.response.status === 404) {
            toast.error('Admin not found');
          } else if (err.message == "Network Error") {
            toast.error('Network Error! pls try again');
          } else if (err.status === 403) {
            toast.error('Access Forbidden!')
          }
        })
    },
    validationSchema: yup.object().shape({
      username: yup.string().required('This field is required'),
      password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters long')
    })
  })

  return (
    <>
      <div className='w-full min-h-screen bg-white flex flex-col justify-center items-center p-4 overflow-hidden'>
        {/* Background decorative elements */}
        {/* <div className='absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4'></div> */}
        {/* <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4'></div> */}

        <div className='relative z-10 w-full max-w-md'>
          {/* Premium logo/header */}
          <div className='text-center mb-12'>
            <div className='inline-block mb-6'>
              <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl'>
                <MdLock className='text-[#0F766E] text-3xl' />
              </div>
            </div>
            <h1 className='text-4xl font-bold text-gray-900 mb-3'>Admin Portal</h1>
            <p className='text-gray-800 text-sm tracking-wide'>Rukatech Store Management</p>
          </div>

          {/* Main login card */}
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95'>
            {/* Premium gradient header in card */}
            <div className='h-2 bg-linear-to-r from-[#0F766E] via-[#14B8A6] to-[#06B6D4]'></div>

            <div className='p-8 md:p-10'>
              {/* Form title */}
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-[#111827] mb-2'>Welcome Back</h2>
                <p className='text-[#6B7280] text-sm'>Enter your credentials to access the admin dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className='space-y-6'>
                {/* Username field */}
                <div className='group'>
                  <label className='mb-3 block text-sm font-semibold text-[#111827]'>
                    <div className='flex items-center gap-2'>
                      <MdPerson className='text-[#0F766E]' />
                      Username
                    </div>
                  </label>
                  <input
                    name='username'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    placeholder='Enter your username'
                    value={formik.values.username}
                    className='w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all duration-200 group-hover:border-[#14B8A6]'
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className='mt-2 text-sm text-[#DC2626] flex items-center gap-1'>
                      <span>⚠</span> {formik.errors.username}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className='group'>
                  <label className='mb-3 block text-sm font-semibold text-[#111827]'>
                    <div className='flex items-center gap-2'>
                      <MdLock className='text-[#0F766E]' />
                      Password
                    </div>
                  </label>
                  <input
                    name='password'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="password"
                    placeholder='••••••••'
                    value={formik.values.password}
                    className='w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F8FAFF] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all duration-200 group-hover:border-[#14B8A6]'
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className='mt-2 text-sm text-[#DC2626] flex items-center gap-1'>
                      <span>⚠</span> {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type='submit'
                  disabled={!formik.isValid || !formik.dirty || isLogging}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    !formik.isValid || !formik.dirty || isLogging
                      ? 'bg-[#CBD5E1] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
                >
                  {isLogging ? (
                    <>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <MdLock />
                      Access Dashboard
                    </>
                  )}
                </button>
              </form>

              {/* Security note */}
              <div className='mt-8 p-4 bg-[#ECFDF5] rounded-xl border border-[#BBFBEE]'>
                <p className='text-xs text-[#065F46] flex items-start gap-2'>
                  <span className='mt-0.5'>🔒</span>
                  <span>Your login credentials are encrypted. This is a secure admin-only portal.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className='text-center text-white/70 text-xs mt-6'>
            © 2026 RukatechStore. All rights reserved.
          </p>
        </div>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default AdminLogin