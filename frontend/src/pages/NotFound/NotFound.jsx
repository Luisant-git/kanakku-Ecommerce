import { Link } from 'react-router-dom'
import './NotFound.scss'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn--primary">Go to Home</Link>
      </div>
    </div>
  )
}

export default NotFound