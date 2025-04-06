import React, { useState, useEffect } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; 
import "../../stylesheet/pricePredict.css"; 
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js'; 


ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

const PricePredictionModal = ({ onClose }) => {
  const crops = [
    'Maize', 'Wheat', 'Rice', 'Sugar', 'Cotton', 'Coffee', 'Tea',
    'Sugarcane', 'Sunflower', 'Jowar(Sorghum)', 'Millets',
    'Barley (Jau)', 'Ginger(Dry)', 'Turmeric', 'Groundnut', 'Coconut'
  ];

 
  const currentYear = new Date().getFullYear();
  
  const [crop, setCrop] = useState('');
  const [pricePrediction, setPricePrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const fetchPricePrediction = async () => {
    if (!crop) {
      setError('Please select a crop!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const response = await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/predict_price`, {
        crop: crop,
        year: currentYear
      });
      console.log(response);

      const { predicted_prices } = response.data;
      console.log('Predicted Prices:', predicted_prices); // Check data structure

      // Ensure predicted_prices is an object with months as keys (1 to 12)
      if (predicted_prices && typeof predicted_prices === 'object') {
        // Convert object to array
        const priceArray = Object.values(predicted_prices);
        setPricePrediction(priceArray);
      } else {
        setError('Invalid data received for price prediction.');
      }
    } catch (err) {
      setError('Error predicting prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when crop is selected or changed
  useEffect(() => {
    if (crop) {
      fetchPricePrediction();
    }
  }, [crop]); // Re-fetch when crop changes

  const data = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`), // Months 1 to 12
    datasets: [
      {
        label: 'Predicted Price (in INR)',
        data: pricePrediction, // Now an array with 12 values
        borderColor: '#FF5733',
        fill: false,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    height: 400, 
    width: 300, 
  };

  return (
    <Modal open={true} onClose={onClose} center>
      <div className="modalPricePrediction">
        <h2 className="modal-titlePricePrediction">Price Prediction</h2>

        <div className="modal-formPricePrediction">
          <label className="modal-labelPricePrediction">
            Crop:
            <select
              className="modal-inputPricePrediction"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">Select Crop</option>
              {crops.map((cropOption, index) => (
                <option key={index} value={cropOption}>
                  {cropOption}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="error-messagePricePrediction">{error}</p>}

          {loading ? (
            <p className="loading-messagePricePrediction">Loading...</p>
          ) : (
            <div>
              {pricePrediction.length > 0 ? (
                <div className="chart-container" style={{ width: '500px', height:"400px" ,margin: '0 auto' }}>
                  <Line data={data} options={options} />
                </div>
              ) : (
                <button onClick={fetchPricePrediction} className="submit-btnPricePrediction">
                  Submit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PricePredictionModal;
