import React, { useContext, useEffect, useState } from 'react'
import { UserAccountContext } from './UserContext'
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const {userData } = useContext(UserAccountContext)
  const [userOrder, setUserOrder] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const navigate = useNavigate()
  

  useEffect(() => {
    if(userData){
      const sorted = [...userData.productOrder].sort(
        (a, b) =>
          new Date(b.flutterwaveResponse.created_at) - new Date(a.flutterwaveResponse.created_at)
      );
      setUserOrder(sorted)
    }
  }, [userData])

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = userOrder.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(userOrder.length / ordersPerPage);

  // Compact pagination logic
  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={{padding: '20px'}} className='w-full flex flex-col border border-[#E4E7E9] rounded-[4px]'>
      <h1 style={{padding:"10px 0px"}} className='font-bold text-[#191C1F] text-[14px] text-center'>ORDER HISTORY</h1>
      <div className="hidden md:grid grid-cols-5 text-[12px] text-[#475156] bg-[#F2F4F5] border border-[#E4E7E9] p-3">
        <p>ORDER ID</p>
        <p>STATUS</p>
        <p>DATE</p>
        <p>TOTAL</p>
        <p>ACTION</p>
      </div>
        {userData &&
          currentOrders.map((order, index) => (
            <div key={index} style={{padding: '12px 0px'}} className="border-b border-[#E4E7E9] p-4 text-[14px] text-[#475156] grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-0" >
              {/* Order ID */}
              <div className="flex md:block">
                <span className="font-medium text-gray-500 w-28 md:hidden">Order ID:</span>
                <p className="text-[#191C1F]">#{order.flutterwaveResponse.transaction_id}</p>
              </div>

              {/* Status */}
              <div className="flex md:block">
                <span className="font-medium text-gray-500 w-28 md:hidden">Status:</span>
                <p
                  className={`${
                    order.orderStatus === "delivered"
                      ? "text-[#2DB224] font-bold"
                      : "text-[#EE5858] font-bold"
                  }`}
                >
                  {order.orderStatus === "delivered"
                    ? "COMPLETED"
                    : order.orderStatus === "on_the_road"
                    ? "ON THE ROAD"
                    : order.orderStatus === "packaging"
                    ? "PACKAGING"
                    : "RECEIVED"}
                </p>
              </div>

              {/* Date */}
              <div className="flex md:block">
                <span className="font-medium text-gray-500 w-28 md:hidden">Date:</span>
                <p className="text-[#5F6C72]">
                  {new Date(order.flutterwaveResponse.created_at)
                    .toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(",", "")}
                </p>
              </div>

              {/* Total */}
              <div className="flex md:block">
                <span className="font-medium text-gray-500 w-28 md:hidden">Total:</span>
                <p className="text-[#475156]">
                  ₦{order.subtotal.toLocaleString()} ({order.products.length} Products)
                </p>
              </div>

              {/* Action */}
              <div className="flex md:block">
                <span className="font-medium text-gray-500 w-28 md:hidden">Action:</span>
                <p
                  onClick={() =>
                    navigate(
                      `/dashboard/order-history/${order.flutterwaveResponse.transaction_id}`
                    )
                  }
                  className="text-[#2DA5F3] flex items-center gap-2 cursor-pointer"
                >
                  <span>View Details</span>
                  <IoIosArrowRoundForward size={16} />
                </p>
              </div>
            </div>
          ))}

        {/* pagination controls */}
        {/* pagination controls */}
        {userOrder.length > ordersPerPage && (
          <div className="flex justify-center items-center gap-2" style={{paddingTop: '20px'}}>
            {/* Desktop pagination */}
            <div className="hidden md:flex items-center gap-2">
              {/* Prev button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-[40px] h-[40px] cursor-pointer border-2 border-[#FA8232] rounded-full disabled:opacity-50 flex items-center justify-center text-[#FA8232]"
              >
                <IoIosArrowRoundBack size={24} />
              </button>

              {/* Page Numbers with Ellipsis */}
              {getPaginationNumbers().map((number, idx) =>
                number === "..." ? (
                  <span
                    key={idx}
                    className="w-[40px] h-[40px] flex items-center justify-center"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-[40px] h-[40px] cursor-pointer rounded-full flex items-center justify-center text-[#FA8232] ${
                      currentPage === number
                        ? "bg-[#FA8232] text-white"
                        : "hover:bg-gray-100 border-2 border-[#E4E7E9]"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-[40px] h-[40px] border-2 cursor-pointer border-[#FA8232] rounded-full flex items-center justify-center text-[#FA8232] disabled:opacity-50"
              >
                <IoIosArrowRoundForward size={24} />
              </button>
            </div>

            {/* Mobile pagination */}
            <div className="flex md:hidden items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 border-2 border-[#FA8232] rounded-md disabled:opacity-50 text-[#FA8232]"
              >
                Prev
              </button>

              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="border border-[#E4E7E9] rounded-md px-2 py-1 text-sm"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    Page {page} of {totalPages}
                  </option>
                ))}
              </select>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 border-2 border-[#FA8232] rounded-md disabled:opacity-50 text-[#FA8232]"
              >
                Next
              </button>
            </div>
          </div>
        )}

    </div>
  )
}

export default OrderHistory
