

// export const Header = () => {
//   const [selectedPage, setSelectedPage] = useState("Building Material");

//   const componentMapping = {
//     "Building Material": <Building />,
//     Sanitary: <Sanitary />,
//     Wood: <Wood />,
//     Electricity: <Electricity />,
//     Aluminium: <Aluminium />,
//     Tiles: <Tiles />,
//     Ceilings: <Ceiling />,
//     "Labourer's wages": <LabourersWages />,
//   };

//   return (
//     <div className={`d-flex ${style.zero}`}>
//       {/* Sidebar */}
//       <div className={`${style.one}`}>
//         <div className={`flex-column justify-content-end ${style.head}`}>
//           <nav className="navbar navbar-expand-lg flex-column align-items-center vh-100 p-3">
//             <ul
//               className={`navbar-nav flex-column align-items-center w-100 ${style.itemHead}`}
//             >
//               <li className="nav-item">
//                 <a className="nav-link">
//                   <h1>Dashboard</h1>
//                 </a>
//               </li>
//             </ul>

//             <div className={`${style.ul}`}>
//               {Object.keys(componentMapping).map((navItem, index) => (
//                 <div key={index}>
//                   <ul
//                     className={`navbar-nav-item ${style.item}  ${
//                       selectedPage === navItem ? style.active : ""
//                     }`}
//                     onClick={() => setSelectedPage(navItem)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <li className="nav-item">
//                         {navItem}
//                     </li>
//                   </ul>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-auto w-100">
//               <Link to={"/"} className="btn btn-danger">
//                 Logout
//               </Link>
//             </div>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className={`${style.two} text-center`}>
//         <div className="p-5">{componentMapping[selectedPage]}</div>
//       </div>
//     </div>
//   );
// };



import { useState } from "react";
import style from "./header.module.css";
import { Link, useNavigate } from "react-router-dom";
import Building from "../../pages/building/building";
import Sanitary from "../../pages/sanitary/sanitary";
import Wood from "../../pages/wood/wood";
import Electricity from "../../pages/electricity/electricity";
import Aluminium from "../../pages/Aluminium/aluninium";
import  Tiles  from "../../pages/tiles/tiles";
import LabourersWages from "../../pages/labourer's wages/labourer'swages";
import  Ceiling  from "../../pages/ceiling/ceiling";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

export const Header = () => {
  const [selectedPage, setSelectedPage] = useState("Building Material");
  const [showSidebar, setShowSidebar] = useState(false);

  const componentMapping = {
    "Building Material": <Building />,
    Sanitary: <Sanitary />,
    Wood: <Wood />,
    Electricity: <Electricity />,
    Aluminium: <Aluminium />,
    Tiles: <Tiles />,
    Ceilings: <Ceiling />,
    "Labourer's wages": <LabourersWages />,
  };
 
  const navigate = useNavigate()
  const handleLogOut = ()=>{
    const del = Cookies.remove("token")
toast.success("User Logout Successfully", {
  position: "top-center",
  autoClose: 2000, 
  onClose: () => navigate("/"), 
});    console.log(del);
    navigate('/')
    
  }

  return (
    <div className={`d-flex ${style.zero}`}>
      {/* Sidebar Toggle Button (Visible Only on Small Screens) */}
      <button
        className={style.sidebarToggle}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {/* Sidebar */}
      <div className={`${style.one} ${showSidebar ? style.showSidebar : ""}`}>
        <div className={`flex-column justify-content-end ${style.head}`}>
          <nav className="navbar navbar-expand-lg flex-column align-items-center vh-100 p-3">
            <ul
              className={`navbar-nav flex-column align-items-center w-100 ${style.itemHead}`}
            >
              <li className="nav-item">
                <a className="nav-link">
                  <h1>Dashboard</h1>
                </a>
              </li>
            </ul>

            <div className={`${style.ul}`}>
              {Object.keys(componentMapping).map((navItem, index) => (
                <div key={index}>
                  <ul
                    className={`navbar-nav-item ${style.item}  ${
                      selectedPage === navItem ? style.active : ""
                    }`}
                    onClick={() => {
                      setSelectedPage(navItem);
                      setShowSidebar(false); // Hide sidebar after selection
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <li className="nav-item">{navItem}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-auto w-100">
              <button className="btn btn-danger"  onClick={handleLogOut}>
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`${style.two} text-center ${
          showSidebar ? style.hideTable : ""
        }`}
      >
        <div className="p-5">{componentMapping[selectedPage]}</div>
      </div>
    </div>
  );
};
