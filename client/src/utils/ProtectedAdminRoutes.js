import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedAdminRoutes = (props) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth.user);

  return isLoggedIn && role === "admin" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedAdminRoutes;
