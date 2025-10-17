// RentalsTable.jsx
import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
//import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const RentalsTable = () => {
  const [rentals, setRentals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await decryptToken();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/yourRentOrder/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch rentals");
        const data = await res.json();
        setRentals(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Pagination
  const totalPages = Math.ceil(rentals.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = rentals.slice(indexOfFirst, indexOfLast);
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const updateStatus = async (orderId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`, { method: "PUT" });
    if (res.ok) setRentals(rentals.map(r => r.orderId === orderId ? { ...r, orderStatus: "Shipped" } : r));
  };

  if (loading) return <div className="orders-container">Loading...</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Rental Items to be Shipped</h2>
      {rentals.length === 0 ? (
        <p style={{ color: "grey" }}>No rental items!</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Rental #</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Days</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(r => (
                  <tr key={r.orderId}>
                    <td>{r.orderId}</td>
                    <td>{r.product?.name || "N/A"}</td>
                    <td>{r.quantity}</td>
                    <td>{r.rentalDuration}</td>
                    <td>₹{r.totalPrice}</td>
                    <td>{r.orderStatus}</td>
                    <td>
                      {r.orderStatus === "Ordered" && (
                        <button className="update-btn" onClick={() => updateStatus(r.orderId)}>Mark as Shipped</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
  {currentItems.map(r => (
    <div className="rental-card" key={r.orderId}>
      <p><strong>Rental #:</strong> {r.orderId}</p>
      <p><strong>Product:</strong> {r.product?.name || "N/A"}</p>
      <p><strong>Qty:</strong> {r.quantity}</p>
      <p><strong>Days:</strong> {r.rentalDuration}</p>
      <p><strong>Price:</strong> ₹{r.totalPrice}</p>
      <p><strong>Status:</strong> {r.orderStatus}</p>
      {r.orderStatus === "Ordered" && (
        <button className="update-btn" onClick={() => updateStatus(r.orderId)}>Mark as Shipped</button>
      )}
    </div>
  ))}
</div>


          {/* Pagination */}
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

export default RentalsTable;
