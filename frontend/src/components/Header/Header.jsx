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
                  <div className="profile-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
