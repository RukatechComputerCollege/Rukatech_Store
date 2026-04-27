const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { FaPlus, FaRegTrashCan } from "react-icons/fa6"
import { FiSearch } from 'react-icons/fi'
import { MdOpenInNew } from "react-icons/md";
import { AdminContext } from '../admincomponents/AdminContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Customer = () => {

  const { id } = useParams()
  const { customers } = useContext(AdminContext)
  const { page, setPage, pagination } = useContext(AdminContext)
  const [AllCustomers, setAllCustomers] = useState([])
  const navigate = useNavigate()
  const [searchItem, setSearchItem] = useState('')
  const API_URL = import.meta.env.VITE_API_URL;

  const customer = customers?.data?.find(user => user._id === id)

  useEffect(() => {
    if(customers){
      setAllCustomers(customers)
      console.log(customers);
    }    
  }, [customers])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const viewUser = (eachCustomers) =>{
  navigate(`/${ADMIN_ROUTE}/customer/${eachCustomers._id}`, {state: {eachCustomers}})
  }

  const deleteUser = () =>{
  let deleteURL = `${API_URL}/${ADMIN_ROUTE}/deleteCustomers`
    axios.post(deleteURL, customer)
    .then((res) =>{
      if(res.data.status){
        toast.success('Customer Information has been Deleted Successfully')
        setTimeout(() => {
          window.location.href = `/${ADMIN_ROUTE}/dashboard/customer`
        }, 3000);
      }
    }).catch((err) =>{
      console.log(err);
    })
  }

  const AddNewCustomer = () =>{
    navigate('add-new-customer')
  }
  
  return (
    <div className='w-full h-auto'>
      <div className='w-full flex flex-col gap-4'>
        <div className='w-full flex items-center justify-between'>
          <h1 className='text-black font-bold text-[24px]'>Customers</h1>
          <div className='flex gap-4'>
            <div style={{padding: '15px 30px'}} className='cursor-pointer flex items-center rounded-[4px] text-[#1E5EFF] gap-2 bg-white'><span>Export </span></div>
            <div onClick={AddNewCustomer} style={{padding: '15px 30px'}} className='cursor-pointer flex items-center rounded-[4px] text-white gap-2 bg-[#1E5EFF]'><FaPlus size={24}/><span>Add Customer </span></div>
          </div>
        </div>

        {/* list of customers */}
        <div style={{padding: '20px'}} className='bg-white rounded-[6px] w-full flex flex-col gap-4'>
          <p className='text-[#5A607F] text-[16px]'>All Customers</p>

          {/* for filter and delete btn */}
          <div className='w-full grid grid-cols-[5fr_1fr] items-center'>
            <div className='w-full'>
              <div style={{padding: '0 20px'}} className='w-full flex items-center gap-3 border-1 border-[#D9E1EC] rounded-[4px]'>
                <FiSearch className='text-[#979797]' size={24} />
                <input
                  style={{padding: '10px 0'}}
                  type="text"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value.toLowerCase())}
                  className='border-0 focus:outline-0'
                  placeholder='Search'
                />
              </div>
            </div>
            <div className='justify-self-end'>
              <div className='w-[40px] h-[40px] cursor-pointer hover:text-[#304169] flex flex-col justify-center items-center text-[#1E5EFF] rounded-[4px] shadow-sm'>
                <FaRegTrashCan size={24}/>
              </div>
            </div>
          </div>
          {/* end of filter and delete btn */}

          {/* list of registered users */}
          <div className='w-[100%]'>
            <table className="w-full">
              <thead className='w-full'>
                <tr className='font-bold'>
                  <td style={{padding: '15px 0'}} className='text-left'>S/N</td>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Reg. Date</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody className='w-full'>
                {AllCustomers && AllCustomers.length > 0 ? (
                  AllCustomers
                    .filter((customer) => {
                      const fullname = `${customer.firstname} ${customer.lastname}`.toLowerCase();
                      const email = `${customer.email}`.toLowerCase();
                      return (
                        fullname.includes(searchItem) || 
                        email.includes(searchItem)
                      )
                    })
                    .map((eachCustomers, index) => (
                      <tr key={eachCustomers._id}>
                        <td>{(page - 1) * 10 + index + 1}</td>
                        <td>{`${eachCustomers.firstname} ${eachCustomers.lastname}`}</td>
                        <td>{eachCustomers.email}</td>
                        <td>{new Date(eachCustomers.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className='flex gap-2 cursor-pointer'>
                          <MdOpenInNew onClick={() => viewUser(eachCustomers)} size={24} />
                          <FaRegTrashCan onClick={deleteUser} size={24} />
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

            {/* Pagination */}
            <div className='w-full flex gap-2 justify-end mt-6'>
              <button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-[#1E5EFF] text-white' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => page < pagination.totalPages && setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Customer
