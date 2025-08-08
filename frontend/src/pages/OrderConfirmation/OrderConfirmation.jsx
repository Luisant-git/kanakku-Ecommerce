import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../../App'
import './OrderConfirmation.scss'

const OrderConfirmation = () => {
  const { clearCart } = useContext(CartContext)

  // Clear cart when order is confirmed
  clearCart()

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been received and is being processed.</p>
          <p>We've sent a confirmation email with your order details.</p>
          <div className="confirmation-actions">
            <Link to="/" className="btn btn--primary">Continue Shopping</Link>
            <Link to="/account/orders" className="btn btn--outline">View Order Details</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation