import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import './Auth.scss'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate('/account')
    } catch (error) {
      // Error is already handled in the context
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Login</h1>
          
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
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn--primary btn--block">
              Login
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
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