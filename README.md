
# Farmingo – A MERN + ML Integrated Smart Farming Platform

Farmingo is a unified web-based platform built with the MERN stack and integrated with Machine Learning to empower farmers with intelligent insights, resource sharing, and community-driven support. It bridges the gap between modern agricultural technology and farmers by combining prediction tools, marketplaces, and social features.

---

## Key Features
- 🌱 **Crop Recommendation:** ML-based prediction of the most suitable crops based on soil & environmental factors.  
- 🌾 **Fertilizer Recommendation:** Suggests optimal fertilizers using soil type, nutrients, and crop type.  
- 📈 **Crop Price Forecasting:** Month-wise price predictions to help farmers make informed market decisions.  
- 🛒 **Buy & Rent Marketplace:** Farmers can list, rent, or purchase equipment and resources.  
- 📝 **Blogs & Lessons:** A space to share farming experiences, tutorials, and videos.  
- 🎬 **Shorts (Videos):** Community-driven short video content for knowledge exchange.  
- 📊 **Dashboard:** Track activities, rented tools, liked posts, and ML predictions.  

---

## Tech Stack
- **Frontend:** React.js, React Router, Axios  
- **Backend:** Node.js, Express.js, JWT Authentication  
- **Database:** MongoDB (Atlas/Local)  
- **Machine Learning:** Python, Flask, Scikit-learn  
- **Deployment:** Vercel (Frontend), Render (Backend)  
- **Tools:** Postman, MongoDB Compass, VS Code  

---

## Installation & Setup

Clone the repository and install dependencies:

<pre>
git clone https://github.com/Khushi220703/FarmingoUI
cd farmingo
npm install
npm run dev
</pre>

## Usage
- Register/Login to access the platform.
- Use the Crop/Fertilizer tools for predictions.
- Explore the marketplace to buy or rent tools.
- Post blogs, videos, or shorts to share experiences.
- Track your activities on the dashboard.

## Role & Contributions
- Designed and developed a responsive UI using React.js.
- Integrated Flask ML APIs for crop, fertilizer, and price predictions.
- Implemented marketplace functionality (buy/rent/list products).
- Added community features: blogs, lessons, and short videos.
- Ensured authentication & secure user sessions with JWT.

## Challenges & Learnings
- Building ML models that balance accuracy and real-time performance.
- Handling cross-origin requests (CORS) between Flask and React.
- Optimizing responsive UI for farmers with varying digital literacy.
- Learned integration of ML predictions with full-stack web apps.

## Future Improvements
- 🌿 Crop disease detection using deep learning & image classification.
- 🌦 Real-time soil & weather data integration.
- 🏷 Government scheme visibility based on crops/regions.
- 🌍 Multilingual support & offline mode for rural adoption.
- 📊 Continuous model training with real-time farmer inputs.

## Results
- Crop Recommendation Model: Naive Bayes – 99% accuracy
- Fertilizer Recommendation Model: Random Forest – 96.6% accuracy
- Crop Price Prediction: Random Forest Regressor – 93% accuracy
- Predictions generated within ~1 second, suitable for real-time use.



## Skills Demonstrated

MERN Stack · Machine Learning Integration · Flask API · Real-Time Prediction · Data-Driven UI/UX · RESTful APIs · Responsive Web Design

## Screenshots

1.	Signup: Users enter basic details (name, email), receive an email verification link, and set their password.
<img width="606" height="658" alt="Screenshot 2025-04-25 131418" src="https://github.com/user-attachments/assets/64325877-2de3-4322-ad1a-d86dd8874d79" />
<img width="821" height="624" alt="Screenshot 2025-04-25 135112" src="https://github.com/user-attachments/assets/f6d60d74-8e62-4029-bb5e-106daa4d8a53" />

2.	Login: Users log in to access the platform.
   <img width="791" height="800" alt="Screenshot 2025-04-25 131428" src="https://github.com/user-attachments/assets/3724b8d5-9429-4d80-8577-d3cd870c21c6" />

3.	Home Page: The top section displays a list of all types of agriculture (e.g., horticulture, aquaculture, floriculture, organic farming, etc.). Each category is presented in a card format with a brief                    introduction, relevant icons/images, and a "Learn More" button.
   <img width="1917" height="906" alt="Screenshot 2025-04-25 131449" src="https://github.com/user-attachments/assets/4ec0c703-b347-4f75-ac82-dcaab104298f" />
  	
4.	Crop Recommendation: Users input environmental data, and the system returns crop suggestions.
   Crop recommendation form
<img width="1917" height="920" alt="Screenshot 2025-04-25 131955" src="https://github.com/user-attachments/assets/1f3758f3-072a-4ac8-99c9-1563b1cbe631" />

Crop recommendation form output
<img width="1916" height="898" alt="Screenshot 2025-04-25 131944" src="https://github.com/user-attachments/assets/b3b8a3ff-2cb5-4b01-8c82-c2b0f96d9b61" />

5.	Fertilizer Recommendation: Users input crop and soil data, and the system returns suitable fertilizer recommendations.
