import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiShoppingBag } from 'react-icons/fi'
import './CustomerDetails.scss'

const CustomerDetails = () => {
  const { id } = useParams()
  
  // Sample customer data - in a real app you would fetch this based on the ID
  const customer = {
    id: id,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main St, Salem, Tamil Nadu 636001',
    joined: '2023-01-15T10:30:00',
    orders: [
      { id: 1001, date: '2023-05-15', amount: 5998, status: 'completed' },
      { id: 1002, date: '2023-04-10', amount: 19900, status: 'completed' },
      { id: 1003, date: '2023-03-05', amount: 9900, status: 'completed' }
    ],
    totalSpent: 35798
  }

  return (
    <div className="customer-details-page">
      <div className="page-header">
        <Link to="/admin/customers" className="back-btn">
          <FiArrowLeft /> Back to Customers
        </Link>
        <button className="edit-btn">
          <FiEdit /> Edit Customer
        </button>
      </div>
      
      <div className="customer-container">
        <div className="customer-profile">
          <div className="profile-header">
            <div className="avatar">
              {customer.name.charAt(0)}
            </div>
            <div className="profile-info">
              <h2>{customer.name}</h2>
              <p>{customer.email}</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-group">
              <h3>Contact Information</h3>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Address:</strong> {customer.address}</p>
            </div>
            
            <div className="detail-group">
              <h3>Account Information</h3>
              <p><strong>Joined:</strong> {new Date(customer.joined).toLocaleString()}</p>
              <p><strong>Total Orders:</strong> {customer.orders.length}</p>
              <p><strong>Total Spent:</strong> ₹{customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="customer-orders">
          <h3>Order History</h3>
          {customer.orders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="order-link">
                        #{order.id}
                      </Link>
                    </td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>₹{order.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="view-btn">
                        <FiShoppingBag /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders">
              <p>This customer hasn't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails