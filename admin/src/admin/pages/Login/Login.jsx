import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.scss'
import { loginApi } from '../../api/Login'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      loginApi({ email, password })
        .then((data) => {
          if (data && data.token) {
            console.log(data);
            localStorage.setItem('token', data.token)
            toast.success('Login successful')
            navigate('/admin')
          } else {
            setError('Invalid credentials')
          }
        })
        .catch((err) => {
          setError('Invalid credentials')
        })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Kanakku Admin</h1>
          <p>Sign in to your dashboard</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default Login