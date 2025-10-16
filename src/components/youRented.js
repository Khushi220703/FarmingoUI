import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const UserRentedItemsTable = () => {
  const [data, setData] = useState([]);
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

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/dashboard/youRentedItems/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 404) {
          setData([]);
          setError("");
        } else if (!response.ok) {
          throw new Error("Failed to fetch rented items.");
        } else {
          const records = await response.json();
          setData(records || []);
        }
      } catch (err) {
        console.error("Server error:", err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) return <div className="orders-container">Loading rented items...</div>;
  if (error) return <div className="orders-container">Error: {error}</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Items You Have Rented</h2>
      {data.length === 0 ? (
        <div className="no-rentals-message" style={{color:"grey"}}>You have not rented any items yet.</div>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Rental Number</th>
                <th>Product</th>
                <th>Days Rented</th>
                <th>Cost</th>
                <th>Rental Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rental, index) => (
                <tr key={index}>
                  <td>{rental.orderId}</td>
                  <td>
                    {rental.product
                      ? `${rental.product.name} (${rental.product.category})`
                      : "Product details unavailable"}
                  </td>
                  <td>{rental.rentalDuration}</td>
                  <td>₹{rental.totalPrice}</td>
                  <td>{new Date(rental.rentalDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination with external CSS classes */}
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

export default UserRentedItemsTable;
