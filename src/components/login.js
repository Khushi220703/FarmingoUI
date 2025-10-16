import React, { useState,useEffect } from 'react'
import "../stylesheet/login.css"
import { Link } from 'react-router-dom'
import { validateEmail, validateLoginPassword } from '../utils/formValidation'
import { faEye, faEyeSlash, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios"
import { useAuth } from "../utils/authContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

  useEffect(() => {
    const token = localStorage.getItem("farmingoToken");

    
    if (token) {
      navigate("/homePage", { replace: true });
      return;
    }

   
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
    
      navigate("/login", { replace: true });

     
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
 


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
     let passwordError = validateLoginPassword(formData.password);
     
     setError({emailError,passwordError});

     return !(emailError || passwordError);
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm(formData)) return; 

  setBtnLoader(true);

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}api/auth/login`,
      formData
    );

    if (response.status === 200) {
      localStorage.setItem("farmingoToken", response.data.token);
      login(response.data.token);
      toast.success(response.data.message || "Login successful!");
      navigate("/homePage");

      setFormData({ email: "", password: "" });
    }
  } catch (error) {
    if (error.response) {
      
      const { status, data } = error.response;

      if (status === 404) toast.error("User not found. Please signup first!");
      else if (status === 401) toast.error("Incorrect password!");
      else if (status === 400) toast.error("Please fill all required fields.");
      else if (status === 500) toast.error("Server error. Try again later.");
      else toast.error(data.message || "Something went wrong.");
    } else if (error.request) {
      
      toast.error("No response from server. Please check your connection.");
    } else {
      
      toast.error("Unexpected error occurred.");
    }
  } finally {
    setBtnLoader(false);
  }
};


  const toggleEyes = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
 };
  return (
    <div className='login'>
          <div className="loginBook">
             <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                
                {error.emailError && <span className='error-message'>{error.emailError}</span>}
                <label htmlFor="email" className='login-email-label' style={{position:"relative", left:"-160px"}}>Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' value={formData.email} onChange={handlChange}/><br />
                
                {error.passwordError && <span className='error-message'>{error.passwordError}</span>}
                <label htmlFor="password" className='login-password-label' style={{position:"relative", left:"-145px"}}>Password</label>
                <div className="password-input">
                    <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder='Enter password' 
                    value={formData.password} onChange={handlChange}   />
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
