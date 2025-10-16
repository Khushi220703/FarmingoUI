import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios';
import { validateNumericField } from '../../utils/formValidation';
import "../../stylesheet/FertilizerModal.css"; // Import CSS file

const FertilizerModal = ({ onClose }) => {
  const crops = [
    'Barley',
    'Cotton',
    'Ground Nuts',
    'Maize',
    'Millets',
    'Oil seeds',
    'Paddy',
    'Pulses',
    'Sugarcane',
    'Tobacco',
    'Wheat'

  ];

  const soilTypes = ['Black', 'Clayey', 'Loamy', 'Red', 'Sandy']; // Example soil types

  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [moisture, setMoisture] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [potassium, setPotassium] = useState('');
  const [phosphorous, setPhosphorous] = useState('');
  const [soilType, setSoilType] = useState('');
  const [crop, setCrop] = useState('');
  const [fertilizer, setFertilizer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {

    const validations = [
      validateNumericField(temperature, "Temperature", -50, 60),
      validateNumericField(humidity, "Humidity", 0, 100),
      validateNumericField(moisture, "Moisture", 0, 100),
      validateNumericField(nitrogen, "Nitrogen", 0, 200),
      validateNumericField(potassium, "Potassium", 0, 200),
      validateNumericField(phosphorous, "Phosphorous", 0, 200),
    ];
  
    const isEmptySelect = !soilType || !crop;
    if (isEmptySelect) {
      setError("Please select both crop and soil type.");
      return;
    }
  
    const firstError = validations.find((v) => v !== null);
    if (firstError) {
      setError(firstError);
      return;
    }
  
    setLoading(true);
    setError('');
    if (!temperature || !humidity || !moisture || !nitrogen || !potassium || !phosphorous || !soilType || !crop) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/predict-fertilizer`, {
        Temperature: temperature,
        Humidity: humidity,
        Moisture: moisture,
        Nitrogen: nitrogen,
        Potassium: potassium,
        Phosphorous: phosphorous,
        'Soil Type': soilType,
        'Crop Type': crop,
      });
      console.log(response);

      setFertilizer(response.data.predicted_fertilizer);
    } catch (err) {
      setError('Error predicting fertilizer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      center
      showCloseIcon={true}
      closeIcon={<span className="custom-close-icon">✖</span>}
    >

      <div className="modalFertilizerPredict">
        <h2 className="modal-titleFertilizerPredict">Fertilizer Prediction</h2>

        <div className="modal-formFertilizerPredict">
          <label className="modal-labelFertilizerPredict">
            Crop:
            <select
              className="modal-inputFertilizerPredict"
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

          <label className="modal-labelFertilizerPredict">
            Temperature:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Humidity:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Moisture:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Nitrogen:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={nitrogen}
              onChange={(e) => setNitrogen(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Potassium:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={potassium}
              onChange={(e) => setPotassium(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Phosphorous:
            <input
              type="number"
              className="modal-inputFertilizerPredict"
              value={phosphorous}
              onChange={(e) => setPhosphorous(e.target.value)}
            />
          </label>

          <label className="modal-labelFertilizerPredict">
            Soil Type:
            <select
              className="modal-inputFertilizerPredict"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map((soilOption, index) => (
                <option key={index} value={soilOption}>
                  {soilOption}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="error-messageFertilizerPredict">{error}</p>}

          {loading ? (
            <p className="loading-messageFertilizerPredict">Loading...</p>
          ) : (
            <div>
              {fertilizer ? (
                <div className="resultFertilizerPredict">
                  <p className="result-textFertilizerPredict">Fertilizer Required: {fertilizer}</p>
                </div>
              ) : (
                <button onClick={handleSubmit} className="submit-btnFertilizerPredict">
                  Submit
                </button>
              )}
            </div>
          )}
        </div>
        <p className="model-reference">
          Price prediction is powered by a Machine Learning model referenced from 
          <a
            href="https://www.nveo.org/index.php/journal/article/view/2971"
            target="_blank"
            rel="noopener noreferrer"
          >
             this research article on Nveo.org
          </a>.
        </p>

      </div>
    </Modal>
  );
};

export default FertilizerModal;
