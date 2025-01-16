import React from "react";

import { useState } from 'react';

import bGL from '../../assets/icons8-alien-monster-emoji-48.png';

import { Link , useNavigate} from 'react-router-dom';

import{UserAuth} from '../../context/AuthContext'
import { auth } from "../../Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import './signup.scss';

const Login = () => {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {user , logIn} = UserAuth();

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success('Password Reset Email Sent');
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.code , error.message);
        });
      };

    

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
          <div className="logolog"><img src={bGL} alt="logo" /></div>
                
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
<div className="fogetpassword"> Forgot Password ? <Button onClick={handleResetPassword}>Reset Password</Button></div>
 
                        
                       </div>
       </div>
       </>
    )
}

export default Login;
