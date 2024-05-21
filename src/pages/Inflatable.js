import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [inflatableID, setInflatableID] = useState('')
  const [imageInflatable, setImageInflatable] = useState('')
  const [dates, setDates] = useState([])
  const [bookingDates, setBookingDates] = useState([])
  const [busyDates, setBusyDates] = useState([])
  const [popup, setPopup] = useState(false)
  const [rent, setRent] = useState(0)
  const [inflatableName, setInflatableName] = useState('')
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState([])
  const [deliveryAmount, setDeliveryAmount] = useState(0)
  const [tax, setTax] = useState(0)
  const [state, setState] = useState('')

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
        getBusyDates(id, docSnap.data().count)
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
    calculateDeliveryDistance()
  }
  async function getBusyDates(id, count){
    let arrayDates = []
    let bookedDates = [new Date('04/29/2024'), new Date('04/30/2024'), new Date('05/01/2024'), new Date('05/02/2024'), new Date('05/03/2024'), new Date('05/04/2024'), new Date('05/05/2024'), new Date('05/06/2024'), new Date('05/07/2024') , new Date('05/08/2024') , new Date('05/09/2024')]
    let bounceHousesList= [
      '6tfyHwIxoJfyRy4VZKng',
      'MM3qCVRBCHv1wvHOjAyb',
      'Rj21T5lVxKY98nLbCqx9',
      'RoBEKlWaPcKQ5fcpxMOq',
      'XAjwOTYABYPzQAmQe9bQ',
      'XzIyTCveYRJJLSIAHl5c',
      'Zqi5ABlT71ebyuFMhxQb',
      'a9sPhiuEwZOJiaZRoLuq',
      'adqV3mizg54BTiw91An8',
      'lqvwa9UMbgDJ2eLgDgHD',
      'slI3uwxtrfmQzLqojdlW',
      'ud3aydhzdIaf13Znftpp',
      'xRvIHgECoPp1lJEMXTM5',
      'yuXTdGRwXy2Wg2ml37Ef'
    ]
    
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
    const isBeforeToday = date < new Date();
    if (isBeforeToday) {
      return true;
    }
    if (view === 'month') {
      return busyDates.some(busyDate => (
        busyDate.getDate() === date.getDate() &&
        busyDate.getMonth() === date.getMonth() &&
        busyDate.getFullYear() === date.getFullYear()
      ));
    }
    return false;
  };
  
  useEffect(()=>{
    setRent(inflatable.price*bookingDates.length)
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
            <img src={inflatable.image} />
            <div className='name-price'>
              <p id="name"> {inflatable.name} </p>
              <p id="price" style={{display: inflatable.name && inflatable.name.toLowerCase().includes('wedding') ? "none" : "block"}}>${inflatable.price} USD</p>
            </div>
            <p id="description"> {inflatable.description}</p>
            <div id='rentalInformation'>
              <p> Rental Information </p>
              <li> Maximum weight limit per person: 175 lbs </li>
              <li> Maximum number of jumpers allowed : 5</li>
              <li> Adult supervision is required at all times. </li>
              <li> Our inflatable deliveries are between 5am - 4pm daily.</li>
              <li> Our inflatable pick-ups start after 7pm daily. (Units may be left over night for an additional fee) </li>
              <li> Upon delivery, we set up and secure the unit with necessary tools. </li>
              <li> All blowers, stakes, and extension cords will be provided to set up the inflatable. </li>
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
                <button className='btn-book' onClick={()=>createRerservation()} style={{display: bookingDates.length > 0 && name.length > 0 && lastName.length > 0 && phone.length > 0 && email.length > 0 && address.length > 0?"block":"none"}}> Book Now </button>
                <p style={{display: bookingDates.length == 0?"block":"none"}}> *Select an available date </p>
            </div>
            <div style={{display:popup? "block":"none"}}>
              <div className="overlay" onClick={()=>setPopup(!popup)}/>
              <PaymentGateway 
                rent={rent} 
                popup={popup} 
                deliveryAmount={deliveryAmount} 
                tax={tax} 
                state={state}
              />
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