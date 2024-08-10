import React from "react";

import './signup.scss';

import bg from '../../assets/footer-bg.jpg';

import { Link , useNavigate} from 'react-router-dom';

import { useState } from 'react';

import {UserAuth} from '../../context/AuthContext'


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signUp} = UserAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
     


    return (
        <>
         <div className="signup" style={{backgroundImage: `url(${bg})`}}>
            <div className="signup__contentcontainer">
                
                            <h2>SignUp</h2>
                            <form onSubmit={handleSubmit}>
                                <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" placeholder="Email"  />
                                <input
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password" placeholder="Password" />

                                <button type="submit">SignUp</button>
                            </form>
                        </div>
            </div>
        </>
    )

}

export default Signup;
