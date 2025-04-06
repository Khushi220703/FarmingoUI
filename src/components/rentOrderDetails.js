import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import { decryptToken } from "../utils/tokenDecryption";

const RentalsTable = () => {
  const [rentals, setRentals] = useState([]);
  const userId = decryptToken();

  const fetchRentData = async () => {
    try {
      console.log("Fetching data for user:", userId);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/dashboard/yourRentOrder/${userId}`
      );

      if (response.ok) {
        const records = await response.json();
        console.log("Fetched Rentals:", records);
        setRentals(records); 
      } else {
        console.error("Failed to fetch rental data");
      }
    } catch (error) {
      console.error("There is an error from the server side", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRentData();
    }
  }, [userId]);

  const updateStatus = async (orderId) => {
   
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (response.ok) {
          console.log(data.message);
      } else {
          console.error(data.message);
      }
  } catch (error) {
      console.error("Error updating order status:", error);
  }
  };
  return (
    <div className="orders-container">
      <h2 className="orders-title">Rental Items to be Shipped</h2>
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
          {rentals.map(rental => (
            <tr key={rental.orderId}>
              <td>{rental.orderId}</td>
              <td>{rental.product?.name}</td>
              <td>{rental.quantity}</td>
              <td>{rental.rentalDuration}</td>
              <td>₹{rental.totalPrice}</td>
              <td>{new Date(rental.orderedDate).toLocaleDateString()}</td>
              <td>{rental.orderStatus}</td>
              <td>
                {rental.orderStatus === "Ordered" && (
                  <button className="update-btn" onClick={() => updateStatus(rental.orderId)}>
                    Mark as Shipped
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalsTable;
