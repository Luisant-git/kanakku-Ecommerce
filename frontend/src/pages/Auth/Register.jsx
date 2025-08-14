import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.scss'
import { userRegisterApi } from '../../api/Auth'

const Register = () => {
  // const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userRegisterApi({ email, password })
      if (response && response.token) {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Register</h1>
          
          <form onSubmit={handleSubmit}>
            {/* <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div> */}
            
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
              Register
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register