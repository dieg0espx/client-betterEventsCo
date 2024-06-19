import React, {useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import Header from '../components/Header'
import StripeContainerInvoice from '../components/StipeContainerInvoice'
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'
import { isElement } from 'react-dom/test-utils';


function Invoice() {
    const [invoice, setInvoice] = useState({})
    const [booking, setBooking] = useState({})

    const db = getFirestore(app);
    const { id } = useParams();
    const scrollContainerRef = useRef(null);

    useEffect(()=>{
        getInvoice()
    },[])

    useEffect(()=>{
        if(!isEmpty(invoice)){
            getBooking(invoice.bookingId)
        }
    },[invoice])

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    async function getInvoice(){
        const docRef = doc(db, "invoices-test", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Invocice data:", docSnap.data());
          setInvoice(docSnap.data())
        } else {
          alert("Invoice Not Found :(")
        }
    }

    async function getBooking(bookingId){
        const docRef = doc(db, "bookings-test", bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Booking data:", docSnap.data());
          let booking = docSnap.data()
          let arrayBooking = {
            id: docSnap.id,
            address: booking.address,
            email: booking.email,
            lastName: booking.lastName,
            name: booking.name,
            phone: booking.phone,
            method: booking.method,
            paid: booking.paid,
            specificTime: booking.specificTime,
            floorType: booking.floorType,
            created: booking.created,
            damageWaiver: booking.balances.damageWaiver,
            deliveryAmount: booking.balances.deliveryAmount,
            deliveryFee: booking.balances.deliveryFee,
            deposit: booking.balances.deposit,
            insurance: booking.balances.insurance,
            rent: booking.balances.rent,
            tax: booking.balances.tax,
            total: (booking.balances.damageWaiver + booking.balances.deliveryAmount + booking.balances.deliveryFee + booking.balances.insurance + booking.balances.rent + booking.balances.tax - booking.balances.deposit).toFixed(2),
            inflatables: booking.inflatables.map((inflatable) => ({
              bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
              inflatableID: inflatable.inflatableID,
              inflatableName: inflatable.inflatableName,
              inflatableImage: inflatable.inflatableImage
            })),
            extras: booking.extras ? booking.extras.map((inflatable) => ({
              bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
              inflatableID: inflatable.inflatableID,
              inflatableName: inflatable.inflatableName,
              inflatableImage: inflatable.inflatableImage
            })) : []
          }
          setBooking(arrayBooking)
        } else {
          alert("Booking Not Found :(")
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
        <div className='invoice-page'>
            <div className='main-grid'>
                <div id="left"> 
                    <img className="headerImg" src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706048357/BetterEvents-10_eabusi_ys0lwn.png'} />
                    <h2> Contact Information </h2>
                    <p><b> Full Name: </b> {booking.name} {booking.lastName} </p>
                    <p><b> Phone: </b> {booking.phone} </p>
                    <p><b> Email: </b> {booking.email} </p>
                    <p><b> Address: </b> {booking.address} </p>

                    <h2> Booking Information </h2>
                    <p><b> Booking ID: </b> {invoice.bookingId}</p>
                    <p><b> Created: </b> {booking.created}</p>
                    <p><b> Delivery Time: </b> {booking.specificTime}</p>
                    <p><b> Time Frame: </b> 
                        {booking.deliveryAmount == 125 ? (
                              ' Exact Time'
                            ) : booking.deliveryFee == 75 ? (
                              ' 1 Hour Frame'
                            ) : booking.deliveryFee == 50 ? (
                              ' 2 Hour Frame'
                            ) : (
                              ' No Restriction'
                            )
                        }
                    </p>
                    <p><b> Floor Type: </b> {booking.floorType}</p>

                    <h2> Booking Elements </h2>
                    {booking && booking.inflatables ? (
                      booking.inflatables.map((inflatable, index) => (
                        <div key={index} className="inflatable-row">
                         <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                          <div>
                            <p><b>Inflatable:</b> {inflatable.inflatableName}</p>
                            <p><b>Booked Dates:</b> {inflatable.bookedDates.join(' > ')}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No inflatables booked.</p>
                    )}
                     {booking && booking.extras ? (
                      booking.extras.map((inflatable, index) => (
                        <div key={index} className="inflatable-row">
                         <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                          <div>
                            <p><b>Extra:</b> {inflatable.inflatableName}</p>
                            <p><b>Booked Dates:</b> {inflatable.bookedDates.join(' > ')}</p>
                          </div>
                        </div>
                      ))
                      ) : (
                        <p>No inflatables booked.</p>
                      )}
                </div>
                <div id="right">
                    <div className='balance-payment'>
                      <p> Balance due </p>
                      <h3> {!booking.paid ? formatCurrency(booking.total) : formatCurrency(0)}</h3>
                    </div>

                    <h2> Balances </h2>
                    <p className='balance'> <b> Rent: </b> {formatCurrency(booking.rent)}</p>
                    <p className='balance'> <b> Damage Waiver: </b> {formatCurrency(booking.damageWaiver)}</p>
                    <p className='balance'> <b> Time Frame Delivery: </b> {formatCurrency(booking.deliveryAmount)}</p>
                    <p className='balance'> <b> Delivery Fee: </b> {formatCurrency(booking.deliveryFee)}</p>
                    <p className='balance'> <b> Insurance: </b> {formatCurrency(booking.insurance)}</p>
                    <p className='balance'> <b> Tax: </b> {formatCurrency(booking.tax)}</p>
                    <p className='balance'> <b> Deposit: </b> {booking.deposit !== 0 ? `- ${formatCurrency(booking.deposit)}` : formatCurrency(0)}</p>
                    <p className='balance'> <b> Total: </b> <b>{formatCurrency(booking.total)}</b></p>

                    <StripeContainerInvoice total={booking.total} data={booking} id={id}/>
                </div>
            </div>
        </div>
    )    
}
export default Invoice