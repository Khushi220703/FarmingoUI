import React, { useState, useEffect } from "react";
import "../stylesheet/addRentForm.css";
import axios from "axios";
import { decryptToken } from "../utils/tokenDecryption";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddRentForm = ({ isOpen, setIsModalOpen, isBuy, category }) => {
  const userId = decryptToken();
  const [formData, setFormData] = useState({
    productName: "",
    userId:userId,
    category: "",
    customCategory: "",
    description: "",
    price: "",
    location: "",
    image: null,
    metaData: {
      productType: "",
      brand: "",
      quantity: "",
      unit: "kg",
      growingSeason: "",
      organicCertified: false,
      equipmentType: "",
      powerRequirement: "",
      warranty: "",
      livestockType: "",
      breed: "",
      age: "",
      milkYield: "",
      vaccinated: false,
      soilType: "",
      climate: "",
      agricultureType: [],
  }});
  const [error, setError] = useState({});
  const [categories, setCategories] = useState(category || []);
  const [step, setStep] = useState(1);
  const [btnLoader,setBtnLoader] = useState(false);
  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in formData) {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    } else {
      setFormData({
        ...formData,
        metaData: { ...formData.metaData, [name]: type === "checkbox" ? checked : value },
      });
    }

    setError({ ...error, [`${name}Error`]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setError({ ...error, imageError: "" });
  };

  const validateStep = () => {
    let errors = {};
    if (step === 1) {
      errors = {
        productNameError: formData.productName ? "" : "Enter product name.",
        productTypeError: formData.metaData.productType ? "" : "Select product type.",
      };
    } else if (step === 2) {
      errors = {
        categoryError: formData.category ? "" : "Please select a category.",
        descriptionError: formData.description ? "" : "Enter a description.",
      };
    } else if (step === 4) {
      errors = {
        priceError: formData.price ? "" : "Enter the price.",
        locationError: formData.location ? "" : "Enter location.",
        imageError: formData.image ? "" : "Image is required.",
      };
    }
    setError(errors);
    return Object.values(errors).every((err) => !err);
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setBtnLoader(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    console.log(formDataToSend);
    
    try {
       
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/rentAndBuy/addProduct`, formDataToSend);
      if(response.status === 201)
        console.log("Product is added succesfully for sale", response);
        toast.success("Prodcut added.");
    } catch (error) {
      console.error("There is an error from server side:",error);
      toast.success("Error while adding product.");
    }
    finally{
      setBtnLoader(false);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="rent-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Add a Product</h2>
        <form onSubmit={handleSubmit} className="rent-form">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                />
                {error.productNameError && (
                  <span className="error-message">{error.productNameError}</span>
                )}
              </div>

              <div className="form-group">
                <label>Product Type:</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Insecticide">Insecticide</option>
                </select>
                {error.productTypeError && (
                  <span className="error-message">{error.productTypeError}</span>
                )}
              </div>
            </>
          )}

          {/* Step 2: Category and Description */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>
                {formData.category === "custom" && (
                  <div className="form-group">
                    <label>Custom Category:</label>
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {error.categoryError && (
                  <span className="error-message">{error.categoryError}</span>
                )}
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {error.descriptionError && (
                  <span className="error-message">{error.descriptionError}</span>
                )}
              </div>
            </>
          )}

          {/* Step 3: Metadata */}
          {step === 3 && (
            <>
              {formData.metaData.productType === "Pesticide" && (
                <>
                  <div className="form-group">
                    <label>Brand Name:</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.metaData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.metaData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {formData.metaData.productType === "Insecticide" && (
                <>
                  <div className="form-group">
                    <label>Brand Name:</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.metaData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.metaData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit:</label>
                    <select name="unit" value={formData.metaData.unit} onChange={handleInputChange}>
                      <option value="kg">Kg</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </>
              )}
              {formData.metaData.productType === "Fertilizers" && (
                <>
                  <div className="form-group">
                    <label>Brand Name:</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.metaData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.metaData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit:</label>
                    <select name="unit" value={formData.metaData.unit} onChange={handleInputChange}>
                      <option value="kg">Kg</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </>
              )}

              {formData.metaData.productType === "Seeds" && (
                <>
                  <div className="form-group">
                    <label>Growing Season:</label>
                    <select
                      name="growingSeason"
                      value={formData.metaData.growingSeason}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Growing Season</option>
                      <option value="Winter">Winter</option>
                      <option value="Summer">Summer</option>
                      <option value="Monsoon">Monsoon</option>
                      <option value="Spring">Spring</option>
                      <option value="Autumn">Autumn</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Organic Certified:</label>
                    <input
                      type="checkbox"
                      name="organicCertified"
                      checked={formData.metaData.organicCertified}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Soil Type:</label>
                    <input
                      type="text"
                      name="soilType"
                      value={formData.metaData.soilType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Climate:</label>
                    <select
                      name="climate"
                      value={formData.metaData.climate}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Climate</option>
                      <option value="Tropical">Tropical</option>
                      <option value="Arid">Arid</option>
                      <option value="Temperate">Temperate</option>
                      <option value="Cold">Cold</option>
                      <option value="Mediterranean">Mediterranean</option>
                    </select>
                  </div>

                </>
              )}



              {formData.metaData.productType === "Equipment" && (
                <>
                  <div className="form-group">
                    <label>Equipment Type:</label>
                    <input
                      type="text"
                      name="equipmentType"
                      value={formData.metaData.equipmentType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Power Requirement (HP/kW):</label>
                    <input
                      type="number"
                      name="powerRequirement"
                      value={formData.metaData.powerRequirement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Warranty (months):</label>
                    <input
                      type="number"
                      name="warranty"
                      value={formData.metaData.warranty}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {formData.metaData.productType === "Livestock" && (
                <>
                  <div className="form-group">
                    <label>Livestock Type:</label>
                    <input
                      type="text"
                      name="livestockType"
                      value={formData.metaData.livestockType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Breed:</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.metaData.breed}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Age (months/years):</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.metaData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Vaccinated:</label>
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={formData.metaData.vaccinated}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </>
          )}


          {/* Step 4: Price and Image Upload */}
          {step === 4 && (
            <>
              <div className="form-group">
                <label>{isBuy ? "Price (INR)" : "Price Per Day (INR)"}</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {error.priceError && (
                  <span className="error-message">{error.priceError}</span>
                )}
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {error.locationError && (
                  <span className="error-message">{error.locationError}</span>
                )}
              </div>

              <div className="form-group">
                <label>Product Image:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {error.imageError && (
                  <span className="error-message">{error.imageError}</span>
                )}
              </div>
            </>
          )}

          <div className="button-group">
            {step > 1 && (
              <button type="button" className="rent-prev-btn" onClick={handlePrev}>
                Previous
              </button>
            )}
            {step < 4 && (
              <button type="button" className="rent-next-btn" onClick={handleNext}>
                Next
              </button>
            )}
            {step === 4 && (
              <button type="submit" className="btn"  style={{marginTop:"20px"}} disabled={btnLoader}>
                {btnLoader? "Adding..":"Add Product"}
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddRentForm;
