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
    const [total, setTotal] = useState(0)
    const [data, setData] = useState()

    useEffect(()=>{
      setData(props.data)
      console.log(props.data);
    },[])

    useEffect(()=>{
      if(data.length >0){
        let tot = data.total;
        setTotal(tot)
      }
    },[data])
  

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
                // amount: Math.floor(props.total*100),
                amount: Math.floor(100),
              })
              if (response.data.success) {
                setSuccess(true)
                if(props.isInvoice){
                  updateBalances(props.bookingId)
                } else {
                  createReservation()
                }
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
          dates: data.bookingDates,
          reservationID: id,
          image: sessionStorage.getItem('imageInflatable'), 
          paid: props.balance, 
      }), headers: {'Content-Type': 'application/json'}})
    }
    async function createInvoice(id){
      let invoiceData = {
        name: data.name, 
        lastName:data.lastName, 
        phone: data.phone, 
        email:data.email, 
        address:data.address, 
        dates:data.bookingDates, 
        total: data.balances.rent, 
        inflatableName:data.inflatableName, 
        inflatableImage: data.inflatableImage, 
        paid: false, 
        bookingId:id
      }
      const docRef = await addDoc(collection(db, "invoices"), invoiceData);
      sendInvoiceEmail(docRef.id, id)
    }
    async function sendInvoiceEmail(id, bookingId){
      await fetch('https://better-stays-mailer.vercel.app/api/beinvoice', {
        method: 'POST',
        body: JSON.stringify({ 
          name: data.name, 
          lastName:data.lastName, 
          phone: data.phone, 
          email:data.email, 
          address:data.address, 
          dates:data.bookingDates, 
          total: data.balances.rent, 
          inflatableName:data.inflatableName, 
          inflatableImage: data.inflatableImage, 
          paid: false, 
          invoiceId:id, 
          bookingId:bookingId
      }), headers: {'Content-Type': 'application/json'}})
    }
    async function updateBalances() {
      const bookingsRef = doc(db, "bookings", props.bookingId);
      await updateDoc(bookingsRef, {
        'balances.deposit': parseFloat(100),
        'balances.insurance': props.includeInsurance ? parseFloat(props.balance * 0.09) : 0,
        'balances.paid': props.includeInsurance ? parseFloat(props.balance * 1.09) + 100 : parseFloat(props.balance) + 100,
        'balances.rent': parseFloat(props.balance)
      });

      const invoicesRef = doc(db, "invoices", props.invoiceId);
      await updateDoc(invoicesRef, {
        paid:true
      });
    }    
    async function createReservation(){
      const docRef = await addDoc(collection(db, "bookings"), data);
      setReservationID(docRef.id) 
      // SENDING EMAIL RESERVATION - NODEMAILER 
      sendEmailConfirmation(docRef.id) 
      // CREATING NEW INVOICE IF ITS NOT FULLY PAID
      if(data.balances.deposit == 100){
        createInvoice(docRef.id)
      }
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
        <>
        <div className="paymentLoader" style={{display: showLoader? "block":"none"}}>
          <img src={cardGif} />
          <p> Procesing Payment ... </p>
        </div>
        {!success ? 
        <form onSubmit={handleSubmit}>
            <h3 id='title-paymentDetails'> Payment Details  </h3>
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
            <button id="btnPay" style={{display: showBtn? "block":"none"}}>Pay ${data.total.toFixed(2)} USD</button>
        </form>
        :
        <div>
          {props.isInvoice}
        <div style={{ display: props.isInvoice ? "block" : "none" }}>
          <div className="paymentConfirmation">
            <i className="bi bi-check-circle-fill iconConfirmation"></i>
            <div id="confirmation">
              <p><b>Payment Approved</b></p> 
              <p>You Invoice has been paid</p>
            </div>
          </div>
        </div>
        <div style={{ display: props.isInvoice ? "none" : "block" }}>
          <div className="paymentConfirmation">
            <i className="bi bi-check-circle-fill iconConfirmation"></i>
            <div id="confirmation">
              <p><b>Payment Approved</b></p>
              <p>Your Booking has been confirmed</p>
              <p><b>Confirmation:</b> {reservationID}</p>
            </div>
          </div>
          <button id="closePaymentGateway" onClick={() => window.location.href = '/'}>Done</button>
        </div>
      </div>
      
        }     
      </>
    )
}

export default PaymentForm;


