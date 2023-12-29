import React from 'react';
import person1 from '../images/person1.png';
import person2 from '../images/person2.png';
import person3 from '../images/person3.png';

function Comment(props) {
    
  function getImage(id) {
    switch (id) {
      case 1:
        return person1;
      case 2:
        return person2;
      case 3:
        return person3;
      default:
        return null; 
    }
  }

  return (
    <div className='comment'>
      <img src={getImage(props.image)} alt={`Person ${props.image}`} />
      <div className='stars'>
        {[...Array(props.stars)].map((_, index) => (
          <i key={index} className="bi bi-star-fill iconStar"></i>
        ))}
      </div>
      <p id='name'> {props.name} </p>
      <p id="comment"> {props.comment} </p>
    </div>
  );
}

export default Comment;
