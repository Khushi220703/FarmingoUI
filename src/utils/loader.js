import React from "react";
import "../stylesheet/loader.css"; // Add styles for the loader

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
