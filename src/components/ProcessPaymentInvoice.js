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
    const [data, setData] = useState([])
    const [total, setTotal] = useState()
    const [paymentCompleted, setPaymentComepleted] = useState(false)


    useEffect(()=>{
      setData(props.data)
      setTotal(props.total)
    },[props.data, props.total])


    const handleSubmit = async (e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
              type: "card",
              card: elements.getElement(CardElement)
        })
        if(!error) {
          setShowLoader(true)
          setShowBtn(false)
          try {
              const {id} = paymentMethod
              const response = await axios.post(stripeURL + "/paymentInflatables", {
                id,
                description: "INVOICE - INFLATABLE BOOKING | Name: " + data.name + " LastName: " + data.lastName, 
                // amount: Math.floor(props.total*100),
                amount: Math.floor(100),
              })
              if (response.data.success) {
                  updatePaid()
                  setSuccess(true)
                  setPaymentComepleted(true)
              } else {
                  console.log("ERROR ON PAYMENT", response);
                  setShowBtn(true)
                  setFailed(true)
              }
          } catch (error) {
            setShowLoader(false)
            console.log("Error", error)
            setShowBtn(true)
          }
        } 
    }

    async function updatePaid(){
      const invoicesRef = doc(db, "invoices-test", props.id);
      await updateDoc(invoicesRef, {
        paid:true
      });
      const bookingRef = doc(db, "bookings-test", data.id);
      await updateDoc(bookingRef, {
        paid:true
      });
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
      <>
        <div className="paymentLoader" style={{display: showLoader? "block":"none"}}>
          <img src={cardGif} />
          <p> Procesing Payment ... </p>
        </div>
        {!success ? 
          <form onSubmit={handleSubmit} style={{display: data.paid ? "none" : "block"}}>
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
              <button id="btnPay" style={{display: showBtn? "block":"none"}}> <i className="bi bi-credit-card-2-front iconCard"></i>Pay {formatCurrency(total)} USD </button>
          </form>
        :
          <div>
            <div className='confirmation' style={{display: paymentCompleted? "flex":"none"}}>
              <i className="bi bi-calendar2-check iconCheck"></i>
              <h2> Payment Completed !</h2>
              <p> Thank you for choosing Better Events for your reservation. </p>
              <p> A confirmation email containing all the necessary information has been sent to {data.email}. </p>
            </div>
          </div>
        }     
      </>
    )
}

export default ProcessPayment