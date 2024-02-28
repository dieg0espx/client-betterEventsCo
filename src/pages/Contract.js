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

        <h2> LIABILITY RELEASE </h2>
        <li> This rental equipment has been received in good condition and will be returned in the same condition (ordinary wear and tear accepted). </li>
        <li> Lessee understands and acknowledges that play on an amusement device entails both known and unknown risks including, but not limited to, physical injury from falling, slipping, crashing or colliding, emotional injury, paralysis, distress, damage or death to any participant. Lessee agrees to indemnify and hold BETTER EVENTS CO harmless from any and all claims, actions, suits, proceedings, costs, expenses, fees, damages and liabilities, including, but not limited to, reasonable attorney’s fees and costs, arising by reason of injury, damage, or death to persons or property, in connection with or resulting from the use of the leased equipment. This includes, but is not limited to, the manufacture, selection, delivery, possession, use, operation, or return of the equipment. Lessee hereby releases and holds harmless BETTER EVENTS CO from injuries or damages incurred as a result of the use of the leased equipment. BETTER EVENTS CO cannot, under any circumstances, be held liable for injuries as a result of inappropriate use, God, nature, or other conditions beyond its control or knowledge. Lessee also agrees to indemnify and hold harmless BETTER EVENTS CO from any loss, damage, theft or destruction of the equipment during the term of the lease and any extensions thereof. </li>
        <li> The customer hereby consents to allow Better Events to access the rental premises in order to retrieve the equipment once the rental period has ended. Should the pick-up be required beyond the hours of 10pm or before 7am, the customer will be notified beforehand.</li>
        <li> It is agreed that the customer shall not lend, sublet, or in any way transfer the equipment to another party or utilize it at a different location. </li>
        <li> Moreover, the customer acknowledges their responsibility to cover the full replacement cost, including labor fees, for any damages incurred to the rental equipment. Please note that this provision does not apply if the 9% damage protection option is selected for the order. </li>
        <li> In the event of loss, theft, or irreparable damage to the inflatable equipment, the renter agrees to pay a sum of $2500.00 (two thousand five hundred dollars and 0 cents). </li>
      <li> No warranties, whether expressed or implied, are offered for the merchantability or fitness of the equipment. The customer or organization renting the equipment from Better Events Co assumes full responsibility and liability for any and all damages or injuries that may occur for any reason. By agreeing to the above terms and conditions, I understand and accept my responsibilities as stated. I acknowledge that while the equipment is in my care, I am fully accountable for any loss or damages that may arise. </li>
    </div>
  )
}

export default Contract