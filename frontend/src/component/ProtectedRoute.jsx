import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constant/route";
import AuthContext from "../context/auth-context";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  // still checking auth state
  if (isLoading) return null;

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // role check (only if required)
  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    
    if (user?.role === "Doctor") {
      return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
    }

    if (user?.role === "Admin") {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }

    if (user?.role === "Patient") {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;