import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import cardGif from '../images/creditCard.gif'
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'


const CARD_OPTIONS = {
	style: {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "20px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        icon: {
          color: "#0089BF",
        },
    },
};

function PaymentForm(props) {
    const db = getFirestore(app);
    const stripeURL = process.env.REACT_APP_STRIPEURL;

    const [success, setSuccess ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    const [showBtn, setShowBtn] = useState(true);
    const [failed, setFailed] = useState(false);
    const [bookingDates, setBookingDates] = useState([]);
    const [imageUpload, setImageUpload] = useState(props.imageUpload)
    const [showLoader, setShowLoader] = useState(false)
  

    useEffect(()=>{
      console.log("PAYMENT FORM: " + props.balance);
    },[props.balance])


  const handleSubmit = async (e) => {
    // ADD TWO-STEP VERIFICATION ON BUSY DATES HERE 
    // PROCESSING PAYMENT WITH STRPE
    e.preventDefault()
    const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)
    })
    if(!error) {
        try {
            const {id} = paymentMethod
            const response = await axios.post(stripeURL + "/paymentInflatables", {
              id,
              description: "INFLATABLE BOOKING", 
              amount: Math.floor(props.balance*100),
            })
            if (response.data.success) {
              console.log("Payment Successfull !");
              //  CREATE NEW RESERVATION HERE
              let data = {
                name: sessionStorage.getItem('name'),
                lastName: sessionStorage.getItem('lastName'),
                phone: sessionStorage.getItem('phone'),
                email: sessionStorage.getItem('email'),
                address: sessionStorage.getItem('address'),
                postalCode: sessionStorage.getItem('postalCode'),
                bookingDates: sessionStorage.getItem('bookingDates').split([',']),
                inflatableID: sessionStorage.getItem('infatableID')
              }
              const docRef = await addDoc(collection(db, "bookings"), data);
    
              //  SEND BOOKING CONFIMATION CLIENT & PROVIDER
            } else {
                console.log("ERROR ON PAYMENT", response);
              // SHOW ALERT OF ERROR ON PAYMENT 
            }
        } catch (error) {
          console.log("Error", error)
        }
    } else {
        console.log(error.message)
        // DISABLE LOADER
    }
  }


    return (
        <>
        <div className="paymentLoader" style={{display: showLoader? "block":"none"}}>
          <img src={cardGif} />
          <p> Procesing Payment ... </p>
        </div>
        {!success ? 
        <form onSubmit={handleSubmit}>
            <h3> Payment Details  </h3>
            <div className="card-details">
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS}/>
                    </div>
                </fieldset>
            </div>
            <div style={{display: failed? "block":"none"}}>
                <p id="failed"> *Payment Failed </p>
            </div>
            <div style={{display: showBtn? "block":"none"}}>
                {/* <button id="btnPay" onClick={()=>setShowLoader(true)}>Pay ${props.balance} USD</button> */}
                <button id="btnPay" >Pay ${props.balance} USD</button>
            </div>

        </form>
        :
       <div>
           <div className="paymentConfirmation">
                <i className="bi bi-check-circle-fill iconCheck"></i>
                <p> Payment Approved </p>
                <p> You Booking has been confirmed </p>
           </div>
       </div> 
        }     
      </>
    )
}

export default PaymentForm;


