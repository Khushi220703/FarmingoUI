import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const RentedItemsTable = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserId = async () => setUserId(await decryptToken());
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/rented/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch rented items");
        const data = await res.json();
        setData(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) return <div className="orders-container">Loading...</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Currently Rented Items</h2>
      {data.length === 0 ? (
        <p style={{ color: "grey" }}>No rented items!</p>
      ) : (
        <>
          <div className="desktop-table">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Rental #</th>
                  <th>Product</th>
                  <th>Days Left</th>
                  <th>Price</th>
                  <th>Rental Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(r => (
                  <tr key={r.orderId} className={r.daysLeft <= 2 ? "warning" : ""}>
                    <td>{r.orderId}</td>
                    <td>{r.product?.name || "N/A"}</td>
                    <td>{r.daysLeft}</td>
                    <td>₹{r.totalPrice}</td>
                    <td>{new Date(r.rentalDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards">
            {currentItems.map(r => (
              <div className={`rental-card ${r.daysLeft <= 2 ? "warning" : ""}`} key={r.orderId}>
                <p><strong>Rental #:</strong> {r.orderId}</p>
                <p><strong>Product:</strong> {r.product?.name || "N/A"}</p>
                <p><strong>Days Left:</strong> {r.daysLeft}</p>
                <p><strong>Price:</strong> ₹{r.totalPrice}</p>
                <p><strong>Rental Date:</strong> {new Date(r.rentalDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <ul className="pagination">
              <li className={currentPage === 1 ? "disabled" : ""} onClick={handlePrev}>Prev</li>
              <li className="active">Page {currentPage} of {totalPages}</li>
              <li className={currentPage === totalPages ? "disabled" : ""} onClick={handleNext}>Next</li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default RentedItemsTable;
