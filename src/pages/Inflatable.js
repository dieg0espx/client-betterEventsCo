import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import app from '../Firbase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Calendar from 'react-calendar';
import Inflatables from '../components/Inflatables'

function Inflatable() {
  const [inflatable, setInflatable] = useState([])
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState('')
  const [address, setAddress] = useState('')
  const [postCode, setPostalCode] = useState('')
  const [dates, setDates] = useState([])

  const db = getFirestore(app);

  useEffect(() => {
    getInflatable();
  }, []);


  const getInflatable = async () => {
    const docRef = doc(db, "inflatables", window.location.href.split('=')[1].toString());
    setId( window.location.href.split('=')[1].toString())
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setInflatable(docSnap.data())
      } else {
        alert("Inflatable Not Found")
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  async function createRerservation(){
    let data = {name, lastName, phone, email,address, postCode, dates}
    const docRef = await addDoc(collection(db, "bookings"), data);
    console.log("New Reservation ID: " + docRef);
    await addDates(dates)
  }

  async function addDates(dates){
    const inflatableRef = doc(db, "inflatables", id);
    await updateDoc(inflatableRef, {
      dates:dates
    });  
  }

  return (
    <div className='booking-inflatable'>
        <Header />
        <div className='main-container'>
          <div id="left">
            <img src={inflatable.image} />
            <div className='name-price'>
              <p id="name"> {inflatable.name} </p>
              <p id="price"> ${inflatable.price} USD </p>
            </div>
            <p id="description"> {inflatable.description}{inflatable.description}{inflatable.description}{inflatable.description} </p>
            <div id="dimentions">
              <div className="dimention">          
                <p className="value">{inflatable.width} ft </p>
                <p className="type"> Width</p>
              </div>
              <div className="dimention">          
                <p className="value">{inflatable.height} ft </p>
                <p className="type"> Height</p>
              </div>
              <div className="dimention">          
                <p className="value"> {inflatable.capacity} </p>
                <p className="type"> Kids</p>
              </div>
            </div>
          </div>
          <div id="right">  
            <Calendar  selectRange={true} onChange={setDates} />
            <div className='form'>
                <input onChange={(e)=>setName(e.target.value)} type='text' placeholder='First Name' />
                <input onChange={(e)=>setLastName(e.target.value)} type='text' placeholder='Last Name' />
                <input onChange={(e)=>setPhone(e.target.value)} type='tel' placeholder='Phone Number' />
                <input onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Email Address' />
                <input onChange={(e)=>setAddress(e.target.value)} type='text' placeholder='Address' />
                <input onChange={(e)=>setPostalCode(e.target.value)} type='text' placeholder='Postal Code' />
                <button className='btn-book' onClick={()=>createRerservation()}> Book Now </button>
            </div>
          </div>
        </div>
        <div className='recommendations'>
          <p className='subTitle'> You may also like ... </p>
          <Inflatables />
        </div>
        <Footer />
    </div>
  )
}

export default Inflatable