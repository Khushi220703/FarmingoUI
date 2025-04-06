import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import "./App.css";
import HomePage from "./components/homePage";
import AddRentForm from "./components/addRentForm";
import AddProductForm from "./components/addProductForm";
import CropRecommendationForm from "./components/cropRecommendation";
import Learn from "./components/learn";
import Shorts from "./components/shorts";
import LearnBlog from "./components/learnBlog";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Signup from "./components/signup";
import MarketPlace from "./components/marketPlace";
import Rent from "./components/rent";
import LandingPage from "./components/landingPage";
import SetPassword from "./components/setPassword";
import AddShorts from "./components/addShort";
import LearnVideo from "./components/learnVideo"
import Cart from "./components/cart";
import AgricultureType from "./components/agricultureType"
import { ToastContainer } from "react-toastify";
import FarmingDetails from "./components/farmingDetails";
import { AuthProvider } from "./utils/authContext";
import ProtectedRoute from "./utils/protectedRoutes";
import AddLearn from "./components/addLearn";
import ChemicalAndPrice from "./components/recommendations/chemicalAndPrice";
const AppContent = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });
  const isAuthenticated = !!localStorage.getItem("farmingoToken");
  // Define paths that should hide the Header and Sidebar
  const hideHeader = ["/login", "/signup", "/setPassword/:token/:email/:name", "/shorts"];
  const hideSidebar = ["/", "/login", "/signup", "/setPassword/:token/:email/:name", "/shorts"];

  const setPasswordRegex = /^\/setPassword\/[^/]+\/[^/]+\/[^/]+$/;

  const isHeaderVisible = !(
    hideHeader.includes(location.pathname) || setPasswordRegex.test(location.pathname)
  );
  const isSidebarVisible = !(
    hideSidebar.includes(location.pathname) || setPasswordRegex.test(location.pathname)
  );

  return (
    <div className="App">
      { isHeaderVisible && <Header />}
      <div className="main-content">
        {isAuthenticated &&  isSidebarVisible && <Sidebar />}
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup formData={formData} setFormData={setFormData} />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/addRent" element={<AddRentForm />} />
            <Route path="/market-place" element={<MarketPlace />} />
            <Route path="/addProduct" element={<AddProductForm />} />
            <Route path="/crop-recommendation" element={<CropRecommendationForm />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/addlearn" element={<AddLearn/>} />
            <Route path="/learn-blog" element={<LearnBlog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/addShorts" element={<AddShorts />} />
            <Route path="/addProductForm" element={<AddProductForm />} />
            <Route path="/videoDetail" element={<LearnVideo />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/agricultureType" element={<AgricultureType />} />
            <Route path="/farmingDetails/:id" element={<FarmingDetails />} />
            <Route path="/chemicalAndPrice" element={<ChemicalAndPrice />} />
            <Route path="/setPassword/:token/:email/:name" element={<SetPassword formData={formData} setFormData={setFormData} />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
