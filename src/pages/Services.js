import React, {useEffect, useRef} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import stock7 from '../images/stock7.png'
import ButtonContact from '../components/ButtonContact'
import map1 from '../images/map1.png'
import Faq from '../components/Faq'
import NewsLetter from '../components/NewsLetter'
import BtnCheckAllInflatables from '../components/BtnCheckAllInflatables'

function Services() {
    const scrollContainerRef = useRef(null);
    useEffect(()=>{
      window.scrollTo(0, 0);
      scrollContainerRef.current.scrollTop = 0;
    },[])
  return (
    <div className='services' ref={scrollContainerRef}>
        <Header />
            <div className='container1'>
                <img src={stock7} />
                <div>
                    <p className='subTitle'> Our Services </p>
                    <p> At Better Events, we specialize in turning ordinary events into extraordinary celebrations by providing top-notch inflatable entertainment for kids. Whether you're planning a birthday party, school event, community fair, or any special occasion, our high-quality inflatables are here to add a touch of joy and excitement.</p>
                    <BtnCheckAllInflatables />
                </div>
            </div>
            <div className='container2'>
                <p className='subTitle'> Why Choose Better Events</p>
                <div className='reasons'>
                    <div className='reason'>
                        <i className="bi bi-stack iconReason"></i>
                        <h3> Wide Variety </h3>
                        <p> From Magical bouncing castles to exciting inflatable slides, daredevil obstacle course, and entertaining interactive games, the options for fun are endless. </p>
                    </div>
                    <div className='reason'>
                        <i className="bi bi-person-fill-check iconReason"></i>
                        <h3> Professional Service </h3>
                        <p> Our dedicated team is committed to providing exceptional customer service. We'll collaborate with you to understand your event needs. </p>
                    </div>
                    <div className='reason'>
                        <i className="bi bi-clock iconReason"></i>
                        <h3> On-Time Delivery </h3>
                        <p> We understand the importance of punctuality. Trust Better Events to deliver and set up your inflatables on time, allowing the fun to start promptly. </p>
                    </div>
                </div>
            </div>
            <div className='container3'>
                <div>
                    <p className='subTitle'> Delivery Area </p>
                    <p> We proudly serve surrounding communities such as Belvidere, Pingree Grove, Huntley, Madison, Janesville, Schaumburg, Arlington Heights and Elgin. If your specific community is not listed, please reach out to us at (815) 200 9715, and we'll gladly provide delivery information for your location. Delivery rates vary based on dates, location, and types of equipment. Let Better Events make your event extraordinary.  </p>
                    <ButtonContact />
                </div>
                <img src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1707787769/IMG_0019_koz8ot_qhtetz.jpg'} />
            </div>
            <div className='container4'>
                <p className='subTitle'> Frequently Asked Questions </p>
                <Faq 
                    question={"What types of inflatables do you offer for rent?"} 
                    answer={"We offer a variety of inflatables, including bounce houses, inflatable slides, obstacle courses, and interactive games."} 
                />
                 <Faq 
                    question={"Are your inflatables safe for children?"} 
                    answer={"Yes, safety is our top priority. All our inflatables meet or exceed industry safety standards, and they are regularly inspected and cleaned to ensure a safe and enjoyable experience for children."}
                />
                 <Faq 
                    question={"What is included in the rental price?"} 
                    answer={"The rental price includes delivery, setup, and takedown of the inflatable. Additional fees may apply for delivery outside our standard service area."}
                />
                 <Faq 
                    question={"How long is the rental period?"} 
                    answer={"Our standard rental period is typically 8 hours, but longer rental periods can be arranged. Contact us for specific details."}
                />
                 <Faq 
                    question={"Do you provide attendants for the inflatables?"} 
                    answer={"We require adult supervision for all rentals."}
                />
            </div>
            <NewsLetter />
        <Footer />
    </div>
  )
}

export default Services
