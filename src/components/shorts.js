import React, { useState, useEffect, useRef, Suspense } from "react";
import "../stylesheet/shorts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShortComponents = React.lazy(() => import("./shortComponents"));

const Shorts = () => {
  const [videoData, setVideoData] = useState([]); // Store videos
  const [page, setPage] = useState(1); // Track page
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const isFetching = useRef(false); // Prevent duplicate API calls
  const seenVideos = useRef(new Set()); // Track loaded videos to prevent duplicates

  // Function to fetch videos
  const fetchVideoData = async () => {
    if (isFetching.current) return; // Prevent duplicate calls
    isFetching.current = true; // Set fetching flag

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/shorts/get-shorts?page=${page}`
      );
      
     
       if (response.data.length > 0) {
      setVideoData((prev) => [...prev, ...response.data]); // ✅ Just append new data
      setPage((prevPage) => prevPage + 1); // ✅ Increment page only after successful fetch
    }
        
        

      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoading(false);
    } finally {
      isFetching.current = false; // Reset flag
    }
  };

  // Load first video on mount
  useEffect(() => {
    fetchVideoData(); // Removed argument (1) as it’s not needed
  }, []);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
        fetchVideoData(page); // ✅ Always pass the latest page
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading]); // ✅ Depend on `page` & `loading`
  

  return (
    <div className="short">
    <div className="back-arrow" onClick={() => navigate(-1)}>
  <i className="fas fa-chevron-down"></i>
</div>



      <div className="shorts-section">
        <div className="video-list">
          {videoData.map((video) => (
            <div className="video-card" key={video._id}>
              <Suspense fallback={<div>Loading video...</div>}>
                <ShortComponents initialVideoData={video} />
              </Suspense>
            </div>
          ))}
        </div>
        {loading && <div className="loading">Loading more videos...</div>}
      </div>
    </div>
  );
};

export default Shorts;
