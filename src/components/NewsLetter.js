import React , {useState} from 'react'
import { getFirestore, doc, addDoc, collection} from 'firebase/firestore';
import app from '../Firbase'


function NewsLetter() {
  const db = getFirestore(app);
  const [email, setEmail] = useState('')

  async function addClient(){
    await addDoc(collection(db, "newsLetter"), {
      email:email
    });
    alert("Congratulations ! You will now be receiving the newsletter.")
    setEmail('')
  }
 

  return (
    <div className='newsLetter'>
      <h2> Join Our NewsLetter !</h2>
      <input type='email' placeholder='example@mail.com'  value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <button onClick={()=>addClient()}> Join Now</button>
    </div>
  )
}

export default NewsLetter
