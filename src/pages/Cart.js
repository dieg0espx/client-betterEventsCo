import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase';

function Cart() {
  const db = getFirestore(app);
  const [cart, setCart] = useState([]);
  const [inflatables, setInflatables] = useState([]);
  const [selectedInflatables, setSelectedInflatables] = useState([]);
  const [extras, setExtras] = useState([])
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [cartEmpty, setCartEmpty] = useState(true)

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      getInflatables();
      getExtras()
    }
  }, []);

  useEffect(()=>{
    getSelectedInflatables()
    getSelectedExtras()
  },[cart, inflatables, extras])


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
    if(arrayInflatables.length > 0){
      setCartEmpty(false)
    }
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
    if(arrayExtras.length > 0){
      setCartEmpty(false)
    }
  }


  function getSelectedInflatables() {
    const selected = [];
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const selectedInflatable = inflatables.find(
        inflatable => inflatable.id === cartItem.inflatableID
      );
      if (selectedInflatable) {
        selectedInflatable.dates = cartItem.dates;
        selected.push(selectedInflatable);
      }
    }
    setSelectedInflatables(selected);
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

  function removeProduct(i){
    const storedCart = JSON.parse(sessionStorage.getItem('cart'));
    const updatedCart = [...storedCart];
    updatedCart.splice(i, 1);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  }
  
  
  return (
    <div className='cart-page'>   
        <Header />
        <div className='content'>
            <h2> Cart  </h2>
            {selectedInflatables.map((inflatable, i) => (
              <div className="row" key={inflatable.id}>
                <img src={inflatable.image} />
                <p>{inflatable.name}</p>
                <p>${inflatable.price} USD / day</p>
                <div>
                  {inflatable.dates.map((date, index) => (
                    <p key={index}>{date}</p>
                  ))}
                </div>
                <i className="bi bi-trash iconTrash" onClick={()=>removeProduct(i)}></i>
              </div>
            ))}
            {selectedExtras.map((inflatable, i) => (
              <div className="row" key={inflatable.id}>
                <img src={inflatable.image} />
                <p>{inflatable.name}</p>
                <p>${inflatable.price} USD / day</p>
                <div>
                  {inflatable.dates.map((date, index) => (
                    <p key={index}>{date}</p>
                  ))}
                </div>
                <i className="bi bi-trash iconTrash" onClick={()=>removeProduct(i)}></i>
              </div>
            ))}
            <div id='notice' style={{display: cartEmpty ? "block":"none"}}>
            <i className="bi bi-cart-x emptyCartIcon"></i>
            <p> Your shopping cart is empty at the moment. Please consider adding products. </p>
            </div>
            <button onClick={()=>window.location.href = '/#/checkout'} style={{display: cartEmpty ? 'none':'block'}}> Check Out <i className="bi bi-chevron-right iconCheckOut"></i> </button>
        </div>
        <Footer />
    </div>
  )
}

export default Cart
