import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../stylesheet/addProductForm.css";
function AddProductForm({ isOpen, setIsModalOpen }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const categoriesPerPage = 10; // Number of categories per page

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/categories`, {
          params: {
            skip: (currentPage - 1) * categoriesPerPage,
            limit: categoriesPerPage
          }
        });
        setCategories(response.data.categories);
        setTotalCategories(response.data.total); // Assuming the response includes total number of categories
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleCustomCategoryChange = (event) => {
    setCustomCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productName,
      category: category === 'Other' ? customCategory : category,
      price,
      description,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/products/add`, productData);
      console.log("Product added:", response.data);
      setIsModalOpen(false); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="modal-content">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {category === 'Other' && (
            <input
              type="text"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="Enter custom category"
            />
          )}
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Product</button>
      </form>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * categoriesPerPage >= totalCategories}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AddProductForm;
