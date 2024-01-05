import React, { useEffect, useState } from 'react'
import StripeContainer from './StripeContainer'
import tempLogo from '../images/tempLogo.png'
import { useSearchParams } from 'react-router-dom'

function PaymentGateway(props) {
    
    useEffect(()=>{
        console.log(sessionStorage.getItem('name'));      
    })


  return (
    <div className='paymentGateway'>
        <div className='payment-popup'>
            <img src={tempLogo} />
            <h3> Booking Details</h3>
            <p> <b> Full Name : </b> {sessionStorage.getItem('name') + sessionStorage.getItem('lastName')}</p>
            <p> <b> Phone : </b> {sessionStorage.getItem('phone')}</p>
            <p> <b> Email : </b> {sessionStorage.getItem('email')}</p>
            <p> <b> Address : </b> {sessionStorage.getItem('address')}</p>
            <p> <b> Postal Code : </b> {sessionStorage.getItem('postalCode')}</p>
            <p> <b> Dates : </b> {sessionStorage.getItem('bookingDates').split(',')[0]} to {sessionStorage.getItem('bookingDates').split(',')[sessionStorage.getItem('bookingDates').split(',').length - 1]}</p>
            <StripeContainer balance={props.balance} />
        </div>        
    </div>
  )
}

export default PaymentGateway
