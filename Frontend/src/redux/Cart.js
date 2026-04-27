import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItem: JSON.parse(localStorage.getItem('productCart')) || [],
  },
  reducers: {
    addToCart: (state, actions) => {
      state.cartItem.push(actions.payload)
      localStorage.setItem('productCart', JSON.stringify(state.cartItem));
    },
    removeFromCart : (state, actions) => {
      state.cartItem = state.cartItem.filter(item => item._id !==actions.payload._id);
      localStorage.setItem('productCart', JSON.stringify(state.cartItem));
    },
    updateQuantity: (state, action) =>{
      const { productId, quantity } = action.payload;
      const item = state.cartItem.find(item => item._id === productId);
      if(item){
        item.quantity = quantity;
      }
      localStorage.setItem('productCart', JSON.stringify(state.cartItem))
    },
    clearCart: (state) => {
      state.cartItem = [];
      localStorage.removeItem('productCart');
    }
  }
})

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions
export default cartSlice.reducer