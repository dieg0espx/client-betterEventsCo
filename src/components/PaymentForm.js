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
    const [reservationID, setReservationID] = useState('')
  
    let data = {
      name: sessionStorage.getItem('name'),
      lastName: sessionStorage.getItem('lastName'),
      phone: sessionStorage.getItem('phone'),
      email: sessionStorage.getItem('email'),
      address: sessionStorage.getItem('address'),
      postalCode: sessionStorage.getItem('postalCode'),
      bookingDates: parseBookingDates(sessionStorage.getItem('bookingDates')),
      inflatableID: sessionStorage.getItem('infatableID'),
      inflatableName: sessionStorage.getItem('inflatableName'),
      inflatableImage : sessionStorage.getItem('imageInflatable'),
      total:props.total
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

    const handleSubmit = async (e) => {
      setShowBtn(false)
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
                setSuccess(true)
                //  CREATING NEW RESERVATION - FIREBASE
                const docRef = await addDoc(collection(db, "bookings"), data);
                setReservationID(docRef.id)
                // SENDING EMAIL RESERVATION - NODEMAILER 
                sendEmailConfirmation(docRef.id) 
              } else {
                  console.log("ERROR ON PAYMENT", response);
                  setShowBtn(true)
                  setFailed(true)
              }
          } catch (error) {
            console.log("Error", error)
            setShowBtn(true)
          }
      }
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
          postalCode: data.postalCode, 
          dates: data.bookingDates,
          reservationID: id,
          image: sessionStorage.getItem('imageInflatable'), 
          paid: props.balance, 
      }), headers: {'Content-Type': 'application/json'}})
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
                <p id="failed"> *Payment Failed, try again. </p>
            </div>
            <button id="btnPay" style={{display: showBtn? "block":"none"}}>Pay ${props.balance} USD</button>
        </form>
        :
       <div>
           <div className="paymentConfirmation">
                <i className="bi bi-check-circle-fill iconConfirmation"></i>
                <div id="confirmation">
                  <p> <b> Payment Approved </b></p>
                  <p> You Booking has been confirmed </p>
                  <p> <b> Confirmation: </b> {reservationID} </p>
                </div>
           </div>
           <button id="closePaymentGateway" onClick={()=>window.location.href = '/'}> Done  </button>
       </div> 
        }     
      </>
    )
}

export default PaymentForm;


