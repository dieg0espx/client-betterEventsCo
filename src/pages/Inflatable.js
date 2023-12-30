import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Adjust import paths based on your setup
import app from '../Firbase'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Inflatable() {
  const [inflatable, setInflatable] = useState([])

  useEffect(() => {
    getInflatable();
  }, []);


  const getInflatable = async () => {
    const db = getFirestore(app);
    const docRef = doc(db, "inflatables", "0OOUQecSGREbZ3zsmkRV");
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
            <p> {inflatable.name} </p>
            <p> {inflatable.description} </p>
            
          </div>
          <div id="right">
            right
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default Inflatable