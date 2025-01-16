import React from "react";

import './signup.scss';

import bGL from '../../assets/icons8-alien-monster-emoji-48.png';


import { Link , useNavigate} from 'react-router-dom';

import { useState } from 'react';
import Button from "../../components/button/Button";
import {UserAuth} from '../../context/AuthContext'
import { toast } from "react-toastify";


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signUp} = UserAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            navigate('/account');
        } catch (error) {
          toast.error('email already in use try logging in' , error)
           // console.log(error);
        }
    }
     


    return (
        <>
         <div className="signup">
            <div className="signup__contentcontainer">
            <div className="logolog"><img src={bGL} alt="logo" /></div>
        
                            <h2 className="signuptitle">~ SignUp ~ ZILLAXR</h2>
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
      placeholder="Password" 
      autoComplete="current-password" 
    />
    <div className="butncont">
       <button className="passbutton" type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
      {passwordVisible ? <i className='bx bxs-hide'></i> : <i className='bx bxs-shield-plus'></i>}
    </button> 
    </div>
    
  </div>
  <div className="form-actions">
    <Button type="submit">SignUp</Button>
  </div>
</form>
                        </div>
            </div>
        </>
    )

}

export default Signup;
