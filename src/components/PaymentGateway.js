import React, { useEffect, useState } from 'react'
import StripeContainer from './StripeContainer'
import { useSearchParams } from 'react-router-dom'
import Inflatable from '../pages/Inflatable'


function PaymentGateway(props) {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [includeInsurance, setIncludeInsurance] = useState(false)
  const [onlyDeposit, setOnlyDeposit] = useState(false)
  const [balance, setBalance] = useState(0)
  const [disableCheck, setDisableCheck] = useState(false)
  const [balances, setBalances] = useState([])



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
      paid: balance
    };
    setBalances(newBalances);
  }, [props.total, props.balance, onlyDeposit, includeInsurance, balance]);
  

  

  
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
              <p> <b> Postal Code : </b> {sessionStorage.getItem('postalCode')}</p>
              <p><b> Dates : </b>
                {sessionStorage.getItem('bookingDates')
                  ? `${sessionStorage.getItem('bookingDates').split(',')[0]} to ${
                    sessionStorage.getItem('bookingDates').split(',')[sessionStorage.getItem('bookingDates').split(',').length - 1]
                  }`: 'Select dates'}
              </p>
              <p> <b> Total : </b> ${balance.toFixed(2)} USD</p>
            </div>
            </div>
            <div className='amount-options'>
              <p className={onlyDeposit ? "":"selected"} onClick={()=>setOnlyDeposit(false)}> Pay Full Amount </p>
              <p className={onlyDeposit ? "selected":""} onClick={()=>setOnlyDeposit(true)}> Pay Deposit Due ($100.00) </p>
            </div>
            <div className='damageWaiver'>
              <h4> Recommended </h4>
              <div className='three-col'>
                <input type='checkbox' disabled={disableCheck} checked={includeInsurance} onChange={()=>setIncludeInsurance(!includeInsurance)}/>              
                <p onClick={()=>setIncludeInsurance(!includeInsurance)}> Add 9% Accidental Damage Waiver </p>
                <i className={showDisclaimer ? "bi bi-chevron-up iconChev":"bi bi-chevron-down iconChev"} onClick={()=>setShowDisclaimer(!showDisclaimer)}></i>
              </div>
              <p id="disclaimer" style={{display: showDisclaimer? "block":"none"}}> We offer an optional 10% non-refundable damage waiver on all rental equipment. Lessee must select coverage, pay in full, and sign rental contract before the start of event for damage waiver to be bound. Acceptance of any and all claims that arise are based on sole discretion of Better Events Co. This Damage Waiver is NOT liability insurance. This Damage Waiver does NOT cover theft, vandalism, silly string, misuse, and/or abuse. This Damage Waiver does NOT cover missing equipment.</p>
            </div>
            <StripeContainer balance={balance.toFixed(2)} balances={balances}/>
        </div>        
    </div>
  )
}

export default PaymentGateway

