import React, { useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'

function StripeContainer(props) {
  let stripeTestPromise = loadStripe('pk_test_51NJ0hELJsUTWMJlYFPcEXiY8E43Kfrj5ecnpYpKIACSLxPCqsdPhYPaaT0knoPmt4wFQERjyolMHJIPrkvnAH1VI00VHrT8oeq');

  useEffect(()=>{
    console.log("STRIPE CONTAINER: " + props.balance);
  },[props.balance])

  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm 
          balance={props.balance} 
        />
    </Elements>
  )
}

export default StripeContainer
