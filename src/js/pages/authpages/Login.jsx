import React from "react";

import { useState } from 'react';

import bg from '../../assets/footer-bg.jpg';

import { Link , useNavigate} from 'react-router-dom';

import{UserAuth} from '../../context/AuthContext'
import Button from "../../components/button/Button";
import './signup.scss';

const Login = () => {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {user , logIn} = UserAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await logIn(email, password);
             navigate('/account');
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }
    return (
        <>
        <div className="signup">
        <div className="signup__contentcontainer">
                
        <h2 className="signuptitle">~ Welcome Back ~ ZILLAXR</h2>
                           {error ? <p>Wrong Chicken Salad</p> : null}
                           <form onSubmit={handleSubmit}>
  <div className="form-group">
    
    <input 
      onChange={(e) => setEmail(e.target.value)} 
      type="email" 
      placeholder="Email" 
      autoComplete="email" 
    />
  </div>
  <div className="form-group">
   
    <input
      onChange={(e) => setPassword(e.target.value)} 
      type={passwordVisible ? "text" : "password"} 
      placeholder="Fried Chicken 12" 
      autoComplete="current-password" 
    />
    <div className="butncont">
       <button className="passbutton" type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
      {passwordVisible ? <i className='bx bxs-hide'></i> : <i className='bx bxs-shield-plus'></i>}
    </button> 
    </div>
    
  </div>
  <div className="form-actions">
    <Button type="submit">Log In</Button>
  </div>
</form>
                        
                       </div>
       </div>
       </>
    )
}

export default Login;
