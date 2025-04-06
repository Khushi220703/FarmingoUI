import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import {decryptToken} from "../utils/tokenDecryption";
const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const userId = decryptToken();
  const [isUpdate,setIsUpdate] = useState(false);

  const fetchBuyData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/dashboard/yourPurchaseOrder/${userId}`
      );
      
      if (response.ok) {
        const records = await response.json();
        console.log(records);
        
        setOrders(records);
      } else {
        console.error("Failed to fetch order data");
      }
    } catch (error) {
      console.error("There is an error from the server side", error);
    }
  };

  
  useEffect(() => {
    if (userId) {
      fetchBuyData();
    }
  }, [userId,isUpdate]);

 
  const updateStatus = async (orderId) => {
   
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (response.ok) {
          console.log(data.message);
          setIsUpdate(true);
      } else {
          console.error(data.message);
      }
  } catch (error) {
      console.error("Error updating order status:", error);
  }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders List</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Category</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.product.name}</td>
                <td>{order.quantity}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.product.category}</td>
                <td>{new Date(order.orderedDate).toLocaleDateString()}</td>
                <td>{order.orderStatus}</td>
                <td>
                  {order.orderStatus === "Ordered" && (
                    <button
                      className="update-btn"
                      onClick={() => updateStatus(order.orderId)}
                    >
                      Mark as Shipped
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
