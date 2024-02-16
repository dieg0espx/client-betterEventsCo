import React, { useEffect, useState } from 'react'
import StripeContainer from './StripeContainer'
import { useSearchParams } from 'react-router-dom'
import Inflatable from '../pages/Inflatable'
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'

function PaymentGateway(props) {
  const db = getFirestore(app);
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [includeInsurance, setIncludeInsurance] = useState(false)
  const [onlyDeposit, setOnlyDeposit] = useState(false)
  const [balance, setBalance] = useState(0)
  const [disableCheck, setDisableCheck] = useState(false)
  const [balances, setBalances] = useState([])
  const [paymentMethod, setPaymentMethod] = useState(1)
  const [reservationID, setReservationID] = useState('') 
  const [bookCompleted, setBookCompleted] = useState(false)

  let data = {
    name: sessionStorage.getItem('name'),
    lastName: sessionStorage.getItem('lastName'),
    phone: sessionStorage.getItem('phone'),
    email: sessionStorage.getItem('email'),
    address: sessionStorage.getItem('address'),
    coordinates: sessionStorage.getItem('coordinates'),
    bookingDates: parseBookingDates(sessionStorage.getItem('bookingDates')),
    inflatableID: sessionStorage.getItem('infatableID'),
    inflatableName: sessionStorage.getItem('inflatableName'),
    inflatableImage : sessionStorage.getItem('imageInflatable'),
    balances:balances, 
    method:'Cash in Office'
  }

  useEffect(()=>{
    if (onlyDeposit){
      setBalance(100)
      setDisableCheck(true)
      setIncludeInsurance(false)
    } else {
      setDisableCheck(false)
      if(includeInsurance){
        setBalance(props.balance * 1.09)
      } else {
        setBalance(props.balance)
      }
    }
    
  })

  useEffect(() => { 
    const newBalances = {
      rent: props.total,
      insurance: includeInsurance ? props.total * 0.09 : 0,
      deposit: onlyDeposit ? 100 : 0,
      paid: paymentMethod == 1? 0:balance
    };
    setBalances(newBalances);
  }, [props.total, props.balance, onlyDeposit, includeInsurance, balance]);

  function parseBookingDates(bookingDatesString) {
    try {
      // Attempt to split the string into an array
      return bookingDatesString ? bookingDatesString.split(',') : [];
    } catch (error) {
      console.error("Error parsing booking dates:", error);
      return [];
    }
  }

  async function createCashReservation(){
    const docRef = await addDoc(collection(db, "bookings"), data);
    sendEmailConfirmation(docRef.id)
    setReservationID(docRef.id)
    if(onlyDeposit){
      createInvoice(docRef.id)
    }
    setBookCompleted(true)
  }
  async function sendEmailConfirmation(id){
    await fetch('https://better-stays-mailer.vercel.app/api/bebookingConfirmation', {
      method: 'POST',
      body: JSON.stringify({ 
        name : data.name, 
        lastName: data.lastName, 
        phone : data.phone, 
        email: data.email, 
        address : data.address, 
        dates: data.bookingDates,
        reservationID: id,
        image: sessionStorage.getItem('imageInflatable'), 
        paid: props.balance, 
    }), headers: {'Content-Type': 'application/json'}})
  }
  async function createInvoice(id){
    let invoiceData = {
      name: data.name, 
      lastName:data.lastName, 
      phone: data.phone, 
      email:data.email, 
      address:data.address, 
      dates:data.bookingDates, 
      total: data.balances.rent, 
      inflatableName:data.inflatableName, 
      inflatableImage: data.inflatableImage, 
      paid: false, 
      bookingId:id, 
    }
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);
    sendInvoiceEmail(docRef.id, id)
  }
  async function sendInvoiceEmail(id, bookingId){
    await fetch('https://better-stays-mailer.vercel.app/api/beinvoice', {
      method: 'POST',
      body: JSON.stringify({ 
        name: data.name, 
        lastName:data.lastName, 
        phone: data.phone, 
        email:data.email, 
        address:data.address, 
        dates:data.bookingDates, 
        total: data.balances.rent, 
        inflatableName:data.inflatableName, 
        inflatableImage: data.inflatableImage, 
        paid: false, 
        invoiceId:id, 
        bookingId:bookingId
    }), headers: {'Content-Type': 'application/json'}})
  }
  

  
  return (
    <div className='paymentGateway'>
        <div className='payment-popup'>
            <img src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705007222/BetterEvents-01_jywxx8.png'} id="logo"/>
            <h3> Booking Details</h3>
            <div className='bookingDetails'>
              <img src={sessionStorage.getItem('imageInflatable')} id="inflatable" />
            <div>
              <p> <b> Full Name : </b> {sessionStorage.getItem('name') + " " +  sessionStorage.getItem('lastName')}</p>
              <p> <b> Phone : </b> {sessionStorage.getItem('phone')}</p>
              <p> <b> Email : </b> {sessionStorage.getItem('email')}</p>
              <p> <b> Address : </b> {sessionStorage.getItem('address')}</p>
              <p><b> Dates : </b>
                {sessionStorage.getItem('bookingDates')
                  ? `${sessionStorage.getItem('bookingDates').split(',')[0]} to ${
                    sessionStorage.getItem('bookingDates').split(',')[sessionStorage.getItem('bookingDates').split(',').length - 1]
                  }`: 'Select dates'}
              </p>
              <p> <b> Total : </b> ${balance.toFixed(2)} USD</p>
            </div>
            </div>
            <div className='amount-options' style={{display:bookCompleted? "none":"grid"}}>
              <p className={onlyDeposit ? "":"selected"} onClick={()=>setOnlyDeposit(false)}> Pay Full Amount </p>
              <p className={onlyDeposit ? "selected":""} onClick={()=>setOnlyDeposit(true)}> Pay Deposit Due ($100.00) </p>
            </div>
            <div className='damageWaiver' style={{display:bookCompleted? "none":"block"}}>
              <h4> Recommended </h4>
              <div className='three-col'>
                <input type='checkbox' disabled={disableCheck} checked={includeInsurance} onChange={()=>setIncludeInsurance(!includeInsurance)}/>              
                <p onClick={()=>setIncludeInsurance(!includeInsurance)}> Add 9% Accidental Damage Waiver </p>
                <i className={showDisclaimer ? "bi bi-chevron-up iconChev":"bi bi-chevron-down iconChev"} onClick={()=>setShowDisclaimer(!showDisclaimer)}></i>
              </div>
              <p id="disclaimer" style={{display: showDisclaimer? "block":"none"}}> We offer an optional 9% non-refundable damage waiver on all rental equipment. Lessee must select coverage, pay in full, and sign rental contract before the start of event for damage waiver to be bound. Acceptance of any and all claims that arise are based on sole discretion of Better Events Co. This Damage Waiver is NOT liability insurance. This Damage Waiver does NOT cover theft, vandalism, silly string, misuse, and/or abuse. This Damage Waiver does NOT cover missing equipment.</p>
            </div>            
            <div className='paymentMethod' onClick={()=>setPaymentMethod(1)} style={{display:bookCompleted? "none":"flex"}}>
              <i className="bi bi-check-lg iconCheck" style={{backgroundColor: paymentMethod == 1? "#0089BF":"white", border: paymentMethod == 1? "none":"1px solid gray"}}></i>
              <i className="bi bi-cash-stack iconCash"></i>
              <p> Pay in Office </p>
            </div>
            <div className='paymentMethod' onClick={()=>setPaymentMethod(2)} style={{display:bookCompleted? "none":"flex"}}>
              <i className="bi bi-check-lg iconCheck" style={{backgroundColor: paymentMethod == 1? "White":"#0089BF", border: paymentMethod == 1? "1px solid lightgray":"none"}}></i>
              <i className="bi bi-credit-card-2-front iconCash"></i>
              <p> Credit Card </p>
            </div>
            <div style={{display: paymentMethod == 1 ? "none":"block"}}>
              <StripeContainer balance={balance.toFixed(2)} balances={balances} isInvoice={false}/>
            </div>
            <div className='cashBookingConfirmation' style={{display: bookCompleted? "flex":"none"}}>
              <i className="bi bi-check-circle-fill iconConfirmation"></i>
              <div>
                <p>Your Booking has been confirmed</p>
                <p><b>Confirmation:</b> {reservationID}</p>
              </div>
            </div>
            <div style={{display: paymentMethod == 1 && !bookCompleted ? "block":"none"}}>
              <button id="btnPay" onClick={()=>createCashReservation()}> Book Now </button>
            </div>

        </div>        
    </div>
  )
}

export default PaymentGateway

