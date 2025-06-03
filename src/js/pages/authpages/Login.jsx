import React from "react";
import { useState } from 'react';
import bGL from '../../assets/LOGGO3.png'; // Assuming this is your logo
import { Link , useNavigate} from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { auth } from "../../Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import './signup.scss'; // Assuming you're sharing the same SCSS file
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Login = ({ onClose }) => { // Accept onClose prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { logIn } = UserAuth(); // Destructure logIn from UserAuth

    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (!email) {
            toast.error('Please enter your email to reset password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error(`Error sending reset email: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await logIn(email, password);
            navigate('/account');
            onClose(); // Close the modal after successful login
        } catch (error) {
            console.error("Login error:", error); // Log the actual error for debugging
            setError(' Invalid credentials'); // Display error message
            toast.error('Login failed: Invalid credentials or account issues.');
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
            <motion.div
                className="signup-modal-overlay" // Reusing the same overlay class
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleOverlayClick}
            >
                <motion.div
                    className="signup" // Reusing the same signup box styling
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="signup__contentcontainer">
                        <div className="logolog"><img src={bGL} alt="logo" /></div>

                        <h2 className="signuptitle">Welcome Back</h2>
                        {error && <p className="error-message">{error}</p>} {/* Display error message */}
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
                                    placeholder="Fried Chicken 12"
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
                                <Button type="submit">Log In</Button>
                            </div>
                        </form>
                        <div className="fogetpassword">
                            Forgot Password? <Button onClick={handleResetPassword}>Reset Password</Button>
                        </div>
                        {/* Optional: Add a close button inside the modal */}
                        <button className="modal-close-button" onClick={onClose}>X</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Login;