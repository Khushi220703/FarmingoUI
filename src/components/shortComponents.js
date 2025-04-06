import React, { useState } from "react";
import "../stylesheet/shorts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const ShortComponents = ({ initialVideoData }) => {
  const userId = "673b47daf031233e906e3212"; // Example userId
  const [videoData, setVideoData] = useState(initialVideoData);
  const [newComments, setNewComments] = useState("");
  const [loadingStates, setLoadingStates] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Like/Unlike functionality
  const liking = async () => {
    setLoadingStates(true);
    try {
      const action = videoData.likes.includes(userId) ? "unlike" : "like";
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}api/shorts/like`,
        {
          shortId: videoData._id,
          userId,
          action,
        }
      );

      setVideoData((prev) => ({
        ...prev,
        likes: response.data.likes,
        likesCount: response.data.likes.length,
      }));
    } catch (error) {
      console.error("Error in liking/unliking:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Submit a comment
  const handleCommentSubmit = async () => {
    if (!newComments.trim()) return;

    setCommentLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}api/shorts/add-comment`,
        { userId, videoId: videoData._id, newComment: newComments }
      );

      setVideoData((prev) => ({
        ...prev,
        comments: response.data.comments,
      }));
      setNewComments("");
    } catch (error) {
      console.error("Error in adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const secondsAgo = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (secondsAgo < 60) return `${secondsAgo}s`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo}d`;
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo}mo`;
    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo}y`;
};

  return (
    <div className="video-card-1">
      <div className="content">
        <video className="video-player" controls>
          <source src={videoData.videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-description">{videoData.description}</div>
        <div className="video-actions">
          <span className="action-button">
            <i
              className={`fas fa-thumbs-up ${
                videoData.likes.includes(userId) ? "text-danger" : "text-muted"
              }`}
              onClick={liking}
            ></i>
            {loadingStates ? "Loading..." : `${videoData.likesCount} Likes`}
          </span>
          <span className="action-button">
            <i className="fas fa-comment"></i>
            {videoData.comments?.length || 0} Comments
          </span>
        </div>
        <div className="comment-form">
          <input
            type="text"
            value={newComments}
            onChange={(e) => setNewComments(e.target.value)}
            placeholder="Add a comment..."
          />
          <button disabled={commentLoading} onClick={handleCommentSubmit} className="shorts-add-button">
            {commentLoading ? "Submitting..." : "Add"}
          </button>
        </div>
      </div>
      <div className="comments-section">
        <p className="comment-heading">Comments</p>
        <div className="comments">
          {videoData.comments.map((text, index) => (
            <div className="comment" key={index}>
              {text.text}
              <span className="time-ago">{getTimeAgo(text.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortComponents;
