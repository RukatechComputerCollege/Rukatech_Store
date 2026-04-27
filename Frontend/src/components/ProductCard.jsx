import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { addToCart, removeFromCart } from '../redux/Cart';
import { FaMinus } from "react-icons/fa6";
import { FaRegStar} from "react-icons/fa6";
import axios from 'axios';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [isHover, setIsHover] = useState(false)
  const cartItem = useSelector(state => state.cart.cartItem);
  const isAddedToCart = cartItem.some(item => item._id === product._id)
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_ROUTE_NAME
  const [averageRating, setAverageRating] = useState('')
  const [totalRating, setTotalRating] = useState('')
  const navigate = useNavigate();
  const handleCartToggle = () =>{
    if(isAddedToCart){
      dispatch(removeFromCart(product))
    }else{
      dispatch(addToCart(product))
    }
  }

  const productDetails = (product) =>{
    window.location.href = `/product-page/${product._id}`
  }
  useEffect(() => {
    if (product?._id) {
      console.log(product._id);
      axios.get(`${API_URL}/${ADMIN_URL}/${product._id}/average-rating`)
        .then(res => {
          console.log("Average Rating:", res.data);
          setAverageRating(res.data.averageRating);
          setTotalRating(res.data.totalrating);
        })
        .catch(err => console.error(err));
    }
  }, [product]);
  const computedAverageRating =
  product?.rating?.length > 0
    ? product.rating.reduce((acc, r) => acc + r.ratingGrade, 0) / product.rating.length
    : 0;
  
  return (
    <div onClick={() => productDetails(product)} onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} className="w-full cursor-pointer flex flex-col gap-2 border-1 border-[#E4E7E9]" style={{ padding: "10px" }} >
      <div className="relative h-[150px] md:h-[172px]">
        <img className='hover:rounded-[3px] h-full w-full object-contain' src={product?.image[0]} alt="product-image" />
        {product.discountPercentage &&
          <span className="absolute top-0 left-0 rounded-[2px] bg-[#EFD33D] text-black" style={{ padding: "5px 10px" }}>
            {product?.discountPercentage}% OFF
          </span>
        }
        {/* for cart action button */}
        <div style={{padding: '0 30px'}} className={`${isHover ? 'flex' : 'hidden'} cursor-pointer absolute w-full h-full bg-[#00000083] flex-col items-center justify-center top-0 left-0`}>
          <div className='w-full flex items-center justify-center gap-2'>
            <div className="rounded-[50%] bg-white cursor-pointer transition-all text-[#191C1F] hover:bg-[#FA8232] hover:text-white" style={{ padding: "12px" }}>
              <FaRegHeart size={16} />
            </div>
            <div onClick={(e) =>{e.stopPropagation(); handleCartToggle()} } className="rounded-[50%] bg-white cursor-pointer transition-all text-[#191C1F] hover:bg-[#FA8232] hover:text-white" style={{ padding: "12px" }}>
              {isAddedToCart ? <FaMinus size={16} /> : <FiShoppingCart size={16} />}
            </div>
            <div className="rounded-[50%] bg-white cursor-pointer transition-all text-[#191C1F] hover:bg-[#FA8232] hover:text-white" style={{ padding: "12px" }}>
              <MdOutlineRemoveRedEye size={16} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        {[...Array(5)].map((_, i) =>
          i < Math.round(averageRating) ? (
            <FaStar key={i} size={18} className="text-[#FA8232]" />
          ) : (
            <FaRegStar key={i} size={18} className="text-[#ADB7BC]" />
          )
        )}
        <span className="text-[12px] text-[#77878F]">
          ({product?.rating?.length || 0})
        </span>
      </div>
      <p className="text-[14px] text-[#191C1F]">
        {product?.description.split(' ').slice(0, 10).join(' ')}...
      </p>
      <p className="text-[#2DA5F3] text-[14px] flex flex-col md:flex-row md:gap-2">
        <span className={`md:text-[18px] ${product?.discountprice ? 'line-through text-[#ADB7BC]' : 'text-[#2DA5F3] md:text-[18px] font-bold'}`}>₦{product?.price.toLocaleString()}</span>
        {product?.discountprice && (
          <span className="text-[#2DA5F3] md:text-[18px] font-bold">
            ₦{product?.discountprice?.toLocaleString()}
          </span>
        )}
      </p>
    </div>
  )
}

export default ProductCard