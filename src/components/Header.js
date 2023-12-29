import React, { useEffect, useState } from "react";
import tempLogo from "../images/tempLogo.png";
import { Link } from "react-router-dom";

function Header() {
    const [page, setPage] = useState(1)
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(()=>{
        console.log(page);
    },[page])

  return (
    <div className="header">
        <img src={tempLogo} />
        <div className="navBtns">
            <Link className={page == 1 ? "btn active":"btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "btn active":"btn"} onClick={()=>setPage(2)} to="/"> Services </Link>
            <Link className={page == 3 ? "btn active":"btn"} onClick={()=>setPage(3)} to="/"> Inflatables </Link>
            <Link className={page == 4 ? "btn active":"btn"} onClick={()=>setPage(4)} to="/"> Contact </Link>
        </div>
        <button className="nav-mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}><i className="bi bi-list"></i> </button>
        <div className="mobileMenu" style={{display: mobileMenu ? "flex":"none"}}>
            <Link className={page == 1 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(2)} to="/"> Services </Link>
            <Link className={page == 3 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(3)} to="/"> Inflatables </Link>
            <Link className={page == 4 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(4)} to="/"> Contact </Link>
        </div>
    </div>
  );
}

export default Header;
