import React, {useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import Header from '../components/Header'
import StripeContainer from '../components/StripeContainer'
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'
import { isElement } from 'react-dom/test-utils';


function Invoice() {
    const [includeInsurance, setIncludeInsurance] = useState(false)
    const [invoice, setInvoice] = useState([])
    const [total, setTotal] = useState(0)

    const db = getFirestore(app);
    const { id } = useParams();
    const scrollContainerRef = useRef(null);

    useEffect(()=>{
        getInvoice()
    },[])

    useEffect(() => {
        if (!isEmpty(invoice)) {
            let deliveryAmount = invoice.balances?.deliveryAmount || 0; // Use optional chaining (?.) to handle undefined properties
            let deliveryFee = invoice.balances?.deliveryFee || 0;
            let deposit = invoice.balances?.deposit || 0;
            let insurance = invoice.balances?.insurance || 0;
            let rent = invoice.balances?.rent || 0;
            let tax = invoice.balances?.tax || 0;
            let sum = deliveryAmount + deliveryFee + deposit + insurance + rent + tax;
            setTotal(sum);
            console.log(sum);
        }
    }, [invoice]);
    

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    async function getInvoice(){
        const docRef = doc(db, "invoices", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setInvoice(docSnap.data())
        } else {
          alert("Invoice Not Found :(")
        }
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
        <div className='container invoice-page'>
            {Object.keys(invoice).length > 0 && (
                <div className='invoice'>
                    <img className="headerImg" src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706048357/BetterEvents-10_eabusi_ys0lwn.png'} />
                    <hr></hr>
                    <div className='grid'>                        
                        <div id="left">
                            <img src={invoice.data.inflatableImage} />
                            <p> <b>Full Name:</b> {invoice.data.name} {invoice.data.lastName} </p>
                            <p> <b>Phone:</b> {invoice.data.phone}</p>
                            <p> <b>Eamil:</b> {invoice.data.email}</p>
                            <p> <b>Address:</b> {invoice.data.address}</p>
                            <p> <b>Dates:</b> {invoice.data.bookingDates}</p>
                        </div>
                        <div>
                            <h3 id="total"> {formatCurrency(includeInsurance ? (total * 1.09) : total)} USD </h3>
                            <hr></hr>
                            <div className='damageWaiver' style={{ display: !invoice.paid ? "block" : "none" }}>
                                <h4> Recommended </h4>
                                <div className='grid-check'>
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
                                <StripeContainer 
                                    balance={(includeInsurance ? total * 1.09 : total).toFixed(2)} 
                                    isInvoice={true} 
                                    includeInsurance={includeInsurance} 
                                    bookingId={invoice.bookingId}
                                    invoiceId={id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )    
}
export default Invoice