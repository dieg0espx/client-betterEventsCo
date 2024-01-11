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
        } else if(url.includes('inflatable')){
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
            <Link className={page == 3 ? "btn active":"btn"} onClick={()=>setPage(3)} to="/inflatables"> Inflatables </Link>
            <Link className={page == 4 ? "btn active":"btn"} onClick={()=>setPage(4)} to="/contact"> Contact </Link>
        </div>
        <button className="nav-mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}><i className="bi bi-list"></i> </button>
      
        <div className="grid-inflatables">
            <Link className="inflatables-btns" to="/inflatables?category=all-rentals"> All Rentals </Link>
            <Link className="inflatables-btns" to="/inflatables?category=bounce-houses"> Bounce Houses </Link>
            <Link className="inflatables-btns" to="/inflatables?category=combo-jumpers"> Combo Jumpers </Link>
            <Link className="inflatables-btns" to="/inflatables?category=slides"> Slides </Link>
            <Link className="inflatables-btns" to="/inflatables?category=games-and-obstacles"> Games & Obstacles </Link>
            <Link className="inflatables-btns" to="/inflatables?category=extras"> Extras </Link>
        </div>
    </div>
    <div className="mobileMenu" style={{display: mobileMenu ? "flex":"none"}}>
            <Link className={page == 1 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(2)} to="/services"> Services </Link>
            <Link className={page == 3 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(3)} to="/inflatables"> Inflatables </Link>
            <Link className={page == 4 ? "mobile-btn active":"mobile-btn"} onClick={()=>setPage(4)} to="/contact"> Contact </Link>
        </div>
    </div>

  );
}

export default Header;
