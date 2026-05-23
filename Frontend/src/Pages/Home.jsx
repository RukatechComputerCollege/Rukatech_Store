import React, { useRef } from "react";
import Adsbar from "../components/Adsbar";
import Tagnav from "../components/Tagnav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const adsbarRef = useRef(null);
  const tagnavRef = useRef(null);
  const navbarRef = useRef(null);
  const location = useLocation();

  return (
    <div key={location.key}>
      <div ref={adsbarRef}>
        <Adsbar />
      </div>
      <div ref={tagnavRef}>
        <Tagnav />
      </div>
      <div ref={navbarRef} className="sticky top-0 z-50 bg-white shadow-lg">
        <Navbar />
      </div>
      <BreadCrumb />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
