import React, {useEffect} from 'react'
import Header from '../components/Header'
import StripeContainer from '../components/StripeContainer'

function Invoice() {
    useEffect(() => { 
        document.body.style.backgroundColor = 'aliceblue';
      }, []);

      let invoice = {
        title: "Invoice 2", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        issued:"September 2, 2023", 
        amount:1234, 
        name:'Diego', 
        lastName:'Espinosa', 
        phone: '9999088639',
        email:'espinosa9mx@gmail.com', 
      }
      function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
        // Use the Intl.NumberFormat to format the number as currency
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
        });
      
        // Return the formatted currency string
        return formatter.format(amount);
      }
  return (
    <div className='container'>
        {/* <Header /> */}
        <div className='invoice'>
            <img src={'https://res.cloudinary.com/dxfi1vj6q/image/upload/v1706048357/BetterEvents-10_eabusi_ys0lwn.png'} />
            <hr></hr>
            <div className='grid'>
                <div>
                    <h2>{invoice.title}</h2>
                    <p id="description"> {invoice.description}</p>
                    <p id="issued"><b>Issued: </b> {invoice.issued}</p>
                </div>
                <div>
                    <h3 id="amount"> {formatCurrency(invoice.amount)} USD</h3>
                    <hr></hr>
                    <p className='clientInformation'> <i className="bi bi-check-circle-fill iconCheck"></i>{invoice.name} {invoice.lastName}</p>
                    <p className='clientInformation'> <i className="bi bi-check-circle-fill iconCheck"></i>{invoice.phone}</p>
                    <p className='clientInformation'> <i className="bi bi-check-circle-fill iconCheck"></i>{invoice.email}</p>
                    <StripeContainer balance={invoice.amount.toFixed(2)} isInvoice={true}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Invoice