const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../admincomponents/AdminContext';
import { MdKeyboardBackspace } from "react-icons/md";
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

const CustomerDetails = () => {
  const { id } = useParams();
  const { customers } = useContext(AdminContext);
  const navigate = useNavigate()

  const customer = customers?.find(user => user._id === id);

  if (!customer) {
    return <p>Customer not found</p>;
  }
  const goBack = () =>{
    window.history.back()
  }
  const API_URL = import.meta.env.VITE_API_URL;
  
  const deleteUser = () =>{
  let deleteURL = `${API_URL}/${ADMIN_ROUTE}/deleteCustomers`
    axios.post(deleteURL, customer)
    .then((res) =>{
      console.log(res);
      if(res.data.status){
        toast.success('Customer Information has been Deleted Successfully')
        setTimeout(() => {
          window.history.back()
        }, 3000);
      }
    }).catch((err) =>{
      console.log(err);
    })
  }

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex flex-col gap-4'>
        <div onClick={goBack} className='text-[#5A607F] cursor-pointer flex gap-2 items-center'>
          <MdKeyboardBackspace size={10} />
          <p>Back</p>
        </div>
        <div className='w-full flex items-center justify-between'>
          <div>
            <h1 className='text-black font-bold text-[24px]'>Customer Information</h1>
            <p>Most important information about the customer</p>
          </div>
          <div className='flex gap-4'>
            <div style={{padding: '15px 30px'}} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'><span>Export </span></div>
            <div onClick={deleteUser} style={{padding: '15px 30px'}} className='cursor-pointer flex items-center rounded-[4px] bg-[#1E5EFF] gap-2 text-white'><span>Delete Customer </span></div>
          </div>
        </div>

        {/* for customer information */}
        <div style={{padding: '20px'}} className='bg-white rounded-[6px] w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex flex-col gap-2 w-full'>
              {/* for personal information */}
              <div style={{paddingBottom: '20px'}} className='flex flex-col gap-4 border-b-1 border-[#D9E1EC]'>
                <h1>Personal Information</h1>
                <div className='grid grid-cols-2 gap-y-4 gap-x-8 w-full'>
                  {/* for firstname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='firstname'>Firstname</label>
                    <input type="text" name='firstname' value={customer.firstname} readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for lastname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='lastname'>Lastname</label>
                    <input type="text" name='lastname' value={customer.lastname} readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for email address */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='email'>Email Address</label>
                    <input type="text" name='email' readOnly value={customer.email} className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for lastname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='phonenumber1'>Phonenumber</label>
                    <input type="text" name='phonenumber1' value={customer.phonenumber1} readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                </div>
              </div>

              {/* for customer address */}
              <div style={{paddingBottom: '20px'}} className='flex flex-col gap-4 border-b-1 border-[#D9E1EC]'>
                <h1>Customer Address</h1>
                <div className='grid grid-cols-2 gap-y-4 gap-x-8 w-full'>
                  {/* for firstname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='address'>Address</label>
                    <input type="text" name='address' readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for lastname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='city'>City</label>
                    <input type="text" name='city' readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for email address */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='state'>State</label>
                    <input type="text" name='state' readOnly value={customer.email} className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                  {/* for lastname */}
                  <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor='country'>Country</label>
                    <input type="text" name='country' value={customer.phonenumber1} readOnly className='w-full border-1 rounded-[4px] border-[#D9E1EC] focus:outline-0' style={{padding: '5px'}}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CustomerDetails;
