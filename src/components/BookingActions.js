import React, { useEffect, useState } from 'react'

function BookingActions(props) {

    const [confimation, setConfirmation] = useState(false)


    // useEffect(()=>{
    //     console.log(props.inflatableID)
    //     console.log(props.dates)
    // },[props.inflatableID, props.dates])

    // Function to get the cart from session storage
    const getCart = () => {
        const cart = sessionStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    };

    // Function to add an item to the cart
    const addToCart = (item) => {
        const cart = getCart();
        cart.push(item);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        // console.log('Cart updated:', cart);
    };

    // Function to handle adding current booking to the cart
    const handleAddToCart = () => {
        if(props.dates.length == 0){
            alert("Please Select Valid Dates :)")
        } else {
            const bookingInfo = {
                inflatableID: props.inflatableID,
                dates: props.dates,
            };
            addToCart(bookingInfo);
            setConfirmation(true)
        }
    };
    const handleAddToCartAndCheckout = () => {
      if(props.dates.length == 0){
          alert("Please Select Valid Dates :)")
      } else {
          const bookingInfo = {
              inflatableID: props.inflatableID,
              dates: props.dates,
          };
          addToCart(bookingInfo);
          window.location.href ='/#/checkout'
      }
  };


  return (
    <div className='booking-actions'>
      <div className='btn-action' onClick={()=> handleAddToCart()}>
        <i className="bi bi-cart-plus iconBookingActions"></i>
        <p> Add To Cart </p>
        <i className="bi bi-chevron-compact-right iconBookingActions"></i>
      </div>
      <div className='btn-action'onClick={()=> handleAddToCartAndCheckout()}>
        <i className="bi bi-credit-card-2-front iconBookingActions"></i>
        <p> Proceed To CheckOut </p>
        <i className="bi bi-chevron-compact-right iconBookingActions"></i>
      </div>
      <div className='overlay' style={{display: confimation ? "block":"none"}} onClick={()=>setConfirmation(!confimation)} ></div>
      <div className='confirmation' style={{display: confimation ? "flex":"none"}}>
        <i className="bi bi-cart-check iconCart"></i>
        <h2> Now it's in your cart ! </h2>
        <p>{props.inflatableName}</p>
        <button onClick={()=>window.location.href='/#/inflatables'}> Explore More </button>
      </div>
    </div>
  )
}

export default BookingActions
