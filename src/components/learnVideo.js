import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../stylesheet/learnVideo.css';
import '../stylesheet/learnBlog.css';
import { useLocation } from 'react-router-dom';
import Loader from '../utils/loader'; 
const BlogDetail = () => {
  const { tutorial } = useParams();  // Get blog ID from URL
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    publishedDate: '',
    videoUrl: '',
    creator: ''
  });
const location = useLocation();
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
    <div className="video-detail">
      {/* Blog Title */}
      <h1 className="blog-title">{blog.title || "Blog Title"}</h1>
      <p className="blog-date">
        <strong>Published on:</strong> {blog.publishedDate 
          ? new Date(blog.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) 
          : "Unknown Date"}
      </p>

      {/* Blog Content */}
      <div className="blog-content">
  {blog.description
    ? blog.description.split('\n').map((paragraph, index) => (
        paragraph.trim() && <p key={index}>{paragraph}</p>
      ))
    : <p>No content available</p>}
</div>

      {/* Video Tutorial Section */}
      {blog.videoUrl && (
        <div className="video-section">
          <video className="tutorial-video" controls>
            <source src={blog.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="creator-name"><strong>Creator:</strong> {blog.creator || "Unknown"}</p>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
