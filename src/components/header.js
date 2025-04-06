import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../stylesheet/header.css";
import farmingoLogo from "../assets/images/farmingo.png";
import { GiHamburgerMenu } from "react-icons/gi"; // Importing hamburger icon
import { FaUserCircle } from "react-icons/fa"; // Importing profile icon

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("farmingoToken"));

  const handleLogout = () => {
    localStorage.removeItem("farmingoToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/dashboard"); // Navigate to the dashboard when clicked
  };

  return (
    <div className="header">
      {/* Hamburger Menu for Small Screens */}
      <div className="hamburger" onClick={toggleSidebar}>
        <GiHamburgerMenu />
      </div>

      <div className="logo">
        <img src={farmingoLogo} alt="Farmingo Logo" width={110} />
        <span className="logo-text">Farmingo</span>
      </div>

      <div className="authButton">
        {isAuthenticated ? (
          <>
            {/* Profile Icon */}
            <FaUserCircle className="profile-icon" onClick={handleProfileClick} />
            <button onClick={handleLogout} style={{width:"60%"}}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button >Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
