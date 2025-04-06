import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import '../stylesheet/learn.css';
import { decryptToken } from "../utils/tokenDecryption";
import AddLearn from "../components/addLearn";
import Loader from '../utils/loader';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const userId = decryptToken();
  const limit = 6;

  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/lesson/get-lessons?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setTutorials(data.tutorials || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.log("There is an error from the server side", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, [page]);

  const handleNavigation = (tutorial) => {
    const id = tutorial._id;
    if (tutorial.type === "Blog") {
      navigate("/learn-blog", { state: { id } });
    } else if (tutorial.type === "Video") {
      navigate("/videoDetail", { state: { id } });
    }
  };

  const handleLike = async (id) => {
    setTutorials((prevTutorials) =>
      prevTutorials.map((tutorial) =>
        tutorial._id === id
          ? {
              ...tutorial,
              likedBy: tutorial.likedBy.includes(userId)
                ? tutorial.likedBy.filter((uid) => uid !== userId)
                : [...tutorial.likedBy, userId],
              likes: tutorial.likedBy.includes(userId)
                ? tutorial.likes - 1
                : tutorial.likes + 1,
            }
          : tutorial
      )
    );

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/lesson/likeLesson/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error liking the tutorial", error);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (loading) return <Loader />;

  return (
    <div className="tutorials-section">
      <div className="learn-header-container">
        <h1>Farming Tutorials</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Tutorial</button>
      </div>

      <div className="tutorials-list">
        {tutorials.map((tutorial) => (
          <div className="tutorial-card" key={tutorial._id}>
            <div className="tutorial-header">
              <img src={tutorial.image} alt={tutorial.title} className="tutorial-image" />
              <div className="tutorial-info">
                <h2 className="tutorial-title">{tutorial.title}</h2>
                <span className="like-container" onClick={() => handleLike(tutorial._id)}>
                  {tutorial.likedBy.includes(userId) ? (
                    <AiFillHeart color="red" size={26} />
                  ) : (
                    <AiOutlineHeart size={26} />
                  )}
                  <span className="like-count">{tutorial.likes || 0}</span>
                </span>
              </div>
            </div>

            <p className="tutorial-creator">By {tutorial.creator}</p>
            <p className="tutorial-description">
              {tutorial.description.length > 50
                ? `${tutorial.description.substring(0, 50)}...`
                : tutorial.description}
            </p>
            <p className="tutorial-type">{tutorial.type}</p>
            <button className="tutorial-link" onClick={() => handleNavigation(tutorial)}>
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination-container">
        <button onClick={handlePrev} disabled={page === 1}>
          ⬅ Prev
        </button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next ➡
        </button>
      </div>

      {isModalOpen && (
        <div className="learn-modal">
          <div className="learn-modal-content">
            <AddLearn isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
