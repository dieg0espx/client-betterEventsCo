import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Test() {
  const [miles, setMiles] = useState(0)

  async function calculateDistance(){
    fetch('https://server-better-events.vercel.app/api/calculateDistance?deliveryAddress=488 Helmcken St')
    .then((response) => response.json())
    .then((response) => setMiles(parseFloat(response.rows[0].elements[0].distance.text.split(' ')[0])))
  }

  useEffect(() => {
    calculateDistance();
  }, []);

  return <div>
    {miles}
  </div>;
}

export default Test;
