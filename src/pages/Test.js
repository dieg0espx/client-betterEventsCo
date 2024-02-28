import React, { useEffect } from 'react';
import axios from 'axios';

function Test() {
  const APIKEY = 'AIzaSyBJLc7G1TkrBTRq3cge-TsYgNpEvDz3pyM';

  async function calculateDistance() {
    const deliveryAddress = '610 Granville Street, Vancouver';
    const vendorAddress = '488 Helmcken Street, Vancouver';
    const apiURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${vendorAddress}&destination=${deliveryAddress}&key=${APIKEY}`;

    try {
      const response = await axios.get(apiURL);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    calculateDistance();
  }, []);

  return <div>Test</div>;
}

export default Test;
