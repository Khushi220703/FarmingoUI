import React, { useState } from 'react'
import "../stylesheet/login.css"
import { Link } from 'react-router-dom'
import { validateEmail, validatePassword } from '../utils/formValidation'
import { faEye, faEyeSlash, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios"
import { useAuth } from "../utils/authContext";

import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email:"",
    password:""
  });
  const [btnLoader,setBtnLoader] = useState(false);
  const { login } = useAuth();
  
  const [error, setError] = useState({
    emailError:"",
    passwordError:""
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handlChange = (e) =>{
      const {name, value} = e.target;

      setFormData({
        ...formData,
        [name]:value,
      })

      if (value) {
        setError({ ...error, [`${name}Error`]: '' });
       
      }

  }
   
  const validateForm = (formData) =>{

     let emailError = validateEmail(formData.email);   
     let passwordError = validatePassword(formData.password);
     
     setError({emailError,passwordError});

     return !(emailError || passwordError);
  }

  const handleSubmit = async (e) =>{
      e.preventDefault();
      
      
     if(validateForm(formData)){
     setBtnLoader(true);
      try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}api/auth/login`, formData);

          if(response.status === 201)
          {
            localStorage.setItem("farmingoToken",response.data.token);
            console.log(response);
            login(response.data.token);
            navigate("/homePage");
            setFormData({
              email: "",
              password: ""
          });
          
            
          }
          else{
            console.log(response);
            
          }
          
      } catch (error) {
        console.log(`There is an error from server side ${error}`);
        
      }
      finally{
        setBtnLoader(false);
      }
     }
      
      
  }

  const toggleEyes = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
 };
  return (
    <div className='login'>
          <div className="loginBook">
             <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                
                {error.emailError && <span className='error-message'>{error.emailError}</span>}
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' value={formData.email} onChange={handlChange}/><br />
                
                {error.passwordError && <span className='error-message'>{error.passwordError}</span>}
                <label htmlFor="password">Password</label>
                <div className="password-input">
                    <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder='Create password' 
                    value={formData.password} onChange={handlChange} />
                    <span className="icon" onClick={toggleEyes}>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </span>
                </div>

                <button type="submit" disabled={btnLoader}>{btnLoader?"Logining":"Login"}</button>
                <p style={{color:"green"}}>Don't have an account?<Link to="/signup" style={{textDecoration: "none", color: "#ffffff"}}><span> Signup</span></Link></p>
            </form>
           
          </div>

    </div>
  )
}

export default Login
