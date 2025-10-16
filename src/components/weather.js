import React, { useState, useEffect } from "react";
import axios from "axios";
import "../stylesheet/weather.css";
import night from "../assets/images/night.jpg";
import day from "../assets/images/day.jpg";
import { 
    WiHumidity, 
    WiStrongWind, 
    WiThermometer, 
    WiBarometer, 
    WiSunrise, 
    WiSunset 
} from "react-icons/wi";

const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [theme, setTheme] = useState("day");
    const [modalVisible, setModalVisible] = useState(false); // show only if user denies location
    const [city, setCity] = useState("");

    const API_KEY = "1337e768ca4ec4e2f334905b5102965e";
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (err) => {
                console.warn("User denied location access:", err);
                // Only show modal if user denies
                if (err.code === 1) { // 1 = PERMISSION_DENIED
                    setModalVisible(true);
                }
            }
        );
    }, []);

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            updateTheme();
        } catch (err) {
            console.error("Error fetching weather:", err);
        }
    };

    const fetchWeatherByCity = async (cityName) => {
        if (!cityName) return;
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            updateTheme();
            setModalVisible(false); // hide modal once city weather is loaded
        } catch (err) {
            console.error("City fetch error:", err);
            alert("City not found. Please try again."); // simple alert for invalid city
        }
    };

    const updateTheme = () => {
        const hour = new Date().getHours();
        setTheme(hour >= 6 && hour < 18 ? "day" : "night");
    };

    const handleCitySubmit = (e) => {
        e.preventDefault();
        fetchWeatherByCity(city);
    };

    return (
        <div
            className={`app-container ${theme}`}
            style={{
                backgroundImage: theme === "day" ? `url(${day})` : `url(${night})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "40vh",
                opacity: "0.9"
            }}
        >
            {/* Modal: only shows if user denied location */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Location access denied. Enter your city to get weather:</h3>
                        <form onSubmit={handleCitySubmit}>
                            <input
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="modal-input"
                                autoFocus
                            />
                            <button type="submit" className="modal-button">
                                Get Weather
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Weather Card */}
            {weather && (
                <div className="weather-card" style={{ width: "1250px" }}>
                    <div className="weather-info">
                        <div className="weather-info-humidity"
                            style={{
                                backgroundColor: theme === "day" ? "rgba(163, 163, 241, 0.4)" : "rgba(229, 105, 229, 0.4)",
                                position: "relative",
                                left: "10px",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                color: "white",
                                width: "200px",
                                textAlign: "center",
                                height:"120px"
                            }} 
                        >
                            <p> <WiHumidity size={30} color={"black"}/>  Humidity: {weather.main.humidity}%</p>
                            <p> <WiStrongWind size={30} color={"white"}/>  Wind Speed: {weather.wind.speed} m/s</p>
                            <p> <WiBarometer size={30} color={"black"}/> Pressure: {weather.main.pressure} hPa</p>
                        </div>

                        <div>
                            <div className="weather-info-location"
                                style={{
                                    backgroundColor: theme === "day" ? "rgba(163, 163, 241, 0.4)" : "rgba(229, 105, 229, 0.4)",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    color: "white",
                                    width: "400px",
                                    textAlign: "center",
                                    marginBottom:"20px"
                                }}
                            >
                                <h2>{weather.name}, {weather.sys.country}</h2>
                                <p>{weather.weather[0].description}</p>
                            </div>

                            <div className="weather-info-temp"
                                style={{
                                    backgroundColor: theme === "day" ? "rgba(163, 163, 241, 0.4)" : "rgba(229, 105, 229, 0.4)",
                                    position: "relative",
                                    left: "100px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    color: "white",
                                    width: "200px",
                                    textAlign: "center"
                                }}
                            >
                                <h3> <WiThermometer size={40} color={"blue"}/> {weather.main.temp}°C</h3>
                                <p>Feels Like: {weather.main.feels_like}°C</p>
                            </div>
                        </div>

                        <div className="weather-info-sun" style={{
                            backgroundColor: theme === "day" ? "rgba(163, 163, 241, 0.4)" : "rgba(229, 105, 229, 0.4)",
                            position: "relative",
                            left: "100px",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            color: "white",
                            width: "200px",
                            textAlign: "center"
                        }} >
                            <p><WiSunrise size={40} color={"orange"}/> Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                            <p><WiSunset size={40} color={"orange"}/> Sunset:  {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
