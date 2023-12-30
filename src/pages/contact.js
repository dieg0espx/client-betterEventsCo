import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import map3 from '../images/map3.png'

function contact() {

  return (
    <div className='contact'>
        <Header />
        <div className='container1'>
            <div className='form'>
                <p className='subTitle'> Send us a Message</p>
                <input type='text' placeholder='First Name' />
                <input type='text' placeholder='Last Name' />
                <input type='tel' placeholder='Phone Number' />
                <input type='email' placeholder='Email Address' />
                <textarea rows={10}  type='text' placeholder='Message' />
                <button> Send Message </button>
            </div>
            <div className='details'>
                <p className='subTitle'> Contact Us</p>
                <p> We are committed to providing exceptional customer service and reliable solutions. We look forward to assisting you and ensuring your scaffolding needs are met to the highest standards. Your inquiries and feedback are valuable to us, so please don’t hesitate to reach out. </p>
                <p className='phone-mail'> <i className="bi bi-telephone-fill"></i> +1 (234) 567-890</p>
                <p className='phone-mail'> <i className="bi bi-envelope-fill"></i> example@mail.com </p>
            </div>
        </div>
        <img className="map" src={map3} />
        <Footer />
    </div>
  )
}

export default contact
