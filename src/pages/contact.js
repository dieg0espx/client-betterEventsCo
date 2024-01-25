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
          <p> We are committed to providing exceptional customer service and reliable solutions. We look forward to assisting you and ensuring your scaffolding needs are met to the highest standards. Your inquiries and feedback are valuable to us, so please don’t hesitate to reach out. </p>
          <p className='phone-mail'> <i className="bi bi-telephone-fill"></i> +1 (630) 370-7422</p>
          <p className='phone-mail'> <i className="bi bi-envelope-fill"></i> bettereventsnow@gmail.com </p>
        </div>
      </div>
      <img className='map' src={map3} alt='Map' />
      <Footer />
    </div>
  );
}

export default Contact;
