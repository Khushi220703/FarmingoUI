import React, { useState, useEffect } from "react";
import "../stylesheet/buyOrderDetails.css";
import "../stylesheet/pagination.css";
import { decryptToken } from "../utils/tokenDecryption";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
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
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/yourPurchaseOrder/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = orders.slice(indexOfFirst, indexOfLast);
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const updateStatus = async (orderId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/orderShipped/${orderId}`, { method: "PUT" });
    if (res.ok) setOrders(orders.map(o => o.orderId === orderId ? { ...o, orderStatus: "Shipped" } : o));
  };

  if (loading) return <div className="orders-container">Loading...</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders List</h2>
      {orders.length === 0 ? (
        <p style={{ color: "grey" }}>No Orders!</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(order => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.product?.name || "N/A"}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderStatus}</td>
                    <td>
                      {order.orderStatus === "Ordered" && (
                        <button className="update-btn" onClick={() => updateStatus(order.orderId)}>Mark as Shipped</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {currentItems.map(order => (
              <div className="order-card" key={order.orderId}>
                <p><strong>Order #:</strong> {order.orderId}</p>
                <p><strong>Product:</strong> {order.product?.name || "N/A"}</p>
                <p><strong>Qty:</strong> {order.quantity}</p>
                <p><strong>Price:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                {order.orderStatus === "Ordered" && (
                  <button className="update-btn" onClick={() => updateStatus(order.orderId)}>Mark as Shipped</button>
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

export default OrdersTable;
