import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import map3 from '../images/map3.png';

function Contact() {
  const [message, setMessage] = useState({ name: '', lastName: '', phone: '', email: '', message: ''});


  const scrollContainerRef = useRef(null);
  useEffect(()=>{
    window.scrollTo(0, 0);
    scrollContainerRef.current.scrollTop = 0;
  },[])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value
    }));
  };
  
  const sendMessage = async (e) => {
    e.preventDefault();
    await fetch('https://better-stays-mailer.vercel.app/api/contactForm', {
      method: 'POST',
      body: JSON.stringify({
        name: message.name,
        lastName: message.lastName,
        email: message.email,
        phone: message.phone,
        message: message.message
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Message sent succesfully')
    setMessage({ name: '', lastName: '', phone: '', email: '', message: ''})
  };

  function handlePhoneClick(){
    const phoneNumber = '+18152009715';
    const phoneLink = `tel:${phoneNumber}`
    window.location.href = phoneLink;
  };

  function handleEmailClick(){
    const emailAddress = 'bettereventsnow@gmail.com';
    const mailtoLink = `mailto:${emailAddress}`
    window.location.href = mailtoLink;
  };

  function openOfficeMaps(){
    window.open('https://maps.app.goo.gl/jBSFwTMirQuWERaF7', '_blank');
  }

  return (
    <div className='contact' ref={scrollContainerRef}>
      <Header />
      <div className='container1'>
        <div className='form'>
          <p className='subTitle'> Send us a Message</p>
          <form onSubmit={sendMessage}>
            <input type='text' name='name' value={message.name} onChange={handleInputChange} placeholder='First Name' />
            <input  type='text'  name='lastName'  value={message.lastName}  onChange={handleInputChange}  placeholder='Last Name'/>
            <input type='tel' name='phone' value={message.phone} onChange={handleInputChange} placeholder='Phone Number'/>
            <input type='email' name='email' value={message.email} onChange={handleInputChange} placeholder='Email Address'/>
            <textarea rows={10} name='message' value={message.message} onChange={handleInputChange} placeholder='Message'></textarea>
            <button type='submit'> Send Message </button>
          </form>
        </div>
        <div className='details'>
          <p className='subTitle'> Contact Us</p>
          <p> We are committed to providing exceptional customer service and reliable solutions. We look forward to assisting you and ensuring your needs are met to the highest standards. Your inquiries and feedback are valuable to us, so please don’t hesitate to reach out. </p>
          <p className='phone-mail' onClick={()=>handlePhoneClick()}> <i className="bi bi-telephone-fill"></i> +1 (815) 200 9715</p>
          <p className='phone-mail' onClick={()=>handleEmailClick()}> <i className="bi bi-envelope-fill"></i> bettereventsnow@gmail.com </p>
          <p className='phone-mail' onClick={()=>openOfficeMaps()}> <i className="bi bi-geo-alt"></i> 4911 Hydraulic Rd, Rockford, Il, United States. </p>
        </div>
      </div>
      <iframe 
        className='map'
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2954.424101747505!2d-89.02038680000001!3d42.2267517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8808c0ac7d9bbbe9%3A0x2a674606ef32d3f4!2s4911%20Hydraulic%20Rd%2C%20Rockford%2C%20IL%2061109%2C%20USA!5e0!3m2!1sen!2sca!4v1708306043523!5m2!1sen!2sca"
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
      <Footer />
    </div>
  );
}

export default Contact;
