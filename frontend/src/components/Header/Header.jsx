import { Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../../assets/kanakku.png'
import './Header.scss'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

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
              <li><Link to="/cart" className="cart-link" onClick={closeMenu}>Cart (0)</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
