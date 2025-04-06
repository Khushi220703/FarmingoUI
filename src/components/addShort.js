import React, { useState } from 'react';
import axios from 'axios';
import "../stylesheet/addShorts.css";

const AddShorts = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState("khushbu");
  const [userId, setUserId] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleHashtagsChange = (e) => setHashtags(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setError('Please upload a video');
      return;
    }

    setLoading(true);
    setError('');

    // Convert hashtags to an array
    const hashtagsArray = hashtags.split(',').map(tag => tag.trim());

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);
    formData.append('hashtags', JSON.stringify(hashtagsArray)); // Store hashtags as JSON
    formData.append('userName', userName);
    formData.append('userId', userId);

    try {
      // Send the data to your backend API
    const response =  await axios.post(`${process.env.REACT_APP_API_URL}api/shorts/add-shorts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
console.log(response);

      // Reset form on success
      setTitle('');
      setDescription('');
      setVideo(null);
      setHashtags('');
      setLoading(false);
      alert('Short uploaded successfully!');
    } catch (error) {
      setLoading(false);
      console.log(error);
      
      setError('Failed to upload short.');
    }
  };

  return (
    <div className="add-shorts-container">
      <h2>Add New Short</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="video">Upload Video</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="hashtags">Hashtags</label>
          <input
            type="text"
            id="hashtags"
            value={hashtags}
            onChange={handleHashtagsChange}
            placeholder="Add hashtags separated by commas"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Short'}
        </button>
      </form>
    </div>
  );
};

export default AddShorts;
