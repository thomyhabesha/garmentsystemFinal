import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Login.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [code, setCode] = useState('');
    const [resetCodeSent, setResetCodeSent] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState('')
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordResetError, setPasswordResetError] = useState(false);
    const [newpasswordSuccess, setnewPasswordSuccess] = useState(false);
    const [timer, setTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailNotFoundError, setEmailNotFoundError] = useState(false); 

    useEffect(() => {
        if (resetCodeSent) {
            const timerId = setTimeout(() => {
                setResetCodeSent(false);
            }, 180000); // 3 minutes
            setTimer(timerId);
        } else {
            clearInterval(timer);
        }
    }, [resetCodeSent]);

    const handleEmailSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post('https://garmentsystemfinal.onrender.com/api/resetPassword', { email });
            setResetCodeSent(true);
            setEmailNotFoundError(false); 
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setEmailNotFoundError(true);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleVerificationSubmit = async () => {
        try {
            setLoading(true);
            await axios.post('https://garmentsystemfinal.onrender.com/api/verify', { email, code });
            setPasswordResetSuccess(true);
            clearInterval(timer); 
        } catch (error) {
            setVerificationError('Invalid code');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordResetSubmit = async () => {
        console.log("role: "+role)
        
        try {
            setLoading(true);
            
            if (newPassword.length < 8) {
                setPasswordLengthError(true);
                return;
            }
            const response = await axios.post('https://garmentsystemfinal.onrender.com/api/resetUserPassword', { email, newPassword, role });
           console.log("res: "+ response.data)
            setPasswordLengthError(false);
            setPasswordResetError(false);
            setnewPasswordSuccess(true);
        } catch (error) {
            console.error("Error resetting password:", error);
            setPasswordResetError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
        <div className="overlay">
          <div className="loginBox">
            <div className="loginBoxTop">
              <h2 className="title">Reset</h2>
              <p className="subtitle"><Link className='loginlink' to="/" style={{ color: "blue" }}>Back to login</Link></p>
            </div>
            <form className="form">
                
                
                <div className="signlo-formgroup" >
                   
                    {resetCodeSent ? (
                        <div>
                            {passwordResetSuccess ? (
                                <div className="reset-div">
                                   <div>
                                        <input className='input' type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        <select
                                            className="input"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            >
                                            <option value="admin">Admin</option>
                                            <option value="productionmanager">Production Manager</option>
                                            <option value="inventorymanager">Inventory Manager</option>
                                            </select>

                                        <button onClick={handlePasswordResetSubmit} disabled={loading}   className="button">SetNew Password</button>
                                        {loading &&<p>loading...</p>}
                                    </div>
                                    {passwordLengthError && <p style={{ color: "red" }}>Password length</p>}
                                    {passwordResetError && <p style={{ color: "red" }}>Error resetting password. Please try again.</p>}
                                    {newpasswordSuccess && <p style={{ color: "green" }}>Reset successful<Link style={{fontSize:"0.7rem"}} to="/" className='navto-login'> Back to login</Link></p>}
                                </div>
                            ) : (

                                <div className="reset-div" >
                                    <p style={{ color: "green" }}>verification sent</p>
                                    <div>
                                        <input className='input' type="text" placeholder="Enter code" value={code} onChange={e => setCode(e.target.value)} />
                                        <button onClick={handleVerificationSubmit} disabled={loading}  className="button">Submit</button>
                                        {loading && <p>loading...</p>}
                                    </div>
                                    {verificationError && <p style={{ color: "red" }}>{verificationError}</p>}
                                    <p style={{ color: "grey" }} ><span style={{ color: "red", marginRight:"4px", fontSize:"0.87rem" }}> 3 </span> Minute remaining</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='inp-btn'>
                            <input className='input' type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                            <button onClick={handleEmailSubmit} disabled={loading}  className="button">Send Reset Code</button>
                            {loading && <p>loading...</p>}
                            {emailNotFoundError && <p style={{ color: "red" }}>Email not found</p>} {/* Render if email not found */}
                   
                        </div>
                    )}
                </div>
            </form>
        </div>
        </div>
        </div>
    );
}

export default ForgotPassword;