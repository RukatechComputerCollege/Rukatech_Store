import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { CategoryContext } from '../CategoryContext';
import { FiShoppingCart } from "react-icons/fi";
import { FaStar, FaMinus, FaPlus, FaRegStar} from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from '../redux/Cart';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Loader from '../components/Loader';
import Gallery from '../components/Gallery';
import FlutterwaveLogo from '../assets/Flutterwave_Logo.png'
import FewProduct from '../components/FewProduct';
import { addToRecentlyViewed } from '../components/Recentlyview';
import BrowsingHistory from '../components/BrowsingHistory';

const Productdetails = () => {
  const id = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_ROUTE_NAME
  const { allProduct } = useContext(CategoryContext)
  const [product, setProduct] = useState({})
  const dispatch = useDispatch()
  const cartItem = useSelector(state => state.cart.cartItem)
  const cartProduct = cartItem.find(item => item._id === product?._id);
  const [localQuantity, setLocalQuantity] = useState(cartProduct ? cartProduct.quantity : 1);
  const quantity = cartProduct ? cartProduct.quantity : 1;
  const [isReading, setIsReading] = useState('description')
  const [averageRating, setAverageRating] = useState('')
  const [totalRating, setTotalRating] = useState('')
  useEffect(() => {
    const foundProduct = allProduct.find((product) => product._id === id.id)
    setProduct(foundProduct)
    console.log(product);
    document.title = `${foundProduct?.name || 'Loading...'} | Fastcart Online Store`
    
  }, [id, allProduct])

  useEffect(() => {
    if (product?._id) {
      console.log(product._id);
      addToRecentlyViewed(product._id)
      
      axios.get(`${API_URL}/${ADMIN_URL}/${product._id}/average-rating`)
        .then(res => {
          console.log("Average Rating:", res.data);
          setAverageRating(res.data.averageRating);
          setTotalRating(res.data.totalrating);
        })
        .catch(err => console.error(err));
    }
  }, [product]);

  const isAddedToCart = product && cartItem.some(item => item._id === product._id);

  const handleCartToggle = () =>{
    if(isAddedToCart){
      dispatch(removeFromCart(product))
    }else{
      dispatch(addToCart(product))
    }
  }
  useEffect(() => {
    if (cartProduct) {
      setLocalQuantity(cartProduct.quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [cartProduct]);
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setLocalQuantity("");
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setLocalQuantity(parsed);
    }
  };
  const commitQuantity = () => {
    const finalQuantity = localQuantity === "" ? 1 : Math.max(1, parseInt(localQuantity, 10));
    setLocalQuantity(finalQuantity);

    dispatch(updateQuantity({
      productId: product._id,
      quantity: finalQuantity
    }));
  };
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const deliveryDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  return (
    <div className='w-full flex flex-col gap-4' style={{ padding: "3% 6%" }}>
      <div className='w-full flex flex-col gap-8'>
        {product ? 
          <div className='w-full grid md:grid-cols-2 gap-8'>
            {/* this is for product image */}
            <div className='w-[100%] flex flex-col gap-4 max-w-full'>
              <Gallery images={product.image}/>
            </div>
            {/* this is for products name */}
            <div className='w-full flex flex-col gap-2'>
              <h1 className='text-[24px] text-[#191C1F] font-bold'>{product?.name}</h1>
              <div className='w-full flex items-center gap-4'>
                <p className='text-[14px]'>Category: <span className='text-[#191C1F] font-semibold'>{product?.category ? product.category.map((cat) =>cat.name) : '-'}</span></p>
                <p className='text-[14px]'>Availability: <span className='text-[#2DB224] font-semibold'>{product?.inventory > 0 ? `${product?.inventory} in stock` : 'out of stock'}</span></p>
              </div>
              {/* for price and percentage */}
              <div className='w-full flex flex-row gap-4 items-center md:items-center border-b border-[#E4E7E9]' style={{padding: '20px 0'}}>
                <p className="text-[#2DA5F3] text-[14px] flex flex-col md:flex-row md:items-center md:gap-2">
                  {product?.discountprice && (
                    <span className="text-[#2DA5F3] text-[18px] md:text-[34px] font-bold">
                      ₦{product?.discountprice?.toLocaleString()}
                    </span>
                  )}
                  <span className={`md:text-[20px] ${product?.discountprice ? 'line-through text-[#77878F]' : 'text-[#2DA5F3] md:text-[34px] font-bold'}`}>₦{product?.price?.toLocaleString()}</span>
                </p>
                {product?.discountPercentage &&
                  <span className="rounded-[2px] bg-[#EFD33D] text-black text-[12px]" style={{ padding: "3px 5px" }}>
                    {product?.discountPercentage}% OFF
                  </span>
                }
              </div>
              {/* for additional information */}
              <div className='w-full grid md:grid-cols-2 gap-4'>
                {/* for color */}
                <div className='w-full flex flex-col gap-2'>
                  <h1 className='text-[16px] font-medium'>Color</h1>
                  <p className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.color ?'text-[#aeaeae]' : ''}`} style={{padding: '5px'}}>{product?.color || "N/A"}</p>
                </div>
                {/* for weight */}
                <div className='w-full flex flex-col gap-2'>
                  <h1 className='text-[16px] font-medium'>Weight</h1>
                  <p className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.weight ?'text-[#E4E7E9]' : ''}`} style={{padding: '5px'}}>{product?.weight || "N/A"}</p>
                </div>
                {/* for country */}
                <div className='w-full flex flex-col gap-2'>
                  <h1 className='text-[16px] font-medium'>Country</h1>
                  <p className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.country ?'text-[#E4E7E9]' : ''}`} style={{padding: '5px'}}>{product?.country || "N/A"}</p>
                </div>
                {/* for weight */}
                <div className='w-full flex flex-col gap-2'>
                  <h1 className='text-[16px] font-medium'>Size</h1>
                  <p className={`w-full border border-[#E4E7E9] rounded-[2px] ${!product?.size ?'text-[#E4E7E9]' : ''}`} style={{padding: '5px'}}>{product?.size || "N/A"}</p>
                </div>
              </div>
              {/* action button */}
              <div className='w-full grid md:grid-cols-[1fr_3fr_1fr] gap-4' style={{padding: '20px 0'}}>
                {/* <button className="rounded-[3px] border-2 border-[#FA8232] text-[#FA8232] flex items-center justify-center gap-[8px] cursor-pointer transition-all hover:bg-[#f3dccd] active:bg-[#f1c8ae]" style={{ padding: "12px" }}>
                  <FaRegHeart size={24} />
                </button> */}
                <div className='w-full h-full'>
                  <div className='w-full h-full'>
                    <div className="w-25 h-full text-[#191C1F] flex items-center gap-4 justify-center border border-[#E4E7E9] rounded-[3px]" style={{padding: '5px 10px'}}>
                      <FaMinus
                        className="cursor-pointer"
                        onClick={() => {
                          const newQty = Math.max(1, (parseInt(localQuantity) || 1) - 1);
                          setLocalQuantity(newQty);
                          dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
                        }}
                        size={16}
                      />
                      <input
                        type="number"
                        min="1"
                        onChange={handleQuantityChange}
                        onBlur={commitQuantity}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            commitQuantity();
                          }
                        }}
                        className="border-0 focus:outline-0 w-8 text-center"
                        value={localQuantity}
                      />
                      <FaPlus
                        className="cursor-pointer"
                        onClick={() => {
                          const newQty = (parseInt(localQuantity) || 1) + 1;
                          setLocalQuantity(newQty);
                          dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
                        }}
                        size={16}
                      />
                    </div>

                  </div>
                </div>
                <button onClick={handleCartToggle} className="rounded-[3px] bg-[#FA8232] text-white flex items-center justify-center gap-[8px] cursor-pointer transition-all hover:bg-[#f7751f] active:bg-[#f89e62]" style={{ padding: "15px" }}>
                  {isAddedToCart ? <FaMinus  size={20} /> : <FiShoppingCart size={20} />} 
                  <span className="font-bold text-[14px]">{isAddedToCart ? 'REMOVE FROM CART' : 'ADD TO CART'}</span>
                </button>

                <button className="rounded-[3px] border-2 border-[#FA8232] text-[#FA8232] justify-center flex items-center gap-[8px] cursor-pointer transition-all hover:bg-[#f3dccd] active:bg-[#f1c8ae]" style={{ padding: "12px" }}>
                  <MdOutlineRemoveRedEye size={24} />
                </button>
              </div>
              <div className='w-full rounded-[3px] border border-[#E4E7E9] flex flex-col' style={{padding: '10px 20px'}}>
                <p>100% Guarantee Safe Checkout By</p>
                <img src={FlutterwaveLogo} className='w-[200px]' alt="" />
              </div>
            </div>
          </div>
        :
        <Loader />
        }

        <div className='w-full rounded-[3px] border border-[#E4E7E9] flex flex-col gap-4'>
          <div className='w-full text-[#191C1F] overflow-x-auto whitespace-nowrap font-medium flex items-center md:justify-center border-b border-[#E4E7E9]' style={{padding: '15px'}}>
            <button style={{padding: '0 15px'}} onClick={() => setIsReading('description')} className={`cursor-pointer ${isReading=='description' ? 'border-b-3 border-[#FA8232]' : ''}`}>DESCRIPTION</button>
            <button style={{padding: '0 15px'}} onClick={() => setIsReading('additional-information')} className={`cursor-pointer ${isReading=='additional-information' ? 'border-b-3 border-[#FA8232]' : ''}`}>ADDITONAL INFORMATION</button>
            <button style={{padding: '0 15px'}} onClick={() => setIsReading('specification')} className={`cursor-pointer ${isReading=='specification' ? 'border-b-3 border-[#FA8232]' : ''}`}>SPECIFICATION</button>
            <button style={{padding: '0 15px'}} onClick={() => setIsReading('review')} className={`cursor-pointer ${isReading=='review' ? 'border-b-3 border-[#FA8232]' : ''}`}>REVIEW</button>
          </div>
          <div style={{padding: '20px'}}>
            {isReading=='description' ? (
              // for description
              <div className='w-full grid md:grid-cols-[1fr_1fr_1fr] gap-4'>
                <div className='w-full flex flex-col gap-4'>
                  <h1 className='text-[#191C1F] font-semibold text-[16px]'>Description</h1>
                  <p className='text-[14px]'>{product?.description}</p>
                </div>
                {/* for feature */}
                <div className='w-full flex flex-col gap-4'>
                  <h1 className='text-[#191C1F] font-semibold text-[16px]'>Feature</h1>
                  <p>{product?.keyFeatures}</p>
                </div>
                {/* for what's in the box */}
                <div className='w-full flex flex-col gap-4'>
                  <h1 className='text-[#191C1F] font-semibold text-[16px]'>What is in the box/package</h1>
                  <p>{product?.productBox || '-'}</p>
                </div>

              </div>
            ) : isReading =='additional-information' ? (
              <div>
                <h1 className='text-[#191C1F] font-semibold text-[16px]'>Shipping Information</h1>
                <p>Your Order will be delivered to your shipping address at most 5 days from order date, which will be 
                  <strong> { deliveryDate}</strong>
                </p>
              </div>
            )
              : isReading =='specification' ? (
                <div><p>N/A</p></div>
              )
              : isReading =='review' ? (
                <div className='w-full flex flex-col gap-4'>
                  {product?.rating && product.rating.length > 0 ? (
                    <div className='w-full items-start flex flex-col gap-4'>
                      <div className='bg-[#FBF4CE] rounded-[4px] items-center justify-center flex flex-col gap-4' style={{padding:'32px'}}>
                        <h1 className='text-[#191C1F] text-[56px] font-semibold'>{averageRating}</h1>
                        <div className="flex">
                          {[...Array(5)].map((_, i) =>
                            i < averageRating ? (
                              <FaStar key={i} size={18} className="text-[#FA8232]" />
                            ) : (
                              <FaRegStar key={i} size={18} className="text-[#ADB7BC]" />
                            )
                          )}
                        </div>
                        <p><span className='text-[#191C1F] text-[16px] font-medium'>Customer Rating</span><span className='text-[#475156] text-[16px]'> ({totalRating})</span></p>
                      </div>
                      <h1 className='text-[#191C1F] text-[16px] font-semibold'>Customer Feedback</h1>
                      {product?.rating.map((rates, index) => (
                        <div key={index} className='flex flex-col gap-4 border-b border-[#E4E7E9]' style={{paddingBottom: '10px'}}>
                          <div className='flex gap-4 items-center'>
                            <div className='w-[48px] h-[48px] rounded-[50%] border border-[#191C1F]'></div>
                            <div className='flex flex-col gap-2'>
                              <p><span className='text-[#191C1F] text-[14px] font-medium'>Dianne Russell</span> • <br className='md:hidden'/>
                                <span className='text-[#5F6C72] text-[12px]'>
                                  {rates.createdAt.split('T')[0]
                                  }
                                </span> 
                              </p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) =>
                                  i < rates.ratingGrade ? (
                                    <FaStar key={i} size={18} className="text-[#FA8232]" />
                                  ) : (
                                    <FaRegStar key={i} size={18} className="text-[#ADB7BC]" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <p className='text-[14px] text-[#475156]'>{rates.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                      <div>no rating</div>
                    )
                  }
                </div>
              )
              : 'nothing here'
            }
          </div>
        </div>
      </div>
      <BrowsingHistory />
      <FewProduct />
    </div>
  )
}

export default Productdetails