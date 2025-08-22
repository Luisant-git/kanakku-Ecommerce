import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from '../../assets/kanakku.png'
import './Header.scss'
import { getCartCountApi } from '../../api/Cart'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { user, logout, isLogin } = useAuth()
  const navigate = useNavigate()

  const getCartCount = async () => {
    const response = await getCartCountApi();
    console.log(response);
    
    setCartCount(response?.count);
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/login')
    closeMenu()
    setShowLogoutModal(false)
  }

  useEffect(() => {
    getCartCount()
  }, [])

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Link to="/" className="header__logo" onClick={closeMenu}>
            <img src={Logo} alt="SHREE & SHRI ASSOCIATES" />
            {/* <span>SHREE & SHRI ASSOCIATES</span> */}
          </Link>

          <button 
            className="header__menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <nav className={`header__nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
              <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
              <li><Link to="/cart" style={{ padding: '10px 40px'}} className="cart-link" onClick={closeMenu}>Cart</Link></li>
              <li className="profile-dropdown">
                <button 
                  className="profile-btn" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="profile-icon">👤</span>
                  ▼
                </button>
                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <Link to="/account" onClick={closeMenu}>Profile</Link>
                    {isLogin() ? (
                      <button style={{color:'red'}} onClick={handleLogout}>Logout</button>
                    ) : (
                      <Link to="/login" onClick={closeMenu}>Login</Link>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowLogoutModal(false)} className="cancel-btn">Cancel</button>
              <button onClick={confirmLogout} className="confirm-btn">Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
