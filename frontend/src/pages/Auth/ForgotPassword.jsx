import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.scss'
import { forgotPasswordApi } from '../../api/Auth'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await forgotPasswordApi({ email })
      setMessage('Password reset email sent successfully. Please check your email.')
    } catch (error) {
      setMessage('Failed to send reset email. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Forgot Password</h1>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword