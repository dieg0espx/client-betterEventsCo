import React , { useRef } from "react";
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


  return (
    <div className='home'>
      <Header />
      <div className='container1'>
        <h1> Better Events Co.</h1>
        <h2> Bouncing Smiles, Crafting Memories </h2>
        <ButtonContact />
      </div>
      <div className='container2'>
        <Inflatables />
      </div>
      <div className='container3'>
          <img src={inflatable1} />
          <div>
            <p className='subTitle'> Lorem Ipsum Dolor Siot Amer </p> 
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque. Quisque id sodales libero. In nec enim nisi. Quisque aliquet a augue nec venenatis. Curabitur ullamcorper volutpat velit, et cursus tortor tempus at. Integer bibendum ullamcorper sagittis. Nulla facilisi. Integer sapien est, iaculis in quam in, aliquam bibendum libero. </p>
            <BtnLearnMore />
          </div>
      </div>
      <div className='container4'>
        <div className='eventTypes'>
          <img src={stock2} />
          <h3> School Events </h3>
          <p> At Better Events Co, We recognize the significance of creating exceptional school events. Our commitment is to provide a premium experience, prioritizing both safety and peace of mind.</p>
          <BtnLearnMore />
        </div>
        <div className='eventTypes'>
          <img src={stock3} />
          <h3> Corporate Events </h3>
          <p> We specialize in planning events like picnics, wellness sessions, and holiday parties. Corporate party planning can be overwhelming, but we make it seamless for you. </p>
          <BtnLearnMore />
        </div>
        <div className='eventTypes'>
          <img src={stock4} />
          <h3> Birthday Parties </h3>
          <p> We excels in crafting unforgettable birthday celebrations. Planning a perfect party can be overwhelming, but with us, it's seamless and enjoyable.  </p>
          <BtnLearnMore />
        </div>
      </div>
      <div className='container5'>
          <div className='txt-container5'> 
            <p className='subTitle'> Home Rental </p> 
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque. Quisque id sodales libero. In nec enim nisi. Quisque aliquet a augue nec venenatis. Curabitur ullamcorper volutpat velit, et cursus tortor tempus at. Integer bibendum ullamcorper sagittis. Nulla facilisi. Integer sapien est, iaculis in quam in, aliquam bibendum libero. </p>
            <BtnLearnMore />
          </div>
          <img src={stock5} />
      </div>
      <div className='container6'>
        <Checks title="Title 1" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque." />
        <Checks title="Title 2" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque." />
        <Checks title="Title 3" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, erat in malesuada aliquam, est erat faucibus purus, eget viverra nulla sem vitae neque." />
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
