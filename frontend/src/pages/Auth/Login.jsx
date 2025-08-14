import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.scss'
import { userLoginApi } from '../../api/Auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userLoginApi({ email, password })
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        navigate('/')
      } else {
        console.error('Login failed:', response.message)
      }
    } catch (error) {
      console.error('Login failed:', error.message)
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