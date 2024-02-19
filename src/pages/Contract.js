import React, { useEffect, useRef } from 'react'
import Header from '../components/Header'

function Contract() {
  const scrollContainerRef = useRef(null);
  useEffect(()=>{
      window.scrollTo(0, 0);
      scrollContainerRef.current.scrollTop = 0;
  },[])

  return (
    <div className='wrapper-contract' ref={scrollContainerRef}>
        <Header />
        <h2> Rules and Regulations: </h2>
        <li> Maximum weight limit per person: 175 Ibs </li>
        <li> Maximum number of jumpers allowed: 6 </li>
        <li> All jumpers must remove shoes, jewelry, badges, eyeglasses, and any sharp objects before entering the inflatable. </li>
        <li> Absolutely no confetti, gum, food, drinks, sprays, or other sticky substances are allowed inside the inflatable. </li>
        <li> Piñata's are not allowed in the bounce house. </li>
        <li> No smoking allowed on or around the inflatable. </li>
        <li> To prevent neck and back injuries, no wrestling, colliding, or fighting is permitted.</li>
        <li> Do not bounce against the sides or near the doorway of the bounce house. </li>
        <li> Individuals with head, back, neck, or any muscular-skeletal injuries or disabilities, pregnant women, children under 3 years of age, and others who may be susceptible to injury from falls, bumps, or bouncing are not allowed in the unit at any time. </li>
        <li> Do not allow older children to jump with younger children. </li>
        <li> Do not hang from the netting on the sides or from the roof of the bounce house. </li>
        <li> Keep the inflatable away from heat and open flames at all times as the material may burn or melt. </li>
        <li> If the inflatable begins to lose air, exit immediately. </li>
        <li> In case of high winds, exit the bounce house immediately and turn off the blower. </li>
        <li> Keep children away from the blower unit. </li>
        <li> Do not operate the bounce house during rain or on wet ground to avoid slipping hazards. </li>
        <li> Children's safety is your responsibility. As the lessee of the bounce house, you are responsible for the safety of all individuals who come in contact with the bounce house or its parts. </li>
        <li> Weather Policy: We reserve the right to cancel any reservations in case of severe or imminent deterioration of weather conditions.</li>
        <li> Cancellation Policy: A 24-hour notice is required for cancellation, except in the case of severe weather conditions. </li>
    </div>
  )
}

export default Contract