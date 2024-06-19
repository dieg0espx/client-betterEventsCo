import React,  {useEffect, useState} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import app from '../Firbase';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Switch from "react-switch";
import StripeContainer from '../components/StripeContainer'



function Checkout() {
    const db = getFirestore(app);
    const [cart, setCart] = useState([]);
    const [inflatables, setInflatables] = useState([]);
    const [selectedInflatables, setSelectedInflatables] = useState([]);
    const [extras, setExtras] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [totalRent, setTotalRent] = useState(0);
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState([])
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [tax, setTax] = useState(0)
    const [taxFee, setTaxFee] = useState(0)
    const [state, setState] = useState('')
    const [tempAddress, setTempAddress] = useState('')
    const [total, setTotal] = useState(0)
    const [specificTime, setSpecificTime] = useState('12:00')
    const [timeFrame, setTimeFrame] = useState(0)
    const [damageWaiver, setDamageWaiver] = useState(true)
    const [damageWaiverAmount, setDamageWaiverAmount] = useState(0)
    const [insuranceCertificate, setInsuranceCertificate] = useState(true)
    const [floorType, setFloorType] = useState('concrete')
    const [discount, setDicount] = useState(0)
    const [balances, setBalances] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('Cash In Office')
    const [depositOnly, setDepositOnly] = useState(false)
    const [termsAndConditions, setTermsAndConditions] = useState(false)
    const [name,setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [alerts, setAlerts] = useState([])
    const [confirmationID, setConfirmationID] = useState('')
    const [bookCompleted, setBookCompleted] = useState(false)
    const [isVerified, setIsVerified] = useState(false);
    const [requestBooking, setRequestBooking] = useState(false)

    const handleContinue = () => {
        const result = verifyForm();
        setIsVerified(result);
    };
       
    useEffect(() => {
      const storedCart = sessionStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
        getInflatables();
        getExtras()
      }

      getRequestBookingStatus()
    }, []);
  
    useEffect(()=>{
      getSelectedInflatables()
      getSelectedExtras()
    },[cart, inflatables, extras])

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedInflatables]);

    useEffect(()=>{
        if(!address == ''){
            calculateDeliveryDistance()
        }
    },[address])

    useEffect(()=>{
        if(!tax == 0){
            setTaxFee(totalRent*(tax/100))
        }
    },[tax])

    useEffect(()=>{
      const discountedRent = discount !== 0 ? totalRent - ((totalRent * discount) / 100) : totalRent
      const calculatedTaxFee = discountedRent * (tax / 100);
      const calculatedTotal = discountedRent + calculatedTaxFee + deliveryFee + timeFrame + 
                              (damageWaiver ? discountedRent * 0.09 : 0) + 
                              (insuranceCertificate ? 45 : 0);


  
      setTotal(calculatedTotal); 
      
      const newBalances = {
        rent: discountedRent, 
        deliveryFee: deliveryFee,
        deliveryAmount: timeFrame,
        deposit: depositOnly ? 100 : 0,
        insurance: insuranceCertificate ? 45 : 0,
        tax: calculatedTaxFee,
        damageWaiver:damageWaiver ? (discountedRent * 0.09) : 0,
        // discount: (totalRent*discount) / 100
      };
      
      setBalances(newBalances);
      setDamageWaiverAmount(discountedRent* 0.09)

    }, [totalRent, taxFee, deliveryFee, timeFrame, damageWaiver, insuranceCertificate, discount, depositOnly]);

    useEffect(()=>{
      setIsVerified(false)
    },[name, lastName, email, phone, address, termsAndConditions])
  

    let inflatablesData = selectedInflatables.map(inflatable => ({
    bookingDates: inflatable.dates,
    inflatableID: inflatable.id,
    inflatableName: inflatable.name,
    inflatableImage: inflatable.image,
    }));

    let extrasData = selectedExtras.map(extra => ({
      bookingDates: extra.dates,
      inflatableID: extra.id,
      inflatableName: extra.name,
      inflatableImage: extra.image,
      }));

    let data = {
      name: name,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
      inflatables: inflatablesData,  // Add the inflatables array here
      extras: extrasData,  // Add the inflatables array here
      balances: balances, 
      method: paymentMethod,
      paid: paymentMethod == 'Credit Card' && !depositOnly && !requestBooking ? true : false, 
      created: formatDateCreate(new Date()), 
      specificTime: specificTime,
      floorType: floorType, 
      approved : requestBooking ? 'Waiting' : 'True'
    };
  
    async function getRequestBookingStatus(){
      const docRef = doc(db, "config", "requestBooking");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRequestBooking(docSnap.data().status)
      } else {
        console.log("ERROR: REQUEST BOOKING STATUS NOT FOUND IN DATABASE");
      }
    }
  
    async function getInflatables() {
      let arrayInflatables = [];
      const querySnapshot = await getDocs(collection(db, 'inflatables'));
      querySnapshot.forEach((doc) => {
        arrayInflatables.push({
          id: doc.id,
          capacity: doc.data().capacity,
          description: doc.data().description,
          height: doc.data().height,
          image: doc.data().image,
          name: doc.data().name,
          price: doc.data().price,
          width: doc.data().width,
          category: doc.data().category,
          wetDry: doc.data().wetDry,
        });
      });
      setInflatables(arrayInflatables);
    }
  
    function getSelectedInflatables() {
      const selected = [];
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const selectedInflatable = inflatables.find(
          inflatable => inflatable.id === cartItem.inflatableID
        );
        if (selectedInflatable) {
          selectedInflatable.dates = cartItem.dates; // Add dates from cart to selected inflatable
          selected.push(selectedInflatable);
        }
      }
      setSelectedInflatables(selected);
    }

    async function getExtras() {
      let arrayExtras = [];
      const querySnapshot = await getDocs(collection(db, 'extras'));
      querySnapshot.forEach((doc) => {
        arrayExtras.push({
          id: doc.id,
          description: doc.data().description,
          image: doc.data().image,
          name: doc.data().name,
          price: doc.data().price,
          category: doc.data().category,
        });
      });
      setExtras(arrayExtras);
    }

    function getSelectedExtras() {
      const selected = [];
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const selectedInflatable = extras.find(
          inflatable => inflatable.id === cartItem.inflatableID
        );
        if (selectedInflatable) {
          selectedInflatable.dates = cartItem.dates;
          selected.push(selectedInflatable);
        }
      }
      setSelectedExtras(selected);
    }


    function calculateTotalPrice() {
        let total = selectedInflatables.reduce((sum, inflatable) => {
            return sum + (inflatable.price * inflatable.dates.length);
        }, 0);
        total += selectedExtras.reduce((sum, inflatable) => {
          return sum + (inflatable.price * inflatable.dates.length);
      }, 0);
        setTotalRent(total);
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    async function calculateDeliveryDistance(){
    const currentCity = address.split(',')[1]
    const currentState = address.split(',')[2]
    
    // SETTING UP TAX BASED ON THE STATE
    if (currentState == ' Illinois' || currentState == ' IL'){
      setState('Illinois')
      setTax(8.75)
    } else if (currentState == ' Wisconsin' || currentState == ' WI'){
      setState('Wisconsin')
      setTax(6.25)
    } else {
      alert ('Unfornately, delivery to that area is not currently available :(')
    }
    console.log('CALCULATUNG DELIVERY DISTANCE ....');
    console.log("City:" + currentCity);
    console.log("State:" + currentState);
    //checking if the city belongs to Winnbago County -- 112 S Cherry St, Cherry Valley, Illinois, EE. UU.
    let winnebagoCities = ['Cherry Valley', 'Durand', 'Loves Park', 'Machesney Park', 'Pecatonica', 'Rockford', 'Rockton', 'Roscoe', 'Seward', 'Shirland', 'South Beloit', 'Winnebago']
    for(let i=0; i < winnebagoCities.length; i++){
      if(' ' + winnebagoCities[i] == currentCity){
        setDeliveryFee(30)
        return;
      }
    }
    // Check if the address belongs to WISCONSIN STATE  -- 1810 Monroe Street, Madison, Wisconsin, EE. UU.
    if (currentState == ' WI' || currentState == ' Wisconsin') {
      setDeliveryFee(50)
      return;
    }
    // Get the distance from the warehouse to the delivery area -- 425 Fawell Boulevard, Glen Ellyn, Illinois, EE. UU.
    fetch(`https://server-better-events.vercel.app/api/calculateDistance?deliveryAddress=${address}`)
    .then((response) => response.json())
    .then((response) => {
      let miles = parseFloat(response.rows[0].elements[0].distance.text.split(' ')[0])
      setDeliveryFee(miles * 1.5)
      console.log("DELIVERY COST : " + miles*1.5);
      return
    })
    }

    const handleSelect = async (selectedAddress) => {
    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);
    let coordinatesStr = latLng.lat + "," + latLng.lng
    setAddress(selectedAddress);
    setCoordinates(coordinatesStr)
    setTempAddress(selectedAddress)
    };

    function formatDate(dateStr) {
        const dateParts = dateStr.split('/');
        const month = dateParts[0];
        const day = dateParts[1];
        const year = dateParts[2];
    
        const date = new Date(`${year}-${month}-${day}`);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function getSpecificTimeDescription(amount){
        let desc;
        switch (amount) {
            case 0:
                desc = 'No Restriction'
                break;
            case 125:
                desc = 'Exact Time Delivery'
                break;
            case 75:
                desc = '1 Hour Window Delivery'
                break;
            case 50:
                desc = '2 Hours Window Delivery'
                break;
        
            default:
                desc = 'No Restriction'
                break;
        }
        return desc;
    }

    function getDiscount(code){
      let discount = 0
      switch (code) {
        case 'betterbounce10':
          discount = 10
          break;
        case 'betterstay15':
          discount = 15
          break
        case 'betterstaynow.com25':
          discount = 25
          break;;
      
        default:
          break;
      }
      setDicount(discount)
    }

    function verifyForm() {
      let arrayAlerts = [];
    
      if (address === '') {
        arrayAlerts.push("Address is required.");
      }
    
      if (name === '') {
        arrayAlerts.push("Name is required.");
      }
    
      if (lastName === '') {
        arrayAlerts.push("Last Name is required.");
      }
    
      if (email === '') {
        arrayAlerts.push("Email is required.");
      }
    
      if (phone === '') {
        arrayAlerts.push("Phone number is required.");
      }

      if (termsAndConditions == false) {
        arrayAlerts.push("Agreed Terms & Conditions is required.");
      }
    
      setAlerts(arrayAlerts);
    
      if(arrayAlerts.length == 0){
        // createCashReservation()
        return true
      } 
      return false
    }

    function createReservation(){
      let inflatablesData = selectedInflatables.map(inflatable => ({
        bookingDates: inflatable.dates,
        inflatableID: inflatable.id,
        inflatableName: inflatable.name,
        inflatableImage: inflatable.image,
      }));
    
      let data = {
        name: name,
        lastName: lastName,
        phone: phone,
        email: email,
        address: address,
        inflatables: inflatablesData,  // Add the inflatables array here
        balances: balances, 
        method: paymentMethod,
        paid: paymentMethod == 'Credit Card' ? true : false, 
        created: formatDateCreate(new Date()), 
        specificTime: specificTime,
      };
    
      // You can now use the data object to create a reservation, for example, by sending it to your backend
      console.log(data);  // For testing purposes, you might want to see the generated data object
    }
  
    function formatDateCreate(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}/${day}/${year} | ${hours}:${minutes}`;
    }
    
    async function createCashReservation(){
      const docRef = await addDoc(collection(db, "bookings-test"), data);
      if(sendEmailConfirmation(docRef.id)){
        setConfirmationID(docRef.id)
      }
      if(depositOnly){
        createInvoice(docRef.id)
      }
      setBookCompleted(true)
      sessionStorage.removeItem('cart');
    }

    async function sendEmailConfirmation(id) {
      try {
          let response = await fetch('https://better-stays-mailer.vercel.app/api/bebookingConfirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  data: data,
                  reservationID: id
              })
          });
  
          return response.status == 200 ? true : false;
      } catch (error) {
          console.error('Error sending email confirmation:', error);
          alert('Error sending email confirmation:', error)
          throw error;
      }
    }

    async function createInvoice(id){
      let invoiceData = {
        data:data,
        bookingId:id, 
      }
      const docRef = await addDoc(collection(db, "invoices-test"), invoiceData);
      await sendInvoiceEmail(docRef.id, id)
      if(sendInvoiceEmail(docRef.id, id) == true){
        return true
      } else {
        return false
      }
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

    async function sendBookingRequest(){
      console.log("Request Booking Sent");
      const docRef = await addDoc(collection(db, "bookings-test"), data);
      setBookCompleted(true)
      sessionStorage.removeItem('cart');
      // SENDING REQUEST-CONFIRMATION EMAIL
      try {
        let response = await fetch('https://better-stays-mailer.vercel.app/api/bebookingRequested', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                data: data,
                reservationID: docRef.id
            })
        });

        return response.status == 200 ? true : false;
      } catch (error) {
          console.error('Error sending email confirmation:', error);
          alert('Error sending email confirmation:', error)
          throw error;
      }
    }
    
  return (
    <div className='checkout-page'>
        <Header />
            <div className='content'> 
                <h2> CheckOut </h2>
                <div className='main-grid'>
                    <div id='left'> 
                      <div className='two-col'>
                        {/* LEFT */}
                        <div id="delivery-address">
                          <div className='labels'>
                                <h4> Delivery Address </h4>
                                <p>  We offer delivery services to customers residing in Illinois and Wisconsin, ensuring timely and convenient delivery options for your orders.</p>
                            </div>
                            <div className='delivery'> 
                                <PlacesAutocomplete value={tempAddress} onChange={setTempAddress} onSelect={handleSelect}>
                                     {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                      <input {...getInputProps({ placeholder: 'Delivery Address' })}/>
                                      <div className='suggestions'>
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map((suggestion) => {
                                          const style = { 
                                            backgroundColor: suggestion.active ? '#0089BF' : '#fff' ,
                                            color: suggestion.active ? 'white' : 'gray', 
                                            border:'1px solid lightgray',
                                            borderRadius:'3px',
                                            padding:'3px 5px', 
                                            marginBottom:'1px',
                                            position:'relative',
                                            zIndex: 999
                                          };
                                          return (
                                            <div {...getSuggestionItemProps(suggestion, { style })}>
                                              {suggestion.description}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </PlacesAutocomplete>
                                <button> <i className="bi bi-search"></i> </button>
                            </div>
                        </div>
                        {/* RIGHT */}
                        <div id="specific-time">
                          <div className='labels'>
                              <h4> Specific Time Delivery </h4> 
                              <p> Restrictions means we can deliver as early as 7am and pickup as late as midnight. Please call our office if you have any questions.</p>
                          </div>
                          <div className='specific-time'>
                            <div className='grid-specificTime'>
                              <select onChange={(e)=>setTimeFrame(parseInt(e.target.value))}>
                                <option value={0}> No restriction, no charge </option>
                                <option value={125}> YES - Must deliver at an exact time ($125.00)</option>
                                <option value={75}> YES - Must deliver within a 1 hour window ($75.00)</option>
                                <option value={50}> YES - You must deliver within a 2 hours or greater window ($50.00)</option>
                              </select>
                              <input type='time' onChange={(e)=> setSpecificTime(e.target.value)} value={specificTime}/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='floor-type'>
                        <div className='labels'>
                          <h4> Select Floor Type </h4>
                          <p> Kindly choose the surface where our team will position the inflatable. This enables us to guarantee a correct installation and observe safety protocols.</p>
                        </div>
                        <div className='grid'>
                          <button className={floorType == 'grass' ? 'selected':''} onClick={()=>setFloorType('grass')}> Grass </button>
                          <button className={floorType == 'concrete' ? 'selected':''} onClick={()=>setFloorType('concrete')}> Concrete / Asphalt </button>
                          <button className={floorType == 'indoor' ? 'selected':''} onClick={()=>setFloorType('indoor')}> Indoor </button>
                        </div>
                      </div>
                      <div className='switch-col'>
                      <Switch 
                        onChange={()=>setDamageWaiver(!damageWaiver)} 
                        checked={damageWaiver} 
                        onColor={'#0089BF'} 
                        offColor={'#d3d3d3'}
                        checkedIcon={false} 
                        uncheckedIcon={false}
                        className="switch"
                      />
                      <div>
                        <h4> Damage Waiver </h4> 
                        <p> We offer an optional 9% non-refundable damage waiver on all rental equipment. Lessee must select coverage, pay in full, and sign rental contract before the start of event for damage waiver to be bound. Acceptance of any and all claims that arise are based on sole discretion of Better Events Co. This Damage Waiver is NOT liability insurance. This Damage Waiver does NOT cover theft, vandalism, silly string, misuse, and/or abuse. This Damage Waiver does NOT cover missing equipment. </p>
                      </div>
                      </div>
                      <div className='switch-col' id={'last'}>
                      <Switch 
                        onChange={()=>setInsuranceCertificate(!insuranceCertificate)} 
                        checked={insuranceCertificate} 
                        onColor={'#0089BF'} 
                        offColor={'#d3d3d3'}
                        checkedIcon={false} 
                        uncheckedIcon={false}
                        className="switch"
                      />
                      <div>
                        <h4> Insurance Certificate </h4> 
                        <p> If you are hosting your event at a public park, corporate company picnic, or forest preserve and would like to use our rental equipment, the park or preserve owner will likely require you to provide a certificate of insurance from Better Events. We are able to assist you with obtaining this document. The cost to obtain the service for a certificate of insurance from us is $45.00.</p>
                      </div>
                      </div>
                      {selectedInflatables.map((inflatable, i) => (
                          <div className="row" key={inflatable.id}>
                            <p className='title'>{inflatable.name}</p>
                            <div>
                              {inflatable.dates.map((date, index) => (
                                <p key={index}>Rent: {formatDate(date)}</p>
                              ))}
                            </div>
                            <p className='price'>{formatter.format(inflatable.price * inflatable.dates.length)} USD </p> 
                          </div>
                      ))}
                      {selectedExtras.map((inflatable, i) => (
                          <div className="row" key={inflatable.id}>
                            <p className='title'>{inflatable.name}</p>
                            <div>
                              {inflatable.dates.map((date, index) => (
                                <p key={index}>Rent: {formatDate(date)}</p>
                              ))}
                            </div>
                            <p className='price'>{formatter.format(inflatable.price * inflatable.dates.length)} USD </p> 
                          </div>
                      ))}
                       <div className='row'>
                          <p className='title'> Damage Waiver</p>
                          <p className='description'> Optional 9% non-refundable </p>
                          <p className='price'> {formatter.format(damageWaiverAmount)} USD </p>
                       </div>
                       <div className='row'>
                          <p className='title'> Insurance Certificate</p>
                          <p className='description'> Insurance Certificate </p>
                          <p className='price'> {formatter.format(insuranceCertificate ? 45 : 0)} USD </p>
                       </div>
                       <div className='row'>
                          <p className='title'> Specific Time Delivery</p>
                          <p className='description'> {getSpecificTimeDescription(timeFrame)} </p>
                          <p className='price'> {formatter.format(timeFrame)} USD </p>
                      </div>
                      <div className='row'>
                          <p className='title'> Delivery Fee</p>
                          <p className='description'> Address: {address} </p>
                          <p className='price'> {formatter.format(deliveryFee)} USD </p>
                      </div>
                      <div className='row'>
                          <p className='title'> Tax </p>
                          <p className='description'> {state}: {tax}% </p>
                          <p className='price'>{formatter.format((totalRent*(tax/100)))} USD </p>
                      </div>
                      <div className='row' style={{visibility: discount !== 0 ? "visible":"hidden"}}>
                          <p className='title'> Promo Code </p>
                          <p className='description'> -{discount}% OFF </p>
                          <p className='price'>- {formatter.format((totalRent*discount) / 100)} USD </p>
                      </div>
                        <hr></hr>
                        <div id='total'>
                            <input type='text' placeholder='Promo Code' className='promoCode' onChange={(e)=>getDiscount(e.target.value)}/>
                            <p><b>Total:</b></p>
                            <p>{formatter.format(total)} USD</p>
                        </div>
                    </div>
                    <div id='right'>
                      <div className='payment-method'>
                        <div className={paymentMethod == 'Cash In Office' ? 'selected ':'btn-payment'} onClick={()=>setPaymentMethod ('Cash In Office')}>
                          <i className="bi bi-cash-coin iconPayment"></i>
                          <p> Pay in Office</p>
                        </div>
                        <div className={paymentMethod == 'Credit Card' ? 'selected ':'btn-payment'} onClick={()=>setPaymentMethod ('Credit Card')}>
                          <i className="bi bi-credit-card-2-back iconPayment"></i>
                          <p> Credit Card </p>
                        </div>
                      </div>
                      <div className='switch-col'>
                        <Switch 
                          onChange={()=>setDepositOnly(!depositOnly)} 
                          checked={paymentMethod == 'Cash In Office' ? false : depositOnly} 
                          onColor={'#0089BF'} 
                          offColor={'#d3d3d3'}
                          checkedIcon={false} 
                          uncheckedIcon={false}
                          className="switch"
                          disabled={paymentMethod == 'Cash In Office' ? true : false}
                        />
                        <div>
                          <h4> Pay Only Deposit Due ($100.00) </h4> 
                          <p> Please note that if reservations are not fully paid within 24 hours, they will be cancelled and the deposit will be non-refundable. </p>
                        </div>
                      </div>  
                      <div className='form'>
                        <input type='text'  value={name} placeholder='First Name' onChange={(e)=>setName(e.target.value)}/>
                        <input type='text'  value={lastName} placeholder='Last Name' onChange={(e)=>setLastName(e.target.value)}/>
                        <input type='email' value={email} placeholder='Email Address' onChange={(e)=>setEmail(e.target.value)}/>
                        <input type='tel'   value={phone} placeholder='Phone Number' onChange={(e)=>setPhone(e.target.value)}/>
                      </div>
                      <div className='switch-col' id='last'>
                        <Switch 
                          onChange={()=>setTermsAndConditions(!termsAndConditions)} 
                          checked={termsAndConditions} 
                          onColor={'#0089BF'} 
                          offColor={'#d3d3d3'}
                          checkedIcon={false} 
                          uncheckedIcon={false}
                          className="switch"
                        />
                        <div>
                          <h4> I have read and accept the <a href='/#/contract'>rules and restrictions</a>. </h4> 
                        </div>
                      </div>  
                      <div>
                        {alerts.map((alert, index) => (
                          <div key={index} className='alert-form'>
                            <i className="bi bi-exclamation-circle"></i>
                            <p>{alert} </p>
                          </div>
                        ))}
                      </div>
                      <div className="booking-methods">
                          <button onClick={handleContinue} style={{display: isVerified ? "none":"block"}}>Continue</button>

                          {!requestBooking && isVerified && paymentMethod === 'Cash In Office' && (
                              <div>
                                  <button onClick={() => createCashReservation()}>Book Now</button>
                              </div>
                          )}

                          {!requestBooking &&isVerified && paymentMethod === 'Credit Card' && (
                              <div>
                                  <StripeContainer data={data} total={depositOnly ? 100 : total.toFixed(2)}/>
                              </div>
                          )}

                          {requestBooking && isVerified && (
                              <div>
                                  <button onClick={() => sendBookingRequest()}>Request Book Now</button>
                              </div>
                          )}
                      </div>
                    </div>
                </div>
            </div>
            <div className='confirmation' style={{display: bookCompleted? "flex":"none"}}>
              <i className="bi bi-calendar2-check iconCheck"></i>
              <h2> Your Booking is Completed !</h2>
              <p> Thank you for choosing Better Events for your reservation. </p>
              <p> A confirmation email containing all the necessary information has been sent to {email}. </p>

              <p> <b> Confirmation ID:</b> {confirmationID} </p>
            </div>
        <Footer />
    </div>
  )
}

export default Checkout
    