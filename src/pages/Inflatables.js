import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firbase';
import Header from '../components/Header'
import Footer from '../components/Footer'

function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([]);
  const [extras, setExtras] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all rentals')
  const containerRef = useRef(null);

  const { category } = useParams();

  useEffect(()=>{
    switch (category) {
      case 'all-rentals':
        setCurrentCategory('all rentals')
        break;
      case 'bounce-houses':
          setCurrentCategory('bounce houses')
          break;
      case 'combo-jumpers':
        setCurrentCategory('combo jumpers')
        break;
      case 'slides':
        setCurrentCategory('slides')
        break;
      case 'games-and-obstacles':
        setCurrentCategory('games and obstacles')
        break;
      case 'packages':
        setCurrentCategory('packages')
        break;
      case 'extras':
        setCurrentCategory('extras')
        break;
      default:
        setCurrentCategory('all rentals')
        break;
    }
  },[category])
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
        category: doc.data().category, 
        wetDry: doc.data().wetDry
      });
    });
    arrayInflatables.sort((a, b) => a.name.localeCompare(b.name));
    setInflatables(arrayInflatables);
  }
  async function getExtras() {
    let arrayExtras = [];
    const querySnapshot = await getDocs(collection(db, "extras"));
    querySnapshot.forEach((doc) => {
      arrayExtras.push({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        image: doc.data().image,
        category: 'extras'
      });
    });
    arrayExtras.sort((a, b) => a.name.localeCompare(b.name));
    arrayExtras.sort((a, b) => {

      const aIncludesRockford = a.id.includes('I98cVelMeBRJ0VriXnPh');
      const bIncludesRockford = b.id.includes('I98cVelMeBRJ0VriXnPh');

      if (aIncludesRockford && !bIncludesRockford) {
          return -1; // Move a to an index lower than b
      } else if (!aIncludesRockford && bIncludesRockford) {
          return 1; // Move b to an index lower than a
      } else {
        // Custom sorting function to prioritize items without a number in the name
        const aHasNumber = /\d/.test(a.name); // Check if a.name contains a number
        const bHasNumber = /\d/.test(b.name); // Check if b.name contains a number
        
        if (!aHasNumber && bHasNumber) {
          return -1;
        } else if (aHasNumber && !bHasNumber) {
          return 1;
        } else {
          // If neither or both include a number, use the previous sorting logic
          const aIncludesPackages = a.name.toLowerCase().includes('packages');
          const bIncludesPackages = b.name.toLowerCase().includes('packages');
        
          if (aIncludesPackages && !bIncludesPackages) {
            return -1;
          } else if (!aIncludesPackages && bIncludesPackages) {
            return 1;
          } else {
            // If neither or both include 'Packages', use default sorting
            return a.name.localeCompare(b.name);
          }
        }
      }
    });
    
    setExtras(arrayExtras);
  }
  useEffect(() => {
    getInflatables();
    getExtras()
  }, []);

  return (
    <div className="inflatables-page">
      <Header />
      <div className="container1">
        <div className="top-nav">
          <select value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)}>
            <option value={"all rentals"} selected>All Rentals</option>
            <option value={"bounce houses"}> Bounce Houses </option>
            <option value={"combo jumpers"}> Combo Jumpers </option>
            <option value={"slides"}> Slides </option>
            <option value={"games and obstacles"}> Games & Obstacles </option>
            <option value={"packages"}> Packages </option>
            <option value={"extras"}> Extras </option>
          </select>
        </div>
        <div className="inflatables" ref={containerRef}>
          {
           currentCategory === "all rentals"? inflatables.map((inflatable) => (
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
              <Link className="btn-readMore" to={"/inflatable/" + inflatable.id}>Read More</Link>
            </div>
            ))
            .concat(
              extras
                .map(extra => (
                  <div className="inflatable" key={extra.id}>
                    <img src={extra.image} alt={extra.name} />
                    <div id="name-price">
                      <p id="name">{extra.name}</p>
                      <p id="price" style={{display: extra.name.toLowerCase().includes('wedding') ? "none" : "block"}}>${extra.price}</p>
                    </div>
                    <p id="description" style={{ height: '150px' }}>{extra.description}</p>
                    <Link className="btn-readMore" to={"/extra/" + extra.id}>Read More</Link>
                  </div>
                ))
            )
          : 
            inflatables
            .filter((inflatable) => inflatable.category.includes(currentCategory))
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
                    <Link className="btn-readMore" to={"/inflatable/" + inflatable.id}>Read More</Link>
                  </div>
            ))
            .concat(
              extras
                .filter((extra) => currentCategory === 'extras' || (currentCategory === 'packages' && extra.name.toLowerCase().includes('package')) || (currentCategory === 'packages' && extra.name.toLowerCase().includes('pkg')))
                .map((extra) => (
                  <div className="inflatable" key={extra.id} style={{display: currentCategory == 'extras' && extra.name.toLowerCase().includes('package') ? "none":"block"}}>
                    <img src={extra.image} alt={extra.name} />
                    <div id="name-price">
                      <p id="name">{extra.name}</p>
                      <p id="price" style={{display: extra.name.toLowerCase().includes('wedding') ? "none" : "block"}}>${extra.price}</p>
                    </div>
                    <p id="description" style={{ height: '150px' }}>{extra.description}</p>
                    <Link className="btn-readMore" to={"/extra/" + extra.id}>Read More</Link>
                  </div>
                ))
            )
            
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Inflatables