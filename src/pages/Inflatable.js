import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Adjust import paths based on your setup
import app from '../Firbase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Calendar from 'react-calendar';
import Inflatables from '../components/Inflatables'

function Inflatable() {
  const [inflatable, setInflatable] = useState([])

  useEffect(() => {
    getInflatable();
  }, []);


  const getInflatable = async () => {
    const db = getFirestore(app);
    const docRef = doc(db, "inflatables", window.location.href.split('=')[1].toString());
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
            <Calendar  selectRange={true}/>
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