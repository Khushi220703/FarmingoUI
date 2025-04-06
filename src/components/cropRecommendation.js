import React, { useState } from "react";
import "../stylesheet/cropRecommendation.css";
import { validateName, validatePH } from "../utils/formValidation";
import { motion } from "framer-motion";
const CropRecommendationForm = () => {
  const [recommendation, setRecommendation] = useState(1);
  const [formData, setFormData] = useState({
    soilType: "",
    pH: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    nitrogen: "",
    phosphorus: "",
    potassium: ""
  });

  const [error, setError] = useState({
    soilTypeError: "",
    pHError: "",
    temperatureError: "",
    humidityError: "",
    rainfallError: "",
    nitrogenError: "",
    phosphorusError: "",
    potassiumError: ""
  })
  
  const [recommendedCrop, setRecommendedCrop] = useState("");
  const [description, setDescription] = useState("");
  const [productRecommendation, setProductRecommendation] = useState([]);
  const [btnLoader,setBtnLoader] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validateForm = (formData) =>{
    let temperatureError = '', humidityError = '', rainfallError = '', nitrogenError = '', phosphorusError = '', potassiumError = '';
    let soilTypeError = validateName(formData.soilType);
    let pHError = validatePH(formData.pH);
   
    if(!formData.temperature){
      temperatureError = "Enter temperature.";
    }
    if(!formData.humidity){
      humidityError = "Enter humidity.";
    }
    if(!formData.rainfall){
      rainfallError = "Enter rainfall.";
    }
    if(!formData.nitrogen){
      nitrogenError = "Enter nitrogen.";
    }
    if(!formData.phosphorus){
      phosphorusError = "Enter phosphorus.";
    }
    if(!formData.potassium){
        potassiumError = "Enter potassium."
    }
    setError({soilTypeError,pHError,temperatureError,humidityError,rainfallError,nitrogenError,phosphorusError,potassiumError});
   console.log(error);
   
    return !(soilTypeError || pHError || temperatureError || humidityError || rainfallError || nitrogenError || phosphorusError || potassiumError);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { pH, temperature, humidity, rainfall, nitrogen, potassium,phosphorus } = formData;
    const requestData = {
      N: parseFloat(formData.nitrogen),
      P: parseFloat(formData.phosphorus),
      K: parseFloat(formData.potassium),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.pH),  // Ensure lowercase "ph"
      rainfall: parseFloat(formData.rainfall),
    };
    console.log(formData);
    
    if(!validateForm(formData))
      return;
   setBtnLoader(true);
   try {
    const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    console.log(data);
    
    if (data.recommended_crop) {
     
      const cropResponse = await fetch("/json/cropNameImage.json");
      const cropData = await cropResponse.json();

      const cropDetails = cropData.data.find(crop => crop.name.toLowerCase() === data.recommended_crop.toLowerCase());

      if (cropDetails) {
          setRecommendedCrop(cropDetails);
          setRecommendation(0);
      } else {
          console.log("Crop details not found in JSON");
      }
  }
    setRecommendation(0);
   } catch (error) {
    console.log(error);
    
   }finally{
    setBtnLoader(false);
   }
    
    
  };


  return (
    <div className="container-crop-form">
      <div className="crop-recommendation-container">
        <h2>Crop Recommendation System</h2>
        {recommendation ? <form className="recommendation-form" onSubmit={handleSubmit}>
  <div className="crop-form-row">
    <div className="crop-form-group">
      <label>Soil Type</label>
      <input
        type="text"
        className="input-soilType"
        name="soilType"
        value={formData.soilType}
        onChange={handleChange}
        placeholder="e.g. Loamy"
      />
    </div>
    <div className="crop-form-group">
      <label>pH Level</label>
      <input
        type="number"
        className="input-ph"
        name="pH"
        value={formData.pH}
        onChange={handleChange}
        placeholder="e.g. 6.5"
        min="0"
        max="14"
        step="0.1"
        style={{marginTop:"5px"}}
      />
    </div>
  </div>

  <div className="crop-form-row">
    <div className="crop-form-group">
      <label>Temperature (°C)</label>
      <input
        type="number"
        className="input-temperature"
        name="temperature"
        value={formData.temperature}
        onChange={handleChange}
        placeholder="e.g. 25"
      />
    </div>
    <div className="crop-form-group">
      <label>Humidity (%)</label>
      <input
        type="number"
        className="input-humidity"
        name="humidity"
        value={formData.humidity}
        onChange={handleChange}
        placeholder="e.g. 60"
      />
    </div>
  </div>

  <div className="crop-form-row">
    <div className="crop-form-group">
      <label>Rainfall (mm)</label>
      <input
        type="number"
        className="input-rainfall"
        name="rainfall"
        value={formData.rainfall}
        onChange={handleChange}
        placeholder="e.g. 300"
      />
    </div>
    <div className="crop-form-group">
      <label>Nitrogen Content (N)</label>
      <input
        type="number"
        className="input-nitrogen"
        name="nitrogen"
        value={formData.nitrogen}
        onChange={handleChange}
        placeholder="e.g. 50"
      />
    </div>
  </div>

  <div className="crop-form-row">
    <div className="crop-form-group">
      <label>Phosphorus Content (P)</label>
      <input
        type="number"
        className="input-phosphorus"
        name="phosphorus"
        value={formData.phosphorus}
        onChange={handleChange}
        placeholder="e.g. 30"
      />
    </div>
    <div className="crop-form-group">
      <label>Potassium Content (K)</label>
      <input
        type="number"
        className="input-potassium"
        name="potassium"
        value={formData.potassium}
        onChange={handleChange}
        placeholder="e.g. 40"
      />
    </div>
  </div>

  <button type="submit" className="submit-button" disabled={btnLoader}>{btnLoader? "Generating Recommendation...":"Get Recommendation"}</button>
</form>
:

          <div className="recommended">

          {recommendedCrop && (
  <motion.div 
    className="recommended-crop-container"
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      className="recommended-crop-card"
      initial={{ scale: 0.8, rotateY: 90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2>Recommended Crop</h2>
      
      {/* Crop Image */}
      <motion.img 
        src={recommendedCrop.image} 
        alt={recommendedCrop} 
        className="crop-image"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Crop Name */}
      <motion.p
        className="crop-name"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
      >
        {recommendedCrop.name}
      </motion.p>

      {/* Description */}
      <motion.p 
        className="crop-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {description || "This crop is best suited for your soil and climate conditions."}
      </motion.p>

    </motion.div>

    
  </motion.div>
)}

                <button onClick={() => setRecommendation(1)}>Go back</button>
          </div>}
      </div>
    </div>
  );
};

export default CropRecommendationForm;
