import React, { useEffect, useState } from "react";
import "../stylesheet/rent.css";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptToken } from "../utils/tokenDecryption";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import AddRentForm from './addRentForm';
import Loader from '../utils/loader';

Modal.setAppElement("#root");

function Buy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [buyProducts, setBuyProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const userId = decryptToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 12;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchBuyData = async () => {
      try {
        setLoading(true);
        const categoryQuery = selectedCategory === "All" ? "" : `category=${selectedCategory}&`;
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/rentAndBuy/get-buy?${categoryQuery}sort=${sortOption}&search=${searchTerm}&page=${page}&limit=${limit}`
        );
        
        const data = await response.json();
        console.log("Fetched Buy Data:", data);
  
        setBuyProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
  
        if (data.categories) {
          setCategories(['All', ...data.categories]);
        }
  
      } catch (error) {
        console.log("Error fetching buy data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBuyData();
  }, [selectedCategory, page, sortOption,searchTerm]);
  
  
  // const filteredBuys = buyProducts
  //   .filter(
  //     (product) =>
  //       (selectedCategory === "All" || product.category === selectedCategory) &&
  //       (product.productName &&
  //         product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  //   )
  //   .sort((a, b) => {
  //     if (sortOption === "priceAsc") return a.price - b.price;
  //     if (sortOption === "priceDesc") return b.price - a.price;
  //     return 0;
  //   });

  function truncateDescription(description = "", wordLimit = 5) {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : description;
  }

  const handleBuy = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/cart/add`,
        {
          userId,
          productId,
          isRent: false,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 201) {
        setTimeout(() => {
          toast.success("Product added to cart successfully!");
        }, 100);
        console.log("Product added to cart successfully:", response.data);
      }
    } catch (error) {
       setTimeout(()=>{
        toast.error("Error while adding product to cart.");
       });
      
      console.error("There is an error from the server side:", error);
    }
  };

  const handleContactSeller = (seller) => {
    setSelectedSeller(seller);
    setModalIsOpen(true);
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
      console.log(response);
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setBuyProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id
              ? {
                ...product,
                likedBy: Array.isArray(product.likedBy) ? (
                  product.likedBy.includes(userId)
                    ? product.likedBy.filter((uid) => uid !== userId)
                    : [...product.likedBy, userId]
                ) : [userId], // Ensure likedBy is an array
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
        <h1>Farming Equipments</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Product</button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="default">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>


      <div className="rentals-list">
        {buyProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          buyProducts.map((product) => (
            <div key={product._id} className="rental-card">
              <div className="rental-header">
                <span className="product-like-container" onClick={() => handleLike(product._id)}>
                  {product.likedBy.includes(userId) ? <AiFillHeart color="red" size={26} /> : <AiOutlineHeart size={26} />}
                  <span className="like-count"> {product.likes ? product.likes : 0}</span>
                </span>
                <img src={product.images} alt={product.productName} />

              </div>
              <h2>{product.productName}</h2>
              <p>{truncateDescription(product.description)}</p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>

              {product.postedBy === userId ? <button disabled >Your Product</button> : <button onClick={() => handleBuy(product._id)}>
                Add to cart
              </button>}
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

          <AddRentForm isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} isBuy={true} category={categories} />
          {/* </div> */}
        </div>
      )}
     
    </div>
  );
}

export default Buy;
