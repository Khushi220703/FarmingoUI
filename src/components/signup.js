import React, { useState } from 'react';
import "../stylesheet/signup.css";
import { Link } from 'react-router-dom';
import { validateEmail, validateName } from '../utils/formValidation';
import axios from "axios";
import { useAuth } from "../utils/authContext";

const Signup = ({ formData, setFormData }) => {
    
    const [error, setError] = useState({
        nameError: "",
        emailError: "",
    });
    const [btnLoader,setBtnLoader] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (value) {
            setError({ ...error, [`${name}Error`]: '' });
        }
    };
    const { login } = useAuth();
    const validateForm = (formData) => {
        let nameError = validateName(formData.name);
        let emailError = validateEmail(formData.email);

        setError({ nameError, emailError });

        return !(nameError || emailError );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoader(true);
        if (validateForm(formData)) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}api/email/get-verified`, formData);
                
                if (response.status === 200) {
                    localStorage.setItem("email", formData.email);
                    localStorage.setItem("name", formData.name);
                    localStorage.setItem("verifyToken", response.token);
                    login(response.token);
                    console.log("Data added successfully! Please check your email to verify.");
                }
            } catch (error) {
                console.log(`There was an error from the server side: ${error}`);
            }
            finally{
                setBtnLoader(false);
            }
        }
    };

    return (
        <div className='signup'>
            <div className="signupForm">
                <form onSubmit={handleSubmit}>
                    <h2>Signup</h2>

                    {error.nameError && <span className='error-message'>{error.nameError}</span>}
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name='name'
                        id='name'
                        placeholder='Enter your name'
                        value={formData.name}
                        onChange={handleChange}
                    /><br />

                    {error.emailError && <span className='error-message'>{error.emailError}</span>}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleChange}
                    /><br />

                    <button type="submit" disabled={btnLoader}>{btnLoader?"Creating..":"Signup"}</button>
                    <p style={{ color: "green" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ textDecoration: "none", color: "#ffffff" }}>
                            <span> Login</span>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
