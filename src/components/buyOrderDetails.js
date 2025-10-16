import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await decryptToken();
        setUserId(id);
      } catch (err) {
        console.error("Error decrypting token:", err);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchBuyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/dashboard/yourPurchaseOrder/${userId}`
        );

        if (response.status === 404) {
          setOrders([]);
        } else if (!response.ok) {
          console.error("Failed to fetch order data");
        } else {
          const records = await response.json();
          setOrders(records || []);
        }
      } catch (error) {
        console.error("There is an error from the server side", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyData();
  }, [userId, isUpdate]);

  const updateStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setIsUpdate(!isUpdate);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No Orders!</p>
      ) : (
        <>
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
              {currentItems.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.product?.name || "N/A"}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.product?.category || "N/A"}</td>
                  <td>{new Date(order.orderedDate).toLocaleDateString()}</td>
                  <td>{order.orderStatus}</td>
                  <td>
                    {order.orderStatus === "Ordered" && (
                      <button
                        className="update-btn small-btn"
                        onClick={() => updateStatus(order.orderId)}
                      >
                        Mark as Shipped
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination like RentalsTable */}
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

export default OrdersTable;
