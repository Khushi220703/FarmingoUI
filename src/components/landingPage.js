import React from "react";
import "../stylesheet/landingPage.css";
import bgVideo from "../assets/video/1560989-hd_1280_720_30fps.mp4";
import flowerFarm from "../assets/video/flower.mp4"
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css"; // Import slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick theme CSS
import Rentals from "../assets/images/rain.jpg";
import DashboardImage from '../assets/images/tractor.jpg'; // Adjust the image path
import BlogAndShortsImage from '../assets/images/study.jpg';
import CropRecommendationImage from '../assets/images/anlysis.jpg';
import ChemicalQuantityImage from '../assets/images/chemical.jpg';
import PriceAnalysisImage from '../assets/images/pricePredict.jpg';
import { Link } from "react-router-dom";
// Array of feature data
const features = [
  {
    title: "Buy and Rent Products",
    description: "Manage your products for buy and rent efficiently through the dashboard. Keep track of available products and rental information.",
    image: DashboardImage,
  },
  {
    title: "Weather Forecasting",
    description: "Stay updated with real-time weather forecasting. Plan your farming activities based on weather predictions for the best outcomes.",
    image: Rentals,
  },
  {
    title: "Watch Shorts & Learn from Blogs",
    description: "Explore farming tips, tutorials, and agricultural news in the form of short videos and blogs to stay informed and improve your farming knowledge.",
    image: BlogAndShortsImage,
  },
  {
    title: "Crop Recommendation",
    description: "Get personalized crop recommendations based on your location, soil, and season to maximize your yield.",
    image: CropRecommendationImage,
  },
  {
    title: "Chemical Quantity Recommendation",
    description: "Get precise chemical quantity recommendations for your crops based on their growth stage to ensure healthy crops without overuse of chemicals.",
    image: ChemicalQuantityImage,
  },
  {
    title: "Crop Month-wise Price Analysis",
    description: "Access a detailed month-wise price analysis of various crops, helping you decide the best time to sell your harvest for maximum profit.",
    image: PriceAnalysisImage,
  },
];


const LandingPage = () => {
  const settings = {
    dots: true,
    infinite: true, 
    speed: 500, 
    slidesToShow: 3, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000, 
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // 2 slides for small screens
          slidesToScroll: 2, // Scroll 2 slides for small screens
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // 1 slide for very small screens
          slidesToScroll: 1, // Scroll 1 slide for very small screens
        },
      },
    ],
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <video className="background-video" autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="videoCover"></div>
        <div className="hero-content">
          <h1>Welcome to Our Service</h1>
          <p>Your journey to success starts here.</p>
          <Link to="/signup"><button className="cta-button">Get Started</button></Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <Slider {...settings}>
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img src={feature.image} alt={feature.title} className="feature-image" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </Slider>
      </section>



      <section className="testimonials-section">
        <h2>Testimonials</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"This service changed my life!"</p>
            <h4>- Happy Customer</h4>
          </div>
          <div className="testimonial">
            <p>"I can't recommend it enough!"</p>
            <h4>- Satisfied User</h4>
          </div>
          <div className="testimonial">
            <p>"A fantastic experience from start to finish."</p>
            <h4>- Grateful Client</h4>
          </div>
          {/* Duplicate testimonials to ensure continuous scrolling */}
          <div className="testimonial">
            <p>"This service changed my life!"</p>
            <h4>- Happy Customer</h4>
          </div>
          <div className="testimonial">
            <p>"I can't recommend it enough!"</p>
            <h4>- Satisfied User</h4>
          </div>
          <div className="testimonial">
            <p>"A fantastic experience from start to finish."</p>
            <h4>- Grateful Client</h4>
          </div>
          <div className="testimonial">
            <p>"A fantastic experience from start to finish."</p>
            <h4>- Grateful Client</h4>
          </div>
          <div className="testimonial">
            <p>"A fantastic experience from start to finish."</p>
            <h4>- Grateful Client</h4>
          </div>
          <div className="testimonial">
            <p>"A fantastic experience from start to finish."</p>
            <h4>- Grateful Client</h4>
          </div>
        </div>
      </section>


      <section className="cta-section">
        <video className="background-video" autoPlay loop muted>
          <source src={flowerFarm} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="videoCover"></div>
        <h2>Ready to get started?</h2>
       <Link to="/signup"><button className="cta-button">Sign Up Now</button></Link>
      </section>
    </div>
  );
};

export default LandingPage;
