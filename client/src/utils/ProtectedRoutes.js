import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = (props) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return isLoggedIn ? (
   <Outlet/>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;