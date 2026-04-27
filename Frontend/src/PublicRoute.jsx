import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
const PUBLIC_PATHS = ['/account/login', '/account/register', `/${ADMIN_ROUTE}/login`, '/forgot-password'];

const PublicRoute = ({ children }) => {
  const location = useLocation();

  const isValidToken = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  // Restrict public pages for signed-in users (match startsWith for nested routes and query params)
  if (
    adminToken &&
    isValidToken(adminToken) &&
    PUBLIC_PATHS.some(path => location.pathname.startsWith(path))
  ) {
    return <Navigate to={`/${ADMIN_ROUTE}/dashboard`} replace />;
  }
  if (
    userToken &&
    isValidToken(userToken) &&
    PUBLIC_PATHS.some(path => location.pathname.startsWith(path))
  ) {
    return <Navigate to='/dashboard/account' replace />;
  }

  // Restrict admin routes for users
  if (
    userToken &&
    isValidToken(userToken) &&
    location.pathname.startsWith(`/${ADMIN_ROUTE}`)
  ) {
    return <Navigate to='/dashboard/account' replace />;
  }

  // Restrict user routes for admins
  if (
    adminToken &&
    isValidToken(adminToken) &&
    location.pathname.startsWith('/dashboard')
  ) {
    return <Navigate to={`/${ADMIN_ROUTE}/dashboard`} replace />;
  }

  return children;
};

export default PublicRoute;