import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './redux/Cart'

export default configureStore({
  reducer: {
    cart: cartReducer
  }
})