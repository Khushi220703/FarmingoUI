import React from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import '../stylesheet/learnBlog.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../utils/loader'; 
const BlogDetail = () => {
  const location = useLocation();
   const [blog, setBlog] = useState({
      title: '',
      content: '',
      publishedDate: '',
      extraImages:[],
      creator: ''
    });
  const id = location.state?.id || {};
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      // Fetch blog data from API (Replace with your actual API)
      const fetchBlogDetail = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}api/lesson/get-lesson/${id}`);
          const data = await response.json();
          console.log(data[0]);
          
          setBlog(data[0]);
        } catch (error) {
          console.error("Error fetching blog details:", error);
        }
        finally {
          setLoading(false);
        }
      };
      fetchBlogDetail();
    }, [id]);

    if (loading) return <Loader />;
  return (
    <div className="blog-detail">
      {/* Image Carousel */}
      {blog.extraImages && blog.extraImages.length > 0 && (
        <Swiper
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          modules={[Navigation, Pagination, Autoplay]}
          className="blog-carousel"
        >
          {blog.extraImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Blog slide ${index + 1}`} className="carousel-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Blog Header */}
      <div className="blog-header">
        <h1 className="blog-title">{blog.title || "No Title Available"}</h1>
        <p className="blog-date">
          <strong>Published on:</strong> {blog.publishedDate
            ? new Date(blog.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
            : "Unknown Date"}
        </p>
      </div>

      {/* Blog Content */}
      <div className="blog-content">
        {blog.blogText
          ? blog.blogText.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))
          : <p>No content available.</p>
        }
      </div>

      {/* Author Info */}
      <div className="blog-author">
        <p><strong>Author:</strong> {blog.creator || "Unknown Author"}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
