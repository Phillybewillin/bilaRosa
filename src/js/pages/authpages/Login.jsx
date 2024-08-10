import React from "react";

import { useState } from 'react';

import bg from '../../assets/footer-bg.jpg';

import { Link , useNavigate} from 'react-router-dom';

import{UserAuth} from '../../context/AuthContext'

import './signup.scss';

const Login = () => {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {user , logIn} = UserAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await logIn(email, password);
             navigate('/');
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }
    return (
        <>
        <div className="signup" style={{backgroundImage: `url(${bg})`}}>
        <div className="signup__contentcontainer">
                
                <h2>LogIn</h2>
                           {error ? <p>{error}</p> : null}
                           <form onSubmit={handleSubmit}>
                   
                               <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"  />
                               <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                               <button type="submit">LogIn</button>
                           </form>
                        
                       </div>
       </div>
       </>
    )
}

export default Login;
