import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './Pages/user/Register';
import Home from './Pages/Home';
import Signin from './Pages/user/Signin';
import UserDashboard from './Pages/user/Dashboard';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import Dashboard from './Pages/admin/adminPages/Dashboard'
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Customer from './Pages/admin/adminPages/Customer';
import CustomerDetails from './Pages/admin/adminPages/CustomerDetails'
import CategoryProvider from './CategoryContext';
import ProductPage from './Pages/admin/adminPages/ProductPage';
import FlashSales from './Pages/admin/adminPages/FlashSales';
import AddProduct from './Pages/admin/adminPages/AddProduct';
import ShopPage from './Pages/ShopPage';
import Landingpage from './Pages/Landingpage';
import Account from './Pages/user/Account';
import HomeDashboard from './Pages/user/HomeDashboard';
import UserProvider from './Pages/user/UserContext';
import Settings from './Pages/user/Settings';
import NotFound from './404';
import ShoppingCart from './Pages/ShoppingCart';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import OrderHistory from './Pages/user/OrderHistory';
import OrderDetails from './Pages/user/OrderDetails';
import Order from './Pages/admin/adminPages/Order';
import OrderInfo from './Pages/admin/adminPages/OrderInfo';
import OrderTrack from './Pages/OrderTrack';
import OrderTrackDetails from './Pages/OrderTrackDetails';
import Productdetails from './Pages/Productdetails';
import ScrollToTop from './components/ScrollToTop';
import Logout from './Pages/user/Logout';
import CustomerSupport from './Pages/CustomerSupport';
import AboutUs from './Pages/AboutUs';
import ForgotPassword from './Pages/user/ForgotPassword';
import ResetPassword from './Pages/user/ResetPassword';
import BrowsingHistory from './components/BrowsingHistory';
import Reviews from './Pages/admin/adminPages/Reviews';
import AdminOrderDetails from './Pages/admin/adminPages/OrderDetails';
import ReviewPage from './Pages/user/ReviewPage';
import AllReviews from './Pages/AllReviews';

const RouteWrapper = ({ children }) => {
  const location = useLocation();
  return React.cloneElement(children, { key: location.pathname });
};

const App = () => {
  const location = useLocation();
  
  return (
    <div>
      <ScrollToTop />

      <Routes>
          <Route path="/" element={
            <RouteWrapper>
              <CategoryProvider>
                <Home />
              </CategoryProvider>
            </RouteWrapper>
          }>
            <Route index element={<Landingpage />} />
            <Route path='/who-we-are' element={<AboutUs />} />
            <Route path='/store' element={<ShopPage />} />
            <Route path='/store/:name' element={
              <CategoryProvider>
                <Productdetails />
              </CategoryProvider>
            } />
            <Route path='/store/:name/reviews' element={<AllReviews />} />
            <Route path='/account/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/store/:categoryName' element={<ShopPage />} />
            <Route path='/order-tracking' element={<OrderTrack />} />
            <Route path='/order-tracking/:id' element={<OrderTrackDetails />} />
            <Route path='/shopping-cart' element={<ShoppingCart />} />
            <Route path='/customer-support' element={<CustomerSupport />} />
            <Route path='/shopping-cart/checkout' element={
              <UserProvider>
                <ProtectedRoute role="user">
                  <Checkout />
                </ProtectedRoute>
              </UserProvider>
            }
          />
          <Route
            path="/shopping-cart/checkout/payment-successful/:orderId"
            element={<PaymentSuccess />}
          />
          <Route
            path="/dashboard/"
            element={
              <UserProvider>
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              </UserProvider>
            }
          >
            <Route
              path="account"
              element={
                <UserProvider>
                  <HomeDashboard />
                </UserProvider>
              }
            />
            <Route
              path="browsing-history"
              element={
                <UserProvider>
                  <BrowsingHistory />
                </UserProvider>
              }
            />
            <Route
              path="order-history"
              element={
                <UserProvider>
                  <OrderHistory />
                </UserProvider>
              }
            />
            <Route
              path="order-history/:id"
              element={
                <UserProvider>
                  <OrderDetails />
                </UserProvider>
              }
            />
            <Route
              path="reviews"
              element={
                <UserProvider>
                  <ReviewPage />
                </UserProvider>
              }
            />
            <Route
              path="setting"
              element={
                <UserProvider>
                  <Settings />
                </UserProvider>
              }/>
              <Route path='logout' element={<Logout />} />
            </Route>
            <Route path='/account' element={<Account />}>
              <Route path="register" element={
                <PublicRoute><Register /></PublicRoute>
              } />
              <Route path="login" element={
                <PublicRoute><Signin /></PublicRoute>
              } />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Route>

        <Route path={`/${ADMIN_ROUTE}/login`} element={
          <PublicRoute><AdminLogin /></PublicRoute>
        } />

        <Route path={`/${ADMIN_ROUTE}/`} element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        }> 
          <Route path='dashboard' element={
            <CategoryProvider>
              <Dashboard />
            </CategoryProvider>
          }/>
          <Route path='orders' element={
            <CategoryProvider>
              <Order />
            </CategoryProvider>
          }/>
          <Route path='orders/view' element={
            <CategoryProvider>
              <AdminOrderDetails />
            </CategoryProvider>
          } />
          <Route path='orders/:id' element={
            <CategoryProvider>
              <AdminOrderDetails />
            </CategoryProvider>
          } />
          <Route path='reviews' element={
            <CategoryProvider>
              <Reviews />
            </CategoryProvider>
          }/>
          <Route path='customer' element={<Customer />} />
          <Route path='customer/view' element={<CustomerDetails />} />
          <Route path='products' element={ 
            <CategoryProvider>
              <ProductPage />
            </CategoryProvider>
          } />
          <Route path='products/add-product' element={ 
            <CategoryProvider>
              <AddProduct />
            </CategoryProvider>
          } />
          <Route path='product/add-product' element={ 
            <CategoryProvider>
              <AddProduct />
            </CategoryProvider>
          } />
          <Route path='flash-sales' element={
            <CategoryProvider>
              <FlashSales />
            </CategoryProvider>
          } />
        </Route>
      </Routes>
    </div>
  );
};

export default App;