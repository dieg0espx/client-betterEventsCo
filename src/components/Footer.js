import React from 'react'
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className='footer'> 
      <div>
        <h1> Better Events </h1>
        <h2> Let the Better Events begin. </h2>
        <p> <i className="bi bi-telephone-fill iconPhone"></i>  +1 (630) 370-7422 </p>
        <p> <i className="bi bi-envelope-fill  iconMail"></i> bettereventsnow@gmail.com </p>
      </div>
      <div id="right">
            <p> <i className="bi bi-facebook iconFacebook"></i> <i className="bi bi-instagram iconInstagram"></i> </p>
            <div className='menu'>
                <Link className="footer-btn" to="/"> Home </Link>
                <Link className="footer-btn" to="/services"> Services </Link>
                <Link className="footer-btn" to="/"> Inflatables </Link>
                <Link className="footer-btn" to="/contact"> Contact </Link>
            </div>
      </div>
    </div>
  )
}

export default Footer
