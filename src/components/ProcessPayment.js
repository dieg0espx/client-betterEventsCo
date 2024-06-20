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
    
function ProcessPayment(props) {
    const db = getFirestore(app);
    const stripeURL = process.env.REACT_APP_STRIPEURL;
    const [success, setSuccess ] = useState(false)
    const stripe = useStripe() 
    const elements = useElements()
    const [showBtn, setShowBtn] = useState(true);
    const [failed, setFailed] = useState(false);
    const [showLoader, setShowLoader] = useState(false)
    const [confirmationID, setConfirmationID] = useState('')
    const [data, setData] = useState([])
    const [total, setTotal] = useState()
    const [bookCompleted, setBookCompleted] = useState(false)

    useEffect(()=>{
      setData(props.data)
      console.log(data);
      setTotal(props.total)
    },[props.data, props.total])


    const handleSubmit = async (e) => {
        setShowLoader(true)
        setShowBtn(false)
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
                  description: "INFLATABLE BOOKING | Name: " + data.name + " " + data.lastName, 
                  amount: Math.floor(props.total*100),
                  // amount: Math.floor(100),
                })
                if (response.data.success) {
                    setSuccess(true)
                    createReservation()
                    sessionStorage.removeItem('cart');
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

    async function createReservation(){
      console.log('CREATING RESERVATION ...');
        const docRef = await addDoc(collection(db, "bookings-test"), data);
        setConfirmationID(docRef.id) 
        if(sendEmailConfirmation(docRef.id)) {
            if(data.balances.deposit == 100){
              console.log('SHOULD SEND INVOICE ...');
                createInvoice(docRef.id)
              }
        }
    }

    async function sendEmailConfirmation(id) {
        console.log('SENDING MAIL CONFIRMATION ...');
      try {
          let response = await fetch('https://better-stays-mailer.vercel.app/api/bebookingConfirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  data: data,
                  reservationID: id
              })
          });
          setShowLoader(false)
          setBookCompleted(true)
          return response.status == 200 ? true : false;
      } catch (error) {
          console.error('Error sending email confirmation:', error);
          alert('Error sending email confirmation:', error)
          throw error;
      }
    }


    async function createInvoice(id){
        console.log('CREATING INVOICE ...');
        let invoiceData = {
          name: data.name, 
          lastName:data.lastName, 
          phone: data.phone, 
          email:data.email, 
          address:data.address, 
          paid: false, 
          bookingId:id
        }
        const docRef = await addDoc(collection(db, "invoices-test"), invoiceData);
        await sendInvoiceEmail(docRef.id, id)
    }

    async function sendInvoiceEmail(id, bookingId){
      try {
        let response = await fetch('https://better-stays-mailer.vercel.app/api/beinvoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              data:data, 
              invoiceId:id, 
              bookingId:bookingId
            })
        });

        return response.status == 200 ? true : false;
      } catch (error) {
          console.error('Error sending invoice:', error);
          alert('Error sending invoice:', error)
          throw error;
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
                <button id="btnPay" style={{display: showBtn? "block":"none"}}> <i className="bi bi-credit-card-2-front iconCard"></i>Pay ${total} USD </button>
            </form>
            :
            <div>
              <div className='confirmation' style={{display: bookCompleted? "flex":"none"}}>
                <i className="bi bi-calendar2-check iconCheck"></i>
                <h2> Your Booking is Completed !</h2>
                <p> Thank you for choosing Better Events for your reservation. </p>
                <p> A confirmation email containing all the necessary information has been sent to {data.email}. </p>

                <p> <b> Confirmation ID:</b> {confirmationID} </p>
              </div>
          </div>
          
            }     
          </>
    )
    }

export default ProcessPayment