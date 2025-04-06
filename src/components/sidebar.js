import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheet/sidebar.css"; 
import "@fortawesome/fontawesome-free/css/all.min.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bars"></i>
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="close-icon" onClick={() => setIsOpen(false)}>
          <i className="fas fa-times"></i>
        </div>

        <div className="sidebar-item">
          <Link to="/homePage">
            <i className="fas fa-home"></i> Home
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/crop-recommendation">
            <i className="fas fa-seedling"></i> Crop Recommendation
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/market-place">
            <i className="fas fa-shopping-cart"></i> Buy
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/rent">
            <i className="fas fa-home"></i> Rent
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/learn">
            <i className="fas fa-book"></i> Learn
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/shorts">
            <i className="fas fa-video"></i> Shorts
          </Link>
        </div>
        <div className="sidebar-item">
          <Link to="/cart">
            <i className="fas fa-shopping-basket"></i> Cart
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
