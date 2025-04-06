import React, { useEffect, useState } from 'react';
import "../stylesheet/setPassword.css"; 
import axios from 'axios';
import { validatePassword } from '../utils/formValidation';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const SetPassword = ({ formData, setFormData }) => {

const navigate = useNavigate();
const {email,name,token} = useParams();
const [btnLoader,setBtnLoader] = useState(false);
  useEffect(() => {
   
   
    setFormData((prevState) => ({
      ...prevState,
      name,
      email,
      token

    }));
  }, [setFormData]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoader(true);
    if (formData.password !== formData.confirmPassword ) {
        alert("Password and confirm password should be the same!");

        const validatingPassword = validatePassword();
        if(validatingPassword !== null){
            return validatingPassword;
        }
    }
    else {
      try {
       
        
        const response = await axios.post(`${process.env.REACT_APP_API_URL}api/auth/signup`, formData);

        if (response.status === 201) {
          console.log("Successfully created account!");
          navigate("/login")
          localStorage.removeItem("verifyToken");
        }

      } catch (error) {
        console.log(error);
        
        console.log("Error:", error);
      }finally{
        setBtnLoader(false);
      }
    }
  }

  return (
    <div className="setPassword">
      <div className="setPasswordBox">
        <form onSubmit={handleSubmit}>
          <h2>Set Password</h2>

          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
          />
          
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            placeholder="Enter confirm password"
            onChange={handleChange}
          />
          
          <button type="submit" disabled={btnLoader}>{btnLoader?"Setting..":"Submit"}</button>
        </form>
      </div>
    </div>
  );
}

export default SetPassword;
