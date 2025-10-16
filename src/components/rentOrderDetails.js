import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const RentalsTable = () => {
  const [rentals, setRentals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await decryptToken();
        setUserId(id);
      } catch (err) {
        console.error("Error decrypting token:", err);
        setError("Failed to get user ID.");
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchRentData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/dashboard/yourRentOrder/${userId}`
        );

        if (response.status === 404) {
          setRentals([]);
          setError("");
        } else if (!response.ok) {
          throw new Error("Failed to fetch rental data.");
        } else {
          const records = await response.json();
          setRentals(records || []);
        }
      } catch (err) {
        console.error("Server error:", err);
        setError(err.message);
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentData();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.ceil(rentals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rentals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const updateStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        // Refresh data after status update
        const refreshed = await fetch(
          `${process.env.REACT_APP_API_URL}api/dashboard/yourRentOrder/${userId}`
        );
        const updatedRecords = await refreshed.json();
        setRentals(updatedRecords || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (loading) return <div className="orders-container">Loading rentals...</div>;
  if (error) return <div className="orders-container" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Rental Items to be Shipped</h2>

      {rentals.length === 0 ? (
        <div className="no-rentals-message" style={{ color: "grey" }}>
          No rental items are available for shipping.
        </div>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Rental Number</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rental Days</th>
                <th>Cost</th>
                <th>Rental Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rental) => (
                <tr key={rental.orderId}>
                  <td>{rental.orderId}</td>
                  <td>{rental.product?.name || "N/A"}</td>
                  <td>{rental.quantity}</td>
                  <td>{rental.rentalDuration}</td>
                  <td>₹{rental.totalPrice}</td>
                  <td>{new Date(rental.orderedDate).toLocaleDateString()}</td>
                  <td>{rental.orderStatus}</td>
                  <td>
                    {rental.orderStatus === "Ordered" && (
                      <button
                        className="update-btn small-btn"
                        onClick={() => updateStatus(rental.orderId)}
                      >
                        Mark as Shipped
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <ul className="pagination">
              <li
                className={currentPage === 1 ? "disabled" : ""}
                onClick={currentPage > 1 ? handlePrev : undefined}
              >
                Prev
              </li>
              <li className="active">
                Page {currentPage} of {totalPages}
              </li>
              <li
                className={currentPage === totalPages ? "disabled" : ""}
                onClick={currentPage < totalPages ? handleNext : undefined}
              >
                Next
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default RentalsTable;
