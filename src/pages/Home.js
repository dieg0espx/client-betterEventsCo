import React , { useEffect, useRef } from "react";
import Header from '../components/Header'
import stock1 from '../images/stock1.png'
import stock2 from '../images/stock2.png'
import stock3 from '../images/stock3.png'
import stock4 from '../images/stock4.png'
import stock5 from '../images/stock5.png'

import inflatable1 from '../images/inflatable1.png'
import ButtonContact from '../components/ButtonContact'
import BtnLearnMore from '../components/BtnLearnMore'
import Checks from '../components/Checks'
import Comment from '../components/Comment'
import Footer from '../components/Footer'
import NewsLetter from '../components/NewsLetter'
import Inflatables from '../components/Inflatables'

function Home() {
  const scrollContainerRef = useRef(null);
  useEffect(()=>{
    window.scrollTo(0, 0);
    scrollContainerRef.current.scrollTop = 0;
  },[])
  return (
    <div className='home' ref={scrollContainerRef}>
      <Header />
      <div className='container1'>
        <h1> Better Events</h1>
        <h2> Making Every Event Better ! </h2>
        <ButtonContact />
      </div>
      <div className='container2'>
        <Inflatables />
      </div>
      <div className='container3'>
          <img src={inflatable1} />
          <div>
            <p className='subTitle'> About Us </p> 
            <p> Better Events is the premier party rental company in Northern Illinois, offering superior bounce houses,combos, water slides, games, tents, tables, and chairs for your birthday or special event. Our range of inflatables are conveniently delivered to the greater Rockford area and nearby suburbs. When in need of an inflatable rental in northern Illinois, trust Better Events to be your reliable partner for your next special occasion. </p>
            <BtnLearnMore />
          </div>
      </div>
      <div className='container4'>
        <div className='eventTypes'>
          <img src={stock2} />
          <h3> School Events </h3>
          <p> Better Events understands the importance of having the best school event. We deliver a high quality experience while focusing on safety and peace of mind. We take the safety and the health of all our customers and their guests very serious. </p>
          <BtnLearnMore />
        </div>
        <div className='eventTypes'>
          <img src={stock3} />
          <h3> Corporate Events </h3>
          <p> Better Events understands the importance of planning a special event such as a picnic, wellness event, or holiday party. The planning of a corporate party can be long and overwhelming. Better events will work with you to make this process as seamless as possible. </p>
          <BtnLearnMore />
        </div>
        <div className='eventTypes'>
          <img src={stock4} />
          <h3> Birthday Parties </h3>
          <p>Looking for a way to make your next birthday party even more special? Look no further than Better Events! We partner with Better Stays to offer full vacation home rentals that include inflatables for a fun and memorable celebration.</p>
          <BtnLearnMore url="https://betterstaynow.com"/>
        </div>
      </div>
      <div className='container5'>
          <div className='txt-container5'> 
            <p className='subTitle'> Wedding Venues </p> 
            <p> Ready to tie the knot? Look no further than Better Stays - our vacation rental partners not only offer beautiful rental spaces, but also transforms into the perfect wedding venues. Our tables, chairs, and tents make planning a breeze. Say "I do" to a Better Stay for your special day  </p>
            <BtnLearnMore link="/inflatables/packages"/>
          </div>
          <img src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706655268/original_51752222_1253204812_fjtcqa.jpg'} />
      </div>
      <div className='container6'>
        <Checks title="Punctuality" description=" We take pride in being a reliable partner for our customers. Our dedicated team ensures that the inflatables you choose for your event are delivered, set up, and picked up with the utmost punctuality."/>
        <Checks title="Safety" description="Safety is our utmost priority in delivering a memorable and worry-free experience for your events. We understand the significance of creating joyous moments while ensuring the well-being of all participants. " />
        <Checks title="Quality" description="We take immense pride in our unwavering commitment to quality. Our extensive range of inflatables is crafted with meticulous attention to detail, using top-tier materials that guarantee durability and safety."/>
      </div>
      <div className='container7'>
          <h3> Customer Testimonials: Voices of Satisfaction </h3>
          <div className='grid-comments'>
            <Comment image={1} stars={5} name={"Emily Johnson"} comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque. Quisque id sodales libero. In nec enim nisi."} />
            <Comment image={2} stars={5} name={"Alexander Mitchell"} comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque. Quisque id sodales libero. In nec enim nisi."} />
            <Comment image={3} stars={5} name={"Jessica Davis"} comment={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque. Quisque id sodales libero. In nec enim nisi."} />
          </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  )
}

export default Home
