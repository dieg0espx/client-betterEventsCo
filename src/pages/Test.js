import React, { useEffect } from 'react'

function Test() {

    const APIKEY = 'AIzaSyBJLc7G1TkrBTRq3cge-TsYgNpEvDz3pyM'

    async function calculateDistance(){
        const deliveryAddress = '610 Granville Street, Vancouver'
        const vendorAddress =  '488 Helmcken Street, Vancouver'
        const apiURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${vendorAddress}&destination=${deliveryAddress}&key=${APIKEY}`

        console.log(apiURL);
        await fetch(apiURL)
          .then((response) => response.json())
          .then((response) => console.log(response))
          .catch((error) => console.error('Error fetching data:', error));
    }

    useEffect(()=>{
        calculateDistance()
    },[])


  return (
    <div>Test</div>
  )
}

export default Test