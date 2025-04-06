import React from 'react';
import Slider from "react-slick"; // Slick Slider for carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../stylesheet/productDetails.css';

const ProductDetails = () => {
  const images = [
   'https://via.placeholder.com/150/FFCC00/000000?text=Tractor+Rental',
   'https://via.placeholder.com/150/FFCC00/000000?text=Tractor+Rental',
   'https://via.placeholder.com/150/FFCC00/000000?text=Tractor+Rental'
  ]; 

  const product = {
    title: "Premium Organic Fertilizer",
    price: 499,
    description: "Top-quality organic fertilizer that helps boost plant growth and enhance soil fertility.",
    usage: [
      "Apply evenly to soil before watering.",
      "Use twice a month for optimal results.",
      "Store in a cool and dry place."
    ]
  };
  
  
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="product-details-container">
      {/* Image Carousel */}
      <div className="product-carousel">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Product ${index}`} className="carousel-image" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">₹{product.price}</p>
        
        {/* Add to Cart & Favorite Buttons */}
        <div className="product-actions">
          <button className="btn add-to-cart">🛒 Add to Cart</button>
          <button className="btn favorite">❤️ Add to Favorites</button>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        {/* Usage or Benefits */}
        <div className="product-usage">
          <h3>Usage Instructions / Benefits</h3>
          <ul>
            {product.usage.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
