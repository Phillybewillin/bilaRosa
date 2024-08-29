import React, { useState } from 'react';
import './contact.scss';
const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    //console.log('Form submitted:', name, email, message);
  };

  return (
    <div className="contact-page">
       <div className="accaz">
                    <a href="https://t.me/+MQUUqEx2WXA0ZmZk" target="_blank" rel="noreferrer"><i className="bx bxl-telegram" style={{color: 'white', fontSize: '25px',padding : '5px',backgroundColor : 'black',borderRadius : '5px'}}></i> <h5>Telegram</h5></a>
                    <a href="https://reddit.com/r/zillaXRxyz" target="_blank " rel="noreferrer"><i className="bx bxl-reddit"style={{color: 'red',fontSize: '25px',padding : '5px',backgroundColor : 'black',borderRadius : '5px',marginLeft:"5px"}}></i> <h5>Reddit</h5></a>
                    <a href="https://x.com/ZillaXRxyz" target="_blank" rel="noreferrer"><i className="bx bxl-twitter" style={{color: 'aqua', fontSize: '25px' ,backgroundColor:"black", padding:"5px" ,borderRadius:"5px" ,marginLeft:"5px"}}></i> <h5>Twitter</h5></a>
                  
      </div>
      <h1>Contact Us</h1>

      <h4>Fill out the form below ,if you have any problem or suggestions and will get in touch .</h4>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" name="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Message:
          <textarea name="message" value={message} onChange={(event) => setMessage(event.target.value)} />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
