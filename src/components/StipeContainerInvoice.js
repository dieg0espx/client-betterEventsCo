import React, { useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'
import ProcessPaymentInvoice from '../components/ProcessPaymentInvoice'

function StripeContainer(props) {
  let stripeTestPromise = loadStripe('pk_live_51P7PIzF0orXCw2C3qSDxcw56V43Q7utTV5lGHfbY374EAzuxJxEzQqaBuvqvPFq05GqqG95BdUxJNjOGdFBeatyu00VF9HjsvG');

  return (
    <div className='form-creditCard'>
      <Elements stripe={stripeTestPromise}>
          <ProcessPaymentInvoice 
            id={props.id}
            data={props.data}
            total={props.total}
          />  
      </Elements>
    </div>
  )
}

export default StripeContainer
