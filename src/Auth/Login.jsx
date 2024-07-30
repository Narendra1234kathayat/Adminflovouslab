import React, { useState, useEffect } from 'react';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

import admin_logo from '../assets/img/admin_logo.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        const passwordInput = document.querySelector("#password");
        const eye = document.querySelector("#eye");

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        if (eye && passwordInput) {
            eye.addEventListener("click", togglePasswordVisibility);
        }

        return () => {
            if (eye && passwordInput) {
                eye.removeEventListener("click", togglePasswordVisibility);
            }
        };
    }, [showPassword]);

    Axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Kindly enter valid email and password to proceed.");
            return;
        }

        // If Remember me is checked, store email in localStorage
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        try {
            const response = await Axios.post("http://localhost:4000/api/admin_auth/admin-login", {
                email,
                password
            });

            if (response.data.status) {
                navigate('/');
            } else {
                alert("Invalid username or password.")
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        const handleVerify = async () => {
            try {
                const res = await Axios.get('http://localhost:4000/api/admin_auth/verify');
                if (res.data.status) {
                    navigate("/");
                } else {
                }
            } catch (error) {
                // console.log("Error:", error);
            }
        };
        handleVerify();
    }, []);

    return (
        <>
            <section id='bg'>
                <section id='login-form'>
                    <div className="container">
                        <div className="d-flex justify-content-center">
                            <div className="user_card shadow-lg">
                                <div className="d-flex justify-content-center">
                                    <div className="brand_logo_container shadow">
                                        <img src={admin_logo} className="brand_logo img-fluid" alt="Logo" />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form_container">
                                    <form onSubmit={handleSubmit}>
                                        <div className="input-group mb-3">
                                            <div className="input-group-append">
                                                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} style={{ color: 'black', fontSize: '20px' }} /></span>
                                            </div>
                                            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control input_user" placeholder="Email" autoComplete='username' />
                                        </div>
                                        <div className="input-group mb-3 position-relative">
                                            <div className="input-group-append">
                                                <span className="input-group-text"><FontAwesomeIcon icon={faKey} style={{ color: 'black', fontSize: '20px' }} /></span>
                                            </div>
                                            <input type={showPassword ? 'text' : 'password'} id='password' name="pass" className="form-control input_user" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEyeSlash : faEye}
                                                id='eye'
                                                className='position-absolute'
                                                style={{ color: 'black', right: '13px', top: '15px', cursor: 'pointer', height: '20px', zIndex: '99' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customControlInline" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />&nbsp;&nbsp;
                                                <label className="custom-control-label text-white" htmlFor="customControlInline">Remember me</label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center mt-4 login_container">
                                            <button type="submit" name="button" className="btn login_btn">Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

        </>
    )
}

export default Login;