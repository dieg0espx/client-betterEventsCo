import React, { useEffect, useState } from "react";
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase'

function Inflatables({ containerRef }) {
  const db = getFirestore(app);
  const [Inflatables, setInflatables] = useState([])

  async function getInflatables() {
    let arrayInflatables = []
    const querySnapshot = await getDocs(collection(db, "inflatables"));
    querySnapshot.forEach((doc) => {     
      arrayInflatables.push({
        id:doc.id, 
        capacity: doc.data().capacity, 
        description: doc.data().description, 
        height: doc.data().height, 
        image: doc.data().image, 
        name: doc.data().name, 
        price: doc.data().price,
        width: doc.data().width
      })
    });
    setInflatables(arrayInflatables)
  }

  useEffect(()=>{
    getInflatables()
  },[])

  useEffect(()=>{
    if(Inflatables.length > 0){
        console.log(Inflatables);
    }    
  },[Inflatables])

  return (
    <div className="inflatables" ref={containerRef}>
      {Inflatables.map((inflatable) => (
        <div className="inflatable">
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
          <button onClick={() => window.location.href='/#/inflatable?id=' + inflatable.id}>Read More</button>
        </div>
      ))}
        {Inflatables.map((inflatable) => (
        <div className="inflatable">
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
          <button onClick={() => window.location.href='/#/inflatable?id=' + inflatable.id}>Read More</button>
        </div>
      ))}
        {Inflatables.map((inflatable) => (
        <div className="inflatable">
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
          <button onClick={() => window.location.href='/#/inflatable?id=' + inflatable.id}>Read More</button>
        </div>
      ))}
    </div>
  )
}

export default Inflatables;
