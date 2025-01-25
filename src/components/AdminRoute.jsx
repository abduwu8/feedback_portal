import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminRoute() {
  const { user } = useSelector((state) => state.auth);

  // If not logged in or not an admin, redirect to home page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If admin, render child routes
  return <Outlet />;
}

export default AdminRoute; 