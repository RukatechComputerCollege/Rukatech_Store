import React, { useState, useEffect, useContext } from 'react'
import { FaStar, FaMinus } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CategoryContext } from '../CategoryContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/Cart';
import ProductCard from './ProductCard';
import SkelentonLoader from './SkelentonLoader';

const FeaturedProducts = () => {
  const [productWithHighestDiscount, setProductWithHighestDiscount] = useState(null)
  const [bestDealsProduct, setBestDealsProduct] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  const { allProduct } = useContext(CategoryContext)

  useEffect(() => {
    if (Array.isArray(allProduct) && allProduct.length > 0) {
      // 1. Find highest discount product
      const higherDiscount = allProduct.reduce((max, product) => {
        if (
          typeof product.discountPercentage === "number" &&
          (!max || product.discountPercentage > max.discountPercentage)
        ) {
          return product;
        }
        return max;
      }, null)
      setProductWithHighestDiscount(higherDiscount)

      // 2. Find next 8 best deals
      const topEightDiscounted = allProduct
        .filter(product =>
          typeof product.discountPercentage === "number" &&
          product._id !== higherDiscount._id
        )
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 8)
      setBestDealsProduct(topEightDiscounted)

      // 3. Exclude all best deals (highest + topEight) from featured
      const excludedIds = new Set([
        higherDiscount?._id,
        ...topEightDiscounted.map(p => p._id)
      ])

      const featured = allProduct
        .filter(p => !excludedIds.has(p._id)) // exclude best deals
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
        .slice(0, 10) // take latest 10

      setFeaturedProducts(featured)
    }
  }, [allProduct])

  const dispatch = useDispatch()
  const cartItem = useSelector(state => state.cart.cartItem)
  const isAddedToCart =
    productWithHighestDiscount &&
    cartItem.some(item => item._id === productWithHighestDiscount._id)

  const handleCartToggle = () => {
    if (isAddedToCart) {
      dispatch(removeFromCart(productWithHighestDiscount))
    } else {
      dispatch(addToCart(productWithHighestDiscount))
    }
  }

  return (
    <div className="w-full flex flex-col gap-4" style={{marginBottom: '20px'}}>
      {/* Featured Products Section */}
        <h2 className="text-xl font-bold mb-4">Featured Products</h2>
      <div>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts && featuredProducts.length > 0 ? featuredProducts.map(fp => (
            <ProductCard key={fp._id} product={fp} />
          ))
          :
          Array.from({ length: 10}).map((_, index) => (
            <div className="w-full h-[250px] cursor-pointer flex flex-col gap-2 border-1 border-[#E4E7E9]" style={{ padding: "10px" }}>
              <SkelentonLoader />
            </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts
