import React, { useEffect, useState } from 'react';
import '../stylesheet/rent.css';
import axios from 'axios';
import {decryptToken} from "../utils/tokenDecryption";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import AddRentForm from './addRentForm';
import Loader from '../utils/loader'; 
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
function Rentals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rentalDays, setRentalDays] = useState(1);
  const [rentalProducts, setRentalProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const userId = decryptToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 12;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchRentData = async () => {
      try {
        setLoading(true);
        const categoryQuery = selectedCategory === "All" ? "" : `category=${selectedCategory}&`;
        const sortQuery = sortOption ? `sort=${sortOption}&` : "";
        const searchQuery = searchTerm ? `search=${searchTerm}&` : "";
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/rentAndBuy/get-rent?${categoryQuery}${sortQuery}${searchQuery}page=${page}&limit=${limit}`
        );
  
        const data = await response.json();
        console.log("Fetched Data:", data);
  
        setRentalProducts(data.products || []);
        if (data.categories) {
          setCategories(['All', ...data.categories]);
        }
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.log('Error fetching rental data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRentData();
  }, [selectedCategory, sortOption, searchTerm, page]);
  
  
  

  useEffect(() => {
    console.log("Updated Rental Products:", rentalProducts);
  }, [rentalProducts]);

  // const filteredRentals = rentalProducts
  //   .filter((product) => 
  //     (selectedCategory === 'All' || product.category === selectedCategory) &&
  //     (product.productName && product.productName.toLowerCase().includes((searchTerm || "").toLowerCase()))
  //   )
  //   .sort((a, b) => {
  //     if (sortOption === 'priceAsc') return a.price - b.price;
  //     if (sortOption === 'priceDesc') return b.price - a.price;
  //     return 0;
  //   });

  // useEffect(() => {
  //   console.log("Filtered Rentals:", filteredRentals);
  // }, [filteredRentals]);

  function truncateDescription(description = "", wordLimit = 7) {
    const words = description?.toString().split(" ") || [];
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return description;
  }

  const rentNow = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/cart/add`,
        {
          userId,
          productId,
          isRent:true,
          quantity:1,
          rentalDuration:rentalDays
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if(response.status === 201){
        toast.success("Prodcut added to cart successfully.");
        console.log("Product added to cart successfully:", response.data);
      }
     
    } catch (error) {
      toast.error("Error while adding product to cart.");
      console.error("There is an error from the server side:", error);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/rentAndBuy/likeProduct/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      console.log(data);
      
      if (response.ok) {
        setRentalProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id
              ? {
                  ...product,
                  likedBy: Array.isArray(product.likedBy) ? (
                    product.likedBy.includes(userId)
                      ? product.likedBy.filter((uid) => uid !== userId)
                      : [...product.likedBy, userId]
                  ) : [userId], 
                  likes: Array.isArray(product.likedBy)
                    ? product.likedBy.includes(userId)
                      ? product.likes - 1
                      : product.likes + 1
                    : 1,
                }
              : product
          )
        );
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.log("Error liking the product", error);
    }
  };
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (loading) return <Loader />;
  
  return (
    <div className="rentals">
      <div className="header-container">
        <h1>Farming Equipment Rentals</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Product</button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search rentals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
          <option value="default">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-select">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={rentalDays}
          onChange={(e) => setRentalDays(e.target.value)}
          className="rental-days-input"
          placeholder="Rental Days"
        />
      </div>

      
        <div className="rentals-list">
          {rentalProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            rentalProducts.map((product) => (
              <div key={product.id} className="rental-card">
                <div className="rental-header">
                                  <span className="product-like-container" onClick={() => handleLike(product._id)}>
                                    {product.likedBy.includes(userId) ? <AiFillHeart color="red" size={26} /> : <AiOutlineHeart size={26} />}
                                    <span className="like-count"> {product.likes ? product.likes : 0}</span>
                                  </span>
                                  <img src={product.images} alt={product.productName} />
                                  
                                </div>
                
                <h2>{product.productName}</h2>
                <p>{truncateDescription(product.description)}</p>
                <p><strong>Price per Day:</strong> ${product.rentalPrice}</p>
      
                <p><strong>Total Cost:</strong> ${(product.rentalPrice * rentalDays).toFixed(2)}</p>
                {product.postedBy === userId ?<button disabled>Your Product</button>:<button onClick={() => rentNow(product._id)}>Add to cart</button>}
               
              </div>
            ))
          )}
        </div>
     
        <div className="pagination-container">
        <button onClick={handlePrev} disabled={page === 1}>
          ⬅ Prev
        </button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next ➡
        </button>
      </div>
      {isModalOpen && (
  <div className="modal">
    {/* <div className="modal-content"> */}
      
      <AddRentForm isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} category={categories}/>
    {/* </div> */}
  </div>
)}  <ToastContainer />
    </div>
  );
}

export default Rentals;