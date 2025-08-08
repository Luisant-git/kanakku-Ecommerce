import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__about">
            <Link to="/" className="footer__logo">
              <img src={Logo} alt="SHREE & SHRI ASSOCIATES" />
              <span>SHREE & SHRI ASSOCIATES</span>
            </Link>
            <p>
              New : No: 51/ Old No: 14-B, Mettu Agraharam Street, Salem - 636 001.
              <br />
              GSTN : 33ABZFS2715A1Z8
            </p>
          </div>

          <div className="footer__links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__contact">
            <h3>Contact Us</h3>
            <ul>
              <li>Email: info@shreeshri.com</li>
              <li>Phone: +91 9876543210</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} SHREE & SHRI ASSOCIATES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer