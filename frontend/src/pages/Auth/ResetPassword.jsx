import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './Auth.scss'
import { resetPasswordApi } from '../../api/Auth'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await resetPasswordApi({ token, password })
      setMessage('Password reset successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setMessage('Failed to reset password. Please try again.')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-card">
            <h1>Invalid Reset Link</h1>
            <p>This reset link is invalid or has expired.</p>
            <Link to="/forgot-password">Request new reset link</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Reset Password</h1>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword