// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Home from "../Components/home/home";
// import Cookies from "js-cookie";



// export const PrivateRoute = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // const getToken = ("authToken", true);
//     const getToken = Cookies.get("token");
//     console.log("Token from cookies", getToken);

//     if (!getToken) {
//       navigate("/");
//     }
//   }, [navigate]);

//   return (
//     <>
//       <Outlet />
//     </>
//   );
// };

// // export default PrivateRoute
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Token from cookies:", token);

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // ✅ Jab tak token verify ho raha hai, loading show karega
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
