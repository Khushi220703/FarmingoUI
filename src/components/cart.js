import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";
import "../stylesheet/cart.css";
import "../stylesheet/pagination.css";
import emptyCartImage from "../assets/images/shoppingCartEmpty.gif";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decryptToken } from "../utils/tokenDecryption";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(3);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = decryptToken();
    const [totalPrice, setTotalPrice] = useState(0);
   
    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/cart/${userId}?page=${currentPage + 1}&limit=${itemsPerPage}`);
                setCartItems(response.data.items);
                setTotalPages(response.data.totalPages);
                setTotalPrice(response.data.totalPrice);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchCartItems();
    }, [userId, currentPage]);

    const updateQuantity = async (id, change) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}api/cart/update/${id}`, { change });

            const updatedCart = cartItems.map(item =>
                item._id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + change) }
                    : item
            ).filter(item => item.quantity > 0);

            setCartItems(updatedCart);

            // **Update total price dynamically**
            const newTotalPrice = updatedCart.reduce((acc, item) => {
                return acc + (item.isRent
                    ? item.rentalDuration * item.productId.rentalPrice
                    : item.quantity * item.productId.price);
            }, 0);

            setTotalPrice(newTotalPrice); // Update total price state

            // Move to previous page if current page becomes empty
            if (updatedCart.length === 0 && currentPage > 0) {
                setCurrentPage(prevPage => prevPage - 1);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}api/cart/delete/${id}`);

            const updatedCart = cartItems.filter(item => item._id !== id);
            setCartItems(updatedCart);

            // If the current page is empty after deletion, move to the previous page
            if (updatedCart.length === 0 && currentPage > 0) {
                setCurrentPage(prevPage => prevPage - 1);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // buy the cart item..
    const handleBuyNow = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}api/buy/item/${userId}`);
            toast.success("Purchase successful! Your cart has been cleared.");
            setCartItems([]);
            setCurrentPage(0);

        } catch (error) {
            console.error("Error processing purchase:", error);
            toast.error("Failed to process purchase. Please try again.");
        }
        finally{
            setLoading(false);
        }
    };

    const updateRentalDuration = async (id, change) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}api/cart/updateRentalDuration/${id}`,
                { change }
            );

            const updatedCart = cartItems.map(item =>
                item._id === id
                    ? {
                        ...item,
                        rentalDuration: item.isRent
                            ? Math.max(0, (item.rentalDuration || 1) + change)
                            : item.rentalDuration // Keep unchanged for non-rent items
                    }
                    : item
            ).filter(item => item.isRent ? item.rentalDuration > 0 : true);


            setCartItems(updatedCart);

            // **Update total price**
            const newTotalPrice = updatedCart.reduce((acc, item) => {
                return acc + (item.isRent
                    ? item.rentalDuration * item.productId.rentalPrice
                    : item.quantity * item.productId.price);
            }, 0);

            setTotalPrice(newTotalPrice); // Update the total price state

            // Move to previous page if current page becomes empty
            if (updatedCart.length === 0 && currentPage > 0) {
                setCurrentPage(prevPage => prevPage - 1);
            }
        } catch (error) {
            console.error("Error updating rental duration:", error);
        }
    };


    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };


    return (

        <div className="cart-container">
            <h2>Your Cart</h2>
            {loading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : cartItems.length > 0 ? (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>

                                <th>Price</th>
                                <th>Total</th>
                                <th>Is Rent</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id}>
                                    <td data-label="Product">{item.productId.productName}</td>
                                    <td data-label="Quantity" className="quantity-controls">
                                        <button className="btn btn-update" onClick={() => updateQuantity(item._id, -1)}>-</button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button className="btn btn-update" onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    </td>
                                    <td data-label="Price">${item.isRent ? item.productId.rentalPrice : item.productId.price}</td>
                                    <td data-label="Total">${item.isRent ? item.rentalDuration * item.productId.rentalPrice : item.quantity * item.productId.price}</td>
                                    <td data-label="Is Rent">{item.isRent ? "Yes" : "No"}</td>
                                    <td data-label="Duration" className="duration-controls">
                                        {item.isRent ? (
                                            <>
                                                <button className="btn btn-update" onClick={() => updateRentalDuration(item._id, -1)}>-</button>
                                                <span className="quantity">{item.rentalDuration || 1}</span>
                                                <button className="btn btn-update" onClick={() => updateRentalDuration(item._id, 1)}>+</button>
                                            </>
                                        ) : (
                                            <span className="not-applicable">N/A</span>
                                        )}
                                    </td>
                                    <td data-label="Action">
                                        <button className="btn remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <div className="cart-footer">
                        <h3 className="total-price">Total Price: ${totalPrice}</h3>
                        <button className="btn buy-now" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                    <ReactPaginate
                        previousLabel={'❮ Previous'}
                        nextLabel={'Next ❯'}
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
                </>
            ) : (
                <div className="empty-cart">
                    <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-img" />
                    <h3>Your Cart is Empty</h3>
                    <p>Looks like nothing is in the cart.</p>
                    <div className="empty-cart-buttons">
                        <button className="btn" onClick={() => navigate("/rent")}>Rent products</button>
                        <button className="btn" onClick={() => navigate("/market-place")}>Continue Shopping</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
