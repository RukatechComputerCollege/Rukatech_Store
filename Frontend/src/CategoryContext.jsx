import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';


export const CategoryContext = createContext()

const CategoryProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;

  const [allCategory, setAllCategory] = useState([])
  const [allBrand, setAllBrand] = useState([])
  const [allBrandForCategory, setAllBrandForCategory] = useState([])
  const [publishedProduct, setPublishedProduct] = useState([])
  const [publishedCategory, setPublishedCategory] = useState([])
  const [allProduct, setallProduct] = useState([])
  const [allOrders, setAllOrders] = useState([])

    useEffect(() => {

    let allProductURL = `${API_URL}/${ADMIN_ROUTE}/getAllProducts`
    axios.get(allProductURL)
    .then((res) =>{
      if(res.data.status){
        setallProduct(res.data.data)
        const published = res.data.data.filter((product) => product.status === 'published');
        setPublishedProduct(published);
        const publishedCategories = [...new Set(published.map((product) => product.category).filter(Boolean))];
        setPublishedCategory(publishedCategories);
        const products = res.data.data;

        const normalizeCategory = (category) => {
          if (!category) return null;
          if (Array.isArray(category)) {
            return category
              .map((cat) => (typeof cat === 'object' ? cat.name || cat._id : cat))
              .filter(Boolean);
          }
          return typeof category === 'object' ? category.name || category._id : category;
        };

        const allCategories = [];
        products.forEach((product) => {
          const values = normalizeCategory(product.category);
          if (Array.isArray(values)) {
            allCategories.push(...values);
          } else if (values) {
            allCategories.push(values);
          }
        });
        const uniqueCategory = [...new Set(allCategories)];
        setAllCategory(uniqueCategory);

        const normalizeBrand = (brand) => {
          if (!brand) return null;
          if (Array.isArray(brand)) {
            return brand.map((item) => (typeof item === 'object' ? item.name || item._id : item)).filter(Boolean);
          }
          return typeof brand === 'object' ? brand.name || brand._id : brand;
        };

        const allBrands = [];
        products.forEach((product) => {
          const values = normalizeBrand(product.brand);
          if (Array.isArray(values)) {
            allBrands.push(...values);
          } else if (values) {
            allBrands.push(values);
          }
        });
        const uniqueBrand = [...new Set(allBrands)];
        setAllBrand(uniqueBrand);

        const categoryBrands = [];
        products.forEach((product) => {
          if (product.brand) {
            const brandValues = normalizeBrand(product.brand);
            if (Array.isArray(brandValues)) {
              categoryBrands.push(...brandValues);
            } else if (brandValues) {
              categoryBrands.push(brandValues);
            }
          }
        });
        const uniqueBrandForCategory = [...new Set(categoryBrands)];
        setAllBrandForCategory(uniqueBrandForCategory);
      }
    })
    .catch((err) => {
      console.log("There is an error fetching products", err);
    });

    // Only fetch orders if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      const ordersURL = `${API_URL}/${ADMIN_ROUTE}/orders`;
      const orderConfig = { headers: { Authorization: `Bearer ${adminToken}` } };

      axios.get(ordersURL, orderConfig)
        .then((res) => {
          if (res.data.status) {
            setAllOrders(res.data.data);
          }
        })
        .catch((err) => {
          console.log("Error fetching orders (may require admin access):", err.message);
        });
    }
  }, []);


   

  return (
    <CategoryContext.Provider value={{ setAllCategory, allCategory, setallProduct, allProduct, publishedProduct, publishedCategory, allOrders, setAllOrders, allBrand, setAllBrand, allBrandForCategory, setAllBrandForCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider