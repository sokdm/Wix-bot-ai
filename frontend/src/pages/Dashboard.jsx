import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  MessageSquare, 
  Command, 
  Settings, 
  LogOut,
  Copy,
  Check,
  Power,
  Bot
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ConnectionStatus from '../components/ConnectionStatus'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('connection')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [pairingCode, setPairingCode] = useState(null)
  const [displayCode, setDisplayCode] = useState(null)  // ADD THIS LINE
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+234')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ messages: 0, commands: 0 })
  const [autoReply, setAutoReply] = useState(false)
  const { token, user, logout } = useAuthStore()

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/whatsapp/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.data.connected) {
        setConnectionStatus('connected')
        setPhoneNumber(res.data.data.phoneNumber)
      }
    } catch (err) {
      console.error('Status check failed:', err)
    }
  }

  const handleConnect = async (e) => {
    e.preventDefault()
    if (!phoneNumber) {
      toast.error('Please enter your phone number')
      return
    }

    setLoading(true)
    setConnectionStatus('connecting')

    try {
      const res = await axios.post(`${API_URL}/whatsapp/connect`, {
        phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
        countryCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // STORE BOTH CODES
      setPairingCode(res.data.data.pairingCode)
      setDisplayCode(res.data.data.displayCode)  // ADD THIS LINE

      toast.success('Pairing code generated!')
      
      // Poll for connection status
      const checkInterval = setInterval(async () => {
        try {
          const statusRes = await axios.get(`${API_URL}/whatsapp/status`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (statusRes.data.data.connected) {
            clearInterval(checkInterval)
            setConnectionStatus('connected')
            setPairingCode(null)
            setDisplayCode(null)  // ADD THIS LINE
            toast.success('WhatsApp connected successfully!')
          }
        } catch (err) {
          console.error('Connection check failed:', err)
        }
      }, 3000)

      setTimeout(() => clearInterval(checkInterval), 120000)

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate pairing code')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await axios.post(`${API_URL}/whatsapp/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConnectionStatus('disconnected')
      setPairingCode(null)
      setDisplayCode(null)  // ADD THIS LINE
      toast.success('Disconnected successfully')
    } catch (err) {
      toast.error('Failed to disconnect')
    }
  }

  const toggleAutoReply = async () => {
    try {
      const newState = !autoReply
      await axios.post(`${API_URL}/whatsapp/autoreply`, { enabled: newState }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAutoReply(newState)
      toast.success(`Auto-reply ${newState ? 'enabled' : 'disabled'}`)
    } catch (err) {
      toast.error('Failed to toggle auto-reply')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const commandsList = [
    { category: 'General', commands: ['menu', 'ping', 'alive', 'uptime', 'info'] },
    { category: 'AI', commands: ['ai', 'ask', 'chat', 'summarize', 'rewrite'] },
    { category: 'Group', commands: ['tagall', 'hidetag', 'kick', 'add', 'promote'] },
    { category: 'Media', commands: ['sticker', 'toimg', 'tomp3', 'vv', 'save'] },
    { category: 'Fun', commands: ['joke', 'meme', 'quote', 'trivia', '8ball'] },
    { category: 'Tools', commands: ['qr', 'short', 'calc', 'weather', 'password'] }
  ]

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your WhatsApp bot settings and connection</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'connection', label: 'Connection', icon: Smartphone },
            { id: 'commands', label: 'Commands', icon: Command },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Connection Tab */}
        {activeTab === 'connection' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <ConnectionStatus 
                status={connectionStatus} 
                pairingCode={pairingCode}
                displayCode={displayCode}  // ADD THIS LINE
                phoneNumber={phoneNumber}
              />

              {connectionStatus !== 'connected' && (
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Connect WhatsApp</h3>
                  <form onSubmit={handleConnect} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country Code
                      </label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="input-field"
                      >
                        <option value="+234">🇳🇬 +234 (Nigeria)</option>
                        <option value="+1">🇺🇸 +1 (USA)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+91">🇮🇳 +91 (India)</option>
                        <option value="+254">🇰🇪 +254 (Kenya)</option>
                        <option value="+27">🇿🇦 +27 (South Africa)</option>
                        <option value="+61">🇦🇺 +61 (Australia)</option>
                        <option value="+81">🇯🇵 +81 (Japan)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="input-field"
                        placeholder="8050232564 (without +234)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter without country code and without leading 0</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Generate Pairing Code</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {connectionStatus === 'connected' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass p-6 rounded-xl border-red-500/30 bg-red-500/10"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <button
                    onClick={handleDisconnect}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Power className="w-4 h-4" />
                    <span>Disconnect WhatsApp</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary-500" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">{stats.messages}</div>
                    <div className="text-sm text-gray-400">Messages</div>
                  </div>
                  <div className="bg-dark-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">{stats.commands}</div>
                    <div className="text-sm text-gray-400">Commands</div>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">How to Connect</h3>
                <ol className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">1</span>
                    Enter your phone number (e.g., 8050232564)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">2</span>
                    Click "Generate Pairing Code"
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">3</span>
                    Open WhatsApp → Settings → Linked Devices
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">4</span>
                    Tap "Link with phone number"
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">5</span>
                    Select Nigeria (+234) and enter your number
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">6</span>
                    Enter the 8-character pairing code shown
                  </li>
                </ol>
              </div>
            </motion.div>
          </div>
        )}

        {/* Commands Tab */}
        {activeTab === 'commands' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {commandsList.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Command className="w-5 h-5 mr-2 text-primary-500" />
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.commands.map(cmd => (
                    <div 
                      key={cmd}
                      className="flex items-center justify-between bg-dark-800 p-2 rounded-lg group cursor-pointer hover:bg-dark-700 transition-colors"
                      onClick={() => copyToClipboard(`.${cmd}`)}
                    >
                      <code className="text-primary-400">.{cmd}</code>
                      <Copy className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            
            <div className="glass p-6 rounded-xl md:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">All Commands</h3>
                <span className="text-sm text-gray-400">Total: 61 commands</span>
              </div>
              <p className="text-gray-400 text-sm">
                Use the prefix <code className="text-primary-400">.</code> before each command. 
                For example: <code className="text-primary-400">.menu</code> or <code className="text-primary-400">.ai hello</code>
              </p>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <div className="glass p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-6">Bot Settings</h3>
              
              <div className="flex items-center justify-between py-4 border-b border-white/10">
                <div>
                  <h4 className="font-medium text-white">Auto-Reply</h4>
                  <p className="text-sm text-gray-400">Automatically respond when unavailable</p>
                </div>
                <button
                  onClick={toggleAutoReply}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    autoReply ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    autoReply ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/10">
                <div>
                  <h4 className="font-medium text-white">Command Prefix</h4>
                  <p className="text-sm text-gray-400">Current: <code className="text-primary-400">.</code></p>
                </div>
                <span className="text-sm text-gray-500">Use .setprefix in WhatsApp to change</span>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border-red-500/30 bg-red-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
              <button
                onClick={() => {
                  logout()
                  window.location.href = '/'
                }}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
