import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../stylesheet/sidebar.css"; 
import "@fortawesome/fontawesome-free/css/all.min.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // get current path

  const links = [
    { path: "/homePage", icon: "fas fa-home", label: "Home" },
    { path: "/crop-recommendation", icon: "fas fa-seedling", label: "Crop Recommendation" },
    { path: "/market-place", icon: "fas fa-shopping-cart", label: "Buy" },
    { path: "/rent", icon: "fas fa-home", label: "Rent" },
    { path: "/learn", icon: "fas fa-book", label: "Learn" },
    { path: "/shorts", icon: "fas fa-video", label: "Shorts" },
    { path: "/cart", icon: "fas fa-shopping-basket", label: "Cart" },
  ];

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

        {links.map((link) => (
          <div
            key={link.path}
            className={`sidebar-item ${location.pathname === link.path ? "active" : ""}`}
          >
            <Link to={link.path}>
              <i className={link.icon}></i> {link.label}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
