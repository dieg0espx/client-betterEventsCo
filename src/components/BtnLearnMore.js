import React from 'react'
import { Link } from 'react-router-dom'

function BtnLearnMore() {
  return (
    <div>
        <Link className='btn-contact' to="/services">  Learn More </Link>
    </div>
  )
}

export default BtnLearnMore
