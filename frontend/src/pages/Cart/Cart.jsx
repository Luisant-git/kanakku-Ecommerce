import { Link } from 'react-router-dom'
import './Cart.scss'

// Temporary data - replace with state management
const cartItems = [
  {
    id: 1,
    name: 'Premium Accounting Software',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=100&q=80',
    quantity: 1
  },
  {
    id: 2,
    name: 'Business Tax Guide',
    price: 999,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=100&q=80',
    quantity: 2
  }
]

const Cart = () => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn--primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <span className="cart-item__price">₹{item.price.toLocaleString()}</span>
                  </div>
                  <div className="cart-item__quantity">
                    <input type="number" min="1" value={item.quantity} readOnly />
                  </div>
                  <div className="cart-item__total">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button className="cart-item__remove">×</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn btn--primary btn--block">Proceed to Checkout</Link>
              <Link to="/products" className="btn btn--outline btn--block">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart