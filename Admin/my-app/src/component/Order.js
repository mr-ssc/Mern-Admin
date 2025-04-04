import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Order.css";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch("https://mern-backend-sable.vercel.app/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderCount = async () => {
        try {
            const res = await fetch("https://mern-backend-sable.vercel.app/api/orders/count");
            if (!res.ok) throw new Error("Failed to fetch order count");
            const data = await res.json();
            setOrderCount(data.totalOrders);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(
                `https://mern-backend-sable.vercel.app/api/orders/status/${orderId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );
            if (!res.ok) throw new Error("Failed to update status");
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchOrderCount();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "#FFC107";
            case "processing": return "#17A2B8";
            case "shipped": return "#007BFF";
            case "delivered": return "#28A745";
            case "cancelled": return "#DC3545";
            default: return "#6C757D";
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-container">
                    <p className="error-message">Error: {error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="order-table-container">
                <h2 className="order-header">All Orders (Total: {orderCount})</h2>
                {orders.length === 0 ? (
                    <p className="no-orders">No orders found</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>User Name</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1}</td>
                                    <td>{order.username}</td>
                                    <td>{order.productName}</td>
                                    <td>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="status-select"
                                            style={{ borderColor: getStatusColor(order.status) }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Order;