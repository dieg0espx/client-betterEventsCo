import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import StripeContainer from '../components/StripeContainer'

function Invoice() {
    const [showDisclaimer, setShowDisclaimer] = useState(false)
    const [includeInsurance, setIncludeInsurance] = useState(false)

    // useEffect(() => { 
    //     document.body.style.backgroundColor = 'aliceblue';
    //   }, []);

      let invoice = {
        name:'Diego', 
        lastName:'Espinosa', 
        phone: '9999088639',
        email:'espinosa9mx@gmail.com', 
        address:'610 Granville St. Vancouver, BC', 
        dates: '02/02/2024 to 02/02/2024', 
        total:365, 
        inflatableName: 'Inflatable Name',
        inflatableImage:'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706645339/IMG_0310_lo2x9y.jpg', 
        paid:false
      }
      function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
        // Use the Intl.NumberFormat to format the number as currency
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
        });
      
        // Return the formatted currency string
        return formatter.format(amount);
      }
  return (
    <div className='container'>
        
        <div className='invoice'>
            <img className="headerImg" src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706048357/BetterEvents-10_eabusi_ys0lwn.png'} />
            <hr></hr>
            <div className='grid'>                        
                <div id="left">
                    <img src={invoice.inflatableImage} />
                    <p> <b>Full Name:</b> {invoice.name} {invoice.lastName} </p>
                    <p> <b>Phone:</b> {invoice.phone}</p>
                    <p> <b>Eamil:</b> {invoice.email}</p>
                    <p> <b>Address:</b> {invoice.address}</p>
                    <p> <b>Dates:</b> {invoice.dates}</p>
                </div>
                <div>
                    <h3 id="total"> {formatCurrency(includeInsurance?invoice.total *1.09 : invoice.total)} USD </h3>
                    <hr></hr>
                    <div className='damageWaiver'>
                        <h4> Recommended </h4>
                        <div style={{display:'flex', gap:'10px'}}>
                          <input type='checkbox' checked={includeInsurance} onChange={()=>setIncludeInsurance(!includeInsurance)}/>              
                          <p onClick={()=>setIncludeInsurance(!includeInsurance)}> Add 9% Accidental Damage Waiver </p>
                        </div>
                        <p id="disclaimer" style={{display: showDisclaimer? "block":"none"}}> We offer an optional 9% non-refundable damage waiver on all rental equipment. Lessee must select coverage, pay in full, and sign rental contract before the start of event for damage waiver to be bound. Acceptance of any and all claims that arise are based on sole discretion of Better Events Co. This Damage Waiver is NOT liability insurance. This Damage Waiver does NOT cover theft, vandalism, silly string, misuse, and/or abuse. This Damage Waiver does NOT cover missing equipment.</p>
                    </div>

                    <div className="paymentConfirmation" style={{display: invoice.paid ? "flex":"none"}}>
                      <i className="bi bi-check-circle-fill iconConfirmation"></i>
                      <div id="confirmation">
                        <p><b>Payment Approved</b></p> 
                        <p>You Invoice has been paid</p>
                      </div>
                    </div>
                    <div style={{display: !invoice.paid ? "flex":"none"}}>
                        <StripeContainer balance={(includeInsurance?invoice.total *1.09 : invoice.total).toFixed(2)} isInvoice={true}/>
                    </div>
                </div>                
            </div>
        </div>
    </div>
  )
}
export default Invoice