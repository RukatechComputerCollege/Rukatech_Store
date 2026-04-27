import React, { useContext, useEffect, useState } from 'react'
import { getRecentlyViewed } from './Recentlyview'
import { CategoryContext } from '../CategoryContext'
import ProductCard from './ProductCard'
import SkelentonLoader from './SkelentonLoader'

const BrowsingHistory = () => {
	const viewedIds = getRecentlyViewed()
	const { allProduct } = useContext(CategoryContext)
	const [recentViewedProducts, setRecentViewedProducts] = useState([])
	useEffect(() => {
		if(viewedIds.length > 0 && allProduct?.length > 0){
			const getProducts = allProduct?.filter(product => viewedIds.includes(product._id))
			console.log(getProducts);
			setRecentViewedProducts(getProducts)
		}
	}, [viewedIds, allProduct])
	
  return (
		<div className='w-full flex flex-col gap-4' style={{marginBottom: '20px'}}>
			<h1 className="text-xl font-bold mb-4">Recently Viewed</h1>
			<div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{recentViewedProducts.length > 0 ? recentViewedProducts.map(product => (
					<ProductCard key={product._id} product = {product}/>
				))
				: (
					Array.from({ length: 20}).map((_, index) => (
					<div className="w-full h-[250px] cursor-pointer flex flex-col gap-2 border-1 border-[#E4E7E9]" style={{ padding: "10px" }}>
						<SkelentonLoader />
					</div>
					))
				)
				}
			</div>
		</div>
  )
}

export default BrowsingHistory