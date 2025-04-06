import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import "../stylesheet/homePage.css";
import "../stylesheet/pagination.css";
import {  useNavigate } from 'react-router-dom';
const HomePage = () => {
  const [agricultureFields, setAgricultureFields] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); 
  const Navigating = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading before fetching data
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/homePage/getAgricultureData?page=${currentPage + 1}&limit=${itemsPerPage}`);
        const data = await response.json();
        
        setAgricultureFields(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching agriculture data:', error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const navigating = (id) =>{

    Navigating(`/farmingDetails/${id}`);
  }

  return (
    <div className="homepage-container">
      <h1 className='stylish-heading'>Explore Different Fields of Agriculture</h1>

      {/* Loader */}
      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Content Section */}
      {!loading && (
        <div className="card-container">
          {agricultureFields.length > 0 ? (
            agricultureFields.map((field, index) => (
              <div className="agriculture-card" key={index}>
                <img src={field.image} alt={field.title} className="card-image" />
                <div className="card-content">
                  <h2>{field.field}</h2>
                  <p>{field.description.length > 80 ? `${field.description.slice(0, 80)}...` : field.description}</p>
                  <button className="learn-more-btn-home" onClick={() => navigating(field._id)}>Learn More</button>
                </div>
              </div>
            ))
          ) : (
            <p>No Data Available</p>
          )}
        </div>
      )}

      {/* Pagination Component */}
      {!loading && totalPages > 1 && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousClassName={'previous'}
          nextClassName={'next'}
          disabledClassName={'disabled'}
        />
      )}
    </div>
  );
};

export default HomePage;
