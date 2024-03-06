import React, { useEffect, useState, useRef } from "react";
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase';
import { Link } from "react-router-dom";

function Inflatables(props) {
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
        category:doc.data().category,
        description: doc.data().description,
        height: doc.data().height,
        image: doc.data().image,
        name: doc.data().name,
        price: doc.data().price,
        width: doc.data().width, 
        wetDry:doc.data().wetDry, 
      });
    });
    let arrayExtras = []
    const querySnapshot2 = await getDocs(collection(db, "extras"));
    querySnapshot2.forEach((doc) => {
      arrayExtras.push({
        id: doc.id,
        capacity: '',
        category:doc.data().category,
        description: doc.data().description,
        height: 0,
        image: doc.data().image,
        name: doc.data().name,
        price: doc.data().price,
        width: 0
      })
    });

    // let bothArrays = arrayInflatables.join(arrayExtras)
   let bothArrays = arrayInflatables.concat(arrayExtras)

    setInflatables(bothArrays)
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

  //IF THERE'S A PROPS.CATEGORY WILL DISPLAY THE ONES THAT MATCHES, OTHERWISE WILL SHOW ALL 
  const filteredInflatables = props.category? inflatables.filter((inflatable) => inflatable.category === props.category): inflatables;
  
  
  return (
    <div className="carousel-inflatables">
      <i className="bi bi-chevron-compact-left iconChev" onClick={handleScrollToLeft}></i>
      <div className="inflatables" ref={containerRef}>
        {filteredInflatables.map((inflatable) => (
          <div className="inflatable" key={inflatable.id}>
            <img src={inflatable.image} />
          <div id="name-price">
            <p id="name">{inflatable.name}</p>
            <p id="price" style={{display: inflatable.name.toLowerCase().includes('wedding') ? "none" : "block"}}>${inflatable.price}</p>
          </div>
          <p id="description" style={{height: inflatable.category !== 'extras' ? "100px":"150px"}}> {inflatable.description}</p>
          <div id="dimentions" style={{display: inflatable.category !== 'extras' ? "grid":"none"}}>
            <div className="dimention">          
              <p className="value">{inflatable.width} ft </p>
              <p className="type"> Width</p>
            </div>
            <div className="dimention">          
              <p className="value">{inflatable.height} ft </p>
              <p className="type"> Height</p>
            </div>
            <div className="dimention">
                  {inflatable.wetDry === 'Wet / Dry' ? (
                      <p className="value">
                        <i className="bi bi-brightness-high-fill iconDry"></i> 
                        <i className="bi bi-droplet-fill iconWet"></i>
                      </p>
                    ) : inflatable.wetDry === 'Dry' ? (
                      <p className="value">
                        <i className="bi bi-brightness-high-fill iconDry"></i>
                      </p>
                    ) : inflatable.wetDry === 'Wet' ? (
                      <p className="value">
                        <i className="bi bi-droplet-fill iconWet"></i>
                      </p>
                  ): null}
                  <p className="type"> {inflatable.wetDry}</p>
                </div>
          </div>
          {}
          <Link className="btn-readMore" to={inflatable.category == 'extras' ? '/extra/' + inflatable.id : "/inflatable/" + inflatable.id}> Read More </Link>
          
          </div>
        ))}
      </div>
      <i className="bi bi-chevron-compact-right iconChev" onClick={handleScrollToRight}></i>
    </div>
  );
}

export default Inflatables;
