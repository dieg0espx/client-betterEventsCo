import React, { useEffect, useState, useRef } from "react";
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase';

function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([]);
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
        width: doc.data().width
      });
    });
    setInflatables(arrayInflatables);
  }

  useEffect(() => {
    getInflatables();
  }, []);

  const handleScrollToLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 50;
    }
  };

  const handleScrollToRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 50;
    }
  };
  
  function changeInflatable(id){
    window.location.href = '/#/inflatable?id=' + id
    if(window.location.href.includes('inflatable')){
      window.location.reload()
    }
  }

  return (
    <div className="carousel-inflatables">
      <i className="bi bi-chevron-compact-left iconChev" onClick={handleScrollToLeft}></i>
      <div className="inflatables" ref={containerRef}>
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
          <button onClick={() => window.location.href='/#/inflatable?id=' + inflatable.id}>Read More</button>
          </div>
        ))}
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
          <button onClick={() => window.location.href='/#/inflatable?id=' + inflatable.id}>Read More</button>
          </div>
        ))}
      </div>
      <i className="bi bi-chevron-compact-right iconChev" onClick={handleScrollToRight}></i>
    </div>
  );
}

export default Inflatables;
