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
    //   console.log(doc.id, " => ", doc.data());
      arrayInflatables.push(doc.data())
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
          <button> Read More </button>
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
          <button> Read More </button>
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
          <button> Read More </button>
        </div>
      ))}
    </div>
  )
}

export default Inflatables;
