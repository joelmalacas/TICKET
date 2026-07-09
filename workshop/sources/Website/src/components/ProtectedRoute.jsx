import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, session } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && session?.role !== 'ADMIN') return <Navigate to="/" replace />

  return children
}
