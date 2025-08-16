import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderByIdApi, updateOrderApi } from "../../api/Order";
import "./OrderDetails.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderByIdApi(parseInt(id));
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found.</div>;
  }

  return (
    <div className="order-details">
      <div className="order-header">
        <h1>Order #{order.id}</h1>
        <div className="order-status">
          <span
            className={`status-badge status-${order.status?.toLowerCase()}`}
          >
            {order.status || "Unknown"}
          </span>
        </div>
      </div>

      <div className="order-summary">
        <div className="summary-section">
          <h2>Order Summary</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Order ID:</label>
              <span>#{order.id}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-${order.status?.toLowerCase()}`}>
                {order.status || "Unknown"}
              </span>
            </div>
            <div className="info-item">
              <label>Subtotal:</label>
              <span>₹{order.subtotal || 0}</span>
            </div>
            <div className="info-item">
              <label>Tax:</label>
              <span>₹{order.tax || 0}</span>
            </div>
            <div className="info-item">
              <label>Total:</label>
              <span className="total-price">₹{order.total || 0}</span>
            </div>
            <div className="info-item">
              <label>Payment Method:</label>
              <span>{order.paymentMethod || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Shipping Information</h2>
          <div className="shipping-address">
            <p>
              <strong>Address:</strong> {order.shippingAddress || "N/A"}
            </p>
          </div>
        </div>

        <div className="customer-section">
          <h2>Customer Information</h2>
          <div className="customer-info">
            <p>
              <strong>Email:</strong> {order.user?.email || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {order.user?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="items-section">
          <h2>Order Items</h2>
          {order.items &&
          Array.isArray(order.items) &&
          order.items.length > 0 ? (
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.id} className="item-card">
                  <img
                    src={item.product?.imageUrl?.[0]}
                    alt={item.product?.name}
                    className="item-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100x100?text=No+Image";
                    }}
                  />
                  <div className="item-details">
                    <h3>{item.product?.name || "Unknown Product"}</h3>
                    <p>
                      {item.product?.description || "No description available"}
                    </p>
                    <div className="item-info">
                      <span>Quantity: {item.quantity || 0}</span>
                      <span>Price: ₹{item.price || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items found in this order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
