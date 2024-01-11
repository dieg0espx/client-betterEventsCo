import React, { useEffect, useState } from "react";
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
        <img src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705007222/BetterEvents-01_jywxx8.png'} onClick={()=>window.location.href="/"}/>
        <div className="navBtns">
            <Link className={page == 1 ? "btn active":"btn"} onClick={()=>setPage(1)} to="/"> Home </Link>
            <Link className={page == 2 ? "btn active":"btn"} onClick={()=>setPage(2)} to="/services"> Services </Link>
            <Link className={page == 3 ? "btn active":"btn"} onClick={()=>setPage(3)} to="/inflatables"> Inflatables </Link>
            <Link className={page == 4 ? "btn active":"btn"} onClick={()=>setPage(4)} to="/contact"> Contact </Link>
        </div>
        <button className="nav-mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}><i className="bi bi-list"></i> </button>
      
        <div className="grid-inflatables">
            <Link className="inflatables-btns" to="/inflatables/all-rentals"> All Rentals </Link>
            <Link className="inflatables-btns" to="/inflatables/bounce-houses"> Bounce Houses </Link>
            <Link className="inflatables-btns" to="/inflatables/combo-jumpers"> Combo Jumpers </Link>
            <Link className="inflatables-btns" to="/inflatables/slides"> Slides </Link>
            <Link className="inflatables-btns" to="/inflatables/games-and-obstacles"> Games & Obstacles </Link>
            <Link className="inflatables-btns" to="/inflatables/extras"> Extras </Link>
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
