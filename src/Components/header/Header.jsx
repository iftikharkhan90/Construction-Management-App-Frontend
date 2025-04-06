import { useState } from "react";
import style from "./header.module.css";
import { useNavigate } from "react-router-dom";
import Building from "../../pages/building/building";
import Sanitary from "../../pages/sanitary/sanitary";
import Wood from "../../pages/wood/wood";
import Electricity from "../../pages/electricity/electricity";
import Aluminium from "../../pages/Aluminium/aluninium";
import Tiles from "../../pages/tiles/tiles";
import LabourersWages from "../../pages/labourer's wages/labourer'swages";
import Ceiling from "../../pages/ceiling/ceiling";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import OtherExpensives from "../../pages/Others/other";
import TotalExpensives from "../../pages/total expensives/total";
import Cards from "../card/card";

export const Header = () => {
  const [selectedPage, setSelectedPage] = useState("Building Material");
  const [showSidebar, setShowSidebar] = useState(false);
  const [childData, setChildData] = useState({});
  console.log("childata",childData);
  
  const handleAluminuim = (data) => {
    console.log("Received from aluminium:", data);
    setChildData(data);
  };
  const handleBuilding = (data) => {
    console.log("Received from building:", data);
    setChildData(data);
  };
  const handleSanitary = (data) => {
    console.log("Received from sanitary:", data);
    setChildData(data);
  };
  const handleWood = (data) => {
    console.log("Received from wood:", data);
    setChildData(data);
  };
  const handleElectricity = (data) => {
    console.log("Received from electricity:", data);
    setChildData(data);
  };
  const handleTiles = (data) => {
    console.log("Received from tiles:", data);
    setChildData(data);
  };
  const handleCeiling = (data) => {
    console.log("Received from ceiling:", data);
    setChildData(data);
  };
  const handleContructorsWages = (data) => {
    console.log("Received from constructors wages:", data);
    setChildData(data);
  };
  const handleOtherExpensives = (data) => {
    console.log("Received from ither expensives:", data);
    setChildData(data);
  };
  const handleTotalExpensives = (data) => {
    console.log("Received from total expensives:", data);
    setChildData(data);
  };

  const componentMapping = {
    "Building Material": <Building totalAmounts={handleBuilding} />,
    Sanitary: <Sanitary totalAmounts={handleSanitary} />,
    Wood: <Wood totalAmounts={handleWood}/>,
    Electricity: <Electricity totalAmounts={handleElectricity} />,
    Aluminium: <Aluminium totalAmounts={handleAluminuim} />,
    Tiles: <Tiles totalAmounts={handleTiles}/>,
    Ceilings: <Ceiling totalAmounts={handleCeiling} />,
    "Constructor's wages": <LabourersWages totalAmounts={handleContructorsWages}/>,
    "Other Expensives": <OtherExpensives totalAmounts={handleOtherExpensives}/>,
    "Total Expensives": <TotalExpensives totalAmounts={handleTotalExpensives}/>,
  };

  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove("token");
    toast.success("User Logout Successfully", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => navigate("/"),
    });
    navigate("/");
  };

  return (
    <div className={`d-flex ${style.zero}`}>
      <button
        className={style.sidebarToggle}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {/* Sidebar */}
      <div className={`${style.one} ${showSidebar ? style.showSidebar : ""}`}>
        <nav className="navbar navbar-expand-lg flex-column align-items-center vh-100 p-3">
          <ul
            className={`navbar-nav flex-column align-items-center w-100 ${style.itemHead}`}
          >
            <li className="nav-item">
              <a className="nav-link"></a>
            </li>
          </ul>

          <div className={`${style.ul}`}>
            {Object.keys(componentMapping).map((navItem, index) => (
              <div key={index}>
                <ul
                  className={`navbar-nav-item ${style.item} ${
                    selectedPage === navItem ? style.active : ""
                  }`}
                  onClick={() => {
                    setSelectedPage(navItem);
                    setShowSidebar(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <li className="nav-item">{navItem}</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-auto w-100">
            <button className="btn btn-danger" onClick={handleLogOut}>
              Logout
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`${style.two} text-center ${
          showSidebar ? style.hideTable : ""
        }`}
      >
        {selectedPage !== "Total Expensives" && <Cards childData = {childData} />}
        <div className="mb-3">{componentMapping[selectedPage]}</div>
      </div>
    </div>
  );
};
