import { Link } from 'react-router-dom'
import './Account.scss'
import { useState } from 'react'

const Account = () => {
  const [user, setUser] = useState('Naveen V');
  const [email, setEmail] = useState('naveen@example.com');
  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">My Account</h1>
        
        <div className="account-content">
          <div className="account-sidebar">
            <div className="account-welcome">
              <h3>Welcome, {user?.name || 'User'}!</h3>
              <p>Manage your account information and orders</p>
            </div>
            
            <nav className="account-nav">
              <ul>
                <li><Link to="/account">Dashboard</Link></li>
                <li><Link to="/account/orders">My Orders</Link></li>
                <li><Link to="/account/addresses">Addresses</Link></li>
                <li><Link to="/account/details">Account Details</Link></li>
                <li><button >Logout</button></li>
              </ul>
            </nav>
          </div>
          
          <div className="account-main">
            <div className="account-section">
              <h2>Account Dashboard</h2>
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <h3>Recent Orders</h3>
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/products" className="btn btn--primary">Shop Now</Link>
                </div>
                
                <div className="dashboard-card">
                  <h3>Account Information</h3>
                  <p>
                    <strong>Name:</strong> {user?.name}<br />
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <Link to="/account/details" className="btn btn--outline">Edit Details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account