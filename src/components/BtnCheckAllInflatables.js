import React from 'react'
import { Link } from 'react-router-dom'

function BtnCheckAllInflatables() {
  return (
    <div>
      <Link className='btn-checkInflatables' to="/inflatables">  Check All Inflatables </Link>
    </div>
  )
}

export default BtnCheckAllInflatables