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
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [checkedRules, setCheckedRules] = useState(false)
  const [total, setTotal] = useState(0)
  const [specificTime, setSpecificTime] = useState('')

  // ==== UPDATING VARIABLES ==== //
  useEffect(()=>{
    if (onlyDeposit){ 
      setDisableCheck(true)
      setIncludeInsurance(false)
    } else {
      setDisableCheck(false)
    }

    // GETTING TOTALS 
    let sum = props.rent + deliveryFee + props.deliveryAmount + (props.rent * (props.tax/100)) 
    onlyDeposit ? sum = 100 : sum += 0
    includeInsurance ? sum += (props.rent * 0.09) : sum += 0
    setTotal(sum)
  })
  useEffect(()=>{
    sessionStorage.setItem('specificTime', specificTime)
  },[specificTime])
  useEffect(() => { 
    const newBalances = {
      rent: props.rent, 
      deliveryFee: deliveryFee, 
      deliveryAmount: props.deliveryAmount, 
      deposit: onlyDeposit ? 100 : 0,
      insurance: includeInsurance ? (props.rent * 0.09) : 0,
      tax: props.rent * (props.tax/100),
    };
    setBalances(newBalances);
  }, [props.total, props.rent, onlyDeposit, includeInsurance, balance, deliveryFee]);
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
    method:'Cash in Office',
    paid: paymentMethod == 1? false : true, 
    created: formatDateCreate(new Date()), 
    specificTime: specificTime
  }  
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
        data:data, 
        reservationID: id
    }), headers: {'Content-Type': 'application/json'}})
  }
  async function createInvoice(id){
    let invoiceData = {
      data:data,
      bookingId:id, 
    }
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);
    sendInvoiceEmail(docRef.id, id)
  }
  async function sendInvoiceEmail(id, bookingId){
    await fetch('https://better-stays-mailer.vercel.app/api/beinvoice', {
      // await fetch('http://localhost:4000/api/beinvoice', {
      method: 'POST',
      body: JSON.stringify({ 
        data:data, 
        invoiceId:id, 
        bookingId:bookingId
    }), headers: {'Content-Type': 'application/json'}})
  }

  function formatDateCreate(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}/${year} | ${hours}:${minutes}`;
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
              <p><b> Delivery Fee: </b>${props.deliveryAmount.toFixed(2)} USD </p> 
              <p> <b> TAX ({props.state}): </b>${(props.rent*(props.tax/100)).toFixed(2)} USD </p>
              <p> <b> Total : </b> ${total.toFixed(2)} USD</p>
            </div>
            </div>
            <div className='amount-options' style={{display:bookCompleted? "none":"grid"}}>
              <p className={onlyDeposit ? "":"selected"} onClick={()=>setOnlyDeposit(false)}> Pay Full Amount </p>
              <p className={onlyDeposit ? "selected":""} onClick={()=>setOnlyDeposit(true)}> Pay Deposit Due ($100.00) </p>
            </div>
            <div className='specific-time'>
              <h4> Specific Time Delivery </h4> 
              <p> Restrictions means we can deliver as early as 7am and pickup as late as midnight. Please call our office if you have any questions.</p>
              <div className='grid-specificTime'>
                <select onChange={(e)=>setDeliveryFee(parseInt(e.target.value))}>
                  <option value={0}> No restriction, no charge </option>
                  <option value={125}> YES - Must deliver at an exact time ($125.00)</option>
                  <option value={75}> YES - Must deliver within a 1 hour window ($75.00)</option>
                  <option value={50}> YES - You must deliver within a 2 hours or greater window ($50.00)</option>
                </select>
                <input type='time' onChange={(e)=> setSpecificTime(e.target.value)} value={specificTime}/>
              </div>
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
            <div className='paymentMethods'>
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
            </div>
            <div className='confirm-contract'>
              <input type='checkbox' checked={checkedRules} onChange={()=>setCheckedRules(!checkedRules)}/>              
              <p onClick={()=>setCheckedRules(!checkedRules)}> I have read and accept the <a href='/#/contract'>rules and restrictions.</a> </p>
            </div>
            <div style={{display: paymentMethod == 1 ? "none":"block"}}>
              <StripeContainer balance={balance} balances={balances} isInvoice={false} total={total}/>
              <div className='blocking-btn' style={{display: checkedRules? "none":"block"}}></div>
            </div>
            <div className='cashBookingConfirmation' style={{display: bookCompleted? "flex":"none"}}>
              <i className="bi bi-check-circle-fill iconConfirmation"></i>
              <div>
                <p>Your Booking has been confirmed</p>
                <p><b>Confirmation:</b> {reservationID}</p>
              </div>
            </div>
            <div style={{display: paymentMethod == 1 && !bookCompleted && checkedRules ? "block":"none"}}>
              <button id="btnPay" onClick={()=>createCashReservation()} > Book Now </button>
            </div>

        </div>        
    </div>
  )
}

export default PaymentGateway