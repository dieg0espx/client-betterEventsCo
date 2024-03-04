import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Calendar from 'react-calendar';
import Inflatables from '../components/Inflatables'
import StripeContainer from '../components/StripeContainer';
import PaymentGateway from '../components/PaymentGateway';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';

function Extra() {
    const [extra, setExtra] = useState([])
    const [name, setName] = useState('Diego')
    const [lastName, setLastName] = useState('Espinosa')
    const [phone, setPhone] = useState('9999088639')
    const [email, setEmail] = useState('espinosa9mx@gmail.com')
    const [inflatableID, setInflatableID] = useState('')
    const [imageInflatable, setImageInflatable] = useState('')
    const [dates, setDates] = useState([])
    const [bookingDates, setBookingDates] = useState([])
    const [busyDates, setBusyDates] = useState([])
    const [popup, setPopup] = useState(false)
    const [balance, setBalance] = useState(0)
    const [total, setTotal] = useState(0)
    const [inflatableName, setInflatableName] = useState('')
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState([])
    const [deliveryAmount, setDeliveryAmount] = useState(0)
    const [tax, setTax] = useState(0)
    const [state, setState] = useState('')
    const [isHouse, setIsHouse] = useState(false)
  
    const handleSelect = async (selectedAddress) => {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      let coordinatesStr = latLng.lat + "," + latLng.lng
      setAddress(selectedAddress);
      setCoordinates(coordinatesStr)
    };

    const db = getFirestore(app);
    
    const { id } = useParams();
    const scrollContainerRef = useRef(null);


    let housesList = [
      'CdNgeq7zaEvVVgBNGiho',
      'UE6QvNQZh6jWWz9gKG0m',
      'vd1gfe4JmO2CzcuQXFwL',
      'BgmTZ5OKmxlowlHDRIvs',
      'Rdeob23dtmejFn3bqlgm'
    ]
  
    useEffect(() => {
      getExtra(id);
      window.scrollTo(0, 0);
      scrollContainerRef.current.scrollTop = 0;
      housesList.includes(id) ? setIsHouse(true) : setIsHouse(false)
    }, [id]);

    useEffect(() => {
      let formattedDates = [];
      for (let i = 0; i < dates.length; i++) {
        formattedDates.push(formatDate(dates[i]))
      }  
      if (formattedDates.length >= 2) {
        const startDate = formattedDates[0];
        const endDate = formattedDates[1];
        setBookingDates(getDatesBetween(startDate, endDate))
      }
    }, [dates])
  
    useEffect(()=> {
      // DOUBLE CHECKING THAT SELETED DATES ARE NOT BUSY
      if(bookingDates.length > 0 ){
        for (let i = 0; i < bookingDates.length; i++) {
          for (let j = 0; j < busyDates.length; j++) {
           if(new Date(bookingDates[i]).toString() == busyDates[j].toString()){
            alert("Some Dates Are Not Available")
            setBookingDates([])
            return
           }
          }
        }
      }
    },[bookingDates])

    useEffect(()=>{
      setBalance(extra.price*bookingDates.length)
      setTotal(extra.price*bookingDates.length)
      if(popup){
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    },[popup])
  
    const getDatesBetween = (startDate, endDate) => {
      const datesBetween = [];
      let currentDate = new Date(startDate);
    
      while (currentDate <= new Date(endDate)) {
        datesBetween.push(formatDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return datesBetween;
    }
    function formatDate(date){
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    } 
    const getExtra = async (id) => {
      const docRef = doc(db, "extras", id);
      setInflatableID(id)
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExtra(docSnap.data())
          setImageInflatable(docSnap.data().image)
          setInflatableName(docSnap.data().name)
          getBusyDates(id, docSnap.data().count)
        } else {
          alert("Element Not Found")
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    function createRerservation(){
      let data = {name, lastName, phone, email, address, coordinates, bookingDates, inflatableID, inflatableName}
      sessionStorage.setItem('name', data.name)
      sessionStorage.setItem('lastName', data.lastName)
      sessionStorage.setItem('phone', data.phone)
      sessionStorage.setItem('email', data.email)
      sessionStorage.setItem('address', data.address)
      sessionStorage.setItem('coordinates', data.coordinates)
      sessionStorage.setItem('bookingDates', data.bookingDates.join(", "))
      sessionStorage.setItem('infatableID', data.inflatableID)
      sessionStorage.setItem('imageInflatable', imageInflatable)
      sessionStorage.setItem('inflatableName', data.inflatableName)
      setPopup(true)
      calculateDeliveryDistance()
    }
    async function getBusyDates(id, count){
      let arrayDates = []
      let bookedDates = []
      const querySnapshot = await getDocs(collection(db, "bookings"));
      querySnapshot.forEach((doc) => {
        if(doc.data().inflatableID == id){
          for (let i = 0; i < doc.data().bookingDates.length; i++) {
            arrayDates.push(new Date(doc.data().bookingDates[i]))
          }
        }
      });
      var counts = {};
      for (var i = 0; i < arrayDates.length; i++) {
        var element = arrayDates[i];
        if (counts[element] === undefined) {
          counts[element] = 1;
        } else {
          counts[element]++;
        }
      }
      for (var key in counts) {
        if (counts.hasOwnProperty(key)) {
          if(counts[key] >= count){
            bookedDates.push(new Date(key))
          }
        }
      }
      setBusyDates(bookedDates)
    };
    const tileDisabled = ({ date, view }) => {
      // Disable dates before today
      const isBeforeToday = date < new Date();
    
      if (isBeforeToday) {
        return true;
      }
    
      if (view === 'month') {
        // Check if the date is in the array of busyDates
        return busyDates.some(busyDate => (
          busyDate.getDate() === date.getDate() &&
          busyDate.getMonth() === date.getMonth() &&
          busyDate.getFullYear() === date.getFullYear()
        ));
      }
    
      return false;
    };
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
        alert ('Unfornately, We dont do delivery to that area :(')
        window.location.reload()
      }
  
  
  
      console.log('CALCULATUNG DELIVERY DISTANCE ....');
      console.log("City:" + currentCity);
      console.log("State:" + currentState);
      //checking if the city belongs to Winnbago County -- 112 S Cherry St, Cherry Valley, Illinois, EE. UU.
      let winnebagoCities = ['Cherry Valley', 'Durand', 'Loves Park', 'Machesney Park', 'Pecatonica', 'Rockford', 'Rockton', 'Roscoe', 'Seward', 'Shirland', 'South Beloit', 'Winnebago']
      for(let i=0; i < winnebagoCities.length; i++){
        if(' ' + winnebagoCities[i] == currentCity){
          setDeliveryAmount(30)
          return;
        }
      }
      // Check if the address belongs to WISCONSIN STATE  -- 1810 Monroe Street, Madison, Wisconsin, EE. UU.
      if (currentState == ' WI' || currentState == ' Wisconsin') {
        setDeliveryAmount(50)
        return;
      }
      // Get the distance from the warehouse to the delivery area -- 425 Fawell Boulevard, Glen Ellyn, Illinois, EE. UU.
      fetch(`https://server-better-events.vercel.app/api/calculateDistance?deliveryAddress=${address}`)
      .then((response) => response.json())
      .then((response) => {
        let miles = parseFloat(response.rows[0].elements[0].distance.text.split(' ')[0])
        setDeliveryAmount(miles * 1.5)
        console.log("DELIVERY COST : " + miles*1.5);
        return
      })
    }



    return (
        <div className='booking-inflatable'>
            <Header />
            <div className='main-container'>
              <div id="left" ref={scrollContainerRef}>
                <img src={extra.image} />
                <div className='name-price'>
                  <p id="name"> {extra.name} </p>
                  <p id="price"> ${extra.price} USD </p>
                </div>
                <p id="description"> {extra.description}</p>

              </div>
              <div id="right" >  
                <div style={{display: isHouse? "none":"block"}}>
                  <Calendar selectRange={true} onChange={setDates}  tileDisabled={tileDisabled} />
                  <div className='form'>
                    <input value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder='First Name' />
                    <input value={lastName} onChange={(e)=>setLastName(e.target.value)} type='text' placeholder='Last Name' />
                    <input value={phone} onChange={(e)=>setPhone(e.target.value)} type='tel' placeholder='Phone Number' />
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Email Address' />
                    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                          <input {...getInputProps({ placeholder: 'Delivery Address' })} />
                          <div>
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const style = { 
                                backgroundColor: suggestion.active ? '#0089BF' : '#fff' ,
                                color: suggestion.active ? 'white' : 'gray', 
                                border:'1px solid gray',
                                borderRadius:'5px',
                                padding:'3px 5px', 
                                marginBottom:'1px' 
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
                    <button className='btn-book' onClick={()=>createRerservation()} style={{display: bookingDates.length > 0?"block":"none"}}> Book Now </button>
                    <p style={{display: bookingDates.length == 0?"block":"none"}}> *Select an available date </p>
                  </div>
                </div>
                <div className='houseContact' style={{display: isHouse? "block":"none"}}>
                      <h2> To Continue </h2>
                      <p> Please contact us to get more information and availability.</p>
                      <button onClick={()=>window.location.href = extra.propertyLink} className='btn-property'> View Theme House </button>
                      <Link to='/contact' className='btn-contact'> Contact Us </Link>
                </div>

                <div style={{display:popup? "block":"none"}}>
                  <div className="overlay" onClick={()=>setPopup(!popup)}/>
                  <PaymentGateway 
                    balance={balance} 
                    popup={popup} 
                    total={total} 
                    deliveryAmount={deliveryAmount} 
                    tax={tax} 
                    state={state}
                  />
                </div>
              </div>
            </div>
            <div className='recommendations'>
              <p className='subTitle'> You may also like ... </p>
              <Inflatables category={'extras'}/>
            </div>
            <Footer />
        </div>
      )
    }
    

export default Extra