import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Smartphone, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const ConnectionStatus = ({ status, pairingCode, displayCode, phoneNumber }) => {
  const statuses = {
    disconnected: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'Disconnected'
    },
    connecting: {
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'Waiting for connection...'
    },
    connected: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'Connected'
    }
  }

  const currentStatus = statuses[status] || statuses.disconnected
  const Icon = currentStatus.icon

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-xl border ${currentStatus.border} ${currentStatus.bg}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${currentStatus.bg}`}>
          <Icon className={`w-6 h-6 ${currentStatus.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">WhatsApp Status</h3>
          <p className={`${currentStatus.color} font-medium`}>{currentStatus.text}</p>
        </div>
      </div>

      {/* Pairing Code Display */}
      {pairingCode && status === 'connecting' && (
        <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-primary-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-400 font-medium flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Your Pairing Code
            </span>
            <span className="text-xs text-gray-500">Enter in WhatsApp now</span>
          </div>
          
          {/* Display code with dashes - BIG */}
          <div className="text-center mb-4">
            <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-widest bg-dark-900 py-4 rounded-lg border-2 border-primary-500/50">
              {displayCode || pairingCode}
            </div>
          </div>

          {/* Copy buttons */}
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(pairingCode)
                toast.success('Code copied!')
              }}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>How to use:</strong>
            </p>
            <ol className="text-sm text-gray-300 mt-2 space-y-1 list-decimal list-inside">
              <li>Open WhatsApp on your phone</li>
              <li>Tap ⋮ → Settings → Linked Devices</li>
              <li>Tap <strong>"Link with phone number"</strong></li>
              <li>Select your country (Nigeria +234)</li>
              <li>Enter: <strong>{phoneNumber?.replace('+234 ', '')}</strong></li>
              <li>Enter the code above exactly as shown</li>
            </ol>
          </div>
        </div>
      )}

      {phoneNumber && status === 'connected' && (
        <div className="mt-4 text-sm text-gray-400">
          Connected to: <span className="text-white font-medium">{phoneNumber}</span>
        </div>
      )}
    </motion.div>
  )
}

export default ConnectionStatus
