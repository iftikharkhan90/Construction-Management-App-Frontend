import { Route, Routes } from "react-router-dom";
import React from "react";
import Login from "../auth/login/login";
import SignIn from "../auth/signIn/signIn";
import Home from "../Components/home/home";
import Building from "../pages/building/building";
import Ceiling from "../pages/ceiling/ceiling";
import Electricity from "../pages/electricity/electricity";
import LabourersWages from "../pages/labourer's wages/labourer'swages";
import Sanitary from "../pages/sanitary/sanitary";
import Tiles from "../pages/tiles/tiles";
import Wood from "../pages/wood/wood";
import Aluminium from "../pages/Aluminium/aluninium";
import  PrivateRoute  from "./PrivateRoutes";
// import { PrivateRoute } from "./PrivateRoutes";

export default function LogRoutes() {

  

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign" element={<SignIn />} />
      {/* <Route path="/home" element={<Home />} /> */}
      <Route  element={<PrivateRoute />} >
        <Route path="/home" element={<Home/>}  />
      </Route>





      <Route path="/aluminium" element={<Aluminium />} />
      <Route path="/building" element={<Building />} />
      <Route path="/ceiling" element={<Ceiling />} />
      <Route path="/electricity" element={<Electricity />} />
      <Route path="/wages" element={<LabourersWages />} />
      <Route path="/sanitary" element={<Sanitary />} />
      <Route path="/tiles" element={<Tiles />} />
      <Route path="/wood" element={<Wood />} />
    </Routes>
  );
}
