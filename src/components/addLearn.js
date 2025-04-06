import React, { useState } from 'react';
import '../stylesheet/addlearn.css';
import axios from 'axios';
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
const LearnForm = ({ isOpen, setIsModalOpen, userId }) => {
  const [type, setType] = useState('Video');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Video',
    image: '',
    description: '',
    link: '#',
    images: [],
    blogText: '',
    publishedDate: new Date(),
    video: null,
    likes: 0,
    likedBy: [],
    userId: userId
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [btnLoader, setBtnLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(name, files[0]);

    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else if (name === 'video') {
      setFormData((prev) => ({
        ...prev,
        video: files[0],
      }));
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  };
  // Handle extra images upload
  const handleExtraImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 4) {
      alert('You can only upload up to 4 extra images.');
    } else {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoader(true);
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('type', formData.type);
    form.append('description', formData.description);
    form.append('link', formData.link);
    form.append('blogText', formData.blogText);
    form.append('publishedDate', formData.publishedDate);
    form.append('likes', formData.likes);
    form.append('likedBy', JSON.stringify(formData.likedBy));
    form.append('userId', formData.userId);

    
    if (formData.image) {
      form.append('image', formData.image);
    }

    if (formData.video) {
      form.append('video', formData.video);
    }
    console.log(formData);

    
    formData.images.forEach((image) => {
      form.append('images', image); 
    });
   
    console.log("FormData before sending:", Array.from(form.entries()));
   

    try {


      if (formData.type === "Blog") {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}api/lesson/add-blog-lessons`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });


        if (response.status === 201) {
           toast.success("Prodcut added.");
          setModalOpen(false);
          onClose();
        }
      } else {
       
        const response = await axios.post(`${process.env.REACT_APP_API_URL}api/lesson/add-video-lessons`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response);
        
        if (response.status === 201) {
          toast.success("Prodcut added.");
          setModalOpen(false);
          onClose();
        }
      }
    } catch (error) {
      console.error("There was an error from the server:", error);
      toast.success("Error while adding Lesson.");
    }
    finally{
      setBtnLoader(false);
    }
  };


  
  const removeExtraImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

 
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Pagination functions
  const nextPage = () => {
    if (page < 3) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (!isOpen) return null;

  return (
    <>

      {isOpen && (
        <div className="modal" >
          <div className="modal-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>

            <h2>Create Learn Item</h2>
            <form onSubmit={handleSubmit}>
              {/* Page 1 - Basic Information */}
              {page === 1 && (
                <>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      name="type"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }));
                      }}
                    >
                      <option value="Video">Video</option>
                      <option value="Blog">Blog</option>
                    </select>
                  </div>
                </>
              )}

              {/* Page 2 - Image and Description */}
              {page === 2 && (
                <>
                  <div className="form-group">
                    <label htmlFor="image">Main Image</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {/* Page 3 - Video and Extra Images */}
              {page === 3 && (
                <>
                  {type === 'Blog' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="extraImages">Extra Images</label>
                        <input
                          type="file"
                          id="extraImages"
                          name="images"
                          accept="image/*"
                          multiple
                          onChange={handleExtraImageChange}
                        />
                        <div className="extra-images-preview">
                          {formData.images.map((img, index) => (
                            <div key={index} className="image-item">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`extra-image-${index}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeExtraImage(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="blogText">Blog Text</label>
                        <textarea
                          id="blogText"
                          name="blogText"
                          value={formData.blogText}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {type === 'Video' && (
                    <div className="form-group">
                      <label htmlFor="video">Video Upload</label>
                      <input
                        type="file"
                        id="video"
                        name="video"
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* Pagination Buttons */}
              <div className="pagination-buttons">
                {page > 1 && <button type="button" onClick={prevPage}>Previous</button>}
                {page < 3 && <button type="button" onClick={nextPage}>Next</button>}
                {page === 3 && <button type="submit" disabled={btnLoader}>{btnLoader?"Adding..":"Submit"}</button>}
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default LearnForm;
