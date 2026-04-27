import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxCrossCircled } from "react-icons/rx";
import { removeFromCart, updateQuantity } from '../redux/Cart';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { CgArrowRight } from "react-icons/cg";
import { FiShoppingCart  } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const cartItem = useSelector(state => state.cart.cartItem)
  const dispatch = useDispatch()
  const subtotal = cartItem.reduce((acc, item) => {
    const price = typeof item.discountprice === 'number' ? item.discountprice : item.price;
    const qty = item.quantity || 1;
    return acc + (price * qty);
  }, 0);
  const navigate = useNavigate()
  document.title = 'Shopping Cart | Fastcart Online Store'

  return (
    <div className={`w-full ${cartItem.length === 0  && 'justify-center items-center'} flex flex-col`} style={{ padding: "30px 6%" }}>
      {cartItem?.length > 0 ? 
        <div>
            <div className='w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-7 items-start'>
              {/* Cart Items Section */}
              <div className='w-full bg-white border border-[#E4E7E9] rounded-[4px] flex flex-col'>
                <div className='w-full border-b-1 border-[#E4E7E9]' style={{ padding: '10px 20px' }}>
                  <p className='text-[#191C1F] text-[16px] font-bold'>Shopping Cart {cartItem.length > 0 && `(${cartItem.length})`}</p>
                </div>
                <div className='w-full flex flex-col gap-4'>
                  <div className='w-full grid grid-cols-4 sm:grid-cols-[3fr_1fr_2fr_1fr] border border-[#E4E7E9] bg-[#F2F4F5] text-[#475156] text-[12px]' style={{ padding: '10px 20px' }}>
                    <p>PRODUCTS</p>
                    <p>PRICE</p>
                    <p>QUANTITY</p>
                    <p>SUB-TOTAL</p>
                  </div>
                  <div className='w-full flex flex-col gap-4 border-b-1 border-[#E4E7E9]' style={{ padding: '20px' }}>
                    {cartItem.map((cartProduct) => (
                      <div key={cartProduct._id} className='w-full grid grid-cols-1 sm:grid-cols-[3fr_1fr_2fr_1fr] gap-4 items-center'>
                        {/* Product Details */}
                        <div className='w-full flex items-center gap-4'>
                          <RxCrossCircled onClick={() => dispatch(removeFromCart(cartProduct))} size={44} className='text-[#929FA5] cursor-pointer'/>
                          <div className='w-[72px] h-[72px]'>
                            <img className='w-full h-full object-contain' src={cartProduct?.image[0]} alt="" />
                          </div>
                          <p className='font-bold text-[#191C1F] text-[14px]'>{cartProduct?.name}</p>
                        </div>
                        {/* Price */}
                        <div>
                          <p className='text-[#475156] text-[14px] font-bold'>
                            ₦{(typeof cartProduct?.discountprice === 'number' ? cartProduct.discountprice : cartProduct?.price)?.toLocaleString()}
                          </p>
                        </div>
                        {/* Quantity Control */}
                        <div>
                          <div className='w-full text-[#191C1F] flex items-center gap-4 justify-center border border-[#E4E7E9] rounded-[3px]' style={{ padding: '10px 20px' }}>
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
                            }} className='border-0 focus:outline-0 w-2' value={cartProduct.quantity || 1} />
                            <FaPlus className='cursor-pointer'
                              onClick={() => {
                                dispatch(updateQuantity({
                                  productId: cartProduct._id,
                                  quantity: (cartProduct.quantity || 1) + 1
                                }));
                              }} size={16} />
                          </div>
                        </div>
                        {/* Subtotal */}
                        <div>
                          <p className='text-[16px] text-[#191C1F] font-bold'>
                            ₦{((typeof cartProduct.discountprice === 'number' ? cartProduct.discountprice : cartProduct.price) * (cartProduct.quantity || 1)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Buttons */}
                  <div className='w-full flex items-center justify-between gap-4 flex-wrap' style={{ padding: '20px' }}>
                    <button onClick={() => navigate('/store')} style={{ padding: '15px 10px' }} className='rounded-[2px] border-2 border-[#2DA5F3] transition-all cursor-pointer font-bold hover:bg-[#2DA5F3] hover:text-white active:text-white active:bg-[#2DA5F3] text-[#2DA5F3] w-full sm:w-auto flex items-center justify-center gap-4'>
                      <IoIosArrowRoundBack size={24} /><span>RETURN TO SHOP</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Totals Section */}
              <div className='w-full flex flex-col gap-4'>
                {/* Checkout */}
                <div className='w-full bg-white border border-[#E4E7E9] rounded-[4px] flex flex-col gap-4' style={{ padding: '20px' }}>
                  <p className='text-[#191C1F] text-[18px] font-bold'>Cart Totals</p>
                  <div className='w-full flex flex-col gap-2 border-b border-[#E4E7E9]' style={{ paddingBottom: '20px' }}>
                    <p className='w-full flex items-center justify-between'>
                      <span className='text-[#5F6C72] text-[14px]'>Sub-total</span>
                      <span className='text-[#191C1F] text-[14px] font-bold'>₦{subtotal.toLocaleString()}</span>
                    </p>
                    <p className='w-full flex items-center justify-between'>
                      <span className='text-[#5F6C72] text-[14px]'>Shipping</span>
                      <span className='text-[#191C1F] text-[14px] font-bold'>Free</span>
                    </p>
                    <p className='w-full flex items-center justify-between'>
                      <span className='text-[#5F6C72] text-[14px]'>Discount</span>
                      <span className='text-[#191C1F] text-[14px] font-bold'>-</span>
                    </p>
                  </div>
                  <p className='w-full flex items-center justify-between'>
                    <span className='text-[#5F6C72] text-[16px]'>Sub-total</span>
                    <span className='text-[#191C1F] text-[16px] font-bold'>₦{subtotal.toLocaleString()}</span>
                  </p>
                  <button onClick={() => navigate('/shopping-cart/checkout')} style={{ padding: '15px 0' }} className='rounded-[2px] bg-[#FA8232] transition-all cursor-pointer font-bold hover:bg-[#f76f14] active:bg-[#fd9752] text-white w-full flex items-center justify-center gap-4'>
                    <span>CHECK OUT NOW</span>
                    <CgArrowRight className='text-white' size={24} />
                  </button>
                </div>

                {/* Coupon Section */}
                <div className='w-full bg-white border border-[#E4E7E9] rounded-[4px] flex flex-col gap-4'>
                  <p className='text-[#191C1F] text-[18px] font-bold border-b border-[#E4E7E9]' style={{ padding: '10px 20px' }}>Coupon</p>
                  <div style={{ padding: '20px' }}>
                    <div className='w-full flex flex-col gap-2' style={{ paddingBottom: '20px' }}>
                      <input type="text" placeholder='Enter a coupon if you have' className='border border-[#E4E7E9] focus:outline-0 rounded-[2px]' style={{ padding: '10px' }} />
                    </div>
                    <div>
                      <button style={{ padding: '15px 20px' }} className='rounded-[2px] bg-[#2DA5F3] transition-all cursor-pointer font-bold hover:bg-[#189cf5] active:bg-[#58b6f5] text-white'>APPLY COUPON</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      : 
        <div  style={{padding: '5% 1%'}} className='w-full md:w-2/4 text-black flex flex-col items-center justify-center text-center gap-4 border-b-1 border-[#E4E7E9]'>
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

export default ShoppingCart;
