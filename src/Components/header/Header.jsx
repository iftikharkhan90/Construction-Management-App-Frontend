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
// import Cookies from "js-cookie";
import { toast } from "react-toastify";
import OtherExpensives from "../../pages/Others/other";
import TotalExpensives from "../../pages/total expensives/total";
import Cards from "../card/card";
import Sale from "../../pages/sale/sale";

export const Header = () => {
  const [selectedPage, setSelectedPage] = useState("Building Material");
  const [showSidebar, setShowSidebar] = useState(false);
  const [tableLoaded, setTableLoaded] = useState(false);
  const [dataMap, setDataMap] = useState({
    "Building Material": {},
    Sanitary: {},
    Wood: {},
    Electricity: {},
    Aluminium: {},
    Tiles: {},
    Ceilings: {},
    "Constructor's wages": {},
    "Other Expensives": {},
    "Total Expensives": {},
  });
const handleUpdateData = (page, data) => {
   setDataMap(null);
  if (page && data) {
    
    const isEmpty =
      !data ||
      (typeof data === "object" &&
        Object.keys(data).length === 0 &&
        data.constructor === Object);
    setDataMap((prev) => ({
      ...prev,
      [page]: isEmpty
        ? { totalAmount: 0, payAmount: 0, remainingAmount: 0 }
        : data,
    }));
  }else {
    setDataMap(null);
  }
 };


  const componentMapping = {
    "Building Material": (
      <Building
        totalAmounts={(data) => handleUpdateData("Building Material", data)}
      />
    ),
    Sanitary: (
      <Sanitary totalAmounts={(data) => handleUpdateData("Sanitary", data)} />
    ),
    Wood: <Wood totalAmounts={(data) => handleUpdateData("Wood", data)} />,
    Electricity: (
      <Electricity
        totalAmounts={(data) => handleUpdateData("Electricity", data)}
      />
    ),
    Aluminium: (
      <Aluminium totalAmounts={(data) => handleUpdateData("Aluminium", data)} />
    ),
    Tiles: <Tiles totalAmounts={(data) => handleUpdateData("Tiles", data)} />,
    Ceilings: (
      <Ceiling totalAmounts={(data) => handleUpdateData("Ceilings", data)} />
    ),
    "Constructor's wages": (
      <LabourersWages
        totalAmounts={(data) => handleUpdateData("Constructor's wages", data)}
      />
    ),
    "Other Expensives": (
      <OtherExpensives
        totalAmounts={(data) => handleUpdateData("Other Expensives", data)}
      />
    ),
    "Total Expensives": (
      <TotalExpensives
        totalAmounts={(data) => handleUpdateData("Total Expensives", data)}
      />
    ),
    "Sale":(
      <Sale />
    )
  };

  const navigate = useNavigate();

  const handleLogOut = () => {
    // Cookies.remove("token");
    localStorage.removeItem("token");
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
        {!["Total Expensives", "Sale"].includes(selectedPage) && (
          <Cards childData={dataMap[selectedPage] || {}} />
        )}
        <div className="mb-3">{componentMapping[selectedPage]}</div>
      </div>
    </div>
  );
};
