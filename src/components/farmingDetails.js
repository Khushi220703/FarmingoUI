import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaLeaf, FaCheckCircle } from 'react-icons/fa';
import '../stylesheet/farmingDetails.css';
import { decryptToken } from "../utils/tokenDecryption";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Navigate } from 'react-router-dom';
import Loader from '../utils/loader';
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const FarmingDetails = () => {
    const { id } = useParams();
    const [farming, setFarming] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [recommendedLessons, setRecommendedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = decryptToken();
    const navigate = useNavigate(); 
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/homePage/getAgricultureTypeExplanationData/${id}`);
                setFarming(response.data[0]);
                console.log(response.data);
            } catch (error) {
                console.error("There is an error from the server side", error);
            }finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    useEffect(() => {
        const recomendingProducts = async () => {
          
            try {

                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/rentAndBuy/recommendedProductsForHome`, {
                    params: { agricultureType: farming.name }
                });
                setRecommendedProducts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("There is an error from server side", error);

            }
        }
        recomendingProducts();
    }, [id, farming])

    useEffect(() => {
        const recomendingLessons = async () => {
          
            try {

                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/lesson/getRecommendingLesson`, {
                    params: { title: farming.name }
                });
                setRecommendedLessons(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("There is an error from server side", error);

            }
        }
        recomendingLessons();
    }, [id, farming])

    if (!farming) return <p className="loading-text">Loading...</p>;
    function truncateDescription(description = "", wordLimit = 7) {
        const words = description.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + " ..."
            : description;
    }

    // add to cart..
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
            if(response.status === 201){
                    toast.success("Prodcut added to cart successfully.");
                    console.log("Product added to cart successfully:", response.data);
            }

          
        } catch (error) {
            toast.error("Error while adding product to cart.");
            console.error("There is an error from the server side:", error);
        }
    };

    // Custom arrow components
    const CustomLeftArrow = ({ onClick }) => (
        <button className="custom-arrow left-arrow" onClick={onClick}>
            <FaArrowLeft />
        </button>
    );

    const CustomRightArrow = ({ onClick }) => (
        <button className="custom-arrow right-arrow" onClick={onClick}>
            <FaArrowRight />
        </button>
    );

    const handleNavigation = (tutorial) => {

        const id = tutorial._id;
        
        if (tutorial.type === "Blog") {
          navigate("/learn-blog", { state: { id } });
        } else if (tutorial.type === "Video") {
          navigate("/videoDetail", { state: {id} });
        }
      };

      if (loading) return <Loader />;
    return (
        <div className="farmingDetails-container">
            <h1 className="title">{farming.name}</h1>

            {/* Image Carousel */}
            <Carousel
                responsive={{
                    superLarge: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
                    desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
                    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
                    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
                }}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                arrows={false}
                showDots={false}
                className="carousel-container"
            >
                {farming.images.map((img, index) => (
                    <div key={index} className="carousel-item">
                        <img src={img} alt={`Slide ${index}`} className="carousel-image" />
                    </div>
                ))}
            </Carousel>

            <p className="introduction">{farming.introduction}</p>

            {/* Explanation */}
            <div className="section">
                <h2 className="section-title">Explanation</h2>
                <p className="text">{farming.explanation}</p>
            </div>

            {/* Types */}
            <div className="section">
                <h2 className="section-title">Types</h2>
                <ul className="list">
                    {farming.types.map((type, index) => (
                        <li key={index} className="list-item">
                            <strong>{type.name}:</strong> {type.description}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Basic Steps of Crop Production */}
            <div className="sections">
                <h2 className="section-title">Basic Steps of Crop Production</h2>
                <div className='sections-container'>
                {farming.sections.map((section, index) => (
                    <div key={index} className="section-card">
                        <h2 className="section-title">{section.title}</h2>
                        {section.image && (
                            <div className="image-container">
                                <img src={section.image} alt={section.title} className="section-image" />
                            </div>
                        )}
                        <p className="text">{section.content}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* Advantages */}
            {farming.advantages && (
                <div className="section">
                    <h2 className="section-title">Advantages</h2>
                    <ul className="list">
                        {farming.advantages.map((advantage, index) => (
                            <li key={index} className="list-item">
                                <FaCheckCircle className="icon" /> {advantage}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Disadvantages */}
            {farming.disadvantages && (
                <div className="section">
                    <h2 className="section-title">Disadvantages</h2>
                    <ul className="list">
                        {farming.disadvantages.map((disadvantage, index) => (
                            <li key={index} className="list-item">
                                <FaLeaf className="icon" /> {disadvantage}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Future Scope */}
            {farming.futureScope && (
                <div className="section">
                    <h2 className="section-title">Future Scope</h2>
                    <p className="text">{farming.futureScope}</p>
                </div>
            )}

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
                <div className="recommended-section">
                    <h2 className="section-title">Recommended Products</h2>
                    <Carousel
                        responsive={{
                            superLarge: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
                            desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
                            tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
                            mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
                        }}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        keyBoardControl={true}
                        arrows={true}
                        customLeftArrow={<CustomLeftArrow />}
                        customRightArrow={<CustomRightArrow />}
                        showDots={window.innerWidth > 480}
                        className="carousel-container"
                    >
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="rental-card">
                                <img src={product.images} alt={product.productName} className="product-image" />
                                <div className="product-details">
                                    <h2 className="product-title">{product.productName}</h2>
                                    <p className="product-description">{truncateDescription(product.description)}</p>
                                    <p className="product-price"><strong>Price:</strong> ${product.price}</p>
                                    <p className="product-rating"><strong>Rating:</strong> {product.rating} ⭐</p>
                                    <button className="recommend-add-to-cart-btn" onClick={() => handleBuy(product._id)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}
            {/* Recommended Lessons */}
            {recommendedLessons.length > 0 && (
  <div className="recommended-section">
    <h2 className="section-title">Recommended Lessons</h2>
    <Carousel
      responsive={{
        superLarge: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
        desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
        tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
      }}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      keyBoardControl={true}
      arrows={true}
      showDots={true}
      className="carousel-container"
    >
      {recommendedLessons.map((lesson) => (
        <div className="tutorial-card" key={lesson.id} style={{height:"450px"}}>
          <img src={lesson.image} alt={lesson.title} className="tutorial-image" />
          <h2 className="tutorial-title">{lesson.title}</h2>
          <p className="tutorial-creator">By {lesson.creator}</p>
          <p className="tutorial-description">
            {lesson.description.length > 50
              ? `${lesson.description.substring(0, 50)}...`
              : lesson.description}
          </p>
          <p className="tutorial-type">{lesson.type}</p>
          <button 
            className="tutorial-link" 
            onClick={() => handleNavigation(lesson)}
          >
            Learn More
          </button>
        </div>
      ))}
    </Carousel>
  </div>)}
  <ToastContainer />
        </div>
    );
};

export default FarmingDetails;
