import React from "react";
import './signup.scss';
import bGL from '../../assets/LOGGO3.png';
import { Link , useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/button/Button";
import {UserAuth} from '../../context/AuthContext';
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Signup = ({ onClose }) => { // Accept onClose prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signUp} = UserAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            navigate('/account'); // Navigate on successful signup
            onClose(); // Close the modal after successful signup
        } catch (error) {
            toast.error('Email already in use, try logging in');
            console.error("Signup error:", error); // Log the actual error for debugging
        }
    };

    // Framer Motion variants for the modal container
    const modalVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.3 } }
    };

    // Framer Motion variants for the overlay
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    // Function to handle clicks on the overlay
    const handleOverlayClick = (e) => {
        // Close the modal only if the click is directly on the overlay, not its children
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {/* The modal is always rendered here, and its visibility is controlled by AnimatePresence */}
            <motion.div
                className="signup-modal-overlay" // New class for the clickable overlay
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleOverlayClick} // Attach click handler to close modal
            >
                <motion.div
                    className="signup"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="signup__contentcontainer">
                        <div className="logolog"><img src={bGL} alt="logo" /></div>

                        <h2 className="signuptitle">SignUp</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    required // Added required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required // Added required
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
                        {/* Optional: Add a close button inside the modal */}
                        <button className="modal-close-button" onClick={onClose}>X</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Signup;