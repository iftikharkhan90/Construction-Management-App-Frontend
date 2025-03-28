import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; 
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
