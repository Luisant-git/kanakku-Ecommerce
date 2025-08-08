import { useState } from 'react'
import './Checkout.scss'

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'credit-card'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process checkout
    console.log('Checkout submitted:', formData)
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input 
                  type="text" 
                  id="zip" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="credit-card" 
                  checked={formData.paymentMethod === 'credit-card'} 
                  onChange={handleChange} 
                />
                <span>Credit Card</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="debit-card" 
                  checked={formData.paymentMethod === 'debit-card'} 
                  onChange={handleChange} 
                />
                <span>Debit Card</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="net-banking" 
                  checked={formData.paymentMethod === 'net-banking'} 
                  onChange={handleChange} 
                />
                <span>Net Banking</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi" 
                  checked={formData.paymentMethod === 'upi'} 
                  onChange={handleChange} 
                />
                <span>UPI</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'} 
                  onChange={handleChange} 
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button type="submit" className="btn btn--primary btn--block">Place Order</button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              <div className="summary-item">
                <span>Premium Accounting Software × 1</span>
                <span>₹4,999</span>
              </div>
              <div className="summary-item">
                <span>Business Tax Guide × 2</span>
                <span>₹1,998</span>
              </div>
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹6,997</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹1,259.46</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹8,256.46</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout