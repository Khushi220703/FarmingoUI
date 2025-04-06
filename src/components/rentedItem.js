import React, { useEffect, useState } from "react";
import "../stylesheet/buyOrderDetails.css";
import { decryptToken } from "../utils/tokenDecryption";

const RentedItemsTable = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await decryptToken();
        setUserId(id);
      } catch (err) {
        console.error("Error decrypting token:", err);
        setError("Failed to get user ID.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/dashboard/rented/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rented items.");
        }

        const records = await response.json();
        console.log("Fetched rented items:", records);

        setData(records || []);
      } catch (error) {
        console.error("Server error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">Currently Rented Items</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : data.length === 0 ? (
        <p>No rented items found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Rental Number</th>
              <th>Product</th>
              <th>Days Left</th>
              <th>Cost</th>
              <th>Rental Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rental) => (
              <tr key={rental.orderId} className={rental.daysLeft <= 2 ? "warning" : ""}>
                <td>{rental.orderId}</td>
                <td>{rental.product?.name || "Unknown Product"}</td>
                <td>{rental.rentalDuration}</td>
                <td>₹{rental.totalPrice}</td>
                <td>{new Date(rental.rentalDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RentedItemsTable;
