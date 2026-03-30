import { Link, useNavigate } from 'react-router-dom'
import { Bot, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'

const Navbar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              Wix Bot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              </>
            )}
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {!isAdmin && (
                <>
                  <Link to="/" className="block py-2 text-gray-300 hover:text-white">Home</Link>
                  <Link to="/#features" className="block py-2 text-gray-300 hover:text-white">Features</Link>
                </>
              )}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
