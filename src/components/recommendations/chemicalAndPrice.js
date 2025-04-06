import React, { useState } from 'react';
import ChemicalModal from './chemicalModal';
import PriceModal from './priceModal';
import '../../stylesheet/tools.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
const CropTools = () => {
  const [isChemicalOpen, setIsChemicalOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="crop-tools-container">
      <h2 className="crop-tools-title">🌾 Farmingo Tools</h2>
     
      <div className="button-container">
      <button 
          onClick={() => navigate("/crop-recommendation")}
          className="button"
        >
          Crop Recommendation
        </button>
        <button 
          onClick={() => setIsChemicalOpen(true)} 
          className="button button-left"
        >
          Chemical Requirement
        </button>
        <button 
          onClick={() => setIsPriceOpen(true)} 
          className="button"
        >
          Price Prediction
        </button>
      </div>

      {/* Modals */}
      {isChemicalOpen && (
        <ChemicalModal onClose={() => setIsChemicalOpen(false)} />
      )}

      {isPriceOpen && (
        <PriceModal onClose={() => setIsPriceOpen(false)} />
      )}
    </div>
  );
};

export default CropTools;
