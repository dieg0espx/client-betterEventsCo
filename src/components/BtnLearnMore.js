import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BtnLearnMore(props) {
  const [direction, setDirection] = useState('/services');

  useEffect(() => {
    if (props.url) {
      setDirection(props.url);
    }
  }, [props.url]);

  return (
    <div>
      {props.url  ? (
        <button className='btn-contact' onClick={()=> window.open(direction, '_blank')}> Learn More </button>
      ) : (
        <Link className='btn-contact' to={props.link || direction}> Learn More </Link>
      )}
    </div>
  );
}

export default BtnLearnMore;
