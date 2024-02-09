import React, {useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import Header from '../components/Header'
import StripeContainer from '../components/StripeContainer'
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'


function Invoice() {
    const [includeInsurance, setIncludeInsurance] = useState(false)
    const [invoice, setInvoice] = useState([])

    const db = getFirestore(app);
    const { id } = useParams();
    const scrollContainerRef = useRef(null);

    useEffect(()=>{
        getInvoice()
    },[])

    async function getInvoice(){
        let arrayInvoice = []
        const docRef = doc(db, "invoices", id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setInvoice(docSnap.data())
        } else {
          alert("Invoice Not Found :(")
        }
    }




    //   let invoice = {
    //     name:'Diego', 
    //     lastName:'Espinosa', 
    //     phone: '9999088639',
    //     email:'espinosa9mx@gmail.com', 
    //     address:'610 Granville St. Vancouver, BC', 
    //     dates: '02/02/2024 to 02/02/2024', 
    //     total:365, 
    //     inflatableName: 'Inflatable Name',
    //     inflatableImage:'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706645339/IMG_0310_lo2x9y.jpg', 
    //     paid:false
    //   }
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
            {Object.keys(invoice).length > 0 && (
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
                            <h3 id="total"> {formatCurrency(includeInsurance ? invoice.total * 1.09 : invoice.total)} USD </h3>
                            <hr></hr>
                            <div className='damageWaiver'>
                                <h4> Recommended </h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type='checkbox' checked={includeInsurance} onChange={() => setIncludeInsurance(!includeInsurance)} />
                                    <p onClick={() => setIncludeInsurance(!includeInsurance)}> Add 9% Accidental Damage Waiver </p>
                                </div>
                                <p id="disclaimer"> We offer an optional 9% non-refundable damage waiver on all rental equipment. Lessee must select coverage, pay in full, and sign rental contract before the start of the event for the damage waiver to be bound. Acceptance of any and all claims that arise is based on the sole discretion of Better Events Co. This Damage Waiver is NOT liability insurance. This Damage Waiver does NOT cover theft, vandalism, silly string, misuse, and/or abuse. This Damage Waiver does NOT cover missing equipment.</p>
                            </div>
    
                            <div className="paymentConfirmation" style={{ display: invoice.paid ? "flex" : "none" }}>
                                <i className="bi bi-check-circle-fill iconConfirmation"></i>
                                <div id="confirmation">
                                    <p><b>Payment Approved</b></p>
                                    <p>Your Invoice has been paid</p>
                                </div>
                            </div>
                            <div style={{ display: !invoice.paid ? "flex" : "none" }}>
                                <StripeContainer balance={(includeInsurance ? invoice.total * 1.09 : invoice.total).toFixed(2)} isInvoice={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )    
}
export default Invoice