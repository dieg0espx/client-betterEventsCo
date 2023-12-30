import React, { useEffect, useState } from "react";
import tempLogo from "../images/tempLogo.png";
import { Link } from "react-router-dom";

function Header() {
    const [page, setPage] = useState(1)
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(()=>{
        let url = window.location.href
        if(url.includes('services')){
            setPage(2)
        } else if(url.includes('inflatables')){
            setPage(3)
        } else if(url.includes('contact')){
            setPage(4)
        } else {
            setPage(1)
        }
    },[])

  return (
    <div>
    <div className="header">
        <img src={tempLogo} onClick={()=>window.location.href="/"}/>
        <div className="navBtns">
            <Link className={page == 1 ? "btn active":"btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "btn active":"btn"} onClick={()=>setPage(2)} to="/services"> Services </Link>
            <Link className={page == 3 ? "btn active":"btn"} onClick={()=>setPage(3)} to="/"> Inflatables </Link>
            <Link className={page == 4 ? "btn active":"btn"} onClick={()=>setPage(4)} to="/contact"> Contact </Link>
        </div>
        <button className="nav-mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}><i className="bi bi-list"></i> </button>
      
        <div className="grid-inflatables">
            <Link className="inflatables-btns" to="/"> All Rentals </Link>
            <Link className="inflatables-btns" to="/"> Bounce Houses </Link>
            <Link className="inflatables-btns" to="/"> Combo Jumpers </Link>
            <Link className="inflatables-btns" to="/"> Slides </Link>
            <Link className="inflatables-btns" to="/"> Games & Obstacles </Link>
            <Link className="inflatables-btns" to="/"> Extras </Link>
        </div>
    </div>
    <div className="mobileMenu" style={{display: mobileMenu ? "flex":"none"}}>
            <Link className={page == 1 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(2)} to="/services"> Services </Link>
            <Link className={page == 3 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(3)} to="/"> Inflatables </Link>
            <Link className={page == 4 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(4)} to="/contact"> Contact </Link>
        </div>
    </div>

  );
}

export default Header;
