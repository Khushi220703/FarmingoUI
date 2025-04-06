import React, { useState, useEffect } from "react";
import axios from "axios";
import "../stylesheet/weather.css";
import night from "../assets/images/night.jpg";
import day from "../assets/images/day.jpg";
import { WiHumidity, WiStrongWind, WiThermometer, WiBarometer, WiSunrise, WiSunset } from "react-icons/wi";
const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [theme, setTheme] = useState("day");

    const API_KEY = "1337e768ca4ec4e2f334905b5102965e";

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            console.log(response);
            
            setWeather(response.data);
            updateTheme();
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    const updateTheme = () => {
        const hour = new Date().getHours();
        setTheme(hour >= 6 && hour < 18 ? "day" : "night");
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
            <div
                className="weather-card"
                style={{
                    width: "1250px",

                }}

            >
                {weather && (
                    <div className="weather-info">
                    <div className="weather-info-humidity" style={{
                            backgroundColor: theme === "day" ? "rgba(163, 163, 241, 0.4)" : "rgba(229, 105, 229, 0.4)",
                            position: "relative",
                            left: "10px",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            color: "white", width: "200px", textAlign: "center",
                            height:"120px"
                        }} >


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
                                
                            }}>
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
                                color: "white", width: "200px", textAlign: "center"
                            }}>
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
                            color: "white", width: "200px", textAlign: "center"
                        }} >
                            <p><WiSunrise size={40} color={"orange"}/> Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                            <p><WiSunset size={40} color={"orange"}/> Sunset:  {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                        </div>

                    </div>

                )}
            </div>
        </div>
    );
};

export default WeatherApp;
