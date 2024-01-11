import React, { useEffect, useState, useRef } from "react";
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase';
import Header from '../components/Header'
import Footer from '../components/Footer'
import { unstable_HistoryRouter } from "react-router-dom";

function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all rentals')
  const containerRef = useRef(null);

  async function getInflatables() {
    let arrayInflatables = [];
    const querySnapshot = await getDocs(collection(db, "inflatables"));
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
        category: doc.data().category
      });
    });
    setInflatables(arrayInflatables);
  }

  useEffect(() => {
    getInflatables();
  }, []);

  function changeInflatable(id){
    window.location.href = '/#/inflatable?id=' + id
    if(window.location.href.includes('inflatable')){
      window.location.reload()
    }
  }

  useEffect(()=>{
    console.log(currentCategory);
  },[currentCategory])

  return (
    <div className="inflatables-page">
      <Header />
      <div className="container1">
        <div className="top-nav">
          <select onChange={(e)=>setCurrentCategory(e.target.value)}>
            <option value={"all rentals"} selected> All Rentals </option>
            <option value={"bounce houses"}> Bounce Houses </option>
            <option value={"combo jumpers"}> Combo Jumpers </option>
            <option value={"slides"}> Slides </option>
            <option value={"games and obstacles"}> Games & Obstacles </option>
            <option value={"extras"}> Extras </option>
          </select>
        </div>
        <div className="inflatables" ref={containerRef}>
            {currentCategory === 'all rentals' ? (
             <div>
               {inflatables.map((inflatable) => (
              <div className="inflatable" key={inflatable.id}>
               <img src={inflatable.image} />
               <div id="name-price">
                 <p id="name">{inflatable.name}</p>
                 <p id="price">${inflatable.price}</p>
               </div>
               <p id="description"> {inflatable.description}</p>
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
               <button onClick={()=>changeInflatable(inflatable.id)}> Read More</button>
              </div>
               ))}
             </div>
            ): (
             <div>
            {inflatables
              .filter(inflatable => inflatable.category.includes(currentCategory))
              .map((inflatable) => (
              <div className="inflatable" key={inflatable.id}>
                <img src={inflatable.image} />
              <div id="name-price">
                <p id="name">{inflatable.name}</p>
                <p id="price">${inflatable.price}</p>
              </div>
              <p id="description"> {inflatable.description}</p>
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
              <button onClick={()=>changeInflatable(inflatable.id)}> Read More</button>
              </div>
            ))}
             </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Inflatables