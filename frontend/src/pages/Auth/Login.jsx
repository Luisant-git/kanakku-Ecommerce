import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.scss'
import { sendOtpApi, verifyOtpApi, otpLoginApi } from '../../api/Auth'

const Login = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone', 'otp', 'complete'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await sendOtpApi({ phone })
      if (response && response.message) {
        setMessage('OTP sent to your WhatsApp')
        setStep('otp')
      } else {
        setError(response?.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await otpLoginApi({ phone, otp })
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        setMessage('Login successful!')
        setTimeout(() => navigate('/'), 1000)
      } else if (response && (response.requiresRegistration || response.message === 'Please complete registration first')) {
        // User needs to complete registration
        navigate('/register', { state: { phone, verified: true } })
      } else {
        setError(response?.message || 'Invalid or expired OTP')
      }
    } catch (error) {
      setError('Invalid or expired OTP')
    }
    setLoading(false)
  }



  const handleResendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await sendOtpApi({ phone })
      if (response && response.message) {
        setMessage('OTP resent to your WhatsApp')
      } else {
        setError('Failed to resend OTP')
      }
    } catch (error) {
      setError('Failed to resend OTP')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Login</h1>
          
          {error && (
            <div className="message error">
              {error}
            </div>
          )}
          
          {message && (
            <div className="message success">
              {message}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number with country code"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP via WhatsApp'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <small>OTP sent to {phone}</small>
              </div>
              
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP & Login'}
              </button>
              
              <div className="otp-resend">
                <button 
                  type="button" 
                  className="btn btn--link" 
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
          
          <div className="auth-links">
            <p>
              <Link to="/forgot-password">Forgot password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login