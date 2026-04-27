import React, { useState, useEffect, useContext } from 'react'
import { FaStar, FaMinus } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CategoryContext } from '../CategoryContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/Cart';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import SkelentonLoader from './SkelentonLoader';
const BestDeals = () => {
  
  const [productWithHighestDiscount, setProductWithHighestDiscount] = useState(null)
  const [bestDealsProduct, setbestDealsProduct] = useState([])
  const { allProduct } = useContext(CategoryContext)

  useEffect(() => {
    if(Array.isArray(allProduct) && allProduct.length > 0){
      const higherDiscount = allProduct.reduce((max, product) => {
        if (
          typeof product.discountPercentage === "number" &&
          (!max || product.discountPercentage > max.discountPercentage)
        ) {
          return product;
        }
        return max;
      }, null )
      setProductWithHighestDiscount(higherDiscount) 
      
      const topEightDiscounted = allProduct
      .filter(product => 
        typeof product.discountPercentage === "number" &&
        (!higherDiscount || product._id !== higherDiscount._id)
      )
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 8);
      setbestDealsProduct(topEightDiscounted)
    } 
  }, [allProduct])
  const dispatch = useDispatch()
  const cartItem = useSelector(state => state.cart.cartItem)
  const isAddedToCart = productWithHighestDiscount && cartItem.some(item => item._id === productWithHighestDiscount._id);


  const handleCartToggle = (e) =>{
    e.stopPropagation()
    if(isAddedToCart){
      dispatch(removeFromCart(productWithHighestDiscount))
    }else{
      dispatch(addToCart(productWithHighestDiscount))
    }
  }
  const navigate  = useNavigate()
  const productDetails = (productWithHighestDiscount) =>{
    navigate(`/product-page/${productWithHighestDiscount._id}`)
  }
  return (
    <div className="w-full gap-4 md:gap-0 grid items-start lg:grid-cols-[24%_76%] lg:border-1 lg:border-[#E4E7E9]">
      <div className="border border-[#E4E7E9] md:border-0 md:border-r-1 md:border-[#E4E7E9]" style={{ padding: "10px" }}>
        {/* for higher product */}
        {productWithHighestDiscount && (
          <div onClick={() => productDetails(productWithHighestDiscount)} className="w-full flex flex-col cursor-pointer">
            {/* for highest discount product */}
            <div className="relative">
              <img src={productWithHighestDiscount?.image[0]} alt="product-image" />
              <span className="absolute top-0 left-0 rounded-[2px] bg-[#EFD33D]" style={{ padding: "5px 10px" }}>
                {productWithHighestDiscount.discountPercentage}% OFF
              </span>
              <span className="absolute top-[40px] left-0 rounded-[2px] bg-[#EE5858] text-white" style={{ padding: "5px 10px" }}>
                HOT
              </span>
            </div>
            <div className="w-full flex flex-col gap-2">
              {/* for start ratings and purchase counts */}
              <span className="flex gap-4 items-center">
                <span className="flex gap-1 items-center">
                  <FaStar className="text-[#EBC80C]" size={20} />
                  <FaStar className="text-[#EBC80C]" size={20} />
                  <FaStar className="text-[#EBC80C]" size={20} />
                  <FaStar className="text-[#EBC80C]" size={20} />
                  <FaStar className="text-[#EBC80C]" size={20} />
                </span>
                <span className="text-[#77878F] text-[14px]">(52,677)</span>
              </span>
              <p className="text-[16px] text-[#191C1F]">
                {productWithHighestDiscount?.name}
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-[18px] text-[#ADB7BC] line-through">₦{productWithHighestDiscount?.price ? productWithHighestDiscount.price.toLocaleString() : "0"}</span>
                <span className="text-[#2DA5F3] text-[18px] font-bold">
                  ₦{productWithHighestDiscount?.discountprice ? productWithHighestDiscount.discountprice.toLocaleString() : "0"}
                </span>
              </p>
              <p className="text-[14px] text-[#5F6C72]">
                {productWithHighestDiscount.description.split(' ').slice(0, 30).join(' ')}...
              </p>
              <div className="w-full grid grid-cols-[1fr_3fr_1fr] gap-2">
                <button
                  className="rounded-[2px] bg-[#FFE7D6] text-[#191C1F]"
                  style={{ padding: "12px" }}
                >
                  <FaRegHeart size={24} />
                </button>
                <button
                  onClick={(e)=> handleCartToggle(e)}
                  className="rounded-[2px] bg-[#FA8232] text-white flex items-center gap-[8px] cursor-pointer transition-all hover:bg-[#f7751f] active:bg-[#f89e62]"
                  style={{ padding: "12px" }}
                >
                  {isAddedToCart ? <FaMinus  size={20} /> : <FiShoppingCart size={20} />} 
                  <span className="font-bold text-[14px]">{isAddedToCart ? 'REMOVE FROM CART' : 'ADD TO CART'}</span>
                </button>
                <button
                  className="rounded-[2px] bg-[#FFE7D6] text-[#191C1F]"
                  style={{ padding: "12px" }}
                >
                  <MdOutlineRemoveRedEye size={24} />
                </button>
              </div>
            </div>

          </div>
        )}
        {/* end of highest discount product */}
      </div>

      {/* for other best deal product */}
      <div className='w-full items-start md:items-stretch grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-auto gap-2 lg:gap-0'>
      {bestDealsProduct && bestDealsProduct.length > 0 ? bestDealsProduct.map((bestProducts, index) => (
        <ProductCard key={bestProducts._id} product={bestProducts}/>
      ))
      : 
      Array.from({ length: 8}).map((_, index) => (
        <div className="w-full h-[250px] cursor-pointer flex flex-col gap-2 border-1 border-[#E4E7E9]" style={{ padding: "10px" }}>
          <SkelentonLoader />
        </div>
      ))
      }
      </div>
    </div>
  )
}

export default BestDeals