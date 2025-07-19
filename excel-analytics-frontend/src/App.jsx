import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { store } from './store/store'
import { checkAuth } from './store/authSlice'
import LandingPage from './pages/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import './index.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

function AppContent() {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is already authenticated on app start
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(checkAuth())
    }
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
