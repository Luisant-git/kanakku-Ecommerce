import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from '../../assets/kanakku.png'
import './Header.scss'
import { getCartCountApi } from '../../api/Cart'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const getCartCount = async () => {
    const response = await getCartCountApi();
    console.log(response);
    
    setCartCount(response.count);
  }

  const closeMenu = () => setIsMenuOpen(false)

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
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
