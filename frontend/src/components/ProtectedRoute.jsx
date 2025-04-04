import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, roleRequired }) => {
  const userRole = Cookies.get('userRole');

  console.log('Current userRole:', userRole);
  console.log('Required role:', roleRequired);

  if (userRole !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 