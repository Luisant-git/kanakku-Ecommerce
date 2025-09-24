import { Navigate } from 'react-router-dom';
import { isValidAdminToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  return isValidAdminToken() ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;