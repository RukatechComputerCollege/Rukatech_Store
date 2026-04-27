import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';


export const CategoryContext = createContext()

const CategoryProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;

  const [allCategory, setAllCategory] = useState([])
  const [allProduct, setallProduct] = useState([])
  const [allOrders, setAllOrders] = useState([])

    useEffect(() => {
  let newURL = `${API_URL}/${ADMIN_ROUTE}/getCategoriesWithProducts`
      axios.get(newURL)
      .then((res) =>{
        if(res.data.status){
          setAllCategory(res.data.data)
        }
      })
      .catch((err) =>{
        console.log(err);
      })

  let allProductURL = `${API_URL}/${ADMIN_ROUTE}/getAllProducts`
      axios.get(allProductURL)
      .then((res) =>{
        if(res.data.status){
          setallProduct(res.data.data)
        }
      })
      .catch((err) =>{
        console.log("Error Encountered while fetching all product", err);
      })

  let ordersURL = `${API_URL}/${ADMIN_ROUTE}/orders`
      axios.get(ordersURL)
      .then((res) =>{
        if(res.data.status){
          setAllOrders(res.data.data);
        }
      })
      .catch((err) =>{
        console.log("There is an error fetching orders", err);
      })
    }, [])


   

  return (
    <CategoryContext.Provider value={{ setAllCategory, allCategory, setallProduct, allProduct, allOrders, setAllOrders }}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider