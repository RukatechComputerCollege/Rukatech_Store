import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from "react-icons/rx";
import { removeFromCart, updateQuantity } from '../redux/Cart';
import { CgArrowRight } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FiShoppingCart  } from "react-icons/fi";

const CartCard = () => {
  const cartItem = useSelector(state => state.cart.cartItem)
  const dispatch = useDispatch()

  const subtotal = cartItem.reduce((acc, item) => {
    const price = typeof item.discountprice === 'number' ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + (price * qty);
  }, 0);
  
  const navigate = useNavigate()
  return (
    <div className='w-full bg-white rounded-[4px] flex flex-col'>
      <div className='w-full border-b-1 border-[#E4E7E9]' style={{padding: '10px 20px'}}>
        <p className='text-[#191C1F] text-[16px] font-bold'>Shopping Cart {cartItem.length>0 && `(${cartItem.length})`}</p>
      </div>
      {cartItem.length > 0 ? (
        <div>
          <div style={{padding: '20px'}} className='w-full flex flex-col gap-4 border-b-1 border-[#E4E7E9]'>
            {cartItem.map((cartProduct) => (
              <div key={cartProduct._id} className='w-full grid grid-cols-[1fr_3fr_0.5fr] grid-rows-auto gap-4 items-center'>
                <div className='w-[80px] h-[80px] border border-[#E4E7E9]'>
                  <img className='w-full h-full object-contain' src={cartProduct?.image[0]} alt="" />
                </div>
                <div>
                  <p className='font-bold text-[#191C1F] text-[14px]'>{cartProduct?.name.split(' ').slice(0,5).join(' ')}...</p>
                  <div>
                    <div>
                      <div>
                        <div className='w-25 text-[#191C1F] flex items-center gap-4 justify-center border border-[#E4E7E9] rounded-[3px]' style={{padding: '5px 10px'}}>
                          <FaMinus className='cursor-pointer'
                            onClick={() => {
                              dispatch(updateQuantity({
                                productId: cartProduct._id,
                                quantity: Math.max(1, (cartProduct.quantity || 1) - 1)
                              }));
                            }} size={16}  
                          />
                          <input type="text" onChange={(e) => {
                            const value = parseInt(e.target.value);
                              dispatch(updateQuantity({
                                productId: cartProduct._id,
                                quantity: isNaN(value) || value < 1 ? 1 : value
                              }));
                            }} className='border-0 focus:outline-0 w-2' value={cartProduct.quantity || 1}
                          />
                          <FaPlus className='cursor-pointer'
                            onClick={() => {
                              dispatch(updateQuantity({
                                productId: cartProduct._id,
                                quantity: (cartProduct.quantity || 1) + 1
                              }));
                            }} 
                            size={16} 
                          />
                        </div>
                      </div>
                    </div>
                    <p className='text-[#2DA5F3] text-[14px] font-bold'>
                      ₦{(typeof cartProduct?.discountprice === 'number' ? cartProduct.discountprice : cartProduct?.price)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <RxCross2 onClick={() => dispatch(removeFromCart(cartProduct))} size={16} className='text-[#929FA5] cursor-pointer'/>
              </div>
            ))}
          </div>
          <div style={{padding: '20px'}} className='w-full flex flex-col gap-4'>
            <div className='w-full flex items-center justify-between'>
              <p className='text-[14px] text-[#475156]'>Sub-Total</p>
              <p className='text-[16px] text-[#191C1F] font-bold'>₦{subtotal.toLocaleString()}</p>
            </div>
            <div className='w-full flex flex-col gap-4'>
              <button onClick={() => navigate('/shopping-cart/checkout')} style={{padding: '15px 0'}} className='rounded-[2px] bg-[#FA8232] transition-all cursor-pointer font-bold hover:bg-[#f76f14] active:bg-[#fd9752] text-white w-full flex items-center justify-center gap-4'><span>CHECK OUT NOW</span><CgArrowRight className='text-white' size={24} /></button>
              <button onClick={() => navigate('/shopping-cart')} style={{padding: '15px 0'}} className='rounded-[2px] border-2 border-[#FA8232] transition-all cursor-pointer font-bold hover:bg-[#f76f14] hover:text-white active:text-white active:bg-[#fd9752] text-[#FA8232] w-full'>View Cart</button>
            </div>
          </div>
        </div>
      )
      : 
      <div  style={{padding: '40px 20px'}} className='w-full text-black flex flex-col items-center justify-center text-center gap-4 border-b-1 border-[#E4E7E9]'>
        <div className='w-[80px] h-[80px] rounded-[50%] flex flex-col items-center justify-center bg-[#f9d7c0a9]'>
          <FiShoppingCart className='text-[#FA8232]' size={45}/>
        </div>
        <div>
          <h1>Your Cart is Empty!</h1>
          <p className='text-[14px]'>Browse our categories and discover our best deals!</p>
        </div>
        <button onClick={() => navigate('/store') } className='w-full cursor-pointer hover:bg-[#fa8232cf] active:bg-[#fa8232d3] rounded-[4px] bg-[#FA8232] text-white' style={{padding: '10px'}}>Start Shopping</button>
      </div>
      }
    </div>
  )
}

export default CartCard