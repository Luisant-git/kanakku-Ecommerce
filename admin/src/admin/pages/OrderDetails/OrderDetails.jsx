import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPrinter, FiTruck } from 'react-icons/fi'
import './OrderDetails.scss'

const OrderDetails = () => {
  const { id } = useParams()
  
  // Sample order data - in a real app you would fetch this based on the ID
  const order = {
    id: id,
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      address: '123 Main St, Salem, Tamil Nadu 636001'
    },
    date: '2023-05-15T10:30:00',
    status: 'completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    items: [
      { id: 1, name: 'Accounting Software Pro', price: 4999, quantity: 1 },
      { id: 2, name: 'Business Tax Guide', price: 999, quantity: 1 }
    ],
    subtotal: 5998,
    tax: 1079.64,
    shipping: 0,
    total: 7077.64,
    trackingNumber: 'TRK123456789'
  }

  return (
    <div className="order-details-page">
      <div className="page-header">
        <Link to="/admin/orders" className="back-btn">
          <FiArrowLeft /> Back to Orders
        </Link>
        <div className="header-actions">
          <button className="print-btn">
            <FiPrinter /> Print Invoice
          </button>
          {order.status === 'processing' && (
            <button className="ship-btn">
              <FiTruck /> Mark as Shipped
            </button>
          )}
        </div>
      </div>
      
      <div className="order-container">
        <div className="order-summary">
          <div className="order-header">
            <h2>Order #{order.id}</h2>
            <div className={`status-badge ${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          
          <div className="order-meta">
            <div className="meta-group">
              <h3>Order Date</h3>
              <p>{new Date(order.date).toLocaleString()}</p>
            </div>
            <div className="meta-group">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod}</p>
            </div>
            <div className="meta-group">
              <h3>Payment Status</h3>
              <p>{order.paymentStatus}</p>
            </div>
            {order.trackingNumber && (
              <div className="meta-group">
                <h3>Tracking Number</h3>
                <p>{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="order-sections">
          <div className="customer-section">
            <h3>Customer Details</h3>
            <div className="customer-info">
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Address:</strong> {order.customer.address}</p>
            </div>
          </div>
          
          <div className="items-section">
            <h3>Order Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>₹{item.price.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="totals-section">
            <h3>Order Totals</h3>
            <div className="totals-grid">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Tax (18%):</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>₹{order.shipping.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails