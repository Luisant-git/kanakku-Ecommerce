import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

  if (false) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute