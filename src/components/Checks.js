import React from 'react'

function Checks(props) {
  return (
    <div className='check'>
        <i className="bi bi-check-circle iconCheck"></i>
        <h2> {props.title}</h2>
        <p> {props.description} </p>
    </div>
  )
}

export default Checks
