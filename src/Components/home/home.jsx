import React from "react";
import { Header } from "../header/Header";
import Footer from "../footer/footer";
import style from './home.module.css'

export default function Home() {
  return (
    <>
      {/* <div className={`${style.main}`}> */}
        {/* <div className={`${style.f}`}> */}
          <Header />
        {/* <div className={`${style.second}`}>hi</div> */}
        {/* </div> */}
      {/* </div> */}
      <Footer />
    </>
  );
}
