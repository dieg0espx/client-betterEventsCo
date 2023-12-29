import React from 'react'
import { Link } from 'react-router-dom'

function ButtonContact() {
  return (
    <div>
        <Link className='btn-contact' to="/contact">  Contact Us </Link>
    </div>
  )
}

export default ButtonContact
