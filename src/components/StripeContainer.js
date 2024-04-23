import React, { useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'

function StripeContainer(props) {
  let stripeTestPromise = loadStripe('pk_live_51P7PIzF0orXCw2C3qSDxcw56V43Q7utTV5lGHfbY374EAzuxJxEzQqaBuvqvPFq05GqqG95BdUxJNjOGdFBeatyu00VF9HjsvG');

  return (
    <div className='form-creditCard'>
      <Elements stripe={stripeTestPromise}>
          <PaymentForm  
          balance={props.balance} 
          total={props.total} 
          balances={props.balances}  
          includeInsurance={props.includeInsurance} 
          bookingId={props.bookingId} 
          isInvoice={props.isInvoice}
          invoiceId={props.invoiceId}
          />  
      </Elements>
    </div>
  )
}

export default StripeContainer
