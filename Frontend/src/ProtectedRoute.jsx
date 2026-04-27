import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const token = localStorage.getItem(role === 'admin' ? 'adminToken' : 'userToken');

  if (!token) {
    return <Navigate to={role === 'admin' ? `/${ADMIN_ROUTE}/login` : '/account/login'} replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem(role === 'admin' ? 'adminToken' : 'userToken');
      return <Navigate to={role === 'admin' ? `/${ADMIN_ROUTE}/login` : '/account/login'} replace state={{ from: location }} />;
    }
  } catch {
    localStorage.removeItem(role === 'admin' ? 'adminToken' : 'userToken');
    return <Navigate to={role === 'admin' ? `/${ADMIN_ROUTE}/login` : '/account/login'} replace state={{ from: location }} />;
  }

  if (role === 'admin' && localStorage.getItem('userToken')) {
    return <Navigate to="/dashboard/account" replace />;
  }

  if (role === 'user' && localStorage.getItem('adminToken')) {
    return <Navigate to={`/${ADMIN_ROUTE}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;