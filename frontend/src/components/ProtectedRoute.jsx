import { Navigate, Outlet } from 'react-router-dom'

// This component wraps all protected pages.
// If no token in localStorage, redirect to login.
function ProtectedRoute() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Outlet renders the actual child route (Dashboard, Income, etc.)
  return <Outlet />
}

export default ProtectedRoute
