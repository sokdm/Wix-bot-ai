import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './stores/authStore'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated, isAdmin } = useAuthStore()

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login" />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
