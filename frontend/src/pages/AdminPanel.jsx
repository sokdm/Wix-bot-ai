import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Activity, 
  MessageSquare, 
  Command,
  Trash2,
  Power,
  RefreshCw,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data.data.stats)
      setUsers(res.data.data.recentUsers)
      setSessions(res.data.data.recentSessions)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data.data)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessions(res.data.data)
    } catch (err) {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const stopSession = async (sessionId) => {
    try {
      await axios.post(`${API_URL}/admin/stop-session`, { sessionId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Session stopped')
      fetchSessions()
    } catch (err) {
      toast.error('Failed to stop session')
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('User deleted')
      fetchUsers()
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'users') fetchUsers()
    if (tab === 'sessions') fetchSessions()
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <Navbar isAdmin={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse" />
            Admin Panel
          </h1>
          <p className="text-gray-400">System management and monitoring</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: Power },
            { id: 'logs', label: 'Logs', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-xl"
            >
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              <div className="text-gray-400">Total Users</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-xl"
            >
              <Power className="w-8 h-8 text-green-500 mb-4" />
              <div className="text-3xl font-bold text-white">{stats.activeSessions}</div>
              <div className="text-gray-400">Active Sessions</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-xl"
            >
              <MessageSquare className="w-8 h-8 text-purple-500 mb-4" />
              <div className="text-3xl font-bold text-white">{stats.totalMessages}</div>
              <div className="text-gray-400">Total Messages</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl"
            >
              <Command className="w-8 h-8 text-orange-500 mb-4" />
              <div className="text-3xl font-bold text-white">{stats.totalCommands}</div>
              <div className="text-gray-400">Commands Used</div>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">All Users</h3>
              <button onClick={fetchUsers} className="text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-t border-white/10">
                      <td className="p-4 text-white">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
              <button onClick={fetchSessions} className="text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">User</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Messages</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(session => (
                    <tr key={session._id} className="border-t border-white/10">
                      <td className="p-4 text-white">{session.userId?.email || 'Unknown'}</td>
                      <td className="p-4 text-gray-400">{session.phoneNumber}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          session.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{session.messagesCount}</td>
                      <td className="p-4">
                        {session.isActive && (
                          <button
                            onClick={() => stopSession(session.sessionId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
