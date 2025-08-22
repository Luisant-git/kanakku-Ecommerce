import React from 'react';
import { Link } from 'react-router-dom';
import './MyOrders.scss';

const MyOrders = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffa500';
      case 'processing':
        return '#007bff';
      case 'shipped':
        return '#17a2b8';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="my-orders">
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start shopping to see your orders here!</p>
          <Link to="/products" className="btn btn--primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <p>You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.product.imageUrl[0] || '/placeholder-image.jpg'} 
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-left">
                <p><strong>Shipping to:</strong> {order.shippingAddress}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
              </div>
              <div className="summary-right">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{order.tax}</span>
                </div>
                {/* <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{order.shipping}</span>
                </div> */}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
