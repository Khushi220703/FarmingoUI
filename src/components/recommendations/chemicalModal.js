import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios';
import "../../stylesheet/ChemicalModal.css"; // Import CSS file

const ChemicalModal = ({ onClose }) => {
  const crops = [
    'Arecanut', 'Arhar/Tur', 'Castor seed', 'Coconut', 'Cotton(lint)', 'Dry chillies',
    'Gram', 'Jute', 'Linseed', 'Maize', 'Mesta', 'Niger seed', 'Onion', 'Other Rabi pulses',
    'Potato', 'Rapeseed & Mustard', 'Rice', 'Sesamum', 'Small millets', 'Sugarcane', 
    'Sweet potato', 'Tapioca', 'Tobacco', 'Turmeric', 'Wheat', 'Bajra', 'Black pepper', 
    'Cardamom', 'Coriander', 'Garlic', 'Ginger', 'Groundnut', 'Horse-gram', 'Jowar', 'Ragi',
    'Cashewnut', 'Banana', 'Soyabean', 'Barley', 'Khesari', 'Masoor', 'Moong(Green Gram)',
    'Other Kharif pulses', 'Safflower', 'Sannhamp', 'Sunflower', 'Urad', 'Peas & beans (Pulses)', 
    'Other oilseeds', 'Other Cereals', 'Cowpea(Lobia)', 'Oilseeds total', 'Guar seed', 
    'Other Summer Pulses', 'Moth'
  ];

  const states = [
    'Assam', 'Karnataka', 'Kerala', 'Meghalaya', 'West Bengal', 'Puducherry', 'Goa', 
    'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Bihar', 'Gujarat', 'Madhya Pradesh', 
    'Maharashtra', 'Mizoram', 'Punjab', 'Uttar Pradesh', 'Haryana', 'Himachal Pradesh', 
    'Tripura', 'Nagaland', 'Chhattisgarh', 'Uttarakhand', 'Jharkhand', 'Delhi', 
    'Manipur', 'Jammu and Kashmir', 'Telangana', 'Arunachal Pradesh', 'Sikkim'
  ];

  const seasons = ['Kharif', 'Rabi', 'Zaid'];  // Example seasons (you can modify as needed)

  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('');
  const [area, setArea] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [fertilizer, setFertilizer] = useState(null);
  const [pesticide, setPesticide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleSubmit = async () => {
    if (!crop || !season || !area || !rainfall) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/predict_chemicals`, {
        Crop: crop,
        Season: season,
        Area: area,
        State:rainfall
      });

      setFertilizer(response.data.fertilizer_required);
      setPesticide(response.data.pesticide_required);
    } catch (err) {
      setError('Error predicting chemical requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} center>
      <div className="modalChemicalPredict">
        <h2 className="modal-titleChemicalPredict">Chemical Requirement Prediction</h2>

        <div className="modal-formChemicalPredict">
          <label className="modal-labelChemicalPredict">
            Crop:
            <select
              className="modal-inputChemicalPredict"
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

          <label className="modal-labelChemicalPredict">
            Season:
            <select
              className="modal-inputChemicalPredict"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="">Select Season</option>
              {seasons.map((seasonOption, index) => (
                <option key={index} value={seasonOption}>
                  {seasonOption}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-labelChemicalPredict">
            Area (in acres):
            <input
              type="number"
              className="modal-inputChemicalPredict"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </label>

          <label className="modal-labelChemicalPredict">
            State:
            <select
              className="modal-inputChemicalPredict"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((stateOption, index) => (
                <option key={index} value={stateOption}>
                  {stateOption}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="error-messageChemicalPredict">{error}</p>}

          {loading ? (
            <p className="loading-messageChemicalPredict">Loading...</p>
          ) : (
            <div>
              {fertilizer && pesticide ? (
                <div className="resultChemicalPredict">
                  <p className="result-textChemicalPredict">Fertilizer Required: {fertilizer} kg</p>
                  <p className="result-textChemicalPredict">Pesticide Required: {pesticide} liters</p>
                </div>
              ) : (
                <button onClick={handleSubmit} className="submit-btnChemicalPredict">
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

export default ChemicalModal;
