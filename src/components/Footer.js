import { logEvent } from 'firebase/analytics';
import React from 'react'
import { Link } from "react-router-dom";


function Footer() {
  
    function handleEmailClick(){
      const emailAddress = 'bettereventsnow@gmail..com';
      const mailtoLink = `mailto:${emailAddress}`
      window.location.href = mailtoLink;
    };
    function handlePhoneClick(){
      const phoneNumber = '+18152009715';
      const phoneLink = `tel:${phoneNumber}`
      window.location.href = phoneLink;
    };
    function openOfficeMaps(){
      window.open('https://maps.app.goo.gl/jBSFwTMirQuWERaF7', '_blank');
    }

  return (
    <div className='footer'> 
      <div>
        <img className="logo" src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705007222/BetterEvents-02_gqzykd.png'} />
        <h2>Making every event better </h2>
        <p onClick={()=>handlePhoneClick()}> <i className="bi bi-clock iconPhone"></i>  Mon - Sat: 8am - 5pm </p>
        <p onClick={()=>handlePhoneClick()}> <i className="bi bi-telephone-fill iconPhone"></i>  +1 (815) 200 9715 </p>
        <p onClick={()=>handleEmailClick()}> <i className="bi bi-envelope-fill  iconMail"></i> bettereventsnow@gmail.com </p>
        <p onClick={()=>openOfficeMaps()}> <i className="bi bi-geo-alt  iconMail"></i> 4911 Hydraulic Rd, Rockford, Il, 61109.</p>
      </div>
      <div id="right">
            <p> <i className="bi bi-facebook iconFacebook"></i> <i className="bi bi-instagram iconInstagram" onClick={()=>window.location.href="https://www.instagram.com/bettereventsnow/?igsh=a214Ynpwcmxhbmgy"}></i> </p>
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
