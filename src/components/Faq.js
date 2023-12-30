import React from 'react'

function Faq(props) {
  return (
    <div className='faq'>
      <p className='question'>{props.question}</p>
      <p className='answer'>{props.answer}</p>
    </div>
  )
}

export default Faq
