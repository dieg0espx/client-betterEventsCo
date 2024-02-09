import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Calendar from 'react-calendar';
import Inflatables from '../components/Inflatables'
import StripeContainer from '../components/StripeContainer';
import PaymentGateway from '../components/PaymentGateway';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

function Inflatable() {
  const [inflatable, setInflatable] = useState([])
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

  useEffect(() => {
    getInflatable(id);
    getBusyDates(id)
    window.scrollTo(0, 0);
    scrollContainerRef.current.scrollTop = 0;
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
  const getInflatable = async (id) => {
    const docRef = doc(db, "inflatables", id);
    setInflatableID(id)
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInflatable(docSnap.data())
        setImageInflatable(docSnap.data().image)
        setInflatableName(docSnap.data().name)
      } else {
        alert("Inflatable Not Found")
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
  }
  async function getBusyDates(id){
    let arrayDates = []
    const querySnapshot = await getDocs(collection(db, "bookings"));
    querySnapshot.forEach((doc) => {
      if(doc.data().inflatableID == id){
        for (let i = 0; i < doc.data().bookingDates.length; i++) {
          arrayDates.push(new Date(doc.data().bookingDates[i]))
        }
      }
    });
    setBusyDates(arrayDates)
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
  
  useEffect(()=>{
    setBalance(inflatable.price*bookingDates.length)
    setTotal(inflatable.price*bookingDates.length)
    if(popup){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  },[popup])

  function setupArea(dimension) {
    if (typeof dimension === 'string' && dimension.includes('x')) {
        let dimensions = dimension.split(' x ');
        for (let i = 0; i < dimensions.length; i++) {
            dimensions[i] = parseInt(dimensions[i]) + 3;
        }
        return dimensions[0] + ' x ' + dimensions[1];
    }
    return parseInt(dimension) + 2;
  }

  return (
    <div className='booking-inflatable'>
        <Header />
        <div className='main-container'>
          <div id="left" ref={scrollContainerRef}>
            <img src={inflatable.image} />
            <div className='name-price'>
              <p id="name"> {inflatable.name} </p>
              <p id="price"> ${inflatable.price} USD </p>
            </div>
            <p id="description"> {inflatable.description}</p>
            <div id='rentalInformation'>
              <p> Rental Information </p>
              <li> Adult supervision at all the time is required. </li>
              <li> Our inflatable deliveries are between 8am - 1pm daily.</li>
              <li> Our inflatable pick-ups start after 7pm daily. (Units may be left over night for an additional fee) </li>
              <li> Upon delivery, we set up and secure the unit with necessary tools. </li>
              <li> All blowers, stakes, and extension cords will be provided to set up inflatable. </li>
              <li> We require all customers to have a dedicated power outlet for inflatable. </li>
              <li> We require 1 electrical outlet, on it's own 20 amp circuit, within 100' to the unit.</li>
              <li> If the inflatable requires a water source, then, one must be provided. </li>
              <li> We are prepared for all grass set ups. If your set up will be on concrete, we must know in advance to prepare accordingly to make sure the unit is safe and secure for all children.</li>
            </div>
            <div id="dimentions">
              <div>
                <p className='title'> Actual Size </p>
                <div className='grid'>
                  <div className="dimention">          
                    <p className="value">{inflatable.width} ft </p>
                    <p className="type"> Width</p>
                  </div>
                  <div className="dimention">          
                    <p className="value">{inflatable.height} ft </p>
                    <p className="type"> Height</p>
                  </div>
                </div>
              </div>
              <div>
                <p className='title'> Setup Area </p>
                <div className='grid'>
                  <div className="dimention">          
                    <p className="value">{setupArea(inflatable.width)} ft </p>
                    <p className="type"> Width</p>
                  </div>
                  <div className="dimention">          
                    <p className="value">{setupArea(inflatable.height)} ft </p>
                    <p className="type"> Height</p>
                  </div>
                </div>
              </div>  
              <div>
              <p className='title'> Type </p>
              <div className="dimention">          
                <p className="value"> <i className={inflatable.wetDry == 'Dry'? "bi bi-brightness-high-fill iconDry":"bi bi-droplet-fill iconWet"}></i> </p>
                <p className="type"> {inflatable.wetDry == 'Dry'? "Dry":"Wet"}</p>
              </div>
              </div>
            </div>
          </div>
          <div id="right">  
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
            <div style={{display:popup? "block":"none"}}>
              <div className="overlay" onClick={()=>setPopup(!popup)}/>
              <PaymentGateway balance={balance} popup={popup} total={total}/>
            </div>
          </div>
        </div>
        <div className='recommendations'>
          <p className='subTitle'> You may also like ... </p>
          <Inflatables category={inflatable.category}/>
        </div>
        <Footer />
    </div>
  )
}

export default Inflatable