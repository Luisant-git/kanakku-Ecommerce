import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiShoppingBag } from 'react-icons/fi'
import './CustomerDetails.scss'
import { getCustomerByIdApi } from '../../api/Customer'
import { useEffect } from 'react'
import { useState } from 'react'

const CustomerDetails = () => {
  const { id } = useParams()
  const [customer, setCustomer] = useState({});

  const getCustomerById = async () =>{
    const response = await getCustomerByIdApi(id);
    setCustomer(response);
  }

  useEffect(()=>{
    getCustomerById();
  },[])

  return (
    <div className="customer-details-page">
      <div className="page-header">
        <Link to="/admin/customers" className="back-btn">
          <FiArrowLeft /> Back to Customers
        </Link>
      </div>
      
      <div className="customer-container">
        <div className="customer-profile">
          <div className="profile-header">
            <div className="avatar">
              {customer?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h2>{customer?.name || 'N/A'}</h2>
              <p>{customer?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-group">
              <h3>Contact Information</h3>
              <p><strong>Phone:</strong> {customer?.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {customer?.address || 'N/A'}</p>
            </div>
            
            <div className="detail-group">
              <h3>Account Information</h3>
              <p><strong>Joined:</strong> {new Date(customer?.joined).toLocaleString()}</p>
              <p><strong>Total Orders:</strong> {customer?.orders?.length || '0'}</p>
              <p><strong>Total Spent:</strong> ₹{customer?.totalSpent?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        
        {/* 1. List of Products Purchased */}
        <div className="purchased-products">
          <h3>📦 Purchased Products</h3>
          {customer?.purchasedProducts?.length > 0 ? (
            <div className="products-grid">
              {customer.purchasedProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-header">
                    <h4>{product.productName}</h4>
                    <span className="version-badge">{product.version?.replace('_', ' ')}</span>
                  </div>
                  
                  {/* 2. Invoice Details */}
                  <div className="invoice-section">
                    <h5>📄 Invoice Details</h5>
                    <div className="invoice-grid">
                      <div className="invoice-item">
                        <span>Order ID:</span>
                        <span>#{product.orderId}</span>
                      </div>
                      <div className="invoice-item">
                        <span>Purchase Date:</span>
                        <span>{new Date(product.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="invoice-item">
                        <span>Amount Paid:</span>
                        <span>₹{product.price?.toLocaleString()}</span>
                      </div>
                      <div className="invoice-item">
                        <span>Payment Type:</span>
                        <span>{product.paymentRenewal?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Next Renewal Details */}
                  {product.nextRenewalDate && (
                    <div className="renewal-section">
                      <h5>🔄 Renewal Information</h5>
                      <div className="renewal-info">
                        <div className="renewal-item">
                          <span>Next Renewal:</span>
                          <span className="renewal-date">{new Date(product.nextRenewalDate).toLocaleDateString()}</span>
                        </div>
                        <div className="renewal-item">
                          <span>Days Remaining:</span>
                          <span className="days-remaining">
                            {Math.ceil((new Date(product.nextRenewalDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                        <div className="renewal-item">
                          <span>Renewal Amount:</span>
                          <span>₹{product.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Version Upgrade Option */}
                  {product.upgradeOption && (
                    <div className="upgrade-section">
                      <h5>⬆️ Version Upgrade Available</h5>
                      <div className="upgrade-details">
                        <div className="upgrade-comparison">
                          <div className="current-version">
                            <span className="label">Current:</span>
                            <span className="version">{product.version?.replace('_', ' ')}</span>
                          </div>
                          <div className="arrow">→</div>
                          <div className="new-version">
                            <span className="label">Upgrade to:</span>
                            <span className="version">{product.upgradeOption.toVersion?.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="upgrade-pricing">
                          <div className="price-item">
                            <span>Current Price:</span>
                            <span>₹{product.price?.toLocaleString()}</span>
                          </div>
                          <div className="price-item">
                            <span>New Price:</span>
                            <span>₹{product.upgradeOption.newPrice?.toLocaleString()}</span>
                          </div>
                          <div className="price-item highlight">
                            <span>Additional Payment:</span>
                            <span>₹{product.upgradeOption.additionalCost?.toLocaleString()}</span>
                          </div>
                        </div>
                        <button className="upgrade-btn">
                          💳 Process Upgrade (₹{product.upgradeOption.additionalCost?.toLocaleString()})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No completed purchases found.</p>
            </div>
          )}
        </div>

        <div className="customer-orders">
          <h3>📋 Order History</h3>
          {customer?.orders?.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customer?.orders?.map(order => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/admin/orders/${order?.id}`} className="order-link">
                        #{order?.id}
                      </Link>
                    </td>
                    <td>{new Date(order?.date).toLocaleDateString()}</td>
                    <td>₹{order?.amount?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-summary">
                          {item.product?.name} ({item.version?.version?.replace('_', ' ') || 'N/A'})
                        </div>
                      ))}
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order?.id}`} className="view-btn">
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