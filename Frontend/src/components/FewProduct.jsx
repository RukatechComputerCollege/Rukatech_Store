import React, { useContext, useEffect, useState } from 'react'
import { CategoryContext } from '../CategoryContext'
import ProductCard from './ProductCard'
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import SkelentonLoader from './SkelentonLoader';

const FewProduct = () => {
  const { allProduct, allCategory } = useContext(CategoryContext)

  const [productShowName, setProductShowName] = useState('Product')

  const topCategories = allCategory?.slice(0, 4) || []

  const  filteredProducts = allProduct?.filter((product) =>{
    if(productShowName === 'Product') return true;

    return product.category?.some(cat => cat.name === productShowName)
  }).slice(0,8)
  const navigate = useNavigate()
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className="w-full flex flex-col md:flex-row items-center justify-between overflow-visible">
        <h1 className="text-[20px] md:text-[24px] font-semibold text-[#191C1F] mb-4 md:mb-0">{productShowName}</h1>
        
        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start w-full md:w-auto">
          <p
            className={`cursor-pointer ${productShowName === 'Product' ? 'border-b-2 border-[#FA8232]' : ''}`}
            onClick={() => setProductShowName('Product')}
          >
            All Product
          </p>
          
          {allCategory?.slice(0, 4).map((cat) => (
            <p
              key={cat?._id}
              className={`cursor-pointer ${productShowName === cat.name ? 'border-b-2 border-[#FA8232]' : ''}`}
              onClick={() => setProductShowName(cat.name)}
            >
              {cat.name}
            </p>
          ))}
          
          <p
            onClick={() => navigate('/store')}
            className="cursor-pointer font-semibold text-[#FA8232] text-[14px] flex gap-2 items-center mt-4 md:mt-0"
          >
            <span>Browse All Product</span>
            <IoIosArrowRoundForward size={20} />
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredProducts && filteredProducts.length > 0 ? filteredProducts?.map((product) => (
          <ProductCard key={product?._id} product={product}/>
        ))
        :
        Array.from({ length: 10}).map((_, index) => (
          <div key={index} className="w-full h-[250px] cursor-pointer flex flex-col gap-2 border-1 border-[#E4E7E9]" style={{ padding: "10px" }}>
            <SkelentonLoader />
          </div>
        ))
        }
      </div>
    </div>
  )
}

export default FewProduct