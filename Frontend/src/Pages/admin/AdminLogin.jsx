const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { ButtonProvider } from '../../buttonContext'
import Button from '../../components/Button'
import * as yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [isLogging, setIsLogging] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) =>{
      setIsLogging(true)
  const url = `${API_URL}/${ADMIN_ROUTE}/login`
      axios.post(url, values)
      .then((res) =>{
        setIsLogging(false)
        console.log(res);
        if(res.data.status){
          localStorage.adminToken = res.data.token
          toast.success('Admin has Successfully Logged In!');
          setTimeout(() => {
            window.location.href= `/${ADMIN_ROUTE}/dashboard`
          }, 3000);
        }
      }).catch((err) =>{
        setIsLogging(false)
        console.log(err);
        if (err.response && err.response.status === 401) {
          toast.error('Invalid username or password');
        } else if (err.response && err.response.status === 404) {
          toast.error('Admin not found');
        } else if(err.message == "Network Error"){
          toast.error('Network Error! pls try again');
        } else if(err.status===403){
          toast.error('Access Forbidden!')
        }
      })
    },
    validationSchema: yup.object().shape({
      username: yup.string().required('This field is required'),
      password: yup.string().required('Password is required').min(5, 'Password must be at leat 5 characters long')
    })    
  })

  return (
    <>
      <div className='w-full h-[100vh] bg-[#F5F6FA] flex flex-col justify-center items-center'>
        <div style={{padding: '5%'}} className='bg-white w-11/12 md:w-2/4'>
          <div className='w-full flex flex-col gap-[1em]'>
            {/* for sign in content */}
            <div className='text-center w-full flex flex-col gap-1' style={{marginBottom: '30px'}}>
              <h1 className='text-3xl font-bold text-[#131523]'>Sign in</h1>
              <p>Log in as an admin</p>
            </div>
            {/* admin input field */}
            <form onSubmit={formik.handleSubmit} action="">
              <div className='flex flex-col gap-3 w-full'>
                {/* for username input */}
                <div className='w-full flex flex-col gap-2'>
                  <label className='text-[#5A607F]' htmlFor="username">Username</label>
                  <input name='username' onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" placeholder='Enter your username' className='w-full border-1 border-[#D1D1D1] rounded-[4px]' style={{padding: '15px'}}/>
                  <p></p>
                </div>
                {/* for password input */}
                <div className='w-full flex flex-col gap-2'>
                  <label className='text-[#5A607F]' htmlFor="password">Password</label>
                  <input name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" placeholder='password' className='w-full border-1 border-[#D1D1D1] rounded-[4px]' style={{padding: '15px'}}/>
                </div>
              <ButtonProvider initialValue={isLogging ? 'login is in progress...' : 'Log in'}>
                <Button disabled={!formik.isValid || !formik.dirty || isLogging} type='submit' className={`${(!formik.isValid || !formik.dirty || isLogging) ? 'cursor-not-allowed pointer-events-none opacity-75' : ''} rounded-[4px]`}/>
              </ButtonProvider>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default AdminLogin